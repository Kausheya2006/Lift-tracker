package com.lift.tracker;

import android.app.Activity;
import android.webkit.ValueCallback;

@SuppressWarnings({"rawtypes", "unchecked"})
public class BackCb implements ValueCallback {
    private final Activity a;
    public BackCb(Activity a) { this.a = a; }
    public void onReceiveValue(Object r) {
        if (!"1".equals(String.valueOf(r))) a.finish();
    }
}
