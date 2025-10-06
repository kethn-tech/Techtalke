# 🚀 CI/CD Pipeline Documentation

This document outlines the complete CI/CD implementation for the TechTalke project using GitHub Actions, Docker, and automated deployment strategies.

## 📋 Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [Setup Requirements](#setup-requirements)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Environment Configuration](#environment-configuration)
- [Deployment Process](#deployment-process)
- [Monitoring & Alerts](#monitoring--alerts)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The CI/CD pipeline implements:

- **Continuous Integration**: Automated testing, linting, security scanning
- **Continuous Deployment**: Automated deployments to staging and production
- **Infrastructure as Code**: Docker Compose configurations for different environments
- **Monitoring**: Comprehensive monitoring with Prometheus, Grafana, and ELK stack
- **Security**: Vulnerability scanning, dependency auditing, and secure deployments

## 🏗 Pipeline Architecture

```mermaid
graph TD
    A[Code Push] --> B[CI Pipeline]
    B --> C[Build & Test]
    C --> D[Security Scan]
    D --> E[Docker Build]
    E --> F[Push to Registry]
    F --> G{Branch?}
    G -->|main| H[Deploy to Staging]
    G -->|tag| I[Deploy to Production]
    H --> J[Health Check]
    I --> K[Health Check]
    J --> L[Success]
    K --> M[Success]
```

## ⚙️ Setup Requirements

### 1. Repository Secrets

Configure the following secrets in your GitHub repository (`Settings` > `Secrets and variables` > `Actions`):

#### Server Connection Secrets
```
STAGING_HOST=your.staging.server.ip
STAGING_USER=deployment_user
STAGING_SSH_KEY=-----BEGIN PRIVATE KEY-----...
STAGING_PORT=22

PRODUCTION_HOST=your.production.server.ip
PRODUCTION_USER=deployment_user
PRODUCTION_SSH_KEY=-----BEGIN PRIVATE KEY-----...
PRODUCTION_PORT=22
```

#### Notification Secrets
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 2. Server Setup

#### Prerequisites on both staging and production servers:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
sudo mkdir -p /opt/techtalke
sudo chown $USER:$USER /opt/techtalke
cd /opt/techtalke

# Clone repository
git clone https://github.com/your-username/techtalke.git .
```

#### Environment Setup:

```bash
# Copy and configure environment files
cp .env.staging.example .env      # For staging server
cp .env.production.example .env   # For production server

# Edit environment files with your actual values
nano .env
```

### 3. SSL Certificates

#### For production deployment, set up SSL certificates:

```bash
# Create SSL directory
sudo mkdir -p /opt/techtalke/nginx/ssl

# Using Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d techtalke.app -d www.techtalke.app

# Copy certificates
sudo cp /etc/letsencrypt/live/techtalke.app/fullchain.pem /opt/techtalke/nginx/ssl/techtalke.crt
sudo cp /etc/letsencrypt/live/techtalke.app/privkey.pem /opt/techtalke/nginx/ssl/techtalke.key
sudo chown $USER:$USER /opt/techtalke/nginx/ssl/*
```

## 🔄 GitHub Actions Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers**: Push/PR to `main` or `develop` branches

**Jobs**:
- **Frontend Testing**: ESLint, build verification
- **Backend Testing**: Dependency audit, startup tests
- **Security Scanning**: Vulnerability assessment with Trivy
- **Docker Build**: Multi-platform image building

### 2. CD Pipeline (`.github/workflows/cd.yml`)

**Triggers**: 
- Push to `main` branch (staging deployment)
- Tagged releases (production deployment)
- Manual dispatch

**Jobs**:
- **Build & Push**: Multi-architecture Docker images to GHCR
- **Deploy Staging**: Automated staging deployment
- **Deploy Production**: Production deployment with approvals
- **Rollback**: Automatic rollback on failure

### 3. Hotfix Pipeline (`.github/workflows/hotfix.yml`)

**Triggers**: Push to `hotfix/*` branches

**Features**:
- Immediate production deployment
- Emergency backup creation
- Team notifications

### 4. Monitoring Pipeline (`.github/workflows/monitoring.yml`)

**Scheduled Tasks**:
- Performance testing with Artillery
- Lighthouse audits
- Security scans
- Uptime monitoring

## 🌍 Environment Configuration

### Development
```bash
# Local development
docker-compose up -d
```

### Staging
```bash
# Staging deployment
docker-compose -f docker-compose.staging.yml up -d
```

### Production
```bash
# Production deployment
docker-compose -f docker-compose.production.yml up -d
```

## 🚀 Deployment Process

### Staging Deployment (Automatic)

1. **Trigger**: Push to `main` branch
2. **Process**:
   - Build Docker images
   - Push to container registry
   - Deploy to staging server
   - Run health checks
   - Send notifications

### Production Deployment

#### Option 1: Tagged Release (Recommended)
```bash
# Create and push a tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

#### Option 2: Manual Deployment
1. Go to GitHub Actions
2. Select "CD Pipeline"
3. Click "Run workflow"
4. Choose "production" environment

### Manual Deployment Scripts

#### Linux/macOS:
```bash
# Deploy
./scripts/deploy.sh --deploy

# Health check only
./scripts/deploy.sh --health

# Create backup
./scripts/deploy.sh --backup

# Rollback
./scripts/deploy.sh --rollback /backup/path
```

#### Windows:
```cmd
# Deploy
scripts\deploy.bat deploy

# Health check
scripts\deploy.bat health
```

## 📊 Monitoring & Alerts

### Monitoring Stack

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **ELK Stack**: Log aggregation and analysis
- **Uptime Monitoring**: Automated health checks

### Access URLs

- **Grafana**: `https://your-domain:3001`
- **Kibana**: `https://your-domain:5601`
- **Prometheus**: `https://your-domain:9090`

### Default Credentials

Update these immediately after deployment:
- **Grafana**: admin / (check environment variable)

## 🔒 Security Considerations

### 1. Secrets Management
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Never commit secrets to repository

### 2. Network Security
- Configure firewall rules
- Use VPN for server access
- Enable fail2ban for SSH protection

### 3. Container Security
- Regular vulnerability scanning
- Non-root container users
- Minimal base images

### 4. Application Security
- CORS configuration
- Rate limiting
- Input validation
- HTTPS enforcement

## 🛠 Troubleshooting

### Common Issues

#### 1. Deployment Fails
```bash
# Check container logs
docker-compose logs -f

# Check system resources
docker system df
free -h
```

#### 2. Health Check Fails
```bash
# Manual health check
curl -f http://localhost:4000/health

# Check service status
docker-compose ps
```

#### 3. Image Pull Fails
```bash
# Login to registry
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin

# Manually pull image
docker pull ghcr.io/your-username/techtalke-server:main
```

#### 4. Database Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb-primary

# Connect to MongoDB
docker-compose exec mongodb-primary mongosh
```

### Rollback Procedures

#### Automatic Rollback
The CD pipeline automatically rolls back on health check failures.

#### Manual Rollback
```bash
# Using deployment script
./scripts/deploy.sh --rollback /backup/20231201_143022

# Manual Docker rollback
docker-compose down
docker-compose pull
docker-compose up -d
```

### Performance Optimization

#### 1. Docker Optimization
```bash
# Clean up unused resources
docker system prune -a -f

# Optimize images
docker image ls --filter "dangling=true" -q | xargs docker rmi
```

#### 2. Database Optimization
```javascript
// MongoDB indexing
db.messages.createIndex({createdAt: -1})
db.users.createIndex({email: 1}, {unique: true})
```

## 📝 Maintenance Tasks

### Weekly
- Review monitoring dashboards
- Check backup integrity
- Update dependencies

### Monthly
- Rotate secrets
- Review access logs
- Security vulnerability assessment

### Quarterly
- Disaster recovery testing
- Performance optimization
- Security audit

## 🆘 Emergency Procedures

### Service Outage
1. Check monitoring dashboards
2. Review recent deployments
3. Execute rollback if needed
4. Communicate with team via Slack

### Data Recovery
1. Stop all services
2. Restore from latest backup
3. Verify data integrity
4. Restart services
5. Monitor closely

### Security Incident
1. Isolate affected systems
2. Preserve evidence
3. Execute incident response plan
4. Notify stakeholders

## 📞 Support Contacts

- **DevOps Team**: devops@techtalke.app
- **Security Team**: security@techtalke.app
- **On-call**: +1-xxx-xxx-xxxx

---

**Last Updated**: October 2025
**Version**: 1.0.0