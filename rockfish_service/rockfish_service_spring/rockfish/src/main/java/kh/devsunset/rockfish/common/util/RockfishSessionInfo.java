/*
 * @(#)RockfishSessionInfo.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.util;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.exceptions.JedisException;

@Service("rockfishSessionInfo")
public class RockfishSessionInfo {
	@Value("#{config['rockfish_redis_host']}")
	private String REDIS_HOST;
	
	@Value("#{config['rockfish_redis_port']}")
	private String REDIS_PORT;
	
	@Value("#{config['rockfish_redis_password']}")
	private String REDIS_PASSWORD;
	
	
	public HashMap<String,String> getSession(HttpServletRequest request){
		if(request != null 
				&& request.getHeader("ROCKFISH_SESSION_KEY") !=null 
				&& !"".equals(request.getHeader("ROCKFISH_SESSION_KEY"))){
			
			Jedis jedis = null;
			JedisPool pool = null;
			String sessionValue = "";			
			try{
				JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
				pool = new JedisPool(jedisPoolConfig, REDIS_HOST, Integer.parseInt(REDIS_PORT), 1000, REDIS_PASSWORD);
				jedis = pool.getResource();
				sessionValue = jedis.get(request.getHeader("ROCKFISH_SESSION_KEY"));
			}catch(JedisException e){
				if (null != jedis) {  
					jedis.close();
	            }  
			}finally{
				if( jedis != null ){
					jedis.close();
				}
			}
			
			if("".equals(sessionValue)){
				return null;
			}else{
				return new Gson().fromJson(sessionValue, new TypeToken<HashMap<String,String>>(){}.getType());
			}
			
		}else{
			return null;
		}
	}
}
