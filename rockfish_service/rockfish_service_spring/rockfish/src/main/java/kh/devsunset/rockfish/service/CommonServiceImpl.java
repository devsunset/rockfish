/*
 * @(#)CommonServiceImpl.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kh.devsunset.rockfish.dao.CommonDao;

/**
 * <PRE>
 * CommonServiceImpl
 * </PRE>
 * @author devsunset@gmail.com
 */
@Service("commonService")
public class CommonServiceImpl implements CommonService{
	//private static final Logger log = Logger.getLogger(CommonServiceImpl.class);
	
	@Value("#{config['rockfish_file_save_path']}")
	private String FILE_SAVE_PATH;
	
	@Resource(name="commonDao")
	private CommonDao commonDao;
	
	/*
	@Override
	public Object selectService(Map<String, Object> map, HttpServletRequest request) throws Exception {
		return commonDao.selectOne("biz.selectRockfish",map);
	}
	*/

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> selectListService(Map<String, Object> map, HttpServletRequest request) throws Exception {
		return commonDao.selectList("biz.selectRockfishList",map);
	}

	@Override
	public Object insertService(Map<String, Object> map, HttpServletRequest request) throws Exception {
		return commonDao.insert("biz.insertRockfish",map);
	}

	@Override
	public Object updateService(Map<String, Object> map, HttpServletRequest request) throws Exception{
		return commonDao.update("biz.updateRockfish",map);
	}

	@Override
	public Object deleteService(Map<String, Object> map, HttpServletRequest request) throws Exception {
		return commonDao.delete("biz.deleteRockfish",map);
	}
	
	@Override
	public Object complexUploadService(Map<String, Object> map, HttpServletRequest request) throws Exception{
		MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)request;
    	Iterator<String> iterator = multipartHttpServletRequest.getFileNames();
    	
    	MultipartFile multipartFile = null;
    	String originalFileName = null;
    	String originalFileExtension = null;
    	String saveFileName = null;
    	
    	List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
        Map<String, Object> listMap = null; 
        
        File file = new File(FILE_SAVE_PATH);
        if(file.exists() == false){
        	file.mkdirs();
        }
        
        while(iterator.hasNext()){
        	multipartFile = multipartHttpServletRequest.getFile(iterator.next());
        	if(multipartFile.isEmpty() == false){
        		originalFileName = multipartFile.getOriginalFilename();
        		originalFileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        		saveFileName = "uuid-file-name" + originalFileExtension;
        		saveFileName = originalFileName;

        		file = new File(FILE_SAVE_PATH + saveFileName);
        		multipartFile.transferTo(file);
        		
        		listMap = new HashMap<String,Object>();
        		listMap.put("ORIGINAL_FILE_NAME", originalFileName);
        		listMap.put("SAVE_FILE_NAME", saveFileName);
        		listMap.put("FILE_SIZE", multipartFile.getSize());
        		list.add(listMap);
        	}
        }
        
		return list;
	}
}
