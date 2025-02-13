package com.zd.back.login.model;

import com.zd.back.login.validation.ValidationRegex;
import com.zd.back.login.validation.ValidationMessages;
import lombok.Data;

import javax.validation.constraints.*;

@Data
public class Member {

    @Pattern(regexp = ValidationRegex.MEMID_REGEX, message = ValidationMessages.MEMID)
    private String memId; // 회원 ID 자동 검증

    @Pattern(regexp = ValidationRegex.PWD_REGEX, message = ValidationMessages.PWD)
    private String pwd; // 비밀번호 자동 검증

    @Pattern(regexp = ValidationRegex.MEMNAME_REGEX, message = ValidationMessages.MEMNAME)
    private String memName; // 이름 자동 검증

    @Pattern(regexp = ValidationRegex.EMAIL_REGEX, message = ValidationMessages.EMAIL)
    private String email; // 이메일 자동 검증

    @Pattern(regexp = ValidationRegex.TEL_REGEX, message = ValidationMessages.TEL)
    private String tel; // 전화번호 자동 검증

    private String post;
    private String addr1;
    private String addr2;
    private boolean termsAccepted;
    private boolean privacyAccepted;

    private Role role;
}
