package kh.devsunset.rockfish.httpclient;

import android.app.Activity;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.preference.PreferenceManager;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.Base64;
import com.loopj.android.http.FileAsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;

import javax.crypto.Cipher;

import kh.devsunset.rockfish.MyApplication;

public class RockfishRestClient extends Activity{
    //HTTP
    //private static final String HTTP_HTTPS_BASE_URL = "http://10.0.2.2:8888/rockfishController";
    //private static AsyncHttpClient client = new AsyncHttpClient();

    //HTTPS
    //private static final String HTTP_HTTPS_BASE_URL = "https://10.0.2.2:9999/rockfishController";
    private static AsyncHttpClient client = new AsyncHttpClient(true, 8888, 9999);

    private static PublicKey publicKey = null;
    private static final String ROCKFISH_CLIENT_TYPE = "ANDROID";
    private static final String ROCKFISH_GENERAL_SEND_TYPE = "G";
    private static final String ROCKFISH_MULTIPART_SEND_TYPE = "M";
    private static final String ROCKFISH_DOWNLOAD_SEND_TYPE = "D";
    public static final String ROCKFISH_PARAMETER_ENCRYPT = "ROCKFISH_PARAMETER_ENCRYPT";
    private static final String LOGTAG = "ROCKFISH_REST_CLIENT";

    private static  String ROCKFISH_IP = "";
    private static  String ROCKFISH_MAC = "";
    private static  String ROCKFISH_PHONE = "";
    private static  String ROCKFISH_APP_NAME = "";
    private static  String ROCKFISH_APP_VERSION = "";

