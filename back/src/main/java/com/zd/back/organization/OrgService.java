package com.zd.back.organization;

import java.util.List;

/**
 * OrgService
 */
public interface OrgService {

    void insertOrg(OrgData orgData);
    List<OrgData> selectAll();
    void crawling();
    List<GlobalOrgData> selectGlobalOrg();
}