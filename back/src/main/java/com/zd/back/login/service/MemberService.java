package com.zd.back.login.service;

import com.zd.back.JY.domain.attendance.AttendanceService;
import com.zd.back.JY.domain.point.PointService;
import com.zd.back.exchange.service.ExchangeService;
import com.zd.back.login.mapper.MemberMapper;
import com.zd.back.login.model.Member;
import com.zd.back.login.model.Role;
import com.zd.back.login.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.zd.back.login.model.MemberDTO;

import java.util.stream.Collectors;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.redis.core.RedisTemplate; // RedisTemplate 임포트
import java.util.concurrent.TimeUnit; // TimeUnit 임포트

@Service
public class MemberService {

    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private PointService pointService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private BlacklistService blacklistService;

    @Autowired
    private ExchangeService exchangeService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisTemplate<String, String> redisTemplate; // RedisTemplate 주입

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public void registerMember(Member member) {
        try {
            String encryptedPassword = passwordEncoder.encode(member.getPwd());
            member.setPwd(encryptedPassword);

            // 관리자 계정 확인 및 역할 설정
            if ("suzi123".equals(member.getMemId())) {
                member.setRole(Role.ADMIN);
            } else {
                member.setRole(Role.USER); // 기본 역할을 USER로 설정
            }

            memberMapper.insertMember(member);

            try {
                pointService.insertData(member.getMemId());
            } catch (Exception e) {
                logger.error("포인트 데이터 삽입 중 오류 발생: {}", e.getMessage(), e);
                throw new RuntimeException("포인트 데이터 처리 중 오류가 발생했습니다.", e);
            }

            logger.info("회원가입 및 포인트 지급 완료: {}", member.getMemId());
        } catch (Exception e) {
            logger.error("회원가입 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("회원가입 처리 중 문제가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public boolean isIdDuplicate(String memId) {
        return memberMapper.countByMemId(memId) > 0;
    }

    @Transactional(readOnly = true)
    public boolean isEmailDuplicate(String email) {
        return memberMapper.countByEmail(email) > 0;
    }

    @Transactional(readOnly = true)
    public List<MemberDTO> getAllUsers() {
        try {
            List<Member> members = memberMapper.selectAllMembers();
            return members.stream().map(member -> {
                MemberDTO dto = new MemberDTO();
                dto.setMemId(member.getMemId());
                dto.setMemName(member.getMemName());
                dto.setEmail(member.getEmail());
                dto.setTel(member.getTel());
                dto.setRole(member.getRole().name());
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("사용자 목록 조회 중 오류 발생", e);
            throw new RuntimeException("사용자 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void updateMemberRole(String memId, Role role) {
        Member member = memberMapper.selectMemberById(memId);
        if (member != null) {
            member.setRole(role);
            memberMapper.updateMember(member);
        } else {
            throw new RuntimeException("회원을 찾을 수 없습니다.");
        }
    }

    @Transactional
    public Map<String, Object> validateLoginAndPerformActions(String memId, String rawPassword) {
        Map<String, Object> result = new HashMap<>();
        result.put("isValid", false);
        result.put("isFirstLoginToday", false);
        result.put("role", Role.GUEST.name());

        Member member = memberMapper.selectMemberById(memId);

        if (member == null || !passwordEncoder.matches(rawPassword, member.getPwd())) {
            return result;
        }

        result.put("isValid", true);
        result.put("role", member.getRole().name().toUpperCase());

        try {
            // 출석 체크
            if (attendanceService.checkToday(memId) == 0) {
                attendanceService.insertAtt(memId); // 출석 체크
                // 오늘 처음 로그인하는 경우에만 포인트 추가
                pointService.addAttendancePoint(memId);
                result.put("isFirstLoginToday", true);
                logger.info("첫 로그인 시 출석 체크 및 포인트 추가 완료: {}", memId);
            } else {
                logger.info("오늘 이미 출석한 회원: {}", memId);
            }
        } catch (Exception e) {
            logger.error("출석 체크 또는 포인트 추가 중 오류 발생", e);
        }

        return result;
    }

    public Member getMemberById(String memId) {
        return memberMapper.selectMemberById(memId);
    }

    @Transactional
    public void updateMember(Member member) {
        Member existingMember = memberMapper.selectMemberById(member.getMemId());
        if (existingMember != null) {
            if (member.getPwd() != null && !member.getPwd().isEmpty()) {
                String encryptedPassword = passwordEncoder.encode(member.getPwd());
                member.setPwd(encryptedPassword);
            } else {
                member.setPwd(existingMember.getPwd());
            }
            member.setRole(existingMember.getRole()); // 기존 역할 유지
            memberMapper.updateMember(member);
            logger.info("회원정보 수정 완료: {}", member.getMemId());
        }
    }

    @Transactional
    public void deleteMember(String memId) {
        try {
            //1.교환내역삭제
            exchangeService.deleteExchangesByMemberId(memId);
            // 1. 포인트 이력 삭제
            pointService.deletePointHistory(memId);

            // 2. 포인트 정보 삭제
            pointService.deletePoint(memId);

            // 3. 출석 정보 삭제
            attendanceService.deleteAttendance(memId);

            // 4. 회원 정보 삭제
            int deletedRows = memberMapper.deleteMember(memId);
            if (deletedRows == 0) {
                throw new RuntimeException("회원 정보를 찾을 수 없습니다: " + memId);
            }

            logger.info("회원 {} 삭제 완료", memId);
            } catch (Exception e) {
                logger.error("회원 삭제 중 오류 발생: {}", e.getMessage(), e);
                throw new RuntimeException("회원 삭제 중 오류가 발생했습니다: " + e.getMessage(), e);
            }
        }

    public String findIdByEmail(String email) {
        return memberMapper.findIdByEmail(email);
    }

    @Transactional
    public boolean resetPassword(String memId, String email) {
        Member member = memberMapper.selectMemberById(memId);

        if (member != null && member.getEmail().equals(email)) {
            String tempPassword = generateTempPassword();
            String encryptedPassword = passwordEncoder.encode(tempPassword);
            member.setPwd(encryptedPassword);
            memberMapper.updateMember(member);
            sendPasswordResetEmail(email, tempPassword);
            return true;
        }

        return false;
    }

    private String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private void sendPasswordResetEmail(String email, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("비밀번호 재설정");
        message.setText("임시 비밀번호: " + tempPassword);

        try {
            emailSender.send(message);
            logger.info("비밀번호 재설정 이메일 전송 성공: {}", email);
        } catch (MailException e) {
            logger.error("비밀번호 재설정 이메일 전송 실패: {}", email, e);
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }

    public boolean validateLogin(String memId, String rawPassword) {
        Member member = memberMapper.selectMemberById(memId);

        if (member == null) {
            logger.info("회원 정보를 찾을 수 없음: {}", memId);
            return false;
        }

        return passwordEncoder.matches(rawPassword, member.getPwd());
    }

    public List<Member> searchMembers(Map<String, Object> params) {
        return memberMapper.searchMembers(params);
    }

    public int countMembers(Map<String, Object> params) {
        return memberMapper.countMembers(params);
    }

   @Transactional
   public void logout(String token) {
       long expirationTime = jwtUtil.getExpirationDateFromToken(token).getTime();
       long ttl = expirationTime - System.currentTimeMillis();
       if (ttl > 0) {
           redisTemplate.opsForValue().set(token, "blacklisted", ttl, TimeUnit.MILLISECONDS);
       }
   }
}
