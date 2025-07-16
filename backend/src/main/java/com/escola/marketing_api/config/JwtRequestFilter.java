package com.escola.marketing_api.config;



import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token está na forma "Bearer token". Remove o Bearer e obtem apenas o token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                //DecodedJWT jwt = verifier.verify(token);
            } catch (TokenExpiredException e) {
                logger.warn("JWT Token has expired");
            } catch (JWTVerificationException e) {
                logger.warn("Invalid JWT Token");
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");
        }

        // Depois de validar o token, autentica o usuário
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = this.jwtUserDetailsService.loadUserByUsername(username);

            // Se o token for válido, configura o Spring Security para definir a autenticação manualmente
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Depois de definir a Authentication no contexto, especifica que o usuário atual está autenticado
                // Assim passa o Spring Security Configurations com sucesso
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Não aplique este filtro para a rota de login nem para rotas públicas de GET
        // e OPTIONS.
        String path = request.getRequestURI();

        // O seu frontend chama /api/auth/login, /api/cursos, etc.
        // Certifique-se que o pathMatcher cobre o prefixo /api
        return pathMatcher.match("/api/auth/login", path) ||
                pathMatcher.match("/api/auth/register", path) || // Se tiver rota de registro
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/cursos/**", path)) ||
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/eventos/**", path)) ||
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/sobre-nos", path)) ||
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/galerias", path)) ||
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/documentos", path)) ||
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/noticias", path)) ||
                (request.getMethod().equals(HttpMethod.GET.toString()) && pathMatcher.match("/api/direcoes", path)) ||
                (request.getMethod().equals(HttpMethod.POST.toString()) && pathMatcher.match("/api/contato", path)) ||
                pathMatcher.match("/api/actuator/**", path) ||
                request.getMethod().equals(HttpMethod.OPTIONS.toString());
    }
}

