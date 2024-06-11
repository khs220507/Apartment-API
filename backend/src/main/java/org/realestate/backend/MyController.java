package org.realestate.backend;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MyController {

    @Autowired
    private MyService sevice;

    @RequestMapping("/callApi")
    public String callApi() {
        String base_url = "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";
        String serviceKey = "axqbCgWHznH2tpVTBE8ZOvabiNvweh5E62C8oKOCWThcM9JguxembRtoaVUOXha0Kcm1E04PmR%2BNbsLpvdgeyQ%3D%3D";
        String lawd_cd = "11530";
        String deal_ymd = "202405";

        return sevice.callApi(base_url, serviceKey, lawd_cd, deal_ymd);
    }

}
