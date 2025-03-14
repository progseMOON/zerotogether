package com.zd.back.notice.mapper;

import com.zd.back.notice.model.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface NoticeMapper {
    void insertNotice(NoticeDTO notice);
    NoticeDTO getNoticeById(Long noticeId);
    List<NoticeDTO> getAllNotices();
    void updateNotice(NoticeDTO notice);
    void deleteNotice(Long noticeId);
    List<NoticeDTO> getNoticesPaged(@Param("offset") int offset, @Param("limit") int limit);
    int countNotices();
    void incrementViews(Long noticeId);
}
