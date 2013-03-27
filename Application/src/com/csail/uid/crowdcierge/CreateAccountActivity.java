package com.csail.uid.crowdcierge;

import java.util.HashMap;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.TextView;

import com.csail.uid.util.Constants;
import com.csail.uid.util.GetHelper.HttpCallback;
import com.csail.uid.util.PostHelper;

public class CreateAccountActivity extends Activity {
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.create_account);

		final Button createBtn = (Button) findViewById(R.id.createAccountCreateButton);
		createBtn.setEnabled(false);
		
		CheckBox approve = (CheckBox) findViewById(R.id.approvalCheckbox);
		approve.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				createBtn.setEnabled(isChecked);
			}
		});
	}

	@Override
	public void onBackPressed() {
		Intent in = new Intent(CreateAccountActivity.this, SignInActivity.class);
		CreateAccountActivity.this.startActivity(in);
		CreateAccountActivity.this.finish();
	}

	/**
	 * Create account based on form info
	 */
	public void createAccount(View v) {
		final ProgressDialog progress = ProgressDialog.show(this,
				"Creating Your Account", "One moment please...", true);

		final TextView nameView = (TextView) findViewById(R.id.nameInput);
		final TextView emailView = (TextView) findViewById(R.id.emailInput);
		boolean error = false;

		// Check form field errors
		if (nameView.getText().length() == 0) {
			nameView.setError("Please input your name");
			error = true;
		}
		if (emailView.getText().length() == 0) {
			emailView.setError("Please input your email address");
			error = true;
		}

		if (error) {
			progress.dismiss();
			return;
		}
		
		String url = Constants.PHP_URL + "createSubjectRaw.php";
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("name", nameView.getText().toString());
		params.put("email", emailView.getText().toString());

		(new PostHelper(url, params, new HttpCallback() {
			@Override
			public void onHttpExecute(String JSON) {
				progress.dismiss();
				if (JSON.contains("error")) {
					return;
				}
				Intent in = new Intent(CreateAccountActivity.this, MainActivity.class);
				in.putExtra("uid", JSON.trim());
				CreateAccountActivity.this.startActivity(in);
				CreateAccountActivity.this.finish();
			}
		})).execute();
	}
}
