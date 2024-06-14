package org.realestate.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MyController {

    @Autowired
    private MyService myService;


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/callApi")
    public List<String> callApi() {
        String base_url = "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";
        String serviceKey = "axqbCgWHznH2tpVTBE8ZOvabiNvweh5E62C8oKOCWThcM9JguxembRtoaVUOXha0Kcm1E04PmR%2BNbsLpvdgeyQ%3D%3D";
        String[] lawd_cd_list = { "11110", "11140", "11170", "11200", "11215", "11230", "11260", "11290",
                "11305", "11320", "11350", "11380", "11410", "11440", "11470", "11500",
                "11530", "11545", "11560", "11590", "11620", "11650", "11680", "11710", "11740"};

        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);





        List<String> results = new ArrayList<>();

        for (int i = 1; i <= 6; i++) {
            LocalDate date = now.minusMonths(i);
            String deal_ymd = date.format(DateTimeFormatter.ofPattern("yyyyMM"));

            for (String lawd_cd : lawd_cd_list) {
                String jsonData = myService.callApi(base_url, serviceKey, lawd_cd, deal_ymd);
                results.add(jsonData);
            }
        }
        return results;
    }
}
