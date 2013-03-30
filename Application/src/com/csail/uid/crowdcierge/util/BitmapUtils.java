package com.csail.uid.crowdcierge.util;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;

public class BitmapUtils {
	public static Bitmap drawNumberOnPin(Context gContext, int gResId,
			String gText) {
		Resources resources = gContext.getResources();
		float scale = resources.getDisplayMetrics().density;
		Bitmap bitmap = BitmapFactory.decodeResource(resources, gResId);

		Config bitmapConfig = bitmap.getConfig();
		// set default bitmap config if none
		if (bitmapConfig == null) {
			bitmapConfig = Config.ARGB_8888;
		}
		// resource bitmaps are imutable,
		// so we need to convert it to mutable one
		bitmap = bitmap.copy(bitmapConfig, true);

		Canvas canvas = new Canvas(bitmap);
		// new antialised Paint
		Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
		// text color - #3D3D3D
		paint.setColor(Color.WHITE);
		// text size in pixels
		paint.setTextSize((int) (12 * scale));
		// text shadow
		paint.setShadowLayer(1f, 0f, 1f, Color.BLACK);

		// draw text to the Canvas center
		Rect bounds = new Rect();
		paint.getTextBounds(gText, 0, gText.length(), bounds);
		
		int offset = gText.length() == 2 ? 12 : 9;
		int x = bitmap.getWidth() / 2 - offset;
		int y = (int) Math.floor((bitmap.getHeight()) / 3.5);

		canvas.drawText(gText, x * scale, y * scale, paint);

		return bitmap;
	}
}
