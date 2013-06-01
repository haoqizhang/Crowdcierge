package com.csail.uid.crowdcierge.data;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;

public class TripActivity implements Parcelable {
	private String mapId;
	private String label;
	private String locationName;
	private String description;
	private int duration;
	private int start;
	private double latitude;
	private double longitude;
	private ArrayList<String> categories = new ArrayList<String>();
	private boolean isEndpoint = false;

	public TripActivity(String mapId, JSONObject obj) {
		this.mapId = mapId;
		try {
			label = obj.getString("value");
			
			JSONObject data = obj.getJSONObject("data");
			description = data.getString("description");
			duration = data.getInt("duration");
			if (data.has("start")) {
				start = data.getInt("start");
			} else {
				start = -1;
			}
			
			JSONObject loc = data.getJSONObject("location");
			locationName = loc.getString("name");			
			latitude = loc.getDouble("lat");
	        longitude = loc.getDouble("long");

			JSONArray catArray = data.getJSONArray("categories");
			for (int i = 0; i < catArray.length(); i++) {
				categories.add(catArray.getString(i));
			}
			
			// Fix encoding issues in description
			description = description.replaceAll("Â", "");

		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	public TripActivity(Parcel in) {
		Bundle b = in.readBundle();
		mapId = b.getString("mapId");
		label = b.getString("label");
		locationName = b.getString("locationName");
		description = b.getString("description");
		duration = b.getInt("duration");
		start = b.getInt("start");
		latitude = b.getDouble("latitude");
		longitude = b.getDouble("longitude");
		categories = b.getStringArrayList("categories");
		isEndpoint = b.getBoolean("isEndpoint");
	}

	/**
	 * Creates a start or end point trip activity
	 */
	public TripActivity(String label, String locationName, int start, double latitude, double longitude, boolean isStart) {
		this.label = label;
		this.locationName = locationName;
		this.start = start;
		this.latitude = latitude;
		this.longitude = longitude;
		this.isEndpoint = true;
		
		if (isStart) {
			this.description = "Your trip start location.";
		} else {
			this.description = "Your trip end location.";
		}
	}
	
	public String getMapId() {
		return mapId;
	}

	public String getLabel() {
		return label;
	}

	public String getLocationName() {
		return locationName;
	}

	public String getDescription() {
		return description;
	}

	public int getDuration() {
		return duration;
	}
	
	public int getStart() {
		return start;
	}

	public double getLatitude() {
		return latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public ArrayList<String> getCategories() {
		return categories;
	}
	
	public boolean isEndpoint() {
		return isEndpoint;
	}

	@Override
	public int describeContents() {
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		Bundle b = new Bundle();
		b.putString("mapId", mapId);
		b.putString("label", label);
		b.putString("locationName", locationName);
		b.putString("description", description);
		b.putInt("duration", duration);
		b.putInt("start", start);
		b.putDouble("latitude", latitude);
		b.putDouble("longitude", longitude);
		b.putStringArrayList("categories", categories);
		b.putBoolean("isEndpoint", isEndpoint);
		dest.writeBundle(b);	
	}

	public static final Parcelable.Creator<TripActivity> CREATOR = new Parcelable.Creator<TripActivity>() {
		public TripActivity createFromParcel(Parcel in) {
			return new TripActivity(in);
		}

		public TripActivity[] newArray(int size) {
			return new TripActivity[size];
		}
	};
}
