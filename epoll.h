//
// Created by haozl on 2019/12/2.
//

#include <sys/epoll.h>
#include "mysocket.h"
#define MAX_CLIENT_NUM 128
class ePollMonitor{
public:
    int epfd;
    epoll_event Set[MAX_CLIENT_NUM]{};
    //构造函数, 创建epoll句柄， 并初始化监听集合
    ePollMonitor(){
        this->epfd = epoll_create(MAX_CLIENT_NUM);
        for(auto & item : this->Set){
            item.data.fd = -1;
        }
    }
    //将某个套接字加入监听集合
    void add(int fd){
        epoll_event tmp{};
        tmp.events = EPOLLIN;
        tmp.data.fd = fd;
        epoll_ctl(this->epfd, EPOLL_CTL_ADD, fd, &tmp);
    }
    //将某个套接字从监听集合中删除
    void drop(int index){
        close(this->Set[index].data.fd);
        epoll_ctl(this->epfd, EPOLL_CTL_DEL, this->Set[index].data.fd, nullptr);
    }
    //阻塞监听， 返回监听到的事件个数
    int wait(int timeout){
        return epoll_wait(this->epfd, this->Set, MAX_CLIENT_NUM, timeout);
    }
};
