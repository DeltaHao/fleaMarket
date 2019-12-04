//
// Created by haozl on 2019/12/2.
//
#include <iostream>
#include "epoll.h"
#include "mysocket.h"

#define MAX_CLIENT_NUM 128

using namespace std;


string getResponseMessage(string &s);
int main(){
    //实例化listen套接字和监视器， 将listen套接字加入监听
    auto * pServer = new ListenSocket(INADDR_ANY, SER_PORT, MAX_CLIENT_NUM);
    auto * monitor = new ePollMonitor();
    monitor->add(pServer->fd);

    while(true){//逐帧监听
        int todoNum = monitor->wait(-1);
        if(todoNum < 0){
            cout<<"epoll 错误"<<endl;
            return -1;
        }
        if(todoNum > 0){//如果监听到事件发生
            for(int i=0; i<MAX_CLIENT_NUM; i++){//遍历监听集合
                if(monitor->Set[i].events != EPOLLIN)//如果不是读入事件 跳过
                    continue;

                if(monitor->Set[i].data.fd == pServer->fd){
                    //如果从listen套接字监听到事件， 说明有客户端连接
                    auto * pClient = new ConnectSocket(pServer);
                    cout <<pClient->getAddr()<<endl;
                    monitor->add(pClient->fd);//将新的connect套接字加入监听

                    todoNum--;//未完成事件减一
                    if(!todoNum) break;//如果事件全部处理完成， 跳出处理下一帧
                }
                else{//如果从其他套接字监听到事件， 说明有客户端发来请求
                    string recvMessage = Receive(monitor->Set[i].data.fd);
                    if(recvMessage.empty()){
                        monitor->drop(i);//将该connect套接字移出监听
                        cout << "连接中断" << endl;
                        continue;
                    }

                    //解析http请求报文
                    string sendMessage = getResponseMessage(recvMessage);
                    cout<<sendMessage<<endl;
                    Send(sendMessage, monitor->Set[i].data.fd);

                    close(monitor->Set[i].data.fd);

                    todoNum--;//未完成事件减一
                    if(!todoNum) break;//如果事件全部处理完成， 跳出处理下一帧
                }
            }
        }
    }
}
