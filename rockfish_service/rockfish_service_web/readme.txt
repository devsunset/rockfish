■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■ tomcat setting ■■■

  # server.xml  maxPostSize setting (maxPostSize="-1")
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" maxPostSize="-1"/>
