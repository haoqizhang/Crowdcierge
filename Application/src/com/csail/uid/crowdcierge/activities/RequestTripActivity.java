package com.csail.uid.crowdcierge.activities;

import java.util.Calendar;

import android.app.DatePickerDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.DatePicker;
import android.widget.TimePicker;
import android.widget.Toast;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.util.TimeUtils;

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

	private Calendar today = Calendar.getInstance();
	private int date;
	private int startTime = 600;
	private int endTime = 1080;

	// Data for stepping through form
	private int step = 1;
	private final int numSteps = 4;
	private int[] stepIds = { R.id.requestTripWhenWhere, R.id.requestTripStart,
			R.id.requestTripEnd, R.id.requestTripDescription };
	private String[] stepNames = { "When and Where", "Start Point",
			"End Point", "What You Want" };

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

		configureWhenWhere();
	}

	public void showNextStep(View v) {
		step++;

		findViewById(stepIds[step - 2]).setVisibility(View.GONE);
		findViewById(stepIds[step - 1]).setVisibility(View.VISIBLE);

		updateTitleBar();
		updateButtons();
	}

	public void showPreviousStep(View v) {
		step--;

		findViewById(stepIds[step]).setVisibility(View.GONE);
		findViewById(stepIds[step - 1]).setVisibility(View.VISIBLE);

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

	/**
	 * Configure the first step's input fields
	 */
	private void configureWhenWhere() {
		// Configure checkbox handling and buttons
		final CheckBox now = (CheckBox) findViewById(R.id.requestTripNow);
		final Button dateBtn = (Button) findViewById(R.id.requestTripDateBtn);
		final Button startBtn = (Button) findViewById(R.id.requestTripStartTimeBtn);
		final Button endBtn = (Button) findViewById(R.id.requestTripEndTimeBtn);
		now.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				startBtn.setEnabled(!isChecked);
				dateBtn.setEnabled(!isChecked);
			}
		});

		dateBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new DatePickerDialog(RequestTripActivity.this,
						new OnDateSetListener() {
							@Override
							public void onDateSet(DatePicker view, int year,
									int monthOfYear, int dayOfMonth) {
								date = dayOfMonth * 10000 + (monthOfYear+1) * 100
										+ year;
								dateBtn.setText("Trip Date: " + (monthOfYear+1)
										+ "/" + dayOfMonth + "/" + year);
							}
						}, today.get(Calendar.YEAR), today.get(Calendar.MONTH),
						today.get(Calendar.DAY_OF_MONTH))).show();
			}
		});
		
		startBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new TimePickerDialog(RequestTripActivity.this,
						new OnTimeSetListener() {
							@Override
							public void onTimeSet(TimePicker view,
									int hourOfDay, int minute) {
								startTime = hourOfDay * 60 + minute;
								startBtn.setText("Start Time: " + TimeUtils.minToTime(startTime));
							}
						}, (int) Math.floor(startTime/60), startTime%60,
						false)).show();
			}
		});
		
		endBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new TimePickerDialog(RequestTripActivity.this,
						new OnTimeSetListener() {
							@Override
							public void onTimeSet(TimePicker view,
									int hourOfDay, int minute) {
								endTime = hourOfDay * 60 + minute;
								endBtn.setText("End Time: " + TimeUtils.minToTime(endTime));
							}
						}, (int) Math.floor(endTime/60), endTime%60,
						false)).show();
			}
		});
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

	/**
	 * TODO: Actually submit trip request
	 */
	public void submitRequest(View v) {
		Toast.makeText(this, "Trip request submitted!", Toast.LENGTH_LONG)
				.show();
		Intent in = new Intent(RequestTripActivity.this, MainActivity.class);
		this.startActivity(in);
	}
}
