import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import { AuthContext } from '../login/context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BbsWrite() {
	const { headers } = useContext(HttpHeadersContext);
	const navigate = useNavigate();
	const { token } = useContext(AuthContext);
	
	const [title, setTitle] = useState("");
	const [content, setContent] = useState(""); // ReactQuill을 위한 content 상태
	const [category, setCategory] = useState("");
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);

	// token에서 memId 가져오기
	const getMemIdFromToken = (token) => {
		if (token) {
			const payloadBase64 = token.split('.')[1];
			const decodedPayload = JSON.parse(atob(payloadBase64));
			return decodedPayload.sub; // sub 필드를 memId로 사용
		}
		return null;
	};

	const memId = getMemIdFromToken(token);

	const changeTitle = (event) => setTitle(event.target.value);
	const changeContent = (value) => setContent(value); // ReactQuill에서는 event가 아닌 value를 사용
	const changeCategory = (event) => setCategory(event.target.value);
	const handleFileChange = (event) => setFile(event.target.files[0]);

	const uploadFile = async (boardno) => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("boardno", boardno);

		setLoading(true);
		try {
			await axios.post("/board/uploadFile", formData, {
				headers: {
					...headers,
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("[BbsWrite.js] uploadFile() success :D");
		} catch (err) {
			console.log("[BbsWrite.js] uploadFile() error :<");
			alert("파일 업로드에 실패했습니다: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	// 로그인 상태 확인
	useEffect(() => {
		if (!memId) {
			alert("로그인 한 사용자만 게시글을 작성할 수 있습니다!");
			navigate("/mainpage");
		}
	}, [memId, navigate, token]);

	// 게시글 작성
	const insertBoard = async () => {
		if (!category) {
			alert("카테고리를 선택해 주세요.");
			return;
		}

		if (!title) {
			alert("제목을 입력해 주세요.");
			return;
		}
		
		if (!content) {
			alert("내용을 입력해 주세요.");
			return;
		}

		const formData = new FormData();
		formData.append("memId", memId || '');  // 토큰에서 가져온 memId 사용
		formData.append("category", category);
		formData.append("title", title);
		formData.append("content", content); // content에 ReactQuill의 값 추가

		setLoading(true);
		try {
			const resp = await axios.post("/board/write", formData, {
				headers: {
					...headers,
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("[BbsWrite.js] insertBoard() success :D");
			const boardno = resp.data.boardno;

			await uploadFile(boardno);
			alert("게시글이 등록되었습니다.");
			navigate(`/board/${boardno}`);
		} catch (err) {
			console.log("[BbsWrite.js] insertBoard() error :<");
			alert("게시글 등록에 실패했습니다: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	const cancelWrite = () => {
		const confirmed = window.confirm("게시물 작성을 취소하시겠습니까?");
		if (!confirmed) return;
		navigate("/board/list");
	};

	return (
		<div>
			<table className="custom-table">
				<tbody>
					<tr>
						<th className="table-primary" style={{ textAlign: 'center'}}>작성자</th>
						<td>
							<input type="text" className="form-control" value={memId || ''} size="50px" readOnly />
						</td>
					</tr>
					<tr>
						<th className="table-primary" style={{ textAlign: 'center'}}>정보유형</th>
						<td>
							<select value={category} onChange={changeCategory} className="form-control">
								<option value="">정보 유형을 선택하세요</option>
								<option value="제로웨이스트 실천 팁">제로웨이스트 실천 팁</option>
								<option value="재활용 정보 및 가이드">재활용 정보 및 가이드</option>
								<option value="대체용품 사용후기">대체용품 사용후기</option>
								<option value="기타">기타</option>
							</select>
						</td>
					</tr>
					<tr>
						<th className="table-primary" style={{ textAlign: 'center'}}>제목</th>
						<td>
							<input type="text" className="form-control" value={title} onChange={changeTitle} size="50px" />
						</td>
					</tr>
					<tr>
						<th className="table-primary" style={{ textAlign: 'center'}}>내용</th>
						<td style={{ padding: '0', verticalAlign: 'top', height: '400px' }}> {/* 테이블 셀 높이 조정 */}
    <ReactQuill
        value={content}
        onChange={changeContent}
        modules={{
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['clean']
            ],
        }}
        style={{ height: '350px', overflowY: 'auto' }} // 편집기 높이 조정
    />
</td>

					</tr>
					<tr>
						<th className="table-primary" style={{ textAlign: 'center'}}>파일 업로드</th>
						<td>
							<input type="file" onChange={handleFileChange} />
						</td>
					</tr>
				</tbody>
			</table>

			<div className="my-5 d-flex justify-content-center">
				<button className="btn btn-dark" onClick={insertBoard} disabled={loading}>
					<i className="fas fa-pen"></i> {loading ? "등록 중..." : "등록하기"}
				</button>&nbsp;
				<button className="btn btn-outline-secondary" onClick={cancelWrite}>
					<i className="fas fa-pen"></i> 취소하기
				</button>
			</div>
		</div>
	);
}

export default BbsWrite;
