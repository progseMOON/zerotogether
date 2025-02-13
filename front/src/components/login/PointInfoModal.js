import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { Emoji } from 'react-emoji-render';
import './PointInfoModal.css';


const gradeEmojis = {
    'LEVEL1': '🥉',
    'LEVEL2': '🥈',
    'LEVEL3': '🥇',
    'LEVEL4': '💎',
    'LEVEL5': '🌟',
    'LEVEL6': '👑'
  };

const PointInfoModal = ({ show, onHide, memId }) => {
    const [pointInfo, setPointInfo] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (show && memId) {
            fetchPointInfo();
            fetchPointHistory(1);
        }
    }, [show, memId]);

    const fetchPointInfo = async () => {
        try {
            const response = await axios.get(`/api/point/info/${memId}`);
            setPointInfo(response.data);
            setError(null);
        } catch (error) {
            console.error('포인트 정보 조회 실패:', error);
            setError('포인트 정보를 불러오는 중 문제가 발생했습니다.');
        }
    };

    const fetchPointHistory = async (page) => {
        try {
            const response = await axios.get(`/api/point/history/${memId}?page=${page}&size=4`);
            setPointHistory(response.data.history);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('포인트 히스토리 조회 실패:', error);
            setError('포인트 히스토리를 불러오는 중 문제가 발생했습니다.');
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchPointHistory(pageNumber);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" className="point-info-modal">
            <Modal.Header closeButton>
                <Modal.Title>포인트 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error ? (
                    <p className="text-danger">{error}</p>
                ) : pointInfo ? (
                    <div>
                        <p>포&nbsp;&nbsp;인&nbsp;&nbsp;트&nbsp;:&nbsp;&nbsp; {pointInfo.usedPoint}</p>
                        <p>회원등급&nbsp;:&nbsp;&nbsp; {pointInfo.grade} {gradeEmojis[pointInfo.grade]}</p>
                        <h5>포인트내역</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>날&nbsp;&nbsp;&nbsp;&nbsp;짜</th>
                                    <th>변&nbsp;&nbsp;&nbsp;&nbsp;동</th>
                                    <th>사&nbsp;&nbsp;&nbsp;&nbsp;유</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pointHistory.map((history, index) => (
                                    <tr key={index}>
                                        <td>{new Date(history.changeDate).toLocaleString()}</td>
                                        <td>{history.pointChange > 0 ? `+${history.pointChange}` : history.pointChange}</td>
                                        <td>{history.changeReason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination>
                            {[...Array(totalPages).keys()].map((number) => (
                                <Pagination.Item
                                    key={number + 1}
                                    active={number + 1 === currentPage}
                                    onClick={() => handlePageChange(number + 1)}
                                >
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                ) : (
                    <p>포인트 정보를 불러오는 중...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫&nbsp;&nbsp;기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PointInfoModal;
