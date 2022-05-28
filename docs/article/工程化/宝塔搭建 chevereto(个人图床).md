# 宝塔搭建 chevereto(个人图床)



## ✋🏻准备环境

- PHP 7.2
- Nginx 1.2.0
- MySQL 10.0.38-MariaDB
- PhpMyAdmin 4.0



## 😄步骤

1. 添加站点
   - 域名可以填ip，填上端口号
2. 进入宝塔界面上传chevereto_3.12.10文件

3. 解压文件并将其目录下文件覆盖到域名目录下

[![chevereto.md.jpg](http://180.76.145.206:880/images/2022/05/27/chevereto.md.jpg)](http://180.76.145.206:880/image/h01)

4. 点击`网站` -> `网站名` -> `配置文件`
5. 添加 nginx 配置

```
location / {
	try_files $uri $uri/ /index.php?$query_string;
}
```

[![nginx-.md.jpg](http://180.76.145.206:880/images/2022/05/27/nginx-.md.jpg)](http://180.76.145.206:880/image/nfn)

6. 访问网址 `域名`:`端口`
7. 注册登录 chevereto