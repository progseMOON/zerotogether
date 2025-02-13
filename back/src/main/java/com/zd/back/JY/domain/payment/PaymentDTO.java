package com.zd.back.JY.domain.payment;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PaymentDTO {
    private int paymentId; // PAYMENTid
    private String orderId; // orderId
    private String pgTid; // pgTid
    private String paymentMethod; // paymentMethod
    private int amount; // amount
    private String buyerName; // buyerName
    private String buyerId; // buyerId
    private String buyerEmail; // buyerEmail
    private String buyerTel; // buyerTel
    private String status; // status
    private String failReason; // failReason
    private LocalDateTime createdAt; // createdAt

    // 기본 생성자
    public PaymentDTO() {}

    // 모든 필드를 포함하는 생성자
    public PaymentDTO(int paymentId, String orderId, String pgTid, String paymentMethod, int amount,
                      String buyerName, String buyerId, String buyerEmail, String buyerTel,
                      String status, String failReason, LocalDateTime createdAt) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.pgTid = pgTid;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.buyerName = buyerName;
        this.buyerId = buyerId;
        this.buyerEmail = buyerEmail;
        this.buyerTel = buyerTel;
        this.status = status;
        this.failReason = failReason;
        this.createdAt = createdAt;
    }

}
