package com.zd.back.naversearchapi.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zd.back.naversearchapi.model.News;
import com.zd.back.naversearchapi.service.SearchApiService;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/naver")
public class NaverApiController {

    @Autowired
    private SearchApiService searchApiService;


    //뉴스 갱신
    @PostMapping("/news/update")
    public ResponseEntity<Map<Integer,Map<String,Object>>> getNaverNews() {
        try {

            // Service 계층에 API 호출 및 데이터 처리 위임
            Map<Integer, Map<String, Object>> newsMap = searchApiService.updateNaverNews();
            
            return ResponseEntity.ok(newsMap);

        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", "API 요청 실패: " + e.getMessage());
            Map<Integer, Map<String, Object>> responseMap = new HashMap<>();
            responseMap.put(-1, errorMap);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    @GetMapping("/news")  // DB에서 뉴스 가져오기
    public ResponseEntity<List<News>> getAllNews() {
        try {
            List<News> newsList = searchApiService.getAllNews(); // DB에서 뉴스 가져오기
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }

    // @Scheduled(fixedRate = 600000) // 10분마다 실행
    // public void scheduleNewsUpdate() {
    //     try {
    //         getNaverNews();
    //         System.out.println("뉴스 자동 갱신 완료: " + new Date());
    //     } catch (Exception e) {
    //         System.err.println("뉴스 자동 갱신 실패: " + e.getMessage());
    //     }
    // }

    @GetMapping("/news/search")
    public ResponseEntity<List<News>> searchNews(@RequestParam("keyword") String keyword) {
        List<News> searchResults = searchApiService.searchNews(keyword);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/news/miniNews")
    public ResponseEntity<List<News>> searchMiniNews() {
        List<News> miniNews = searchApiService.miniNews();
        return ResponseEntity.ok(miniNews);
    }



}
