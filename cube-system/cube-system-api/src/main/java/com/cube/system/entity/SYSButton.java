package com.cube.system.entity;

import com.cube.api.entity.BaseEntity;

public class SYSButton extends BaseEntity {
    Long buttonId;
    String buttonName;
    String description;

    public Long getButtonId() {
        return buttonId;
    }

    public void setButtonId(Long buttonId) {
        this.buttonId = buttonId;
    }

    public String getButtonName() {
        return buttonName;
    }

    public void setButtonName(String buttonName) {
        this.buttonName = buttonName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}