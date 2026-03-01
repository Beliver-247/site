FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY notification-service/target/notification-service-1.0.0.jar app.jar

EXPOSE 8184

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8184/actuator/health || exit 1

ENTRYPOINT ["java", "-Dcom.sun.jndi.dns.timeout.initial=10", "-Dcom.sun.jndi.dns.timeout.retries=4", "-jar", "app.jar"]
