package com.zd.back.exchange.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.zd.back.login.security.JwtUtil;
import com.zd.back.login.service.MemberService;

import lombok.RequiredArgsConstructor;

import java.util.List;


import com.zd.back.exchange.model.Exchange;
import com.zd.back.exchange.model.ExchangeResponse;
import com.zd.back.exchange.service.ExchangeService;

import com.zd.back.login.model.Member;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/exchange")
@RequiredArgsConstructor  //의존성 주입 위함 
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @PostMapping("/created")
    public ResponseEntity<String> createdExchange(@ModelAttribute Exchange exchange) {
        try {

            int maxExchangeId = exchangeService.maxExchangeId() ;
            exchange.setExchangeId(maxExchangeId+1);
            exchangeService.createdExchange(exchange);

            return ResponseEntity.status(HttpStatus.CREATED).body("교환 게시물이 등록되었습니다.");
        } catch (Exception e) {
            System.out.println(e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("교환 게시물 등록 중 오류가 발생했습니다.");
        }
    }


    @GetMapping("/info")
    public ResponseEntity<Member> getMemberInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            // 인증 헤더가 없거나 Bearer로 시작하지 않는 경우 401 반환
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build(); // 인증되지 않음
            }

            // 토큰 추출 및 검증
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build(); // 유효하지 않은 토큰
            }

            // 토큰에서 회원 ID 추출
            String memId = jwtUtil.extractMemId(token);
            Member member = memberService.getMemberById(memId);

            // 회원 정보가 있는 경우 비밀번호를 제외하고 반환
            if (member != null) {
                return ResponseEntity.ok(member);
            }

            // 회원을 찾을 수 없는 경우 404 반환
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            System.out.println(e.toString());
            return ResponseEntity.status(500).build(); // 서버 오류
        }
    }

    @GetMapping("/list")
    public ResponseEntity<ExchangeResponse> getExchanges(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "15") int size) {

        try {
            
            //System.out.println("page : " + page);
            //System.out.println("size : " + size);

            List<Exchange> exchanges = exchangeService.getExchanges(page, size);
            int totalElements = exchangeService.getDataCount();
        
            ExchangeResponse response = new ExchangeResponse(exchanges, totalElements);
            return ResponseEntity.ok(response);

        
        } catch (Exception e) {
            System.out.println(e.toString());
            return ResponseEntity.status(500).build();

        }
        
    } 

    @GetMapping("/article")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") //인증된 사용자만 
    public ResponseEntity<Exchange> getExArticle(@RequestParam int exchangeId
                                                ) {
        Exchange exchange = exchangeService.getExArticle(exchangeId);
        return ResponseEntity.ok(exchange);
    }


    @DeleteMapping("/deleted")
    public ResponseEntity<String> deleteExchange(@RequestParam int exchangeId) {
        try {
            exchangeService.deleteExchange(exchangeId);
            return ResponseEntity.ok("게시물이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("게시물 삭제 중 오류가 발생했습니다.");
        }
    }
    @PostMapping("/auth") //승인
    public ResponseEntity<String> getAuthorized(@RequestParam int exchangeId) {
        try {
            exchangeService.updateAuth(exchangeId);
            return ResponseEntity.ok("교환 게시물이 승인되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("승인 처리 중 오류가 발생했습니다.");
        }
    }
}
