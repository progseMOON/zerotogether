package com.zd.back.seoulcrawler.service;

import java.util.List;
import java.util.Map;

import com.zd.back.seoulcrawler.model.SeoulNews;

/**
 * CrollerService
 */
public interface CrawlerService {

    void insertSeoulNews(SeoulNews seoulNews);
    List<SeoulNews> selectSeoulNewsAll();
    List<SeoulNews> selectSeoulNewsMini();
    SeoulNews selectNewsByTitle(String title);
    void crawling(int totalPage, String group);
    void crawlingAll(int totalPage);
    List<SeoulNews> selectSeoulNewsEnv();
    List<SeoulNews> selectSeoulNewsEco();
    List<SeoulNews> selectSeoulNewsAir();
    List<SeoulNews> selectSeoulNewsGreen();
    int maxNum();
    Map<String,Object> selectBySeoulId(int seoulId);
    SeoulNews findPreviousNews(int seoulId);
    SeoulNews findNextNews(int seoulId);
}