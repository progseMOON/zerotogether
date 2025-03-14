package com.zd.back.JY.domain.point;


import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PointMapper {
    public int maxNum();
    public void insertData(PointDTO dto);
    public void updatePoint(PointDTO dto);
    public PointDTO findById(String memId);
    public PointDTO findByMemId(String memId);
    public void upPoint(PointDTO dto);
    public void updateGrade(PointDTO dto);
    public void deleteByMemId(String memId);

}
