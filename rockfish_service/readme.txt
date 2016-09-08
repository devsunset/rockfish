■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
## ■ rockfish service
   * rockfish service (play) - Next TO-DO
   * rockfish service (spring) - Completed
   * rockfish service (web) - prototype version completed
   * rockfish service (vert.x) - Next TO-DO

■■■ MariaDB Setting ■■■

-- rockfish 사용자 생성
-- ID : rockfish
-- PW : rockfish

-- rockfish 의 데이터베이스 구조 덤핑
CREATE DATABASE IF NOT EXISTS rockfish /*!40100 DEFAULT CHARACTER SET utf8 */;
USE rockfish;

-- 테이블 rockfish의 구조를 덤프합니다. tb_rockfish
CREATE TABLE IF NOT EXISTS tb_rockfish (
  IDX int(10) unsigned NOT NULL AUTO_INCREMENT,
  TEMP1 varchar(255) DEFAULT '0',
  TEMP2 varchar(255) DEFAULT '0',
  TEMP3 varchar(255) DEFAULT '0',
  PRIMARY KEY (IDX)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


■■■ Tomcat Setting ■■■

# server.xml      
 -    추가 옵션 ) maxPostSize="-1" URIEncoding="UTF-8"    
 -    
 -    <Connector port="8080" protocol="HTTP/1.1"    
 -               connectionTimeout="20000"    
 -               redirectPort="8443" maxPostSize="-1" URIEncoding="UTF-8"/>   
 -    
 -    
 -  #특정 ip만 접속 허용     
 -  참고) Rockfish Server 에서만 실 데이타 제공 Service 서버 접속 허용 하게    
 -          하려고 하면 아래와 같은 Tomcat 설정으로 처리 가 가능 합니다.    
 -    
 -  <!--    
 -  <Valve className="org.apache.catalina.valves.RemoteAddrValve" allow="127.0.0.1" />    
 -      
 -  org.apache.catalina.valves.RemoteAddrValve 의 속성   
 -  allow : IP주소가 여기에 쓴 정규식에 포함되지 않을 경우 모두 거부.    
 -  deny : IP주소가 여기에 쓴 정규식에 포함될 경우만 거부.   
 -  denyStatus : 거부될 경우 보낼 상태코드 : 기본값 403 포비든.  