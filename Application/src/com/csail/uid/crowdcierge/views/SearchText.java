package com.csail.uid.crowdcierge.views;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.widget.EditText;

import com.csail.uid.crowdcierge.R;

public class SearchText extends EditText {

	public SearchText(Context context) {
		super(context);
		init();
	}
	
	public SearchText(Context context, AttributeSet attrs) {
		super(context, attrs);
		init();
	}
	
	public SearchText(Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		init();
	}
	
	private void init() {
		final Drawable x = getResources().getDrawable(
				R.drawable.light_x);
		x.setBounds(0, 0, 35, 35);
		this.setOnTouchListener(new OnTouchListener() {
			@Override
			public boolean onTouch(View v, MotionEvent event) {
				if (SearchText.this.getCompoundDrawables()[2] == null) {
					return false;
				}
				if (event.getAction() != MotionEvent.ACTION_UP) {
					return false;
				}
				if (event.getX() > SearchText.this.getWidth()
						- SearchText.this.getPaddingRight() - x.getIntrinsicWidth()) {
					SearchText.this.setText("");
					SearchText.this.setCompoundDrawables(null, null, null, null);
				}
				return false;
			}
		});
		this.addTextChangedListener(new TextWatcher() {
			@Override
			public void onTextChanged(CharSequence s, int start, int before,
					int count) {
				SearchText.this.setCompoundDrawables(null, null, SearchText.this
						.getText().toString().equals("") ? null : x, null);
			}

			@Override
			public void afterTextChanged(Editable arg0) {
			}

			@Override
			public void beforeTextChanged(CharSequence s, int start, int count,
					int after) {
			}
		});
	}
}
