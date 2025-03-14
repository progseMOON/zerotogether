package com.zd.back.seoulsmartmap;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/smartMap")
public class SmartMapController {

    @Autowired
    private SmartMapService smartMapService;

    @PostMapping("/save")
    public void saveStore() {
        //TODO: process POST request

        smartMapService.saveStores();
        
    }
    
    @GetMapping("/load")
    public List<ThemaData> getStore() {
        return smartMapService.allStore();
    }
    

    
}
