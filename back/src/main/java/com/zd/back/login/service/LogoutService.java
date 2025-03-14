package com.zd.back.login.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.zd.back.login.security.TokenProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class LogoutService implements LogoutHandler {

    private static final Logger logger = LoggerFactory.getLogger(LogoutService.class);

    private final RedisTemplate<String, String> redisTemplate;
    private final TokenProvider tokenProvider;

    @Autowired
    public LogoutService(RedisTemplate<String, String> redisTemplate, TokenProvider tokenProvider) {
        this.redisTemplate = redisTemplate;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String token = tokenProvider.resolveToken(request);
        if (token != null && tokenProvider.validateToken(token)) {
            long expiration = tokenProvider.getExpirationTime(token) - System.currentTimeMillis();
            if (expiration > 0) {
                redisTemplate.opsForValue().set("blacklist:" + token, "logout", expiration, TimeUnit.MILLISECONDS);
                logger.info("Token added to blacklist: {}", token);
            }
        }

        // 세션 무효화
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
            logger.info("Session invalidated for user");
        }

        // 쿠키 삭제 (필요한 경우)
        // Cookie[] cookies = request.getCookies();
        // if (cookies != null) {
        //     for (Cookie cookie : cookies) {
        //         cookie.setValue("");
        //         cookie.setPath("/");
        //         cookie.setMaxAge(0);
        //         response.addCookie(cookie);
        //     }
        //     logger.info("Cookies cleared for user");
        // }

        logger.info("Logout processed successfully");
    }
}
