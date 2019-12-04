//
// Created by haozl on 2019/12/2.
//
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <fstream>
#include <json/json.h>

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
    infile.open("status"+filepath, ios::in);//打开文件
    if(!infile){
        cout<<"open" << filepath << "error!"<<endl;
    }

    string httpHeader = "HTTP/1.1 200 OK\r\n";//响应报文头
    httpHeader += "\r\n";
    ostringstream tmp;
    tmp << infile.rdbuf();
    string httpData = tmp.str();//报文内容
    infile.close();
    return httpHeader + httpData;
}
string POSTMethodResponse(string &JsonString){
    cout << JsonString <<endl;
    Json::Reader reader;
    Json::Value recvJsonValue;
    reader.parse(JsonString, recvJsonValue);
    if(recvJsonValue["op"] == "Register_auth"){

        JsonString ="";
    }


    cout << "sendJson:" << JsonString << endl;

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
        strings = split(strings[strings.size()-1], '\n');
        return POSTMethodResponse(strings[strings.size()-1]);
    }
}

