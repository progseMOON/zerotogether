import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { adjustWindowSize } from './utils/Sizing';
import ValidationMessage from './ValidationMessage';
import { validateField } from './utils/validating';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import './MemberForm.css';

const MemberForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [member, setMember] = useState({
    memId: '',
    pwd: '',
    pwdConfirm: '',
    memName: '',
    email: '',
    tel: '',
    post: '',
    addr1: '',
    addr2: '',
    termsAccepted: false,
    privacyAccepted: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isPhoneVerificationRequired, setIsPhoneVerificationRequired] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [termsContent, setTermsContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMember(prevState => ({
        ...prevState,
        ...initialData,
        pwd: '',
        pwdConfirm: '',
        termsAccepted: false,
        privacyAccepted: false
      }));
      setPhoneNumber(initialData.tel || '');
      adjustWindowSize(window, initialData, true, []);
    }

    axios.get('/member/terms')
      .then(response => {
        if (response.data && typeof response.data === 'string') {
          setTermsContent(response.data);
        }
      })
      .catch(error => {
        console.error('이용약관 불러오기 오류:', error);
        setTermsContent('이용약관을 불러오는 중 오류가 발생했습니다.');
      });

    axios.get('/member/privacy')
      .then(response => {
        if (response.data && typeof response.data === 'string') {
          setPrivacyContent(response.data);
        }
      })
      .catch(error => {
        console.error('개인정보 처리방침 불러오기 오류:', error);
        setPrivacyContent('개인정보 처리방침을 불러오는 중 오류가 발생했습니다.');
      });
  }, [initialData]);

  const checkDuplicateId = () => {
    if (!member.memId || member.memId.trim() === '') {
        alert('아이디를 입력해주세요.');
        return;
    }
    setIsLoading(true);
    axios.get('/member/check-id', { params: { memId: member.memId } })
        .then(response => {
            setIsDuplicate(response.data);
            setIsChecked(true);
        })
        .catch(error => {
            console.error('아이디 중복 체크 오류:', error);
            alert('아이디 중복 확인 중 오류가 발생했습니다.');
        })
        .finally(() => {
            setIsLoading(false);
        });
};

  const checkDuplicateEmail = () => {
    if (!member.email || member.email.trim() === '') {
      alert('이메일을 입력해주세요.');
      return;
    }
    axios.get('/member/check-email', { params: { email: member.email } })
      .then(response => {
        setIsEmailDuplicate(response.data);
        setIsEmailChecked(true);
      })
      .catch(error => {
        console.error('이메일 중복 체크 오류:', error);
      });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(member).forEach(key => {
      const value = member[key];
      if (key !== 'pwd' && key !== 'pwdConfirm' && typeof value === 'string' && value.trim() === '') {
        newErrors[key] = '이 필드는 필수입니다.';
      } else if (key !== 'pwdConfirm' && key !== 'post' && key !== 'addr1' && key !== 'addr2') {
        if (isEditing && key === 'pwd' && typeof value === 'string' && value.trim() === '') {
          return;
        }
        const errorMessage = validateField(key, member[key]);
        if (errorMessage) {
          newErrors[key] = errorMessage;
        }
      }
    });

    if (!isEditing && member.pwd !== member.pwdConfirm) {
      newErrors.pwdConfirm = '비밀번호가 일치하지 않습니다.';
    }
    if (isEditing && isPhoneVerificationRequired && !isVerified) {
      newErrors.tel = '핸드폰 번호 변경 시 인증이 필요합니다.';
    }
    if (!isEditing && !member.termsAccepted) {
      newErrors.termsAccepted = '이용약관에 동의해야 합니다.';
    }
    if (!isEditing && !member.privacyAccepted) {
      newErrors.privacyAccepted = '개인정보 처리방침에 동의해야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'memId') {
      setIsChecked(false);
      setIsDuplicate(false);
    }

    if (name === 'tel' && isEditing) {
      if (value !== initialData.tel) {
        setIsPhoneVerificationRequired(true);
        setIsVerified(false);
      } else {
        setIsPhoneVerificationRequired(false);
        setIsVerified(true);
      }
    }

    if (isEditing && name === 'pwd' && value.trim() === '') {
      setErrors(prev => ({...prev, pwd: undefined }));
    } else {
      const errorMessage = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMessage || undefined }));

      if (!isEditing && (name === 'pwd' || name === 'pwdConfirm')) {
        if (name === 'pwd' && member.pwdConfirm && value !== member.pwdConfirm) {
          setErrors(prev => ({...prev, pwdConfirm: '비밀번호가 일치하지 않습니다.' }));
        } else if (name === 'pwdConfirm' && value !== member.pwd) {
          setErrors(prev => ({...prev, pwdConfirm: '비밀번호가 일치하지 않습니다.' }));
        } else {
          setErrors(prev => ({...prev, pwdConfirm: undefined }));
        }
      }
    }

    adjustWindowSize(window, {...member, [name]: type === 'checkbox' ? checked : value }, true, []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !isVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }
    if (isEditing && isPhoneVerificationRequired && !isVerified) {
      alert('휴대폰 번호가 변경되었습니다. 재인증을 완료해주세요.');
      return;
    }
    if (!isEditing) {
      if (!isChecked) {
        alert('아이디 중복 체크를 해주세요.');
        return;
      }
      if (isDuplicate) {
        alert('이미 사용 중인 아이디입니다.');
        return;
      }
      if (!member.termsAccepted || !member.privacyAccepted) {
        alert('이용약관과 개인정보 처리방침에 모두 동의해야 합니다.');
        return;
      }
    }

    if (validateForm()) {
      setIsLoading(true);
      setServerError(null);
      try {
        const url = isEditing ? `/member/update/${member.memId}` : '/member/register';
        const data = {
          ...member,
          pwd: isEditing && !member.pwd ? undefined : member.pwd,
          tel: isPhoneVerificationRequired ? phoneNumber : member.tel
        };
        const response = await axios.post(url, data, { withCredentials: true });
        if (response.status === 200) {
          const successMessage = isEditing ? '정보수정완료' : '회원가입완료';
          alert(successMessage);
          if (isEditing) {
            onSubmit(member);
          } else {
            navigate('/mainpage');
          }
        }
      } catch (error) {
        console.error('Error:', error.response);
        if (error.response && error.response.data && error.response.data.error) {
          setServerError(error.response.data.error);
        } else {
          setServerError(isEditing ? '회원정보 수정 중 오류가 발생했습니다.' : '회원가입 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDaumPost = async () => {
    if (!window.daum) {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }
    new window.daum.Postcode({
      oncomplete: function(data) {
        setMember(prevState => ({
          ...prevState,
          post: data.zonecode,
          addr1: data.address
        }));
        adjustWindowSize(window, {...member, post: data.zonecode, addr1: data.address }, true, []);
      }
    }).open();
  };

  const handleSendVerification = () => {
    axios.post('/api/auth/send-verification', { phoneNumber }, { withCredentials: true })
      .then(() => alert('인증번호가 발송되었습니다.'))
      .catch(error => console.error('인증번호 발송 실패:', error));
  };

  const handleVerifyCode = () => {
    axios.post('/api/auth/verify-code', { phoneNumber, code: verificationCode })
      .then(response => {
        if (response.data.isValid) {
          setIsVerified(true);
          alert('인증이 완료되었습니다.');
        } else {
          alert('인증번호가 올바르지 않습니다.');
        }
      })
      .catch(error => console.error('인증 실패:', error));
  };

  const handlePhoneReauthentication = () => {
    setIsPhoneVerificationRequired(true);
    setIsVerified(false);
    setPhoneNumber(member.tel);
  };



  return (
    <Container className="member-form-container mt-5">
      <h2 className="text-center mb-4" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '700', color: '#353535' }}>{isEditing ? '회원정보 수정' : '회원가입'}</h2><br/>
      {serverError && <div className="alert alert-danger">{serverError}</div>}
      {isLoading && <div className="alert alert-info">처리 중입니다...</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="member-form-group">
          <Form.Label className="member-form-label">아&nbsp;&nbsp;이&nbsp;&nbsp;디</Form.Label>
          <div className="col-sm-10">
            <Form.Control
              className="member-form-control"
              type="text"
              name="memId"
              value={member.memId || ''}
              onChange={handleInputChange}
              readOnly={isEditing}
              required
            />
            {!isEditing && (
              <Button onClick={checkDuplicateId} className="btn btn-primary btn-sm mt-2" disabled={isLoading}>
              {isLoading ? '확인 중...' : 'ID중복 확인'}
          </Button>
            )}
            {isChecked && (
              <div>
                {isDuplicate ? (
                  <span style={{ color:'red' }}>이미 사용 중인 아이디입니다.</span>
                ) : (
                  <span style={{ color: 'green' }}>사용 가능한 아이디입니다.</span>
                )}
              </div>
            )}
            <ValidationMessage message={errors.memId} />
          </div>
        </Form.Group>

        <Form.Group className="member-form-group">
          <Form.Label className="member-form-label">비밀번호</Form.Label>
          <div className="col-sm-10">
            <Form.Control
              className="member-form-control"
              type="password"
              name="pwd"
              placeholder={isEditing ? "비밀번호 (변경시에만 입력)" : "비밀번호"}
              value={member.pwd || ''}
              onChange={handleInputChange}
              required={!isEditing}
            />
            <ValidationMessage message={errors.pwd} />
          </div>
        </Form.Group>

        {!isEditing && (
          <Form.Group className="member-form-group">
            <Form.Label className="member-form-label">비밀번호 재확인</Form.Label>
            <div className="col-sm-10">
            <Form.Control
  className="member-form-control"
  type="password"
  name="pwdConfirm"
  placeholder="비밀번호 재확인"
  value={member.pwdConfirm || ''}
  onChange={handleInputChange}
  required
/>
<ValidationMessage message={errors.pwdConfirm} />
</div>
</Form.Group>
)}

<Form.Group className="member-form-group">
<Form.Label className="member-form-label">이&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;름</Form.Label>
<div className="col-sm-10">
<Form.Control
  className="member-form-control"
  type="text"
  name="memName"
  value={member.memName || ''}
  onChange={handleInputChange}
  required
/>
<ValidationMessage message={errors.memName} />
</div>
</Form.Group>

<Form.Group className="member-form-group">
<Form.Label className="member-form-label">이&nbsp;&nbsp;메&nbsp;&nbsp;일</Form.Label>
<div className="col-sm-10">
<Form.Control
  className="member-form-control"
  type="email"
  name="email"
  value={member.email || ''}
  onChange={handleInputChange}
  required
/>
{!isEditing && (
  <Button onClick={checkDuplicateEmail} className="btn btn-primary btn-sm mt-2">
    Email중복 확인
  </Button>
)}
{isEmailChecked && (
  <div>
    {isEmailDuplicate ? (
      <span style={{ color: 'red' }}>이미 사용 중인 이메일입니다.</span>
    ) : (
      <span style={{ color: 'green' }}>사용 가능한 이메일입니다.</span>
    )}
  </div>
)}
<ValidationMessage message={errors.email} />
</div>
</Form.Group>

<Form.Group className="member-form-group">
<Form.Label className="member-form-label">핸드폰 번호</Form.Label>
<div className="col-sm-10">
<Form.Control
  className="member-form-control"
  type="tel"
  name="tel"
  value={isEditing ? (isPhoneVerificationRequired ? phoneNumber : member.tel) : phoneNumber}
  placeholder={isEditing ? '(변경시에만 재인증)' : ''}
  onChange={(e) => {
    if (isEditing) {
      if (isPhoneVerificationRequired) {
        setPhoneNumber(e.target.value);
      } else {
        handleInputChange(e);
      }
    } else {
      setPhoneNumber(e.target.value);
      handleInputChange(e);
    }
  }}
  readOnly={isEditing && !isPhoneVerificationRequired}
/>
{isEditing && !isPhoneVerificationRequired && (
  <Button onClick={handlePhoneReauthentication} className="btn btn-primary btn-sm mt-2">
    핸드폰 재인증
  </Button>
)}
{(isPhoneVerificationRequired || !isEditing) && (
  <Button onClick={handleSendVerification} className="btn btn-primary btn-sm mt-2">
    인증번호 발송
  </Button>
)}
<ValidationMessage message={errors.tel} />
</div>
</Form.Group>

{(isPhoneVerificationRequired || !isEditing) && (
<Form.Group className="member-form-group">
  <Form.Label className="member-form-label">인증번호</Form.Label>
  <div className="col-sm-10">
    <Form.Control
      className="member-form-control"
      type="text"
      value={verificationCode}
      onChange={(e) => setVerificationCode(e.target.value)}
    />
    <Button
      onClick={handleVerifyCode}
      className="btn btn-primary btn-sm mt-2"
      disabled={isVerified}
    >
      인증하기
    </Button>
  </div>
</Form.Group>
)}

<Form.Group className="member-form-group">
<Form.Label className="member-form-label">우편번호</Form.Label>
<div className="col-sm-10">
<Form.Control
  className="member-form-control"
  type="text"
  id="post"
  name="post"
  value={member.post || ''}
  onChange={handleInputChange}
  readOnly
  required
/>
<Button onClick={handleDaumPost} className="btn btn-primary btn-sm mt-2">
  우편번호 찾기
</Button>
</div>
</Form.Group>

<Form.Group className="member-form-group">
<Form.Label className="member-form-label">주&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소</Form.Label>
<div className="col-sm-10">
<Form.Control
  className="member-form-control"
  type="text"
  id="addr1"
  name="addr1"
  value={member.addr1 || ''}
  onChange={handleInputChange}
  required
/>
</div>
</Form.Group>

<Form.Group className="member-form-group">
<Form.Label className="member-form-label">상세주소</Form.Label>
<div className="col-sm-10">
<Form.Control
  className="member-form-control"
  type="text"
  id="addr2"
  name="addr2"
  value={member.addr2 || ''}
  onChange={handleInputChange}
  required
/>
</div>
</Form.Group>

{!isEditing && (
<>
  <Form.Group className="member-form-group">
    <Form.Label className="member-form-label">이용약관</Form.Label>
    <div className="col-sm-10">
      <Form.Control
        as="textarea"
        value={termsContent}
        readOnly
        rows="6"
        style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da' }}
      />
      <Form.Check
        className="mb-3"
        type="checkbox"
        name="termsAccepted"
        checked={member.termsAccepted}
        onChange={handleInputChange}
        label="이용약관에 동의합니다."
      />
      {errors.termsAccepted && <ValidationMessage message={errors.termsAccepted} />}
    </div>
  </Form.Group>
  <Form.Group className="member-form-group">
    <Form.Label className="member-form-label">개인정보처리방침</Form.Label>
    <div className="col-sm-10">
      <Form.Control
        as="textarea"
        value={privacyContent}
        readOnly
        rows="6"
        style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da' }}
      />
      <Form.Check
        className="mb-3"
        type="checkbox"
        name="privacyAccepted"
        checked={member.privacyAccepted}
        onChange={handleInputChange}
        label="개인정보 처리방침에 동의합니다."
      />
      {errors.privacyAccepted && <ValidationMessage message={errors.privacyAccepted} />}
    </div>
  </Form.Group>
</>
)}

<div className="member-form-btn-group">
<Button type="submit" className="btn btn-primary btn-sm">
  {isEditing ? '수정완료' : '입력완료'}
</Button>
<Button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancel}>
  {isEditing ? '수정취소' : '가입취소'}
</Button>
</div>
</Form>
</Container>
);
};

export default MemberForm;
