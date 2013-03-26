package com.csail.uid.crowdcierge;

import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.csail.uid.data.Trip;
import com.csail.uid.data.TripActivity;
import com.csail.uid.util.GetHelper;
import com.csail.uid.util.GetHelper.GetCallback;

public class ViewTripActivity extends Activity {
	private boolean inProgress;
	private Trip trip;
	private HashMap<String, TripActivity> userStream = new HashMap<String, TripActivity>();

	private ListView activityList;
	private ActivityListAdapter mAdapter;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_trip);

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
			}
		})).execute();
	}

	/**
	 * Fill activity list with the trip's activities
	 */
	private void populateActivityList() {
		mAdapter.clear();
		for (String id : trip.getActivityIds()) {
			mAdapter.add(userStream.get(id));
		}
		mAdapter.notifyDataSetChanged();
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
			TextView view = new TextView(ViewTripActivity.this);
			TripActivity act = getItem(position);
			view.setText(act.getLabel() + " / " + act.getStart() + " / "
					+ act.getDuration());
			view.setTextSize(20);

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
			Intent in = new Intent(ViewTripActivity.this,
					ViewActivityActivity.class);
			in.putExtra("tripActivity", mAdapter.getItem(position));
			ViewTripActivity.this.startActivity(in);
		}
	}
}
