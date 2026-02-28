# DEPLOYMENT_GUIDE.md

## Prerequisites

- Docker & Docker Compose
- MongoDB Atlas account (or local MongoDB)
- Docker Hub account (for image registry)
- GitHub account (for CI/CD)

## Local Development Deployment

### 1. Clone Repository

```bash
git clone <repository-url>
cd vehicle-rental-system
```

### 2. Configure Environment

```bash
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Start Services with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (data)
docker-compose down -v
```

### 4. Verify Services

```bash
# Health check all services
for port in 8080 8081 8082 8083 8084; do
  echo "Service on port $port:"
  curl -s http://localhost:$port/actuator/health | jq '.status'
done
```

## Staging Deployment with Docker Compose

### 1. Build Custom Images

```bash
# Build all services
docker-compose build

# Or build specific service
docker-compose build user-service

# Push to registry
docker login
docker-compose push
```

### 2. Deploy to Staging Server

```bash
# SSH to staging server
ssh user@staging-server

# Clone repository
git clone <repository-url>
cd vehicle-rental-system

# Create .env file with staging configuration
nano .env
# Set MONGODB_URI with staging database
# Set JWT_SECRET with strong key
# Set service URLs

# Start services
docker-compose -f docker-compose.yml up -d

# Verify deployment
docker-compose logs -f

# Check health
curl http://localhost:8080/actuator/health
```

### 3. Monitor Services

```bash
# View running containers
docker-compose ps

# Monitor logs
docker-compose logs -f api-gateway

# Check resource usage
docker stats

# Get container details
docker-compose logs user-service | head -20
```

## Production Deployment Preparation

### 1. Image Registry Setup

```bash
# Login to Docker Hub
docker login

# Build and tag images
docker build -t yourusername/user-service:v1.0.0 user-service/
docker build -t yourusername/vehicle-service:v1.0.0 vehicle-service/
docker build -t yourusername/booking-service:v1.0.0 booking-service/
docker build -t yourusername/notification-service:v1.0.0 notification-service/
docker build -t yourusername/api-gateway:v1.0.0 api-gateway/

# Push to registry
docker push yourusername/user-service:v1.0.0
docker push yourusername/vehicle-service:v1.0.0
docker push yourusername/booking-service:v1.0.0
docker push yourusername/notification-service:v1.0.0
docker push yourusername/api-gateway:v1.0.0

# Or push latest
docker tag yourusername/user-service:v1.0.0 yourusername/user-service:latest
docker push yourusername/user-service:latest
```

### 2. MongoDB Atlas Setup

```bash
# 1. Create cluster at https://www.mongodb.com/cloud/atlas
# 2. Create database credentials
# 3. Whitelist IP addresses
# 4. Get connection string:
#    mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# 5. Create databases:
#    - user-db
#    - vehicle-db
#    - booking-db
#    - notification-db

# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/user-db"
```

### 3. Configuration Management

Create production `.env`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://prod_user:secure_password@cluster.mongodb.net/vehicle-rental?retryWrites=true&w=majority

# JWT - Generate with:
# openssl rand -base64 32
JWT_SECRET=your-256-bit-base64-encoded-secret-key-here
JWT_EXPIRATION=86400000

# Service URLs (use proper DNS)
USER_SERVICE_URL=https://user.api.yourdomain.com
VEHICLE_SERVICE_URL=https://vehicle.api.yourdomain.com
BOOKING_SERVICE_URL=https://booking.api.yourdomain.com
NOTIFICATION_SERVICE_URL=https://notification.api.yourdomain.com

# Docker Registry
DOCKER_USERNAME=yourusername
DOCKER_PASSWORD=your-docker-token
```

## Kubernetes Deployment (Advanced)

### 1. Create Kubernetes Manifests

Create `k8s/namespace.yaml`:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: vehicle-rental
```

Create `k8s/user-service-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: vehicle-rental
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: yourusername/user-service:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8081
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8081
          initialDelaySeconds: 40
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8081
          initialDelaySeconds: 20
          periodSeconds: 10
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: vehicle-rental
spec:
  type: ClusterIP
  ports:
  - port: 8081
  selector:
    app: user-service
```

### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets
kubectl create secret generic db-secret \
  --from-literal=mongodb-uri='mongodb+srv://...' \
  -n vehicle-rental

kubectl create secret generic jwt-secret \
  --from-literal=secret='your-jwt-secret' \
  -n vehicle-rental

