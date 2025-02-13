package com.zd.back.JY.domain.payment;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.IamportClient;


@Service
public class PayService {
    
    private IamportClient api;

    @Autowired
    private PaymentMapper paymentMapper;

    public PayService(){
        this.api= new IamportClient("2467100118816737", "It0kkm3a8XLgUsC88uAwAV6DRQCCGB0dZ6CzCSfWnC7nPAlMs3yLggnkPnTw4yvQpz9Njq7MxE7HhDwK");
    }

    public int maxNum(){
        return paymentMapper.maxNum();
    }

    public void insertpayment(Map<Object, Object> response) {
        System.out.println("service 호출 완료");
        PaymentDTO dto = new PaymentDTO();
    
        // 가격 처리
        int amount = 0;
        Object obj = response.get("amount");
        System.out.println("받은 amount 값: " + obj);
    
        if (obj == null) {
            System.err.println("amount 값이 null입니다.");
            return; // 또는 적절한 예외 처리
        }
    
        try {
            if (obj instanceof Integer) {
                amount = (Integer) obj;
            } else if (obj instanceof Long) {
                amount = ((Long) obj).intValue(); // Long을 int로 변환
            } else if (obj instanceof String) {
                amount = Integer.parseInt((String) obj); // String을 int로 변환
            } else {
                System.err.println("지원되지 않는 타입입니다: " + obj.getClass());
                return;
            }
            System.out.println("처리된 amount 값: " + amount);
        } catch (NumberFormatException e) {
            System.err.println("NumberFormatException 발생: amount 값이 숫자로 변환할 수 없습니다. 받은 값: " + obj);
            e.printStackTrace();
            return;
        }
    
        // 나머지 값 처리 (null 체크 추가)
        dto.setPaymentId(paymentMapper.maxNum() + 1);
        dto.setOrderId(response.get("orderId") != null ? response.get("orderId").toString() : "기본값");
        dto.setPgTid(response.get("pgTid") != null ? response.get("pgTid").toString() : "기본값");
        dto.setPaymentMethod(response.get("paymentMethod") != null ? response.get("paymentMethod").toString() : "기본값");
        dto.setAmount(amount);
        dto.setBuyerId(response.get("buyerId") != null ? response.get("buyerId").toString() : "기본값");
        dto.setBuyerName(response.get("memName") != null ? response.get("memName").toString() : "기본값");
        dto.setBuyerEmail(response.get("buyerEmail") != null ? response.get("buyerEmail").toString() : "기본값");
        dto.setBuyerTel(response.get("buyerTel") != null ? response.get("buyerTel").toString() : "기본값");
        dto.setStatus(response.get("status") != null ? response.get("status").toString() : "기본값");
        dto.setFailReason(response.get("failReason") != null ? response.get("failReason").toString() : "기본값");
        dto.setCreatedAt(LocalDateTime.now());
    
        // 데이터베이스에 삽입
        paymentMapper.insertpayment(dto);
    }
    
    public List<PaymentDTO> getDonateHistory(String buyerId) {
        return paymentMapper.getDonateHistory(buyerId);
    }
}
