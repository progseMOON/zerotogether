package com.zd.back.rssenv;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

/**
 * RssMapper
 */
@Mapper
public interface RssMapper {

    void rssUpdate();
    void insertRssItem(RssItem rssItem);
    RssItem selectByTitle(String title);
    List<RssItem> selectAll();
    List<RssItem> selectMini();
    int maxRssId();
    RssItem selectByRssId(int rssId) throws Exception;
    RssItem selectPreviousNews(int rssId);
    RssItem selectNextNews(int rssId);
}