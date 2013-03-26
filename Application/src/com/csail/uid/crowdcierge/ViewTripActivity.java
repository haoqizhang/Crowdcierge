package com.csail.uid.crowdcierge;

import java.util.HashMap;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
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

public class ViewTripActivity extends Activity {
	private String uid;
	private boolean inProgress;
	private Trip trip;
	private HashMap<String, String> userStream = new HashMap<String, String>();
	
	private ListView activityList;
	private ActivityListAdapter mAdapter;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_trip);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);

		uid = prefs.getString("uid", null);
		trip = getIntent().getParcelableExtra("trip");
		inProgress = getIntent().getBooleanExtra("inProgress", false);
		
		activityList = (ListView) findViewById(R.id.activityList);
		mAdapter = new ActivityListAdapter(this);
		activityList.setAdapter(mAdapter);
		activityList.setOnItemClickListener(new OnActivityClickListener());
		
		loadUserStream();
	}
	
	/**
	 * Load the user stream for the trip
	 */
	private void loadUserStream() {
		String url = "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/loadTurkTourStream.php";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("type", "turktour");
		params.put("id", trip.getTid());

		(new GetHelper(url, params, new GetCallback() {
			@Override
			public void onGetExecute(String JSON) {
				Log.w("JSON", JSON);
				mAdapter.notifyDataSetChanged();
			}
		})).execute();
	}
	
	/**
	 * Adapter for activity list view.
	 */
	public class ActivityListAdapter extends ArrayAdapter<String> implements
			ListAdapter {

		public ActivityListAdapter(Context context) {
			super(context, 0);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			TextView view = new TextView(ViewTripActivity.this);
			view.setText(getItem(position));
			view.setTextSize(20);
			view.setGravity(Gravity.CENTER_HORIZONTAL);

			convertView = view;
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
		}
	}
}
