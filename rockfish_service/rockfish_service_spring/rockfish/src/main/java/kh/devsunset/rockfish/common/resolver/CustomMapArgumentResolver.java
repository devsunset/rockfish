/*
 * @(#)CustomMapArgumentResolver.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.resolver;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import kh.devsunset.rockfish.common.parameter.ParamMap;

/**
 * <PRE>
 * CustomMapArgumentResolver
 * </PRE>
 * @author devsunset@gmail.com
 */
public class CustomMapArgumentResolver implements HandlerMethodArgumentResolver{
	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return ParamMap.class.isAssignableFrom(parameter.getParameterType());
	}

	@Override
	public Object resolveArgument(MethodParameter parameter
			, ModelAndViewContainer mavContainer
			, NativeWebRequest webRequest
			, WebDataBinderFactory binderFactory) throws Exception {
		ParamMap paramMap = new ParamMap();
		
		HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
		Enumeration<?> enumeration = request.getParameterNames();
		
		String key = null;
		String[] values = null;
		while(enumeration.hasMoreElements()){
			key = (String) enumeration.nextElement();
			values = request.getParameterValues(key);
			if(values != null){
				for(int i=0;i<values.length;i++){
					values[i] = escapeHtmlSqlInection(values[i]);
				}
				paramMap.put(key, (values.length > 1) ? values: values[0]);
			}
		}
		return paramMap;
	}
	
	/**
	 * XSS & SQL Inject 수정
	 * @param String
	 * @return String value
	 */
    private static String escapeHtmlSqlInection(String value) {
    	/*
			### Cross Site Scripting (XSS) ###
			XSS injects executable code via the GET or POST parameters in HTTP requests. So, here,
			I would present an example of special characters (<, >, ‘, …) transformation into their HTML code in order to 
			not be executed by the browser.
		
			An example of XSS attack could be filling javascript code in in form’s field:
			"/><script>alert(xss attack);</script>
	
			### SQL injection ###
			SQL injection is a code injection technique, used to attack data driven applications,
			in which malicious SQL statements are inserted into an entry field for execution.
			A best-pratice is no use the concatenation of SQL queries and variables like:
		
			"SELECT id, name FROM TABLE_PERSON WHERE id="+myIdVariable;"
			…instead, use the parametrized queries via the PreparedStatement.
		
			An example of SQL injection could be:
			.../mycontext/myservice.do?name=12&id=123' AND '1'=='1'--
			
			1. Escape single quote 
			‘ (외따옴표)의 escape코드를 이용
			2. Reject known bad input
			select, insert, delete, drop , –, ‘ 등의 있는지 검사
			3. Allow only good input 
			abcdefg…ABCDEFG…0123456789 만 허용
        */

    	// XSS 공격 방어 처리 <,> 값만 변경
		value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
    			
		// Sql Inject 공격 방어 처리  ',-- 값만 공백으로 변경
		value = value.replaceAll("--", "");
		return value;
    }

}
