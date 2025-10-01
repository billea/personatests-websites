# PersonaTests Development Workflow

This document outlines the best practices for developing and deploying the PersonaTests platform.

## 🏗️ Project Structure

- **`korean-mbti-platform/`** - Primary development environment
- **`personatests-websites/`** - Production deployment repository
- **Production URL**: https://personatests.com

## 🔄 Development Workflow

### Phase 1: Development (korean-mbti-platform)

1. **Start Development Server**
   ```bash
   npm run dev
   # or for Windows stability:
   npm run dev:stable
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

3. **Develop Features**
   - Write code in `src/` directory
   - Test locally at `http://localhost:3004`
   - Follow existing patterns and conventions
   - Add translations in `public/translations/`

4. **Test Thoroughly**
   - Manual testing of all features
   - Test different languages
   - Test authentication flows
   - Test responsive design

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add new feature: description"
   git push origin feature/new-feature-name
   ```

### Phase 2: Production Deployment

1. **Build and Test**
   ```bash
   npm run build
   npm run start  # Test production build locally
   ```

2. **Deploy to Production** (Choose one method)

   **Method A: Automated Script (Recommended)**
   ```bash
   # Windows
   deploy-to-production.bat

   # Linux/Mac
   ./deploy-to-production.sh
   ```

   **Method B: Manual Deployment**
   ```bash
   # Build
   npm run build

   # Copy to production
   cp -r out/* personatests-websites/

   # Deploy
   cd personatests-websites
   git add -A
   git commit -m "Production deployment $(date)"
   git push
   ```

3. **Verify Deployment**
   - Check https://personatests.com (wait 1-2 minutes for Netlify)
   - Test key functionality
   - Check different languages
   - Test on mobile devices

## 📁 Key Directories

### Development (korean-mbti-platform)
```
src/
├── app/[locale]/          # Next.js App Router pages
├── components/            # React components
├── lib/                   # Core libraries and utilities
└── public/translations/   # Translation files

functions/                 # Firebase Functions
out/                      # Build output (generated)
```

### Production (personatests-websites)
```
index.html               # Main entry point
_next/                  # Next.js static assets
en/, ko/, ja/, etc./    # Locale-specific pages
netlify.toml           # Deployment configuration
_redirects             # Routing rules
```

## 🎯 Best Practices

### Development Guidelines

1. **Code Standards**
   - Use TypeScript for type safety
   - Follow existing naming conventions
   - Write clean, readable code
   - Add comments for complex logic

2. **Testing Strategy**
   - Test manually on `localhost:3004`
   - Test all personality tests
   - Test authentication flows
   - Test email functionality
   - Test multilingual support

3. **Feature Development**
   - Start with small, incremental changes
   - Test each change thoroughly
   - Consider internationalization from the start
   - Maintain backward compatibility

### Deployment Safety

1. **Pre-Deployment Checklist**
   - [ ] Build completes without errors
   - [ ] Local testing passes
   - [ ] All new features work as expected
   - [ ] No broken links or missing assets
   - [ ] Mobile responsiveness verified

2. **Post-Deployment Verification**
   - [ ] Website loads properly
   - [ ] Authentication works
   - [ ] Tests can be taken and completed
   - [ ] Admin features work (if applicable)
   - [ ] Email functionality works

## 🔧 Common Commands

### Development
```bash
npm run dev              # Start development server
npm run dev:stable       # Windows-stable development
npm run build            # Build for production
npm run clean            # Clean cache
npm run lint             # Check code quality
```

### Production Deployment
```bash
deploy-to-production.bat # Automated deployment (Windows)
./deploy-to-production.sh # Automated deployment (Linux/Mac)
```

### Git Workflow
```bash
git checkout -b feature/name    # Create feature branch
git add .                       # Stage changes
git commit -m "description"     # Commit changes
git push origin feature/name    # Push to remote
```

## 🚨 Emergency Procedures

### Rollback Deployment
If something goes wrong with a deployment:

1. **Quick Rollback**
   ```bash
   cd personatests-websites
   git log --oneline -5    # Find previous good commit
   git reset --hard <commit-hash>
   git push --force-with-lease
   ```

2. **Restore from Backup**
   ```bash
   cd personatests-websites
   cp -r backup-YYYYMMDD-HHMMSS/* .
   git add -A
   git commit -m "Restore from backup"
   git push
   ```

### Debug Production Issues

1. **Check Netlify Deploy Logs**
   - Visit Netlify dashboard
   - Check build and deploy logs

2. **Test Locally**
   ```bash
   npm run build
   cd out && python -m http.server 8080
   # Test at http://localhost:8080
   ```

## 📈 Feature Development Examples

### Adding a New Test Type

1. **Development Phase**
   ```typescript
   // Add to src/lib/test-definitions.ts
   export const newTest: TestDefinition = {
     id: 'new-test',
     title: 'New Test',
     // ... configuration
   };
   ```

2. **Add Translations**
   ```json
   // public/translations/en.json
   {
     "tests": {
       "new-test": {
         "title": "New Test",
         "description": "Test description"
       }
     }
   }
   ```

3. **Test and Deploy**
   ```bash
   npm run dev          # Test locally
   npm run build        # Build
   deploy-to-production.bat  # Deploy
   ```

### Adding New Language Support

1. **Create Translation File**
   ```bash
   cp public/translations/en.json public/translations/xx.json
   # Edit xx.json with translations
   ```

2. **Update Locale Configuration**
   ```typescript
   // Update locale list in relevant components
   ```

3. **Test and Deploy**
   ```bash
   npm run dev          # Test new language
   deploy-to-production.bat  # Deploy
   ```

## 📞 Support

- **Development Issues**: Check browser console and Next.js terminal output
- **Deployment Issues**: Check Netlify dashboard and deployment logs
- **Feature Requests**: Document requirements before starting development

## 🔗 Useful Links

- **Production Site**: https://personatests.com
- **Development Server**: http://localhost:3004
- **Netlify Dashboard**: Check your Netlify account
- **Firebase Console**: Check your Firebase project

---

**Remember**: Always test locally before deploying to production!