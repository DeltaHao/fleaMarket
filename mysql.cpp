//
// Created by haozl on 2019/12/3.
//
#include <mysql/mysql.h>
#include "mysql.h"

bool Mysql::connect(const char * host, const char * user, const char * password, const char * database) {
    this->p = mysql_real_connect(this->p, host, user, password, database, 3306, nullptr, 0);
    return this->p != nullptr;
}

bool Mysql::execute(const string &SqlSentence) {
    char* str = const_cast<char*> (SqlSentence.c_str());
    if(mysql_query(this->p, str)){
        cout<<"mysql error:"<<mysql_error(this->p)<<endl;
        return false;
    }
    return true;
}

string Mysql::query(const string & SqlSentence) {
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

string Mysql::Register_auth(string &U_id,  string &U_name,
                             string &U_password,  string &U_info) {
    string sqlStr = "insert into User values(" + U_id +","+U_name+","+U_password+","+U_info+");";
    if(execute(sqlStr))
        return "{return:true}";
    else return "{return:false}";
}
string Mysql::Login_auth(string &U_id, string &U_password){

}