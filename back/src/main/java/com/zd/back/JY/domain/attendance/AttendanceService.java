package com.zd.back.JY.domain.attendance;

import java.util.Date;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    @Autowired
    private AttendanceMapper mapper;


    @Transactional(readOnly = true)
    public int maxNum() {
        return mapper.maxNum();
    }

    @Transactional
    public void insertAtt(String memId) throws Exception {
        if (checkToday(memId) == 0) {
            try {
                Map<String, Object> map = new HashMap<>();
                map.put("memId", memId);
                mapper.insertAtt(map); // 출석 기록 추가
                } catch (Exception e) {
                    throw new Exception("출석 처리 중 오류 발생: " + e.getMessage(), e);
                }
            } else {
                logger.info("이미 오늘 출석한 회원: {}", memId);
        }
    }

    @Transactional(readOnly = true)
    public int checkToday(String memId) {
        return mapper.checkToday(memId);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> selectAttList(String memId) {
        return mapper.selectAttList(memId);
    }

    @Transactional(readOnly = true)
    public int countMonthlyAttendance(String memId) {
        return mapper.countMonthlyAttendance(memId);
    }

    @Transactional
    public void regiAtt(String memId) {
        try {
            AttendanceDTO dto = new AttendanceDTO();
            dto.setAttId(mapper.maxNum() + 1);
            dto.setMemId(memId);
            mapper.regiAtt(dto);
            logger.info("신규 회원 출석 등록 완료: {}", memId);
        } catch (Exception e) {
            logger.error("신규 회원 출석 등록 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("신규 회원 출석 등록 중 오류 발생", e);
        }
    }

    @Transactional(readOnly = true)
    public List<AttendanceDTO> getMonthlyAttendance(String memId, int year, int month) {
        try {
            return mapper.getMonthlyAttendance(memId, year, month);
        } catch (Exception e) {
            logger.error("월간 출석 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("월간 출석 조회 중 오류 발생", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Date> getAttendanceDates(String memId) {
        try {
            return mapper.getAttendanceDates(memId);
        } catch (Exception e) {
            logger.error("출석 날짜 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("출석 날짜 조회 중 오류 발생", e);
        }
    }

    @Transactional
    public void deleteAttendance(String memId) {
        mapper.deleteByMemId(memId);
    }
}
