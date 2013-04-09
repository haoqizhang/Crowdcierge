package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;

import android.app.ActionBar;
import android.app.Activity;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;

public class EditTripActivity extends Activity {

	private Spinner typeSpinner;
	private ArrayAdapter<String> mSpinnerAdapter;

	private final String[] requestTypes = { "replace", "delayed", "stuck",
			"addMoreLike", "addNow", "cantGo", "custom" };
	private final String[] requestText = { "I'd like an activity changed",
			"I'm delayed", "I'm stuck", "I want more activites of this type",
			"I need something to do right now", "I can't do the next activity",
			"Custom Message" };
	
	private Trip trip;
	private ArrayList<TripActivity> activities;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.edit_trip);

		trip = getIntent().getParcelableExtra("trip");
		activities = getIntent().getParcelableArrayListExtra("activities");
		
		ActionBar bar = getActionBar();
		bar.setTitle("Edit Trip: " + trip.getTitle());
		bar.setDisplayHomeAsUpEnabled(true);
		
		typeSpinner = (Spinner) findViewById(R.id.editTypeSpinner);
		mSpinnerAdapter = new ArrayAdapter<String>(this,
				android.R.layout.simple_spinner_item);
		mSpinnerAdapter
				.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		typeSpinner.setAdapter(mSpinnerAdapter);

		for (String text : requestText) {
			mSpinnerAdapter.add(text);
		}
		mSpinnerAdapter.notifyDataSetChanged();
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
	 * Cancel requesting an edit
	 */
	public void cancelEdit(View v) {
		onBackPressed();
	}
	
	/**
	 * Submit final edit
	 * TODO
	 */
	public void submitEdit(View v) {
		
	}
}
