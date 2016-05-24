■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ npm install ■■■

npm install

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ mongodb setting ■■■

>> mongo

use rockfish_service_log

db.rockfish.save( { setup:"rockfish" } )

show dbs

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

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ client crul ■■■

curl -d "a=1&b=2" http://localhost:8888/rockfishController?para=123

curl -k -d "a=1&b=2" https://localhost:9999/rockfishController?para=123



