package com.zd.back.JY.domain.attendance;


import java.util.Date;

import lombok.Data;

@Data
public class AttendanceDTO {

    private int attId;
    private Date attDate;
    private String memId;

    public AttendanceDTO() {
        this.attDate=new Date();
    }

}
