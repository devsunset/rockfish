# ■■■■■■■■■■ Introduce ■■■■■■■■■■

# ■ Rockfish ( readme - rockfish_introduce.pdf )

``` 
   Easy Simple Mobile Middleware
   
   Full Stack Mobile Develop Process

   Non-Bolcking Process

   Easy Simple Scale Out Support
``` 

# ■ Process Flow

####`    Client <-> (Load balancing) <->   Server & Console <-> (Load balancing) <->   Service` 

# ■ License
GNU LESSER GENERAL PUBLIC LICENSE Version 2.1


# ■■■■■■■■■■ Completed ■■■■■■■■■■

# ■ Rockfish client
```java
   * rockfish client api  -Completed
   * rockfish client (android) - TO-DO
   * rockfish client (web) - Completed  
``` 

# ■ Rockfish console
```java
   * rockfish console ui (AXU & axisj) - Completed  
   * rockfish console (nodejs & express) - Completed
``` 

# ■ Rockfish server
```java
   * rockfish server (nodejs) - Completed
``` 
   
# ■ Rockfish service
```java
   * rockfish service (spring) - Completed
   * rockfish service (web) - prototype version completed
``` 

# ■ Rockfish setting
```java
   (Authentication), (Authorization), (Access Control), (Load balancing), (Stress Test) 
   * rockfish_control_redis - Completed 
   * rockfish_loadbalancing_nginx - Completed  
   * rockfish_stress_test_jmeter - Completed
``` 



# ■■■■■■■■■■ Next To-Do ■■■■■■■■■■

# ■ Rockfish client
```java
   * z_rockfish client (etc) - Next TO-DO
   * z_rockfish client (iphone) - Next TO-DO
   * z_rockfish client (ms) - Next TO-DO
   * z_rockfish client (tizen) - Next TO-DO
``` 

# ■ Rockfish console
```java 
   * z_rockfish console (python & django) - Next TO-DO   
   * z_rockfish console (ruby & rails) - Next TO-DO
```

# ■ Rockfish server
```java
   * z_rockfish server (erlang) - Next TO-DO
   * z_rockfish server (go) - Next TO-DO
``` 
   
# ■ Rockfish service
```java
   * z_rockfish service (play) - Next TO-DO
   * z_rockfish service (vert.x) - Next TO-DO
```    
   
# ■ Rockfish setting
```java
   * z_rockfish_control_couchbase - Next TO-DO       
   * z_rockfish_docker - Next TO-DO   
   * z_rockfish_loadbalancing_haproxy - Next TO-DO 
```  

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

■■■ ROCKFISH INSTALL ■■■

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

### ROCKFISH 실행 프로그램 설치 ###

Rockfish 프로그램이 실행 되기 위한 환경을 구성하기 
위해 서는 아래 9가지 프로그램 설치가 필요 합니다.
Windows , (Linux/IOS) 모두 해당 프로그램 기본 설정 
으로 설치 후 실행 가능 상태로 준비 하시면 됩니다. 

각 프로그램별 자세한 설치 내용은 생략 합니다. 

참고) 서버 환경 별로 설치 내용이 상이 하고 관련 
설치 내용은 해당 Site 및 인터넷등에 정보가 많이
존재 하기 때문에 생략 하도록 하겠습니다. 

- 중요 한 부분은 설치 시 특별한 설정 없이 실행 
  가능 상태로 설치 하시면 됩니다. 

------------------------------------------------

1. MongoDB
   - Default 설치 
     (Standalone 모드 설치 - shard 환경 미 구현)

2. MariaDB
   - Default 설치 

3. Redis
   - Default 설치 
     (Standalone 모드 설치 - Cluster 환경 미 구현)    

4. Nginx
   - Default 설치    

5. Node js
   - Default 설치 

6. Java 7 or 8
   - Default 설치 

7. Tomcat
   - Default 설치 - zip ,tar 파일 다운 형식 설치 
     (2대 톰캣을 구동시 port 8080,8081로 설정 구성)

------------------------------------------------

8. Open SSL (Option - 설치 안해도 됨)    
   - Default 설치    
   - RSA 암호화 관련 key 파일 생성 시 필요 

9. Android Studio & Android SDK (Option - 설치 안해도 됨)      
   - Default 설치 
   - Rockfish Client Android version 구동 시 필요 

------------------------------------------------

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

### ROCKFISH 실행 프로그램 설정 ###

------------------------------------------------

1. MongoDB

