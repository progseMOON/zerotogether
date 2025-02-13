package com.zd.back.login.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zd.back.login.service.SmsService;
import com.zd.back.login.service.VerificationService;

@RestController
@RequestMapping("/api/auth")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @Autowired
    private VerificationService verificationService;

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerification(@RequestBody Map<String, String> body) {
        String phoneNumber = body.get("phoneNumber");
        String verificationCode = generateVerificationCode();
        try {
            smsService.sendVerificationSms(phoneNumber, verificationCode);
            verificationService.saveCode(phoneNumber, verificationCode);
            Map<String, String> response = new HashMap<>();
            response.put("message", "인증번호가 발송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "SMS 발송 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body) {
        String phoneNumber = body.get("phoneNumber");
        String code = body.get("code");
        boolean isValid = verificationService.verifyCode(phoneNumber, code);
        Map<String, Object> response = new HashMap<>();
        response.put("isValid", isValid);
        if (!isValid) {
            response.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
        }
        return ResponseEntity.ok(response);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
}
