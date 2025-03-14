package com.zd.back.board.model.param;

import com.zd.back.board.model.request.BbsListRequest;
import com.zd.back.board.model.request.CreateBbsRequest;
import com.zd.back.board.model.request.UpdateBbsRequest;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok이 자동으로 getter, setter, toString, equals, hashCode 생성
@NoArgsConstructor
public class BoardParam {

    // 페이징 관련 필드
    private int pageStart;
    private int pageEnd;

    // 게시글 관련 필드
    private int boardno;
    private int parentno;
    private String memId;
    private String title;
    private String content;
    private String category;
    
    // 검색 관련 필드
    private String choice;
    private String search;
    private int page;

    // 게시글 조회 시 필요한 필드
    private int bbsno; // 게시글 번호
    private String readerId; // 게시글 조회자 아이디

    // 생성자: BbsCountParam (검색을 위한 생성자)
    public BoardParam(BbsListRequest req) {
        this.choice = req.getChoice();
        this.search = req.getSearch();
        this.page = req.getPage();
        this.category = req.getCategory(); 
    }

    // 생성자: BbsListParam (페이징 및 검색을 위한 생성자)
    public BoardParam(BbsListRequest req, int page) {
        this.choice = req.getChoice();
        this.search = req.getSearch();
        this.page = page;
        setBoardParam(page, 10); // 예시로 itemCount를 10으로 설정
    }

    // 생성자: CreateBbsAnswerParam (답글 작성에 필요한 생성자)
    public BoardParam(int parentno, CreateBbsRequest req) {
        this.parentno = parentno;
        this.memId = req.getMemId();
        this.title = req.getTitle();
        this.content = req.getContent();
    }

    // 생성자: CreateBbsParam (새 게시글 작성에 필요한 생성자)
    public BoardParam(CreateBbsRequest req) {
        this.memId = req.getMemId();
        this.title = req.getTitle();
        this.content = req.getContent();
    }

    // 생성자: CreateReadCountParam (게시글 조회 시 필요한 생성자)
    public BoardParam(int bbsno, String readerId) {
        this.bbsno = bbsno;
        this.readerId = readerId;
    }

    // 생성자: UpdateBbsParam (게시글 수정에 필요한 생성자)
    public BoardParam(int boardno, UpdateBbsRequest req) {
        this.boardno = boardno;
        this.title = req.getTitle();
        this.content = req.getContent();
    }

    // 페이지 설정 메서드
    public void setBoardParam(int page, int itemCount) {
        page -= 1;
        this.pageStart = page * itemCount + 1;
        this.pageEnd = (page + 1) * itemCount;
    }
}
    
