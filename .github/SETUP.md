# Repository Setup

After creating your repository from this template, follow these steps to set up Docker deployment:

## 1. Enable GitHub Container Registry

GitHub Container Registry is automatically available for all repositories. No additional setup required.

## 2. Configure Repository Settings

### Package Permissions
1. Go to your repository Settings
2. Scroll to "Actions" → "General"
3. Under "Workflow permissions", ensure:
   - ✅ "Read and write permissions" is selected
   - ✅ "Allow GitHub Actions to create and approve pull requests" is checked

### Environments (Optional)
Create deployment environments for better control:

1. Go to repository Settings → Environments
2. Create "staging" environment
3. Create "production" environment
4. Add protection rules as needed (required reviewers, etc.)

## 3. Update Docker Image References

Update the following files with your actual GitHub username/organization:

### `.github/workflows/docker-build-deploy.yml`
- The workflow automatically uses `${{ github.repository }}` which resolves to `username/repository-name`

### `Dockerfile`
```dockerfile
# Update these labels with your repository URL
LABEL org.opencontainers.image.url="https://github.com/totosan/ColorTimer" \
    org.opencontainers.image.source="https://github.com/totosan/ColorTimer"
```

### `README.md`
```markdown
# Update the Docker pull commands
docker run -p 8080:8080 ghcr.io/totosan/colortimer:latest
```

## 4. First Release

To create your first release and trigger production deployment:

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

This will:
- Build and push Docker image with `v1.0.0` tag
- Deploy to production environment (if configured)
- Create a GitHub release

## 5. Development Workflow

1. **Feature Development**: Create feature branches
2. **Testing**: Push triggers test workflow on PRs
3. **Staging**: Merge to main deploys to staging
4. **Production**: Create version tags for production deployment

## 6. Monitoring

After setup, monitor your deployments:

- **Actions tab**: View build and deployment status
- **Packages tab**: View published Docker images
- **Security tab**: View vulnerability scan results

## 7. Customization

### Add Deployment Scripts
Edit the deployment steps in `.github/workflows/docker-build-deploy.yml`:

```yaml
# For staging deployment
- name: Deploy to staging
  run: |
    echo "🚀 Deploying to staging environment"
    # Add your staging deployment commands here
    # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:latest

# For production deployment
- name: Deploy to production
  run: |
    echo "🎉 Deploying to production environment"
    # Add your production deployment commands here
    # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.ref_name }}
```

### Add Secrets
If your deployment needs additional secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Add repository secrets:
   - `KUBECONFIG` (for Kubernetes)
   - `SSH_PRIVATE_KEY` (for server deployment)
   - `WEBHOOK_URL` (for deployment notifications)

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure workflow permissions are set correctly
2. **Image Push Failed**: Check if GitHub Container Registry is enabled
3. **Deployment Failed**: Verify environment configuration and secrets

### Getting Help

- Check the [Docker CI/CD documentation](.github/DOCKER_CI_CD.md)
- Review GitHub Actions logs
- Check container registry for published images
