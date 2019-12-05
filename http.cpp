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
    if (filepath=="/") infile.open("status/index.html", ios::in);//默认打开index.html
    else infile.open("status"+filepath, ios::in);//打开文件
    if(!infile){//如果文件有误
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
    Json::Reader reader;
    Json::Value recvJsonValue;
    reader.parse(JsonString, recvJsonValue);
    //连接数据库
    auto * qMysql = new Mysql();
    qMysql->connect();
    if(recvJsonValue["op"] == "Register_auth"){
        string U_id = recvJsonValue["QQ"].toStyledString();
        string U_name = recvJsonValue["Username"].toStyledString();
        string U_password = recvJsonValue["password1"].toStyledString();
        string U_info = recvJsonValue["Username"].toStyledString();


        string sqlStr = "insert into User values(" + U_id +","+U_name+","+U_password+","+U_info+");";
        if(!qMysql->execute(sqlStr)) JsonString =  "{return:false}";
        else JsonString =  "{return:true}";
    }
    if(recvJsonValue["op"] == "Login_auth"){
        string U_id = recvJsonValue["QQ"].toStyledString();
        string U_password = recvJsonValue["Password"].toStyledString();

        string sqlStr = "set @return=1;";
        qMysql->execute(sqlStr);
        sqlStr = "call VerifyUser(@return,"+ U_id +","+U_password+");";
        qMysql->execute(sqlStr);
        JsonString = qMysql->query("select @return");
    }
    if(recvJsonValue["op"] == "query_SG"){
        JsonString = qMysql->query("select count(*) as count from Salegood;");
        JsonString += qMysql->query("select * from Salegood;");
    }
    if(recvJsonValue["op"] == "query_WG"){
        JsonString = qMysql->query("select count(*) as count from Wantedgood;");
        JsonString += qMysql->query("select * from Wantedgood;");
    }
    if(recvJsonValue["op"] == "sg_publish"){
        string U_id = recvJsonValue["QQ"].toStyledString();//缺少用户QQ需要前端传过来
        string SG_name = recvJsonValue["goodname"].toStyledString();
        string SG_info = recvJsonValue["goodinfo"].toStyledString();
        string SG_price = recvJsonValue["price"].toStyledString();
        string SG_type = recvJsonValue["type"].toStyledString();
        string SG_image = recvJsonValue["image"].toStyledString();

        string sqlStr = "insert into Salegood(SG_name, SG_info, SG_price, SG_type, image, U_id) values("
                        + SG_name + "," + SG_info +"," + SG_price + "," +SG_type+","+SG_image + "," + U_id +");";
        cout << sqlStr << endl;
        if(!qMysql->execute(sqlStr)) JsonString =  "{return:false}";
        else JsonString =  "{return:true}";
    }
    if(recvJsonValue["op"] == "wg_publish"){
        string U_id = recvJsonValue["QQ"].toStyledString();//用户QQ
        string WG_name = recvJsonValue["goodname"].toStyledString();
        string WG_info = recvJsonValue["goodinfo"].toStyledString();
        string WG_type = recvJsonValue["type"].toStyledString();

        string sqlStr = "insert into Wangtedgood(WG_name, WG_info, WG_type, U_id) values("
                        + WG_name + "," + WG_info +"," + WG_type + "," + U_id +");";
        cout << sqlStr << endl;
        if(!qMysql->execute(sqlStr)) JsonString =  "{return:false}";
        else JsonString =  "{return:true}";
    }
    if(recvJsonValue["op"] == "SG_response"){//响应别人发布的物品
        string U_id = recvJsonValue["QQ"].toStyledString();//用户QQ
        string SG_id = recvJsonValue["goodID"].toStyledString();//商品id

        string sqlStr = "insert into SG_response values("
                        + U_id + "," + SG_id + ",NOW());";
        cout << sqlStr << endl;
        if(!qMysql->execute(sqlStr)) JsonString =  "{return:false}";
        else JsonString =  "{return:true}";
    }
    if(recvJsonValue["op"] == "WG_response"){//响应别人发布的物品
        string U_id = recvJsonValue["QQ"].toStyledString();//用户QQ
        string WG_id = recvJsonValue["goodID"].toStyledString();//商品id

        string sqlStr = "insert into WG_response values("
                        + U_id + "," + WG_id + ",NOW());";
        cout << sqlStr << endl;
        if(!qMysql->execute(sqlStr)) JsonString =  "{return:false}";
        else JsonString =  "{return:true}";
    }
    if(recvJsonValue["op"] == "get_SG_response_Users"){//获得响应某物品的所有用户
        string SG_id = recvJsonValue["goodID"].toStyledString();

        string sqlStr = "select * from User inner join SG_response where SG_id="+SG_id+";";
        cout <<sqlStr<<endl;
        JsonString = qMysql->query(sqlStr);
    }
    if(recvJsonValue["op"] == "get_WG_response_Users"){//获得响应某物品的所有用户
        string WG_id = recvJsonValue["goodID"].toStyledString();

        string sqlStr = "select * from User inner join WG_response where WG_id="+WG_id+";";
        cout <<sqlStr<<endl;
        JsonString = qMysql->query(sqlStr);
    }
    if(recvJsonValue["op"] == "search_User_by_id"){//获得响应某物品的所有用户
        string U_id = recvJsonValue["QQ"].toStyledString();

        string sqlStr = "select * from User where U_id ="+U_id+";";
        cout <<sqlStr<<endl;
        JsonString = qMysql->query(sqlStr);
    }

    //组装响应报文
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

