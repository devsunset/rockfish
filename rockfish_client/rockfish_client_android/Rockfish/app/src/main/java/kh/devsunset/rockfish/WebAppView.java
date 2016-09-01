/*
* @(#)WebAppView.java
*/
package kh.devsunset.rockfish;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Window;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * <PRE>
 * Rockfish WebAppView Page
 * </PRE>
 *
 * @author devsunset
 * @version 1.0
 * @since rockfish1.0
 */
public class WebAppView extends Activity {

    private WebView mWebView;

    private ValueCallback<Uri> filePathCallbackNormal;
    private ValueCallback<Uri[]> filePathCallbackLollipop;
    private final static int FILECHOOSER_NORMAL_REQ_CODE = 1;
    private final static int FILECHOOSER_LOLLIPOP_REQ_CODE = 2;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setTheme(android.R.style.Theme_NoTitleBar_Fullscreen);

        setContentView(R.layout.webappview);

        mWebView = (WebView) findViewById(R.id.webappview);


        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.getSettings().setAllowFileAccess(true);
        mWebView.getSettings().setAllowContentAccess(true);
        mWebView.getSettings().setDomStorageEnabled(true);

        final Context myApp = this;
        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message, final android.webkit.JsResult result) {
                new AlertDialog.Builder(myApp)
                        .setTitle("AlertDialog")
                        .setMessage(message)
                        .setPositiveButton(android.R.string.ok,
                                new AlertDialog.OnClickListener(){
                                    public void onClick(DialogInterface dialog, int which) {
                                        result.confirm();
                                    }
                                })
                        .setCancelable(false)
                        .create()
                        .show();
                return true;
            };

            // For Android < 3.0
            public void openFileChooser( ValueCallback<Uri> uploadMsg) {
                Log.d("MainActivity", "3.0 <");
                openFileChooser(uploadMsg, "");
            }
            // For Android 3.0+
            public void openFileChooser( ValueCallback<Uri> uploadMsg, String acceptType) {
                Log.d("MainActivity", "3.0+");
                filePathCallbackNormal = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_NORMAL_REQ_CODE);
            }
            // For Android 4.1+
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
                Log.d("MainActivity", "4.1+");
                openFileChooser(uploadMsg, acceptType);
            }

            // For Android 5.0+
            public boolean onShowFileChooser(
                    WebView webView, ValueCallback<Uri[]> filePathCallback,
                    WebChromeClient.FileChooserParams fileChooserParams) {
                Log.d("MainActivity", "5.0+");
                if (filePathCallbackLollipop != null) {
                    filePathCallbackLollipop.onReceiveValue(null);
                    filePathCallbackLollipop = null;
                }
                filePathCallbackLollipop = filePathCallback;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_LOLLIPOP_REQ_CODE);

                return true;
            }
        });

        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                Uri source = Uri.parse(url);
                String fileName  = URLUtil.guessFileName(url, contentDisposition, mimetype);
                DownloadManager.Request request = new DownloadManager.Request(source);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
                    request.allowScanningByMediaScanner();
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                }else{
                    request.setShowRunningNotification(true);
                }
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                DownloadManager dm = (DownloadManager) myApp.getSystemService(Context.DOWNLOAD_SERVICE);
                dm.enqueue(request);
            }
        });

        mWebView.setWebViewClient(new WebViewClient());

        mWebView.loadUrl("file:///android_asset/rockfish_client.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILECHOOSER_NORMAL_REQ_CODE) {
            if (filePathCallbackNormal == null) return ;
            Uri result = (data == null || resultCode != RESULT_OK) ? null : data.getData();
            filePathCallbackNormal.onReceiveValue(result);
            filePathCallbackNormal = null;
        } else if (requestCode == FILECHOOSER_LOLLIPOP_REQ_CODE) {
            if (filePathCallbackLollipop == null) return ;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                filePathCallbackLollipop.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            }
            filePathCallbackLollipop = null;
        }
    }
}
