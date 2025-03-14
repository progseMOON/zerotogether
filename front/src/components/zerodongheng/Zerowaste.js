import React from 'react';
import './Maincss.css';
import './Sub1.css';
import YouTube,{YouTubeProps} from 'react-youtube'
import Sub1 from './Sub1';

const Zerowaste = () => {


    return (
        <div className="zero-waste-intro"  >
          <h2><strong>제로 웨이스트란?</strong></h2>

            <div>
              <p>
                    제로 웨이스트는 가능한 한 쓰레기를 줄이고, 모든 자원을 재활용하거나 재사용하여 환경을 보호하는 운동입니다. 
                    우리의 소비 방식과 생활 습관을 개선함으로써 지속 가능한 미래를 추구합니다.
              </p>
            </div>

          <div>
          </div>
          
          <br/>

        <YouTube
  videoId={'ir_0L0hbdRw'}
  opts={{
    width:"560",
    height:"315",
    playerVars:{
      autoplay:0, //자동재생 1:재생, 0:비활성화
      rel: 0, //관련동영상 미표시
      modestbranding: 1, //youtube로고 미표시
    }
  }}
  //이벤트 리스너
  onEnd={(e)=> e.target.stopVideo(0)}/>  

  <br/><br/>
  <hr/>
  <br/><br/>
  
        <h2  className="right-align"><strong>제로 웨이스트의 원칙</strong></h2>
        

          <Sub1/>
      
          <br/><br/>
          <hr/>
          <br/><br/>
        <h2><strong>제로 웨이스트 실천 방법</strong></h2>
        <p>
        제로웨이스트는 작은 습관에서 시작할 수 있습니다.<br/> 재사용 가능한 용기와 장바구니를 사용해 일회용 포장재를 줄이고, 식물 기반 제품과 유리나 금속을 선택하세요. <br/> 음식물 쓰레기를 줄이기 위해 식사를 계획하고 남은 음식을 활용하는 습관을 기릅니다. <br/> 또한, 리필 스테이션을 이용해 세제와 화장품을 재사용 가능한 용기에 담아 사용하는 것이 효과적입니다. <br/>
        </p>
      </div>
    );
};

export default Zerowaste;