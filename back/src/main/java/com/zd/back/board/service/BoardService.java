package com.zd.back.board.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.zd.back.board.mapper.BoardMapper;
import com.zd.back.board.model.Board;
import com.zd.back.board.model.param.BoardParam;
import com.zd.back.board.model.request.BbsListRequest;
import com.zd.back.board.model.request.CreateBbsRequest;
import com.zd.back.board.model.request.UpdateBbsRequest;
import com.zd.back.board.model.response.BbsListResponse;
import com.zd.back.board.model.response.BbsResponse;
import com.zd.back.board.model.response.CreateBbsResponse;
import com.zd.back.board.model.response.DeleteBbsResponse;
import com.zd.back.board.model.response.UpdateBbsResponse;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    @Autowired
    private final BoardMapper boardMapper;

	@Value("${file.upload-dir}")
    private String uploadDir;

    /* 글 추가 */
    public void writeBoard(Board board) throws Exception {
        boardMapper.insertBoard(board);
    }
    
	/* 게시글 조회 */
	public BbsListResponse getBoardList(BbsListRequest req) {
		// BbsListRequest에서 memId를 포함하여 BoardParam 객체 생성
		BoardParam param = new BoardParam(req);
		param.setBoardParam(req.getPage(), 15);
		
		// memId 추가
		param.setMemId(req.getMemId()); 
	
		// memId가 포함된 BoardParam을 사용하여 조회
		List<Board> bbsList = boardMapper.getBbsSearchPageList(param);
		int pageCnt = boardMapper.getBbsCount(param);
	
		return new BbsListResponse(bbsList, pageCnt);
	}
	

	/* 조회수 수정 */
	public BbsResponse getBoard(int boardno, String readerId) throws Exception {
		// 로그인 한 사용자의 조회수만 카운팅
		if (readerId != null && !readerId.isEmpty()) {
			BoardParam param = new BoardParam(boardno, readerId);
			int result = boardMapper.createBbsReadCountHistory(param); // 조회수 히스토리 처리 (insert: 1, update: 2)
			if (result == 1) {
				int updatedRecordCount = boardMapper.increaseBbsReadCount(boardno); // 조회수 증가
			}
		}
		return new BbsResponse(boardMapper.getBoard(boardno));
	}

	/* 글 수정 */
	public UpdateBbsResponse updateBoard(int boardno, UpdateBbsRequest req) {
		int updatedRecordCount = boardMapper.updateBoard(new BoardParam(boardno, req));
		return new UpdateBbsResponse(updatedRecordCount);
	}

	/* 게시글 삭제 */
	public DeleteBbsResponse deleteBoard(int boardno) {
		int deletedRecordCount = boardMapper.deleteBoard(boardno);
		return new DeleteBbsResponse(deletedRecordCount);
	}

	/* 답글 추가 */
	public CreateBbsResponse createBbsAnswer(int parentno, CreateBbsRequest req) {
		// 1. 부모 게시글의 step 값 업데이트
		int updatedRecordCount = boardMapper.updateBbsStep(parentno);
		int bbsAnswerCount = boardMapper.getBbsAnswerCount(parentno);
	
		if (!Objects.equals(updatedRecordCount, bbsAnswerCount)) {
			System.out.println("BbsService createBbsAnswer: Fail update parent bbs step !!");
			return null;
		}
	
		// 2. 부모 게시글의 category 값 조회
		String parentCategory = boardMapper.getCategoryByBoardno(parentno);
	
		// 3. 답글 생성을 위한 BoardParam 설정
		BoardParam param = new BoardParam(parentno, req);
		param.setCategory(parentCategory); // 부모의 category 값을 설정
	
		// 4. 답글 생성
		boardMapper.createBbsAnswer(param);
		
		return new CreateBbsResponse(param.getBoardno());
	}

	public void saveFile(MultipartFile file, int boardno) throws IOException {
        String saveFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String urlFile = "/images/imgboard/" + saveFileName; // 웹에서 접근할 수 있는 경로
        String originalFileName = file.getOriginalFilename();

		System.out.println("File Name: " + file.getOriginalFilename());
		System.out.println("File Size: " + file.getSize());
		System.out.println("Content Type: " + file.getContentType());

        // 저장할 경로
        File uploadFile = new File(uploadDir + "\\" + saveFileName);
        file.transferTo(uploadFile);

        Board board = new Board();
        board.setBoardno(boardno);
        board.setSaveFileName(saveFileName);
        board.setOriginalFileName(originalFileName);
        board.setUrlFile(urlFile);

        boardMapper.updateFileDetails(board);
    }

	public int getMaxBoardNo() {
        return boardMapper.findMaxBoardNo();
    }
	
}
