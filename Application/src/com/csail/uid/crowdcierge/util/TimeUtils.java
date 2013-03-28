package com.csail.uid.crowdcierge.util;

public class TimeUtils {

	/**
	 * Static function for taking minute value and returning time string
	 */
	public static String minToTime(int time) {
		if (time > 1440) {
			time -= 1440;
		}
		
		String AMPM = "am";
		int minutes = time % 60;
		int hour = (int) Math.floor(time / 60);
		
		// rounding for pretty display
	    if (minutes % 10 >= 5) {
	        minutes += (10 - (minutes % 10));
	        if (minutes == 60) {
	            minutes = 0;
	            hour += 1;
	        }
	    } else if (minutes % 10 != 0) {
	        minutes += (5 - (minutes % 10));
	    }
	    
		if (hour >= 12) {
			AMPM = "pm";
			if (hour > 12) {
				hour -= 12;
			}
		}
		
		if (hour == 0) {
			hour = 12;
		}
		
		String min = "" + minutes;
		if (minutes < 10) {
			min = "0" + minutes;
		}
		
		return hour + ":" + min + AMPM;
	}

}
