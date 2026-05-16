package com.scc.smart_campus.config; // Updated to match your project structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
          .allowedOrigins("http://localhost:5503", "http://localhost:5505","http://localhost:5506" ) 
            // PATCH ko yahan add karna compulsory hai
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") 
            .allowedHeaders("*")
            .allowCredentials(true);
}

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This links the URL /images/ to your physical folder
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:src/main/resources/static/images/");
    }
    
}