# GitHub Integration & Deployment Guide

## Setting Up GitHub Repository

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Campus Career System v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campus-career-system.git
git push -u origin main
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `campus-career-system`
3. Description: `Full-stack application connecting students with career opportunities`
4. Make it **Public** or **Private** as needed
5. Click "Create repository"

### 3. GitHub Secrets Configuration
Add these secrets to your repository (`Settings > Secrets > Actions`):

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/campus-career
JWT_SECRET = your-production-jwt-secret-min-32-chars
HEROKU_API_KEY = your-heroku-api-key
HEROKU_APP_NAME = your-app-name
VERCEL_TOKEN = your-vercel-token
VERCEL_PROJECT_ID = your-project-id
```

## CI/CD Pipeline

### Automated Testing (Backend & Frontend)
- Triggers on push/PR to `main` or `develop`
- Runs linting, tests, and security checks
- Validates MongoDB integration
- Code coverage reports

### Automated Deployment
- Deploys to production on push to `main`
- Backend: Deploy to Heroku, AWS, or DigitalOcean
- Frontend: Deploy to Vercel or Netlify

## Deployment Options

### Option 1: Heroku Deployment (Backend)

**Setup:**
```bash
npm install -g heroku
heroku login
heroku create your-app-name
```

**Add to GitHub Actions** (`.github/workflows/deploy-heroku.yml`):
```yaml
- name: Deploy to Heroku
  env:
    HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
  run: |
    git remote add heroku https://git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git
    git push heroku main
```

**Environment Variables on Heroku:**
```bash
heroku config:set MONGO_URI=your-connection-string
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

### Option 2: AWS Elastic Beanstalk (Backend)

**Setup:**
```bash
pip install awsebcli
eb init -p node.js-18 campus-career-backend
eb create campus-career-env
```

**Deploy:**
```bash
eb deploy
```

### Option 3: DigitalOcean App Platform (Full Stack)

1. Connect GitHub repository
2. Select app specification (Node.js backend + React frontend)
3. Configure environment variables
4. Auto-deploy on push to `main`

### Option 4: Vercel (Frontend)

1. Visit https://vercel.com/new
2. Import GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend.com/api`

### Option 5: Netlify (Frontend)

1. Visit https://app.netlify.com/
2. Connect GitHub
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: `frontend`
4. Add environment variables in Site Settings

## Production Checklist

### Before Deploying to Production:

- [ ] Update `.env.production` with real credentials
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Enable CORS with specific origins only
- [ ] Configure MongoDB Atlas security (IP whitelist)
- [ ] Set `NODE_ENV=production`
- [ ] Set `GENERATE_SOURCEMAP=false` in frontend
- [ ] Test all API endpoints
- [ ] Run security audit: `npm audit`
- [ ] Test authentication flows
- [ ] Verify email validation
- [ ] Check error logging
- [ ] Set up monitoring/alerts
- [ ] Backup database
- [ ] Review all environment variables
- [ ] Test payment integration (if applicable)

### Post-Deployment:

- [ ] Monitor error logs
- [ ] Check application performance
- [ ] Test user registration and login
- [ ] Verify API endpoints
- [ ] Monitor database usage
- [ ] Check CI/CD pipeline status
- [ ] Update documentation with prod URLs

## Monitoring & Logging

### Application Monitoring
```bash
# View logs on Heroku
heroku logs --tail

# View logs on AWS
aws logs tail /aws/elasticbeanstalk/campus-career-env/var/log/eb-activity.log

# View logs on DigitalOcean App Platform
doctl apps logs get campus-career-id
```

### Database Monitoring
- MongoDB Atlas Dashboard: https://account.mongodb.com/
- Monitor query performance
- Check disk usage
- Set up alerts for connection issues

### Error Tracking
- Implement Sentry for error monitoring
- Enable application insights on Azure
- CloudWatch on AWS

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Run security audits: `npm audit fix`
- Monitor logs and performance
- Backup MongoDB data weekly
- Update SSL certificates

### CI/CD Maintenance
- Review and update GitHub Actions workflows
- Rotate API keys and secrets annually
- Update Node.js version in workflows
- Review deployment logs for errors

## Rollback Procedure

### Heroku Rollback
```bash
heroku releases
heroku rollback v#
```

### GitHub Rollback
```bash
git revert <commit-hash>
git push origin main
```

### Database Rollback
- Use MongoDB backup restore
- Atlas: Restore to point-in-time

## Security Best Practices

1. **Never commit secrets** to GitHub
2. **Use environment variables** for all sensitive data
3. **Enable branch protection** on `main` branch
4. **Require PR reviews** before merging
5. **Use secrets rotation** for API keys
6. **Enable 2FA** on GitHub account
7. **Monitor for vulnerabilities** with Dependabot
8. **Sign commits** with GPG key
9. **Regular security audits** with `npm audit`
10. **Keep dependencies updated**

## Troubleshooting Deployments

### Build Failures
- Check build logs
- Verify all dependencies are in `package.json`
- Ensure correct Node.js version
- Check for hardcoded paths

### Runtime Errors
- Check error logs
- Verify environment variables
- Test database connection
- Review API responses

### Performance Issues
- Check database indexes
- Monitor API response times
- Use caching where appropriate
- Optimize frontend bundle size
- Consider CDN for static assets

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Heroku Deployment Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated**: January 2026
