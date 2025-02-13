package com.zd.back.naversearchapi;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class ReadNaverJSON {

    public Map<Integer, Map<String,Object>> unzipArray(JSONArray array) {   //JSONArray 형태를 매개변수로 받아온다

        Map<Integer, Map<String,Object>> map = new HashMap<>();     //해쉬맵 설정.

        try {
            
            if (array != null) {

                // 날짜 형식 변환기 설정 (시간대 정보 포함)
                String datePattern = "EEE, dd MMM yyyy HH:mm:ss XXX"; // 타임존을 'XXX'로 설정
                SimpleDateFormat inputFormat = new SimpleDateFormat(datePattern, Locale.ENGLISH);

                for (int i = 0; i < array.size(); i++) {            
                    JSONObject object = (JSONObject) array.get(i);      //jsonarray 안의 데이터를 하나씩 뽑아 오브젝트화.
                    int id = i; // ID로 사용

                    // 오브젝트화한 JSON 데이터에서 필요한 데이터 추출
                    String title = (String) object.get("title");
                    String originalLink = (String) object.get("originallink");
                    String link = (String) object.get("link");
                    String description = (String) object.get("description");
                    String pubDateStr = (String) object.get("pubDate");

                    // pubDate 문자열을 java.util.Date로 변환
                    java.util.Date parsedDate = null;
                    java.sql.Date pubDate = null;
                    try {
                        if (pubDateStr != null && !pubDateStr.isEmpty()) {

                            // 시간대 정보 수정: +0900 → +09:00
                            pubDateStr = pubDateStr.replaceAll("([+\\-]\\d{2})(\\d{2})$", "$1:$2");

                            parsedDate = inputFormat.parse(pubDateStr);
                            pubDate = new java.sql.Date(parsedDate.getTime());
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                        System.out.println("날짜 변환 오류: " + pubDateStr);
                    }

                    // 각 뉴스 기사의 정보를 Map 형식으로 저장
                    Map<String, Object> newsData = new HashMap<>();
                    newsData.put("title", title);
                    newsData.put("originalLink", originalLink);
                    newsData.put("link", link);
                    newsData.put("description", description);
                    newsData.put("pubDate", pubDate);

                    // ID와 뉴스 데이터의 맵을 저장
                    map.put(id, newsData);
                }
            } else {
                throw new NullPointerException("JSONArray is null");
            }


        } catch (Exception e) {

            e.printStackTrace();
            System.out.println("널포인트 예외");

        }


        return map;         //Map<Integer, Map<String,String>> 형식으로 바꾼 데이터를 반환.
    }
    
}
