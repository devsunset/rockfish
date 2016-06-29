■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ tomcat setting ■■■

  # server.xml  
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" maxPostSize="-1" URIEncoding="UTF-8"/>