MonogoDB Shell 에서 아래 구문 실행 하여 테이블 생성

rockfish_service_log
rockfish_service_master
rockfish_admin_master


>> mongo

use rockfish 

# CREATE ROCKFISH_SERVICE_LOG TABLE
db.rockfish_service_log.insert({"ACCESS" : "SETUP", "REQUEST" : "SETUP", "RESPONSE" : "SETUP", "SERVICE_METHOD" : "SETUP", "SEND_TYPE" : "SETUP", "TARGET_SERVICE" : "SETUP", "REQUEST_TIME" : new Date(),  "RESPONSE_TIME" : new Date()})


# CREATE ROCKFISH_SERVICE_MASTER TABLE
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_GENERAL","SERVICE_TITLE" : "ROCKFISH WEB GENERAL","SERVICE_DESC" : "Web General 호출","SERVICE_URL" : "http://localhost:7777/rockfishweb/rockfish_service.jsp","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_MULTIPART","SERVICE_TITLE" : "ROCKFISH WEB MULTIPART","SERVICE_DESC" : "Web Multipart 호출","SERVICE_URL" : "http://localhost:7777/rockfishweb/rockfish_upload.jsp","SERVICE_TYPE" : "M","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_DOWNLOAD","SERVICE_TITLE" : "ROCKFISH WEB DOWNLOAD","SERVICE_DESC" : "Web Download 호출","SERVICE_URL" : "http://localhost:7777/rockfishweb/rockfish_download.jsp","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","SERVICE_TYPE" : "D","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_DOWNLOAD_STATIC","SERVICE_TITLE" : "ROCKFISH WEB DOWNLOAD STATIC","SERVICE_DESC" : "Web Download Static 호출","SERVICE_URL" : "http://localhost:7777/rockfishweb/rockfish_download_static.jsp","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","SERVICE_TYPE" : "D","REG_DATE" : new Date(),"MOD_DATE" : new Date()})

db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_ECHO","SERVICE_TITLE" : "ROCKFISH GENERAL ECHO","SERVICE_DESC" : "Echo 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/echoRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_SELECT","SERVICE_TITLE" : "ROCKFISH GENERAL SELECT","SERVICE_DESC" : "조회 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/selectListRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_INSERT","SERVICE_TITLE" : "ROCKFISH GENERAL INSERT","SERVICE_DESC" : "입력 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/insertRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_UPDATE","SERVICE_TITLE" : "ROCKFISH GENERAL UPDATE","SERVICE_DESC" : "수정 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/updateRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_DELETE","SERVICE_TITLE" : "ROCKFISH GENERAL DELETE","SERVICE_DESC" : "삭제 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/deleteRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "G","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_MULTIPART_UPLOAD","SERVICE_TITLE" : "ROCKFISH MULTIPART UPLOAD","SERVICE_DESC" : "업로드 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/uploadRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "M","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_DOWNLOAD","SERVICE_TITLE" : "ROCKFISH GENERAL DOWNLOAD","SERVICE_DESC" : "다운로드 호출","SERVICE_URL" : "http://localhost:7777/rockfish/common/downloadRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "D","REG_DATE" : new Date(),"MOD_DATE" : new Date()})

db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_LOGIN","SERVICE_TITLE" : "ROCKFISH LOGIN IN","SERVICE_DESC" : "로그인 프로세스","SERVICE_URL" : "http://localhost:7777/rockfish/common/loginRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","SERVICE_TYPE" : "G","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_LOGOUT","SERVICE_TITLE" : "ROCKFISH LOG OUT","SERVICE_DESC" : "로그아웃 프로세스","SERVICE_URL" : "http://localhost:7777/rockfish/common/logoutRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "G","REG_DATE" : new Date(),"MOD_DATE" : new Date()})


# CREATE ROCKFISH_ADMIN_MASTER TABLE
db.rockfish_admin_master.insert({"ID" : "rockfish", "PASSWORD" : "5b3dafec50864579", "NAME" : "rockfish", "DESC" : "Defalt rockfish console admin", "STATUS" : "Y", "REG_DATE" : new Date(),  "MOD_DATE" : new Date()})



# MongoDB 계정 생성 
use rockfish
db.createUser(
    {
        user : "rockfish",
        pwd : "rockfish",
        roles :
        [
            {
                role : "readWrite", db : "rockfish"
            }
        ]
     }
)

계정 추가후 mongod.exe -auth 로 실행


참고 
# 관리자/사용자 계정 삭제
use admin
db.dropUser("<username>")


