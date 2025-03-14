package com.zd.back.naversearchapi;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class NaverNewsCrawl {

    public String imageCrawl(String url){

        try {

            Document doc = Jsoup.connect(url).get();
        
            // container 클래스를 가진 div에서 첫 번째 이미지 찾기
            Elements container = doc.select(".container img"); // .container 클래스를 가진 요소의 첫 번째 이미지
            if (!container.isEmpty()) {
                Element firstImage = container.first();
                String imageUrl = firstImage.absUrl("src");
                return imageUrl;
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
    
}
