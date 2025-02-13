import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../login/context/AuthContext';

import './comment.css';

function CommentWrite(props) {
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();
	const boardno = props.boardno;
	const [content, setContent] = useState("");

	// token에서 memId 추출
	const getMemIdFromToken = (token) => {
		if (token) {
			const payloadBase64 = token.split('.')[1];
			const decodedPayload = JSON.parse(atob(payloadBase64));
			return decodedPayload.sub;
		}
		return null;
	};

	const memId = getMemIdFromToken(token);

	const changeContent = (event) => setContent(event.target.value);

	const createComment = async () => {
		if (!content) {
			alert("댓글 내용을 입력해 주세요.");
			return;
		}
	
		if (!token) {
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}
	
		const req = {
			memId: memId,
			content: content,
		};
	
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			};
	
			// `boardno`를 URL 쿼리 파라미터로 전달
			const resp = await axios.post(
				`/comment/write?boardno=${boardno}`,
				req, // JSON 형식으로 전송
				{ headers }
			);
	
			console.log("[CommentWrite.js] createComment() success :D");
	
			if (resp.data.boardno != null) {
				alert("댓글이 등록되었습니다.");
				navigate(0);
			}
		} catch (err) {
			console.log("[CommentWrite.js] createComment() error :<");
			console.log(err.response ? err.response.data : err.message); // 오류 메시지 확인
		}
	};

	const handleKeyDown = (event) => {
        if (event.key === 'Enter') createComment();
    };

	return (
		<div className="comment-section mx-auto">
			{/* 프로필 이미지와 아이디, 댓글 추가 버튼 */}
			<div className="d-flex align-items-center justify-content-between mb-2">
				<div className="d-flex align-items-center">
					<img src="/images/profile-placeholder.png" alt="프로필 이미지" className="profile-img me-3" style={{ width: '30px', height: '30px', borderRadius: '50%' }}/>
					<span className="comment-id">{memId}</span>
				</div>
				<button className="btn btn-outline-secondary" onClick={createComment}>
					<i className="fas fa-comment-dots"></i> 댓글 등록
				</button>
			</div>

			{/* 댓글 입력 창 */}
			<div className="d-flex align-items-center">
				<input
					type="text"
					className="form-control"
					value={content}
					onChange={changeContent}
					placeholder="댓글을 남겨주세요"
					style={{ flex: 1 }}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</div>

	);
}

export default CommentWrite;
