package com.zd.back.seoulsmartmap;

import java.util.List;

/**
 * SmartMapService
 */
public interface SmartMapService {

    void saveStores(); // API 호출 후 DB 저장
    List<ThemaData> allStore();
}