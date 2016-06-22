/*
 * @(#)CommonService.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * <PRE>
 * CommonService
 * </PRE>
 * @author devsunset@gmail.com
 */
public interface CommonService {

	//Object selectService(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	List<Map<String, Object>> selectListService(Map<String, Object> map, HttpServletRequest request) throws Exception;

	Object insertService(Map<String, Object> map, HttpServletRequest request) throws Exception;

	Object updateService(Map<String, Object> map, HttpServletRequest request) throws Exception;

	Object deleteService(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	Object complexUploadService(Map<String, Object> map, HttpServletRequest request) throws Exception;
}
