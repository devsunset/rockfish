# ■■■■■■■■■■ Introduce ■■■■■■■■■■

# ■ Rockfish

#  ( readme - rockfish_introduce.pdf )
#  ( readme - rockfish_install.txt )

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

-------------------------------------------------------------------------------	

ROCKFISH 기능테스트

-------------------------------------------------------------------------------	

기능테스트 작성 내용

	가. SW 기본 정보
		◽ SW명
		◽ SW 개요
		◽ Test 환경정보
	나. SW 기능리스트
	다. 기능 시험 항목
	
-------------------------------------------------------------------------------	

가. SW 기본정보

□ SW명
	ㅇ ROCKFISH (Easy Simple Mobile Middleware)
	

□ SW 개요
	ㅇ Rockfish 프로그램은  모바일 단말과 서버 간의  http/https 통신 처리 시 
       Request , Response 에 대한 로깅 및 암호화 인증 처리를
       Service 하는  미들웨어로 100% 오픈소스 기술로 구현 되었으며
       모바일 프로그램 개발 시 Client 에서   Server 까지의   Full Stack
       개발 Template을 제공 합니다.

	
	ㅇ 주요 모듈
		- rockfish_client (Android , Web)
		- rockfish_console (nodejs version)
		- rockfish_server (nodejs version)
		- rockfish_service (Spring version)
		
	ㅇ SW 유형
		- Mobile Full Stack Develope Template S/W
		
		
□ Test 환경 정보

	ㅇ Client
	- Web version -  Browser (IE 9이상,FireFox,Chrome) - OS 상관 없음
	- Android Version - Google Play Store 등록된 Rockfish Client App
	  https://play.google.com/store/apps/details?id=kh.devsunset.rockfish
	
	ㅇ Console
	- Windows 계열 OS
	- node.js v4.4.3
	- MongoDB v3.2
		
	ㅇ Server
	- Windows 계열 OS
	- node.js v4.4.3
	- MongoDB v3.2
	- Redis v3.2
	
	ㅇ Service
	- Windows 계열 OS
	- apache_tomcat-7.0.57
	- jdk1.7.0_71
	- Spring 3.2.4
	- MariaDB 10.1
	
	ㅇ Setting
	- Windows 계열 OS
	- nginx-1.10.1
	- OpenSSL-Win64
			
-------------------------------------------------------------------------------	


나. SW 기능리스트

		대분류 중분류 소분류
		
		Rockfish Client (Web Version)
					HTTP Request
								Login 
								Login 유무 체크
								C/R/U/D Action
								Multipart File Upload 
								File Download	
								암호화 처리
		Rockfish Client (Android Version)
					HTTPS Request
								Login 
								Login 유무 체크
								C/R/U/D Action
								Multipart File Upload 
								File Download
								암호화 처리
		
		Rockfish Console (node.js Version)
					Main
								로그인
					DashBoard
								Service 호출 현황 조회
					Monitoring 
								Service 호출 현황 세부 조회
					Log
								Service 호출 로그 조회
								Service 호출 로그 상세 조회
					Service 	
								Service 리스트 조회
								Service 삭제 
								Service 상세 조회 
								Service 등록
								Service 수정
					Setting		
								Rockfish Sever Setting Giude
		
		Rockfish Server (node.js Version)
					HTTP Service 
						
					HTTPS Service 
					
					Service 처리
								General
								Multipart
								(업로드 파일 Type 및 Size 체크)
								Download
								복호화 처리
								
					MongoDB 연동(로그기록/Service 조회)
								로그 기록 
								Service 조회
								
					Redis 연동 (Session 정보 체크 및 Session Expired Time 갱신)
								Session 정보 체크
								Session 정보 Expired Time 갱신	
		
		
		Rockfish Service (Spring Version)
					Service
							General (C/R/U/D)
							Multipart
							Download
							
					Session 생성 및 체크
					
					
					Database 연동		

					
					Cluster 기능 
					
					
		
-------------------------------------------------------------------------------

다. 기능 시험 항목

		대분류 중분류 소분류 시험항목 Pass/Fail
		
		Rockfish Client (Web Version)
					HTTP Request
								Login 
								Login 유무 체크
								C/R/U/D Action
								Multipart File Upload 
								File Download	
								암호화 처리
		Rockfish Client (Android Version)
					HTTPS Request
								Login 
								Login 유무 체크
								C/R/U/D Action
								Multipart File Upload 
								File Download
								암호화 처리
		
		Rockfish Console (node.js Version)
					Main
								로그인
					DashBoard
								Service 호출 현황 조회
					Monitoring 
								Service 호출 현황 세부 조회
					Log
								Service 호출 로그 조회
								Service 호출 로그 상세 조회
					Service 	
								Service 리스트 조회
								Service 삭제 
								Service 상세 조회 
								Service 등록
								Service 수정
					Setting		
								Rockfish Sever Setting Giude
		
		Rockfish Server (node.js Version)
					HTTP Service 
						
					HTTPS Service 
					
					Service 처리
								General
								Multipart
								(업로드 파일 Type 및 Size 체크)
								Download
								복호화 처리
								
					MongoDB 연동(로그기록/Service 조회)
								로그 기록 
								Service 조회
								
					Redis 연동 (Session 정보 체크 및 Session Expired Time 갱신)
								Session 정보 체크
								Session 정보 Expired Time 갱신	
		
		
		Rockfish Service (Spring Version)
					Service
							General (C/R/U/D)
							Multipart
							Download
							
					Session 생성 및 체크
					
					
					Database 연동		

					
					Cluster 기능 
		
-------------------------------------------------------------------------------	
