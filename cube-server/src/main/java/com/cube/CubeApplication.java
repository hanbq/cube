package com.cube;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ComponentScan(basePackages={"com.cube"})
@EnableAsync
public class CubeApplication {
    
	public static void main(String[] args) {
	    SpringApplication.run(CubeApplication.class, args);
	}
}
