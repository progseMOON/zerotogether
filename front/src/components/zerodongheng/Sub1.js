import React from 'react';
import './Sub1.css';
const Sub1 = () => {
    
    return (
        <div style={{
            display:'flex',
            justifyContent:'end',
            alignItems:'end'
  
          }}>
        <div className="cont">
            <div className="circle">
                <div className="logo">Zerowaste</div>
                <div className="item top-left">
                <h6>거부하기 (Refuse)</h6>
                <p>필요하지않는 제품 소비하지 않기<br/></p>
                </div>
                <div className="item top-right">
                <h6>줄이기 (Reduce)</h6>
                <p>쓰레기를 줄이고 소비를 최소화 하기<br/></p>
                </div>
                <div className="item bottom-left">
                <h6>재사용하기 (Reuse)</h6>
                <p>사용 가능한 물건은 재사용하기<br/></p>
                </div>
                <div className="item bottom-right">
                <h6>퇴비화하기 (Rot)</h6>
                <p>자연적으로 분해 가능한 물질은 퇴비로 만들어주세요<br/></p>
                </div>
                <div className="item center">

                </div>
            </div>
        </div>
    </div>
    );
};

export default Sub1;