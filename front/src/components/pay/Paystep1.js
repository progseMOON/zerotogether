import React, { useState } from 'react';
import './Pay.css';

const Paystep1 = ({ amountChange, setStep }) => {
    const [donateInput, setDonateInput] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(null);

    const [showWarningA, setShowWarningA] = useState(false); // 경고 메시지를 관리하는 상태
    const [showWarningB, setShowWarningB] = useState(false); // 경고 메시지를 관리하는 상태

    const nextStep = () => {
        // 직접 입력이 선택된 경우 금액이 100원 이상인지 확인
        if (selectedAmount === 'custom' && (donateInput === '' || parseInt(donateInput) < 100)) {
            setShowWarningB(true); // 경고 메시지 표시
            setShowWarningA(false); // 기존 경고 메시지 삭제
        } else if (!donateInput && !selectedAmount) {
            setShowWarningA(true); // 금액이 설정되지 않으면 경고 메시지 표시
            setShowWarningB(false); // 기존 경고 메시지 삭제
        } else {
            setShowWarningA(false);
            setShowWarningB(false);
            setStep(2); // 금액이 설정되면 다음 단계로 이동
        }
    };

    const inputChange = (event) => {
        const value = event.target.value;
        setDonateInput(value);
        setSelectedAmount('custom'); // 'custom' radio 선택
        amountChange({ target: { value } });
    };

    const radioChange = (event) => {
        const value = event.target.value;
        setSelectedAmount(value);
        setDonateInput('');
        amountChange(event); 
    };

    return (
        <div className="paystep-container">

           <legend> <label>후원 금액</label></legend>
            <div className="amount-select">
                <input 
                    type="radio" 
                    name="donationAmount" 
                    value="20000" 
                    id="20000"
                    onChange={radioChange} 
                    // disabled={donateInput !== ''} 
                    
                />
                <label for="20000">20,000 원</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    type="radio" 
                    name="donationAmount" 
                    value="30000"
                    id="30000" 
                    onChange={radioChange} 
                    // disabled={donateInput !== ''} 
                    
                />
                <label for="30000">30,000 원</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    type="radio" 
                    name="donationAmount" 
                    value="50000" 
                    id="50000"
                    onChange={radioChange} 
                    // disabled={donateInput !== ''} 
                />
                <label for="50000">50,000 원</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    type="radio" 
                    name="donationAmount" 
                    value="100000" 
                    id="100000"
                    onChange={radioChange} 
                    // disabled={donateInput !== ''} 
                />
                <label for="100000">100,000 원</label>
        <br/>
                <input
                    type="radio"
                    name="donationAmount"
                    value="custom"
                    id="custom"
                    onChange={radioChange}
                    checked={selectedAmount === "custom"}
                />
                <label htmlFor="custom">직접 입력 </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    value={donateInput}
                    onChange={inputChange}
                    placeholder="직접 입력(최소 100원)"
                    disabled={selectedAmount !== 'custom'} // 'custom'일 때만 활성화
                />
            </div>
            {showWarningA && (
                <p className="warning-text" style={{ color: 'red' }}>
                    결제 금액을 선택해주세요.
                </p>
            )}
            {showWarningB && (
                <p className="warning-text" style={{ color: 'red' }}>
                    100원 이상의 금액을 입력해주세요.
                </p>
            )}

            
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onClick={nextStep} className="next-step-btn">다음단계</button>
        </div>
    );
};

export default Paystep1;
