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
