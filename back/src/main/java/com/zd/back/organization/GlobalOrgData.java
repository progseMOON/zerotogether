package com.zd.back.organization;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalOrgData {

    private int ngoId;
    private String name;
    private String description;
    private String imgUrl;
    private String link;
}
