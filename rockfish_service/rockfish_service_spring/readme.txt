■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ Completed ■■■

■■■ tomcat setting ■■■

  # server.xml  
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" maxPostSize="-1" URIEncoding="UTF-8"/>

	#특정 ip만 접속 허용

	<!-- 
	<Valve className="org.apache.catalina.valves.RemoteAddrValve" allow="127.0.0.1" />
	
	org.apache.catalina.valves.RemoteAddrValve 의 속성
	allow : IP주소가 여기에 쓴 정규식에 포함되지 않을 경우 모두 거부.
	deny : IP주소가 여기에 쓴 정규식에 포함될 경우만 거부.
	denyStatus : 거부될 경우 보낼 상태코드 : 기본값 403 포비든. 
	-->
