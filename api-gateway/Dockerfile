FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/api-gateway-1.0.0.jar app.jar

EXPOSE 8180

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8180/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
