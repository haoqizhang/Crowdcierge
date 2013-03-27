package com.csail.uid.data;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;

public class Trip implements Parcelable {
	private String tid;
	private String title;
	private ArrayList<String> activityIds = new ArrayList<String>();

	private String startName;
	private long startLat;
	private long startLong;

	private String endName;
	private long endLat;
	private long endLong;

	private int startTime;
	private int endTime;

	private JSONObject originalObj;

	public Trip(String JSON) {
		try {
			originalObj = new JSONObject(JSON);
			JSONObject state = new JSONObject(originalObj.getString("state"));
			JSONObject admin = state.getJSONObject("admin");
			JSONArray itinerary = state.getJSONArray("itinerary");

			tid = admin.getString("id");
			title = admin.getString("name");
			for (int i = 0; i < itinerary.length(); i++) {
				activityIds.add(itinerary.getString(i));
			}

			startTime = admin.getInt("beginTime");
			endTime = admin.getInt("endTime");

			JSONObject start = admin.getJSONObject("start");
			JSONObject end = admin.getJSONObject("end");

			startName = start.getString("name");
			startLat = start.getLong("lat");
			startLong = start.getLong("long");

			endName = end.getString("name");
			endLat = end.getLong("lat");
			endLong = end.getLong("long");

		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	public Trip(Parcel in) {
		Bundle b = in.readBundle();
		tid = b.getString("tid");
		title = b.getString("title");
		activityIds = b.getStringArrayList("activityIds");
	}

	public String getTitle() {
		return title;
	}

	public String getTid() {
		return tid;
	}

	public String getStartName() {
		return startName;
	}

	public long getStartLat() {
		return startLat;
	}

	public long getStartLong() {
		return startLong;
	}

	public String getEndName() {
		return endName;
	}

	public long getEndLat() {
		return endLat;
	}

	public long getEndLong() {
		return endLong;
	}

	public int getStartTime() {
		return startTime;
	}

	public int getEndTime() {
		return endTime;
	}

	public ArrayList<String> getActivityIds() {
		return activityIds;
	}

	/**
	 * Exposed for convenience when editing trip state. Much easier to modify
	 * old JSON object than rebuild.
	 */
	public JSONObject getOriginalObj() {
		return originalObj;
	}

	@Override
	public int describeContents() {
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		Bundle b = new Bundle();
		b.putString("tid", tid);
		b.putString("title", title);
		b.putStringArrayList("activityIds", activityIds);

		dest.writeBundle(b);
	}

	public static final Parcelable.Creator<Trip> CREATOR = new Parcelable.Creator<Trip>() {
		public Trip createFromParcel(Parcel in) {
			return new Trip(in);
		}

		public Trip[] newArray(int size) {
			return new Trip[size];
		}
	};
}
