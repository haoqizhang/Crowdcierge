package com.csail.uid.crowdcierge.util;

public class Constants {

	public static final String PHP_URL = "http://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/";
	public static final String RETAINER_URL = "http://crowdy.csail.mit.edu:4444/retainer/reservation/";
	public static final boolean TEST_TRIPS = false;

	public static final int[] TAG_TASK_IDS = { 11 };
	public static final int[] MOBI_TASK_IDS = { 12 };
	public static final String RETAINER_KEY = "dksaojdlm3894732nro89";
	

	public static final String[] REQUEST_TYPES = { "replace", "delayed", "stuck",
			"addMoreLike", "addNow", "cantGo", "custom" };
	public static final String[] REQUEST_TEXT = { "I'd like an activity changed",
			"I'm delayed", "I'm stuck", "I want more activites of this type",
			"I need something to do right now", "I can't do the next activity",
			"Custom Message" };
	public static final String[] MESSAGE_REQUESTS = {"custom"};
	public static final String[] RELATED_REQUESTS = {"custom", "replace", "addMoreLike"};
}
