import axios from "axios";
import { useState, useEffect } from "react";
import Comment from "./Comment.js";

function CommentList({ boardno }) {
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    const [commentList, setCommentList] = useState([]);

    const getCommentList = async (page) => {
        try {
            const resp = await axios.get(`/comment/list`, {
                params: { "boardno": boardno, "page": page }
            });

            setCommentList((prevList) => [...prevList, ...resp.data.commentList]);
            setTotalCnt(resp.data.pageCnt);
        } catch (err) {
            console.log("[CommentList.js] getCommentList() error:", err);
        }
    };

    const loadMoreComments = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        getCommentList(nextPage);
    };

    useEffect(() => {
        // boardno가 변경될 때마다 댓글 목록을 새로 불러오고 페이지를 초기화합니다.
        setCommentList([]);
        setPage(1);
        getCommentList(1);
    }, [boardno]); // boardno가 변경될 때마다 호출

    return (
        <>
            <div className="my-1 d-flex justify-content-center">
                <br/><i className="fas fa-paperclip"></i><b>댓글 {totalCnt}</b>
            </div>

            {commentList.length === 0 ? (
                <div className="my-5 d-flex justify-content-center">
                    <span>등록된 댓글이 없습니다.</span>
                </div>
            ) : (
                commentList.map((comment, idx) => (
                    <div className="my-3 d-flex justify-content-center" key={idx}>
                        <div className="comment-box">
                            <Comment obj={comment} />
                        </div>
                    </div>
                ))
            )}

            {totalCnt > commentList.length && (
                <div className="my-3 d-flex justify-content-center">
                    <button onClick={loadMoreComments} className="more-button">
                        더보기 <span className="more-button-icon">⌵</span>
                    </button>
                </div>
            )}
        </>
    );
}

export default CommentList;
