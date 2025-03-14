package com.zd.back.JY.domain.dailyQuiz;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuizServiceImp implements QuizService {

    @Autowired
    private QuizMapper quizMapper;

    @Autowired
    private QuizHistoryMapper quizHistoryMapper;

    public int maxNum(){
        return quizMapper.maxNum();
    }
    public int QHMaxNum(){
        return quizHistoryMapper.QHMaxNum();
    }

    
    @Transactional(readOnly = true)
    public int checkToday(String memId){
        
        return quizHistoryMapper.checkToday(memId);
    }

    public void insertquiz(Map map){

        QuizDTO dto;

        for(int i=0; i<map.size(); i++){
            
            //int id = Integer.parseInt(map.get(i).toString());
            
            int id = maxNum()+1;

            String [] qae = (String[]) map.get(i);
    
            dto = new QuizDTO(id, qae[0],qae[1], qae[2]);

            
            System.out.println(id+"번째 퀴즈 삽입 완료");
            System.out.println(qae[0]);
            System.out.println(qae[1]);
            System.out.println(qae[2]+"\n\n");

            quizMapper.insertquiz(dto);
        }
        

        //map을 받아서 dto로 만든다음에 넣어준다.
    }

    @Override
    public QuizDTO getRandomQuiz() {
        return quizMapper.getRandomQuiz();
    }


    @Override
    public void insertQH(Map<String, Object> response) {
        System.out.println("받은데이터: " + response);
        QuizHistoryDTO dto;
        String memId = response.get("memId").toString();
        String quizResult = response.get("quizResult").toString();

        int quizid;
        Object obj = response.get("quizid");

        if (obj instanceof Integer) {
            quizid = (Integer) obj;
            System.out.println("Integer 값: " + quizid);
        } else {
            quizid = Integer.parseInt(obj.toString());
            System.out.println("obj는 Integer가 아닙니다.");
        }

        dto = new QuizHistoryDTO(
            QHMaxNum() +1, 
            quizResult, 
            LocalDateTime.now(), 
            memId, 
            quizid);

        System.out.println("Inserting QuizHistory: " + dto);
        quizHistoryMapper.insertQH(dto);
    }


}

