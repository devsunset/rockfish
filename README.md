-------------------------------------------------------------------------------	

#		 ROCKFISH INTRODUCE

-------------------------------------------------------------------------------	

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

-------------------------------------------------------------------------------	

#		Completed

-------------------------------------------------------------------------------	

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

-------------------------------------------------------------------------------	

#		Next To-Do

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

-------------------------------------------------------------------------------	

#			ROCKFISH 기능 소개 

-------------------------------------------------------------------------------	

기능 작성 내용

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
								Login					로그인 버튼 클릭하여 로그인 실행 후 생성 된 ROCFISH_SESSION_KEY 값 리턴
								Login 유무 체크				로그인 실행 하기 전에 일반 C/R/U/D Multipart Upload/Download 실행시 로그인 여부 체크 
								C/R/U/D Action				C/R/U/D 서비스 Action 호출 실행 후 json 타입 결과 리턴 Alert 창  출력
								Multipart File Upload 		첨부 파일 업로드 Action 호출 실행 후  json 타입 결과 리턴 Alert 창  출력
								File Download				파일 다운로드 실행 후 첨부 파일 다운로드 확인 (Android는 기본 Download 폴더에 저장됨)
								암호화 처리				지정한 특정 parameter 암호화 처리 전송 
		Rockfish Client (Android Version)
					HTTPS Request
								Login					로그인 버튼 클릭하여 로그인 실행 후 생성 된 ROCFISH_SESSION_KEY 값 리턴
								Login 유무 체크				로그인 실행 하기 전에 일반 C/R/U/D Multipart Upload/Download 실행시 로그인 여부 체크 
								C/R/U/D Action				C/R/U/D 서비스 Action 호출 실행 후 json 타입 결과 리턴 Alert 창  출력
								Multipart File Upload 		첨부 파일 업로드 Action 호출 실행 후  json 타입 결과 리턴 Alert 창  출력
								File Download				파일 다운로드 실행 후 첨부 파일 다운로드 확인 (Android는 기본 Download 폴더에 저장됨)
								암호화 처리				지정한 특정 parameter 암호화 처리 전송 
		
		Rockfish Console (node.js Version)
					Main
								로그인						관리 콘솔 로그인 
					DashBoard
								Service 호출 현황 조회		Service 호출 현황 조회
															최근 1주일 가장 많이 호출된 App Top 5 조회
															최근 1주일 호출된 Service List 조회
															최근 1주일 호출된 Service 전송 결과 성공/실패 조회
															최근 1주일 호출된 Service 히스토리 조회
					Monitoring 		
								Service 호출 현황 세부 조회
															날짜 검색 조건에 따른 데이타 조회 제공
															Service 호출 Client OS 현황 조회 조회
															Service 호출 Client OS Version 현황 조회 조회
															Service 호출 Send Type (General/Multipart/Download) 현황 조회 조회
															Service 호출 Encrypt Type 현황 조회 조회
															Service 호출 Https Response Code 현황 조회 조회
															Service 호출 Service Protocol 현황 조회 조회
					Log
								Service 호출 로그 조회
															검색 조건에 의한 Service 호출 List 조회 
															대용량 데이타 조회에 따른 페이징 처리 제공
															
								Service 호출 로그 상세 조회
															Service 호출건에 대한 세부 내역 상세 조회 
															
					Service 	
								Service 리스트 조회 / 삭제
															등록 Service List 조회
															List 에서 선택한 Service에 대해 삭제 기능 
								Service 상세 조회 
															List 에서 선택한 Service 상세 정보 조회
								Service 등록
															신규 Service 등록 기능
								Service 수정
															List 에서 선택한 Service 상세 정보 수정
					Setting		
								Rockfish Sever Setting Giude
															Rockfish Server config 설정 내용 가이드 제공
		
		Rockfish Server (node.js Version)
					HTTP Service 
															HTTP 서비스 제공
						
					HTTPS Service 
															HTTPS 서비스 제공
					
					Service 처리
								General						
															General 요청에 대한 Service 호출 처리 
															
								Multipart
								(업로드 파일 Type 및 Size 체크)
															Multipart 첨부 파일 업로드 Service 호출 처리
															rocifish_config 에 설정한 업로드 파일 관련 설정 값에 따른
															첨부파일 확장자 체크 및 첨부 용량 체크 하여 제어 처리 
															- 설정값에 허용하지 않은 파일 첨부 시 오류 발생 Client Return
															  Client 에서는 별도 예외 처리 하지 않아 에러 발생하면 정상 수행된 것임
															  리턴 값에 json 타입 결과로 에러 내용 전달 															
								
								Download
															파일 다운로드 Service 호출 처리 
								
								복호화 처리	
															Client 에서 암호화되어 전송된 Parameter에 대한 (첨부파일 제외)
															복호화 처리 후 실 Service 호출 시 복호화 된 값으로 전송 
								
					MongoDB 연동(로그기록/Service 조회)
								로그 기록 		
															rockfish server 에서 Service 호출에 대한 로그 기록
								Service 조회
															rockfish server 에서 Service 호출에 대한 mapping Master 정보 조회
															관리 콘솔에서 서비스 정보 등록/수정/삭제 시 15초 Delay Time 후 
															rockfish server 에 해당 내용 적용 
								
					Redis 연동 (Session 정보 체크 및 Session Expired Time 갱신)
															
								Session 정보 체크
															service Session 체크 로직 수행 
															Session 유효하지 않은 Client 요청에 대한 실패 처리 리턴
															
															
								Session 정보 Expired Time 갱신	
															service 호출 Client Session 정보에 대해 Expired Time 갱신
		
		
		Rockfish Service (Spring Version)
					Service
							General (C/R/U/D)
															General Type Service 처리 (DB 연동)
							Multipart
															DB 연동 없이 단순히 첨부 파일 업로드 처리 기능 수행
							Download
															download.jpg 파일 다운로드 기능 수행 
							
					Session 생성 및 체크
															Inteceptor 에서 유효하지 않은 Session Service 요청시 차단											
					
					
					Database 연동		
															MariaDB 데이타 베이스 연동 기능

					
					Cluster 기능 
															Was Session 이 아닌 Redis Session 정보를 이용한
															Session 공유 형태의 처리 (한 서버 다운되어도 정상 처리)
		
-------------------------------------------------------------------------------		
