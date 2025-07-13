package com.escola.marketing_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories("com.escola.marketing_api.repository")
@EnableCaching
public class MarketingApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(MarketingApiApplication.class, args);
	}
}
