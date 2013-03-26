package com.csail.uid.util;

import java.io.IOException;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import android.net.Uri;
import android.os.AsyncTask;

public class GetHelper {

	AsyncTask<Map<String, String>, Void, String> task;
	Map<String, String> params;
	
	public interface GetCallback {
		public void onGetExecute(String JSON);
	}
	
	public GetHelper(String URL, Map<String, String> params, final GetCallback callback) {
		this.params = params;
		this.params.put("URL", URL);
		
		task = new AsyncTask<Map<String, String>, Void, String>() {
			@Override
			protected String doInBackground(Map<String, String>... pars) {
				Map<String,String> postParams = pars[0];
				HttpClient httpclient = new DefaultHttpClient();
			    try {
			    	String url = postParams.get("URL") + "?";
				    postParams.remove("URL");
				    
			        for (String key : postParams.keySet()) {
			        	url = url + key + "=" + Uri.encode(postParams.get(key)) + "&";
			        }
			        
			        HttpGet httpget = new HttpGet(url);
			        HttpResponse response = httpclient.execute(httpget);
	                HttpEntity entity = response.getEntity();
	                String responseText = EntityUtils.toString(entity);
	                
			        return responseText;
			        
			    } catch (ClientProtocolException e) {
			        e.printStackTrace();
			    } catch (IOException e) {
			        e.printStackTrace();
			    }
			    
			    return null;
			}
			
			@Override 
			protected void onPostExecute(String result) {
				callback.onGetExecute(result);
			}
		};
	}
	
	@SuppressWarnings("unchecked")
	public void execute() {
		task.execute(params);
	}
}
