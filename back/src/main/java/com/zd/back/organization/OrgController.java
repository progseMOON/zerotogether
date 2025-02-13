package com.zd.back.organization;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/org")
public class OrgController {

    @Autowired
    private OrgService orgService;

    @PostMapping("/crawl")
    public ResponseEntity<String> crawlingOrg() {
        //TODO: process POST request

        orgService.crawling();
        
        return ResponseEntity.ok("갱신 완료");
    }

    @GetMapping("/list")
    public List<OrgData> getOrg() {
        return orgService.selectAll();
    }

    @GetMapping("/globalList")
    public List<GlobalOrgData> getGlobalOrg() {
        return orgService.selectGlobalOrg();
    }
    
    
    
    
}

