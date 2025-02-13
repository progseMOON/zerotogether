package com.zd.back.notice.service;

import com.zd.back.notice.mapper.NoticeMapper;
import com.zd.back.notice.model.NoticeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Transactional
    public void createNotice(NoticeDTO notice) {
        if (notice.getAuthor() == null || notice.getAuthor().isEmpty()) {
            throw new IllegalArgumentException("작성자 정보가 없습니다.");
        }
        if (notice.getTitle() == null || notice.getTitle().isEmpty()) {
            throw new IllegalArgumentException("제목이 없습니다.");
        }
        if (notice.getContent() == null || notice.getContent().isEmpty()) {
            throw new IllegalArgumentException("내용이 없습니다.");
        }
        noticeMapper.insertNotice(notice);
    }

    public NoticeDTO getNotice(Long noticeId) {
        NoticeDTO notice = noticeMapper.getNoticeById(noticeId);
        if (notice != null) {
            noticeMapper.incrementViews(noticeId);
        }
        return notice;
    }
    public List<NoticeDTO> getAllNotices() {
        return noticeMapper.getAllNotices();
    }

    @Transactional
    public void updateNotice(NoticeDTO notice) {
        noticeMapper.updateNotice(notice);
    }

    @Transactional
    public void deleteNotice(Long noticeId) {
        noticeMapper.deleteNotice(noticeId);
    }

    public List<NoticeDTO> getNoticesPaged(int page, int size) {
        int offset = (page - 1) * size;
        return noticeMapper.getNoticesPaged(offset, size);
    }

    public int countNotices() {
        return noticeMapper.countNotices();
    }
}
