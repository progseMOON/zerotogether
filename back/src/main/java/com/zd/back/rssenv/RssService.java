package com.zd.back.rssenv;

import java.util.List;

import com.zd.back.seoulcrawler.model.SeoulNews;

/**
 * RssService
 */
public interface RssService {

    void rssUpdate();
    void insertRssItem(RssItem item);
    List<RssItem> selectAll();
    List<RssItem> selectMini();
    int maxRssId();
    RssItem selectByRssId(int rssId) throws Exception;
    RssItem findPreviousNews(int rssId);
    RssItem findNextNews(int rssId);
}