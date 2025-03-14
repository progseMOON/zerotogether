package com.zd.back.login.validation;

public class ValidationRegex {
    public static final String MEMID_REGEX = "^[a-zA-Z][a-zA-Z0-9_]{3,19}$"; // 회원 ID: 4~20자 영문시작, 숫자, 언더스코어
    public static final String PWD_REGEX = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{8,}$"; // 비밀번호: 최소 8자, 영문+숫자+특수기호
    public static final String MEMNAME_REGEX = "^[가-힣a-zA-Z]{2,20}$"; // 이름: 2~20자 한글 또는 영문
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; // 이메일
    public static final String TEL_REGEX = "^01[016789]-?\\d{3,4}-?\\d{4}$"; // 전화번호
}
