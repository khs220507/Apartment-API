package org.realestate.backend;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.json.JSONObject;
import org.json.XML;


@Service
public class MyService {


    @Autowired
    private MyRepository repository;

    @Autowired
    private RestTemplate restTemplate;

    String base_url = "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";
    String serviceKey = "axqbCgWHznH2tpVTBE8ZOvabiNvweh5E62C8oKOCWThcM9JguxembRtoaVUOXha0Kcm1E04PmR%2BNbsLpvdgeyQ%3D%3D";
    String lawd_cd = "11530";
    String deal_ymd = "202405";

    public static String callApi(String base_url, String serviceKey, String lawd_cd, String deal_ymd) {
        try {
            String encodedLAWD_CD = URLEncoder.encode(lawd_cd, "UTF-8");
            String encodedDEAL_YMD = URLEncoder.encode(deal_ymd, "UTF-8");

            String full_url = base_url + "?LAWD_CD=" + encodedLAWD_CD + "&DEAL_YMD=" + encodedDEAL_YMD + "&serviceKey=" + serviceKey;

            URL url = new URL(full_url);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-type", "application/json");

            BufferedReader reader;
            if (connection.getResponseCode() >= 200 && connection.getResponseCode() <= 300) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            } else {
                reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
            }
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }

            String xmlData = builder.toString(); // XML 데이터를 문자열로 가져오는 부분

            reader.close();
            connection.disconnect();

            // 웹요청을 통해 받은 XML 데이터를 JSONObject로 변환하는 부분
            JSONObject jsonObject = XML.toJSONObject(xmlData);
            System.out.println(jsonObject.toString(4));
            return jsonObject.toString(); // JSON 문자열 반환

        } catch (Exception e) {
            e.printStackTrace();
            return null; // 예외가 발생한 경우 null 반환
        }
    }
}