# Deploy services
kubectl apply -f k8s/

# Verify deployment
kubectl get deployments -n vehicle-rental
kubectl get pods -n vehicle-rental

# Check logs
kubectl logs -f deployment/user-service -n vehicle-rental

# Port forward for testing
kubectl port-forward svc/api-gateway 8080:8080 -n vehicle-rental
```

## CI/CD Pipeline Setup

### 1. GitHub Secrets Configuration

Go to Settings → Secrets → New repository secret:

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token
- `SONAR_TOKEN`: SonarQube token (optional)

### 2. Trigger Workflows

```bash
# Automatic on push
git push origin main

# Manual trigger
gh workflow run build.yml
gh workflow run docker.yml
```

### 3. Monitor Build

```bash
# View workflow runs
gh run list

# View logs
gh run view <run-id> --log

# Cancel workflow
gh run cancel <run-id>
```

## Backup and Disaster Recovery

### MongoDB Backup

```bash
# Backup with mongodump
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net" \
          --out ./backup

# Restore with mongorestore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net" \
             ./backup

# Enable automatic backups in MongoDB Atlas
# Settings → Backup → Enable
```

### Docker Volume Backup

```bash
# Backup volumes
docker run --rm -v mongodb-user-data:/data \
  -v $(pwd):/backup busybox \
  tar czf /backup/mongodb-user-backup.tar.gz -C / data

# Restore volumes
docker run --rm -v mongodb-user-data:/data \
  -v $(pwd):/backup busybox \
  tar xzf /backup/mongodb-user-backup.tar.gz
```

## Performance Optimization

### 1. Database Optimization

```javascript
// Create indexes in MongoDB
db.users.createIndex({ email: 1 }, { unique: true })
db.bookings.createIndex({ userId: 1 })
db.notifications.createIndex({ userId: 1, createdAt: -1 })
```

### 2. Java JVM Tuning

Edit `docker-compose.yml`:
```yaml
environment:
  JAVA_OPTS: "-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

### 3. Connection Pooling

Spring Data MongoDB automatically manages connection pools. Adjust in properties:
```properties
spring.data.mongodb.max-pool-size=50
spring.data.mongodb.min-pool-size=10
```

## Security Hardening

### 1. Network Security

```bash
# Enable MongoDB IP whitelist in Atlas
# Add your IP: /32
# Add container network: 0.0.0.0/0 (only in staging)

# Enable network policies in Kubernetes
kubectl apply -f k8s/network-policy.yaml
```

### 2. Secret Management

```bash
# Never commit secrets
echo ".env" >> .gitignore

# Use environment variables
export JWT_SECRET=your-secret

# Or use secret management tools
# - AWS Secrets Manager
# - HashiCorp Vault
# - Kubernetes Secrets
```

### 3. HTTPS/TLS

```bash
# Generate self-signed cert (development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Use proper certificates in production
# - Let's Encrypt via Certbot
# - Cloud provider (AWS ACM, GCP,LE, etc.)
```

## Monitoring and Alerting

### 1. Health Monitoring

```bash
# Create monitoring dashboard
# Tools:
# - Grafana + Prometheus
# - CloudWatch (AWS)
# - Stackdriver (GCP)
# - Azure Monitor

# Prometheus scrape config:
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'user-service'
    static_configs:
      - targets: ['localhost:8081']
    metrics_path: '/actuator/prometheus'
```

### 2. Log Aggregation

```bash
# Use ELK Stack or
# CloudWatch Logs
# Stackdriver Logging
# Datadog
# New Relic

# Log format standardization
logging:
  level:
    com.fastFleet: DEBUG
    org.springframework: INFO
  pattern: "%d{isotime} %p [%t] %c{0} : %m%n"
```

## Rollback Procedures

### Docker Compose Rollback

```bash
# Stop current version
docker-compose down

# Switch to previous image version  
nano docker-compose.yml
# Change image tags to previous version

# Restart
docker-compose up -d
```

### Kubernetes Rollback

```bash
# View deployment history
kubectl rollout history deployment/user-service -n vehicle-rental

# Rollback to previous version
kubectl rollout undo deployment/user-service -n vehicle-rental

# Rollback to specific revision
kubectl rollout undo deployment/user-service --to-revision=2 -n vehicle-rental
```

---

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] MongoDB databases created
- [ ] Docker images built and pushed
- [ ] Health checks verified
- [ ] Logs verified
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Security hardened
