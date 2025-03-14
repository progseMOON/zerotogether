import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import './NoticeList.css'

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const fetchNotices = useCallback(async () => {
        try {
            const response = await axios.get('/api/notices', {
                params: { page: currentPage, size: pageSize }
            });
            setNotices(response.data.notices);
            setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        } catch (error) {
            console.error('공지사항 목록 조회 실패:', error);
            alert('공지사항 목록을 불러오는 데 실패했습니다.');
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    return (
        <div className="notice-list">
            <h2 style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '700', color: '#353535',margin:'20px 0' }}>공지사항 게시판</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</th>
                        <th>작&nbsp;&nbsp;성&nbsp;&nbsp;자</th>
                        <th>작&nbsp;&nbsp;성&nbsp;&nbsp;일</th>
                        <th>조&nbsp;&nbsp;회&nbsp;&nbsp;수</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map(notice => (
                        <tr key={notice.noticeId}>
                            <td>
                                <Link to={`/notices/${notice.noticeId}`}>{notice.title}</Link>
                            </td>
                            <td>ADMIN</td>
                            <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                            <td>{notice.views}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(totalPages).keys()].map(number => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => setCurrentPage(number + 1)}
                    >
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default NoticeList;
