#!/bin/bash

# PersonaTests Production Deployment Script
# This script builds and deploys korean-mbti-platform to personatests-websites

echo "🚀 Starting PersonaTests Production Deployment..."

# Step 1: Build the latest version
echo "📦 Building latest version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 2: Backup current production
echo "💾 Creating backup of current production..."
cd personatests-websites
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r *.html *.js *.css _next/ "$BACKUP_DIR/" 2>/dev/null || echo "Some files may not exist to backup"

# Step 3: Clear production (except config files)
echo "🧹 Clearing production files..."
find . -name "*.html" -not -path "./backup-*" -delete
find . -name "*.css" -not -path "./backup-*" -delete
find . -name "*.js" -not -path "./backup-*" -delete
rm -rf _next/ 2>/dev/null

# Step 4: Copy new build
echo "📁 Copying new build to production..."
cd ..
cp -r out/* personatests-websites/

# Step 5: Git commit and deploy
echo "📤 Deploying to production..."
cd personatests-websites
git add -A
git commit -m "Production deployment $(date +%Y-%m-%d\ %H:%M:%S)

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push

echo "🎉 Deployment completed! Check https://personatests.com in 1-2 minutes."
echo "💾 Backup created in: $BACKUP_DIR"