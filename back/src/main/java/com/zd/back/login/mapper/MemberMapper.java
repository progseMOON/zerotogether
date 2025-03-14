package com.zd.back.login.mapper;

import com.zd.back.login.model.Member;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    void insertMember(Member member);
    Member selectMemberById(@Param("memId") String memId);
    void updateMember(Member member);
    int deleteMember(@Param("memId") String memId);
    String findIdByEmail(@Param("email") String email);
    int countByMemId(@Param("memId") String memId);
    int countByEmail(@Param("email") String email);
    void updateMemberRole(@Param("memId") String memId, @Param("role") String role);
    List<Member> selectAllMembers();
    List<Member> searchMembers(Map<String, Object> params);
    int countMembers(Map<String, Object> params);
    List<Member> searchMembers(@Param("searchTerm") String searchTerm, @Param("offset") int offset, @Param("limit") int limit);

    int countMembers(@Param("searchTerm") String searchTerm);
}
