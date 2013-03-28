package com.csail.uid.crowdcierge.activities;

import java.util.Calendar;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.Fragment;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TimePicker;
import android.widget.Toast;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.util.GetHelper;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;
import com.csail.uid.crowdcierge.util.TimeUtils;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

public class RequestTripActivity extends Activity {

	private String uid;
	private String title;
	private String city;
	private String request;

	private String startName;
	private double startLat;
	private double startLong;
	private Marker start;
	private String endName;
	private double endLat;
	private double endLong;
	private Marker end;

	private Calendar today = Calendar.getInstance();
	private int date = today.get(Calendar.DAY_OF_MONTH) * 1000000
			+ (today.get(Calendar.MONTH) + 1) * 10000
			+ today.get(Calendar.YEAR);
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

	private EditText titleInput;
	private EditText cityInput;
	private EditText startNameInput;
	private EditText endNameInput;
	private EditText requestInput;

	private GoogleMap map;

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

		titleInput = (EditText) findViewById(R.id.requestTripTitle);
		cityInput = (EditText) findViewById(R.id.requestTripCity);
		startNameInput = (EditText) findViewById(R.id.requestStartSearchQuery);
		endNameInput = (EditText) findViewById(R.id.requestEndSearchQuery);
		requestInput = (EditText) findViewById(R.id.requestTripDescriptionInput);

		map = ((MapFragment) getFragmentManager().findFragmentById(
				R.id.requestTripMap)).getMap();

		updateTitleBar();
		updateMap();
		
		configureWhenWhere();
		configureStartEnd();
	}

	public void showNextStep(View v) {
		step++;
		saveInputs();
		updateTitleBar();
		updateButtons();

		findViewById(stepIds[step - 2]).setVisibility(View.GONE);
		findViewById(stepIds[step - 1]).setVisibility(View.VISIBLE);

		updateMap();
	}

	public void showPreviousStep(View v) {
		step--;
		saveInputs();
		updateMap();
		updateTitleBar();
		updateButtons();

		findViewById(stepIds[step]).setVisibility(View.GONE);
		findViewById(stepIds[step - 1]).setVisibility(View.VISIBLE);
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
	 * Show or hide the map display and update camera location
	 */
	private void updateMap() {
		Fragment Map = getFragmentManager().findFragmentById(
				R.id.requestTripMap);

		if (step == 2) {
			getFragmentManager().beginTransaction().show(Map).commit();
			if (start == null) {
				getMapLocationAndUpdate(city, true);
			}
			getMapLocationAndUpdate(endName, false);
			getMapLocationAndUpdate(startName, true);
		} else if (step == 3) {
			getFragmentManager().beginTransaction().show(Map).commit();
			if (end == null) {
				getMapLocationAndUpdate(city, true);
			}
			getMapLocationAndUpdate(startName, false);
			getMapLocationAndUpdate(endName, true);
		} else {
			getFragmentManager().beginTransaction().hide(Map).commit();
		}
		getFragmentManager().executePendingTransactions();
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

		dateBtn.setText("Trip Date: " + (today.get(Calendar.MONTH) + 1) + "/"
				+ today.get(Calendar.DAY_OF_MONTH) + "/"
				+ today.get(Calendar.YEAR));

		dateBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new DatePickerDialog(RequestTripActivity.this,
						new OnDateSetListener() {
							@Override
							public void onDateSet(DatePicker view, int year,
									int monthOfYear, int dayOfMonth) {
								date = dayOfMonth * 1000000 + (monthOfYear + 1)
										* 10000 + year;
								dateBtn.setText("Trip Date: "
										+ (monthOfYear + 1) + "/" + dayOfMonth
										+ "/" + year);
							}
						}, (date % 10000), (int) Math
								.floor((date % 1000000) / 10000) - 1,
						(int) Math.floor(date / 1000000))).show();
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
								startBtn.setText("Start Time: "
										+ TimeUtils.minToTime(startTime));
							}
						}, (int) Math.floor(startTime / 60), startTime % 60,
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
								endBtn.setText("End Time: "
										+ TimeUtils.minToTime(endTime));
							}
						}, (int) Math.floor(endTime / 60), endTime % 60, false))
						.show();
			}
		});
	}

	private void configureStartEnd() {
		ImageButton startSearchBtn = (ImageButton) findViewById(R.id.requestStartSearchButton);
		startSearchBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				saveInputs();
				getMapLocationAndUpdate(startName, true);
			}
		});
		
		ImageButton endSearchBtn = (ImageButton) findViewById(R.id.requestEndSearchButton);
		endSearchBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				saveInputs();
				getMapLocationAndUpdate(endName, true);
			}
		});
	}
	
	/**
	 * Saves the inputs that have been entered in the text fields.
	 */
	private void saveInputs() {
		title = titleInput.getText().toString();
		city = cityInput.getText().toString();
		startName = startNameInput.getText().toString();
		endName = endNameInput.getText().toString();
		request = requestInput.getText().toString();
		
		if (startName == null || startName.equals("")) {
			if (start != null) {
				start.remove();
				start = null;
			}
		}
		
		if (endName == null || endName.equals("")) {
			if (end != null) {
				end.remove();
				end = null;
			}
		}
	}

	private void getMapLocationAndUpdate(final String query,
			final boolean center) {
		if (query == null || query.equals("")) {
			return;
		}

		String url = "http://maps.google.com/maps/api/geocode/json";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("address", query);
		params.put("sensor", "false");

		(new GetHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				try {
					JSONObject top = new JSONObject(JSON);
					JSONArray results = top.getJSONArray("results");
					JSONObject geometry = results.getJSONObject(0)
							.getJSONObject("geometry");
					JSONObject location = geometry.getJSONObject("location");

					LatLng loc = new LatLng(location.getDouble("lat"), location
							.getDouble("lng"));

					if (center) {
						CameraUpdate cameraUpdate = CameraUpdateFactory
								.newLatLngZoom(loc, 12);
						map.moveCamera(cameraUpdate);

					}
					
					if (query.equals(startName)) {
						if (start != null) {
							start.remove();
						}

						start = map.addMarker(new MarkerOptions()
								.title("Trip Start")
								.snippet("@" + startName)
								.icon(BitmapDescriptorFactory
										.defaultMarker(BitmapDescriptorFactory.HUE_GREEN))
								.position(loc));
						startLat = loc.latitude;
						startLong = loc.longitude;
					} else if (query.equals(endName)) {
						if (end != null) {
							end.remove();
						}

						end = map.addMarker(new MarkerOptions()
								.title("Trip End")
								.snippet("@" + endName)
								.icon(BitmapDescriptorFactory
										.defaultMarker(BitmapDescriptorFactory.HUE_RED))
								.position(loc));
						endLat = loc.latitude;
						endLong = loc.longitude;
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		})).execute();
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
