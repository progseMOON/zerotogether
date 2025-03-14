package com.zd.back.imgboard.controller;

import com.zd.back.imgboard.model.Img;
import com.zd.back.imgboard.model.ImgBoard;
import com.zd.back.imgboard.model.ImgBoardResponse;
import com.zd.back.imgboard.model.ImgPost;
import com.zd.back.imgboard.service.ImgPostService;
import com.zd.back.imgboard.service.ImgService;
import com.zd.back.imgboard.service.ImgManagerService;
import lombok.RequiredArgsConstructor;
import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


//수정시 파일 업로드 부분 제외하고 text만 되도록 함 


@RestController
@RequestMapping("/imgboard")
@RequiredArgsConstructor  //의존성 주입 위함 
public class ImgBoardController {


    private final ImgPostService imgPostService;
    private final ImgService imgService;
    private final ImgManagerService imgManagerService;
    //파일 업로드 위한 메소드는 ImgManagerService.java로 옮김  


    @PostMapping("/created")
    @Transactional
    public ResponseEntity<String> created(@ModelAttribute ImgPost imgPost, @RequestParam("images") MultipartFile[] images) throws Exception{
        try {
           
            int maxImgPostId = imgPostService.maxImgPostId() ;
            imgPost.setImgPostId(maxImgPostId+1);
            imgPostService.createImgPost(imgPost);

            //imgManagerService 에서 받아서 list로 저장
            List<Img> imgList = imgManagerService.uploadImages(images, maxImgPostId);

            //이미지 정보 DB에 저장           
            imgService.saveImg(imgList);
            return new ResponseEntity<>("인증 게시물이 등록되었습니다.", HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("파일 저장 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<ImgBoardResponse> getImgBoards(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "8") int size) {
           
        
        List<ImgBoard> imgBoards = imgPostService.getImgBoards(page, size);
        int totalElements = imgPostService.getDataCount();
       
        ImgBoardResponse response = new ImgBoardResponse(imgBoards, totalElements);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/article")  
    public ResponseEntity<ImgBoard> getImgPostById(@RequestParam int imgPostId) {
       try{
            ImgBoard imgBoard = imgPostService.getImgPostById(imgPostId);
            if (imgBoard == null) {
                return ResponseEntity.notFound().build(); // 게시물이 없을 경우 404 반환
            }
            return ResponseEntity.ok(imgBoard); // 게시물 반환

        } catch (Exception e) {
       
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(null); // 오류 발생 시 null 반환
        } 
    }


    @GetMapping("/updated")
    public ResponseEntity<ImgBoard> getUpdatedArticle(@RequestParam int imgPostId) {

        try {
            ImgBoard imgBoard = imgPostService.getImgPostById(imgPostId);
            if (imgBoard == null) {
                return ResponseEntity.notFound().build();

            }

            return ResponseEntity.ok(imgBoard); 

        } catch (Exception e) {
               
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(null); // 오류 발생 시 null 반환
        }
    }
    
     @PostMapping("/updated")
    public ResponseEntity<String> getUpdatedArticle(@RequestParam int imgPostId,
            @ModelAttribute ImgPost imgPost) {
        try {

            // 1.imgPost update
            imgPost.setImgPostId(imgPostId);
            imgPostService.updateImgPost(imgPost);

            return ResponseEntity.ok("인증게시물이 수정되었습니다.");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("게시물 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
          
    } 


    @DeleteMapping("/deleted")
    public  ResponseEntity<String> deleteArticle(@RequestParam int imgPostId) {
        try {

            
            List<Img> images = imgService.getImagesByPostId(imgPostId); 
        
            //DB삭제 - 데이터 무결성 위해서 DB삭제 후 물리적 파일 삭제 해야함
            imgService.deleteImagesByPostId(imgPostId); // 먼저 이미지를 삭제
            
            // 물리적 파일 삭제
            for (Img img : images) {
                imgManagerService.deleteImages(img.getSaveFileName()); 
            }
        
            // 이후 게시물 삭제
            imgPostService.deleteImgPostById(imgPostId); 

            return ResponseEntity.ok("인증게시물이 삭제 되었습니다.");

        } catch (Exception e) {

            return ResponseEntity.status(500).body("게시물 삭제 중 오류가 발생했습니다: " + e.getMessage());       
        
        }
    }


 /*  ##### 인증 승인 auth 부분  -- ctrl + 클릭 하면 해당 import 된 파일로 이동함  */

    @PostMapping("/auth")
    public ResponseEntity<String> getAuthorized(@RequestParam int imgPostId){

        try{
            imgPostService.updateAuth(imgPostId);
            
            return ResponseEntity.ok("게시물 인증이 승인되었습니다.");

        }catch(Exception e){

            return ResponseEntity.status(500).body("승인 처리 중 오류가 발생했습니다: " + e.getMessage()); 
        }

    }

}    
