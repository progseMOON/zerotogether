package com.zd.back.naversearchapi.model;

import lombok.Data;

@Data
public class User {
    private String id;       // 사용자 ID
    private String name;     // 사용자 이름
    private String email;    // 사용자 이메일
    private int coin;        // 사용자 코인 (예: 포인트 등)
    
}
