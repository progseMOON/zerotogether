package com.zd.back.notice.controller;

import com.zd.back.login.controller.MemberController;
import com.zd.back.notice.model.NoticeDTO;
import com.zd.back.notice.service.NoticeService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import net.coobird.thumbnailator.Thumbnails;
import java.io.File;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    @Autowired
    private NoticeService noticeService;

    @Value("${file.upload-dir.notices}")
    private String uploadDir;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNotice(@RequestBody NoticeDTO notice, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
            }
            notice.setAuthor(userDetails.getUsername());
            noticeService.createNotice(notice);
            return ResponseEntity.ok("공지사항이 생성되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 생성 실패: " + e.getMessage());
        }
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<?> getNotice(@PathVariable Long noticeId) {
        try {
            NoticeDTO notice = noticeService.getNotice(noticeId);
        if (notice == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(notice);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("공지사항 조회 실패: " + e.getMessage());
    }
}

    @GetMapping
    public ResponseEntity<?> getNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<NoticeDTO> notices = noticeService.getNoticesPaged(page, size);
            int totalCount = noticeService.countNotices();
            Map<String, Object> response = new HashMap<>();
            response.put("notices", notices);
            response.put("totalCount", totalCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 목록 조회 실패: " + e.getMessage());
        }
    }

    @PutMapping("/{noticeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateNotice(@PathVariable Long noticeId, @RequestBody NoticeDTO notice) {
        try {
            notice.setNoticeId(noticeId);
            noticeService.updateNotice(notice);
            return ResponseEntity.ok("공지사항이 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 수정 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/{noticeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteNotice(@PathVariable Long noticeId) {
        try {
            noticeService.deleteNotice(noticeId);
            return ResponseEntity.ok("공지사항이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공지사항 삭제 실패: " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            File outputFile = filePath.toFile();

            Thumbnails.of(file.getInputStream())
                .size(800, 600) // 원하는 크기로 조정
                .outputQuality(0.85) // 품질 설정
                .toFile(outputFile);

            String fileUrl = "/images/notices/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 업로드 실패");
        }
    }
}
