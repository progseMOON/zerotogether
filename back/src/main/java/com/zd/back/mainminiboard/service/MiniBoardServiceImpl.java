package com.zd.back.mainminiboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zd.back.mainminiboard.mapper.MiniBoardMapper;
import com.zd.back.mainminiboard.model.MiniBoard;

/**
 * MiniBoardServiceImpl
 */
@Service
public class MiniBoardServiceImpl implements MiniBoardService{

    @Autowired
    private MiniBoardMapper miniBoardMapper;


    @Override
    public List<MiniBoard> getNotices() throws Exception {
        return miniBoardMapper.selectNotice();
    }

    
}