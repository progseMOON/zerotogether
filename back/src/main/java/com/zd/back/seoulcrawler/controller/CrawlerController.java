package com.zd.back.seoulcrawler.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zd.back.seoulcrawler.model.SeoulNews;
import com.zd.back.seoulcrawler.service.CrawlerService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/seoul")
public class CrawlerController {

    @Autowired
    private CrawlerService crawlerService;

    @PostMapping("/seoulNews/update")
    public ResponseEntity<String> crawlSeoulNews(@RequestParam String group) {
        //TODO: process POST request

        int totalPage = 1;

        crawlerService.crawling(totalPage, group);
        
        return ResponseEntity.ok("갱신 완료");
    }

    @PostMapping("/seoulNews/updateAll")
    public ResponseEntity<String> crawlSeoulNewsAll() {
        //TODO: process POST request

        int totalPage = 10;

        crawlerService.crawlingAll(totalPage);
        
        return ResponseEntity.ok("갱신 완료");
    }

    @GetMapping("/seoulNews/all")
    public List<SeoulNews> getAllNews() {
        return crawlerService.selectSeoulNewsAll();
    }

    
    @GetMapping("/seoulNews/mini")
    public List<SeoulNews> getMiniNews() {
        return crawlerService.selectSeoulNewsMini();
    }

    @GetMapping("/seoulNews/env")
    public List<SeoulNews> getEnvNews() {
        return crawlerService.selectSeoulNewsEnv();
    }

    @GetMapping("/seoulNews/eco")
    public List<SeoulNews> getEcoNews() {
        return crawlerService.selectSeoulNewsEco();
    }

    @GetMapping("/seoulNews/air")
    public List<SeoulNews> getAirNews() {
        return crawlerService.selectSeoulNewsAir();
    }

    @GetMapping("/seoulNews/green")
    public List<SeoulNews> getGreenNews() {
        return crawlerService.selectSeoulNewsGreen();
    }

    @GetMapping("/seoulNews/article")
    public Map<String,Object> getBySeoulId(@RequestParam int seoulId) {
        return crawlerService.selectBySeoulId(seoulId);
    }

    @GetMapping("/seoulNews/previous")
    public ResponseEntity<SeoulNews> getPreviousNews(@RequestParam int seoulId) {
        SeoulNews previousNews = crawlerService.findPreviousNews(seoulId);
        return ResponseEntity.ok(previousNews);
    }

    @GetMapping("/seoulNews/next")
    public ResponseEntity<SeoulNews> getNextNews(@RequestParam int seoulId) {
        SeoulNews nextNews = crawlerService.findNextNews(seoulId);
        return ResponseEntity.ok(nextNews);
    }
    
    
    
    
}
