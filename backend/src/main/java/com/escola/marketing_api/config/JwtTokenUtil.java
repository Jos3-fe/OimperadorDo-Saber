package com.escola.marketing_api.config;




import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    @Value("${escola.jwt.secret}")
    private String secret;

    @Value("${escola.jwt.expiration}")
    private Long jwtExpiration;

    // Recupera o username do token jwt
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, DecodedJWT::getSubject);
    }

    // Recupera a data de expiração do token jwt
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, DecodedJWT::getExpiresAt);
    }

    public <T> T getClaimFromToken(String token, Function<DecodedJWT, T> claimsResolver) {
        final DecodedJWT decodedJWT = getAllClaimsFromToken(token);
        return claimsResolver.apply(decodedJWT);
    }

    // Para recuperar qualquer informação do token será necessária a chave secreta
    private DecodedJWT getAllClaimsFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC512(secret);
            JWTVerifier verifier = JWT.require(algorithm).build();
            return verifier.verify(token);
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    // Verifica se o token jwt está expirado
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration != null ? expiration.before(new Date()) : true;
    }

    // Gera token para o usuário
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    // Enquanto estiver criando o token:
    // 1. Define claims do token, como Issuer, Expiration, Subject e o ID
    // 2. Assina o JWT com o algoritmo HMAC512 e chave secreta
    // 3. De acordo com JWS Compact Serialization rules
    //    compacta o JWT para uma string
    private String createToken(Map<String, Object> claims, String subject) {
        return JWT.create()
                .withPayload(claims)
                .withSubject(subject)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpiration))
                .sign(Algorithm.HMAC512(secret));
    }

    // Valida o token jwt
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}

