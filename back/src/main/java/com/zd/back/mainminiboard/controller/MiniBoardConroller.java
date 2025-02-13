package com.zd.back.mainminiboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.zd.back.mainminiboard.model.MiniBoard;
import com.zd.back.mainminiboard.service.MiniBoardService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;



/**
 * MiniBoardConroller
 */

@RestController
@RequestMapping("/api/miniboard")
public class MiniBoardConroller {

    @Autowired
    private MiniBoardService miniBoardService;
   
    @GetMapping("/miniNotice")
    public List<MiniBoard> getMiniNotice() throws Exception{
        return miniBoardService.getNotices();
    }
    

    
}