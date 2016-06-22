/*
 * @(#)CommonDao.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.dao;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/**
 * <PRE>
 * CommonDao
 * </PRE>
 * @author devsunset@gmail.com
 */
@Repository("commonDao")
public class CommonDao {
	private static final Logger log = Logger.getLogger(CommonDao.class);
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	public Object selectOne(String queryId){
		return sqlSession.selectOne(queryId);
	}
	
	protected void printQueryId(String queryId) {
		if(log.isDebugEnabled()){
			log.debug("\t QueryId  \t:  " + queryId);
		}
	}
	
	public Object selectOne(String queryId, Object params){
		printQueryId(queryId);
		return sqlSession.selectOne(queryId, params);
	}
	
	@SuppressWarnings("rawtypes")
	public List selectList(String queryId){
		printQueryId(queryId);
		return sqlSession.selectList(queryId);
	}
	
	@SuppressWarnings("rawtypes")
	public List selectList(String queryId, Object params){
		printQueryId(queryId);
		return sqlSession.selectList(queryId,params);
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List selectPagingList(String queryId, Object params){
		printQueryId(queryId);
		Map<String,Object> map = (Map<String,Object>)params;
		
		String strPageIndex = (String)map.get("ROCKFISH_PAGE_INDEX");
		String strPageRow = (String)map.get("ROCKFISH_PAGE_ROW");
		int nPageIndex = 0;
		int nPageRow = 20;
		
		if(StringUtils.isEmpty(strPageIndex) == false){
			nPageIndex = Integer.parseInt(strPageIndex)-1;
		}
		if(StringUtils.isEmpty(strPageRow) == false){
			nPageRow = Integer.parseInt(strPageRow);
		}
		map.put("ROCKFISH_START_PAGE_NUM", (nPageIndex * nPageRow) + 1);
		map.put("ROCKFISH_END_PAGE_NUM", (nPageIndex * nPageRow) + nPageRow);
		
		return sqlSession.selectList(queryId, map);
	}
	
	public Object insert(String queryId){
		printQueryId(queryId);
		return sqlSession.insert(queryId);
	}
	
	public Object insert(String queryId, Object params){
		printQueryId(queryId);
		return sqlSession.insert(queryId, params);
	}
	
	public Object update(String queryId){
		printQueryId(queryId);
		return sqlSession.update(queryId);
	}
	
	public Object update(String queryId, Object params){
		printQueryId(queryId);
		return sqlSession.update(queryId, params);
	}
	
	public Object delete(String queryId){
		printQueryId(queryId);
		return sqlSession.delete(queryId);
	}
	
	public Object delete(String queryId, Object params){
		printQueryId(queryId);
		return sqlSession.delete(queryId, params);
	}
}