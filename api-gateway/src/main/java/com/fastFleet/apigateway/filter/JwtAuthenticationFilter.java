package com.fastFleet.apigateway.filter;

import com.fastFleet.apigateway.security.JwtValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final JwtValidator jwtValidator;

    public JwtAuthenticationFilter(JwtValidator jwtValidator) {
        super(Config.class);
        this.jwtValidator = jwtValidator;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            // Skip JWT validation for public endpoints
            if (isPublicEndpoint(path)) {
                return chain.filter(exchange);
            }

            // Extract JWT from header
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);

            // Validate token
            if (!jwtValidator.validateToken(token)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // Extract userId and forward it
            String userId = jwtValidator.getUserIdFromToken(token);
            if (userId != null) {
                ServerWebExchange modifiedExchange = exchange.mutate()
                        .request(exchange.getRequest().mutate()
                                .header("X-User-Id", userId)
                                .build())
                        .build();
                return chain.filter(modifiedExchange);
            }

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        };
    }

    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/users/register") 
                || path.startsWith("/api/users/login")
                || path.startsWith("/api/vehicles")
                || path.startsWith("/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/actuator");
    }

    public static class Config {
    }
}
