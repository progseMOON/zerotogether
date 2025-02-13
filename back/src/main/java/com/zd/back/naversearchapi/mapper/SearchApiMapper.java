package com.zd.back.naversearchapi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.zd.back.naversearchapi.model.News;

/**
 * SearchApiMapper
 */
@Mapper
public interface SearchApiMapper {
    void insertNews(News news);
    News selectNewsByTitle(String title);
    List<News> selectAllNews();    // DB에서 모든 뉴스 데이터를 가져오기
    List<News> searchNews(@Param("keyword") String keyword);
    List<News> miniNews();
    int maxNum();
}