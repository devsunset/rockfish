/*
* @(#)HelpView.java
*/
package kh.devsunset.rockfish;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * <PRE>
 * Rockfish HelpView App Page
 * </PRE>
 * 
 * @author devsunset
 * @version 1.0
 * @since rockfish1.0
 */
public class HelpView extends Activity{

    private WebView mWebView;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.helpview);

        setLayout();

        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.loadUrl("file:///android_asset/rockfish_client_help.html");
        mWebView.setWebViewClient(new WebViewClientClass());
    }

    private class WebViewClientClass extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            return true;
        }
    }

    private void setLayout(){
        mWebView = (WebView) findViewById(R.id.helpview);
    }
}
