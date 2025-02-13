package com.zd.back.JY.domain.payment;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {
    
    public int maxNum();

    public void insertpayment(PaymentDTO dto);

    public List<PaymentDTO> getDonateHistory(String BUYERID);
}
