package com.csail.uid.crowdcierge;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;

public class RequestTripActivity extends Activity {

	private String uid;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.request_trip);
		SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
		uid = prefs.getString("uid", null);
	}
}
