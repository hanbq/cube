package com.cube.workflow.bean;

public class WFUnexpectedEvent extends WFEvent {

    Class<?> unexpectedClass;

    public Class<?> getUnexpectedClass() {
        return unexpectedClass;
    }

    public void setUnexpectedClass(Class<?> unexpectedClass) {
        this.unexpectedClass = unexpectedClass;
    }

    Throwable throwable;

    public Throwable getThrowable() {
        return throwable;
    }

    public void setThrowable(Throwable throwable) {
        this.throwable = throwable;
    }
}