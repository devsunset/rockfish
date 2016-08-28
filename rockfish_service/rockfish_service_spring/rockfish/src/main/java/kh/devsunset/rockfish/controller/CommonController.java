/*
 * @(#)CommonController.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.controller;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

import kh.devsunset.rockfish.common.annotation.NoSessionCheck;
import kh.devsunset.rockfish.common.parameter.ParamMap;
import kh.devsunset.rockfish.common.util.LangMessage;
import kh.devsunset.rockfish.common.util.RockfishSessionInfo;
import kh.devsunset.rockfish.service.CommonService;

/**
 * <PRE>
 * CommonController
 * </PRE>
 * @author devsunset@gmail.com
 */
@Controller
public class CommonController {
	private static final Logger log = Logger.getLogger(CommonController.class);
	
	private static final String ROCKFISH_RESULT_JSON = "DATA";
	
	@Value("#{config['rockfish_file_save_path']}")
	private String FILE_SAVE_PATH;
	
	@Value("#{config['rockfish_session_time_out']}")
	private String SESSION_TIME_OUT;

	@Resource(name="commonService")
	private CommonService commonService;
	
	@Resource(name="rockfishSessionInfo")
	private RockfishSessionInfo rockfishSessionInfo;
	
	@Autowired
    RedisTemplate<String, String> redisTemplate;
     
    @Resource(name="redisTemplate")
    private ValueOperations<String, String> valueOps;
	
	@RequestMapping(value="/common/loginRockfish.do")
	@NoSessionCheck
    public ModelAndView login(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		log.debug("Login Process");
		log.debug("=============================");
		
		HashMap<String,String> sessionInfo = null;

		//save to redis login Session Key
    	String sessionKey = "ROCKFISH_SESSION_KEY-"+UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
    	
    	// Temp Session information
    	sessionInfo = new HashMap<String,String>();
    	sessionInfo.put("ROCKFISH_SESSION_KEY", sessionKey);
    	sessionInfo.put("ROCKFISH_ACCESS_ID", "rockfish");
    	sessionInfo.put("ID", "rockfish");
    	sessionInfo.put("INFO_1", "rockfish_1");
    	sessionInfo.put("INFO_2", "rockfish_2");
    	sessionInfo.put("INFO_3", "rockfish_3");
    	sessionInfo.put("INFO_4", "rockfish_4");
    	sessionInfo.put("INFO_5", "rockfish_5");
    	valueOps.set(sessionKey, new Gson().toJson(sessionInfo),Integer.parseInt(SESSION_TIME_OUT),TimeUnit.SECONDS); 
    	 
			
    	ModelAndView mv = new ModelAndView("jsonView");
    	mv.addObject(ROCKFISH_RESULT_JSON, sessionInfo);
    	return mv;
    }
	
	@RequestMapping(value="/common/logoutRockfish.do")
    public ModelAndView logout(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		log.debug("=============================");
		log.debug("Log out Process");
		log.debug("=============================");
		
		if(request.getHeader("rockfish_session_key") !=null && !"".equals(request.getHeader("rockfish_session_key"))){
			valueOps.set(request.getHeader("rockfish_session_key"), "",1,TimeUnit.SECONDS);
		}
		
		paramMap.put("LOGOUT", "SUCCESS");
		
    	ModelAndView mv = new ModelAndView("jsonView");
    	mv.addObject(ROCKFISH_RESULT_JSON, paramMap);
    	return mv;
    }
	
	@RequestMapping(value="/common/echoRockfish.do")
    public ModelAndView echoRockfish(ParamMap paramMap, HttpServletRequest request) throws Exception{
		
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		Object[] args = new String[] { "ROCKFISH" };
		
		log.debug("=============================");
		log.debug(LangMessage.getMessage("test"));
		log.debug(LangMessage.getMessage("test_argument",args));
		log.debug(LangMessage.getMessage("test",Locale.KOREA));
		log.debug(LangMessage.getMessage("test_argument",args,Locale.US));
		log.debug("=============================");
		
    	ModelAndView mv = new ModelAndView("jsonView");
    	mv.addObject(ROCKFISH_RESULT_JSON, paramMap);
    	return mv;
    }
	
	/*
	@RequestMapping(value="/common/selectRockfish.do")
	public ModelAndView selectRockfish(ParamMap paramMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject(ROCKFISH_RESULT_JSON, commonService.selectService(paramMap.getMap(),request));
		return mv;
	}
	*/
	
	@RequestMapping(value="/common/selectListRockfish.do")
	public ModelAndView selectListRockfish(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		//log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
				
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject(ROCKFISH_RESULT_JSON, commonService.selectListService(paramMap.getMap(),request));
		return mv;
	}
	
	@RequestMapping(value="/common/insertRockfish.do")
	public ModelAndView insertRockfish(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject(ROCKFISH_RESULT_JSON, commonService.insertService(paramMap.getMap(), request));
		return mv;
	}
	
	@RequestMapping(value="/common/updateRockfish.do")
	public ModelAndView updateBoard(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject(ROCKFISH_RESULT_JSON, commonService.updateService(paramMap.getMap(), request));
		return mv;
	}
	
	@RequestMapping(value="/common/deleteRockfish.do")
	public ModelAndView deleteRockfish(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject(ROCKFISH_RESULT_JSON, commonService.deleteService(paramMap.getMap(), request));
		return mv;
	}
	
	@RequestMapping(value="/common/uploadRockfish.do")
	public ModelAndView uploadRockfish(ParamMap paramMap, HttpServletRequest request) throws Exception{
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject(ROCKFISH_RESULT_JSON, commonService.complexUploadService(paramMap.getMap(), request));
		return mv;
	}
	
	@RequestMapping(value="/common/downloadRockfish.do")
	public void downloadRockfish(ParamMap paramMap, HttpServletRequest request, HttpServletResponse response) throws Exception{
		log.debug("=============================");
		log.debug("SESSION INFO : "+rockfishSessionInfo.getSession(request));
		log.debug("=============================");
		
		String saveFileName = "download.txt";
		String originalFileName = "download.txt";
		
		File file = null;
		FileInputStream is = null;
		ServletOutputStream sos = null;

		try{
			file = new File(FILE_SAVE_PATH+saveFileName);
			byte b[] = new byte[4096];

			response.reset();
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attatchment; filename="+ URLEncoder.encode(originalFileName,"UTF-8"));
			response.setHeader("Content-Length", String.valueOf((int)file.length()));

			is = new FileInputStream(file);
			sos = response.getOutputStream();

			int lineRead;
			while((lineRead = is.read(b,0,b.length)) != -1){
				sos.write(b,0,lineRead);
			}
			sos.flush();
		} catch(Exception e){
			log.error("download Exeption", e);
		} finally{
			try{
				if(sos !=null){
				sos.close();
				}

				if(is !=null){
					is.close();
				}
			}catch(Exception e){
				log.error("download Exeption", e);
			}
		}
	}
}
