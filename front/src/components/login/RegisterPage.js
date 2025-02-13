import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MemberForm from './MemberForm';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const RegisterPage = () => {
    const [terms, setTerms] = useState('');
    const [privacy, setPrivacy] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        fetchTerms();
        fetchPrivacy();
    }, []);

    const fetchTerms = async () => {
        try {
            const response = await axios.get('/member/terms');
            setTerms(response.data);
        } catch (error) {
            console.error('이용약관을 불러오는 중 오류 발생:', error);
        }
    };

    const fetchPrivacy = async () => {
        try {
            const response = await axios.get('/member/privacy');
            setPrivacy(response.data);
        } catch (error) {
            console.error('개인정보 동의서를 불러오는 중 오류 발생:', error);
        }
    };

    const handleRegisterSuccess = async (memberData) => {
        if (!memberData || typeof memberData !== 'object') {
            alert('회원가입 중 오류가 발생했습니다.');
            return;
        }

        alert('회원가입이 성공적으로 완료되었습니다.');
        navigate('/mainpage');
    };

    const handleRegisterCancel = () => {
        navigate('/mainpage');
    };

    return (
        <div className="container mt-4">
            <MemberForm
                onSubmit={handleRegisterSuccess}
                onCancel={handleRegisterCancel}
                isEditing={false}
                termsContent={terms}
                privacyContent={privacy}
            />
        </div>
    );
};

export default RegisterPage;
