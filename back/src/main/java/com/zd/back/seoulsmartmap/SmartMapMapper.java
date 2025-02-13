package com.zd.back.seoulsmartmap;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * SmartMapMapper
 */
@Mapper
public interface SmartMapMapper {

    void saveStore(ThemaData themaData);
    int maxNum();
    List<ThemaData> allStore();
    ThemaData findByNameAndTelNo(@Param("name") String name, @Param("telNo") String telNo);

    
}