package com.csail.uid.crowdcierge.activities;

import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.Fragment;
import android.app.ProgressDialog;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Handler.Callback;
import android.os.Message;
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
import com.csail.uid.crowdcierge.util.Constants;
import com.csail.uid.crowdcierge.util.GetHelper;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;
import com.csail.uid.crowdcierge.util.PostHelper;
import com.csail.uid.crowdcierge.util.TimeUtils;
import com.csail.uid.crowdcierge.views.SearchText;
import com.csail.uid.crowdcierge.views.SearchText.OnTextClearListener;
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
	private String name;
	private String email;

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
	private int date = today.get(Calendar.DAY_OF_MONTH)
			+ (today.get(Calendar.MONTH) + 1) * 100 + today.get(Calendar.YEAR)
			* 10000;
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
	private SearchText startNameInput;
	private SearchText endNameInput;
	private EditText requestInput;

	private GoogleMap map;
	private ProgressDialog progress;

	// Handler for when reverse geocoding task returns
	private Handler addressHandler = new Handler(new Callback() {
		@Override
		public boolean handleMessage(Message msg) {
			progress.dismiss();

			if (msg.what == 0) {
				startNameInput.setText((String) msg.obj);
			} else {
				endNameInput.setText((String) msg.obj);
			}
			saveInputs();
			updateMap();
			return true;
		}
	});

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.request_trip);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		uid = prefs.getString("uid", null);
		name = prefs.getString("name", null);
		email = prefs.getString("email", null);

		cancelBtn = (Button) findViewById(R.id.requestTripCancelBtn);
		backBtn = (Button) findViewById(R.id.requestTripBackBtn);
		nextBtn = (Button) findViewById(R.id.requestTripNextBtn);
		submitBtn = (Button) findViewById(R.id.requestTripSubmitBtn);

		titleInput = (EditText) findViewById(R.id.requestTripTitle);
		cityInput = (EditText) findViewById(R.id.requestTripCity);
		startNameInput = (SearchText) findViewById(R.id.requestStartSearchQuery);
		endNameInput = (SearchText) findViewById(R.id.requestEndSearchQuery);
		requestInput = (EditText) findViewById(R.id.requestTripDescriptionInput);

		map = ((MapFragment) getFragmentManager().findFragmentById(
				R.id.requestTripMap)).getMap();

		updateTitleBar();
		updateMap();

		// Configure UI elements for various steps
		configureWhenWhere();
		configureStart();
		configureEnd();
	}

	/**
	 * Move to next step of request process.
	 */
	public void showNextStep(View v) {
		boolean error = checkErrors();
		if (error) {
			return;
		}

		step++;
		saveInputs();
		updateTitleBar();
		updateButtons();

		findViewById(stepIds[step - 2]).setVisibility(View.GONE);
		findViewById(stepIds[step - 1]).setVisibility(View.VISIBLE);

		updateMap();
	}

	/**
	 * Move to previous step of request process.
	 */
	public void showPreviousStep(View v) {
		step--;
		saveInputs();
		updateMap();
		updateTitleBar();
		updateButtons();

		findViewById(stepIds[step]).setVisibility(View.GONE);
		findViewById(stepIds[step - 1]).setVisibility(View.VISIBLE);
	}

	/**
	 * Update title bar text to reflect step number
	 */
	private void updateTitleBar() {
		getActionBar()
				.setTitle(
						"Step " + step + " of " + numSteps + ": "
								+ stepNames[step - 1]);
	}

	/**
	 * Change the step control buttons based on what step we are on.
	 */
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
	 * Show or hide the map display and update camera location. Also does pins
	 * and start/end lat and long if on correct step.
	 */
	private void updateMap() {
		Fragment Map = getFragmentManager().findFragmentById(
				R.id.requestTripMap);

		if (step == 2) {
			getFragmentManager().beginTransaction().show(Map).commit();
			if (start == null) {
				getMapLocationAndUpdate(city, true, false, false);
			}
			getMapLocationAndUpdate(endName, false, false, true);
			getMapLocationAndUpdate(startName, true, true, false);
		} else if (step == 3) {
			getFragmentManager().beginTransaction().show(Map).commit();
			if (end == null) {
				getMapLocationAndUpdate(city, true, false, false);
			}
			getMapLocationAndUpdate(startName, false, true, false);
			getMapLocationAndUpdate(endName, true, false, true);
		} else {
			getFragmentManager().beginTransaction().hide(Map).commit();
		}
		getFragmentManager().executePendingTransactions();
	}

	/**
	 * Try to get the 'best' location selected from all providers
	 */
	private Location getBestLocation() {
		Location gpslocation = getLocationByProvider(LocationManager.GPS_PROVIDER);
		Location networkLocation = getLocationByProvider(LocationManager.NETWORK_PROVIDER);
		if (gpslocation == null) {
			return networkLocation;
		} else {
			return gpslocation;
		}
	}

	/**
	 * Get the last known location from a specific provider (network/gps)
	 */
	private Location getLocationByProvider(String provider) {
		Location location = null;
		LocationManager locationManager = (LocationManager) getApplicationContext()
				.getSystemService(Context.LOCATION_SERVICE);
		try {
			if (locationManager.isProviderEnabled(provider)) {
				location = locationManager.getLastKnownLocation(provider);
			}
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		}
		return location;
	}

	/**
	 * Async task for reverse geocoding (get address from lat long). Sends
	 * response to addressHandler.
	 */
	private class ReverseGeocodingTask extends AsyncTask<Location, Void, Void> {
		Context mContext;
		int type;

		public ReverseGeocodingTask(Context context, int t) {
			super();
			mContext = context;
			type = t;
		}

		@Override
		protected Void doInBackground(Location... params) {
			Geocoder geocoder = new Geocoder(mContext, Locale.getDefault());

			Location loc = params[0];
			List<Address> addresses = null;
			try {
				addresses = geocoder.getFromLocation(loc.getLatitude(),
						loc.getLongitude(), 1);
			} catch (IOException e) {
				e.printStackTrace();
			}
			if (addresses != null && addresses.size() > 0) {
				Address address = addresses.get(0);
				String addressText = String.format(
						"%s, %s, %s",
						address.getMaxAddressLineIndex() > 0 ? address
								.getAddressLine(0) : "", address.getLocality(),
						address.getCountryName());
				Message.obtain(addressHandler, type, addressText)
						.sendToTarget();
			}
			return null;
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

				today = Calendar.getInstance();
				String minute = today.get(Calendar.MINUTE) + "";
				if (minute.length() == 1) {
					minute = "0" + minute;
				}
				minute += today.get(Calendar.AM_PM) == Calendar.AM ? "am"
						: "pm";

				startBtn.setText("Start Time: " + today.get(Calendar.HOUR)
						+ ":" + minute);
				dateBtn.setText("Trip Date: " + (today.get(Calendar.MONTH) + 1)
						+ "/" + today.get(Calendar.DAY_OF_MONTH) + "/"
						+ today.get(Calendar.YEAR));

				startTime = today.get(Calendar.HOUR_OF_DAY) * 60
						+ today.get(Calendar.MINUTE);
				date = today.get(Calendar.DAY_OF_MONTH)
						+ (today.get(Calendar.MONTH) + 1) * 100
						+ today.get(Calendar.YEAR) * 10000;
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
								date = dayOfMonth + (monthOfYear + 1) * 100
										+ year * 10000;
								dateBtn.setText("Trip Date: "
										+ (monthOfYear + 1) + "/" + dayOfMonth
										+ "/" + year);
							}
						}, (int) Math.floor(date / 10000), (int) Math
								.floor((date % 10000) / 100) - 1, date % 100))
						.show();
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

	/**
	 * Configure the views in the start location step of the request
	 */
	private void configureStart() {
		ImageButton startSearchBtn = (ImageButton) findViewById(R.id.requestStartSearchButton);
		startSearchBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				saveInputs();
				getMapLocationAndUpdate(startName, true, true, false);
			}
		});

		startNameInput.setOnTextClearListener(new OnTextClearListener() {
			@Override
			public void onTextClear() {
				saveInputs();
				updateMap();
			}
		});

		CheckBox startMy = (CheckBox) findViewById(R.id.requestTripStartMyLoc);
		startMy.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				if (isChecked) {
					progress = ProgressDialog.show(RequestTripActivity.this,
							"Finding location", "One moment please...", true);
					Location loc = getBestLocation();
					(new ReverseGeocodingTask(RequestTripActivity.this, 0))
							.execute(loc);
				}
				startNameInput.setEnabled(!isChecked);
			}
		});
	}

	/**
	 * Configure the views in the end location step of the request
	 */
	private void configureEnd() {
		ImageButton endSearchBtn = (ImageButton) findViewById(R.id.requestEndSearchButton);
		endSearchBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				saveInputs();
				getMapLocationAndUpdate(endName, true, false, true);
			}
		});

		endNameInput.setOnTextClearListener(new OnTextClearListener() {
			@Override
			public void onTextClear() {
				saveInputs();
				updateMap();
			}
		});

		final CheckBox endMy = (CheckBox) findViewById(R.id.requestTripEndMyLoc);
		endMy.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				if (isChecked) {
					progress = ProgressDialog.show(RequestTripActivity.this,
							"Finding location", "One moment please...", true);
					Location loc = getBestLocation();
					(new ReverseGeocodingTask(RequestTripActivity.this, 1))
							.execute(loc);
				}
				endNameInput.setEnabled(!isChecked);
			}
		});

		CheckBox sameAsStart = (CheckBox) findViewById(R.id.requestTripEndIsStart);
		sameAsStart.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				if (isChecked) {
					endNameInput.setText(startNameInput.getText().toString());
					saveInputs();
					updateMap();
				}
				endNameInput.setEnabled(!isChecked);
				endMy.setEnabled(!isChecked);
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
		} else {
			startName = startName + " " + city;
		}

		if (endName == null || endName.equals("")) {
			if (end != null) {
				end.remove();
				end = null;
			}
		} else {
			endName = endName + " " + city;
		}
	}

	/**
	 * Check if there are form errors on the current step
	 * 
	 * TODO: Check for off limits locations or timing issues
	 */
	private boolean checkErrors() {
		boolean error = false;
		if (titleInput.getText().toString().length() == 0) {
			error = true;
			titleInput.setError("Please enter a title");
		}

		if (cityInput.getText().toString().length() == 0) {
			error = true;
			cityInput.setError("Please enter a city");
		}
		return error;
	}

	/**
	 * Sets the map location to wherever query specifies. Centers map on query
	 * based on center input.
	 * 
	 * If startName or endName are entered, removes old pin and adds new one.
	 * Sets the lat and long for the start and end in this case.
	 */
	private void getMapLocationAndUpdate(final String query,
			final boolean center, final boolean isStart, final boolean isEnd) {
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

					if (isStart) {
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
					}

					if (isEnd) {
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

	/**
	 * Go back in steps until at first step, then exit
	 */
	public void onBackPressed() {
		if (step == 1) {
			super.onBackPressed();
		} else {
			showPreviousStep(null);
		}
	}

	/**
	 * Called when cancel pressed. Same as onBackPressed().
	 */
	public void cancel(View v) {
		super.onBackPressed();
	}

	/**
	 * Submits the trip request with all the entered data
	 */
	public void submitRequest(View v) {
		saveInputs();

		// Package the JSON for request post
		JSONObject startObj = new JSONObject();
		JSONObject endObj = new JSONObject();
		try {
			// Package up the start
			startObj.put("name", startName.split(" " + city)[0]);
			startObj.put("lat", startLat);
			startObj.put("long", startLong);

			// Package up the end
			endObj.put("name", endName.split(" " + city)[0]);
			endObj.put("lat", endLat);
			endObj.put("long", endLong);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		// Fill the post params
		String url = Constants.PHP_URL + "createStudyTourTaskRaw.php";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("type", "both");
		params.put("city", city);
		params.put("activity", title);
		params.put("date", date + "");
		params.put("description", request);
		params.put("categories", "[]");
		params.put("constraints", "[]");
		params.put("start", startObj.toString());
		params.put("end", endObj.toString());
		params.put("beginTime", startTime + "");
		params.put("endTime", endTime + "");
		params.put("zoom", "14");
		params.put("transitAvailable", "0");
		params.put("uid", uid);
		params.put("creator", name);
		params.put("email", email);
		params.put("id", (new TripIdGenerator()).nextTripId());

		System.out.println(params.get("id"));
		
		// Execute the post
		(new PostHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				System.out.println(JSON);
				Toast.makeText(RequestTripActivity.this,
						"Trip request submitted!", Toast.LENGTH_LONG).show();
				Intent in = new Intent(RequestTripActivity.this,
						MainActivity.class);
				RequestTripActivity.this.startActivity(in);
			}
		})).execute();
	}

	public final class TripIdGenerator {

		private SecureRandom random = new SecureRandom();

		public String nextTripId() {
			return new BigInteger(130, random).toString(32);
		}

	}
}
