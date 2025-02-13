package com.zd.back.rssenv;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.zd.back.seoulcrawler.model.SeoulNews;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("api/rss")
public class RssController {

    @Autowired
    private RssService rssService;

    @PostMapping("/env")
    public void updateRssEnv() {
        //TODO: process POST request
        
        rssService.rssUpdate();
    }

    @GetMapping("/env/list")
    public List<RssItem> getRssEnv() {

        return rssService.selectAll();
    }

    @GetMapping("/env/mini")
    public List<RssItem> getRssMini() {
        return rssService.selectMini();
    }

    @GetMapping("/env/article")
    public RssItem getByRssId(@RequestParam int rssId) throws Exception{

        return rssService.selectByRssId(rssId);
    }

    @GetMapping("/env/previous")
    public ResponseEntity<RssItem> getPreviousNews(@RequestParam int rssId) {
        RssItem previousNews = rssService.findPreviousNews(rssId);
        return ResponseEntity.ok(previousNews);
    }

    @GetMapping("/env/next")
    public ResponseEntity<RssItem> getNextNews(@RequestParam int rssId) {
        RssItem nextNews = rssService.findNextNews(rssId);
        return ResponseEntity.ok(nextNews);
    }

}
