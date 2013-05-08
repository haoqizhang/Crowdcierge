package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.activities.ViewTripListActivity.TripTimeType;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.Constants;
import com.csail.uid.crowdcierge.util.GetHelper;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;
import com.csail.uid.crowdcierge.util.TimeUtils;

public class ViewTripActivity extends Activity {
	private Trip trip;
	private TripTimeType type;
	private boolean isSinglePresent = false;
	private HashMap<String, TripActivity> userStream = new HashMap<String, TripActivity>();

	private ListView activityList;
	private View prog;
	private Button editBtn;
	private Button mapBtn;
	private Button cancelBtn;
	private ActivityListAdapter mAdapter;
	
	private TextView inProgText;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_trip);

		trip = getIntent().getParcelableExtra("trip");
		type = (TripTimeType) getIntent().getSerializableExtra("tripType");
		isSinglePresent = getIntent().getBooleanExtra("isSingle", false);

		prog = findViewById(R.id.activityListProgress);
		activityList = (ListView) findViewById(R.id.activityList);
		mAdapter = new ActivityListAdapter(this);
		activityList.setAdapter(mAdapter);
		activityList.setOnItemClickListener(new OnActivityClickListener());

		editBtn = (Button) findViewById(R.id.viewTripEdit);
		mapBtn = (Button) findViewById(R.id.viewTripMap);
		cancelBtn = (Button) findViewById(R.id.viewTripCancel);
		
		inProgText = (TextView) findViewById(R.id.tripInProgress);
		
		ActionBar bar = getActionBar();
		bar.setTitle(trip.getTitle());
		bar.setDisplayHomeAsUpEnabled(true);

		loadUserStream();
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
		if (!isSinglePresent) {
			super.onBackPressed();
		} else {
			Intent in = new Intent(ViewTripActivity.this, MainActivity.class);
			this.startActivity(in);
			this.finish();
		}
	}

	public void showMap(View v) {
		Intent in = new Intent(ViewTripActivity.this, TripMapActivity.class);
		ArrayList<TripActivity> activities = new ArrayList<TripActivity>();
		for (int i = 0; i < mAdapter.getCount(); i++) {
			activities.add(mAdapter.getItem(i));
		}
		in.putExtra("activities", activities);
		in.putExtra("trip", trip);
		this.startActivity(in);
	}
	
	public void openEditActivity(View v) {
		Intent in = new Intent(ViewTripActivity.this, EditTripActivity.class);
		ArrayList<TripActivity> activities = new ArrayList<TripActivity>();
		for (int i = 0; i < mAdapter.getCount(); i++) {
			activities.add(mAdapter.getItem(i));
		}
		in.putExtra("activities", activities);
		in.putExtra("trip", trip);
		in.putExtra("tripType", type);
		in.putExtra("isSingle", isSinglePresent);
		this.startActivity(in);
		this.finish();
	}

	/**
	 * Load the user stream for the trip
	 */
	private void loadUserStream() {
		String url = Constants.PHP_URL + "loadTurkTourStream.php";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("type", "turktour");
		params.put("id", trip.getTid());

		(new GetHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				try {
					JSONArray top = new JSONArray(JSON);
					for (int i = 0; i < top.length(); i++) {
						JSONObject obj = top.getJSONObject(i);

						if (obj.getString("changeInfo") == "null") {
							String mapId = "user_" + obj.getString("hitId");
							JSONObject answer = new JSONObject(
									obj.getString("answer"));
							if (answer.getString("type").equals("activity")) {
								userStream.put(mapId, new TripActivity(mapId,
										answer));
							}
						}
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}

				populateActivityList();
				setTripType();
			}
		})).execute();
	}

	/**
	 * Fill activity list with the trip's activities
	 */
	private void populateActivityList() {		
		mAdapter.clear();
		mAdapter.add(new TripActivity("Start", trip.getStartName(), trip
				.getStartTime(), trip.getStartLat(), trip.getStartLong(), true));
		for (String id : trip.getActivityIds()) {
			mAdapter.add(userStream.get(id));
		}

		mAdapter.add(new TripActivity("End", trip.getEndName(), trip
				.getEndTime(), trip.getEndLat(), trip.getEndLong(), false));
		mAdapter.notifyDataSetChanged();
		
		prog.setVisibility(View.GONE);
		activityList.setVisibility(View.VISIBLE);
		editBtn.setEnabled(true);
		mapBtn.setEnabled(true);
	}
	
	/**
	 * TODO: change view depending on type
	 */
	private void setTripType() {
		switch (type) {
		case FUTURE:
			//cancelBtn.setVisibility(View.VISIBLE);
			break;
		case PRESENT:
			break;
		case PAST:
			editBtn.setEnabled(false);
		}
		
		if (trip.isInProgress()) {
			inProgText.setText("Your trip is currently being fixed. Check back for the changes later.");
		} else {
			inProgText.setText("");
			inProgText.setTextSize(0);
			inProgText.setHeight(0);
		}
	}
	
	/**
	 * Adapter for activity list view.
	 */
	public class ActivityListAdapter extends ArrayAdapter<TripActivity>
			implements ListAdapter {

		public ActivityListAdapter(Context context) {
			super(context, 0);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			TripActivity act = getItem(position);
			convertView = LayoutInflater.from(getContext()).inflate(
					R.layout.activity_row, null);

			TextView num = (TextView) convertView
					.findViewById(R.id.activityNumber);
			if (position == 0) {
				num.setText("");
				num.setBackgroundResource(R.drawable.pin_large_green);
			} else if (position == getCount() - 1) {
				num.setText("");
				num.setBackgroundResource(R.drawable.pin_large_red);
			} else {
				num.setText("" + position);
			}

			TextView label = (TextView) convertView
					.findViewById(R.id.activityLabel);
			label.setText(act.getLabel());

			TextView location = (TextView) convertView
					.findViewById(R.id.activityLocation);
			location.setText("@" + act.getLocationName());

			TextView times = (TextView) convertView
					.findViewById(R.id.activityTimes);

			if (act.isEndpoint()) {
				times.setText(TimeUtils.minToTime(act.getStart()));
			} else {
				times.setText(TimeUtils.minToTime(act.getStart())
						+ "-"
						+ TimeUtils.minToTime(act.getStart()
								+ act.getDuration()));
			}
			return convertView;
		}
	}

	/**
	 * Listener for clicks on items in the activity list.
	 */
	public class OnActivityClickListener implements OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> arg0, View arg1, int position,
				long arg3) {
			Intent in = new Intent(ViewTripActivity.this,
					ViewActivityActivity.class);
			in.putExtra("tripActivity", mAdapter.getItem(position));
			in.putExtra("trip", trip);
			ViewTripActivity.this.startActivity(in);
		}
	}
}
