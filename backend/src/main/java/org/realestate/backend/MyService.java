package org.realestate.backend;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

            reader.close();
            connection.disconnect();

            return builder.toString();


        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }






}

