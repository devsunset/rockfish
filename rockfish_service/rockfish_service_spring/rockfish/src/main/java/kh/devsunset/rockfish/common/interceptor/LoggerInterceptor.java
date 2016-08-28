/*
 * @(#)LoggerInterceptor.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.interceptor;

import java.util.Enumeration;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import kh.devsunset.rockfish.common.annotation.NoSessionCheck;

/**
 * <PRE>
 * LoggerInterceptor
 * </PRE>
 * @author devsunset@gmail.com
 */
public class LoggerInterceptor extends HandlerInterceptorAdapter {
	private static final Logger log = Logger.getLogger(LoggerInterceptor.class);
	
	@Value("#{config['rockfish_session_check']}")
	private String SESSION_CHECK;
	
	@Autowired
    RedisTemplate<String, String> redisTemplate;
     
    @Resource(name="redisTemplate")
    private ValueOperations<String, String> valueOps;
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		if (log.isDebugEnabled()) {
			log.debug("======================================          START         ======================================");
			log.debug(" Request URI \t:  " + request.getRequestURI());
			
		    // HEADER
		    Enumeration<String> em = request.getHeaderNames();
			log.debug("■■■■■■■■■■■■■■■ request.getHeaderNames() ■■■■■■■■■■■■■■■");
		    while(em.hasMoreElements()){
		        String name = em.nextElement() ;
		        String val = request.getHeader(name) ;
		        log.debug(name + " : " + val) ;
		    }
			// REQUEST PARAMETER
			Enumeration params = request.getParameterNames();
			log.debug("■■■■■■■■■■■■■■■ request.getParameterNames() ■■■■■■■■■■■■■■■");
			String[] values = null;
			while (params.hasMoreElements()){
				String name = (String)params.nextElement();
				values = request.getParameterValues(name);
				if(values != null){
					if(values.length > 1){
						for(int i=0;i<values.length;i++){
							log.debug(name + " [Array]["+i+"] : " +values[i]);
						}
					}else{
						log.debug(name + " : " + values[0]);
					}
				}else{
					log.debug(name + " : " +request.getParameter(name));
				}
			}
		}
		
		// NoSessionCheck 어노테이션이 컨트롤러에 사용되었는지 체크함
		NoSessionCheck useLogin = ((HandlerMethod) handler).getMethodAnnotation(NoSessionCheck.class);
		
		// NoSessionCheck 어노테이션이 없음으로  로그인 체크
        if("Y".equals(SESSION_CHECK) && useLogin == null) {
        	if(!loginCheck(request.getHeader("ROCKFISH_SESSION_KEY"))){
        		return false;
        	}
        }
		
		return super.preHandle(request, response, handler);
	}
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		if (log.isDebugEnabled()) {
			log.debug("======================================           END          ======================================");
		}
	}
	
	 private boolean loginCheck(String sessionKey) throws Exception{
		 	boolean result = true;
		 	if(sessionKey == null || "".equals(sessionKey)){
		 		result =  false;
		 	}else{
		 		String sessionValue = valueOps.get(sessionKey);
				
				if("".equals(sessionValue) || sessionValue == null){
					return false;
				}else{
					return true;
				}
		 	}
	    	return result;
	  }
}