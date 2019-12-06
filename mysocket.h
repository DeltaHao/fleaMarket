//
// Created by haozl on 2019/12/2.
//


#ifndef HTTPSERVER_MYSOCKET_H
#define HTTPSERVER_MYSOCKET_H

#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <iostream>

#define SER_PORT (12000)

class Socket{
public:
    sockaddr_in addr;//地址
    int fd;//文件描述符

    //返回字符串 :"ip:端口号"
    std::string getAddr(){
        char* ip = inet_ntoa(this->addr.sin_addr);
        std::string port = ":" + std::to_string(ntohs(this->addr.sin_port));
        return ip + port;
    }
    ~ Socket(){
        close(this->fd);
    }
};

class ListenSocket:public Socket{
public:
    //创建绑定监听三合一
    ListenSocket(uint32_t ip, int port, int listenNumber) : Socket(){
        //初始化文件描述符
        this->fd = socket(AF_INET, SOCK_STREAM, 0);
        //初始化地址
        this->addr.sin_family = AF_INET;
        this->addr.sin_addr.s_addr = htonl(ip);
        this->addr.sin_port = htons(port);
        //绑定
        bind(this->fd,(sockaddr*)&this->addr, sizeof(this->addr));
        //开始监听
        listen(this->fd,listenNumber);
        std::cout<<"正在监听"<<std::endl;
        //设置端口复用
        int opt = 1;
        setsockopt(this->fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    }
};

class ConnectSocket:public Socket{
public:
    //构造函数：需要指定由哪个监听套接字 accept，构造时会进入停滞状态等待客户端连接
    //关于explicit的知识：https://blog.csdn.net/K346K346/article/details/82779248
    explicit ConnectSocket(ListenSocket* &pServer) : Socket(){
        socklen_t addr_len = sizeof(this->addr);
        this->fd = accept(pServer->fd, (sockaddr *)&this->addr, &addr_len);
    }
    //接收函数，返回客户端发来的消息， 没有消息时会停滞， 客户端退出时返回空字符串
    std::string receive(){
        while(true){
            char recvBuf[1024];
            int r = read(this->fd, recvBuf, sizeof(recvBuf));
            if(r == 0){
                return "";
            }
            return recvBuf;
        }
    }
    //发送函数
    void send(const std::string &message){
        write(this->fd, message.c_str(), message.length());
    }
};

std::string Receive(int fd){
    char recvBuf[1024*1024];
    int r = read(fd, recvBuf, sizeof(recvBuf));
    if(r == 0){
        return "";
    }
    return recvBuf;
}
void Send(std::string message, int fd){
    write(fd, message.c_str(), message.length());
}

#endif //HTTPSERVER_MYSOCKET_H
