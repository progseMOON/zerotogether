import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import { AuthContext } from '../login/context/AuthContext';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function BbsUpdate() {
    const { headers } = useContext(HttpHeadersContext);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const location = useLocation();
    const { board } = location.state;

    const [title, setTitle] = useState(board.title);
    const [content, setContent] = useState(board.content);

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
    const changeContent = (value) => setContent(value); // ReactQuill의 onChange 핸들러

    const updateBoard = async () => {
        const req = {
            memId: memId || '',  // 토큰에서 가져온 memId 사용
            title: title, 
            content: content
        };

        try {
            const resp = await axios.post(`/board/update/${board.boardno}`, req, { headers });
            console.log("[BbsUpdate.js] updateBoard() success :D");

            if (resp.data.updatedRecordCount === 1) {
                alert("게시글이 수정되었습니다.");
                navigate(`/board/${board.boardno}`); // 글 상세로 이동
            }
        } catch (err) {
            console.log("[BbsUpdate.js] updateBoard() error :<");
            console.log(err);
        }
    };

    const cancelWrite = () => {
        const confirmed = window.confirm("게시물 작성을 취소하시겠습니까?");
        if (!confirmed) return;
        navigate(-1);
    };

    return (
        <div>
            <table className="custom-table">
                <tbody>
                    <tr>
                        <th className="table-primary" style={{ textAlign: 'center'}}>작성자</th>
                        <td>
                            <input type="text" className="form-control" value={board.memId} size="50px" readOnly />
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
                        <td>
                            <ReactQuill value={content} onChange={changeContent} modules={{ toolbar: true }} theme="snow" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="my-3 d-flex justify-content-center">
                <button className="btn btn-dark" onClick={updateBoard}><i className="fas fa-pen"></i> 수정하기</button>&nbsp;
                <button className="btn btn-outline-secondary" onClick={cancelWrite}><i className="fas fa-pen"></i> 취소하기</button>
            </div>
        </div>
    );
}

export default BbsUpdate;