사용자 계정
use myDB
db.createUser({ user: "<username>",
          pwd: "<password>",
          roles: ["dbAdmin", "readWrite"]
})


관리자 계정
use admin
db.createUser( { user: "<username>",
          pwd: "<password>",
          roles: [ "userAdminAnyDatabase",
                   "dbAdminAnyDatabase",
                   "readWriteAnyDatabase"

] } )

------------------------------------------------

2. MariaDB

  # 계정 생성 
  -- rockfish 사용자 생성
  -- ID : rockfish
  -- PW : rockfish


  # 데이터베이스 생성 
  CREATE DATABASE IF NOT EXISTS rockfish
  USE rockfish;

  # 테이블 생성
  CREATE TABLE IF NOT EXISTS tb_rockfish (
    IDX int(10) unsigned NOT NULL AUTO_INCREMENT,
    TEMP1 varchar(255) DEFAULT '0',
    TEMP2 varchar(255) DEFAULT '0',
    TEMP3 varchar(255) DEFAULT '0',
    PRIMARY KEY (IDX)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

------------------------------------------------

3. Redis

   # 패스워드 설정 

   redis.windows.conf or redis.conf 설정 파일 
   아래 구문 밑에 패스워드 rockfish 설정 

   # requirepass foobared

   requirepass rockfish

------------------------------------------------

4. Nginx

# 설정 파일 구성

# 서비스 서버 HTTP or HTTPS 구성에 맞춰 아래 설정
  내용 설정 처리 해 줍니다. 
  PORT 7777로 구동 

# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
# HTTP SERVER
# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
# ■ nginx load-balancer guide ■
# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
# https://www.nginx.com/resources/admin-guide/load-balancer/
# http://nginx.org/en/docs/http/ngx_http_upstream_module.html
# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

#user  nginx;
#CPU 코어 개수만큼 설정
worker_processes  4;
# worker_cpu_affinity 0001 0010 0100 1000;

# Error Log 설정
error_log /home/devsunset/devrepo/rockfish/logs/nginx_error.log;

# pid 설정
pid /home/devsunset/devrepo/rockfish/logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
  # log 포맷과 access_log 설정 
  log_format upstreamlog '[$time_local] $remote_addr - $remote_user - $server_name  '
                         'to: $upstream_addr: $request upstream_response_time $upstream_response_time msec '
                         '$msec request_time $request_time';
             
    access_log  /home/devsunset/devrepo/rockfish/logs/nginx_access.log  upstreamlog;    
    
  upstream rockfish#1 {
    
  ############################################################################################
  # 설정안함   : 라운드로빈(Round-robin)은 기본으로 사용하는 메서드로 모든 서버에 동등하게 요청을 분산한다.
  # least_conn : 연결이 가장 작은 서버로 요청을 보낸다. 
  # ip_hash    : 클라이언트 IP주소를 기준으로 요청을 분배한다. IP주소가 같다면, 동일한 서버로 요청을 전송한다.
  # hash       : 유저가 정의한 key나 변수 혹은 이들의 조합을 해시해서 분산한다. key로 소스 IP나 포트 URI 등을 사용 할 수 있다. 
  #          hash는 consistent파라메터를 사용 할 수 있다. consistent를 사용하면 Ketama 컨시스턴시 해시 알고리즘을 이용해서 
  #          upstream 그룹에 서버가 추가 되거나 삭제 될 때, 키의 분배를 최소화 함으로써 캐시 실패를 줄일 수 있다. ex)  hash $request_uri consistent;
  # least_time : 메서드는 NginX Plus에서 지원한다. 평균 레이턴시와 연결을 기준으로 검사해서 로드가 적은 서버로 요청을 보낸다. ex) least_time header; 
  ############################################################################################
    
  server 127.0.0.1:8080 weight=5 max_fails=5 fail_timeout=15s;
  server 127.0.0.1:8081 weight=5 max_fails=5 fail_timeout=15s;
  #server 127.0.0.1:8082 weight=5 max_fails=5 fail_timeout=15s;
  #server 127.0.0.1:8083 down;
  #server 127.0.0.1:8084 backup;
  
  keepalive 1000;
  }

  server {
    listen 7777;
    server_name www.rockfish.com;
       
   proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Queue-Start "t=${msec}000";
   
   # client 에서 custom Header 값 추가 한 내용 전달 하기 위한 옵션 (중요)
   underscores_in_headers on;  
  
    location / {
      proxy_pass http://rockfish#1;
    }

    location /status {
      stub_status on;
      access_log off;
      allow 127.0.0.1;
      deny all;
    }
  }
  
  ############################################################################################
  # ip_hash    
  # 동일 client 에 대하여 같은 업스트림 서버로 연결 되도록 한다.
  # 클라이언트의 ip를 해싱하여 특정 포트로만 접근하게 만든다. 그러나 항상 똑같은 backend로의 접속을 보장하지 않는다.
  # 유저의 IP가 고정 IP가 아닐경우 당연히 다른 backend로 접근할 수 있다.

  # weight=n
  # 가중치. 가중치의 값이 커질 수록 접다른 서버에 비해 더 많이 접속하게 된다. 기본 값은 1이다.

  # max_fails
  # 이 옵션에 정의한 횟수만큼 통신이 실패하면 엔진엑스는 해당 서버가 작동하지 않는 것로 간주한다.
  # fail_timeout으로 시간 설정이 가능하며 이 시간을 넘기면 fail처리가 된다. 기본값은 1이다.

  # fail_timeout=n
  # max_fails 가 설정된 상태에서 n 시간만큼 응답하지 않으면 죽은 것으로 간주한다.
  # 초단위 설정이다. request의 처리가 fail_timeout을 넘기면 요청 실패 처리가 된다. 기본값은 10초이다.

  # down
  # 해당 서버를 사용하지 않는다. ip_hash 옵션이 설정된 경우에만 유효.

  # backup
  # 최후의 서버를 설정한다. 모든 서버가 작동하지 않으면 backup 서버로 연결이 된다. 
  # 반대로 하나라도 작동하는 서버가 있으면 backup은 사용되지 않는다.
  ############################################################################################
    
    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
}


# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
# HTTPS SERVER
# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

# ■ nginx load-balancer guide ■
# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
# https://www.nginx.com/resources/admin-guide/load-balancer/
# http://nginx.org/en/docs/http/ngx_http_upstream_module.html
# ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

#user  nginx;
#CPU 코어 개수만큼 설정
worker_processes  1;
# worker_cpu_affinity 0001 0010 0100 1000;

# Error Log 설정
error_log /home/devsunset/devrepo/rockfish/logs/nginx_error.log;

# pid 설정
pid /home/devsunset/devrepo/rockfish/logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
  # log 포맷과 access_log 설정 
  log_format upstreamlog '[$time_local] $remote_addr - $remote_user - $server_name  '
                         'to: $upstream_addr: $request upstream_response_time $upstream_response_time msec '
                         '$msec request_time $request_time';
             
    access_log  /home/devsunset/devrepo/rockfish/logs/nginx_access.log  upstreamlog;    
    
  upstream rockfish#1 {
    ############################################################################################
  # 설정안함   : 라운드로빈(Round-robin)은 기본으로 사용하는 메서드로 모든 서버에 동등하게 요청을 분산한다.
  # least_conn : 연결이 가장 작은 서버로 요청을 보낸다. 
  # ip_hash    : 클라이언트 IP주소를 기준으로 요청을 분배한다. IP주소가 같다면, 동일한 서버로 요청을 전송한다.
  # hash       : 유저가 정의한 key나 변수 혹은 이들의 조합을 해시해서 분산한다. key로 소스 IP나 포트 URI 등을 사용 할 수 있다. 
  #          hash는 consistent파라메터를 사용 할 수 있다. consistent를 사용하면 Ketama 컨시스턴시 해시 알고리즘을 이용해서 
  #          upstream 그룹에 서버가 추가 되거나 삭제 될 때, 키의 분배를 최소화 함으로써 캐시 실패를 줄일 수 있다. ex)  hash $request_uri consistent;
  # least_time : 메서드는 NginX Plus에서 지원한다. 평균 레이턴시와 연결을 기준으로 검사해서 로드가 적은 서버로 요청을 보낸다. ex) least_time header; 
  ############################################################################################
  
  ip_hash;
    server  127.0.0.1:9999 weight=5 max_fails=5 fail_timeout=15s;
    server 127.0.0.1:10000 weight=5 max_fails=5 fail_timeout=15s;
  #server 127.0.0.1:10001 weight=5 max_fails=5 fail_timeout=15s;
  #server 127.0.0.1:10002 down;
  #server 127.0.0.1:10003 backup;
  
  keepalive 1000;
  }

  # HTTPS server
  server {
    listen       7777 ssl;
    server_name  www.rockfish.com;

    ssl_certificate      cert.pem;
    ssl_certificate_key  key.pem;
    
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Queue-Start "t=${msec}000";
      
     # client 에서 custom Header 값 추가 한 내용 전달 하기 위한 옵션 (중요)
     underscores_in_headers on;

  ##    ssl_session_cache    shared:SSL:1m;
  ##    ssl_session_timeout  5m;

  ##    ssl_ciphers  HIGH:!aNULL:!MD5;
  ##    ssl_prefer_server_ciphers  on;

    location / {

      # add_header 'Access-Control-Allow-Origin' '*';
      # add_header 'Access-Control-Allow-Credentials' 'true';
      # add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
      # add_header 'Access-Control-Allow-Headers' 'DNT,Content-Length,Authorization,Accept,X-Forwarded-For,rockfish_session_key,rockfish_access_id,rockfish_ip,rockfish_mac,rockfish_phone,rockfish_device,rockfish_imei,rockfish_os,rockfish_os_version,rockfish_os_version_desc,rockfish_target_service,rockfish_client_app,rockfish_client_app_version,rockfish_send_type,rockfish_encrypt_parameter,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';

            
      proxy_pass https://rockfish#1;
    }
  }
  
  ############################################################################################
  # ip_hash    
  # 동일 client 에 대하여 같은 업스트림 서버로 연결 되도록 한다.
  # 클라이언트의 ip를 해싱하여 특정 포트로만 접근하게 만든다. 그러나 항상 똑같은 backend로의 접속을 보장하지 않는다.
  # 유저의 IP가 고정 IP가 아닐경우 당연히 다른 backend로 접근할 수 있다.

  # weight=n
  # 가중치. 가중치의 값이 커질 수록 접다른 서버에 비해 더 많이 접속하게 된다. 기본 값은 1이다.

  # max_fails
  # 이 옵션에 정의한 횟수만큼 통신이 실패하면 엔진엑스는 해당 서버가 작동하지 않는 것로 간주한다.
  # fail_timeout으로 시간 설정이 가능하며 이 시간을 넘기면 fail처리가 된다. 기본값은 1이다.

  # fail_timeout=n
  # max_fails 가 설정된 상태에서 n 시간만큼 응답하지 않으면 죽은 것으로 간주한다.
  # 초단위 설정이다. request의 처리가 fail_timeout을 넘기면 요청 실패 처리가 된다. 기본값은 10초이다.

  # down
  # 해당 서버를 사용하지 않는다. ip_hash 옵션이 설정된 경우에만 유효.

  # backup
  # 최후의 서버를 설정한다. 모든 서버가 작동하지 않으면 backup 서버로 연결이 된다. 
  # 반대로 하나라도 작동하는 서버가 있으면 backup은 사용되지 않는다.
  ############################################################################################    

