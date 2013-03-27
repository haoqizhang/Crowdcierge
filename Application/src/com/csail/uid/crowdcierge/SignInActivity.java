package com.csail.uid.crowdcierge;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;

/**
 * Sign in activity shown at launch. Gets user ID from entered email address.
 * 
 * @author Joey Rafidi
 */
public class SignInActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.signin);

		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		if (prefs.getString("uid", null) != null) {
			Intent in = new Intent(SignInActivity.this, MainActivity.class);
			in.putExtra("uid", prefs.getString("uid", null));
			SignInActivity.this.startActivity(in);
			this.finish();
		}

		ActionBar bar = getActionBar();
		bar.hide();
	}

	/**
	 * Sign in function, bound to the sign in button. Currently starts
	 * MainActivity with test user id.
	 */
	public void signIn(View v) {
		Intent in = new Intent(SignInActivity.this, MainActivity.class);
		in.putExtra("uid", getUserId());
		SignInActivity.this.startActivity(in);
		this.finish();
	}

	/**
	 * Gets the user ID for the user signing in. Currently just returns test
	 * user ID.
	 * 
	 * TODO Get User ID
	 * 
	 * @return User ID matching email entered
	 */
	public String getUserId() {
		return "57187fd22e931d8b2145d920967e559d";
	}

	/**
	 * Launches create account activity. Currently void.
	 * 
	 * TODO
	 */
	public void launchCreateAccount(View v) {
		Intent in = new Intent(SignInActivity.this, CreateAccountActivity.class);
		this.startActivity(in);
		this.finish();
	}
}
