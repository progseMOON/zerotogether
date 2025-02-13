import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import './BannerSlider.css'; // 추가적인 스타일이 필요한 경우 사용

const BannerSlider = () => {
  const images = [
    { src : '/images/visual.jpg', link : 'https://love.seoul.go.kr/articles/8513'},
    { src : '/images/zerowastebanner.jpg', link : 'https://www.2050cnc.go.kr/base/board/read?boardManagementNo=7&boardNo=746&searchCategory=&page=3&searchType=&searchWord=&menuLevel=3&menuNo=5'},
    { src : '/images/koicachallenge.jpg', link : 'https://www.instagram.com/koica_weko/p/CTQ5nEyhmIH/?utm_medium=copy_link&img_index=1'}
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className="banner-slider"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="slide">
            <a href={image.link} target="_blank" rel="noopener noreferrer">
              <img src={image.src} alt={`Slide ${index}`} className="slide-image" />
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerSlider;