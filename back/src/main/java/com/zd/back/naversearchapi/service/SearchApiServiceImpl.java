package com.zd.back.naversearchapi.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.text.StringEscapeUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.zd.back.naversearchapi.ReadNaverJSON;
import com.zd.back.naversearchapi.mapper.SearchApiMapper;
import com.zd.back.naversearchapi.model.News;

@Service
public class SearchApiServiceImpl implements SearchApiService{

    @Autowired
    private SearchApiMapper searchApiMapper;

    @Override
    public void insertNews(News news){

        String naverNewsPrefix = "https://n.news.naver.com";

        if (news.getLink().startsWith(naverNewsPrefix)) {

            // 중복 체크 후 삽입 로직
            if (searchApiMapper.selectNewsByTitle(news.getTitle()) == null) {

                int maxNum = searchApiMapper.maxNum();
                news.setNaverId(maxNum + 1);
                searchApiMapper.insertNews(news);
            }
        }

    }

    @Override
    public News findNewsByTitle(String title){
        return searchApiMapper.selectNewsByTitle(title);
    }

    @Override
    public List<News> getAllNews() {
        // DB에서 모든 뉴스 데이터를 가져오는 로직
        return searchApiMapper.selectAllNews();
    }

    @Override
    public List<News> searchNews(String keyword) {
        return searchApiMapper.searchNews(keyword);
    }

    @Override
    public List<News> miniNews(){
        return searchApiMapper.miniNews();
    }

    @Override
    public Map<Integer, Map<String, Object>> updateNaverNews() throws Exception {
        // 검색어 설정
        String mainKeyword = "환경 보호";

        // URL 인코딩
        String encodedQuery = mainKeyword;

        // API 요청 URL 설정
        String apiURL = "https://openapi.naver.com/v1/search/news?query=" + encodedQuery + "&display=100&sort=date";

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", "FuGhfkYnpnP903gHk_vs");
        headers.set("X-Naver-Client-Secret", "4hDDObuZ0E");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // API 호출 및 응답 처리
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(apiURL, HttpMethod.GET, entity, String.class);

        // JSON 응답 파싱
        JSONObject jsonResponse = (JSONObject) new JSONParser().parse(response.getBody());
        JSONArray naverNewsArray = (JSONArray) jsonResponse.get("items");


        // JSON 데이터 Map 형식 변환
        ReadNaverJSON readNaverJSON = new ReadNaverJSON();
        Map<Integer, Map<String, Object>> newsMap = readNaverJSON.unzipArray(naverNewsArray);

        // Map 데이터를 News 객체로 변환하여 DB에 저장
        for (Map<String, Object> newsData : newsMap.values()) {
            String cleanedTitle = cleanText((String)newsData.get("title"));
            String cleanedDescription = cleanText((String)newsData.get("description"));

            // pubDate는 java.sql.Date로 변환된 값이므로 바로 사용할 수 있음
            java.sql.Date pubDate = (java.sql.Date) newsData.get("pubDate");

            News news = new News();
            news.setTitle(cleanedTitle);
            news.setLink((String)newsData.get("link"));
            news.setDescription(cleanedDescription);
            news.setPubDate(pubDate);

            insertNews(news); // 뉴스 저장 로직 호출
        }

        return newsMap;
    }

    // HTML 태그 제거 및 엔티티 디코딩 메서드
    private String cleanText(String input) {
        String noHtml = input.replaceAll("<[^>]*>", "");
        return StringEscapeUtils.unescapeHtml4(noHtml);
    }
    
}
