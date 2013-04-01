package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.util.Constants;
import com.csail.uid.crowdcierge.util.GetHelper;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;

public class ViewTripListActivity extends Activity {

	private List<String> taskIds;
	
	@SuppressWarnings("unused")
	private String uid;
	
	private TripTimeType type;

	private ListView tripList;
	private View prog;
	private TripListAdapter mAdapter;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_trip_list);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);

		uid = prefs.getString("uid", null);
		type = (TripTimeType) getIntent().getSerializableExtra("listType");

		prog = findViewById(R.id.tripListProgress);
		tripList = (ListView) findViewById(R.id.tripList);
		mAdapter = new TripListAdapter(this);
		tripList.setAdapter(mAdapter);
		tripList.setOnItemClickListener(new OnTripClickListener());
		
		switch (type) {
		case FUTURE:
			getActionBar().setTitle("Upcoming Trips");
			break;
		case PRESENT:
			getActionBar().setTitle("Current Trips");
			break;
		case PAST:
			getActionBar().setTitle("Past Trips");
			break;
		}
		
		getActionBar().setDisplayHomeAsUpEnabled(true);
		
		getTaskList();
		addTripsToList();
		
		HashSet<String> set = new HashSet<String>();
		set.addAll(taskIds);
		prefs.edit().putStringSet("test", new HashSet<String>());
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

	/**
	 * Gets list of task IDs. Currently uses a static set.
	 * 
	 * TODO Get trips
	 */
	private void getTaskList() {
		taskIds = new ArrayList<String>();
		
		switch (type) {
		case FUTURE:
			taskIds.add("453ad2e6eeda9e3ccd9d2739c0f1025d");
			break;
		case PRESENT:
			taskIds.add("a31b5015bac8dce3a4e417b5d7fdcb31");
			break;
		case PAST:
			taskIds.add("6d33280aa09b19776b7721c98c784223");
			taskIds.add("083bae9b539973499cf654cd97928b97");
			taskIds.add("07b00cdb35f7d7b6f78b143435be4233");
			taskIds.add("08cb0514714ab393ee85f4a81688d3da");
			taskIds.add("71928f85675acec8da164b317c0acb08");
			taskIds.add("2507f771e649290105c5180852db4d01");
			taskIds.add("1ad763711678e776436bd16678d27dc5");
			taskIds.add("4b4ef627007a24382602411ca491d1e1");
			taskIds.add("72f2a275c14c3af09e6c2f2b73f03241");
			break;
		}
	}

	/**
	 * Gets trip info for each trip ID in the list. Adds to adapter to populate
	 * list.
	 */
	private void addTripsToList() {
		mAdapter.clear();

		for (final String tid : taskIds) {
			String url = Constants.PHP_URL + "loadTurkTourTaskState.php";
			HashMap<String, String> params = new HashMap<String, String>();
			params.put("type", "turktour");
			params.put("id", tid);

			(new GetHelper(url, params, new HttpCallback() {
				@Override
				public void onHttpExecute(String JSON) {
					Trip t = new Trip(JSON);
					if (type == TripTimeType.PRESENT && taskIds.size() == 1) {
						Intent in = new Intent(ViewTripListActivity.this,
								ViewTripActivity.class);
						in.putExtra("tripType", type);
						in.putExtra("isSingle", true);
						in.putExtra("trip", t);
						ViewTripListActivity.this.startActivity(in);
						ViewTripListActivity.this.finish();
						return;
					}
					mAdapter.add(t);
					mAdapter.notifyDataSetChanged();
					
					// Only remove progress bar when all trips are loaded
					if (mAdapter.getCount() == taskIds.size()) {
						prog.setVisibility(View.GONE);
						tripList.setVisibility(View.VISIBLE);
					}
				}
			})).execute();
		}
	}

	/**
	 * Adapter for trip list view.
	 */
	public class TripListAdapter extends ArrayAdapter<Trip> implements
			ListAdapter {

		public TripListAdapter(Context context) {
			super(context, 0);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			Trip trip = getItem(position);
			convertView = LayoutInflater.from(getContext()).inflate(
					R.layout.trip_row, null);

			TextView label = (TextView) convertView
					.findViewById(R.id.tripLabel);
			label.setText(trip.getTitle());

			TextView location = (TextView) convertView
					.findViewById(R.id.tripLocation);
			location.setText(trip.getCity());

			TextView times = (TextView) convertView
					.findViewById(R.id.tripDate);
			times.setText(trip.getDate());
			
			return convertView;
		}
	}

	/**
	 * Listener for clicks on items in the trip list.
	 */
	public class OnTripClickListener implements OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> arg0, View arg1, int position,
				long arg3) {
			Intent in = new Intent(ViewTripListActivity.this,
					ViewTripActivity.class);
			in.putExtra("tripType", type);
			in.putExtra("trip", mAdapter.getItem(position));
			ViewTripListActivity.this.startActivity(in);
		}
	}
	
	public enum TripTimeType {
		PAST, PRESENT, FUTURE;
	}
}
