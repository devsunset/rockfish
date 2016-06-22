/*
 * @(#)LangMessage.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.util;

import java.util.Locale;

import org.springframework.context.support.MessageSourceAccessor;

/**
 * <PRE>
 * LangMessage
 * </PRE>
 * @author devsunset@gmail.com
 */
public class LangMessage {

	private static MessageSourceAccessor msAcc = null;

	public void setMessageSourceAccessor(MessageSourceAccessor msAcc) {
		LangMessage.msAcc = msAcc;
	}

	public static String getMessage(String key) {
		return msAcc.getMessage(key, Locale.getDefault());
	}

	public static String getMessage(String key, Object[] objs) {
		return msAcc.getMessage(key, objs, Locale.getDefault());
	}
	
	public static String getMessage(String key,Locale locale) {
		return msAcc.getMessage(key, locale);
	}

	public static String getMessage(String key, Object[] objs,Locale locale) {
		return msAcc.getMessage(key, objs, locale);
	}
}