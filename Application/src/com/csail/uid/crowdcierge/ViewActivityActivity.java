package com.csail.uid.crowdcierge;

import android.app.Activity;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.widget.TextView;

import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.TimeUtils;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

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
		desc.setMovementMethod(ScrollingMovementMethod.getInstance());
		desc.setText(activity.getDescription());

		TextView start = (TextView) findViewById(R.id.viewActivityLocation);
		start.setText("@" + activity.getLocationName());

		TextView times = (TextView) findViewById(R.id.viewActivityTimes);
		if (activity.isEndpoint()) {
			times.setText(TimeUtils.minToTime(activity.getStart()));
		} else {
			times.setText(TimeUtils.minToTime(activity.getStart())
					+ "-"
					+ TimeUtils.minToTime(activity.getStart()
							+ activity.getDuration()));
		}
		
		System.out.println(activity.getLatitude()+ " " + activity.getLongitude());
		
		GoogleMap map = ((MapFragment) getFragmentManager().findFragmentById(
				R.id.viewActivityMap)).getMap();
		LatLng latLng = new LatLng(activity.getLatitude(),
				activity.getLongitude());
		map.addMarker(new MarkerOptions().title(activity.getLabel())
				.snippet("@" + activity.getLocationName()).position(latLng));
		
		CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(latLng, 14);
	    map.moveCamera(cameraUpdate);
	}
}
