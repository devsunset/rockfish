■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ tomcat setting ■■■

  # server.xml  
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" maxPostSize="-1" URIEncoding="UTF-8"/>

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