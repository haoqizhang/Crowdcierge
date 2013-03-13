package com.csail.uid.crowdcierge;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.EditText;

public class SignInActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.signin);

		ActionBar bar = getActionBar();
		bar.hide();
		
		EditText pwView = (EditText) findViewById(R.id.passwordInput);
		pwView.setTypeface(Typeface.DEFAULT);
		pwView.setTransformationMethod(new PasswordTransformationMethod());
	}

	/**
	 * Sign in function, bound to the sign in button. Currently starts
	 * MainActivity with test user and task.
	 */
	public void signIn(View v) {
		Intent in = new Intent(SignInActivity.this, MainActivity.class);
		SignInActivity.this.startActivity(in);
		this.finish();
	}

	/**
	 * Launches create account activity. Currently void.
	 */
	public void launchCreateAccount(View v) {
		//
	}
}
