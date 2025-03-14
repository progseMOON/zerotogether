import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Pagination, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import './PointInfoModal.css';

ReactQuill.Quill.register('modules/imageResize', ImageResize);

const AdminPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // 회원 목록 관련 상태
  const [members, setMembers] = useState([]);
  const [memberCurrentPage, setMemberCurrentPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pointAmount, setPointAmount] = useState('');
  const [pointOperation, setPointOperation] = useState('add');
  const pageSize = 10;

  // 공지사항 목록 관련 상태
  const [notices, setNotices] = useState([]);
  const [noticeCurrentPage, setNoticeCurrentPage] = useState(1);
  const [noticeTotalPages, setNoticeTotalPages] = useState(0);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [currentNotice, setCurrentNotice] = useState({ title: '', content: '' });
  const [noticeOperation, setNoticeOperation] = useState('create');

  // 퀴즈 파일 경로 상태
  const [quizFilePath, setQuizFilePath] = useState('');

// 퀴즈 입력을 백엔드로 전송하는 함수
const handleQuizFileSubmit = async () => {
  // 파일 경로가 비어 있거나 파일명이 입력되지 않았으면 에러 처리
  if (!quizFilePath || quizFilePath.trim() === '') {
    alert('파일명을 입력해 주세요.');
    return;
  }

  // 파일명이 올바르게 입력되었는지 확인 (파일 경로가 아닌 그냥 파일명만)
  const fileName = quizFilePath.trim();  // 공백을 제거한 후 파일명만 사용
  if (fileName === '') {
    alert('파일명을 입력해 주세요.');
    return;
  }

  try {
    // 입력받은 파일 경로를 서버에 전송
    await axios.get('/quiz.action', {
      params: { filename: fileName }
    });
    alert('퀴즈 파일이 성공적으로 전송되었습니다.');
  } catch (error) {
    if (error.response.status === 404) {
      // 404 에러 처리
      alert('파일을 찾을 수 없습니다. 파일명을 확인해 주세요.');
    }
    console.error('퀴즈 파일 전송 중 오류 발생:', error);
    alert('퀴즈 파일 전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
  } 

};

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    imageResize: {
      parchment: ReactQuill.Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  };

  // 회원 목록 불러오기 함수
  const fetchMembers = async () => {
    try {
      const response = await axios.get('/member/admin/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { searchTerm, page: memberCurrentPage, limit: pageSize }
      });
      setMembers(response.data.members);
      setMemberTotalPages(Math.ceil(response.data.totalCount / pageSize));
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // 공지사항 목록 불러오기 함수
  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/notices', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: noticeCurrentPage, limit: pageSize }
      });
      setNotices(response.data.notices);
      setNoticeTotalPages(Math.ceil(response.data.totalCount / pageSize));
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error);
    }
  };

  // 페이지 로드 시 데이터 불러오기
  useEffect(() => {
    fetchMembers();
    fetchNotices();
  }, [memberCurrentPage, noticeCurrentPage]);

  // 검색 처리 함수
  const handleSearch = (e) => {
    e.preventDefault();
    setMemberCurrentPage(1);
    fetchMembers();
  };

  // 역할 변경 처리 함수
  const handleRoleChange = async (memId, newRole) => {
    try {
      await axios.post('/member/admin/change-role', null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { memId, role: newRole }
      });
      alert(`회원 ${memId}의 역할이 ${newRole}로 변경되었습니다.`);
      fetchMembers(memberCurrentPage);
    } catch (error) {
      console.error('Error changing role:', error);
      alert('역할 변경 중 오류가 발생했습니다.');
    }
  };

  // 회원 삭제 처리 함수
  const handleDeleteMember = async (memId) => {
    if (window.confirm('이 회원을 정말로 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`/member/admin/${memId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          alert('회원이 성공적으로 삭제되었습니다.');
          fetchMembers();
        }
      } catch (error) {
        console.error('회원 삭제 중 오류 발생:', error);
        alert('회원 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  // 포인트 관리 모달 열기
  const openPointModal = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  // 포인트 관리 처리 함수
  const handlePointSubmit = async () => {
    try {
      await axios.post('/member/admin/manage-points', null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { memId: selectedMember.memId, points: pointAmount, operation: pointOperation }
      });
      setShowModal(false);
      alert(`회원 ${selectedMember.memId}의 포인트가 ${pointOperation === 'add' ? '추가' : '차감'}되었습니다.`);
      fetchMembers(memberCurrentPage);
    } catch (error) {
      console.error('Error managing points:', error);
      alert('포인트 관리 중 오류가 발생했습니다.');
    }
  };

  // 공지사항 본문 에디트 추가
  const handleContentChange = (content) => {
    setCurrentNotice({...currentNotice, content: content});
  };

  // 공지사항 모달 열기
  const openNoticeModal = (operation, notice = { title: '', content: '' }) => {
    setNoticeOperation(operation);
    setCurrentNotice(notice);
    setShowNoticeModal(true);
  };

  // 공지사항 저장 처리 함수
  const handleSaveNotice = async () => {
    try {
      if (noticeOperation === 'create') {
        await axios.post('/api/notices', currentNotice, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        alert('새 공지사항이 성공적으로 작성되었습니다.');
      } else {
        await axios.put(`/api/notices/${currentNotice.noticeId}`, currentNotice, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        alert('공지사항이 성공적으로 수정되었습니다.');
      }
      setShowNoticeModal(false);
      fetchNotices();
    } catch (error) {
      console.error('공지사항 저장 실패:', error);
      alert('공지사항 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 공지사항 삭제 처리 함수
  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('이 공지사항을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/notices/${noticeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('공지사항이 성공적으로 삭제되었습니다.');
        fetchNotices();
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        alert('공지사항 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="container mt-5">
      {/* 공지사항 관리 */}
      <h2 className="mt-4" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '700', color: '#353535' }}>공지사항 관리</h2>
      <Button onClick={() => openNoticeModal('create')} className="mb-3">새 공지사항 작성하기</Button>
      <Table striped bordered hover className="table table-bordered">
        <thead>
          <tr>
            <th>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</th>
            <th>작&nbsp;성&nbsp;일</th>
            <th>조&nbsp;회&nbsp;수</th>
            <th>관&nbsp;리&nbsp;기&nbsp;능</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(notice => (
            <tr key={notice.noticeId}>
              <td>{notice.title}</td>
              <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
              <td>{notice.views}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => openNoticeModal('edit', notice)} className="me-2">글수정</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteNotice(notice.noticeId)}>글삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {[...Array(noticeTotalPages).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === noticeCurrentPage} onClick={() => setNoticeCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
<hr/>
      {/* 회원 관리 */}
      <h2 className="mt-4" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '700', color: '#353535' }}>회원관리 목록</h2>
      <Form onSubmit={handleSearch} className="mb-3">
        <div className="d-flex">
          <Form.Control
            type="text"
            placeholder="ID, 이름, 이메일 중 하나 입력하여 검색 가능"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
            style={{ width: '75%' }}
          />
          <Button type="submit" style={{ width: '25%' }}>검&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;색</Button>
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>회&nbsp;원&nbsp;I&nbsp;D</th>
            <th>이&nbsp;&nbsp;&nbsp;&nbsp;름</th>
            <th>이&nbsp;메&nbsp;일</th>
            <th>전화번호</th>
            <th>역할변경</th>
            <th>관리기능</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.memId}>
              <td>{member.memId}</td>
              <td>{member.memName}</td>
              <td>{member.email}</td>
              <td>{member.tel}</td>
              <td>
                <Form.Select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.memId, e.target.value)}
                  className="text-center"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => openPointModal(member)} className="me-2">포인트조정</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteMember(member.memId)}>계정삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {[...Array(memberTotalPages).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === memberCurrentPage} onClick={() => setMemberCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      <hr/>
      <div style={{
      border: '1px solid #D3D3D3',  // 연한 회색 테두리 추가
      display: 'flex',               // flexbox로 자식 요소들을 배치
      flexDirection: 'column',       // 세로 방향으로 배치
      justifyContent: 'center',      // 세로로 중앙 정렬
      alignItems: 'center',          // 가로로 중앙 정렬
      padding: '20px',               // padding 추가하여 여백 확보
      height: '150px',               // 높이를 설정해줘서 중앙 정렬이 잘 되게 함

    }}>
      <div>
        <h2 style={{
          fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif',
          fontWeight: '700',
          color: '#353535'
        }}>
          퀴즈 데이터 업데이트
        </h2>
      </div>
      <div style={{
        width:'70%',
        display: 'flex',               // flexbox로 자식 요소들을 배치
        justifyContent: 'center',      // 세로로 중앙 정렬
        alignItems: 'center',          // 가로로 중앙 정렬
        }}>
        <input
          type="text"
          placeholder='C:/quiz/"파일명을 입력해주세요".json'
          value={quizFilePath}
          onChange={(e) => setQuizFilePath(e.target.value)}
          style={{
            border: '1px solid #D3D3D3',
            width: '65%',  // 인풋박스 너비를 늘림 (필요에 맞게 조정)
            padding: '8px',
            fontSize: '16px',
            borderRadius: '4px',
            
          }}
        />
        &nbsp;&nbsp;
        <Button onClick={handleQuizFileSubmit} className="mt-2">
          퀴즈 파일 전송
        </Button>
      </div>
    </div>
      {/* 포인트 관리 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="point-info-modal">
        <Modal.Header closeButton>
          <Modal.Title>포인트 조정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>조정 포인트</Form.Label>
              <Form.Control
                type="number"
                value={pointAmount}
                onChange={(e) => setPointAmount(e.target.value)}
                placeholder='숫자를 입력하세요'
              />
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>적용유형</Form.Label>
              <Form.Select
                value={pointOperation}
                onChange={(e) => setPointOperation(e.target.value)}
              >
                <option value="add">포인트추가</option>
                <option value="subtract">포인트차감</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취&nbsp;&nbsp;소
          </Button>
          <Button variant="primary" onClick={handlePointSubmit}>
            저&nbsp;&nbsp;장
          </Button>
        </Modal.Footer>
      </Modal>

     {/* 공지사항 모달 */}
<Modal show={showNoticeModal} onHide={() => setShowNoticeModal(false)} className="point-info-modal  notice-modal-custom-width">
  <Modal.Header closeButton>
    <Modal.Title>{noticeOperation === 'create' ? '새 공지사항 작성' : '공지사항 수정'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</Form.Label>
        <Form.Control
          type="text"
          value={currentNotice.title}
          onChange={(e) => setCurrentNotice({...currentNotice, title: e.target.value})}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>내&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;용</Form.Label>
        <ReactQuill
          value={currentNotice.content}
          onChange={handleContentChange}
          modules={quillModules}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowNoticeModal(false)}>
      취&nbsp;&nbsp;소
    </Button>
    <Button variant="primary" onClick={handleSaveNotice}>
      저&nbsp;&nbsp;장
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default AdminPage;
