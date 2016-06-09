<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.*"%>
<%

	System.out.println("■■■■■■■■■■■■■■■ [ METHOD ] :"+request.getMethod() +" : DOWNLOAD");
	// HEADER
	Enumeration<String> em = request.getHeaderNames();
	System.out.println("■■■■■■■■■■■■■■■ request.getHeaderNames() ■■■■■■■■■■■■■■■");
	while(em.hasMoreElements()){
	    String name = em.nextElement() ;
	    String val = request.getHeader(name) ;
	    System.out.println(name + " : " + val) ;
	}

	File file = null;
	FileInputStream is = null;
	ServletOutputStream sos = null;

	ServletContext scontext = getServletContext();
	String savefile = "attach";
	String realFolder = scontext.getRealPath(savefile);

	try{
		file = new File(realFolder+File.separator+"download.zip");
		byte b[] = new byte[4096];

		response.reset();
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attatchment; filename=download.zip");
		response.setHeader("Content-Length", String.valueOf((int)file.length()));

		is = new FileInputStream(file);
		sos = response.getOutputStream();

		int lineRead;
		while((lineRead = is.read(b,0,b.length)) != -1){
			sos.write(b,0,lineRead);
		}
		sos.flush();
	} catch(Exception e){
		e.printStackTrace();
	} finally{
		try{
			if(sos !=null){
			sos.close();
			}

			if(is !=null){
				is.close();
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
%>
