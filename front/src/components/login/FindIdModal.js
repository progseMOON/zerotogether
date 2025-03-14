import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import './PointInfoModal.css';

const FindIdModal = ({ show, onHide }) => {
    const [email, setEmail] = useState('')
    const [result, setResult] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('/member/find-id', { email })
            .then(response => {
                if (response.data && response.data.memId) {
                    setResult(`찾은 아이디: ${response.data.memId}`);
                } else {
                    setResult('아이디를 찾을 수 없습니다.');
                }
            })
            .catch(error => {
                console.error('아이디 찾기 실패:', error)
                setResult('아이디를 찾을 수 없습니다.')
            });
    };

    return (
        <Modal show={show} onHide={onHide} className='point-info-modal'>
            <Modal.Header closeButton>
                <Modal.Title>아이디 찾기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='가입한 이메일을 입력하세요.'
                            required
                        />
                        <hr/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        아이디 찾기
                    </Button>
                </Form>
                {result && <p className="mt-3">{result}</p>}
            </Modal.Body>
        </Modal>
    );
};

export default FindIdModal;