------------------------------------------------

5. Tomcat
     (2대 톰캣을 구동시 port 8080,8081로 설정 구성)

    # server.xml  
    추가 옵션 ) maxPostSize="-1" URIEncoding="UTF-8"

    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" maxPostSize="-1" URIEncoding="UTF-8"/>


	#특정 ip만 접속 허용 
	참고) Rockfish Server 에서만 실 데이타 제공 Service 서버 접속 허용 하게 
          하려고 하면 아래와 같은 Tomcat 설정으로 처리 가 가능 합니다. 

	<!-- 
	<Valve className="org.apache.catalina.valves.RemoteAddrValve" allow="127.0.0.1" />
	
	org.apache.catalina.valves.RemoteAddrValve 의 속성
	allow : IP주소가 여기에 쓴 정규식에 포함되지 않을 경우 모두 거부.
	deny : IP주소가 여기에 쓴 정규식에 포함될 경우만 거부.
	denyStatus : 거부될 경우 보낼 상태코드 : 기본값 403 포비든. 
	-->

------------------------------------------------

6. Open SSL (Option - 설치 안해도 됨)    
   	# Windows 기준 설명 

    # https key generate
	windows openssl use
	>> set OPENSSL_CONF=[path-to-OpenSSL-install-dir]\bin\openssl.cfg
	>> openssl genrsa -out key.pem
	>> openssl req -new -key key.pem -out csr.pem
	>> openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

	# rsa key generate
	windows openssl use
	>> set OPENSSL_CONF=C:\OpenSSL-Win64\bin\openssl.cfg
	>> openssl genrsa -out privkey.pem 2048
	>> openssl rsa -in privkey.pem -pubout -out pubkey.pem

------------------------------------------------
