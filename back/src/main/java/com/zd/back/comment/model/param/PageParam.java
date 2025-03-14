package com.zd.back.comment.model.param;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public abstract class PageParam {

    private int pageStart;
    private int pageEnd;

    public void setPageParam(int page, int itemCount) {
        page -= 1;

        pageStart = page * itemCount + 1;
        pageEnd = (page + 1) * itemCount;
    }
}