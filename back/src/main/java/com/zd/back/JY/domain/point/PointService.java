package com.zd.back.JY.domain.point;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PointService {

    private static final Logger logger = LoggerFactory.getLogger(PointService.class);

    @Autowired
    private PointMapper pointMapper;

    @Autowired
    private PointHistoryMapper pointHistoryMapper;

    @Transactional(readOnly = true)
    public PointDTO findById(String memId) {
        return pointMapper.findById(memId);
    }

    @Transactional(readOnly = true)
    public int maxNum() {
        return pointMapper.maxNum();
    }

    @Transactional
    public void insertData(String memId) {
        try {
            PointDTO existingPoint = pointMapper.findById(memId);
            if (existingPoint != null) {
                logger.info("포인트 데이터가 이미 존재합니다: {}", memId);
                return;
            }
            PointDTO dto = new PointDTO();
            int maxNum = maxNum();
            dto.setPointId(maxNum + 1);
            dto.setMemId(memId);
            dto.setGrade("LEVEL1"); // 대문자로 수정
            dto.setMaxPoint(50);
            dto.setUsedPoint(50);
            pointMapper.insertData(dto);

            PointHistoryDTO historyDTO = new PointHistoryDTO();
            historyDTO.setMemId(memId);
            historyDTO.setPointChange(50);
            historyDTO.setChangeReason("회원가입 보너스");
            historyDTO.setChangeDate(LocalDateTime.now());
            pointHistoryMapper.insertPointHistory(historyDTO);

            logger.info("포인트 데이터 삽입 완료: {}", memId);
            } catch (Exception e) {
                logger.error("포인트 데이터 삽입 중 오류 발생: {}", e.getMessage(), e);
                throw new RuntimeException("포인트 데이터 처리 중 오류가 발생했습니다.", e);
            }
        }

    @Transactional
    public void updatePoint(String memId, Map<String, Object> operMap) {
        try {
            PointDTO dto = findById(memId);
            if (dto == null) {
                throw new IllegalArgumentException("회원의 포인트 정보를 찾을 수 없습니다: " + memId);
            }
            String oper = (String) operMap.get("oper");
            int updown = parseUpdown(operMap.get("updown"));
            String reason = (String) operMap.get("reason");

            if ("+".equals(oper)) {
                dto.setUsedPoint(dto.getUsedPoint() + updown);
                dto.setMaxPoint(dto.getMaxPoint() + updown);
            } else if ("-".equals(oper)) {
                if (dto.getUsedPoint() - updown < 0) {
                    throw new IllegalStateException("포인트가 부족합니다.");
                }
                dto.setUsedPoint(dto.getUsedPoint() - updown);
            } else {
                throw new IllegalArgumentException("잘못된 연산자입니다.");
            }

            if (dto.getUsedPoint() < 0 || dto.getMaxPoint() < 0) {
                throw new IllegalArgumentException("포인트는 음수가 될 수 없습니다.");
            }
            if (dto.getUsedPoint() > dto.getMaxPoint()) {
                throw new IllegalArgumentException("사용된 포인트가 최대포인트보다 많을 수 없습니다.");
            }

            pointMapper.updatePoint(dto);
            // 등급 업데이트를 위해 dto의 상태를 확인
            String newGrade = calculateGrade(dto.getMaxPoint());
            if (!dto.getGrade().equals(newGrade)) {
                dto.setGrade(newGrade);
                pointMapper.updatePoint(dto);
                logger.info("등급 업데이트: {} -> {}", memId, newGrade);
            }

            PointHistoryDTO historyDTO = new PointHistoryDTO();
            historyDTO.setMemId(memId);
            historyDTO.setPointChange("+".equals(oper) ? updown : -updown);
            historyDTO.setChangeReason(reason);
            historyDTO.setChangeDate(LocalDateTime.now());
            pointHistoryMapper.insertPointHistory(historyDTO);

            logger.info("포인트 업데이트 완료: {}, 변경: {}{}", memId, oper, updown);
        } catch (Exception e) {
            logger.error("포인트 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("포인트 업데이트 중 오류가 발생했습니다.", e);
        }
    }

    @Transactional(readOnly = true)
    public PointDTO findByMemId(String memId) {
        return pointMapper.findByMemId(memId);
    }

    @Transactional(readOnly = true)
    public List<PointHistoryDTO> getPointHistory(String memId) {
        return pointHistoryMapper.getPointHistoryByMemId(memId);
    }

    @Transactional
    public void updateGrade(String memId) {
        PointDTO dto = findByMemId(memId);
        String newGrade = calculateGrade(dto.getMaxPoint());

        if (!dto.getGrade().equals(newGrade)) {
            dto.setGrade(newGrade);
            pointMapper.updatePoint(dto);
            logger.info("등급 업데이트: {} -> {}", memId, newGrade);
        }
    }

    private String calculateGrade(int maxPoint) {
        if (maxPoint >= 600) return "LEVEL6";
        if (maxPoint >= 500) return "LEVEL5";
        if (maxPoint >= 400) return "LEVEL4";
        if (maxPoint >= 300) return "LEVEL3";
        if (maxPoint >= 200) return "LEVEL2";
        return "LEVEL1";
    }

    private int parseUpdown(Object updown) {
        if (updown instanceof Integer) {
            return (Integer) updown;
        } else if (updown instanceof String) {
            try {
                return Integer.parseInt((String) updown);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid updown value: " + updown, e);
            }
        } else {
            throw new IllegalArgumentException("Invalid updown value: " + updown);
        }
    }

    @Transactional
    public void usePoint(String memId, int point) {
        PointDTO dto = findByMemId(memId);
        if (dto.getUsedPoint() < point) {
            throw new IllegalStateException("사용 가능한 포인트가 부족합니다.");
        }
        dto.setUsedPoint(dto.getUsedPoint() - point);
        pointMapper.updatePoint(dto);
        logger.info("포인트 사용: {}, 사용 포인트: {}", memId, point);
    }

    @Transactional(readOnly = true)
    public int getAvailablePoint(String memId) {
        PointDTO dto = findByMemId(memId);
        return dto.getUsedPoint();
    }

    @Transactional
    public void addAttendancePoint(String memId) {
        PointDTO dto = findByMemId(memId);
        if (dto == null) {
            // 포인트 데이터가 없는 경우 새로 생성
            dto = new PointDTO();
            dto.setPointId(maxNum() + 1);
            dto.setMemId(memId);
            dto.setGrade("LEVEL1");
            dto.setMaxPoint(1); // 초기 포인트 설정
            dto.setUsedPoint(1); // 초기 포인트 설정
            pointMapper.insertData(dto);
            } else {
                // 기존 포인트 데이터가 있는 경우 업데이트
                dto.setUsedPoint(dto.getUsedPoint() + 1);
                dto.setMaxPoint(dto.getMaxPoint() + 1);
                pointMapper.updatePoint(dto);
            }
        updateGrade(memId);

        // 포인트 히스토리 추가
        PointHistoryDTO historyDTO = new PointHistoryDTO();
        historyDTO.setMemId(memId);
        historyDTO.setPointChange(1); // 출석체크로 인한 1점 추가
        historyDTO.setChangeReason("출석 보너스");
        historyDTO.setChangeDate(LocalDateTime.now());
        pointHistoryMapper.insertPointHistory(historyDTO);
    }

    @Transactional
    public void managePoints(String memId, int points, String operation) {
        PointDTO pointDTO = pointMapper.findByMemId(memId);
        if (pointDTO == null) {
            throw new RuntimeException("회원의 포인트 정보를 찾을 수 없습니다.");
        }

        int currentUsedPoint = pointDTO.getUsedPoint();
        int currentMaxPoint = pointDTO.getMaxPoint();
        int newUsedPoint;
        int newMaxPoint;

        if ("add".equals(operation)) {
            newUsedPoint = currentUsedPoint + points;
            newMaxPoint = currentMaxPoint + points;
        } else if ("subtract".equals(operation)) {
            newUsedPoint = currentUsedPoint - points;
            newMaxPoint = currentMaxPoint - points;
            if (newUsedPoint < 0 || newMaxPoint < 0) {
                throw new RuntimeException("포인트가 부족합니다.");
            }
        } else {
            throw new RuntimeException("잘못된 연산입니다.");
        }

        pointDTO.setUsedPoint(newUsedPoint);
        pointDTO.setMaxPoint(newMaxPoint);
        pointMapper.updatePoint(pointDTO);

        // 포인트 이력 추가
        PointHistoryDTO historyDTO = new PointHistoryDTO();
        historyDTO.setMemId(memId);
        historyDTO.setPointChange("add".equals(operation) ? points : -points);
        historyDTO.setChangeReason("관리자에 의한 포인트 조정");
        historyDTO.setChangeDate(LocalDateTime.now());
        pointHistoryMapper.insertPointHistory(historyDTO);

        logger.info("포인트 관리 완료: {}, 변경된 사용 포인트: {}, 변경된 최대 포인트: {}", memId, newUsedPoint, newMaxPoint);
    }

    @Transactional
    public void deletePointHistory(String memId) {
        pointHistoryMapper.deleteByMemId(memId);
    }

    @Transactional
    public void deletePoint(String memId) {
        pointMapper.deleteByMemId(memId);
    }

    public List<PointHistoryDTO> getPointHistoryPaged(String memId, int page, int size) {
        int offset = (page - 1) * size;
        return pointHistoryMapper.getPointHistoryPaged(memId, offset, size);
    }

    public long countPointHistory(String memId) {
        return pointHistoryMapper.countPointHistory(memId);
    }
}
