/*
 * @(#)LoggerInterceptor.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.interceptor;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * <PRE>
 * LoggerInterceptor
 * </PRE>
 * @author devsunset@gmail.com
 */
public class LoggerInterceptor extends HandlerInterceptorAdapter {
	private static final Logger log = Logger.getLogger(LoggerInterceptor.class);
	
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
		return super.preHandle(request, response, handler);
	}
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		if (log.isDebugEnabled()) {
			log.debug("======================================           END          ======================================");
		}
	}
}