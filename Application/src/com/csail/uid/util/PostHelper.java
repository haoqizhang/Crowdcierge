package com.csail.uid.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import android.os.AsyncTask;

import com.csail.uid.util.GetHelper.HttpCallback;

public class PostHelper {
	AsyncTask<Map<String, String>, Void, String> task;
	Map<String, String> params;

	public PostHelper(String URL, Map<String, String> params,
			final HttpCallback callback) {
		this.params = params;
		this.params.put("URL", URL);

		task = new AsyncTask<Map<String, String>, Void, String>() {
			@Override
			protected String doInBackground(Map<String, String>... pars) {
				Map<String, String> postParams = pars[0];
				HttpClient httpclient = new DefaultHttpClient();
				try {
					String url = postParams.get("URL") + "?";
					postParams.remove("URL");

					HttpPost httpPost = new HttpPost(url);
					List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(
							5);
					for (String key : postParams.keySet()) {
						nameValuePairs.add(new BasicNameValuePair(key,
								postParams.get(key)));
					}
					// Encode and set entity
					httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs,
							HTTP.UTF_8));
					HttpResponse response = httpclient.execute(httpPost);
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
				callback.onHttpExecute(result);
			}
		};
	}

	@SuppressWarnings("unchecked")
	public void execute() {
		task.execute(params);
	}
}
