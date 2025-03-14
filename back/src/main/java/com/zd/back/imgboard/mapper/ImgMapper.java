package com.zd.back.imgboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.zd.back.imgboard.model.Img;

@Mapper
public interface ImgMapper {
    
    int maxImgId();
    void saveImg(Img img);
    List<Img> getImagesByPostId(int imgPostId);   
    void deleteImagesByPostId(int imgPostId);
    void deleteBySaveFileName( String saveFileName);

}
