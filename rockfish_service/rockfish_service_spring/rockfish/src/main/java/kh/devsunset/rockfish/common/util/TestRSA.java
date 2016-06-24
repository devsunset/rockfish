/*
 * @(#)TestRSA.java
 * Copyright: (C) 2016 by devsunset@gmail.com All right reserved.
 */
package kh.devsunset.rockfish.common.util;

import java.io.FileInputStream;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;

/**
 * <PRE>
 * TestRSA
 * </PRE>
 * @author devsunset@gmail.com
 */
public class TestRSA {
	public static final String ALGORITHM = "RSA";
	public static final String PRIVATE_KEY_FILE = TestRSA.class.getResource(".").getPath()+"privkey.pem";
	public static final String PUBLIC_KEY_FILE = TestRSA.class.getResource(".").getPath()+"pubkey.pem";

	public static void main(String[] args) throws Exception {
		FileInputStream in = new FileInputStream(PUBLIC_KEY_FILE);
		byte[] keyBytes = new byte[in.available()];
		in.read(keyBytes);
		in.close();

		String pubKey = new String(keyBytes, "UTF-8");
		pubKey = pubKey.replaceAll("(-+BEGIN PUBLIC KEY-+\\r?\\n|-+END PUBLIC KEY-+\\r?\\n?)", "");
		keyBytes = Base64.decodeBase64(pubKey);

		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		PublicKey publicKey = keyFactory.generatePublic(spec);

		System.out.println(String.format("Key format: %s, algorithm: %s", publicKey.getFormat(), publicKey.getAlgorithm()));
		
		
		
		String inputStr = "rockfish"; 

        // Encrypted
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] arrCipherData = cipher.doFinal(inputStr.getBytes()); 
        System.out.println(Base64.encodeBase64String(arrCipherData));
        
        // Decrypted
        PrivateKeyReader privateKey = new PrivateKeyReader(PRIVATE_KEY_FILE);
        cipher.init(Cipher.DECRYPT_MODE, privateKey.getPrivateKey());
        byte[] plainText = cipher.doFinal(arrCipherData);
        System.out.println("plain text : " + new String(plainText));
	}
}