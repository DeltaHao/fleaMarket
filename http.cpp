//
// Created by haozl on 2019/12/2.
//
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <fstream>
#include <json/json.h>
#include "mysql.h"
using namespace std;

vector<string> split(string &s, const char flag){
    vector<string> ret;
    istringstream iss(s);
    string tmp;

    while(getline(iss, tmp, flag)){
        ret.push_back(tmp);
    }
    return ret;
}

string GETMethodResponse(string &filepath){
    ifstream infile;
    if (filepath.empty()) infile.open("status/index.html", ios::in);
    else infile.open("status"+filepath, ios::in);//打开文件
    if(!infile){
        infile.close();
        cout<<"open " << filepath << " error!"<<endl;
        string httpHeader = "HTTP/1.1 404 Not Found\r\n";//响应报文头
        httpHeader += "\r\n";
        string httpData = "<h1>404 not found</h1>";//报文内容
        return httpHeader + httpData;
    }
    else{
        string httpHeader = "HTTP/1.1 200 OK\r\n";//响应报文头
        httpHeader += "\r\n";
        ostringstream tmp;
        tmp << infile.rdbuf();
        string httpData = tmp.str();//报文内容
        infile.close();
        return httpHeader + httpData;
    }
}
string POSTMethodResponse(string &JsonString){
    //cout << JsonString <<endl;
    Json::Reader reader;
    Json::Value recvJsonValue;
    reader.parse(JsonString, recvJsonValue);

    auto * qMysql = new Mysql();
    qMysql->connect();
    if(recvJsonValue["op"] == "Register_auth"){
        string U_id = recvJsonValue["QQ"].toStyledString();
        string U_name = recvJsonValue["Username"].toStyledString();
        string U_password = recvJsonValue["password1"].toStyledString();
        string U_info = recvJsonValue["Username"].toStyledString();
        JsonString = qMysql->Register_auth(U_id,U_name,U_password,U_info);
    }
    if(recvJsonValue["op"] == "Login_auth"){
        string U_id = recvJsonValue["QQ"].toStyledString();
        string U_password = recvJsonValue["password"].toStyledString();
    }

    //cout << "sendJson:" << JsonString << endl;

    string httpHeader = "HTTP/1.1 200 OK\r\n";//响应报文头
    httpHeader += "\r\n";
    string httpData = JsonString;
    return httpHeader + httpData;
}
string getResponseMessage(string &requestMessage){

    vector<string> strings = split(requestMessage, ' ');
    if(strings[0] == "GET"){
        return GETMethodResponse(strings[1]);
    }
    if(strings[0] == "POST"){
        strings = split(strings[strings.size()-1], '{');
        string str = "{"+strings[strings.size()-1];
        return POSTMethodResponse(str);
    }
}

