/*
 * @(#)LoggerAspect.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.aop;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

/**
 * <PRE>
 * LoggerAspect
 * </PRE>
 * @author devsunset@gmail.com
 */
@Aspect
public class LoggerAspect {
	private static final Logger log = Logger.getLogger(LoggerAspect.class);
	static String name = "";
	static String type = "";
	
	@Around("execution(* kh.devsunset.rockfish..controller.*Controller.*(..)) "
			+ "or execution(* kh.devsunset.rockfish..service.*Impl.*(..)) "
			+ "or execution(* kh.devsunset.rockfish..dao.*DAO.*(..))")
	public Object logPrint(ProceedingJoinPoint joinPoint) throws Throwable {
		type = joinPoint.getSignature().getDeclaringTypeName();
		
		if (type.indexOf("Controller") > -1) {
			name = "Controller  \t:  ";
		}
		else if (type.indexOf("Service") > -1) {
			name = "ServiceImpl  \t:  ";
		}
		else if (type.indexOf("DAO") > -1) {
			name = "DAO  \t:  ";
		}
		
		if(log.isDebugEnabled()){
			log.debug(name + type + "." + joinPoint.getSignature().getName() + "()");
		}
		return joinPoint.proceed();
	}
}

