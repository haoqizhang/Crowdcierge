package com.csail.uid.crowdcierge;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

import com.csail.uid.data.TripActivity;
import com.csail.uid.util.TimeUtils;

public class ViewActivityActivity extends Activity {

	private TripActivity activity;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_activity);

		activity = getIntent().getParcelableExtra("tripActivity");
		
		populateInfo();
	}
	
	private void populateInfo() {
		TextView title = (TextView) findViewById(R.id.viewActivityName);
		title.setText(activity.getLabel());
		
		TextView desc = (TextView) findViewById(R.id.viewActivityDescription);
		desc.setText(activity.getDescription());
		
		TextView start = (TextView) findViewById(R.id.viewActivityStart);
		start.setText("Starts at " + TimeUtils.minToTime(activity.getStart()));
		
		TextView duration= (TextView) findViewById(R.id.viewActivityDuration);
		duration.setText("Takes " + activity.getDuration() + " min");
	}
}
