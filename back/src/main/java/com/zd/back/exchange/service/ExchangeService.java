package com.zd.back.exchange.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zd.back.exchange.mapper.ExchangeMapper;
import com.zd.back.exchange.model.Exchange;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExchangeService {

    @Autowired
    private ExchangeMapper exchangeMapper;

    public int maxExchangeId() {
        return exchangeMapper.maxExchangeId();
    }

    public void createdExchange(Exchange exchange) {
        exchangeMapper.createdExchange(exchange);
    }

    @Transactional(readOnly = true)
    public List<Exchange> getExchanges(int page, int size) {
        int pageStart = (page - 1) * size + 1;
        int pageEnd = page * size;
        return exchangeMapper.getExchanges(pageStart, pageEnd);
    }

    public int getDataCount() {
        return exchangeMapper.getDataCount();
    }
    public Exchange getExArticle(int exchangeId) {
        return exchangeMapper.getExArticle(exchangeId);
    }

    public void deleteExchange(int exchangeId) {
        exchangeMapper.deleteExchange(exchangeId);
    }

    public void updateAuth(int exchangeId) {
        exchangeMapper.updateAuth(exchangeId);
    }

    @Transactional
    public void deleteExchangesByMemberId(String memId) {
        exchangeMapper.deleteExchangesByMemberId(memId);
}
}
