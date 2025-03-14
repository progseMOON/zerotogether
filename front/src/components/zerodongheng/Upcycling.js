import React from 'react';
import './Maincss.css'
const Upcycling = () => {
    return (
        <div className="zero-waste-intro">
        <h2 style={{textAlign:'center', marginBottom:'20px'}}><strong>업사이클링이란?</strong></h2>
        <p>
          업사이클링은 기존에 버려지거나 쓸모없어진 물건을 창의적으로 재활용하여 새로운 가치를 만들어내는 과정입니다. 
          자원 낭비를 줄이고 환경을 보호하는 중요한 활동으로, 일상 속에서 쉽게 실천할 수 있습니다.
        </p>

        <br/><br/>
        <hr/>
        <br/><br/>

        <h3><strong>업사이클링의 효과</strong></h3>

        <ul>
          <li><strong>자원 절약:</strong> 새로운 제품을 만들기 위해 필요한 자원을 줄입니다.</li>
          <li><strong>에너지 절감:</strong> 기존 제품을 활용해 에너지 소비를 감소시킵니다.</li>
          <li><strong>환경 오염 감소:</strong> 버려지는 쓰레기를 줄여 환경 오염을 방지합니다.</li>
        </ul>

        <br/><br/>
        <hr/>

        <h3 style={{textAlign:'center'}}><strong>업사이클링 아이디어</strong></h3>
        <div className="image-container">
        
          <div className='image1'>
            <img src='/images/zerodonghaeng/Glass1.jpg' alt="Glass1" />
          </div>

          {/* 마우스를 올리면 image1을 숨기고 image2를 보이게 하는 중간 이미지 */}
          <div className='upcycle'>
            <img src='/images/zerodonghaeng/upcycle.jpg' alt="Upcycle" />
          </div>

          {/* 호버 시 나타나는 이미지 */}
          <div className='image2'>
            <img src='/images/zerodonghaeng/Glass2.jpg' alt="Glass2" />
          </div>
        
        </div>
        <br/><br/>

        <p>
          업사이클링은 창의적인 접근으로 가능합니다. <br/>
          예를 들어, 오래된 티셔츠로 에코백을 만들거나,
          유리병을 화병으로 재활용하는 등의 <br/>
          작은 실천들이 업사이클링의 예입니다.
        </p>
      </div>
    );
};

export default Upcycling;