#!/bin/sh

# React + Vite + Yarn + Netlify Deploy Script
# Usage: ./deploy.sh [project-name]

set -e

PROJECT_NAME="${1:-my-react-app}"
BUILD_DIR="dist"

printf "=== React Vite Netlify Deploy ===\n\n"

# STEP 1: Load Environment Variables
printf "1. Loading environment variables...\n"
if [ -f ".env.production" ]; then
    printf "   ✓ Loading .env.production\n"
    set -a
    . ./.env.production
    set +a
elif [ -f ".env" ]; then
    printf "   ✓ Loading .env\n"
    set -a
    . ./.env
    set +a
else
    printf "   ℹ No environment file found\n"
fi

# STEP 2: Check Prerequisites
printf "\n2. Checking tools...\n"
if ! command -v node >/dev/null 2>&1; then
    printf "   ✗ Node.js required\n"
    exit 1
fi
if ! command -v yarn >/dev/null 2>&1; then
    printf "   → Installing Yarn...\n"
    npm install -g yarn
fi
if ! command -v netlify >/dev/null 2>&1; then
    printf "   → Installing Netlify CLI...\n"
    npm install -g netlify-cli
fi
printf "   ✓ All tools ready\n"

# STEP 3: Install Dependencies
printf "\n3. Installing dependencies...\n"
yarn install
printf "   ✓ Dependencies installed\n"

# STEP 4: Build Project
printf "\n4. Building project...\n"
yarn build

# Check build output
if [ ! -d "$BUILD_DIR" ]; then
    if [ -d "build" ]; then
        BUILD_DIR="build"
    else
        printf "   ✗ Build failed - no output directory\n"
        exit 1
    fi
fi
printf "   ✓ Build completed → $BUILD_DIR\n"

# STEP 5: Configure Netlify
printf "\n5. Configuring Netlify...\n"
if [ ! -f "netlify.toml" ]; then
    cat > netlify.toml << EOF
[build]
  publish = "$BUILD_DIR"
  command = "yarn build"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
    printf "   ✓ Created netlify.toml\n"
else
    printf "   ✓ Using existing netlify.toml\n"
fi

# STEP 6: Authenticate Netlify
printf "\n6. Checking Netlify auth...\n"
if ! netlify status >/dev/null 2>&1; then
    printf "   → Please login to Netlify\n"
    netlify login
fi
printf "   ✓ Authenticated\n"

# STEP 7: Deploy
printf "\n7. Deploying to Netlify...\n"
if [ -f ".netlify/state.json" ]; then
    printf "   → Deploying to existing site...\n"
else
    printf "   → Creating new site...\n"
fi

netlify deploy --prod --dir="$BUILD_DIR"

# STEP 8: Get Site URL
printf "\n8. Getting site URL...\n"
SITE_URL=$(netlify status 2>/dev/null | grep -i "url:" | head -1 | sed 's/.*url: *//' | sed 's/ .*//' || echo "")

if [ -n "$SITE_URL" ]; then
    printf "   ✓ Site URL: $SITE_URL\n"
else
    printf "   ℹ Use 'netlify status' to see site details\n"
fi

printf "\n=== Deploy Complete ===\n"
printf "Build: $BUILD_DIR\n"
if [ -n "$SITE_URL" ]; then
    printf "Live: $SITE_URL\n"
fi
printf "\n"