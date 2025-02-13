package com.zd.back.login.model;

import lombok.Data;

@Data
public class MemberDTO {
    private String memId;
    private String pwd;
    private String memName;
    private String email;
    private String tel;
    private String post;
    private String addr1;
    private String addr2;
    private boolean termsAccepted;
    private boolean privacyAccepted;
    private String role;  // Role을 String으로 받음
}
