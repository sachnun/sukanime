package com.sukanime.app;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Make status bar visible with dark background
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            getWindow().setStatusBarColor(0xFF0a0a0a);
            getWindow().setNavigationBarColor(0xFF0a0a0a);
        }
        
        // Set light status bar icons (white icons on dark background)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decorView = getWindow().getDecorView();
            // Clear SYSTEM_UI_FLAG_LIGHT_STATUS_BAR to get white icons
            decorView.setSystemUiVisibility(
                decorView.getSystemUiVisibility() & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            );
        }
        
        // Handle back button with modern callback
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge().getWebView();
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                } else {
                    // Exit the app
                    finish();
                }
            }
        });
    }
}
