package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

public class MapsActivity extends Activity {

	private GoogleMap map;
	private ArrayList<TripActivity> activities;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.maps_activity_exp);
		getActionBar().hide();
		
		map = ((MapFragment) getFragmentManager().findFragmentById(R.id.map))
				.getMap();
		activities = getIntent().getParcelableArrayListExtra("activities");

		for (int i = 0; i < activities.size(); i++) {
			TripActivity activity = activities.get(i);
			
			LatLng latLng = new LatLng(activity.getLatitude(),
					activity.getLongitude());
			String label = activity.getLabel();
			float color;
			if (activity.getLabel().equals("Start")) {
				color = BitmapDescriptorFactory.HUE_GREEN;
				CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(
						latLng, 14);
				map.moveCamera(cameraUpdate);
			} else if (activity.getLabel().equals("End")) {
				color = BitmapDescriptorFactory.HUE_RED;
				latLng = new LatLng(activity.getLatitude() + 0.00015, activity.getLongitude() + 0.00015);
			} else {
				label = i + ". " + label;
				color = BitmapDescriptorFactory.HUE_AZURE;
			}

			map.addMarker(new MarkerOptions().title(label)
					.snippet("@" + activity.getLocationName())
					.icon(BitmapDescriptorFactory.defaultMarker(color))
					.position(latLng));
		}
	}
}
