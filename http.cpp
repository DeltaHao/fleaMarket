//
// Created by haozl on 2019/12/2.
//
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <fstream>

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



string getResponseMessage(string &s){
    vector<string> strings = split(s, ' ');
    string filepath = strings[1];//从请求报文中获取文件路径
    ifstream infile;
    infile.open("status"+filepath, ios::in);//打开文件
    if(!infile){
        cout<<"open" << filepath << "error!"<<endl;
    }

    string httpHeader = "HTTP/1.1 200 OK\r\n";//响应报文头
    strings = split(filepath, '.');

    httpHeader += "\r\n";
    ostringstream tmp;
    tmp << infile.rdbuf();
    string httpData = tmp.str();//报文内容
    return httpHeader + httpData;
}