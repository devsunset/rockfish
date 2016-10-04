
#		 ■■■ Welcome to Rockfish World ■■■


-------------------------------------------------------------------------------	

#		 ■■ ROCKFISH INTRODUCE

-------------------------------------------------------------------------------	

``` 
   Easy Simple Mobile Server Middleware
   
   Full Stack Mobile Develop Process

   Non-Bolcking Process

   Easy Simple Scale Out Support
``` 

# ■ Process Flow

####`    Client <-> (Load balancing) <->   Server & Console <-> (Load balancing) <->   Service` 


#  [readme - rockfish_introduce.pdf]
<https://github.com/devsunset/rockfish/blob/master/rockfish_introduce.pdf>

#  [readme - rockfish_install.txt]
<https://github.com/devsunset/rockfish/blob/master/rockfish_install.txt>

#  [readme - rockfish_function.txt]
<https://github.com/devsunset/rockfish/blob/master/rockfish_function.txt>

# ■ License
GNU LESSER GENERAL PUBLIC LICENSE Version 2.1

-------------------------------------------------------------------------------  

#     ■■ Demo

-------------------------------------------------------------------------------  

■ ROCKFISH 4 MINUTE 30 SECONDS DEMO ■

   <https://youtu.be/a1-woEXZ6Wg>
   
   [![ScreenShot](https://github.com/devsunset/rockfish/blob/master/screenshot.png)](https://youtu.be/a1-woEXZ6Wg)

1. Rockfish 소개
   https://github.com/devsunset/rockfish

2. Demo 설명

   IDX,TEMP1,TEMP2,TEMP3 4개의 컬럼을 가진 TB_ROCKFISH 테이블에 
   CRUD 처리 및 로그인 , 로그아웃 , 파일 업로드, 다운로드를 제공 하는 
   스프링 기반 웹 프로젝트 서비스를 Tomcat 서버 2대에서 구동 하고 
   단말 (Rockfish Android , Web version Sample Test 프로그램)에서 
   Https,Http 통신을 사용하여 Rockfish Middleware 서버를 통해 서비스 
   호출 테스트 및 관리 콘솔 에서 해당 서비스 모니터링 하는 시나리오 

   Server IP : 175.126.112.125

   Android Client : <https://play.google.com/store/apps/details?id=kh.devsunset.rockfish&hl=ko>  
   Native 175.126.112.125:9999 , Web 175.126.112.125:8888

   Web Client : <http://175.126.112.125:7777/rockfish_client_web/rockfish_client_web.html>   

   Console     : <http://175.126.112.125:3000>  rockfish/rockfish

3. Next To-Do
   - Rockfish 소개 
   - Rockfish Service 소개
   - Rockfish Server 소개 
   - Rockfish Console 소개 
   - Rockfish Client 소개    
   - Rockfish Setting 소개
   - Rockfish 맺음

-------------------------------------------------------------------------------  

#     ■■ 1 minute Install

------------------------------------------------------------------------------- 

자세한 설치 방법은 아래 rockfish_install.txt 파일을 참조하세요 
<https://github.com/devsunset/rockfish/blob/master/rockfish_install.txt>

 복잡한 설치와 설정 없이 일단 다운받아 실행 하여 Rockfish가 어떤 SW인지 알고 싶으신 분들을 위해 

 zip파일로 통합 설치 본을 제공해 드립니다.

 Windows7 64bit 환경 에서 테스트 하였으며 32bit에서는 동작 안합니다.

 Windows8,Windows10은 테스트 못해 보았는데 설치 하시는 분 계시면 설치 결과 feedback 주시면 

 감사하겠습니다. ^^

 통합 모듈 설치 방법은 아래와 같습니다. 

Google Drive에 임시 공유
- Download Link -
https://drive.google.com/file/d/0B-RetjmV0gmVVFVWbWhEU21TYlU/view?usp=sharing

 위의 파일을 다운받아 C:\ 경로에 압축만 해제 하시고 몇가지 처리만 해주시면 됩니다. 

 (참고 - zip파일로 다운로드 시 모듈 파일 경로가 길어 압축 해제 시 오류 발생)

  Windows 에서는 반디집 (무료 압축 파일 - 개인/기업 모두 사용 가능) 사용 하여
  압축 해제 하시기 바랍니다.   

  https://www.bandisoft.co.kr/bandizip/help/longpath/
    
  압축 해제후 
  rockfish_service\home 디렉토리를 C:\ 경로에 복사 하세요.

  MongoDB 실행시에 MSVCP120.DLL 파일 찾을 수 없다는 오류 발생 시
  아래 링크 에서 windows 64bit 기준 vcredist_x64.exe, vcredist_x86.exe 파일을
  다운 받아 설치 하시기 바랍니다.  (rockfish\runWindows\install 경로에 파일 첨부했습니다.)
  https://www.microsoft.com/ko-KR/download/details.aspx?id=40784
  
  아래 배치 파일 실행하면 rockfish 프로그램 시작 됨

  C:\rockfish\runWindows\rockfish.bat  
  
  (기존 설치 프로그램이 존재한다면 시작 시 포트 충돌 발생할 경우 있음)
  (기존 서비스 종료 후 테스트 하거나 설치 프로그램 포트 변경 후 실행)

  ### port 사용 현황 ###

  rockfish_console 3000
  rockfish_server 8888 (http), 9999 (https)
  nginx 7777
  mongodb 27017
  redis 6379
  mariadb 3306
  tomcat1 8080
  tomcat2 8081

  실행 후 

  rockfish_client/rockfish_client_web/rockfish_client_web.html 파일 브라우저에서 실행 후
  Action 테스트 후 아래 콘솔로 접속 하셔서 서비스 통신 내역 확인해 보시기 바랍니다. 

  http://localhost:3000/ 로 접속 ID/PW (rockfish/rockfish)

-------------------------------------------------------------------------------	

#		■■ Completed Module

-------------------------------------------------------------------------------	

# ■ Rockfish client
```java
   * rockfish client api  -Completed
   * rockfish client (android) - Completed
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

-------------------------------------------------------------------------------	

#		■■ Next To-Do Module

-------------------------------------------------------------------------------	

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