package com.cube;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@ComponentScan(basePackages={"com.cube"})
@EnableAsync
@EnableTransactionManagement
public class CubeApplication {
    
	public static void main(String[] args) {
	    SpringApplication.run(CubeApplication.class, args);
	}
}
