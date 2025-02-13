package com.zd.back.board.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zd.back.board.model.Board;
import com.zd.back.board.model.request.BbsListRequest;
import com.zd.back.board.model.request.CreateBbsRequest;
import com.zd.back.board.model.request.UpdateBbsRequest;
import com.zd.back.board.model.response.BbsListResponse;
import com.zd.back.board.model.response.BbsResponse;
import com.zd.back.board.model.response.CreateBbsResponse;
import com.zd.back.board.model.response.DeleteBbsResponse;
import com.zd.back.board.model.response.UpdateBbsResponse;
import com.zd.back.board.service.BoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    @Autowired
    final BoardService boardService;

    @PostMapping("/write")
    @Transactional
    public ResponseEntity<?> writeBoard(@ModelAttribute Board board) throws Exception {
        
        boardService.writeBoard(board);

        Map<String, Object> map = new HashMap<>();
        map.put("boardno", board.getBoardno());
        map.put("message", "글이 등록되었습니다.");
        return ResponseEntity.ok(map);
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("boardno") int boardno) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어 있습니다.");
        }

        try {
            boardService.saveFile(file, boardno);
            return ResponseEntity.ok("파일 업로드 완료!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패: " + e.getMessage());
        }
    }

	@GetMapping("/list")
    public ResponseEntity<BbsListResponse> getBoardList(@ModelAttribute BbsListRequest req, 
                                                        @RequestParam(value = "memId", required = false) String memId) {
        // 요청 객체에 memId 설정
        req.setMemId(memId);  
        return ResponseEntity.ok(boardService.getBoardList(req));
    }

    @GetMapping("/{boardno}")
	public ResponseEntity<BbsResponse> getBoard(@PathVariable int boardno, @RequestParam String readerId) throws Exception {

		return ResponseEntity.ok(boardService.getBoard(boardno, readerId));
	}

	@PostMapping("/update/{boardno}")
	public ResponseEntity<UpdateBbsResponse> updateBoard(@PathVariable int boardno, @RequestBody UpdateBbsRequest req) {

		return ResponseEntity.ok(boardService.updateBoard(boardno, req));
	}

    @GetMapping("/delete/{boardno}")
	public ResponseEntity<DeleteBbsResponse> deleteBoard(@PathVariable int boardno) {

		return ResponseEntity.ok(boardService.deleteBoard(boardno));
	}

    @PostMapping("/{parentno}/answer")
	public ResponseEntity<CreateBbsResponse> createBbsAnswer(@PathVariable int parentno, @RequestBody CreateBbsRequest req) {

		return ResponseEntity.ok(boardService.createBbsAnswer(parentno, req));
	}
	
	@GetMapping("/maxBoardNo")
    public Map<String, Integer> getMaxBoardNo() {
        int maxBoardNo = boardService.getMaxBoardNo();
        Map<String, Integer> response = new HashMap<>();
        response.put("maxBoardNo", maxBoardNo);
        return response;
    }

}
