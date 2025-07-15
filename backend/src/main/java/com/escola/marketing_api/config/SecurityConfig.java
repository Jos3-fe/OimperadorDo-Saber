package com.escola.marketing_api.config;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private UserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(jwtUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        // Rotas de autenticação
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/auth/**").permitAll() // Adicionar sem /api se necessário

                        .requestMatchers("/uploads/**").permitAll()

                        // Rotas de cursos (com e sem /api)
                        .requestMatchers(HttpMethod.GET, "/api/cursos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cursos/**").permitAll()

                        // Rotas de eventos (com e sem /api)
                        .requestMatchers(HttpMethod.GET, "/api/eventos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/eventos/**").permitAll()

                        // Outras rotas públicas
                        .requestMatchers(HttpMethod.GET, "/api/sobre-nos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sobre-nos").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contato").permitAll()
                        .requestMatchers(HttpMethod.POST, "/contato").permitAll()


                        // ROTAS DE DOCUMENTOS PÚBLICAS (CORREÇÃO AQUI)
                        // Permite GET para a listagem paginada de documentos
                        .requestMatchers(HttpMethod.GET, "/api/documentos/paginated").permitAll()
                        .requestMatchers(HttpMethod.GET, "/documentos/paginated").permitAll() // Caso use sem /api

                        // Permite GET para download de documentos (pelo ID)
                        .requestMatchers(HttpMethod.GET, "/api/documentos/download/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/documentos/download/**").permitAll() // Caso use sem /api
                        
                        .requestMatchers(HttpMethod.GET, "/api/galeria/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/galeria/**").permitAll()
                        .requestMatchers("/api/galeria/admin/**").hasRole("ADMIN")
                        .requestMatchers("/galeria/admin/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/noticias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/noticias/**").permitAll()
                        .requestMatchers("/api/noticias/admin/**").hasRole("ADMIN")
                        .requestMatchers("/noticias/admin/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/direcao/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/direcao/**").permitAll()
                        .requestMatchers("/api/direcao/admin/**").hasRole("ADMIN")
                        .requestMatchers("/direcao/admin/**").hasRole("ADMIN")


                        // Em SecurityConfig.java
                        .requestMatchers(HttpMethod.GET, "/api/cursos/paginated").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cursos/paginated").permitAll() // Se você usa a rota sem /api também
                        .requestMatchers(HttpMethod.GET, "/api/cursos/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cursos/{id}").permitAll()


                        // Rotas de Categoria
                        .requestMatchers(HttpMethod.GET, "/api/categoria/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categoria/**").permitAll()

                        // Rotas de Anos Letivos
                        .requestMatchers(HttpMethod.GET, "/api/anos-letivos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/anos-letivos/**").permitAll()

                        // Rotas de Tags
                        .requestMatchers(HttpMethod.GET, "/api/tags/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/tags/**").permitAll()

                        // Se você tiver um endpoint paginado genérico na raiz ou /api/paginated
                        // Verifique se realmente existe este endpoint genérico ou se o frontend está chamando o endpoint errado
                        // É mais comum ter /api/galeria/paginated ou /api/noticias/paginated
                        .requestMatchers(HttpMethod.GET, "/api/paginated").permitAll()
                        .requestMatchers(HttpMethod.GET, "/paginated").permitAll()


                        // Actuator
                        .requestMatchers("/api/actuator/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // OPTIONS para CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Rotas administrativas (exigem ROLE_ADMIN)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Todas as outras requisições precisam de autenticação
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

