/*
 * @(#)MainActivity.java
 */
package kh.devsunset.rockfish;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Toast;

/**
 * <PRE>
 * Rockfish Client Main Page
 * </PRE>
 *
 * @author 강경희
 * @version 1.0
 */
public class MainActivity extends Activity implements OnClickListener {

    public boolean bBackKeyPressFlag = false;

    /**
     * Called when the activity is first created.
     * This is where you should do all of your normal static set up
     * create views, bind data to lists, and so on.
     * This method is passed a Bundle object containing the activity's previous state,
     * if that state was captured (see Saving Activity State, later).
     * Always followed by onStart().
     *
     * Kill able:NO
     * NEXT		:onStart()
     *
     * 활동의 정적 잘료의 초기화에 적합
     * layout , data binding
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setInit();
    }

    /**
     * init()
     */
    private void setInit() {
        /** Button setOnClickListener. */
        View vMyBaby = this.findViewById(R.id.ivnativeapp);
        vMyBaby.setOnClickListener(this);

        View vVaccination = this.findViewById(R.id.ivwebapp);
        vVaccination.setOnClickListener(this);

        View vEtcMenu = this.findViewById(R.id.ivhelp);
        vEtcMenu.setOnClickListener(this);
    }

    /**
     * Main Menu Button click
     *
     * @param v
     */
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.ivnativeapp:
                Intent iNativeAppView = new Intent(this, NativeAppView.class);
                startActivity(iNativeAppView);
                break;
            case R.id.ivwebapp:
                Intent iWebAppView = new Intent(this, WebAppView.class);
                startActivity(iWebAppView);
                break;
            case R.id.ivhelp:
                Intent iHelpView = new Intent(this, HelpView.class);
                startActivity(iHelpView);
                break;
        }
    }


    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if( keyCode == KeyEvent.KEYCODE_BACK ){

            if (!bBackKeyPressFlag) {
                Toast.makeText(MainActivity.this, getResources().getString(R.string.main_back_finish), Toast.LENGTH_SHORT).show();
                bBackKeyPressFlag = true;
                mKillBackKeyHandler.sendEmptyMessageDelayed(0, 1500);
                return true;
            } else {
                bBackKeyPressFlag = false;
                super.onBackPressed();
            }
        }

        return super.onKeyDown(keyCode, event);
    }

    @SuppressLint("HandlerLeak")
    Handler mKillBackKeyHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            if (msg.what == 0) {
                bBackKeyPressFlag = false;
            }
        }
    };
}