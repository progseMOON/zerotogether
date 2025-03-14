export const validateField = (name, value) => {
    const MEMID_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
    const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const MEMNAME_REGEX = /^[가-힣a-zA-Z]{2,20}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const TEL_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

    switch (name) {
        case 'memId':
            return MEMID_REGEX.test(value) ? '' : '아이디는 4~20자의 영문으로 시작하고, 숫자, 언더스코어 사용이 가능합니다.';
        case 'pwd':
            return PWD_REGEX.test(value) ? '' : '비밀번호는 최소 8자 이상이며, 영문자와 숫자,특수문자 1개이상 반드시 포함해야 합니다.';
        case 'memName':
            return MEMNAME_REGEX.test(value) ? '' : '이름은 2~20자의 한글 또는 영문만 사용 가능합니다.';
        case 'email':
            return EMAIL_REGEX.test(value) ? '' : '유효한 이메일 주소를 입력해주세요.';
        case 'tel':
            return TEL_REGEX.test(value) ? '' : '유효한 전화번호 형식이 아닙니다.';
        default:
            return '';
    }
};
