package com.zd.back.imgboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.zd.back.imgboard.model.ImgBoard;
import com.zd.back.imgboard.model.ImgPost;

@Mapper
public interface ImgPostMapper {

    int maxImgPostId();

    void insertImgPost(ImgPost imgPost);

    int getDataCount();

    List<ImgBoard> getImgBoards(@Param("pageStart") int pageStart, @Param("pageEnd") int pageEnd);

    ImgBoard getImgPostById(int imgPostId);

    void deleteImgPostById(int imgPostId);

    void updateImgPost(ImgPost imgPost);

    /*  ##### 인증 승인 auth 부분 */
    void updateAuth (int imgPostId);
}
