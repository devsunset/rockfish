/*
 * @(#)LoggerInterceptor.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.interceptor;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import kh.devsunset.rockfish.common.annotation.NoSessionCheck;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.exceptions.JedisException;

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
	
	@Value("#{config['rockfish_redis_host']}")
	private String REDIS_HOST;
	
	@Value("#{config['rockfish_redis_port']}")
	private String REDIS_PORT;
	
	@Value("#{config['rockfish_redis_password']}")
	private String REDIS_PASSWORD;
	
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
		 		Jedis jedis = null;
				JedisPool pool = null;
				try{
					JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
					pool = new JedisPool(jedisPoolConfig, REDIS_HOST, Integer.parseInt(REDIS_PORT), 1000, REDIS_PASSWORD);
					jedis = pool.getResource();
					result = jedis.exists(sessionKey);
				}catch(JedisException e){
					if (null != jedis) {  
						jedis.close();
						result =  false;
		            }  
				}finally{
					if( jedis != null ){
						jedis.close();
					}
				}
		 	}
			
	    	return result;
	  }
}