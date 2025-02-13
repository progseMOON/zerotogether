package com.zd.back.JY.domain.point;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PointHistoryDTO {
    private int historyId;
    private String memId;
    private int pointChange;
    private String changeReason;
    private LocalDateTime changeDate;
}
