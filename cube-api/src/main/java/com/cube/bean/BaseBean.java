package com.cube.bean;

import java.io.Serial;

public class BaseBean implements java.io.Serializable {

    @Serial
    private static final long serialVersionUID = 7836003164128735298L;

    String requestId;

     public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
}
