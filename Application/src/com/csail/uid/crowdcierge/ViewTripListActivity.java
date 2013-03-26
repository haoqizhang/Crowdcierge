package com.csail.uid.crowdcierge;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.csail.uid.data.Trip;
import com.csail.uid.util.GetHelper;
import com.csail.uid.util.GetHelper.GetCallback;

public class ViewTripListActivity extends Activity {

	private List<String> taskIds;
	private String uid;
	private boolean inProgress;

	private ListView tripList;
	private TripListAdapter mAdapter;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_trip_list);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);

		uid = prefs.getString("uid", null);
		inProgress = getIntent().getBooleanExtra("inProgress", false);

		tripList = (ListView) findViewById(R.id.tripList);
		mAdapter = new TripListAdapter(this);
		tripList.setAdapter(mAdapter);
		tripList.setOnItemClickListener(new OnTripClickListener());

		getTaskList();
		addTripsToList();
	}

	/**
	 * Gets list of task IDs. Currently uses a static set.
	 */
	private void getTaskList() {
		taskIds = new ArrayList<String>();
		if (inProgress) {
			taskIds.add("a31b5015bac8dce3a4e417b5d7fdcb31");
		} else {
			taskIds.add("92f792d5f805b79974466450f528d24e");
			taskIds.add("453ad2e6eeda9e3ccd9d2739c0f1025d");
			taskIds.add("a31b5015bac8dce3a4e417b5d7fdcb31");
			taskIds.add("6d33280aa09b19776b7721c98c784223");
			taskIds.add("083bae9b539973499cf654cd97928b97");
			taskIds.add("07b00cdb35f7d7b6f78b143435be4233");
			taskIds.add("08cb0514714ab393ee85f4a81688d3da");
			taskIds.add("71928f85675acec8da164b317c0acb08");
			taskIds.add("2507f771e649290105c5180852db4d01");
			taskIds.add("1ad763711678e776436bd16678d27dc5");
			taskIds.add("4b4ef627007a24382602411ca491d1e1");
			taskIds.add("72f2a275c14c3af09e6c2f2b73f03241");
		}
	}
	
	/**
	 * Gets trip info for each trip ID in the list. Adds to adapter to populate list.
	 */
	private void addTripsToList() {
		mAdapter.clear();
		
		for (final String tid : taskIds) {
			String url = "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/loadTurkTourTaskState.php";
			HashMap<String, String> params = new HashMap<String, String>();
			params.put("type", "turktour");
			params.put("id", tid);
		
			(new GetHelper(url, params, new GetCallback() {
				@Override
				public void onGetExecute(String JSON) {
					try {
						JSONObject top = new JSONObject(JSON);
						JSONObject state = new JSONObject(top.getString("state"));
						JSONObject admin = state.getJSONObject("admin");
						
						Trip t = new Trip(tid);
						t.setTitle(admin.getString("name"));
						
						mAdapter.add(t);
						mAdapter.notifyDataSetChanged();
					} catch (JSONException e) {
						e.printStackTrace();
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
			TextView view = new TextView(ViewTripListActivity.this);
			view.setText(getItem(position).getTitle());
			view.setTextSize(20);
			view.setGravity(Gravity.CENTER_HORIZONTAL);
			
			convertView = view;
			return convertView;
		}
	}
	
	/**
	 * Listener for clicks on items in the trip list.
	 */
	public class OnTripClickListener implements OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> arg0, View arg1, int position, long arg3) {
			Intent in = new Intent(ViewTripListActivity.this, ViewTripActivity.class);
			in.putExtra("inProgress", inProgress);
			in.putExtra("tid", mAdapter.getItem(position).getTid());
			ViewTripListActivity.this.startActivity(in);
		}
	}

}
