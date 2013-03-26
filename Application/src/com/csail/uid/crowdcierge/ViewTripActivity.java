package com.csail.uid.crowdcierge;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;

public class ViewTripActivity extends Activity {
	private String uid;
	private String tid;
	private boolean inProgress;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_trip);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);

		uid = prefs.getString("uid", null);
		tid = getIntent().getStringExtra("tid");
		inProgress = getIntent().getBooleanExtra("inProgress", false);

	}
}
