package com.zd.back.exchange.model;
import java.util.List;
import lombok.Data;

@Data
public class ExchangeResponse {
    private List<Exchange> content; // 교환 게시물 목록
    private int totalElements;        // 총 게시물 수


    // 생성자
    public ExchangeResponse(List<Exchange> content, int totalElements) {
        this.content = content;
        this.totalElements = totalElements;
    }

} 