    /**
     *  To-Do : Rockfish Client Android Info
     */
    public static void initClientInfo(){
        if("".equals(ROCKFISH_APP_NAME)){
            try {
                for (Enumeration en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {
                    NetworkInterface intf = (NetworkInterface)en.nextElement();
                    for (Enumeration enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {
                        InetAddress inetAddress = (InetAddress)enumIpAddr.nextElement();
                        if (!inetAddress.isLoopbackAddress()) {
                            ROCKFISH_IP = inetAddress.getHostAddress().toString();
                        }
                    }
                }
            } catch (SocketException ex) {  }

            try {
                WifiManager mng = (WifiManager) MyApplication.getAppContext().getSystemService(MyApplication.getAppContext().WIFI_SERVICE);
                WifiInfo info = mng.getConnectionInfo();
                ROCKFISH_MAC = info.getMacAddress();
            } catch(Exception e) { }// ignore

            try {
                TelephonyManager mngSub = (TelephonyManager)MyApplication.getAppContext().getSystemService(MyApplication.getAppContext().TELEPHONY_SERVICE);
                ROCKFISH_PHONE = mngSub.getLine1Number();
            } catch(Exception e) { }// ignore


            try {
                PackageInfo i = MyApplication.getAppContext().getPackageManager().getPackageInfo(MyApplication.getAppContext().getPackageName(), 0);
                PackageManager pm = MyApplication.getAppContext().getPackageManager();
                ROCKFISH_APP_NAME = (String) i.applicationInfo.loadLabel(pm);
                ROCKFISH_APP_VERSION = i.versionName;
            } catch(Exception e) {
                ROCKFISH_APP_NAME = "Rockfish";
                ROCKFISH_APP_VERSION = "1.0.0";
            }
        }
    }

    /**
     * rockfish http request common method
     * @param ipport
     * @param service
     * @param data
     * @param encdata
     * @param responseHandler
     * @throws Exception
     */
    public static void request(String ipport,String service, HashMap<String, String> data, Object encdata, AsyncHttpResponseHandler responseHandler) throws Exception {

        initClientInfo();

        String encParameter = "";
        if(encdata !=null){ // Parameter 암호화 처리 안함
            if (encdata instanceof ArrayList) { // 특정 Parameter 암호화
                if(encdata !=null && !((ArrayList) encdata).isEmpty()){
                    for(String s : (ArrayList<String>)encdata){
                       if(data !=null && data.get(s) !=null && !"".equals( data.get(s))){
                            data.put(s,rockfishEncrypted(data.get(s)));
                            encParameter +=s+"|^|";
                        }
                    }
                }
            }else if (encdata instanceof String) {
                if(ROCKFISH_PARAMETER_ENCRYPT.equals(encdata)){
                    if(data !=null && !data.isEmpty()){
                        ArrayList<String> encDataTemp = new ArrayList<String>();
                        Iterator<String> iterator = data.keySet().iterator();
                        while (iterator.hasNext()) {
                            String key = (String) iterator.next();
                            encDataTemp.add(key);
                        }

                        if(encDataTemp !=null && !encDataTemp.isEmpty()){
                            for(String s : encDataTemp){
                                if(data !=null && data.get(s) !=null && !"".equals( data.get(s))){
                                    data.put(s,rockfishEncrypted(data.get(s)));
                                    encParameter +=s+"|^|";
                                }
                            }
                        }
                    }
                }else{
                    Log.d(LOGTAG," not support enc string type : "+encdata);
                }
            }else{
                Log.d(LOGTAG," not support enc type : "+encdata);
            }
        }

        /* ROCKFISH CUSTMOMER HEADER*/
        client.addHeader("rockfish_session_key",getRockfishSaveData("rockfish_session_key"));
        client.addHeader("rockfish_access_id",getRockfishSaveData("rockfish_access_id"));
            // 개인 정보 여부 판단 하여 값 설정 필요 /////////////////
            client.addHeader("rockfish_ip",rockfishEncrypted(ROCKFISH_IP));
            client.addHeader("rockfish_mac",rockfishEncrypted(ROCKFISH_MAC));
            client.addHeader("rockfish_phone",rockfishEncrypted(ROCKFISH_PHONE));
            client.addHeader("rockfish_device",rockfishEncrypted(Build.MODEL));
            client.addHeader("rockfish_imei",rockfishEncrypted(Build.SERIAL));
            ///////////////////////////////////////////////////////////
        client.addHeader("rockfish_os_version", String.valueOf(Build.VERSION.SDK_INT));
        client.addHeader("rockfish_os_version_desc",Build.VERSION.RELEASE);
        client.addHeader("rockfish_os",ROCKFISH_CLIENT_TYPE);
        client.addHeader("rockfish_target_service",service);
        client.addHeader("rockfish_client_app",ROCKFISH_APP_NAME);
        client.addHeader("rockfish_client_app_version",ROCKFISH_APP_VERSION);
        client.addHeader("rockfish_send_type",ROCKFISH_GENERAL_SEND_TYPE);
        client.addHeader("rockfish_encrypt_parameter",encParameter);
        /* ROCKFISH CUSTMOMER HEADER*/


        RequestParams params = new RequestParams(data);
        client.post("https://"+ipport+"/rockfishController", params, responseHandler);
    }

    /**
     * rockfish http request common method
     * @param ipport
     * @param service
     * @param data
     * @param encdata
     * @param responseHandler
     * @throws Exception
     */
    public static void requestMultipart(String ipport,String service, HashMap<String, String> data, Object encdata,HashMap<String,Object> fileData, AsyncHttpResponseHandler responseHandler) throws Exception {

        initClientInfo();

        String encParameter = "";
        if(encdata !=null){ // Parameter 암호화 처리 안함
            if (encdata instanceof ArrayList) { // 특정 Parameter 암호화
                if(encdata !=null && !((ArrayList) encdata).isEmpty()){
                    for(String s : (ArrayList<String>)encdata){
                        if(data !=null && data.get(s) !=null && !"".equals( data.get(s))){
                            data.put(s,rockfishEncrypted(data.get(s)));
                            encParameter +=s+"|^|";
                        }
                    }
                }
            }else if (encdata instanceof String) {
                if(ROCKFISH_PARAMETER_ENCRYPT.equals(encdata)){
                    if(data !=null && !data.isEmpty()){
                        ArrayList<String> encDataTemp = new ArrayList<String>();
                        Iterator<String> iterator = data.keySet().iterator();
                        while (iterator.hasNext()) {
                            String key = (String) iterator.next();
                            encDataTemp.add(key);
                        }

                        if(encDataTemp !=null && !encDataTemp.isEmpty()){
                            for(String s : encDataTemp){
                                if(data !=null && data.get(s) !=null && !"".equals( data.get(s))){
                                    data.put(s,rockfishEncrypted(data.get(s)));
                                    encParameter +=s+"|^|";
                                }
                            }
                        }
                    }
                }else{
                    Log.d(LOGTAG," not support enc string type : "+encdata);
                }
            }else{
                Log.d(LOGTAG," not support enc type : "+encdata);
            }
        }

        /* ROCKFISH CUSTMOMER HEADER*/
        client.addHeader("rockfish_session_key",getRockfishSaveData("rockfish_session_key"));
        client.addHeader("rockfish_access_id",getRockfishSaveData("rockfish_access_id"));
            // 개인 정보 여부 판단 하여 값 설정 필요 /////////////////
            client.addHeader("rockfish_ip",rockfishEncrypted(ROCKFISH_IP));
            client.addHeader("rockfish_mac",rockfishEncrypted(ROCKFISH_MAC));
            client.addHeader("rockfish_phone",rockfishEncrypted(ROCKFISH_PHONE));
            client.addHeader("rockfish_device",rockfishEncrypted(Build.MODEL));
            client.addHeader("rockfish_imei",rockfishEncrypted(Build.SERIAL));
            ///////////////////////////////////////////////////////////
        client.addHeader("rockfish_os_version", String.valueOf(Build.VERSION.SDK_INT));
        client.addHeader("rockfish_os_version_desc",Build.VERSION.RELEASE);
        client.addHeader("rockfish_os",ROCKFISH_CLIENT_TYPE);
        client.addHeader("rockfish_target_service",service);
        client.addHeader("rockfish_client_app",ROCKFISH_APP_NAME);
        client.addHeader("rockfish_client_app_version",ROCKFISH_APP_VERSION);
        client.addHeader("rockfish_send_type",ROCKFISH_MULTIPART_SEND_TYPE);
        client.addHeader("rockfish_encrypt_parameter",encParameter);
        /* ROCKFISH CUSTMOMER HEADER*/

        RequestParams params = new RequestParams(data);

        // [reference] : http://loopj.com/android-async-http/
        //Add an InputStream to the RequestParams to upload:
            //InputStream myInputStream = blah;
            //RequestParams params = new RequestParams();
            //params.put("secret_passwords", myInputStream, "passwords.txt");


        //Add a File object to the RequestParams to upload:
            //File myFile = new File("/path/to/file.png");
            //RequestParams params = new RequestParams();
            //try {
            //    params.put("profile_picture", myFile);
            //} catch(FileNotFoundException e) {}


        //Add a byte array to the RequestParams to upload:
            //byte[] myByteArray = blah;
            //RequestParams params = new RequestParams();
            //params.put("soundtrack", new ByteArrayInputStream(myByteArray), "she-wolf.mp3");

        if(fileData !=null){
            Iterator<String> iterator = fileData.keySet().iterator();
            while (iterator.hasNext()) {
                String key = (String) iterator.next();
                if(fileData.get(key) instanceof InputStream) {
                    try {
                        String [] keys = key.split("\\^");
                        if(keys !=null && keys.length == 2){
                            // keys[0] parameter name , keys[1] file name
                            params.put(keys[0], (InputStream) fileData.get(key), keys[1]);
                        }
                    } catch(Exception e) {
                        throw e;
                    }
                }else if(fileData.get(key) instanceof String){
                    try {
                        params.put(key, new File(fileData.get(key).toString()));
                    } catch(FileNotFoundException e) {
                        throw e;
                    }
                }else if(fileData.get(key) instanceof byte[]){
                    try {
                        String [] keys = key.split("\\^");
                        if(keys !=null && keys.length == 2){
                            // keys[0] parameter name , keys[1] file name
                            params.put(key, new ByteArrayInputStream((byte[]) fileData.get(key)), "she-wolf.mp3");
                        }
                    } catch(Exception e) {
                        throw e;
                    }
                }
            }
        }

        client.post("https://"+ipport+"/rockfishController", params, responseHandler);
    }

    /**
     * rockfish http request common method
     * @param ipport
     * @param service
     * @param data
     * @param encdata
     * @param responseHandler
     * @throws Exception
     */
    public static void requestDownload(String ipport,String service, HashMap<String, String> data, Object encdata, FileAsyncHttpResponseHandler responseHandler) throws Exception {

        initClientInfo();

        String encParameter = "";
        if(encdata !=null){ // Parameter 암호화 처리 안함
            if (encdata instanceof ArrayList) { // 특정 Parameter 암호화
                if(encdata !=null && !((ArrayList) encdata).isEmpty()){
                    for(String s : (ArrayList<String>)encdata){
                        if(data !=null && data.get(s) !=null && !"".equals( data.get(s))){
                            data.put(s,rockfishEncrypted(data.get(s)));
                            encParameter +=s+"|^|";
                        }
                    }
                }
            }else if (encdata instanceof String) {
                if(ROCKFISH_PARAMETER_ENCRYPT.equals(encdata)){
                    if(data !=null && !data.isEmpty()){
                        ArrayList<String> encDataTemp = new ArrayList<String>();
                        Iterator<String> iterator = data.keySet().iterator();
                        while (iterator.hasNext()) {
                            String key = (String) iterator.next();
                            encDataTemp.add(key);
                        }

                        if(encDataTemp !=null && !encDataTemp.isEmpty()){
                            for(String s : encDataTemp){
                                if(data !=null && data.get(s) !=null && !"".equals( data.get(s))){
                                    data.put(s,rockfishEncrypted(data.get(s)));
                                    encParameter +=s+"|^|";
                                }
                            }
                        }
                    }
                }else{
                    Log.d(LOGTAG," not support enc string type : "+encdata);
                }
            }else{
                Log.d(LOGTAG," not support enc type : "+encdata);
            }
        }

        /* ROCKFISH CUSTMOMER HEADER*/
        client.addHeader("rockfish_session_key",getRockfishSaveData("rockfish_session_key"));
        client.addHeader("rockfish_access_id",getRockfishSaveData("rockfish_access_id"));
            // 개인 정보 여부 판단 하여 값 설정 필요 /////////////////
            client.addHeader("rockfish_ip",rockfishEncrypted(ROCKFISH_IP));
            client.addHeader("rockfish_mac",rockfishEncrypted(ROCKFISH_MAC));
            client.addHeader("rockfish_phone",rockfishEncrypted(ROCKFISH_PHONE));
            client.addHeader("rockfish_device",rockfishEncrypted(Build.MODEL));
            client.addHeader("rockfish_imei",rockfishEncrypted(Build.SERIAL));
            ///////////////////////////////////////////////////////////
        client.addHeader("rockfish_os_version", String.valueOf(Build.VERSION.SDK_INT));
        client.addHeader("rockfish_os_version_desc",Build.VERSION.RELEASE);
        client.addHeader("rockfish_os",ROCKFISH_CLIENT_TYPE);
        client.addHeader("rockfish_target_service",service);
        client.addHeader("rockfish_client_app",ROCKFISH_APP_NAME);
        client.addHeader("rockfish_client_app_version",ROCKFISH_APP_VERSION);
        client.addHeader("rockfish_send_type",ROCKFISH_DOWNLOAD_SEND_TYPE);
        client.addHeader("rockfish_encrypt_parameter",encParameter);
        /* ROCKFISH CUSTMOMER HEADER*/


        RequestParams params = new RequestParams(data);
        client.post("https://"+ipport+"/rockfishController", params, responseHandler);
    }

    /**
     * SharedPreferences get Data
     * @param key
     * @return
     */
    public  static String getRockfishSaveData(String key){
        String keyValue;
        try{
            SharedPreferences mPref = PreferenceManager.getDefaultSharedPreferences(MyApplication.getAppContext());
            keyValue =  mPref.getString(key, "");
        }catch(Exception e){
            Log.d(LOGTAG,"■■■■■ getRockfishSaveData ■■■■■ error : "+e.toString());
            keyValue = "";
        }
        return keyValue;
    }

    /**
     * SharedPreferences set Data
     * @param key
     * @param value
     */
    public static void setRockfishSaveData(String key,String value){
        try{
            SharedPreferences mPref = PreferenceManager.getDefaultSharedPreferences(MyApplication.getAppContext());
            SharedPreferences.Editor editor = mPref.edit();
            editor.remove(key);
            editor.commit();

            editor.putString(key, value);
            editor.commit();
        }catch(Exception e){
            Log.d(LOGTAG,"■■■■■ setRockfishSaveData ■■■■■ error : "+e.toString());
        }
    }

    /**
     * RSA Encrypted method
     * @param str  plain text
     * @return encrypted text
     * @throws Exception
     */
    public static String rockfishEncrypted(String str)  throws Exception {
        if(str == null || "".equals(str) || "".equals(str.trim())){
            return "";
        }

        String returnEncryptedValue = "";
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1PADDING");
        cipher.init(Cipher.ENCRYPT_MODE, getPublicKey());
        byte[] arrCipherData = cipher.doFinal(str.getBytes());
        returnEncryptedValue = Base64.encodeToString(arrCipherData,Base64.NO_WRAP);
        return returnEncryptedValue;
    }

    /**
     * public key generator method
     * @return PublicKey
     * @throws Exception
     */
    public static PublicKey getPublicKey()  throws Exception {
        if(publicKey == null){
            String pubKey ="-----BEGIN PUBLIC KEY-----\n";
            pubKey +="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA11iUtP4coVGcrLKryIkg\n";
            pubKey +="Iwt3qS4yR9F963ockxfvwUsjKsEBQdOc6Ef79LWK3qAFiFkM/h+rk19UQYe/iBKr\n";
            pubKey +="YPggFX+/eRT5Ubkd2Pgfje1L4g2/hJZ53n95e/pGFwjMpGBWvvnE0EoLR8RjX/5S\n";
            pubKey +="qLVZpFGZEvAnevwua5igi2Mn0y9Sx0z+8tUKaAAM7p7VlbxhdbDra9/nC8fWaHVy\n";
            pubKey +="PKs0TmxQcolaPMQwdtJTCrSCs8nx/aAxsWhzuc/mXDChBemAhpfBS94/mAdkKdU8\n";
            pubKey +="746z3axU06umIxJU44jPwGiG4M8HofnTkDfpfKIrat8St/lc9Lp0ulDm82CdR/dd\n";
            pubKey +="CwIDAQAB\n";

            byte[] keyBytes = null;
            X509EncodedKeySpec spec = null;
            KeyFactory keyFactory = null;

            pubKey = new String(pubKey.getBytes(), "UTF-8");
            pubKey = pubKey.replaceAll("(-+BEGIN PUBLIC KEY-+\\r?\\n|-+END PUBLIC KEY-+\\r?\\n?)", "");

            keyBytes = Base64.decode(pubKey,Base64.NO_WRAP);
            spec = new X509EncodedKeySpec(keyBytes);
            keyFactory = KeyFactory.getInstance("RSA");
            publicKey = keyFactory.generatePublic(spec);
            return publicKey;
        }else{
            return publicKey;
        }
    }
}
