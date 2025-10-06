# 🚀 Contributing to TechTalke CI/CD

Thank you for your interest in contributing to TechTalke's CI/CD infrastructure! This guide will help you understand our development and deployment workflows.

## 📋 Development Workflow

### Branch Strategy

We use **GitFlow** branching model:

```
main (production)
├── develop (integration)
│   ├── feature/new-chat-ui
│   ├── feature/ai-integration
│   └── bugfix/message-rendering
├── hotfix/security-patch
└── release/v1.2.0
```

#### Branch Types:
- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation

### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation

3. **Test Locally**
   ```bash
   # Start development environment
   docker-compose up -d
   
   # Run tests (when available)
   cd Client && npm test
   cd Server && npm test
   
   # Check linting
   cd Client && npm run lint
   ```

4. **Create Pull Request**
   - Push your branch to GitHub
   - Create PR to `develop` branch
   - Fill out PR template
   - Request reviews

5. **CI Validation**
   - All CI checks must pass
   - Code review approval required
   - No merge conflicts

## 🔄 CI/CD Pipeline

### Continuous Integration (CI)

**Triggered on**: Every push and PR

**Checks Include**:
- ✅ Frontend linting (ESLint)
- ✅ Backend startup test
- ✅ Security vulnerability scan
- ✅ Docker build test
- ✅ Dependency audit

**Files Involved**:
- `.github/workflows/ci.yml`
- `Client/package.json` (lint script)
- `Server/package.json`

### Continuous Deployment (CD)

#### Staging Deployment
**Triggered**: Push to `main` branch
- Automatic deployment to staging environment
- Health checks and monitoring
- Slack notifications

#### Production Deployment
**Triggered**: Tagged releases or manual dispatch
- Requires approval for production environment
- Blue-green deployment strategy
- Automatic rollback on failure
- Comprehensive monitoring

**Files Involved**:
- `.github/workflows/cd.yml`
- `docker-compose.staging.yml`
- `docker-compose.production.yml`

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/kethn-tech/techtalke.git
   cd techtalke
   ```

2. **Environment Setup**
   ```bash
   # Client environment
   cd Client
   cp env.example .env
   # Edit .env with your values
   
   # Server environment
   cd ../Server
   cp env.example .env
   # Edit .env with your values
   ```

3. **Start Development Environment**
   ```bash
   # Option 1: Using Docker (Recommended)
   docker-compose up -d
   
   # Option 2: Native development
   # Terminal 1: Client
   cd Client && npm install && npm run dev
   
   # Terminal 2: Server
   cd Server && npm install && npm run dev
   ```

4. **Verify Setup**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000
   - Health Check: http://localhost:4000/api/health

## 🧪 Testing Guidelines

### Frontend Testing
```bash
cd Client
npm run lint          # ESLint checks
npm run build         # Production build test
```

### Backend Testing
```bash
cd Server
npm audit             # Security audit
node server.js        # Startup test
```

### Docker Testing
```bash
# Test Docker builds
docker build -t techtalke-client ./Client
docker build -t techtalke-server ./Server

# Test Docker Compose
docker-compose -f docker-compose.yml config
```

## 🚀 Deployment Guidelines

### Environment Promotion

```
feature/* → develop → main → staging → production
     ↓         ↓        ↓        ↓
   Local    CI/CD   Auto Deploy  Tagged Release
```

### Release Process

1. **Prepare Release**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   
   # Update version numbers
   # Update CHANGELOG.md
   # Final testing
   ```

2. **Create Release**
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin main --tags
   ```

3. **Merge Back**
   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```

### Hotfix Process

For critical production issues:

1. **Create Hotfix**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-security-fix
   # Make minimal changes
   # Test thoroughly
   ```

2. **Deploy Hotfix**
   ```bash
   git checkout main
   git merge hotfix/critical-security-fix
   git tag -a v1.2.1 -m "Hotfix v1.2.1"
   git push origin main --tags
   ```

## 📊 Monitoring & Observability

### Health Checks
- **Endpoint**: `/api/health`
- **Response**: JSON with system status
- **Monitoring**: Automated every 30 seconds

### Metrics Collection
- **Prometheus**: Application metrics
- **Grafana**: Visualization dashboards
- **Logs**: Centralized logging with ELK stack

### Performance Testing
- **Artillery**: Load testing
- **Lighthouse**: Frontend performance
- **Automated**: Runs every 6 hours

## 🔒 Security Considerations

### Code Security
- Input validation required
- SQL injection prevention
- XSS protection mandatory
- Authentication for sensitive endpoints

### CI/CD Security
- Secrets managed via GitHub Secrets
- Container vulnerability scanning
- Dependency auditing
- HTTPS enforcement

### Deployment Security
- Non-root container users
- Network segmentation
- Rate limiting
- Security headers

## 📝 Code Standards

### Commit Messages
```
feat: add real-time chat notifications
fix: resolve message ordering issue
docs: update API documentation
style: fix code formatting
refactor: optimize database queries
test: add unit tests for auth
ci: update deployment pipeline
```

### Pull Request Template
- Clear description of changes
- Link to related issues
- Testing steps
- Screenshots for UI changes
- Breaking changes noted

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] CI/CD pipeline passes

## 🆘 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild images
docker-compose build --no-cache
```

**Port Conflicts**:
```bash
# Check running containers
docker ps
netstat -tlnp | grep :5173
```

**Environment Issues**:
```bash
# Verify environment files
cat Client/.env
cat Server/.env

# Check Docker environment
docker-compose config
```

### Getting Help

1. Check existing issues on GitHub
2. Review CI/CD logs in GitHub Actions
3. Check monitoring dashboards
4. Contact team via Slack: #tech-support

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Semantic Versioning](https://semver.org/)

---

Happy coding! 🚀