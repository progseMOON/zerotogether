package com.zd.back.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class BlacklistService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String SECRET_KEY = "YourStrongSecretKey"; // 실제 시크릿 키로 교체해야 합니다.

    /**
     * JWT 토큰을 블랙리스트에 추가합니다.
     *
     * @param token 토큰 문자열
     */
    public void addToBlacklist(String token) {
        long expirationTime = getExpirationDateFromToken(token);
        long ttl = expirationTime - System.currentTimeMillis();
        if (ttl > 0) {
            redisTemplate.opsForValue().set(token, "blacklisted", ttl, TimeUnit.MILLISECONDS);
        }
    }

    /**
     * 주어진 토큰이 블랙리스트에 존재하는지 확인합니다.
     *
     * @param token 토큰 문자열
     * @return 블랙리스트에 존재하면 true, 아니면 false
     */
    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }

    /**
     * JWT 토큰에서 만료 시간을 추출합니다.
     *
     * @param token JWT 토큰
     * @return 만료 시간 (밀리초)
     */
    private long getExpirationDateFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.getExpiration().getTime();
    }
}
