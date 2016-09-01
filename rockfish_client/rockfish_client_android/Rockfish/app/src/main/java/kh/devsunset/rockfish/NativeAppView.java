/*
* @(#)NativeAppView.java
*/
package kh.devsunset.rockfish;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.loopj.android.http.FileAsyncHttpResponseHandler;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;

import cz.msebera.android.httpclient.Header;
import kh.devsunset.rockfish.httpclient.RockfishRestClient;

/**
 * <PRE>
 * Rockfish Native App Page
 * </PRE>
 * 
 * @author devsunset
 * @version 1.0
 * @since rockfish1.0
 */
public class NativeAppView extends Activity {

    private Spinner mSpMenusService = null;
    private EditText mEtIpport = null;
    private EditText mEtIdx = null;
    private EditText mEtTemp1 = null;
    private EditText mEtTemp2 = null;
    private EditText mEtTemp3 = null;

    private static final String LOGTAG = "ROCKFISH_NATIVE";

    public static final int REQ_CODE_SELECT_IMAGE=100;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nativeappview);
        setInit();
    }

    private void setInit() {
        mSpMenusService = (Spinner) this.findViewById(R.id.spmenus_service);
        ArrayAdapter<?> periodAdapter = ArrayAdapter.createFromResource(this,
                R.array.menus_service_array,
                android.R.layout.simple_spinner_item);

        periodAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mSpMenusService.setAdapter(periodAdapter);

        mEtIpport = (EditText)this.findViewById(R.id.etipport);
        mEtIdx = (EditText)this.findViewById(R.id.etidx);
        mEtTemp1 = (EditText)this.findViewById(R.id.ettemp1);
        mEtTemp2 = (EditText)this.findViewById(R.id.ettemp2);
        mEtTemp3 = (EditText)this.findViewById(R.id.ettemp3);

        final Button btGeneral = (Button) this.findViewById(R.id.ivGeneralReq);
        btGeneral.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String sIpport = mEtIpport.getText().toString();
                String sIdx = mEtIdx.getText().toString();
                String sTemp1 = mEtTemp1.getText().toString();
                String sTemp2 = mEtTemp2.getText().toString();
                String sTemp3 = mEtTemp3.getText().toString();

                Log.d(LOGTAG,"■■■■■ ROCKFISH GENERAL REQUEST ■■■■■");

                try{
                    //전송 Parameter 설정
                    HashMap<String,String> data = new HashMap<String,String>();
                    data.put("IDX",sIdx);
                    data.put("TEMP1",sTemp1);
                    data.put("TEMP2",sTemp2);
                    data.put("TEMP3",sTemp3);

                    //특정 Parameter 암호화 처리
                    ArrayList<String> encData = new ArrayList<String>();
                    encData.add("TEMP1");
                    encData.add("TEMP2");

                    //RockfishRestClient.request(sIpport,mSpMenusService.getSelectedItem().toString(), data, encData, new JsonHttpResponseHandler() { // 특정 parameter 암호화 처리
                    //RockfishRestClient.request(sIpport,mSpMenusService.getSelectedItem().toString(), data, RockfishRestClient.ROCKFISH_PARAMETER_ENCRYPT, new JsonHttpResponseHandler() { // 모든 Parameter 암호화 처리
                    RockfishRestClient.request(sIpport,mSpMenusService.getSelectedItem().toString(), data, null, new JsonHttpResponseHandler() { // 모든 Parameter 암호화 처리 안함
                        @Override
                        public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                            try {
                                Log.d(LOGTAG,"ROCKFISH_RESULT_CODE : " + response.get("ROCKFISH_RESULT_CODE"));
                                Log.d(LOGTAG,"ROCKFISH_RESULT_MESSAGE : "+response.get("ROCKFISH_RESULT_MESSAGE"));
                                Log.d(LOGTAG,"ROCKFISH_HTTP_STATUS_CODE : "+response.get("ROCKFISH_HTTP_STATUS_CODE"));
                                Log.d(LOGTAG,"ROCKFISH_HTTP_STATUS_MESSAGE : "+response.get("ROCKFISH_HTTP_STATUS_MESSAGE"));
                                Log.d(LOGTAG,"ROCKFISH_RESULT_JSON : "+response.getString("ROCKFISH_RESULT_JSON"));

                                if("ROCKFISH_LOGIN".equals(mSpMenusService.getSelectedItem().toString())
                                        && "S".equals( response.get("ROCKFISH_RESULT_CODE"))){
                                    String json = response.getString("ROCKFISH_RESULT_JSON");
                                    try {
                                        if(!"".equals(json)){
                                            JSONObject obj = new JSONObject(json);
                                            JSONObject objSub = (JSONObject) obj.get("DATA");
                                            if(objSub !=null){
                                                RockfishRestClient.setRockfishSaveData("rockfish_session_key",objSub.get("ROCKFISH_SESSION_KEY").toString());
                                                RockfishRestClient.setRockfishSaveData("rockfish_access_id",RockfishRestClient.rockfishEncrypted(objSub.get("ROCKFISH_ACCESS_ID").toString()));
                                            }
                                        }
                                    } catch (Throwable t) {
                                        Log.e(LOGTAG, "Could not parse malformed JSON: \"" + json + "\"");
                                    }
                                }

                                if("S".equals( response.get("ROCKFISH_RESULT_CODE"))){
                                    // To-Do string 형식의 json 값을 파싱하여 원하는 결과 로직 처리 하면 됨 ^^
                                    Toast.makeText(NativeAppView.this, "Request  Success" , Toast.LENGTH_SHORT).show();
                                    Toast.makeText(NativeAppView.this, "Request  Success =>[" + response.getString("ROCKFISH_RESULT_JSON") + "]", Toast.LENGTH_SHORT).show();
                                }else{
                                    Toast.makeText(NativeAppView.this, "Request Fail" , Toast.LENGTH_SHORT).show();
                                }
                            }catch(Exception e){
                                e.getStackTrace();
                            }
                        }

                        @Override
                        public void onFailure(int statusCode, Header[] headers,Throwable e, JSONObject response){
                            Toast.makeText(NativeAppView.this, "Fail => [status] : "+statusCode +" [err] : "+e.toString()+" [res] :"+response , Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onFailure(int statusCode, Header[] headers, String res, Throwable e){
                            Toast.makeText(NativeAppView.this, "Fail => [status] : "+statusCode +" [err] : "+e.toString()+" [res] :"+res , Toast.LENGTH_SHORT).show();
                        }

                    });

                }catch(Exception e){
                    e.getStackTrace();
                    Log.e(LOGTAG,"■■■■■ ROCKFISH GENERAL REQUEST ERROR ■■■■■"+e.getMessage());
                }
            }
        });

        final Button btFileChoose = (Button) this.findViewById(R.id.ivFileChoose);
        btFileChoose.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_PICK);
                intent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE);
                intent.setData(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(intent, REQ_CODE_SELECT_IMAGE);
            }
        });

        final Button btMultipart = (Button) this.findViewById(R.id.ivMultipartReq);
        btMultipart.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String sIpport = mEtIpport.getText().toString();
                String sIdx = mEtIdx.getText().toString();
                String sTemp1 = mEtTemp1.getText().toString();
                String sTemp2 = mEtTemp2.getText().toString();
                String sTemp3 = mEtTemp3.getText().toString();

                Log.d(LOGTAG,"■■■■■ ROCKFISH MULTIPART REQUEST ■■■■■");

                try{
                    //전송 Parameter 설정
                    HashMap<String,String> data = new HashMap<String,String>();
                    data.put("IDX",sIdx);
                    data.put("TEMP1",sTemp1);
                    data.put("TEMP2",sTemp2);
                    data.put("TEMP3",sTemp3);

                    //특정 Parameter 암호화 처리
                    ArrayList<String> encData = new ArrayList<String>();
                    encData.add("TEMP1");
                    encData.add("TEMP2");

                    HashMap<String,Object> fileData = new HashMap<String,Object>();

                    //RockfishRestClient.request(sIpport,mSpMenusService.getSelectedItem().toString(), data, encData,fileData, new JsonHttpResponseHandler() { // 특정 parameter 암호화 처리
                    //RockfishRestClient.request(sIpport,mSpMenusService.getSelectedItem().toString(), data, RockfishRestClient.ROCKFISH_PARAMETER_ENCRYPT,fileData, new JsonHttpResponseHandler() { // 모든 Parameter 암호화 처리
                    RockfishRestClient.requestMultipart(sIpport,"ROCKFISH MULTIPART UPLOAD", data, null,fileData,new JsonHttpResponseHandler() { // 모든 Parameter 암호화 처리 안함
                        @Override
                        public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                            try {
                                Log.d(LOGTAG,"ROCKFISH_RESULT_CODE : " + response.get("ROCKFISH_RESULT_CODE"));
                                Log.d(LOGTAG,"ROCKFISH_RESULT_MESSAGE : "+response.get("ROCKFISH_RESULT_MESSAGE"));
                                Log.d(LOGTAG,"ROCKFISH_HTTP_STATUS_CODE : "+response.get("ROCKFISH_HTTP_STATUS_CODE"));
                                Log.d(LOGTAG,"ROCKFISH_HTTP_STATUS_MESSAGE : "+response.get("ROCKFISH_HTTP_STATUS_MESSAGE"));
                                Log.d(LOGTAG,"ROCKFISH_RESULT_JSON : "+response.getString("ROCKFISH_RESULT_JSON"));

                                if("S".equals( response.get("ROCKFISH_RESULT_CODE"))){
                                    // To-Do string 형식의 json 값을 파싱하여 원하는 결과 로직 처리 하면 됨 ^^
                                    Toast.makeText(NativeAppView.this, "Request  Success" , Toast.LENGTH_SHORT).show();
                                    Toast.makeText(NativeAppView.this, "Request  Success =>[" + response.getString("ROCKFISH_RESULT_JSON") + "]", Toast.LENGTH_SHORT).show();
                                }else{
                                    Toast.makeText(NativeAppView.this, "Request Fail" , Toast.LENGTH_SHORT).show();
                                }
                            }catch(Exception e){
                                e.getStackTrace();
                            }
                        }

                        @Override
                        public void onFailure(int statusCode, Header[] headers,Throwable e, JSONObject response){
                            Toast.makeText(NativeAppView.this, "Fail => [status] : "+statusCode +" [err] : "+e.toString()+" [res] :"+response , Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onFailure(int statusCode, Header[] headers, String res, Throwable e){
                            Toast.makeText(NativeAppView.this, "Fail => [status] : "+statusCode +" [err] : "+e.toString()+" [res] :"+res , Toast.LENGTH_SHORT).show();
                        }

                    });

                }catch(Exception e){
                    e.getStackTrace();
                    Log.e(LOGTAG,"■■■■■ ROCKFISH GENERAL REQUEST ERROR ■■■■■"+e.getMessage());
                }

            }
        });

        final Button btDownload = (Button) this.findViewById(R.id.ivDownloadReq);
        btDownload.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String sIpport = mEtIpport.getText().toString();
                String sIdx = mEtIdx.getText().toString();
                String sTemp1 = mEtTemp1.getText().toString();
                String sTemp2 = mEtTemp2.getText().toString();
                String sTemp3 = mEtTemp3.getText().toString();

                Log.d(LOGTAG,"■■■■■ ROCKFISH DOWNLOAD REQUEST ■■■■■");

                try{
                    //전송 Parameter 설정
                    HashMap<String,String> data = new HashMap<String,String>();
                    data.put("IDX",sIdx);
                    data.put("TEMP1",sTemp1);
                    data.put("TEMP2",sTemp2);
                    data.put("TEMP3",sTemp3);

                    //특정 Parameter 암호화 처리
                    ArrayList<String> encData = new ArrayList<String>();
                    encData.add("TEMP1");
                    encData.add("TEMP2");

                    // TO-DO 파일 저장 시 프로그레스바 구현해서 사용

                    //RockfishRestClient.request(sIpport,"ROCKFISH_GENERAL_DOWNLOAD", data, encData, FileAsyncHttpResponseHandler(NativeAppView.this) { // 특정 parameter 암호화 처리
                    //RockfishRestClient.request(sIpport,"ROCKFISH_GENERAL_DOWNLOAD", data, RockfishRestClient.ROCKFISH_PARAMETER_ENCRYPT, FileAsyncHttpResponseHandler(NativeAppView.this) { // 모든 Parameter 암호화 처리
                    RockfishRestClient.requestDownload(sIpport,"ROCKFISH_GENERAL_DOWNLOAD", data, null, new FileAsyncHttpResponseHandler(NativeAppView.this) { // 모든 Parameter 암호화 처리 안함
                        @Override
                        public void onSuccess(int statusCode, Header[] headers, File response) {
                            Toast.makeText(NativeAppView.this, "Request  Success" , Toast.LENGTH_SHORT).show();
                            if(response !=null){
                                if(copyFile(response,Environment.getExternalStoragePublicDirectory( Environment.DIRECTORY_DOWNLOADS )+File.separator+"rockfish_download.jpg")){
                                    Toast.makeText(NativeAppView.this, "Request Save Success : Download 폴더에 파일 저장 되었음 ", Toast.LENGTH_SHORT).show();
                                }else{
                                    Toast.makeText(NativeAppView.this, "Request  Save Fail ", Toast.LENGTH_SHORT).show();
                                }
                            }
                        }

                        @Override
                        public void onFailure(int statusCode, Header[] headers, Throwable e, File response){
                            Toast.makeText(NativeAppView.this, "Fail => [status] : "+statusCode +" [err] : "+e.toString(), Toast.LENGTH_SHORT).show();
                        }

                    });

                }catch(Exception e){
                    e.getStackTrace();
                    Log.e(LOGTAG,"■■■■■ ROCKFISH DOWNLOAD REQUEST ERROR ■■■■■"+e.getMessage());
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Toast.makeText(getBaseContext(), "resultCode : "+resultCode,Toast.LENGTH_SHORT).show();
        if(requestCode == REQ_CODE_SELECT_IMAGE){
            if(resultCode==Activity.RESULT_OK){
                try {
                    Toast.makeText(getBaseContext(), "name_Str : "+data.getData() , Toast.LENGTH_SHORT).show();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

//    public String getImageNameToUri(Uri data) {
//        String[] proj = { MediaStore.Images.Media.DATA };
//        Cursor cursor = managedQuery(data, proj, null, null, null);
//        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
//
//        cursor.moveToFirst();
//
//        String imgPath = cursor.getString(column_index);
//        String imgName = imgPath.substring(imgPath.lastIndexOf("/")+1);
//
//        return imgName;
//    }

    private boolean copyFile(File file , String save_file){
        boolean result = false;
        if(file!=null&&file.exists()){
            FileInputStream fis = null;
            FileOutputStream newfos = null;
            try {
                 fis = new FileInputStream(file);
                 newfos = new FileOutputStream(save_file);
                int readcount=0;
                byte[] buffer = new byte[1024];
                while((readcount = fis.read(buffer,0,1024))!= -1){
                    newfos.write(buffer,0,readcount);
                }
                if(newfos !=null){
                    newfos.close();
                }

                if(fis !=null){
                    fis.close();
                }
                result = true;
            } catch (Exception e) {
                e.printStackTrace();
                result = false;
            }finally{
                try{
                    if(newfos !=null){
                        newfos.close();
                    }

                    if(fis !=null){
                        fis.close();
                    }
                }catch (Exception e){
                    result = false;
                }
            }
        }else{
            result = false;
        }
        return result;
    }
}