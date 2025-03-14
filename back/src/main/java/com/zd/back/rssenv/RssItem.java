package com.zd.back.rssenv;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class RssItem {
    private String title;
    private String description;
    private String pubDate;
    private String author;
    private String link;
    private int rssId;

    private List<Map<String, String>> downloadLinks;
}