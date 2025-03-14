package com.zd.back.JY.domain.payment;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping("/payment")
public class PayController {

    @Autowired
    private PayService payService;

    @GetMapping("/pay")
    public ModelAndView getMethodName() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/JY/payment");
        return mav;
    }

    @PostMapping("/paymentHistory")
    public ResponseEntity<?> savePaymentHistory(@RequestBody Map<Object, Object> response) {
        // paymentData를 데이터베이스에 저장하는 로직 구현
        System.out.println("controller 호출 완료");

        try {
            payService.insertpayment(response); // 데이터베이스에 저장
            return ResponseEntity.ok("Payment recorded");
        } catch (Exception e) {
            System.err.println("저장 오류: " + e.getMessage());
            return ResponseEntity.status(500).body("후원 기록 저장 실패: " + e.getMessage());
        }
    }

    @GetMapping("/getDonateHistory")
    public ResponseEntity<?> getDonateHistory(@RequestParam String buyerId) {
        try {
            // 후원 내역을 서비스에서 받아옴
            List<PaymentDTO> donateHistory = payService.getDonateHistory(buyerId);

            if (donateHistory == null || donateHistory.isEmpty()) {
                // 후원 기록이 없으면 빈 리스트를 반환
                return ResponseEntity.ok(donateHistory);
            }

            return ResponseEntity.ok(donateHistory);  // 후원 내역 반환
        } catch (Exception e) {
            // 예외 발생 시 처리
            System.err.println("후원 기록 불러오기 실패: " + e.getMessage());
            return ResponseEntity.status(500).body("후원내역 불러오기 실패: " + e.getMessage());
        }
    }

}
