package com.csail.uid.crowdcierge.activities;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.widget.Button;

import com.csail.uid.crowdcierge.R;

public class RequestTripActivity extends FragmentActivity {

	private String uid;
	private String title;
	private String request;

	private String startName;
	private double startLat;
	private double startLong;
	private String endName;
	private double endLat;
	private double endLong;

	private int date;
	private int startTime;
	private int endTime;

	// Data for stepping through form
	private int step = 1;
	private final int numSteps = 4;
	private int[] stepIds = {};
	private String[] stepNames = { "When and Where", "Start", "End",
			"What You Want" };

	private Button cancelBtn;
	private Button backBtn;
	private Button nextBtn;
	private Button submitBtn;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.request_trip);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		uid = prefs.getString("uid", null);

		cancelBtn = (Button) findViewById(R.id.requestTripCancelBtn);
		backBtn = (Button) findViewById(R.id.requestTripBackBtn);
		nextBtn = (Button) findViewById(R.id.requestTripNextBtn);
		submitBtn = (Button) findViewById(R.id.requestTripSubmitBtn);

		updateTitleBar();
	}

	public void showNextStep(View v) {
		step++;
		updateTitleBar();
		updateButtons();
	}

	public void showPreviousStep(View v) {
		step--;
		updateTitleBar();
		updateButtons();
	}

	private void updateTitleBar() {
		getActionBar()
				.setTitle(
						"Step " + step + " of " + numSteps + ": "
								+ stepNames[step - 1]);
	}

	private void updateButtons() {
		if (step == 1) {
			backBtn.setVisibility(View.GONE);
			cancelBtn.setVisibility(View.VISIBLE);
		} else {
			backBtn.setVisibility(View.VISIBLE);
			cancelBtn.setVisibility(View.GONE);
		}

		if (step == numSteps) {
			nextBtn.setVisibility(View.GONE);
			submitBtn.setVisibility(View.VISIBLE);
		} else {
			nextBtn.setVisibility(View.VISIBLE);
			submitBtn.setVisibility(View.GONE);
		}
	}

	public void onBackPressed() {
		if (step == 1) {
			super.onBackPressed();
		} else {
			showPreviousStep(null);
		}
	}
	
	public void cancel(View v) {
		super.onBackPressed();
	}
}
