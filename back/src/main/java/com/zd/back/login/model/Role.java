package com.zd.back.login.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Arrays;

public enum Role {
    GUEST, USER, ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        for (Role role : Role.values()) {
            if (role.name().equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown enum type " + value + ", Allowed values are " + Arrays.toString(values()));
    }
}
