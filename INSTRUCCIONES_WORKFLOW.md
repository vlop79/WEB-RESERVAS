# 📋 Instrucciones para Crear el Workflow de GitHub Actions

Sigue estos pasos para crear manualmente el workflow de despliegue automático a Vercel.

## Paso 1: Ir a tu repositorio

Ve a: **https://github.com/vlop79/WEB-RESERVAS**

## Paso 2: Crear el archivo del workflow

1. Haz clic en **"Add file"** (arriba a la derecha)
2. Selecciona **"Create new file"**
3. En el campo de nombre del archivo, escribe exactamente:
   \`\`\`
   .github/workflows/vercel-deploy.yml
   \`\`\`

## Paso 3: Copiar el contenido del workflow

```yaml
name: Vercel Production Deployment

env:
  VERCEL_ORG_ID: \${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: \${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - main

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=\${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=\${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=\${{ secrets.VERCEL_TOKEN }}
```

## Paso 4: Configurar los Secrets

Ve a Settings → Secrets and variables → Actions y añade:

1. **VERCEL_TOKEN**: Obtén en https://vercel.com/account/tokens
2. **VERCEL_ORG_ID**: En Vercel Settings → General → Team ID
3. **VERCEL_PROJECT_ID**: En Vercel Settings → General → Project ID

Ver GITHUB_ACTIONS_SETUP.md para instrucciones detalladas.
