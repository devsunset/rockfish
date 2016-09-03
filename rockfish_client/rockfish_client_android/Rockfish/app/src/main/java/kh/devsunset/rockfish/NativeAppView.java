/*
* @(#)NativeAppView.java
*/
package kh.devsunset.rockfish;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
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
    public static HashMap<String,String> UPLOAD_IMAGE_DATA = new HashMap<String,String>();

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
                                Toast.makeText(NativeAppView.this,"■■■■■ ROCKFISH GENERAL REQUEST ERROR ■■■■■"+e.getMessage(), Toast.LENGTH_SHORT).show();
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
                    Toast.makeText(NativeAppView.this,"■■■■■ ROCKFISH GENERAL REQUEST ERROR ■■■■■"+e.getMessage(), Toast.LENGTH_SHORT).show();
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

                    if(UPLOAD_IMAGE_DATA !=null && !UPLOAD_IMAGE_DATA.isEmpty()){

                        // [reference] : http://loopj.com/android-async-http/
                        //Add an InputStream to the RequestParams to upload:
                        //InputStream myInputStream = blah;
                        //RequestParams params = new RequestParams();
                        //params.put("secret_passwords", myInputStream, "passwords.txt");

                        // ex) fileData.put("soundtrack^she-wolf.mp3",InputStream 데이타); // InputStream 으로 첨부 하는 경우


                        //Add a File object to the RequestParams to upload:
                        //File myFile = new File("/path/to/file.png");
                        //RequestParams params = new RequestParams();
                        //try {
                        //    params.put("profile_picture", myFile);
                        //} catch(FileNotFoundException e) {}

                        fileData.put("ATTACH_IMAGE_FILE",UPLOAD_IMAGE_DATA.get("IMAGE_DATA")); // 파일 경로 전달 하여 첨부 (공통에서 파일 경로로 파일 객체 생성)


                        //Add a byte array to the RequestParams to upload:
                        //byte[] myByteArray = blah;
                        //RequestParams params = new RequestParams();
                        //params.put("soundtrack", new ByteArrayInputStream(myByteArray), "she-wolf.mp3");

                        //ex) fileData.put("ATTACH_IMAGE_FILE^첨부파일명",byte array 데이타 ); // byte array 첨부 하는 경우
                    }

                    RockfishRestClient.requestMultipart(sIpport,"ROCKFISH_MULTIPART_UPLOAD", data, encData,fileData, new JsonHttpResponseHandler() { // 특정 parameter 암호화 처리
                    //RockfishRestClient.requestMultipart(sIpport,mSpMenusService.getSelectedItem().toString(), data, RockfishRestClient.ROCKFISH_PARAMETER_ENCRYPT,fileData, new JsonHttpResponseHandler() { // 모든 Parameter 암호화 처리
                    //RockfishRestClient.requestMultipart(sIpport,"ROCKFISH MULTIPART UPLOAD", data, null,fileData,new JsonHttpResponseHandler() { // 모든 Parameter 암호화 처리 안함
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
                                    UPLOAD_IMAGE_DATA.clear();
                                }else{
                                    Toast.makeText(NativeAppView.this, "Request Fail" , Toast.LENGTH_SHORT).show();
                                }
                            }catch(Exception e){
                                e.getStackTrace();
                                Toast.makeText(NativeAppView.this,"■■■■■ ROCKFISH MULTIPART REQUEST ERROR ■■■■■"+e.getMessage(), Toast.LENGTH_SHORT).show();
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
                    Log.e(LOGTAG,"■■■■■ ROCKFISH MULTIPART REQUEST ERROR ■■■■■"+e.getMessage());
                    Toast.makeText(NativeAppView.this,"■■■■■ ROCKFISH MULTIPART REQUEST ERROR ■■■■■"+e.getMessage(), Toast.LENGTH_SHORT).show();
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
                    //RockfishRestClient.requestDownload(sIpport,"ROCKFISH_GENERAL_DOWNLOAD", data, encData, FileAsyncHttpResponseHandler(NativeAppView.this) { // 특정 parameter 암호화 처리
                    //RockfishRestClient.requestDownload(sIpport,"ROCKFISH_GENERAL_DOWNLOAD", data, RockfishRestClient.ROCKFISH_PARAMETER_ENCRYPT, FileAsyncHttpResponseHandler(NativeAppView.this) { // 모든 Parameter 암호화 처리
                    RockfishRestClient.requestDownload(sIpport,"ROCKFISH_GENERAL_DOWNLOAD", data, null, new FileAsyncHttpResponseHandler(NativeAppView.this) { // 모든 Parameter 암호화 처리 안함
                        @Override
                        public void onSuccess(int statusCode, Header[] headers, File response) {
                            Toast.makeText(NativeAppView.this, "Request  Success" , Toast.LENGTH_SHORT).show();
                            if(response !=null && headers !=null){
                                String fileName = "";
                                for(int i=0;i<headers.length;i++){
                                    if("content-disposition".equalsIgnoreCase(headers[i].getName())){
                                        fileName = headers[i].getValue().substring(headers[i].getValue().indexOf("filename=")+9,headers[i].getValue().length());
                                    }
                                }
                                if(RockfishRestClient.copyFile(response,Environment.getExternalStoragePublicDirectory( Environment.DIRECTORY_DOWNLOADS )+File.separator+fileName)){
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
                    Toast.makeText(NativeAppView.this,"■■■■■ ROCKFISH DOWNLOAD REQUEST ERROR ■■■■■"+e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(requestCode == REQ_CODE_SELECT_IMAGE){
            if(resultCode==Activity.RESULT_OK){
                try {
                    HashMap<String,String> selectedImageInfo = getImageInfoToUri(data.getData());
                    Toast.makeText(getBaseContext(), "선택 파일 경로  : "+selectedImageInfo.get("imagePath")+" 파일명 :"+selectedImageInfo.get("imgName") , Toast.LENGTH_SHORT).show();

                    UPLOAD_IMAGE_DATA.clear();
                    UPLOAD_IMAGE_DATA.put("IMAGE_DATA",selectedImageInfo.get("imagePath"));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }else{
                UPLOAD_IMAGE_DATA.clear();
                Toast.makeText(getBaseContext(), "파일을 선택 하지 않았습니다." , Toast.LENGTH_SHORT).show();
            }
        }else{
            UPLOAD_IMAGE_DATA.clear();
            Toast.makeText(getBaseContext(), "이미지 파일을 선택 하지 않았습니다." , Toast.LENGTH_SHORT).show();
        }
    }


    public HashMap<String,String> getImageInfoToUri(Uri data) {
        HashMap<String,String> imageMap = new HashMap<String,String>();
        String[] proj = { MediaStore.Images.Media.DATA };
        Cursor cursor = managedQuery(data, proj, null, null, null);
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);

        cursor.moveToFirst();

        String imgPath = cursor.getString(column_index);
        String imgName = imgPath.substring(imgPath.lastIndexOf("/")+1);

        imageMap.put("imagePath",imgPath);
        imageMap.put("imgName",imgName);

        return imageMap;
    }
}