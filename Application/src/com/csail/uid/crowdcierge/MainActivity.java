package com.csail.uid.crowdcierge;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
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
		Intent in = new Intent(MainActivity.this, SignInActivity.class);
		MainActivity.this.startActivity(in);
		this.finish();
	}
}
