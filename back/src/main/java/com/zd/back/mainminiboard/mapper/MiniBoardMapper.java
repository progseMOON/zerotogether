package com.zd.back.mainminiboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.zd.back.mainminiboard.model.MiniBoard;

/**
 * MiniBoardMapper
 */

@Mapper
public interface MiniBoardMapper {

    List<MiniBoard> selectNotice();
    // List<MiniBoard> selectNews();

    
}