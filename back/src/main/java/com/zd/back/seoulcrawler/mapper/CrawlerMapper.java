package com.zd.back.seoulcrawler.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.zd.back.seoulcrawler.model.SeoulNews;

/**
 * CrollerMapper
 */
@Mapper
public interface CrawlerMapper {

    void insertSeoulNews(SeoulNews seoulNews);
    List<SeoulNews> selectSeoulNewsAll();
    List<SeoulNews> selectSeoulNewsMini();
    SeoulNews selectNewsByTitle(String title);
    void crawling(int totalPage);
    List<SeoulNews> selectSeoulNewsEnv();
    List<SeoulNews> selectSeoulNewsEco();
    List<SeoulNews> selectSeoulNewsAir();
    List<SeoulNews> selectSeoulNewsGreen();
    int maxNum();
    SeoulNews selectBySeoulId(int seoulId);
    SeoulNews selectPreviousNews(int seoulId);
    SeoulNews selectNextNews(int seoulId);
}