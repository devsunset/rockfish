-------------------------------------------------------------------------------	

#		 ■■ ROCKFISH

-------------------------------------------------------------------------------	

``` 
   Easy Simple Mobile Middleware Server 
   
   Full Stack Mobile Server Develop Process

   Server Programming Study Project
``` 

-------------------------------------------------------------------------------	

#		 ■■ ROCKFISH INTRODUCE

-------------------------------------------------------------------------------	

####`    Client <-> (Load balancing) <->   Server & Console <-> (Load balancing) <->   Service` 

 ![ScreenShot](https://github.com/devsunset/rockfish/blob/master/rockfish_system.png)
 

#  [introduce - rockfish_introduce.pdf]
<https://github.com/devsunset/rockfish/blob/master/rockfish_introduce.pdf>

#  [presentation - rockfish_pt.zip]
<https://github.com/devsunset/rockfish/blob/master/rockfish_pt.zip>

rockfish_pt.zip 압축 해제 /rockfish_pt/rockfish/pt/rockfish.html 실행

#  [function - rockfish_function.txt]
<https://github.com/devsunset/rockfish/blob/master/rockfish_function.txt>


-------------------------------------------------------------------------------	

#		■■ Module

-------------------------------------------------------------------------------	

# ■ Rockfish client
```java
   * rockfish client api  
   * rockfish client (android) 
   * rockfish client (web)
``` 

# ■ Rockfish console
```java
   * rockfish console ui (AXU & axisj) 
   * rockfish console (nodejs & express)
``` 

# ■ Rockfish server
```java
   * rockfish server (nodejs)
``` 
   
# ■ Rockfish service
```java
   * rockfish service (spring)
   * rockfish service (web) - prototype version
``` 

# ■ Rockfish setting
```java
   (Authentication), (Authorization), (Access Control), (Load balancing), (CI), (Stress Test) (APM)
   * rockfish_apm 
   * rockfish_ci
   * rockfish_control_redis
   * rockfish_loadbalancing_nginx  
   * rockfish_stress_test_jmeter
``` 
-------------------------------------------------------------------------------  

#     ■■ Demo

-------------------------------------------------------------------------------  

■ ROCKFISH MINI DEMO ■

* Demo 시나리오

   IDX,TEMP1,TEMP2,TEMP3 4개의 컬럼을 가진 TB_ROCKFISH 테이블에 
   CRUD 처리 및 로그인 , 로그아웃 , 파일 업로드, 다운로드를 제공 하는 
   스프링 기반 웹 프로젝트 서비스를 Tomcat 서버 2대에서 구동 하고 
   단말 (Rockfish Android , Web version Sample Test 프로그램)에서 
   Https,Http 통신을 사용하여 Rockfish Middleware 서버를 통해 서비스 
   호출 테스트 및 관리 콘솔 에서 해당 서비스 모니터링

   <https://youtu.be/a1-woEXZ6Wg>
   
   [![ScreenShot](https://github.com/devsunset/rockfish/blob/master/screenshot.png)](https://youtu.be/a1-woEXZ6Wg)


■ ROCKFISH FULL DEMO ■

   <https://youtu.be/fYVJlEjYmZ8>

   [![ScreenShot](https://github.com/devsunset/rockfish/blob/master/screenshot.png)](https://youtu.be/fYVJlEjYmZ8)   


■ ROCKFISH DEMO LINK ■

   Server IP : localhost

   Native localhost:9999 , Web localhost:8888

   Web Client : <http://localhost:7777/rockfish_client_web/rockfish_client_web.html>   

   Console     : <http://localhost:3000>  rockfish/rockfish

 -------------------------------------------------------------------------------  

#     ■■ Lecture

-------------------------------------------------------------------------------  

   - Rockfish 
   
      <https://www.youtube.com/watch?v=sDxu_vjbvdU>
      
       [![ScreenShot](https://ci5.googleusercontent.com/proxy/nCEMvckyQHrwHEdbLfoR_h_Ctw5TtWIgmx6KlTV4m19JFc-yY0KWfflV-GPWzJ5cSDEYd2Fw_pLmRCPWWqE7GDBAWCqM_6rveJnFB-RBn5fZZZac4a8x7WpQ_gfatfO_NBx7bb2zgUtzfpXgL8T-LDOuEZa1yV91TwTw0v1jCy4IWonEdV-pgbT5=s0-d-e1-ft#http://i.ytimg.com/vi/sDxu_vjbvdU/hqdefault.jpg?w=480&h=270&feature=em-upload_owner&sigh=Vqr0W9Ojxzg-uC-oTmOwVwHtZIo)](https://www.youtube.com/watch?v=sDxu_vjbvdU)

   - Rockfish Service
   
      <https://www.youtube.com/watch?v=FwCHpq80U4M>
      
      [![ScreenShot](https://ci6.googleusercontent.com/proxy/MbT4-Neal6P_l9Mcdk7ufs8fir9yi_CECfYunWhSjszZVg0oKn9SMGXrwusOl7miKOyieBaWGnUpNUvMAiKjRXBloj5dpgWkN1z_pmoXuBByb_d37kp0v-tWmv_fBl7P2rSAx8cdZHbNAy_PanpDm7rVoRlHVBGMYbPeN9I26siWK4JLxCTbTS7z=s0-d-e1-ft#http://i.ytimg.com/vi/pFN1qQOXLOw/hqdefault.jpg?w=480&h=270&feature=em-upload_owner&sigh=9oWf_eKb8A7u3V9S7yoyWiO45f4)](https://www.youtube.com/watch?v=FwCHpq80U4M)

   - Rockfish Server 
   
      <https://www.youtube.com/watch?v=yiL-zqZGXVA>
      
      [![ScreenShot](https://ci3.googleusercontent.com/proxy/RfY0vPxfMmvfW02Btys7pIbAhGi8K5xzBFQa9O_WAYYba9gfQ5ri9W6HwfArKYKn3pd45qJOn2FG6XxfmNu-tNGl7FPCqJf9ARtYSUwIM6eaGUpmnaNNROwFbMf1PDd8sPfXjaOEGn1uts5KJFHGoWLeSqcwXz5RiJv-ths3jIxf6tEkvPHbr0-l=s0-d-e1-ft#http://i.ytimg.com/vi/yiL-zqZGXVA/hqdefault.jpg?w=480&h=270&feature=em-upload_owner&sigh=IM-TsnOwYABd__LmgxtvftK0Ecc)](https://www.youtube.com/watch?v=yiL-zqZGXVA)

   - Rockfish Console
   
      <https://www.youtube.com/watch?v=iTIZIwQoeDU>
      
      [![ScreenShot](https://ci6.googleusercontent.com/proxy/AU-TERy4XfSMcjpaj--90TTuTWFJ98fPtCGzXaUX4mWxr0dtBcqvonXTP8SoWTo_XYsoLDCc_lE5R1miBMabjRjB7_fqqZT93G9JBk9bzYitL0-GrE5SX_7XO7QK--CguQD4jblfc4ZdcXa-_oK8DNuFCnLmIrvsw2ySPCybac7mOZFTKv5AyJ5m=s0-d-e1-ft#http://i.ytimg.com/vi/iTIZIwQoeDU/hqdefault.jpg?w=480&h=270&feature=em-upload_owner&sigh=z67EvLMl-Sogfg7owqWiQRB7B44
)](https://www.youtube.com/watch?v=iTIZIwQoeDU)

   - Rockfish Client 
   
      <https://www.youtube.com/watch?v=6EYsBjVaTXY>
      
      [![ScreenShot](https://ci6.googleusercontent.com/proxy/MbT4-Neal6P_l9Mcdk7ufs8fir9yi_CECfYunWhSjszZVg0oKn9SMGXrwusOl7miKOyieBaWGnUpNUvMAiKjRXBloj5dpgWkN1z_pmoXuBByb_d37kp0v-tWmv_fBl7P2rSAx8cdZHbNAy_PanpDm7rVoRlHVBGMYbPeN9I26siWK4JLxCTbTS7z=s0-d-e1-ft#http://i.ytimg.com/vi/pFN1qQOXLOw/hqdefault.jpg?w=480&h=270&feature=em-upload_owner&sigh=9oWf_eKb8A7u3V9S7yoyWiO45f4)](https://www.youtube.com/watch?v=6EYsBjVaTXY)

   - Rockfish
   
      <https://www.youtube.com/watch?v=pFN1qQOXLOw>
      
      [![ScreenShot](https://ci6.googleusercontent.com/proxy/MbT4-Neal6P_l9Mcdk7ufs8fir9yi_CECfYunWhSjszZVg0oKn9SMGXrwusOl7miKOyieBaWGnUpNUvMAiKjRXBloj5dpgWkN1z_pmoXuBByb_d37kp0v-tWmv_fBl7P2rSAx8cdZHbNAy_PanpDm7rVoRlHVBGMYbPeN9I26siWK4JLxCTbTS7z=s0-d-e1-ft#http://i.ytimg.com/vi/pFN1qQOXLOw/hqdefault.jpg?w=480&h=270&feature=em-upload_owner&sigh=9oWf_eKb8A7u3V9S7yoyWiO45f4)](https://www.youtube.com/watch?v=pFN1qQOXLOw)
      
      
-------------------------------------------------------------------------------  

#     ■■ ROCKFISH INSTALL

-------------------------------------------------------------------------------       

#  [install - rockfish_install.txt]
<https://github.com/devsunset/rockfish/blob/master/rockfish_install.txt>


rockfish_pt.zip
https://drive.google.com/file/d/1sCeDUrdzN9mThNU-xQQpitNMbSsr9CbA/view?usp=sharing

rockfish.zip
https://drive.google.com/file/d/1I23knxbcv9azImK_TMOHgIfPpEem3Gxa/view?usp=sharing

dev.zip
https://drive.google.com/file/d/1kLl2wdcQbFoF3pJ837yD01GSXLI8DaI5/view?usp=sharing

cirepo.zip
https://drive.google.com/file/d/1fNFmBjm2IQV3dCqRsytdbs6u4B1C1vMl/view?usp=sharing


  ### port 사용 현황 ###

  rockfish_console 3000
  
  rockfish_server 8888 (http), 9999 (https)
  
  nginx 7777
  
  mongodb 27017
  
  redis 6379
  
  mariadb 3306
  
  tomcat1 8080
  
  tomcat2 8081

  scouter (APM) 6100

  실행 후 

  rockfish_client/rockfish_client_web/rockfish_client_web.html 파일 브라우저에서 실행 후
  Action 테스트 후 아래 콘솔로 접속 하셔서 서비스 통신 내역 확인해 보시기 바랍니다. 

  http://localhost:3000/ 로 접속 ID/PW (rockfish/rockfish)
  
------------------------------------------------------------------------------- 

# ■ License
  Apache License
                           Version 2.0      
