# Docker 安装宝塔



## 步骤

1. 拉一个`centos7.*`镜像

```
docker pull centos:centos7
```

2. 创建一个命名为`baota`(名称自定义) 在后台运行，将宿主机的`20，21，80，443，888，8888，880`,这六个端口映射到`docker`容器中去，并将宿主机的`/home/www`文件夹映射到`docker`容器的`/www`上去*(注意：文件目录如果不存在。宿主机和容器会自己创建，无需手动创建)*。`privileged`表示在运行容器的时候，给容器加特权，设置容器有写文件的权限。

```
docker run -i -t -d --name baota -p 20:20 -p 21:21 -p 80:80 -p 443:443 -p 888:888 -p 8888:8888 -p 880:880 --privileged=true -v /home/www:/www centos:centos7
```

3. 查看此时启动的容器，使用docker ps 查看

```
docker ps
```

4. 进入容器，docker exec -it

```
docker exec  -it 44a4d6fc7d46 /bin/bash
```

- docker exec -it 44a4d6fc7d46 /bin/bash(这里也可以直接用 bash)或者下面都行
- docker exec -it baota /bin/bash

5. 执行宝塔面板Centos安装命令

```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

期间会有一个安装确认，输入`y`即可

```
Do you want to install Bt-Panel to the /www directory now?(y/n): y
```

```
==================================================================
Congratulations! Installed successfully!
==================================================================
外网面板地址: http://xxxx.xxxx.xxx.xxx:8888/5f9de06a
内网面板地址: http://:8888/5f9de06a
username: sjjadoav
password: 26d3c413
If you cannot access the panel,
release the following panel port [8888] in the security group
若无法访问面板，请检查防火墙/安全组是否有放行面板[8888]端口
==================================================================
Time consumed: 1 Minute!
[root@44a4d6fc7d46 /]# 
```

用外网面板地址登录!

6. 退出`容器`并重启`Docker`测试，查看宝塔是否可正常运行

```
[root@44a4d6fc7d46 /]# exit
exit
[root@VM-20-10-centos ~]# service docker restart
Redirecting to /bin/systemctl restart docker.service
```

查看运行的容器

```
[root@VM-20-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

启动`baota`容器

```
[root@VM-20-10-centos ~]# docker start baota
baota
[root@VM-20-10-centos ~]# docker ps
CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS              PORTS                                                                                                              NAMES
44a4d6fc7d46   centos:centos7   "/bin/bash"   41 minutes ago   Up About a minute   0.0.0.0:20-21->20-21/tcp, 0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp, 0.0.0.0:888->888/tcp, 0.0.0.0:8888->8888/tcp   baota
```

此期间无法访问

7. 解决无法访问的问题

关于`Docker`下`Centos`安装宝塔，容器重启宝塔不启动的解决办法：
在该容器（`baota`）目录`"/etc/profile.d"`下新建一个`.sh`文件，名称随意
建议`.sh`文件写成这样：

```
#!/bin/bash
initDir="/etc/init.d/"
for file in `ls $initDir` 
do
 if [ x"$file" != x"README" ];then
   if [ -f "$initDir/$file" ];then
     $initDir/$file start
   fi
 fi
done
```

即以下命令：

```
[root@VM-20-10-centos ~]# docker exec -it baota /bin/bash
[root@44a4d6fc7d46 /]# ls
anaconda-post.log  bin  dev  etc  home  install.sh  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  www
[root@44a4d6fc7d46 /]# cd /etc/profile.d
[root@44a4d6fc7d46 profile.d]# touch baota.sh
[root@44a4d6fc7d46 profile.d]# vi baota.sh
```

`baota.sh`文件保存好 `restart`容器

```
[root@VM-20-10-centos ~]# docker restart baota
baota
```

刷新浏览器，系统正常

>  特别注意：为了能够保存（持久化）数据以及共享容器间的数据，docker一定使用-v挂载主机目录到容器，比如上面启动容器的 docker -v 参数。

> **补充：宝塔默认密码使用 : bt default 查看，登录进去修改即可。如果上面安装的不是最新宝塔，可以再容器里面执行下面命令升级到最新：**
>
> ```
> curl http://download.bt.cn/install/update_to_6.sh|bash
> ```