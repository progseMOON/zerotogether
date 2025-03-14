package com.zd.back.JY.domain.point;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PointHistoryMapper {
    void insertPointHistory(PointHistoryDTO pointHistory);
    List<PointHistoryDTO> getPointHistoryByMemId(String memId);
    void deleteByMemId(String memId);
    List<PointHistoryDTO> getPointHistoryPaged(@Param("memId") String memId, @Param("offset") int offset, @Param("size") int size);

    long countPointHistory(@Param("memId") String memId);
}
