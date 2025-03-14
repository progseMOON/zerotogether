package com.zd.back.JY.domain.dailyQuiz;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.zd.back.JY.work.ReadJSON;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class QuizController {
    
    @Resource
    private QuizService quizService;


    @PostMapping("/checkQH")
        public ResponseEntity<?> checkAttendance(@RequestParam String memId) {
            try {
                System.out.println(memId);
                
                // 해당 회원의 오늘 퀴즈 참여 여부를 체크
                int check = quizService.checkToday(memId);
                System.out.println("몇개 나오나: "+check);
                // 오늘 퀴즈에 참여한 경우
                if (check!=0) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "done");
                    return ResponseEntity.ok().body(response);
                } else {
                    // 오늘 퀴즈에 참여하지 않은 경우
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "yet");
                    return ResponseEntity.ok().body(response);
                }
            } catch (Exception e) {
                // 예외 발생 시 에러 메시지 반환
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "왜 이따구야");
                return ResponseEntity.badRequest().body(errorResponse);
            }
    }

    @GetMapping(value="/quiz.action")
    public ResponseEntity<?> test(@RequestParam String filename) throws Exception{
        try {
            System.out.println("quiz.action");

            String filePath = "C:\\quiz\\" + filename;
        
            // 파일 존재 여부 확인
            File file = new File(filePath+".json");
            if (!file.exists()) {
                // 파일이 존재하지 않으면 404 응답 반환
                return ResponseEntity.status(404).body("파일을 찾을 수 없습니다: " + filePath);
            }

            ReadJSON rj = new ReadJSON();
            JSONArray array = rj.jsonToArray("C:/quiz/"+filename);
            // JSONArray array = rj.jsonToArray("C:\\vscode\\project\\back\\src\\main\\resources\\quiz\\upcycling");
            // JSONArray array = rj.jsonToArray("C:\\vscode\\project\\back\\src\\main\\resources\\quiz\\recycling");
            Map<Integer, String[]> map = rj.unzipArray(array);
            quizService.insertquiz(map);
            return ResponseEntity.ok("퀴즈 저장 성공");
        } catch (Exception e) {
            System.err.println("Error occurred in /quiz: " + e.getMessage());
            e.printStackTrace();  // 추가로 예외 스택 추적을 출력
            return ResponseEntity.status(500).body("퀴즈 히스토리 저장 실패: " + e.getMessage());
        }
    }
    
    @GetMapping("/getQuiz")
    @ResponseBody
    public JSONObject getRandomQuiz() throws Exception {
        ReadJSON readJSON = new ReadJSON();
        QuizDTO dto;

        dto = quizService.getRandomQuiz();

        JSONObject object = readJSON.toJsonObject(dto);

        if(dto!=null){
            return object;
        } else throw new Exception("퀴즈를 찾을 수 없습니다.");
    }
    
    @PostMapping("/insertQH")
    public ResponseEntity<String> insertQuizHistory(@RequestBody Map<String, Object> request) {
        try {
            // 요청 데이터 로그 출력
            System.out.println("Received request: " + request);
    
            quizService.insertQH(request);
            return ResponseEntity.ok("퀴즈 히스토리 저장 성공");
        } catch (Exception e) {
            // 예외 메시지 로그 출력
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body("퀴즈 히스토리 저장 실패: " + e.getMessage());
        }
        
    }

}
