#!/bin/bash
# Build script for Render.com
# Run this as the Build Command in your Render service.
set -e

echo "→ Installing dependencies..."
pnpm install --frozen-lockfile

echo "→ Pushing DB schema to Neon..."
pnpm --filter @workspace/db run push

echo "→ Building React frontend..."
BASE_PATH=/ pnpm --filter @workspace/heave-games run build

echo "→ Building API server..."
pnpm --filter @workspace/api-server run build

echo "✓ Build complete."
