package com.zd.back.comment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.zd.back.board.model.request.CreateCommentRequest;
import com.zd.back.board.model.response.CreateCommentResponse;
import com.zd.back.comment.model.request.CommentRequest;
import com.zd.back.comment.model.request.UpdateCommentRequest;
import com.zd.back.comment.model.response.CommentResponse;
import com.zd.back.comment.model.response.DeleteCommentResponse;
import com.zd.back.comment.model.response.UpdateCommentResponse;
import com.zd.back.comment.service.CommentService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/comment")
@RequiredArgsConstructor
public class CommentController {
    
    @Autowired
    private final CommentService commentService;

    @PostMapping("/write")
    public ResponseEntity<CreateCommentResponse> createComment(@RequestParam int boardno,
        @RequestBody CreateCommentRequest req) {

        return ResponseEntity.ok(commentService.createComment(boardno, req));
    }

    @GetMapping("/list")
    public ResponseEntity<CommentResponse> getBbsCommentList(@ModelAttribute CommentRequest req) {

        return ResponseEntity.ok(commentService.getBbsCommentList(req));
    }

    @PostMapping("/{commentno}")
    public ResponseEntity<UpdateCommentResponse> updateComment(@RequestHeader("memId") String memId, @PathVariable int commentno, @RequestBody UpdateCommentRequest req) {

        return ResponseEntity.ok(commentService.updateComment(memId, commentno, req));
    }

    @DeleteMapping("/{commentno}")
    public ResponseEntity<DeleteCommentResponse> deleteComment(@PathVariable int commentno) {
        return ResponseEntity.ok(commentService.deleteComment(commentno));
    }
}
