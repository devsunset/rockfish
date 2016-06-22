/*
 * @(#)DBPasswordEncrypt.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.util;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

/**
 * <PRE>
 * DBPasswordEncrypt
 * </PRE>
 * @author devsunset@gmail.com
 */
public class DBPasswordEncrypt {

	public static void main(String[] args) {
		StandardPBEStringEncryptor standardPBEStringEncryptor = new StandardPBEStringEncryptor();  
		standardPBEStringEncryptor.setAlgorithm("PBEWithMD5AndDES");  
		standardPBEStringEncryptor.setPassword("ROCKFISH_PASS");  
		String encodedPass = standardPBEStringEncryptor.encrypt("rockfish");  
		System.out.println("Encrypted Password for admin is : "+encodedPass);  
	}
}
