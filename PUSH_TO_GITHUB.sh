#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# CarbonTrace — Push to GitHub
# Run this script from the folder where you unzipped carbontrace-final.zip
# Usage: bash PUSH_TO_GITHUB.sh
# ─────────────────────────────────────────────────────────────────
set -e

REPO_URL="https://github.com/aryanb1906/carbon-intern.git"

echo "🌿 CarbonTrace — Pushing to GitHub..."
echo ""

# Check git installed
if ! command -v git &> /dev/null; then
  echo "❌ git not found. Install it from https://git-scm.com"
  exit 1
fi

cd "$(dirname "$0")"

# Init git if not already done
if [ ! -d ".git" ]; then
  git init
  git config user.email "you@example.com"
  git config user.name "CarbonTrace"
fi

# Stage and commit if there are changes
git add -A
if git diff --cached --quiet; then
  echo "✓ Nothing new to commit — already up to date."
else
  git commit -m "feat: CarbonTrace ESG platform — complete build"
fi

# Set remote
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# Rename branch to main
git branch -M main

echo ""
echo "📤 Pushing 119 files to $REPO_URL ..."
echo "   (You may be prompted for your GitHub username + Personal Access Token)"
echo ""

git push -u origin main --force

echo ""
echo "✅ Done! View your repo at:"
echo "   https://github.com/aryanb1906/carbon-intern"
