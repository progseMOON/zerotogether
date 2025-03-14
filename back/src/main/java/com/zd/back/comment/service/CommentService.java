package com.zd.back.comment.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.back.board.model.request.CreateCommentRequest;
import com.zd.back.board.model.response.CreateCommentResponse;
import com.zd.back.comment.mapper.CommentMapper;
import com.zd.back.comment.model.Comment;
import com.zd.back.comment.model.param.CommentListParam;
import com.zd.back.comment.model.param.CommentParam;
import com.zd.back.comment.model.request.CommentRequest;
import com.zd.back.comment.model.request.UpdateCommentRequest;
import com.zd.back.comment.model.response.CommentResponse;
import com.zd.back.comment.model.response.DeleteCommentResponse;
import com.zd.back.comment.model.response.UpdateCommentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    
    /* 댓글 작성 */
    public CreateCommentResponse createComment(int boardno, CreateCommentRequest req) {
        CommentParam param = new CommentParam(boardno, req);
        commentMapper.createComment(param);
        return new CreateCommentResponse(param.getCommentno());
    }

    /* 댓글 조회 */
    public CommentResponse getBbsCommentList(CommentRequest req) {
        CommentListParam param = new CommentListParam(req.getBoardno());
        param.setPageParam(req.getPage(), 5);

        List<Comment> commentList = commentMapper.getCommentPageList(param);
        int pageCnt = commentMapper.getCommentCount(req.getBoardno());

        return new CommentResponse(commentList, pageCnt);
    }

    /* 댓글 수정 */
    @Transactional
    public UpdateCommentResponse updateComment(String memId, int commentno, UpdateCommentRequest req) {
        Comment comment = commentMapper.getCommentBySeq(commentno);
        
        if (!comment.getMemId().equals(memId)) {
            System.out.println("작성자만 댓글을 수정할 수 있습니다.");
            return null;
        }

        int updatedRecordCount = commentMapper.updateComment(new CommentParam(commentno, req.getContent()));
        if (updatedRecordCount != 1) {
            System.out.println("댓글 수정에 실패했습니다.");
            return null;
        }

        return new UpdateCommentResponse(updatedRecordCount);
    }

    /* 댓글 삭제 */
    @Transactional
    public DeleteCommentResponse deleteComment(int commentno) {
        int deletedRecordCount = commentMapper.deleteComment(commentno);
        return new DeleteCommentResponse(deletedRecordCount);
    }
}
