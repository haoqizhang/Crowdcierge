package com.csail.uid.data;

public class Trip {
	private String tid;
	private String title;
	
	public Trip(String tid) {
		this.tid = tid;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getTid() {
		return tid;
	}
}
