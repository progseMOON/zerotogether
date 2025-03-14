package com.zd.back.seoulcrawler.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zd.back.seoulcrawler.crawler.CrawlerAir;
import com.zd.back.seoulcrawler.crawler.CrawlerEco;
import com.zd.back.seoulcrawler.crawler.CrawlerEnv;
import com.zd.back.seoulcrawler.crawler.CrawlerGreen;
import com.zd.back.seoulcrawler.mapper.CrawlerMapper;
import com.zd.back.seoulcrawler.model.SeoulNews;

@Service
public class CrawlerServiceImpl implements CrawlerService{

    @Autowired
    private CrawlerMapper crawlerMapper;

    @Override
    public void insertSeoulNews(SeoulNews seoulNews) {
        // TODO Auto-generated method stub

        // 중복 체크 후 삽입 로직
        if (crawlerMapper.selectNewsByTitle(seoulNews.getTitle()) == null) {
            crawlerMapper.insertSeoulNews(seoulNews);
        }
        
    }

    @Override
    public List<SeoulNews> selectSeoulNewsAll() {
        // TODO Auto-generated method stub
        return crawlerMapper.selectSeoulNewsAll();
    }

    @Override
    public List<SeoulNews> selectSeoulNewsMini() {
        // TODO Auto-generated method stub
        return crawlerMapper.selectSeoulNewsMini();
    }

    @Override
    public SeoulNews selectNewsByTitle(String title) {
        // TODO Auto-generated method stub
        return crawlerMapper.selectNewsByTitle(title);
    }

    @Override
    public void crawling(int totalPage, String group) {

        if ("env".equals(group)) {
            CrawlerEnv crawler = new CrawlerEnv();

            List<SeoulNews> seoulNewsList = crawler.SeoulNewsCrawl(totalPage);

            for(SeoulNews seoulNews : seoulNewsList){

                int seoulId = maxNum() + 1;

                seoulNews.setSeoulId(seoulId);

                insertSeoulNews(seoulNews);
            }
        } else if ("air".equals(group)) {
            CrawlerAir crawler = new CrawlerAir();

            List<SeoulNews> seoulNewsList = crawler.SeoulNewsCrawl(totalPage);

            for(SeoulNews seoulNews : seoulNewsList){

                int seoulId = maxNum() + 1;

                seoulNews.setSeoulId(seoulId);

                insertSeoulNews(seoulNews);
            }
        } else if ("eco".equals(group)) {
            CrawlerEco crawler = new CrawlerEco();

            List<SeoulNews> seoulNewsList = crawler.SeoulNewsCrawl(totalPage);

            for(SeoulNews seoulNews : seoulNewsList){

                int seoulId = maxNum() + 1;

                seoulNews.setSeoulId(seoulId);

                insertSeoulNews(seoulNews);
            }
        } else if ("green".equals(group)) {
            CrawlerGreen crawler = new CrawlerGreen();

            List<SeoulNews> seoulNewsList = crawler.SeoulNewsCrawl(totalPage);

            for(SeoulNews seoulNews : seoulNewsList){

                int seoulId = maxNum() + 1;

                seoulNews.setSeoulId(seoulId);

                insertSeoulNews(seoulNews);
            }
        }
    }

    @Override
    public void crawlingAll(int totalPage) {
        
        List<SeoulNews> seoulNewsList = new ArrayList<>();

        // 각 그룹별 크롤러를 실행하고 결과를 리스트에 추가
        CrawlerEnv crawlerEnv = new CrawlerEnv();
        seoulNewsList.addAll(crawlerEnv.SeoulNewsCrawl(totalPage));

        CrawlerAir crawlerAir = new CrawlerAir();
        seoulNewsList.addAll(crawlerAir.SeoulNewsCrawl(totalPage));

        CrawlerEco crawlerEco = new CrawlerEco();
        seoulNewsList.addAll(crawlerEco.SeoulNewsCrawl(totalPage));

        CrawlerGreen crawlerGreen = new CrawlerGreen();
        seoulNewsList.addAll(crawlerGreen.SeoulNewsCrawl(totalPage));

        // publishedDate를 기준으로 정렬하고, 동일 날짜일 경우 seoulId로 정렬
        seoulNewsList.sort(Comparator.comparing(SeoulNews::getPublishedDate)
        .thenComparing(SeoulNews::getSeoulId));

        // 각 뉴스 항목을 DB에 삽입
        for (SeoulNews seoulNews : seoulNewsList) {
            int seoulId = maxNum() + 1; // 새로운 ID 할당
            seoulNews.setSeoulId(seoulId);

            insertSeoulNews(seoulNews);
        }
        
        
    }

    @Override
    public List<SeoulNews> selectSeoulNewsEnv() {
        // TODO Auto-generated method stub
        return crawlerMapper.selectSeoulNewsEnv();
    }

    @Override
    public List<SeoulNews> selectSeoulNewsEco() {
        // TODO Auto-generated method stub
        return crawlerMapper.selectSeoulNewsEco();
    }

    @Override
    public List<SeoulNews> selectSeoulNewsAir() {
        // TODO Auto-generated method stub
        return crawlerMapper.selectSeoulNewsAir();
    }

    @Override
    public List<SeoulNews> selectSeoulNewsGreen() {
        // TODO Auto-generated method stub
        return crawlerMapper.selectSeoulNewsGreen();
    }

    @Override
    public SeoulNews findPreviousNews(int seoulId) {
        // TODO Auto-generated method stub
        return crawlerMapper.selectPreviousNews(seoulId);
    }

    @Override
    public SeoulNews findNextNews(int seoulId) {
        // TODO Auto-generated method stub
        return crawlerMapper.selectNextNews(seoulId);
    }

    @Override
    public int maxNum() {
        // TODO Auto-generated method stub
        return crawlerMapper.maxNum();
    }

    @Override
    public Map<String, Object> selectBySeoulId(int seoulId) {
        // TODO Auto-generated method stub

        Map<String, Object> resultMap = new HashMap<>();

        SeoulNews seoulNews = crawlerMapper.selectBySeoulId(seoulId);

        String contentHtml = webScraper(seoulNews.getLink());

        resultMap.put("seoulNews", seoulNews);
        resultMap.put("contentHtml", contentHtml);

        return resultMap;
    }

    public String webScraper(String url) {

        String contentHtml = "";

        try {
            Document doc = Jsoup.connect(url).get();

            // 특정 <div> 요소 선택 (id가 "post_content"인 div)
            Element postContentDiv = doc.getElementById("post_content");
            
            if (postContentDiv != null) {
                // sns_elem div를 찾습니다.
                Element snsElemDiv = postContentDiv.getElementById("sns_elem");

                // sns_elem div가 존재하는 경우
                if (snsElemDiv != null) {
                    // sns_elem 이전의 HTML만 가져옵니다.
                    // sns_elem의 부모 요소에서 sns_elem 이전까지의 요소를 복사합니다.
                    StringBuilder trimmedHtml = new StringBuilder();
                    for (Node node : postContentDiv.childNodes()) {
                        if (node == snsElemDiv) {
                            break; // sns_elem에 도달하면 루프 종료
                        }
                        trimmedHtml.append(node.outerHtml()); // 각 노드의 HTML 추가
                    }

                    contentHtml = trimmedHtml.toString();
                } else {
                    // sns_elem이 없으면 전체 postContentDiv의 HTML을 사용합니다.
                    contentHtml = postContentDiv.outerHtml();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return contentHtml;
    }
    
}
