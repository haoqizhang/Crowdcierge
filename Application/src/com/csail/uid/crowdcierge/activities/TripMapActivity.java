package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.BitmapUtils;
import com.csail.uid.crowdcierge.util.GetHelper;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;
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
import com.google.android.gms.maps.model.PolylineOptions;

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

			if (i != activities.size() - 1) {
				addRouteLine(i);
			}
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

	/**
	 * Adds route between all points at once. Does not work with public transit
	 * for some reason.
	 */
	@SuppressWarnings("unused")
	private void addFullRouteLine() {
		String url = "http://dev.virtualearth.net/REST/v1/Routes/Walking";
		HashMap<String, String> params = new HashMap<String, String>();
		for (int i = 0; i < activities.size(); i++) {
			double cLat = activities.get(i).getLatitude();
			double cLong = activities.get(i).getLongitude();
			params.put("waypoint." + (i + 1), cLat + "," + cLong);
		}
		params.put("routePathOutput", "Points");
		params.put("output", "json");
		params.put("distanceUnit", "mi");
		params.put("timeType", "Departure");
		params.put("dateTime", "3:00:00PM");
		params.put("key",
				"AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp");

		(new GetHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				try {
					JSONObject result = new JSONObject(JSON);
					JSONObject resourceSet = result
							.getJSONArray("resourceSets").getJSONObject(0);
					JSONArray coordinates = resourceSet
							.getJSONArray("resources").getJSONObject(0)
							.getJSONObject("routePath").getJSONObject("line")
							.getJSONArray("coordinates");

					PolylineOptions polyline = new PolylineOptions();

					for (int i = 0; i < coordinates.length(); i++) {
						JSONArray coord = coordinates.getJSONArray(i);
						LatLng point = new LatLng(coord.getDouble(0),
								coord.getDouble(1));
						polyline.add(point);
					}

					polyline.color(Color.GREEN).width(7);

					map.addPolyline(polyline);

				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		})).execute();
	}

	/**
	 * Adds route between two activities (index and index+1);
	 */
	private void addRouteLine(int index) {
		double startLat = activities.get(index).getLatitude();
		double startLong = activities.get(index).getLongitude();
		double endLat = activities.get(index + 1).getLatitude();
		double endLong = activities.get(index + 1).getLongitude();

		String url = "http://dev.virtualearth.net/REST/v1/Routes/Transit";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("waypoint.1", startLat + "," + startLong);
		params.put("waypoint.2", endLat + "," + endLong);
		params.put("routePathOutput", "Points");
		params.put("output", "json");
		params.put("timeType", "Departure");
		params.put("dateTime", "3:00:00PM");
		params.put("distanceUnit", "mi");
		params.put("key",
				"AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp");
		
		(new GetHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				try {
					JSONObject result = new JSONObject(JSON);
					JSONObject resourceSet = result
							.getJSONArray("resourceSets").getJSONObject(0);
					JSONArray coordinates = resourceSet
							.getJSONArray("resources").getJSONObject(0)
							.getJSONObject("routePath").getJSONObject("line")
							.getJSONArray("coordinates");

					PolylineOptions polyline = new PolylineOptions();

					for (int i = 0; i < coordinates.length(); i++) {
						JSONArray coord = coordinates.getJSONArray(i);
						LatLng point = new LatLng(coord.getDouble(0),
								coord.getDouble(1));
						polyline.add(point);
					}
					polyline.color(Color.GREEN).width(7);

					map.addPolyline(polyline);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		})).execute();
	}
}
