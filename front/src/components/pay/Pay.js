import React, { useCallback, useContext, useEffect, useState } from "react";
import Paystep1 from "./Paystep1";
import Paystep2 from "./Paystep2";
import Paystep3 from "./Paystep3";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Pay.css';
import { AuthContext } from "../login/context/AuthContext";

const Pay = () => {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [memId] = useState(localStorage.getItem('memId'));

  const [memberInfo, setMemberInfo] = useState({
    memId: 'nobody',
    memName: '익명',
    email: '',
    tel: '01000000000',
    post: '21969',
    addr1: '서울 강남구 역삼동',
    addr2: '역삼동 702-10'
  });

  const [isMember, setIsMember] = useState(false); // 회원 여부 상태 관리
  const [IMP, setIMP] = useState(null); // IMP 객체 상태 관리

  // 아임포트 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;

    script.onload = () => {
      // 스크립트가 로드되면 IMP 객체를 상태로 설정
      setIMP(window.IMP);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 회원 정보 조회 (fetchMemberInfo) 함수 호출
  const fetchMemberInfo = useCallback(() => {
    if (token) {
      axios.get('/member/info', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setMemberInfo(response.data); // 회원 정보 상태 업데이트
        setIsMember(true); // 회원이면 isMember를 true로 설정
      })
      .catch(error => {
        console.error('회원 정보 조회 실패:', error);
        setIsMember(false); // 회원 정보 조회 실패시 isMember를 false로 설정
      });
    } else {
      setIsMember(false); // 토큰이 없으면 비회원 처리
    }
  }, [token]);

  useEffect(() => {
    fetchMemberInfo(); // 컴포넌트가 렌더링될 때 회원 정보 조회
  }, [fetchMemberInfo]);

  const amountChange = (event) => {
    setAmount(event.target.value);
  };

  // 결제창 불러오기
  const requestPay = () => {
    if (!IMP) {
      console.error("IMP 객체가 로드되지 않았습니다.");
      return; // IMP가 로드되지 않으면 결제를 진행하지 않음
    }

    IMP.init("imp51775781"); // IMP 객체가 로드된 후에 호출

    const now = new Date();
    const createdAt = now.toISOString().replace("Z", "");
    const merchantUid = `order_${createdAt.replace(/[-:.TZ]/g, "")}`;

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: `후원금`,
        amount: amount,
        buyer_email: memberInfo.email,
        buyer_name: memberInfo.memName,
        buyer_tel: memberInfo.tel,
        buyer_addr: `${memberInfo.addr1} ${memberInfo.addr2}`,
        buyer_postcode: memberInfo.post,
      },
      async function (response) {
          const paymentData = {
              orderId: response.imp_uid,
              pgTid: response.merchant_uid,
              paymentMethod: 'card',
              amount: amount,
              buyerId: memberInfo.memId,
              memName: memberInfo.memName,
              buyerEmail: memberInfo.email,
              buyerTel: memberInfo.tel,
              status: response.success ? '성공' : '실패',
              failReason: response.error_msg,
          };

          if (response.success) {
            await axios.post('/payment/paymentHistory', paymentData, {
                headers: { Authorization: `Bearer ${token}` } 
            });
            navigate('/success', { state: { amount, memberInfo, response } });
        } else {
            await axios.post('/payment/paymentHistory', paymentData, {
                headers: { Authorization: `Bearer ${token}` } 
            });
            console.log(response);
            navigate('/failure', { state: { error: response.error_msg, response } });
        }
        
      }
    );
  };

  // 동적 클래스명 설정
  const stepClass = (stepNumber) => {
    return step === stepNumber ? 'step active' : 'step';
  };

  const renderStep = () => {
    if (step === 1) {
        return <Paystep1 amountChange={amountChange} setStep={setStep} />;
    } else if (step === 2) {
        return <Paystep2 setStep={setStep} memberInfo={memberInfo} setMemberInfo={setMemberInfo} isMember={isMember} setIsMember={setIsMember} />;
    } else {
        return <Paystep3 setStep={setStep} requestPay={requestPay} amount={amount} memberInfo={memberInfo} isMember={isMember} />;
    }
  };

  return (
    <div className="pay-container">
      <h3>{isMember ? '회원' : '비회원'}</h3>
      <div className="step-container">
        <div className={stepClass(1)} style={{flex: 1,}}>step1</div>
        <div className={stepClass(2)} style={{flex: 1}}>step2</div>
        <div className={stepClass(3)} style={{flex: 1}}>step3</div>
      </div>
      <div style={{marginTop:'20px', width:'65%', }}>
        {renderStep()}
      </div>
    </div>
  );
  
};

export default Pay;
