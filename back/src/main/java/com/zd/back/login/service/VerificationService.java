package com.zd.back.login.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {
    private final Map<String, VerificationData> verificationCodes = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 3;
    private static final long EXPIRATION_TIME_MINUTES = 5;

    public void saveCode(String phoneNumber, String code) {
        verificationCodes.put(phoneNumber, new VerificationData(code, LocalDateTime.now(), 0));
    }

    public boolean verifyCode(String phoneNumber, String code) {
        VerificationData data = verificationCodes.get(phoneNumber);
        if (data == null) {
            return false;
        }

        if (data.getAttempts() >= MAX_ATTEMPTS) {
            verificationCodes.remove(phoneNumber);
            return false;
        }

        if (LocalDateTime.now().isAfter(data.getExpirationTime())) {
            verificationCodes.remove(phoneNumber);
            return false;
        }

        data.incrementAttempts();

        if (data.getCode().equals(code)) {
            verificationCodes.remove(phoneNumber);
            return true;
        }

        return false;
    }

    private static class VerificationData {
        private final String code;
        private final LocalDateTime expirationTime;
        private int attempts;

        public VerificationData(String code, LocalDateTime creationTime, int attempts) {
            this.code = code;
            this.expirationTime = creationTime.plusMinutes(EXPIRATION_TIME_MINUTES);
            this.attempts = attempts;
        }

        public String getCode() {
            return code;
        }

        public LocalDateTime getExpirationTime() {
            return expirationTime;
        }

        public int getAttempts() {
            return attempts;
        }

        public void incrementAttempts() {
            this.attempts++;
        }
    }
}
