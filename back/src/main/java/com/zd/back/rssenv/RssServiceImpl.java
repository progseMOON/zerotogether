package com.zd.back.rssenv;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.jsoup.Jsoup;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;

@Service
public class RssServiceImpl implements RssService{

    @Autowired
    private RssMapper rssMapper;

    @Override
    public void insertRssItem(RssItem item) {
        // TODO Auto-generated method stub
        rssMapper.insertRssItem(item);
    }

    @Override
    public List<RssItem> selectAll() {
        // TODO Auto-generated method stub
        return rssMapper.selectAll();
    }

    @Override
    public List<RssItem> selectMini() {
        // TODO Auto-generated method stub
        return rssMapper.selectMini();
    }

    @Override
    public int maxRssId() {
        // TODO Auto-generated method stub
        return rssMapper.maxRssId();
    }


    @Override
    public void rssUpdate() {
        
        try {

            String url = "https://www.me.go.kr/home/web/policy_data/rss.do?menuId=92";

            RestTemplate restTemplate = new RestTemplate();
            String xmlResponse = restTemplate.getForObject(url, String.class);

            // XML 파서 설정
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(xmlResponse.getBytes("UTF-8")));

            // <item> 태그 가져오기
            NodeList itemList = doc.getElementsByTagName("item");

            for(int i=0; i<itemList.getLength(); i++){
                Element item = (Element) itemList.item(i);

                RssItem rssItem = new RssItem();

                String title = item.getElementsByTagName("title").item(0).getTextContent();
                String link = "https://www.me.go.kr" + item.getElementsByTagName("link").item(0).getTextContent();
                String description = item.getElementsByTagName("description").item(0).getTextContent();
                String author = item.getElementsByTagName("author").item(0).getTextContent();
                String pubDate = item.getElementsByTagName("pubDate").item(0).getTextContent();

                int maxNum = rssMapper.maxRssId() + 1;
                rssItem.setRssId(maxNum);
                
                rssItem.setTitle(title);
                rssItem.setLink(link);
                rssItem.setAuthor(author);
                rssItem.setDescription(description);
                rssItem.setPubDate(pubDate);


                // 중복 확인
                if (rssMapper.selectByTitle(rssItem.getTitle()) == null) {
                    
                    insertRssItem(rssItem);
                } else {
                    System.out.println("중복된 데이터: " + rssItem.getTitle());
                } 
            }
 
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public RssItem selectByRssId(int rssId) throws Exception {
        
        RssItem articleData = rssMapper.selectByRssId(rssId);

        List<Map<String, String>> downloadLinks = extractDownloadLinks(articleData.getLink());

        articleData.setDownloadLinks(downloadLinks);

        return articleData;
    }

    @Override
    public RssItem findPreviousNews(int rssId) {
        // TODO Auto-generated method stub
        return rssMapper.selectPreviousNews(rssId);
    }

    @Override
    public RssItem findNextNews(int rssId) {
        // TODO Auto-generated method stub
        return rssMapper.selectNextNews(rssId);
    }

    // 특정 URL에서 다운로드 링크 추출하는 메서드
    public List<Map<String, String>> extractDownloadLinks(String url) throws Exception {
        List<Map<String, String>> downloadLinks = new ArrayList<>();

        // JSoup으로 페이지의 HTML을 가져옴
        org.jsoup.nodes.Document doc = Jsoup.connect(url).get();

        // "view_file" 클래스 안의 <a> 태그만 선택
        Elements fileLinks = doc.select(".view_file ul li a[href]");

        // 각 링크의 href 속성 값 가져오기
        for (org.jsoup.nodes.Element link : fileLinks) {
            // "바로보기" 링크를 무시 (title 속성이 "파일 새창으로 열기"인 것)
            if (!link.hasAttr("title")) {
                String fileUrl = link.attr("href");
                String downloadUrl = "https://www.me.go.kr" + fileUrl;


                 // 제목 추출
                String title = link.text();

                // 링크와 제목을 Map에 저장
                Map<String, String> linkData = new HashMap<>();
                linkData.put("url", downloadUrl);
                linkData.put("title", title);

                downloadLinks.add(linkData);
            }
        }

        return downloadLinks;
    }

    
}
