package com.zd.back.organization;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrgServiceImpl implements OrgService{

    @Autowired
    private OrgMapper orgMapper;

    @Override
    public void insertOrg(OrgData orgData) {
        // TODO Auto-generated method stub
        orgMapper.insertOrg(orgData);
    }

    @Override
    public List<OrgData> selectAll() {
        // TODO Auto-generated method stub
        return orgMapper.selectAll();
    }

    @Override
    public List<GlobalOrgData> selectGlobalOrg() {
        // TODO Auto-generated method stub
        return orgMapper.selectGlobalOrg();
    }

    @Override
    public void crawling() {
        
        OrgCrawler crawler = new OrgCrawler();

        List<OrgData> orgList = crawler.PatagoniaCrawl();

        for(OrgData orgData : orgList){
            // 중복 확인
            if (orgMapper.selectByName(orgData.getName()) == null) {
                int maxNum = orgMapper.maxNum();
                
                orgData.setOrgId(maxNum + 1);
                insertOrg(orgData);
            } else {
                System.out.println("중복된 데이터: " + orgData.getName());
            }
        }

    }
    
}
