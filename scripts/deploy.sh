#!/bin/bash

# Production Deployment Script for TechTalke
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="techtalke"
PROJECT_DIR="/opt/${PROJECT_NAME}"
BACKUP_DIR="/backup/${PROJECT_NAME}"
LOG_FILE="/var/log/${PROJECT_NAME}_deploy.log"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a $LOG_FILE
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

# Function to create backup
create_backup() {
    print_status "Creating backup..."
    
    BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="${BACKUP_DIR}/${BACKUP_TIMESTAMP}"
    
    mkdir -p $BACKUP_PATH
    
    # Backup database
    print_status "Backing up MongoDB..."
    docker-compose exec -T mongodb-primary mongodump --out $BACKUP_PATH/mongodb
    
    # Backup application files
    print_status "Backing up application files..."
    cp -r $PROJECT_DIR $BACKUP_PATH/app
    
    # Backup environment files
    cp .env* $BACKUP_PATH/ 2>/dev/null || true
    
    print_status "Backup created at $BACKUP_PATH"
    echo $BACKUP_PATH
}

# Function to health check
health_check() {
    print_status "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f --max-time 10 http://localhost:4000/health > /dev/null 2>&1; then
            print_status "Health check passed on attempt $attempt"
            return 0
        fi
        
        print_warning "Health check failed, attempt $attempt/$max_attempts"
        sleep 10
        ((attempt++))
    done
    
    print_error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to rollback
rollback() {
    local backup_path=$1
    
    print_error "Deployment failed. Starting rollback..."
    
    # Stop current containers
    docker-compose down
    
    # Restore application files
    rm -rf $PROJECT_DIR
    cp -r ${backup_path}/app $PROJECT_DIR
    
    # Restore database (if needed)
    # docker-compose exec -T mongodb-primary mongorestore ${backup_path}/mongodb
    
    # Start services
    docker-compose -f docker-compose.production.yml up -d
    
    if health_check; then
        print_status "Rollback successful"
        return 0
    else
        print_error "Rollback failed"
        return 1
    fi
}

# Function to deploy
deploy() {
    print_status "Starting deployment process..."
    
    # Check if we're in the right directory
    if [ ! -f "docker-compose.production.yml" ]; then
        print_error "docker-compose.production.yml not found. Are you in the right directory?"
        exit 1
    fi
    
    # Create backup
    backup_path=$(create_backup)
    
    # Pull latest images
    print_status "Pulling latest Docker images..."
    if ! docker-compose -f docker-compose.production.yml pull; then
        print_error "Failed to pull Docker images"
        exit 1
    fi
    
    # Stop services gracefully
    print_status "Stopping services gracefully..."
    docker-compose -f docker-compose.production.yml stop
    
    # Start services with new images
    print_status "Starting services with new images..."
    if ! docker-compose -f docker-compose.production.yml up -d; then
        print_error "Failed to start services"
        rollback $backup_path
        exit 1
    fi
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 30
    
    # Health check
    if ! health_check; then
        print_error "Health check failed after deployment"
        rollback $backup_path
        exit 1
    fi
    
    # Clean up old Docker images
    print_status "Cleaning up old Docker images..."
    docker image prune -f
    
    # Clean up old backups (keep last 5)
    print_status "Cleaning up old backups..."
    ls -t $BACKUP_DIR | tail -n +6 | xargs -I {} rm -rf $BACKUP_DIR/{}
    
    print_status "Deployment completed successfully!"
}

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -d, --deploy     Start deployment process"
    echo "  -h, --health     Perform health check only"
    echo "  -b, --backup     Create backup only"
    echo "  -r, --rollback   Rollback to specific backup (provide backup path)"
    echo "  --help           Show this help message"
}

# Main script logic
case "${1:-}" in
    -d|--deploy)
        deploy
        ;;
    -h|--health)
        health_check
        ;;
    -b|--backup)
        create_backup
        ;;
    -r|--rollback)
        if [ -z "${2:-}" ]; then
            print_error "Backup path required for rollback"
            exit 1
        fi
        rollback $2
        ;;
    --help)
        usage
        ;;
    *)
        print_error "Invalid option. Use --help for usage information."
        exit 1
        ;;
esac