import React, { useEffect } from 'react';

const Paystep2 = ({ setStep, memberInfo, setMemberInfo, isMember, setIsMember }) => {

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMemberInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const nextStep = () => {
    setStep(3);
  };

  const prevStep = () => {
    setStep(1);
  };

  return ( 
    <div className="paystep-container">
      

      {/* 비회원인 경우에는 사용자가 직접 입력 */}

        <>
          <div className="input-group">
            <label>후원자 성함</label>
            <input 
              type="text" 
              name="memName" 
              value={memberInfo.memName} 
              onChange={handleChange} 
              placeholder="이름" 
            />
          </div>
          
          <div className="input-group">
            <label>전화번호</label>
            <input 
              type="text" 
              name="tel" 
              value={memberInfo.tel} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label>이메일</label>
            <input 
              type="email" 
              name="email" 
              value={memberInfo.email} 
              onChange={handleChange} 
            />
          </div>
        </>


      <button onClick={prevStep} className="prev-step-btn">이전단계</button>
      <button onClick={nextStep} className="next-step-btn">다음단계</button>
    </div>
  );
};

export default Paystep2;
