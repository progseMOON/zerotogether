package com.zd.back.mainminiboard.service;

import java.util.List;

import com.zd.back.mainminiboard.model.MiniBoard;

/**
 * MiniBoardService
 */
public interface MiniBoardService {

    public List<MiniBoard> getNotices() throws Exception;
    
}