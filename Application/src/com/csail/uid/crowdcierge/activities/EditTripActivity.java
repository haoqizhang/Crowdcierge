package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.activities.ViewTripListActivity.TripTimeType;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.Constants;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;
import com.csail.uid.crowdcierge.util.PostHelper;
import com.csail.uid.crowdcierge.util.TimeUtils;

public class EditTripActivity extends Activity {

	private Spinner typeSpinner;
	private ArrayAdapter<String> mSpinnerAdapter;
	private View customView;
	private EditText customMessage;
	private Button relatedBtn;
	private Button keepBtn;

	private String uid;
	private Trip trip;
	private TripTimeType type;
	private boolean isSinglePresent = false;
	private List<TripActivity> activities;
	private ArrayList<String> activityNames = new ArrayList<String>();

	private String requestType;
	private TripActivity relatedActivity;
	private ArrayList<TripActivity> keepActivities = new ArrayList<TripActivity>();
	private ArrayList<Integer> selectedShit = new ArrayList<Integer>();

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.edit_trip);

		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		uid = prefs.getString("uid", null);
		trip = getIntent().getParcelableExtra("trip");
		type = (TripTimeType) getIntent().getSerializableExtra("tripType");
		isSinglePresent = getIntent().getBooleanExtra("isSingle", false);
		activities = getIntent().getParcelableArrayListExtra("activities");
		activities = activities.subList(1, activities.size() - 1);

		ActionBar bar = getActionBar();
		bar.setTitle("Edit Trip: " + trip.getTitle());
		bar.setDisplayHomeAsUpEnabled(true);

		typeSpinner = (Spinner) findViewById(R.id.editTypeSpinner);
		mSpinnerAdapter = new ArrayAdapter<String>(this,
				android.R.layout.simple_spinner_item);
		mSpinnerAdapter
				.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		typeSpinner.setAdapter(mSpinnerAdapter);

		for (String text : Constants.REQUEST_TEXT) {
			mSpinnerAdapter.add(text);
		}
		mSpinnerAdapter.notifyDataSetChanged();

		customView = findViewById(R.id.editCustom);
		customMessage = (EditText) findViewById(R.id.editCustomMessage);
		relatedBtn = (Button) findViewById(R.id.editTripRelatedActivity);
		keepBtn = (Button) findViewById(R.id.editTripKeepActivity);

		for (int i = 0; i < activities.size(); i++) {
			activityNames.add((i + 1) + ". " + activities.get(i).getLabel());
		}

		configureLists();
	}

	private void configureLists() {
		typeSpinner.setOnItemSelectedListener(new OnItemSelectedListener() {
			@Override
			public void onItemSelected(AdapterView<?> parentView,
					View selectedItemView, int position, long id) {
				requestType = Constants.REQUEST_TYPES[position];
				if (Arrays.asList(Constants.MESSAGE_REQUESTS).contains(
						requestType)) {
					customView.setVisibility(View.VISIBLE);
				} else {
					customView.setVisibility(View.GONE);
				}

				if (Arrays.asList(Constants.RELATED_REQUESTS).contains(
						requestType)) {
					relatedBtn.setText("Select related activity");
					relatedBtn.setEnabled(true);
					relatedActivity = null;
				} else {
					relatedBtn.setText("No need to select activity");
					relatedBtn.setEnabled(false);
					// TODO: FIGURE OUT RELATED ACTIVITY
				}
			}

			@Override
			public void onNothingSelected(AdapterView<?> parentView) {
				// empty
			}
		});

		relatedBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new RelatedActivityDialogFragment()).show(
						getFragmentManager(), "related");
			}
		});

		keepBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new KeepActivitiesDialogFragment()).show(getFragmentManager(),
						"related");
			}
		});
	}

	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case android.R.id.home:
			onBackPressed();
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	public void onBackPressed() {
		Intent in = new Intent(this, ViewTripActivity.class);
		in.putExtra("trip", trip);
		in.putExtra("tripType", type);
		in.putExtra("isSingle", isSinglePresent);
		this.startActivity(in);
		this.finish();
	}

	/**
	 * Cancel requesting an edit
	 */
	public void cancelEdit(View v) {
		onBackPressed();
	}

	/**
	 * Submit final edit
	 */
	public void submitEdit(View v) {
		// Package the JSON for request post
		JSONObject orig = trip.getOriginalObj();
		JSONObject state = null;
		String stateId = null;
		try {
			stateId = orig.getString("stateId");
			state = new JSONObject(orig.getString("state"));
			state.put("inProgress", true);

			JSONObject inter = new JSONObject();
			inter.put("time", TimeUtils.getRoundedTime() - 120);

			Location l = getBestLocation();
			inter.put("lat", l.getLatitude());
			inter.put("long", l.getLongitude());

			JSONObject request = new JSONObject();
			request.put("type", requestType);

			JSONObject data = new JSONObject();
			String message = "Please change my trip so that "
					+ customMessage.getText().toString();
			data.put("message", message);

			JSONObject activity = new JSONObject();
			if (relatedActivity != null) {
				activity.put("id", relatedActivity.getMapId());
				activity.put("name", relatedActivity.getLabel());
				activity.put("position", activities.indexOf(relatedActivity));
			}

			JSONArray keep = new JSONArray();
			for (TripActivity act : keepActivities) {
				keep.put(act.getMapId());
			}

			data.put("activity", activity);
			request.put("data", data);
			inter.put("request", request);
			inter.put("keepActivities", keep);
			state.put("inter", inter);
		} catch (JSONException e) {
			e.printStackTrace();
			return;
		}

		// Fill the post params
		String url = Constants.PHP_URL + "submitTurkTourItinerary.php";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("userId", uid);
		params.put("answer", state.toString());
		params.put("taskId", trip.getTid());
		params.put("startState", stateId);
		params.put("assignmentId", "USER_REPLAN");
		params.put("type", "turktour");

		// Execute the post
		(new PostHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				trip.setInProgress(true);
				Toast.makeText(EditTripActivity.this, "Request sent!",
						Toast.LENGTH_LONG).show();
				onBackPressed();
			}
		})).execute();
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

	private class RelatedActivityDialogFragment extends DialogFragment {
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
			// Set the dialog title
			builder.setTitle("Related Activity")
					// Specify the list array, the items to be selected by
					// default (null for none),
					// and the listener through which to receive callbacks when
					// items are selected
					.setItems(
							activityNames.toArray(new CharSequence[activityNames
									.size()]),
							new DialogInterface.OnClickListener() {

								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									relatedActivity = activities.get(which);
									relatedBtn.setText("Selected: "
											+ relatedActivity.getLabel());
								}
							});

			return builder.create();
		}
	}

	private class KeepActivitiesDialogFragment extends DialogFragment {
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
			// Set the dialog title
			boolean[] fuckingPieceOfShit = new boolean[activities.size()];
			for (int i : selectedShit) {
				fuckingPieceOfShit[i] = true;
			}
			builder.setTitle("Activities to Keep")
					.setMultiChoiceItems(
							activityNames.toArray(new CharSequence[activityNames
									.size()]), fuckingPieceOfShit,
							new DialogInterface.OnMultiChoiceClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int which, boolean isChecked) {
									if (isChecked) {
										keepActivities.add(activities
												.get(which));
										selectedShit.add(which);
									} else {
										keepActivities.remove(activities
												.get(which));
										int ind = selectedShit.indexOf(which);
										selectedShit.remove(ind);
									}
								}
							})

					.setPositiveButton("Ok",
							new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int id) {
									keepBtn.setText(selectedShit.size()
											+ " activities selected");
								}
							});

			return builder.create();
		}
	}
}
