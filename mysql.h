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
    ~ Mysql(){
        mysql_close(this->p);
    }
    //连接
    bool connect(const char* host="localhost", const char* user="haozl",
                 const char* password="123456", const char* database="fleaMarket");
    //执行没有返回值（插入、建表）的sql语句
    bool execute(const string &SqlSentence);
    //执行有返回值的sql语句，返回值为Json string
    string query(const string &SqlSentence);
    //注册
    static string Register_auth( string &U_id,  string &U_name,
                          string &U_password,  string &U_info);

};
