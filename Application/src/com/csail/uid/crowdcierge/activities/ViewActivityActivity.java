package com.csail.uid.crowdcierge.activities;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.TimeUtils;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

public class ViewActivityActivity extends Activity {

	private TripActivity activity;
	private Trip trip;
	private GoogleMap map;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.view_activity);

		activity = getIntent().getParcelableExtra("tripActivity");
		trip = getIntent().getParcelableExtra("trip");

		ActionBar bar = getActionBar();
		bar.setTitle(activity.getLabel());
		bar.setDisplayHomeAsUpEnabled(true);

		populateInfo();
		placeMapMarker();
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
	 * Populates info fields
	 */
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
	}

	/**
	 * Places a marker on the map fragment, centers it, and opens the info
	 * window
	 */
	private void placeMapMarker() {
		map = ((MapFragment) getFragmentManager().findFragmentById(
				R.id.viewActivityMap)).getMap();
		LatLng latLng = new LatLng(activity.getLatitude(),
				activity.getLongitude());

		float color;
		if (activity.getLabel().equals("Start")) {
			color = BitmapDescriptorFactory.HUE_GREEN;
		} else if (activity.getLabel().equals("End")) {
			color = BitmapDescriptorFactory.HUE_RED;
		} else {
			color = BitmapDescriptorFactory.HUE_AZURE;
		}

		Marker m = map.addMarker(new MarkerOptions().title(activity.getLabel())
				.snippet("@" + activity.getLocationName())
				.icon(BitmapDescriptorFactory.defaultMarker(color))
				.position(latLng));

		CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(latLng,
				14);
		map.moveCamera(cameraUpdate);
		m.showInfoWindow();
	}

	/**
	 * Jumps to Google Maps application to start direction navigation
	 */
	public void startMapDirections(View v) {
		String uri = "http://maps.google.com/maps?f=d&hl=en&daddr="
				+ activity.getLatitude() + "," + activity.getLongitude()
				+ "&saddr=" + getBestLocation().getLatitude() + ","
				+ getBestLocation().getLongitude() + "&directionsmode="
				+ trip.getDirectionsMode();
		Intent intent = new Intent(android.content.Intent.ACTION_VIEW,
				Uri.parse(uri));
		intent.setClassName("com.google.android.apps.maps",
				"com.google.android.maps.MapsActivity");
		startActivity(intent);
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
}
