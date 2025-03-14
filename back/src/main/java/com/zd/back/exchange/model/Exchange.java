package com.zd.back.exchange.model;

import lombok.Data;

@Data
public class Exchange {
    
    private int exchangeId; // 게시판 번호
    private String memId;
    private String title;
    private String sender; // 보내는 사람
    private String receiver; // 받는 사람
    private String created;

    private String content; // 배송시 메세지
    private String addr1; // 주소
    private String addr2; // 상세주소
    private String post; // 우편번호
    private String tel; // 전화번호

    private int auth; // 인증 여부 (0 또는 1)
    private String authDate; // 인증된 날짜

    private Integer selec; //선택한 장바구니 : 기본이 3펭귄
                          // null 값 허용 위해 Integer 타입으로 선언

                    

}

