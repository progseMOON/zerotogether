package com.zd.back.JY.domain.attendance;

import java.util.List;
import java.util.Map;
import java.util.Date;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;

@Mapper
public interface AttendanceMapper {
    public int maxNum();
    @Transactional
    public void insertAtt(Map<String, Object> map);
    @Transactional
    public int checkToday(String memId);
    @Transactional
    public void regiAtt(AttendanceDTO dto);
    @Transactional
    List<AttendanceDTO> getMonthlyAttendance(@Param("memId") String memId, @Param("year") int year, @Param("month") int month);
    @Transactional
    List<Date> getAttendanceDates(@Param("memId") String memId);
    @Transactional
    List<Map<String, Object>> selectAttList(String memId);
    @Transactional
    int countMonthlyAttendance(String memId);
    @Transactional
    void deleteByMemId(String memId);
}
