package com.zd.back.exchange.mapper;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.zd.back.exchange.model.Exchange;

@Mapper
public interface ExchangeMapper {

    int maxExchangeId();
    void createdExchange(Exchange exchange);
    List<Exchange> getExchanges(@Param("pageStart") int pageStart, @Param("pageEnd") int pageEnd);

    int getDataCount();
    Exchange getExArticle(int exchangeId);
    void deleteExchange(int exchangeId);
    void updateAuth(int exchangeId);

    void deleteExchangesByMemberId(@Param("memId") String memId);
}
