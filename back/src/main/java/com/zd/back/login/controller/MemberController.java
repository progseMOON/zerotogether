package com.zd.back.login.controller;

import com.zd.back.JY.domain.point.PointService;
import com.zd.back.login.model.Member;
import com.zd.back.login.model.Role;
import com.zd.back.login.service.LogoutService;
import com.zd.back.login.service.MemberService;
import com.zd.back.login.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.zd.back.login.model.MemberDTO;
import org.springframework.security.access.prepost.PreAuthorize;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/member")
public class MemberController {
    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    @Autowired
    private MemberService memberService;

    @Autowired
    private PointService pointService;

    @Autowired
    private LogoutService logoutService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@Valid @RequestBody Member member, BindingResult bindingResult) {

        // 아이디 중복 확인
        if (memberService.isIdDuplicate(member.getMemId())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "이미 사용 중인 아이디입니다.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // 이메일 중복 확인
        if (memberService.isEmailDuplicate(member.getEmail())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "이미 사용 중인 이메일 주소입니다.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getAllErrors().stream()
            .map(error -> error.getDefaultMessage())
            .collect(Collectors.joining(", "));

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", errors);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            memberService.registerMember(member);
            Map<String, String> response = new HashMap<>();
            response.put("message", "회원가입이 완료되었습니다.");
            return ResponseEntity.ok(response);
            } catch (Exception e) {
                logger.error("회원가입 중 오류 발생", e);
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "회원가입 처리 중 오류가 발생했습니다: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        }

    @GetMapping("/terms")
    public ResponseEntity<String> getTerms() {
        try {
            ClassPathResource resource = new ClassPathResource("terms.txt");
            byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return ResponseEntity.ok(new String(bytes, StandardCharsets.UTF_8));
        } catch (IOException e) {
            logger.error("이용약관 파일 읽기 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이용약관을 불러올 수 없습니다.");
        }
    }

    @GetMapping("/privacy")
    public ResponseEntity<String> getPrivacyAgreement() {
        try {
            ClassPathResource resource = new ClassPathResource("agreement.txt");
            byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return ResponseEntity.ok(new String(bytes, StandardCharsets.UTF_8));
        } catch (IOException e) {
            logger.error("개인정보 동의서 파일 읽기 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("개인정보 동의서를 불러올 수 없습니다.");
        }
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestParam String memId, @RequestParam String pwd) {
    try {
        
        Map<String, Object> result = memberService.validateLoginAndPerformActions(memId, pwd);
        boolean isValid = (boolean) result.get("isValid");
        // 에러 확인용 
        logger.info("로그인 시도 - ID: {}", memId);
        logger.info("로그인 시도 - PWD: {}", pwd);

        if (isValid) {
            String token = jwtUtil.generateToken(memId, (String) result.get("role"));
            String refreshToken = jwtUtil.generateRefreshToken(memId);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("role", (String) result.get("role"));

            if ((boolean) result.get("isFirstLoginToday")) {
                response.put("upPoint", "1");
            }

            return ResponseEntity.ok(response);
        } else {
            String errorReason = (String) result.get("errorReason");
            Map<String, String> failureResponse = new HashMap<>();

            switch (errorReason) {
                case "INVALID_CREDENTIALS":
                    failureResponse.put("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
                    break;
                case "ACCOUNT_LOCKED":
                    failureResponse.put("error", "계정이 잠겼습니다. 관리자에게 문의하세요.");
                    break;
                case "ACCOUNT_DISABLED":
                    failureResponse.put("error", "비활성화된 계정입니다. 관리자에게 문의하세요.");
                    break;
                case "ACCOUNT_EXPIRED":
                    failureResponse.put("error", "계정이 만료되었습니다. 관리자에게 문의하세요.");
                    break;
                default:
                    failureResponse.put("error", "로그인에 실패했습니다. 다시 시도해주세요.");
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(failureResponse);
        }
    } catch (Exception e) {
        logger.error("로그인 중 오류 발생", e);
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

    // 관리자 전용: 모든 사용자 목록 조회
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<MemberDTO> users = memberService.getAllUsers();
            return ResponseEntity.ok(users);
            } catch (Exception e) {
                logger.error("사용자 목록 조회 중 오류 발생", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사용자 목록 조회 중 오류가 발생했습니다.");
            }
    }

    @GetMapping("/admin/search")
    public ResponseEntity<?> searchMembers(
            @RequestParam String searchTerm,
            @RequestParam int page,
            @RequestParam int limit) {

        // 검색 조건 및 페이징 정보를 담은 파라미터 맵 생성
        Map<String, Object> params = new HashMap<>();
        params.put("searchTerm", searchTerm);
        params.put("page", page);
        params.put("limit", limit);

        // 회원 목록과 총 회원 수 조회
        List<Member> members = memberService.searchMembers(params);
        int totalCount = memberService.countMembers(params);

        // 결과를 담은 응답 맵 생성
        Map<String, Object> response = new HashMap<>();
        response.put("members", members);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }

    // 관리자 전용 API: 사용자 역할 변경
    @PostMapping("/admin/change-role")
    public ResponseEntity<?> changeUserRole(@RequestParam String memId, @RequestParam Role role) {
        try {
            memberService.updateMemberRole(memId, role);
            return ResponseEntity.ok("사용자 역할이 성공적으로 변경되었습니다.");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("역할 변경 중 오류 발생: " + e.getMessage());
            }
    }

    // 관리자 전용: 회원 삭제
    @DeleteMapping("/admin/{memId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUserByAdmin(@PathVariable String memId) {
        try {
            memberService.deleteMember(memId);
            return ResponseEntity.ok("회원이 성공적으로 삭제되었습니다.");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("회원 삭제 중 오류 발생: " + e.getMessage());
            }
    }

    @PostMapping("/admin/manage-points")
    public ResponseEntity<?> managePoints(@RequestParam String memId, @RequestParam int points, @RequestParam String operation) {
        try {
            pointService.managePoints(memId, points, operation);
            return ResponseEntity.ok("포인트가 성공적으로 조정되었습니다.");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("포인트 조정 중 오류 발생: " + e.getMessage());
            }
        }

        @PostMapping("/refresh-token")
        public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> refreshTokenRequest) {
            String refreshToken = refreshTokenRequest.get("refreshToken");
            if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
                String memId = jwtUtil.extractMemId(refreshToken);
                Member member = memberService.getMemberById(memId);
                if (member != null) {
                    String role = member.getRole().name();
                    String newToken = jwtUtil.generateToken(memId, role);
                    String newRefreshToken = jwtUtil.generateRefreshToken(memId);
                    Map<String, String> response = new HashMap<>();
                    response.put("token", newToken);
                    response.put("refreshToken", newRefreshToken);
                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }


    @GetMapping("/info")
    public ResponseEntity<Member> getMemberInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }
            String memId = jwtUtil.extractMemId(token);
            Member member = memberService.getMemberById(memId);
            if (member != null) {
                member.setPwd(null);
                return ResponseEntity.ok(member);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error in getMemberInfo", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/update/{memId}")
    public ResponseEntity<?> updateMember(@PathVariable String memId, @Valid @RequestBody Member member, BindingResult bindingResult, @RequestHeader("Authorization") String authHeader) {
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getAllErrors().stream()
              .map(error -> error.getDefaultMessage())
              .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(errors);
        }
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("인증이 필요합니다.");
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
        String loggedInMemId = jwtUtil.extractMemId(token);
        if (loggedInMemId == null || !loggedInMemId.equals(memId)) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }

        Member existingMember = memberService.getMemberById(memId);
        if (existingMember == null) {
            return ResponseEntity.notFound().build();
        }

        if (member.getPwd() == null || member.getPwd().isEmpty()) {
            member.setPwd(null);
        }

        memberService.updateMember(member);
        return ResponseEntity.ok("회원정보 수정 성공");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);
            logoutService.logout(null, null, null);
            return ResponseEntity.ok().body("{\"message\": \"로그아웃 성공\", \"redirectUrl\": \"/mainpage\"}");
        }
        return ResponseEntity.badRequest().body("유효하지 않은 토큰");
    }


    @DeleteMapping("/{memId}")
public ResponseEntity<?> deleteMember(@PathVariable String memId, @RequestHeader("Authorization") String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).body("인증 토큰이 없거나 유효하지 않습니다.");
    }

    String token = authHeader.substring(7);

    try {
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }

        String loggedInMemId = jwtUtil.extractMemId(token);
        if (!loggedInMemId.equals(memId)) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }

        memberService.deleteMember(memId);
        return ResponseEntity.ok("계정이 성공적으로 삭제되었습니다.");
    } catch (Exception e) {
        logger.error("회원 삭제 중 오류 발생", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 삭제 중 오류가 발생했습니다: " + e.getMessage());
    }
}

    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        try {
            String memId = memberService.findIdByEmail(email);
            if (memId != null && !memId.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("memId", memId);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아이디 찾기 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/find-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String memId = request.get("memId");
        String email = request.get("email");

        try {
            boolean result = memberService.resetPassword(memId, email);
            if (result) {
                return ResponseEntity.ok("임시 비밀번호가 이메일로 전송되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("비밀번호 재설정에 실패했습니다.");
            }
        } catch (Exception e) {
            logger.error("비밀번호 재설정 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @GetMapping("/check-login")
    public ResponseEntity<?> checkLoginStatus(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            Map<String, Object> response = new HashMap<>();
            response.put("isLoggedIn", false);
            return ResponseEntity.ok(response);
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            Map<String, Object> response = new HashMap<>();
            response.put("isLoggedIn", false);
            return ResponseEntity.ok(response);
        }
        String memId = jwtUtil.extractMemId(token);
        Map<String, Object> response = new HashMap<>();
        response.put("isLoggedIn", true);
        response.put("memId", memId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkDuplicateId(@RequestParam("memId") String memId) {
        boolean isDuplicate = memberService.isIdDuplicate(memId);
        return ResponseEntity.ok(isDuplicate);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkDuplicateEmail(@RequestParam("email") String email) {
        boolean isDuplicate = memberService.isEmailDuplicate(email);
        return ResponseEntity.ok(isDuplicate);
    }

}
