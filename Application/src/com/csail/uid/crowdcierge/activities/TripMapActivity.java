package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;
import java.util.HashMap;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.BitmapUtils;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMap.OnInfoWindowClickListener;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

public class TripMapActivity extends Activity {

	private GoogleMap map;
	private ArrayList<TripActivity> activities;
	private Trip trip;
	private HashMap<Marker, TripActivity> markerMap = new HashMap<Marker, TripActivity>();

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.maps_activity_exp);
		getActionBar().hide();

		map = ((MapFragment) getFragmentManager().findFragmentById(R.id.map))
				.getMap();
		trip = getIntent().getParcelableExtra("trip");
		activities = getIntent().getParcelableArrayListExtra("activities");

		for (int i = 0; i < activities.size(); i++) {
			TripActivity activity = activities.get(i);

			LatLng latLng = new LatLng(activity.getLatitude(),
					activity.getLongitude());
			String label = activity.getLabel();

			BitmapDescriptor icon;
			if (activity.getLabel().equals("Start")) {
				icon = BitmapDescriptorFactory
						.defaultMarker(BitmapDescriptorFactory.HUE_GREEN);
				CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(
						latLng, 13);
				map.moveCamera(cameraUpdate);
			} else if (activity.getLabel().equals("End")) {
				icon = BitmapDescriptorFactory
						.defaultMarker(BitmapDescriptorFactory.HUE_RED);
				latLng = new LatLng(activity.getLatitude() + 0.00015,
						activity.getLongitude() + 0.00015);
			} else {
				icon = BitmapDescriptorFactory.fromBitmap(BitmapUtils
						.drawNumberOnPin(this, R.drawable.azure_pin_large_2, i
								+ ""));
			}

			Marker m = map.addMarker(new MarkerOptions().title(label)
					.snippet("@" + activity.getLocationName()).icon(icon)
					.position(latLng));

			markerMap.put(m, activity);
		}

		map.setOnInfoWindowClickListener(new OnInfoWindowClickListener() {
			public void onInfoWindowClick(Marker marker) {
				Intent in = new Intent(TripMapActivity.this,
						ViewActivityActivity.class);
				in.putExtra("tripActivity", markerMap.get(marker));
				in.putExtra("trip", trip);
				TripMapActivity.this.startActivity(in);
			}
		});
	}
}
