 <%
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_upload.jsp
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish service (upload sample)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
%>
<%@ page language="java" contentType="text/html;charset=utf-8" buffer="1024kb" pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.io.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@ page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@ page import="org.apache.commons.fileupload.*"%>
<%
System.out.println("■■■■■■■■■■■■■■■ [ METHOD ] :"+request.getMethod() +" : MULTIPART");
// HEADER
Enumeration<String> em = request.getHeaderNames();
System.out.println("■■■■■■■■■■■■■■■ request.getHeaderNames() ■■■■■■■■■■■■■■■");
while(em.hasMoreElements()){
    String name = em.nextElement() ;
    String val = request.getHeader(name) ;
    System.out.println(name + " : " + val) ;
}

boolean isMultipart = ServletFileUpload.isMultipartContent(request);

if (isMultipart) {
	System.out.println("■■■■■■■■■■■■■■■ isMultipart : "+isMultipart);
	FileItemFactory factory = new DiskFileItemFactory();
	ServletFileUpload upload = new ServletFileUpload(factory);
	upload.setHeaderEncoding("utf-8");

	List items = null;

	try {
		items = upload.parseRequest(request);
	} catch (FileUploadException e) {
		e.printStackTrace();
	}

	System.out.println("■■■■■■■■■■■■■■■ items : "+items);
	String rv = "";
	rv += "{";
	Iterator itr = items.iterator();
	while (itr.hasNext()) {
		FileItem item = (FileItem) itr.next();
		if (item.isFormField()) {
			String name = item.getFieldName();
			String value = new String(item.getString().getBytes("8859_1"),"utf-8");
			rv += "'"+name+"' : '"+value+"',";
		} else {
			try {
					String itemName = item.getName();
					if(itemName !=null && !"".equals(itemName)){
						File root=File.listRoots()[0];
						File f = new File("/home/devsunset/devrepo/rockfish/attach/"+itemName);
						f.setWritable(true);
						f.setReadable(true);
						item.write(f);
					}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	if(!"{".equals(rv)){
		rv = rv.substring(0,rv.length() -1)+" }";
	}else{
		rv = "{}";
	}
	request.setCharacterEncoding("UTF-8");
	out.println(rv);

}else{
	System.out.println("■■■■■■■■■■■■■■■ : "+isMultipart);
	request.setCharacterEncoding("UTF-8");
	out.println("{}");
}
%>