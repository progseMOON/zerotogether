import React, { useState } from 'react';
import './Maincss.css'
import './Recycling.css'
const Recycling = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');

    // 이미지 클릭 시 모달을 열고, 이미지 경로를 설정하는 함수
    const openModal = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setIsModalOpen(true);
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageSrc('');
    };

    return (
        <div className="recycling-container">
            <h2><strong>리사이클링이란?</strong></h2>
            <p>
                리사이클링은 사용된 물건을 새로운 제품으로 만드는 과정으로, 자원의 낭비를 줄이고 환경을 보호하는 중요한 방법입니다. <br/>
                많은 자원을 절약할 수 있으며, 쓰레기를 줄이는 데 기여할 수 있습니다.
            </p>

            <br/><br/>
            <hr/>
            <br/><br/>
            
            <div className="recycling-content">
                <div>
                <img 
                        src='/images/zerodonghaeng/recy.png' 
                        alt='recycle' 
                        onClick={() => openModal('/images/zerodonghaeng/recy.png')} // 이미지 클릭 시 openModal 함수 실행
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="recycling-info">
                    <h3 className='left-align'><strong>리사이클링의 필요성</strong></h3>
                    <ul>
                        <li style={{fontSize:'16px'}}><strong>자원 절약:</strong> 원자재의 필요성을 줄여 자원을 보존합니다. 이를통해 원료추출과 가공에 필요한 에너지를 절약하는데 도움이 됩니다.</li>
                        <li style={{fontSize:'16px'}}><strong>환경 보호:</strong> 매립지와 소각장에서 발생하는 환경 오염을 감소시킵니다.</li>
                        <li style={{fontSize:'16px'}}><strong>에너지 절약:</strong> 원자재 추출 및 처리에 사용되는 에너지 집약적 공정의 필요성을 줄여 에너지를 절약합니다.</li>
                        <li style={{fontSize:'16px'}}><strong>폐기물 감소:</strong> 재활용은 매립지로 갈 수 있는 물질을 재사용함으로써 폐기물을 줄이는데 도움이 됩니다.</li>
                    </ul>
                </div>
            </div>

            <br/><br/>
            <hr/>
            <br/><br/>

            <div className="recycling-method">
                <h3><strong>리사이클링 방법</strong></h3>
                <p>
                리싸이클은 자원을 재활용하는 중요한 방법입니다.<br/>
                플라스틱, 종이, 유리, 금속 등을 분리 배출하여 재활용 센터에서 새로운 제품으로 재탄생시킬 수 있습니다. <br/> 
                전자기기나 의류도 리싸이클이 가능하므로, 불필요한 물건은 기부하거나 전문 업체에 맡겨 재활용하는 것이 좋습니다. <br/> 
                올바른 분리배출 습관을 통해 자원 낭비를 줄이고 환경 보호에 기여할 수 있습니다. <br/>
                </p>
            </div>

            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={modalImageSrc} alt="enlarged" className="modal-image" />
                        <button className="close-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Recycling;
