
package com.career.connect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.career.connect.user.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Anyone can register
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/register"
                ).permitAll()

                // Recruiter-specific endpoint must come first
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs/my-jobs"
                ).hasRole("RECRUITER")

                // Anyone can browse jobs and search
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs",
                    "/api/jobs/search"
                ).permitAll()

                // Anyone can view an individual job
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs/*"
                ).permitAll()

                // Only recruiters can create jobs
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/jobs"
                ).hasRole("RECRUITER")

                // Only recruiters can update jobs
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/jobs/**"
                ).hasRole("RECRUITER")

                // Only recruiters can delete jobs
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/jobs/**"
                ).hasRole("RECRUITER")

                // Only recruiters can update application status
                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/applications/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                	    HttpMethod.GET, "/api/recruiter/dashboard/**"
                	).hasRole("RECRUITER")
                
                .requestMatchers(
                	    HttpMethod.GET, "/api/student/dashboard/**"
                	).hasRole("STUDENT")
                
                // All remaining endpoints require authentication
                .anyRequest().authenticated()
            )

            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
