package com.zd.back.imgboard.service;

import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.back.imgboard.mapper.ImgPostMapper;
import com.zd.back.imgboard.model.ImgBoard;
import com.zd.back.imgboard.model.ImgPost;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImgPostService {

    private final ImgPostMapper imgPostMapper;

    public int maxImgPostId() throws Exception{
        return imgPostMapper.maxImgPostId();
    }

    public void createImgPost(ImgPost imgPost)throws Exception {
        imgPostMapper.insertImgPost(imgPost);
    }

    public int getDataCount() {
        return imgPostMapper.getDataCount();
    }

    @Transactional(readOnly = true)
    public List<ImgBoard> getImgBoards(int page, int size) {
        int pageStart = (page-1) * size; // 시작 인덱스
        int pageEnd = page*size;
        return imgPostMapper.getImgBoards(pageStart, pageEnd);
    }

    public ImgBoard getImgPostById(int imgPostId) {
        return imgPostMapper.getImgPostById(imgPostId); 
    }

    public void updateImgPost(ImgPost imgPost){
        imgPostMapper.updateImgPost(imgPost);
    }

    public void deleteImgPostById(int imgPostId) {
        imgPostMapper.deleteImgPostById(imgPostId);
    }

    /*  ##### 인증 승인 auth 부분 */
    public void updateAuth(int imgPostId) {
        imgPostMapper.updateAuth(imgPostId);
    }




}
