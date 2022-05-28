# Docker 详细安装步骤

## Centos 安装 docker

环境： Centos 7.5

1. 卸载旧的版本

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine

```

2. 需要安装包

```bash
sudo yum install -y yum-utils
```

3. 设置阿里镜像仓库

```bash
sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

```

4. 安装 docker

安装前先更新 yum 软件包索引

```bash
yum makecache fast
```

安装 docker-ce 

```bash
sudo yum install docker-ce docker-ce-cli containerd.io
```

5. 启动 docker

```bash
sudo systemctl start docker
```

6. 判断是否成功安装 docker

```bash
docker version
```

7. 查看镜像（默认是空）

```bash
docker images
```

8. 测试 hello-world

拉取 hello-world

```bash
docker pull hello-world
```

查看镜像（多个 hello-world）

```bash
docker images
```

运行 hello-world

```bash
docker run hello-world
```

查看运行的容器

```bash
# 查看运行的容器
docker ps
# 查看所有的容器
docker ps -a
```

9. 移除 hello-world

如果容器运行时需要先停止

```bash
# 42f63afa795e 为容器ID
docker stop 42f63afa795e
```

![stop docker](./assets/docker_stop.jpg)

移除容器

```bash
docker rm 42f63afa795e
```

移除 hello-world 的镜像

```bash
docker images
# feb5d9fea6a5 是 image id
docker rmi feb5d9fea6a5
```

![rm_image](./assets/docker_rm_image.jpg)



## 额外(阿里云服务器)

因为使用阿里云镜像仓库，可以配置阿里云的镜像加速–速度更快

1. 在阿里云里搜索 -- 容器镜像服务
2. 点击立即开通 -- 镜像工具 -- 镜像加速器 -- 选择 CentOS



使用 CentOS 中的代码配置

1. 创建一个目录

```bash
sudo mkdir -p /etc/docker
```

2. 编辑配置文件

```bash
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["xxxx替换自己的加速地址"]
}
EOF
```

3. 重启服务

```bash
sudo systemctl daemon-reload
```

4. 重启 docker

```bash
sudo systemctl restart docker
```



如果需要卸载 docker

1. 卸载依赖

```bash
 sudo yum remove docker-ce docker-ce-cli containerd.io
```

2. 删除文件夹

```bash
 sudo rm -rf /var/lib/docker
 sudo rm -rf /var/lib/containerd
```



转载

https://blog.csdn.net/PyongSen/article/details/123053374





## 提交命令

1. **commit**

```
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:[标签名]
```

**OPTIONS说明：**

- `-a`: 提交的镜像作者；
- `-c`: 使用`Dockerfile`指令来创建镜像；
- `-m`: 提交时的说明文字；
- `-p`: 在`commit`时，将容器暂停。



**演示**

**步骤一：查看本地Docker镜像**

```
docker images
```

**步骤2：下载Tomcat镜像到本地**

```
docker pull tomcat:9.0
docker images
```

**步骤3：启动**

```
docker run -it --name tomcat123 -p 8888:8080 tomcat:9.0
```

注意该命令最后不要加`/bin/bash`

![images](E:\md\assets\docker-P.png)

**步骤4：对Tomcat镜像进行修改**

把Tomcat中`webapps.dist`目录中的内容，全部拷贝到`webapps`目录中。

我们在XShell中新建一个窗口，进入Tomcat容器，进行修改。

```
# 进入Tomcat容器中
docker exec -it tomcat123 /bin/bash

# webapps.dist目录中的内容，全部拷贝到webapps目录中。
cp -r webapps.dist/* webapps
ls -l webapps
```

> 说明：
>
> 因为发现默认Tomcat的`webapps`目录中是没有应用，这是镜像的原因，官方的镜像默认`webapps`下面是没有文件的。
>
> 所以通过上面的操作，当我们启动Tomcat镜像的时候，就可以访问到Tomcat的欢迎界面了。（具体可看前面的Docker安装Tomcat容器的练习）

**步骤5：提交镜像**

将我们操作过的Tomcat容器通过`commit`提交为一个新的镜像，我们以后就使用我们修改过的镜像即可。

```
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:[标签名]
```

示例：

```
# 退出Tomcat容器
exit

# 执行docker commit 提交生成新的tomcat镜像
docker commit -m="add webapps App" -a="sunwukong" d60ed0bff852 tomcat123:1.0

# 查看本地Docker镜像
docker images
REPOSITORY            TAG       IMAGE ID       CREATED              SIZE
tomcat123             1.0       e42c33552c6c   About a minute ago   653MB
tomcat                9.0       040bdb29ab37   2 months ago         649MB
centos                latest    300e315adb2f   3 months ago         209MB
```

我们可以看到本地Docker镜像多可以一个`tomcat123`镜像，且是`1.0`版本。

也可以发现`tomcat123`镜像的大小为653MB，比原先的Tomcat镜像649MB多了几兆。

> 提示：
>
> ```
> docker commit -m="add webapps App" -a="sunwukong" d60ed0bff852 tomcat123:1.0
> ```
>
> 命令的最后`tomcat123:1.0`为自定义的镜像名和版本，也可以在前面加入Namespace的，也就如`abc/tomcat123:1.0`，这个`abc`就叫Namespace。你就可以想象于Java中，类前面的包名。我们拉取镜像的时候也经常会看到一些这样命名的包，如用到过的`portainer/portainer`工具。
>
> 关于Namespace命名空间，以后会详细讲解。

**步骤6：启动自定义的Tomcat镜像**

执行命令：`docker run -it -p 8888:8080 tomcat123:1.0`

这里提示一下，如果需要让外部访问容器的服务，一定要进行端口映射。

直接在外部浏览器中访问，如下：

可以直接显示Tomcat服务的欢迎界面。

到了这里大概才算是入门Dokcer！





## 设置开启自启动

https://blog.csdn.net/dujianqiu/article/details/124270275

- sudo systemctl enable docker
- sudo systemctl start docker