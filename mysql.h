//
// Created by haozl on 2019/12/3.
//

#include <iostream>
#include <mysql/mysql.h>
#include <vector>
#include <json/json.h>
using namespace std;

class Mysql{
public:
    MYSQL* p;
    Mysql(){
        this->p = mysql_init(nullptr);
    }
    bool connect(const char* host="localhost", const char* user="haozl",
                 const char* password="123456", const char* database="test"){
        this->p = mysql_real_connect(this->p, host, user, password, database, 3306, nullptr, 0);
        return this->p != nullptr;
    }
    bool execute(string &SqlSentence){
        char* str = const_cast<char*> (SqlSentence.c_str());
        if(mysql_query(this->p, str)){
            cout<<"mysql error:"<<mysql_error(this->p)<<endl;
            return false;
        }
        return true;
    }
    string query(string &SqlSentence){
        string ret;
        char* str = const_cast<char*> (SqlSentence.c_str());
        if(mysql_query(this->p, str)){
            cout<<"mysql error:"<<mysql_error(this->p)<<endl;
            return ret;
        }
        MYSQL_RES *pRes = mysql_store_result(this->p);
        MYSQL_ROW sqlRow;
        MYSQL_FIELD *fields = mysql_fetch_fields(pRes);
        if(pRes){
            sqlRow = mysql_fetch_row(pRes);
            while(sqlRow){
                Json::Value jsonValue;
                Json::FastWriter jsonWriter;
                string jsonString;
                int i=0;
                while(i < mysql_field_count(this->p)){
                    jsonValue[fields[i].name] = sqlRow[i];
                    i++;
                }
                jsonString = jsonWriter.write(jsonValue);
                ret+=jsonString;
                sqlRow = mysql_fetch_row(pRes);
            }
        }
        return ret;
    }
    ~ Mysql(){
        mysql_close(this->p);
    }
};