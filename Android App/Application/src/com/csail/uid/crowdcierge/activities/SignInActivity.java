package com.csail.uid.crowdcierge.activities;

import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.ActionBar;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.EditText;

import com.csail.uid.crowdcierge.R;
import com.csail.uid.crowdcierge.util.Constants;
import com.csail.uid.crowdcierge.util.GetHelper;
import com.csail.uid.crowdcierge.util.GetHelper.HttpCallback;

/**
 * Sign in activity shown at launch. Gets user ID from entered email address.
 * 
 * @author Joey Rafidi
 */
public class SignInActivity extends Activity {

	private ProgressDialog prog;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.signin);

		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		if (prefs.getString("uid", null) != null) {
			Intent in = new Intent(SignInActivity.this, MainActivity.class);
			in.putExtra("uid", prefs.getString("uid", null));
			in.putExtra("name", prefs.getString("name", null));
			in.putExtra("email", prefs.getString("email", null));
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
		final EditText input = (EditText) findViewById(R.id.usernameInput);
		final String email = input.getText().toString();

		if (email == null || email.equals("")) {
			input.setError("Please enter an email address");
			return;
		}

		String url = Constants.PHP_URL + "getUserInfo.php";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("email", email);

		prog = ProgressDialog.show(this, "Signing in", "One moment please...");
		(new GetHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				prog.dismiss();
				if (JSON.contains("no user")) {
					input.setError("No user found for this email!");
				} else {
					try {
						JSONObject obj = new JSONObject(JSON);
						Intent in = new Intent(SignInActivity.this,
								MainActivity.class);
						in.putExtra("uid", obj.getString("id"));
						in.putExtra("email", email);
						in.putExtra("name", obj.getString("name"));
						SignInActivity.this.startActivity(in);
						SignInActivity.this.finish();
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			}
		})).execute();
	}

	/**
	 * Launches create account activity. Currently void.
	 */
	public void launchCreateAccount(View v) {
		Intent in = new Intent(SignInActivity.this, CreateAccountActivity.class);
		this.startActivity(in);
		this.finish();
	}
}
