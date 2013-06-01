package com.csail.uid.crowdcierge.activities;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.activities.ViewTripListActivity.TripTimeType;

/**
 * Main Activity that displays initial menu. Shown after sign in.
 * 
 * @author Joey Rafidi
 */
public class MainActivity extends Activity {
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);

		// Get the user id and store in shared prefs
		if (getIntent().hasExtra("uid")) {
			String uid = getIntent().getStringExtra("uid");
			prefs.edit().putString("uid", uid).commit();
		}

		if (getIntent().hasExtra("name")) {
			String name = getIntent().getStringExtra("name");
			prefs.edit().putString("name", name).commit();
		}

		if (getIntent().hasExtra("email")) {
			String email = getIntent().getStringExtra("email");
			prefs.edit().putString("email", email).commit();
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle item selection
		switch (item.getItemId()) {
		case R.id.menu_signout:
			signOut();
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	/**
	 * Sign out function, called when sign out is selected from the menu.
	 * Currently just jumps back to SignInActivity.
	 */
	public void signOut() {
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		prefs.edit().putString("uid", null).commit();
		prefs.edit().putString("name", null).commit();
		prefs.edit().putString("email", null).commit();

		Intent in = new Intent(MainActivity.this, SignInActivity.class);
		MainActivity.this.startActivity(in);
		this.finish();
	}

	/**
	 * Launches RequestTripActivity. Bound to New Trip button.
	 */
	public void launchRequestTripActivity(View v) {
		Intent in = new Intent(MainActivity.this, RequestTripActivity.class);
		MainActivity.this.startActivity(in);
	}

	/**
	 * Launches ViewListActivity with only the in progress trips.
	 */
	public void launchUpcomingTripsActivity(View v) {
		Intent in = new Intent(MainActivity.this, ViewTripListActivity.class);
		in.putExtra("listType", TripTimeType.FUTURE);
		MainActivity.this.startActivity(in);
	}

	/**
	 * Launches ViewListActivity with only the in progress trips.
	 */
	public void launchInProgressTripsActivity(View v) {
		Intent in = new Intent(MainActivity.this, ViewTripListActivity.class);
		in.putExtra("listType", TripTimeType.PRESENT);
		MainActivity.this.startActivity(in);
	}

	/**
	 * Launches ViewListActivity with all trips available.
	 */
	public void launchPastTripsActivity(View v) {
		Intent in = new Intent(MainActivity.this, ViewTripListActivity.class);
		in.putExtra("listType", TripTimeType.PAST);
		MainActivity.this.startActivity(in);
	}
}
