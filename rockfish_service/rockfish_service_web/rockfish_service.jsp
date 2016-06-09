 <%
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_service.jsp
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish service (service sample)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.Enumeration" %><%
	request.setCharacterEncoding("UTF-8");
	System.out.println("■■■■■■■■■■■■■■■ [ METHOD ] :"+request.getMethod() +" : GENERAL");
    // HEADER
    Enumeration<String> em = request.getHeaderNames();
	System.out.println("■■■■■■■■■■■■■■■ request.getHeaderNames() ■■■■■■■■■■■■■■■");
    while(em.hasMoreElements()){
        String name = em.nextElement() ;
        String val = request.getHeader(name) ;
        System.out.println(name + " : " + val) ;
    }
	System.out.println("----------------------------");

	// REQUEST PARAMETER
	Enumeration params = request.getParameterNames();
	System.out.println("■■■■■■■■■■■■■■■ request.getParameterNames() ■■■■■■■■■■■■■■■");

	String rv = "";
	rv += "{";
	while (params.hasMoreElements()){
		String name = (String)params.nextElement();
		System.out.println(name + " : " +request.getParameter(name));
		rv += "'"+name+"' : '"+request.getParameter(name)+"',";
		if("LOCK".equals(name)){
			System.out.println("■■■■■■■■■■■■■■■ LOCK START");
			Thread.sleep(9000); // sleep 9 seconds
			System.out.println("■■■■■■■■■■■■■■■ LOCK END");
		}
	}

	if(!"{".equals(rv)){
		rv = rv.substring(0,rv.length() -1)+" }";
	}else{
		rv = "{}";
	}
	System.out.println("----------------------------");
	request.setCharacterEncoding("UTF-8");
	out.println(rv);
%>