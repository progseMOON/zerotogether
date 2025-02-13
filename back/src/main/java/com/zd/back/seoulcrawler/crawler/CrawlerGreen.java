package com.zd.back.seoulcrawler.crawler;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.zd.back.seoulcrawler.model.SeoulNews;

/**
 * Crawler
 */

//크롤러 로직을 따로 분리했습니다. 크롤링이 필요하신 분들은 가져가서 고쳐 쓰세요.

public class CrawlerGreen {

    public List<SeoulNews> SeoulNewsCrawl(int totalPage) { 
        //받아올 데이터에 맞춰 DTO를 만드시고, 그 DTO로 반환값을 바꿔주시면 됩니다.

        List<SeoulNews> seoulNewsList = new ArrayList<>();      //마찬가지로 반환값만 바꿔주세요.

        try {

            for(int i=1; i<totalPage; i++){ //페이징 수가 여럿일 때 수행하기 위한 반복문입니다.

                String url = "https://news.seoul.go.kr/env/archives/category/green-energy-news_c1/green-energy-news-n1/page/" + i;
                //크롤링해올 url

                Document doc = Jsoup.connect(url).get();
                //import 주의. JSOUP 꺼입니다.

                //이후로 진행되는 건 직접 F12 눌러가지고 HTML 확인해서 작업을 진행해야합니다. 매우 귀찮아요.

                /*
                    예시

                    <div class="child_PolicyDL_R">
                        <h3 class="tit"><a href="link1">제목 1</a></h3>
                        <span class="time">작성일 : 2024-10-17 <span class="part">저자</span></span>
                        <div class="topicCont">내용 1</div>
                    </div>
                    <div class="child_PolicyDL_R">
                        <h3 class="tit"><a href="link2">제목 2</a></h3>
                        <span class="time">작성일 : 2024-10-16 <span class="part">저자</span></span>
                        <div class="topicCont">내용 2</div>
                    </div>

                    이런 구조일 때,

                    Elements articles = doc.select("div.child_PolicyDL_R");

                    for (Element article : articles) {
                        String title = article.select("h3.tit a").text(); // 제목 추출
                        String link = article.select("h3.tit a").attr("href"); // 링크 추출
                        String publishedDate = article.select(".time").text(); // 작성일 추출
                        String content = article.select(".topicCont").text(); // 내용 추출

                        
                    }

                    이렇게 해 주시면 됩니다.

                    기본적인 구조는 이렇지만, 각 사이트마다 html 형식이 달라서 매번 수정해줘야하니, gpt를 애용하도록 합시다.
                 
                 */
                Elements articles = doc.select("div.child_PolicyDL_R");

                for(int j = 0; j < articles.size(); j++) {

                    Element article = articles.get(j); // articles 리스트에서 현재 인덱스의 요소를 가져옵니다.


                    String title = article.select("h3.tit a").text(); // 제목 추출
                    String link = article.select("h3.tit a").attr("href"); // 링크 추출

                    String publishedDateString = article.select(".time").first().ownText(); // "등록일 : 2024-10-07"
                    String dateString = publishedDateString.replace("등록일 : ", ""); // "2024-10-18"
                    LocalDate publishedDate = LocalDate.parse(dateString); // 변환

                    // content 추출: topicCont_1이나 topicCont 중 하나를 시도
                    String content = article.select(".topicCont_1").text();
                    if (content.isEmpty()) { // topicCont_1이 비어있으면 topicCont로 시도
                        content = article.select(".topicCont").text();
                    }

                    String seoulNewsGroup = "green";
                    //서울시 소식은 기후환경, 친환경, 대기, 녹색에너지 등으로 그룹이 나눠져 있어서 그룹을 지정했습니다.

                    int seoulId = j;

                    SeoulNews seoulNews = new SeoulNews(seoulId,title,link,content,publishedDate,seoulNewsGroup);

                    seoulNewsList.add(seoulNews);

                }


            }
            
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace(); // 예외 메시지 출력
        }

        return seoulNewsList;
    }

    
}