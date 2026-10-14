package com.cube.trace.agent;

import java.lang.instrument.Instrumentation;

public class TraceAgent {

    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("[CubeTrace] premain, args=" + agentArgs);
        install(inst);
    }

    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("[CubeTrace] agentmain, args=" + agentArgs);
        install(inst);
    }

    private static void install(Instrumentation inst) {

    }

}