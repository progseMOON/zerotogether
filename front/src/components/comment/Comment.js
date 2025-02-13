import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../login/context/AuthContext';

function Comment(props) {
	const comment = props.obj;
	const boardno = props.boardno;
	const navigate = useNavigate();
	const { token } = useContext(AuthContext);

	const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
	const [content, setContent] = useState(comment.content);

	// token에서 memId와 role 추출
	const getTokenData = (token) => {
		if (token) {
			const payloadBase64 = token.split('.')[1];
			const decodedPayload = JSON.parse(atob(payloadBase64));
			return { memId: decodedPayload.sub, role: decodedPayload.role };
		}
		return { memId: null, role: null };
	};

	const { memId, role } = getTokenData(token);

	const headers = token ? { Authorization: `Bearer ${token}`, memId: memId } : {};

	const changeContent = (event) => setContent(event.target.value);

	/* 댓글 수정 */
	const updateComment = async () => {
		const req = { content };
		
		try {
			const resp = await axios.post(`/comment/${comment.commentno}?boardno=${comment.boardno}`, req, { headers });
			console.log("[Comment.js] updateComment() success :D", resp.data);
			
			if (resp.data.updatedContent) {
				setContent(resp.data.updatedContent); // 서버가 반환한 업데이트된 내용으로 설정
			} else {
				setContent(content); // 만약 updatedContent가 없으면 기존 내용으로 유지
			}
			alert("댓글이 수정되었습니다.");
			setIsEditing(false); // 수정 모드 종료
		} catch (err) {
			console.error("[Comment.js] updateComment() error :<", err);
			alert(err.response?.data || "댓글 수정 중 오류가 발생하였습니다.");
		}
	};

	/* 댓글 삭제 */
	const deleteComment = async () => {
		const confirmed = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
		if (!confirmed) return;
	
		try {
			const headers = { Authorization: `Bearer ${token}` };
			const resp = await axios.delete(`/comment/${comment.commentno}`, { headers });
			console.log("[Comment.js] deleteComment() success :D", resp.data);
	
			if (resp.data.deletedRecordCount === 1) {
				alert("댓글이 삭제되었습니다.");
				navigate(0); // 페이지 새로고침
			}
		} catch (err) {
			console.error("[Comment.js] deleteComment() error :<", err);
			alert("댓글 삭제 중 오류가 발생했습니다.");
		}
	};

	return (
		<div className="d-flex justify-content-center">
			<div className="comment-container p-3 mb-3 rounded">
				{/* 상단 영역: 프로필 이미지와 사용자 ID, 시간, 수정/삭제 버튼 */}
				<div className="d-flex align-items-center justify-content-between mb-1">
					<div className="d-flex align-items-center">
						{/* 프로필 이미지 */}
						<img src="/images/profile-placeholder.png" alt="프로필 이미지" className="profile-img me-3" style={{ width: '30px', height: '30px', borderRadius: '50%' }}/>
						{/* 사용자 ID와 시간 */}
						<span className="comment-id" style={{fontWeight:600}}>{comment.memId}</span>&nbsp;&nbsp;
						<span className="comment-date ms-2">
							{new Date(comment.created).toLocaleDateString()} {new Date(comment.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
						</span>
					</div>
					{/* 수정/삭제 버튼 */}
					{(memId === comment.memId || role === "ADMIN") && (
						<div>
							<button className="btn btn-sm btn-link" onClick={() => setIsEditing(!isEditing)}>
								{isEditing ? "취소" : "수정"}
							</button>&nbsp;
							<button className="btn btn-sm btn-link text-danger" onClick={deleteComment}>
								삭제
							</button>
						</div>
					)}
				</div>

				{/* 댓글 내용 or 수정 텍스트 */}
				{isEditing ? (
					<div className="mt-2">
						<textarea
							className="form-control"
							rows="2"
							value={content}
							onChange={changeContent}
						></textarea>
						<div className="d-flex justify-content-end">
							<button className="btn btn-dark btn-sm mt-2" onClick={updateComment}>
								수정 완료
							</button>&nbsp;
						</div>
					</div>
				) : (
					<div className="comment-text">
						{content}
					</div>
				)}
			</div>
		</div>
	);
}

export default Comment;
