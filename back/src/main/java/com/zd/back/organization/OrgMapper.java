package com.zd.back.organization;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

/**
 * OrgMapper
 */
@Mapper
public interface OrgMapper {

    void insertOrg(OrgData orgData);
    List<OrgData> selectAll();
    List<GlobalOrgData> selectGlobalOrg();
    void crawling();
    OrgData selectByName(String name);
    int maxNum();

}