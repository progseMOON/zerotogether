package com.zd.back.seoulsmartmap;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SmartMapServiceImpl implements SmartMapService{

    @Autowired
    private SmartMapMapper smartMapMapper;

    @Override
    public void saveStores() {
        // TODO Auto-generated method stub
        
        String openApiKey = "KEY104_8af715285c7740429cf53e24f61c35ce";
        String themaApiKey = "KEY104_cfdf1f0190da4f8793758cc79f5df29e";
        String apiUrl = "https://map.seoul.go.kr/openapi/v5/" + themaApiKey + "/public/themes/contents/ko?page_size=1000&page_no=1&coord_x=126.974695&coord_y=37.564150&distance=3000000&search_type=0&search_name=&theme_id=11103395&content_id=&subcate_id=";

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseData = response.getBody();
            List<ThemaData> themaDatas = extractStores(responseData, themaApiKey);  // 필요한 데이터 추출
            
            // 반복문을 사용해 하나씩 DB에 저장
            for (ThemaData store : themaDatas) {
                ThemaData existingStore = smartMapMapper.findByNameAndTelNo(store.getName(), store.getTelNo());
    
                // 중복이 없을 경우에만 저장
                if (existingStore == null) {
                    store.setSmartMapId(maxNum()+1);
                    smartMapMapper.saveStore(store);  // 새로 저장
                }
            }
        }

    }

    // JSON에서 필요한 데이터만 추출하는 메서드
    private List<ThemaData> extractStores(String responseData, String themaApiKey) {
        List<ThemaData> stores = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode root = objectMapper.readTree(responseData);
            JsonNode body = root.path("body");

            for (JsonNode storeNode : body) {
                ThemaData store = new ThemaData();
                store.setName(storeNode.path("COT_CONTS_NAME").asText());
                store.setCoordX(storeNode.path("COT_COORD_X").asDouble());
                store.setCoordY(storeNode.path("COT_COORD_Y").asDouble());
                store.setTelNo(storeNode.path("COT_TEL_NO").asText());
                store.setThemeName(storeNode.path("THM_THEME_NAME").asText());
                store.setGuName(storeNode.path("COT_GU_NAME").asText());
                store.setAddrNew(storeNode.path("COT_ADDR_FULL_NEW").asText());
                store.setAddrOld(storeNode.path("COT_ADDR_FULL_OLD").asText());
                store.setOpeningHours(storeNode.path("COT_VALUE_03").asText());

                String getUrl = storeNode.path("COT_IMG_MAIN_URL").asText();

                if (getUrl != null && !getUrl.equals("null") && !getUrl.isEmpty()) {
                    store.setImgUrl("https://map.seoul.go.kr" + getUrl);
                } else {
                    store.setImgUrl(""); // 혹은 store.setImgUrl("");
                }

                String contId = storeNode.path("COT_CONTS_ID").asText();

                // 추가 API 호출하여 세 개의 값을 추출
                String detailApiUrl = "https://map.seoul.go.kr/openapi/v5/" + themaApiKey + "/public/themes/contents/detail?theme_id=11103395&conts_id=" + contId;
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> detailResponse = restTemplate.getForEntity(detailApiUrl, String.class);

                if (detailResponse.getStatusCode().is2xxSuccessful()) {
                    String detailResponseData = detailResponse.getBody();
                    JsonNode detailRoot = objectMapper.readTree(detailResponseData);
                    JsonNode detailBody = detailRoot.path("body");

                    if (detailBody.size() > 0) {
                        JsonNode detailNode = detailBody.get(0);
                        store.setSales(detailNode.path("COT_VALUE_04").asText());
                        store.setInstaUrl(detailNode.path("COT_VALUE_05").asText());
                        store.setLink(detailNode.path("COT_EXTRA_DATA_02").asText());
                    }
                }
                                
                stores.add(store);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return stores;
    }
    
    public int maxNum() {
        // TODO Auto-generated method stub
        return smartMapMapper.maxNum();
    }

    @Override
    public List<ThemaData> allStore() {
        // TODO Auto-generated method stub
        return smartMapMapper.allStore();
    }
}
