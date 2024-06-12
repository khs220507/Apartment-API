package org.realestate.backend;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
public class MyController {

    @Autowired
    private MyService myService;


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/callApi")
    public String callApi() {
        String base_url = "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";
        String serviceKey = "axqbCgWHznH2tpVTBE8ZOvabiNvweh5E62C8oKOCWThcM9JguxembRtoaVUOXha0Kcm1E04PmR%2BNbsLpvdgeyQ%3D%3D";
        String lawd_cd = "11530";

        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);
        String deal_ymd = lastMonth.format(DateTimeFormatter.ofPattern("yyyyMM"));
        String jsonData = myService.callApi(base_url, serviceKey, lawd_cd, deal_ymd);
        return jsonData;
    }
}
