package com.zd.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.zd.back.login.security.JwtFilter;
import com.zd.back.login.service.LogoutService;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final LogoutService logoutService;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, LogoutService logoutService, UserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.logoutService = logoutService;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and().csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers(
                "/member/register", "/member/login", "/member/find-id", "/member/find-password",
                "/api/auth/**", "/member/refresh-token", "/api/naver/**", "/api/seoul/**",
                "/api/rss/**", "/api/org/**", "/api/smartMap/**", "/member/privacy",
                "/member/terms", "/member/check-id", "/member/check-email",
                "/quiz.action", "/index", "/checkQH", "/getQuiz", "/insertQH", "/member/info",
                "/exchange/list", "/imgboard/list"
            ).permitAll()
            .antMatchers(HttpMethod.GET, "/api/notices/**", "/board/**", "/comment/**").permitAll()
            .antMatchers("/api/notices/**","member/delete/**").hasRole("ADMIN")
            .antMatchers("/imgboard/created", "/imgboard/update", "/imgboard/delete").authenticated()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .logout()
                .logoutUrl("/member/logout")
                .addLogoutHandler(logoutService)
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write("{\"message\": \"로그아웃 성공\", \"redirectUrl\": \"/mainpage\"}");
                    request.getSession().invalidate();
                })
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID", "refreshToken")
            .and()
            .exceptionHandling()
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"인증 정보가 유효하지 않습니다.\", \"message\": \"다시 로그인해주세요.\"}");
                })
            .and()
            .userDetailsService(userDetailsService);

        return http.build();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://192.168.16.1:3000");
        configuration.addAllowedOrigin("http://192.168.16.2:3000");
        configuration.addAllowedOrigin("http://192.168.16.15:3000");
        configuration.addAllowedOrigin("http://192.168.16.20:3000");
        configuration.addAllowedOrigin("http://192.168.16.21:3000");
        configuration.addAllowedOrigin("http://192.168.16.24:3000");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("Authorization");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
