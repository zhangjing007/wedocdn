## 一、购买节点
在控制台中找到“隧道列表”---“购买服务”，选择一个节点或多个节点，点击购买
![](https://wdyz.gitee.io/docs/myimgs/imgs-in-nps/3.png)

## 二、新增隧道
在控制台中找到“隧道列表”---“我的隧道”，选择一个节点，点击“新增”按钮，添加一个隧道。然后根据自己的实际情况填写即可。
![](https://wdyz.gitee.io/docs/myimgs/imgs-in-nps/4.png)

## 三、下载客户端
去官网首页下载对应软件
![](https://wdyz.gitee.io/docs/myimgs/imgs-in-nps/1.png)

## 四、启动
### 4.1 获取启动命令
去官网登陆，在控制面板中找到“隧道列表”---“启动命令”获取启动命令
![](https://wdyz.gitee.io/docs/myimgs/imgs-in-nps/2.png)
### 4.2 启动
#### 4.2.1 Linux系统启动
假设第一步中下载的软件，解压安装的目录为：/home/wedo/
```sh
#cd进软件解压安装的目录
cd /home/wedo
#复制执行第二步中获取到的启动命令
./npc -server=xxxxxx:xxxx -vkey=xxxxxxxx
```
#### 4.2.2 windows系统启动
假设第一步中下载的软件，解压安装的目录为：D:\Program Files\wedo

1、在开始菜单中搜索cmd，启动cmd黑窗；

2、cd进软件所在目录

```shell
#首先切换磁盘，直接输入D:
d:
#cd进软件解压安装的目录
cd "Program Files/wedo"
#复制执行第二步中获取到的启动命令
npc.exe -server=xxxxxx:xxxx -vkey=xxxxxxxx
```

## 五、访问服务
假设购买了节点“阿里云节点(http/https不可用)”，这个节点的IP地址为123.57.61.137（节点IP地址，在购买服务中的列表中可查看）。假设我新增了的隧道，该隧道在新建的时候，服务端端口填写的是7878，目标IP端口为8080，那么可通过123.57.61.137:7878就可访问目标IP的8080端口服务。
![](https://wdyz.gitee.io/docs/myimgs/imgs-in-nps/5.png)
