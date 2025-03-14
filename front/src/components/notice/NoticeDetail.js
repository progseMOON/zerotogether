import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './NoticeDetail.css';
import styled from 'styled-components';
import { Quill } from 'react-quill';

const NoticeContent = styled.div`
    img {
        max-width: 100%;
        height: auto;
        cursor: pointer;
    }
`;

// Quill을 전역 스코프에 등록
if (typeof window !== 'undefined') {
    window.Quill = Quill;
}

// 이미지 리사이즈 관련 오류 방지를 위한 함수
const preventImageResizeError = () => {
    const originalModule = Quill.import('modules/imageResize');
    class ImageResize extends originalModule {
        checkImage(evt) {
            if (this.img) {
                if (evt.keyCode === 46 || evt.keyCode === 8) {
                    if (Quill.find && typeof Quill.find === 'function') {
                        Quill.find(this.img).deleteAt(0);
                    }
                    this.hide();
                }
            }
        }
    }
    Quill.register('modules/imageResize', ImageResize, true);
};

const NoticeDetail = () => {
    const [notice, setNotice] = useState(null);
    const { noticeId } = useParams();
    const navigate = useNavigate();

    const fetchNotice = useCallback(async () => {
        try {
            const response = await axios.get(`/api/notices/${noticeId}`);
            setNotice(response.data);
        } catch (error) {
            console.error('공지사항 상세 조회 실패:', error);
            alert('공지사항을 불러오는 데 실패했습니다.');
        }
    }, [noticeId]);

    useEffect(() => {
        fetchNotice();
        preventImageResizeError();

        // 이미지 클릭 이벤트 리스너 추가
        const addImageClickListeners = () => {
            const images = document.querySelectorAll('.notice-detail img');
            images.forEach(img => {
                img.addEventListener('click', openOriginalImage);
            });
        };

        // 컴포넌트가 마운트된 후 이미지 리스너 추가
        const timer = setTimeout(addImageClickListeners, 100);

        // 컴포넌트 언마운트 시 이벤트 리스너 및 타이머 제거
        return () => {
            clearTimeout(timer);
            const images = document.querySelectorAll('.notice-detail img');
            images.forEach(img => {
                img.removeEventListener('click', openOriginalImage);
            });
        };
    }, [fetchNotice]);

    const openOriginalImage = (event) => {
        const img = event.target;
        const src = new URL(img.src, window.location.origin).href;
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        newWindow.document.write(`
            <html>
                <head>
                    <title>원본 이미지</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: #f0f0f0;
                            cursor: pointer;
                        }
                        img {
                            max-width: 100%;
                            max-height: 100%;
                            object-fit: contain;
                        }
                    </style>
                </head>
                <body onclick="window.close()">
                    <img src="${src}"
                         onload="this.style.display='block'"
                         onerror="document.body.innerHTML='이미지를 불러올 수 없습니다.'"
                         style="display:none;">
                </body>
            </html>
        `);
    };

    if (!notice) return <div>Loading...</div>;

    return (
        <div className="notice-detail container mt-5">
            <h2 style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '700', color: '#353535',margin:'20px 0' }}>공지사항 본문</h2>
            <h2 className="title" style={{marginBottom: '30px'}}>제&nbsp;&nbsp;&nbsp;목&nbsp;:&nbsp;{notice.title}</h2>
            <div className='notice-r'>
                <span className="label">작&nbsp;&nbsp;성&nbsp;&nbsp;자&nbsp;&nbsp;:&nbsp;&nbsp;ADMIN</span>
                <span className="label">작&nbsp;&nbsp;성&nbsp;&nbsp;일&nbsp;&nbsp;:&nbsp;&nbsp;{new Date(notice.createdAt).toLocaleString()}</span>
                <span className="label">조&nbsp;&nbsp;회&nbsp;&nbsp;수&nbsp;&nbsp;:&nbsp;&nbsp;{notice.views}</span>
            </div>
            <hr />
            <NoticeContent dangerouslySetInnerHTML={{ __html: notice.content }} />
            <Button onClick={() => navigate('/notices')} className="mt-3">공지사항 목록으로 돌아가기</Button>
        </div>
    );
};

export default NoticeDetail;
