package com.csail.uid.crowdcierge.activities;

import java.util.ArrayList;
import java.util.Arrays;

import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.data.Trip;
import com.csail.uid.crowdcierge.data.TripActivity;
import com.csail.uid.crowdcierge.util.Constants;

public class EditTripActivity extends Activity {

	private Spinner typeSpinner;
	private ArrayAdapter<String> mSpinnerAdapter;
	private View customView;
	private Button relatedBtn;
	private Button keepBtn;

	private Trip trip;
	private ArrayList<TripActivity> activities;
	private ArrayList<String> activityNames;

	private String requestType;
	private TripActivity relatedActivity;
	private ArrayList<TripActivity> keepActivities;

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

		for (String text : Constants.REQUEST_TEXT) {
			mSpinnerAdapter.add(text);
		}
		mSpinnerAdapter.notifyDataSetChanged();

		customView = findViewById(R.id.editCustom);
		relatedBtn = (Button) findViewById(R.id.editTripRelatedActivity);
		keepBtn = (Button) findViewById(R.id.editTripKeepActivity);

		for (TripActivity t : activities) {
			activityNames.add(t.getLabel());
		}

		configureLists();
	}

	private void configureLists() {
		typeSpinner.setOnItemSelectedListener(new OnItemSelectedListener() {
			@Override
			public void onItemSelected(AdapterView<?> parentView,
					View selectedItemView, int position, long id) {
				requestType = Constants.REQUEST_TYPES[position];
				if (Arrays.asList(Constants.MESSAGE_REQUESTS).contains(
						requestType)) {
					customView.setVisibility(View.VISIBLE);
				} else {
					customView.setVisibility(View.GONE);
				}

				if (Arrays.asList(Constants.RELATED_REQUESTS).contains(
						requestType)) {
					relatedBtn.setText("No need to select activity");
					relatedBtn.setEnabled(false);
				} else {
					relatedBtn.setText("Select related activity");
					relatedBtn.setEnabled(true);
					relatedActivity = null;
				}
			}

			@Override
			public void onNothingSelected(AdapterView<?> parentView) {
				// empty
			}
		});

		relatedBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new RelatedActivityDialogFragment()).show(
						getFragmentManager(), "related");
			}
		});
		
		keepBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				(new KeepActivitiesDialogFragment()).show(
						getFragmentManager(), "related");
			}
		});
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
	 * Submit final edit TODO
	 */
	public void submitEdit(View v) {

	}

	public class RelatedActivityDialogFragment extends DialogFragment {
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
			// Set the dialog title
			builder.setTitle("Related Activity")
					// Specify the list array, the items to be selected by
					// default (null for none),
					// and the listener through which to receive callbacks when
					// items are selected
					.setItems(
							activityNames.toArray(new CharSequence[activityNames
									.size()]),
							new DialogInterface.OnClickListener() {

								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									// TODO Auto-generated method stub

								}
							});

			return builder.create();
		}
	}

	public class KeepActivitiesDialogFragment extends DialogFragment {
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
			// Set the dialog title
			builder.setTitle("Activities to Keep")
					// Specify the list array, the items to be selected by
					// default (null for none),
					// and the listener through which to receive callbacks when
					// items are selected
					.setMultiChoiceItems(
							activityNames.toArray(new CharSequence[activityNames
									.size()]), null,
							new DialogInterface.OnMultiChoiceClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int which, boolean isChecked) {
									if (isChecked) {
									}
								}
							})

					.setPositiveButton("Ok",
							new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int id) {
								}
							});

			return builder.create();
		}
	}
}
