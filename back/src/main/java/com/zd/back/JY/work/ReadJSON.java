
package com.zd.back.JY.work;

import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.zd.back.JY.domain.dailyQuiz.QuizDTO;





public class ReadJSON{

    //JSON파일의 주소를 바당 파일을 읽어 JSON형식을 JSONArray형태로 반환
    public JSONArray jsonToArray(String fileUrl){
        //.json을 제외한 파일 URL입력
        String url = fileUrl +".json";
        JSONArray array = new JSONArray();
        //try(Reader reader = new FileReader(url)) {
         try (Reader reader = new InputStreamReader(new FileInputStream(url), "UTF-8")) {
            JSONParser parser = new JSONParser();
            array = (JSONArray)parser.parse(reader);
            return array;
        } catch(Exception e){
            e.printStackTrace();
        }
        return array;
    }

    //JSONArray를 풀어서 id를 key로 가지고있는 Map형태로 반환한다.
    public Map<Integer,String[]> unzipArray(JSONArray array){
        Map<Integer,String[]> map = new HashMap<>();
        try {
            if(array!= null){
                for(int i=0; i<array.size(); i++){
                    JSONObject object = (JSONObject) array.get(i);
                    int id = i;
                    String question = (String)object.get("question");
                    String answer = (String)object.get("answer");
                    String explanation = (String)object.get("explanation");

                    System.out.println(i + question + answer + explanation);

                    String [] qae = {question, answer, explanation};

                    map.put(id, qae);
                    /*
                     * [0] : question
                     * [1] : answer
                     * [2] : explanation
                    */
                }
            }else{
                throw new NullPointerException();
            }
        } catch (NullPointerException ne) {
            ne.printStackTrace();
            System.out.println("널포인트 예외");
        }
        return map;
    }

    public JSONObject toJsonObject(QuizDTO dto){

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", dto.getQUIZID());
        jsonObject.put("question", dto.getQuestion());
        jsonObject.put("answer", dto.getAnswer());
        jsonObject.put("explanation", dto.getExplanation());



        return jsonObject;
    }

}
