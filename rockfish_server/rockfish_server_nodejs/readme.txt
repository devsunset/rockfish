■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ npm install ■■■

npm install

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ mongodb setting ■■■

>> mongo

use rockfish 

# CREATE ROCKFISH_SERVICE_LOG TABLE
db.rockfish_service_log.insert({"ACCESS" : "SETUP", "REQUEST" : "SETUP", "RESPONSE" : "SETUP", "SERVICE_METHOD" : "SETUP", "SEND_TYPE" : "SETUP", "TARGET_SERVICE" : "SETUP", "REQUEST_TIME" : new Date(),  "RESPONSE_TIME" : new Date()})


# CREATE ROCKFISH_SERVICE_MASTER TABLE
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_GENERAL","SERVICE_TITLE" : "ROCKFISH WEB GENERAL","SERVICE_DESC" : "Web General 호출","SERVICE_URL" : "http://localhost:8080/rockfishweb/rockfish_service.jsp","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_MULTIPART","SERVICE_TITLE" : "ROCKFISH WEB MULTIPART","SERVICE_DESC" : "Web Multipart 호출","SERVICE_URL" : "http://localhost:8080/rockfishweb/rockfish_upload.jsp","SERVICE_TYPE" : "M","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_DOWNLOAD","SERVICE_TITLE" : "ROCKFISH WEB DOWNLOAD","SERVICE_DESC" : "Web Download 호출","SERVICE_URL" : "http://localhost:8080/rockfishweb/rockfish_download.jsp","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","SERVICE_TYPE" : "D","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_W_DOWNLOAD_STATIC","SERVICE_TITLE" : "ROCKFISH WEB DOWNLOAD STATIC","SERVICE_DESC" : "Web Download Static 호출","SERVICE_URL" : "http://localhost:8080/rockfishweb/rockfish_download_static.jsp","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","SERVICE_TYPE" : "D","REG_DATE" : new Date(),"MOD_DATE" : new Date()})

db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_ECHO","SERVICE_TITLE" : "ROCKFISH GENERAL ECHO","SERVICE_DESC" : "Echo 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/echoRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_SELECT","SERVICE_TITLE" : "ROCKFISH GENERAL SELECT","SERVICE_DESC" : "조회 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/selectListRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_INSERT","SERVICE_TITLE" : "ROCKFISH GENERAL INSERT","SERVICE_DESC" : "입력 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/insertRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_UPDATE","SERVICE_TITLE" : "ROCKFISH GENERAL UPDATE","SERVICE_DESC" : "수정 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/updateRockfish.do","SERVICE_TYPE" : "G","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_DELETE","SERVICE_TITLE" : "ROCKFISH GENERAL DELETE","SERVICE_DESC" : "삭제 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/deleteRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "G","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_MULTIPART_UPLOAD","SERVICE_TITLE" : "ROCKFISH MULTIPART UPLOAD","SERVICE_DESC" : "업로드 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/uploadRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "M","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_GENERAL_DOWNLOAD","SERVICE_TITLE" : "ROCKFISH GENERAL DOWNLOAD","SERVICE_DESC" : "다운로드 호출","SERVICE_URL" : "http://localhost:8080/rockfish/common/downloadRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "D","REG_DATE" : new Date(),"MOD_DATE" : new Date()})

db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_LOGIN","SERVICE_TITLE" : "ROCKFISH LOGIN IN","SERVICE_DESC" : "로그인 프로세스","SERVICE_URL" : "http://localhost:8080/rockfish/common/loginRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "N","SERVICE_TYPE" : "G","REG_DATE" : new Date(),"MOD_DATE" : new Date()})
db.rockfish_service_master.insert({"SERVICE_APP" : "ROCKFISH_APP" ,"SERVICE" : "ROCKFISH_LOGOUT","SERVICE_TITLE" : "ROCKFISH LOG OUT","SERVICE_DESC" : "로그아웃 프로세스","SERVICE_URL" : "http://localhost:8080/rockfish/common/logoutRockfish.do","SERVICE_PROTOCOL" : "HTTP","SERVICE_METHOD" : "POST", "SERVICE_STATUS" : "Y","SERVICE_LOGIN_CHECK" : "Y","SERVICE_TYPE" : "G","REG_DATE" : new Date(),"MOD_DATE" : new Date()})


# CREATE ROCKFISH_ADMIN_MASTER TABLE
db.rockfish_admin_master.insert({"ID" : "rockfish", "PASSWORD" : "5b3dafec50864579", "NAME" : "rockfish", "DESC" : "Defalt rockfish console admin", "STATUS" : "Y", "REG_DATE" : new Date(),  "MOD_DATE" : new Date()})

show dbs

----------------------------------------------------
mongodb rockfish 사용자 계정 추가
----------------------------------------------------

\bin\mongod.exe 실행

\bin\mongo.exe 실행


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

----------------------------------------------------


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

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ openssl ■■■

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
