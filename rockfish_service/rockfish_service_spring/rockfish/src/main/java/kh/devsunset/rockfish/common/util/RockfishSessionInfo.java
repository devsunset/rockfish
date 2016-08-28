/*
 * @(#)RockfishSessionInfo.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.util;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@Service("rockfishSessionInfo")
public class RockfishSessionInfo {
	@Autowired
    RedisTemplate<String, String> redisTemplate;
     
    @Resource(name="redisTemplate")
    private ValueOperations<String, String> valueOps;
	
	public HashMap<String,String> getSession(HttpServletRequest request){
		if(request != null 
				&& request.getHeader("ROCKFISH_SESSION_KEY") !=null 
				&& !"".equals(request.getHeader("ROCKFISH_SESSION_KEY"))){
			
			String sessionValue = valueOps.get(request.getHeader("ROCKFISH_SESSION_KEY"));
			
			if("".equals(sessionValue) || sessionValue == null){
				return null;
			}else{
				return new Gson().fromJson(sessionValue, new TypeToken<HashMap<String,String>>(){}.getType());
			}
			
		}else{
			return null;
		}
	}
}
