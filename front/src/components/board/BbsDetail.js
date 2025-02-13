import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from '../login/context/AuthContext';
import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function BbsDetail() {
    const [board, setBoard] = useState({});
    const { boardno } = useParams(); // 파라미터 가져오기
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useContext(AuthContext);
    const [maxBoardNo, setMaxBoardNo] = useState(null); 

    // token에서 memId와 role 가져오기
    const getTokenData = (token) => {
        if (token) {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return { memId: decodedPayload.sub, role: decodedPayload.role };
        }
        return { memId: null, role: null };
    };

    const { memId, role } = getTokenData(token);

    const getBbsDetail = async () => {
        try {
            const response = await axios.get(`/board/${boardno}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { readerId: memId || "" }
            });
            setBoard(response.data.board);
        } catch (err) {
            console.log("[BbsDetail.js] getBbsDetail() error :<", err);
        }
    };

    const deleteBoard = async () => {
        const confirmed = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            const response = await axios.get(`/board/delete/${boardno}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.deletedRecordCount === 1) {
                alert("게시글이 삭제되었습니다.");
                const page = new URLSearchParams(location.search).get("page") || 1;
                navigate(`/board/list?page=${page}`);
            }
        } catch (err) {
            console.log("[BbsDetail.js] deleteBbs() error :<", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const renderContentWithLinks = (content) => {
        if (!content) return '';
    
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);
    
        return parts.map((part, index) => (
            urlRegex.test(part)
                ? `<a key=${index} href="${part}" target="_blank" rel="noopener noreferrer">${part}</a>`
                : part
        )).join('');
    };

    const getMaxBoardNo = async () => {
        try {
            const response = await axios.get(`/board/maxBoardNo`);
            setMaxBoardNo(response.data.maxBoardNo);
        } catch (err) {
            console.log("[BbsDetail.js] getMaxBoardNo() error :<", err);
        }
    };

    useEffect(() => {
        getBbsDetail();
        getMaxBoardNo();
    }, [boardno]); // boardno가 변경될 때마다 호출

    const updateBoard = {
        boardno: board.boardno,
        memId: board.memId,
        title: board.title,
        content: board.content
    };

    const parentBbs = {
        memId: board.memId,
        title: board.title,
        content: board.content,
        category: board.category,
        urlFile: board.urlFile
    };

    const goBackToList = () => {
        const page = new URLSearchParams(location.search).get("page") || 1;
        navigate(`/board/list?page=${page}`);
    };

    return (
        <div>
            <div className="my-3 d-flex justify-content-between">
                <div>
                    {parseInt(boardno) > 1 && (
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => navigate(`/board/${parseInt(boardno) - 1}`)}
                        >이전글</button>
                    )} &nbsp;
                    {maxBoardNo && parseInt(boardno) < maxBoardNo && (
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => navigate(`/board/${parseInt(boardno) + 1}`)}
                        >다음글</button>
                    )}
                </div>

                <div>
                    <Link className="btn btn-outline-secondary" to={{ pathname: `/board/answer/${board.boardno}` }} state={{ parentBbs }}>
                        <i className="fas fa-pen"></i> 답글쓰기
                    </Link> &nbsp;

                    {(memId === board.memId || role === "ADMIN") && (
                        <>
                            <Link className="btn btn-outline-secondary" to={{ pathname: `/board/update/${board.boardno}` }} state={{ board: updateBoard }}>
                                <i className="fas fa-edit"></i> 수정
                            </Link> &nbsp;
                            <button className="btn btn-outline-danger" onClick={deleteBoard}>
                                <i className="fas fa-trash-alt"></i> 삭제
                            </button>
                        </>
                    )}
                </div>
            </div>

            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: '10%', padding: '15px' }}>작성자</th>
                        <td style={{ textAlign: 'center', width: '30%', padding: '15px' }}>{board.memId}🌳</td>
                        <th style={{ width: '10%', padding: '15px' }}>작성일</th>
                        <td style={{ width: '10%', padding: '15px' }}>{formatDate(board.created)}</td>
                        <th style={{ width: '10%', padding: '15px' }}>조회수</th>
                        <td style={{ width: '10%', padding: '15px' }}>{board.hitcount}</td>
                    </tr>

                    <tr>
                        <th style={{ width: '10%', padding: '15px' }}>제목</th>
                        <td style={{ textAlign: 'left', width: '60%', padding: '15px' }} colSpan="5"><span style={{ color: 'gray' }}>[{board.category}]</span>&ensp;
                        <span style={{ fontWeight: 'bold' }}>{board.title}</span></td>
                    </tr>

                    <tr>
                        <th style={{ width: '10%', verticalAlign: 'middle' }}>내용</th>
                        <td colSpan="5" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            {board.urlFile && (
                                <div>
                                    <img 
                                        src={board.urlFile} 
                                        alt="첨부된 이미지" 
                                        style={{ maxWidth: "60%", marginTop: "20px", marginBottom: "20px" }}
                                    />
                                </div>
                            )}
                            <div 
                                dangerouslySetInnerHTML={{ __html: renderContentWithLinks(board.content) }} 
                                style={{ marginTop: "20px", marginBottom: "20px" }} 
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="my-3 d-flex justify-content-center">
                <button className="btn btn-outline-secondary" onClick={goBackToList}>
                    <i className="fas fa-list"></i> 글목록
                </button>
            </div><br/><br/>

            {memId && <CommentWrite boardno={boardno} />}
            <CommentList boardno={boardno} /> {/* boardno를 전달하여 댓글이 맞춰져 불러오게 함 */}
        </div>
    );
}

export default BbsDetail;
