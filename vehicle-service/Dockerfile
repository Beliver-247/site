FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY vehicle-service/target/vehicle-service-1.0.0.jar app.jar

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["java", "-Dcom.sun.jndi.dns.timeout.initial=10", "-Dcom.sun.jndi.dns.timeout.retries=4", "-jar", "app.jar"]
