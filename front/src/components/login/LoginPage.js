import React, { useState, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
    const [memId, setMemId] = useState('');
    const [pwd, setPwd] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/member/login', null, { params: { memId, pwd } });
            if (response.data.token && response.data.refreshToken) {
                const token = response.data.token;
                const refreshToken = response.data.refreshToken;
                if (typeof token !== 'string' || typeof refreshToken !== 'string') {
                    throw new Error('서버에서 받은 토큰 형식이 올바르지 않습니다.');
                }
                await login(token, refreshToken, memId, response.data.role);
                if (response.data.upPoint === "1") {
                    alert("출석이 인정되었습니다! +1 포인트");
                }
                if (onLoginSuccess) {
                    onLoginSuccess(token, refreshToken, memId, response.data.role);
                }
                navigate(0);
            } else {
                alert("로그인 정보가 올바르지 않습니다.");
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        alert(error.response.data.error || "아이디 또는 비밀번호가 올바르지 않습니다.");
                        break;
                    case 403:
                        alert("접근이 거부되었습니다. 권한을 확인해주세요.");
                        break;
                    case 404:
                        alert("존재하지 않는 계정입니다.");
                        break;
                    default:
                        alert("로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
                }
            } else if (error.request) {
                alert("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
            } else {
                alert("로그인 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div style={{ marginBottom: '15px', margin:'15px'}}>
            <h2>로그인</h2><br />
            <form onSubmit={handleSubmit}>
                <div className="dl-item">
                    <dt>아&nbsp;&nbsp;이&nbsp;&nbsp;디</dt>
                    <dd>
                        <input
                            type="text"
                            className="form-control"
                            value={memId}
                            onChange={(e) => setMemId(e.target.value)}
                            style={{ width: '400px' }}
                            required
                        />
                    </dd>
                </div>
                <div className="dl-item">
                    <dt>비밀번호</dt>
                    <dd>
                        <input
                            type="password"
                            className="form-control"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            style={{ width: '400px' }}
                            required
                        />
                    </dd>
                </div>
                <hr/>
                <div className="dl-item" style={{ marginBottom: '15px' }}>
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                    >
                        로그인
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
