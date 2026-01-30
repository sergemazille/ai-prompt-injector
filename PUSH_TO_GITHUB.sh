#!/bin/bash

# Push to GitHub Script for @brostagni
# This script helps you push your M365 Copilot changes to GitHub

echo "🚀 AI Prompt Injector - Push to GitHub"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Please run this script from the ai-prompt-injector directory"
    echo "   cd /Users/benoitrostagni/Desktop/ai-prompt-injector"
    exit 1
fi

echo "📋 Step 1: Checking if you've forked the repository..."
echo "   Go to: https://github.com/brostagni/ai-prompt-injector"
echo "   If it doesn't exist, fork it from: https://github.com/sergemazille/ai-prompt-injector"
echo ""
read -p "Have you forked the repository? (y/n): " forked

if [ "$forked" != "y" ]; then
    echo ""
    echo "Please fork the repository first:"
    echo "1. Go to: https://github.com/sergemazille/ai-prompt-injector"
    echo "2. Click 'Fork' button (top right)"
    echo "3. Run this script again"
    exit 0
fi

echo ""
echo "🔐 Step 2: Authentication Setup"
echo "   GitHub requires a Personal Access Token (not password)"
echo ""
echo "Do you have a Personal Access Token?"
echo "   If NO: See GITHUB_SETUP_FOR_BROSTAGNI.md for instructions"
echo "   If YES: Continue below"
echo ""
read -p "Do you have a token ready? (y/n): " has_token

if [ "$has_token" != "y" ]; then
    echo ""
    echo "📖 Please create a token first:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select 'repo' scope"
    echo "4. Copy the token (starts with ghp_)"
    echo "5. Run this script again"
    echo ""
    echo "Full instructions in: GITHUB_SETUP_FOR_BROSTAGNI.md"
    exit 0
fi

echo ""
echo "⚙️  Step 3: Configuring Git..."

# Configure credential helper
git config --global credential.helper osxkeychain
echo "   ✅ Credential helper configured"

# Check if remote exists
if git remote | grep -q "myfork"; then
    echo "   ✅ Remote 'myfork' already exists"
else
    echo "   Adding remote 'myfork'..."
    git remote add myfork https://github.com/brostagni/ai-prompt-injector.git
    echo "   ✅ Remote added"
fi

echo ""
echo "🌿 Step 4: Creating feature branch..."

# Check if branch exists
if git show-ref --verify --quiet refs/heads/feature/m365-copilot-support; then
    echo "   Branch already exists, switching to it..."
    git checkout feature/m365-copilot-support
else
    echo "   Creating new branch..."
    git checkout -b feature/m365-copilot-support
fi
echo "   ✅ On branch: feature/m365-copilot-support"

echo ""
echo "📦 Step 5: Staging files..."
git add manifest.json content.js M365_COPILOT_SUPPORT.md CHANGES_SUMMARY.md CONTRIBUTING_GUIDE.md QUICK_START_GUIDE.md GITHUB_SETUP_FOR_BROSTAGNI.md PUSH_TO_GITHUB.sh
echo "   ✅ Files staged"

echo ""
echo "💾 Step 6: Committing changes..."
git commit -m "Add Microsoft 365 Copilot support

- Added m365.cloud.microsoft to host_permissions and content_scripts
- Added domain-specific selectors for M365 Copilot input field
- Included comprehensive documentation
- Tested and working on Firefox" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✅ Changes committed"
else
    echo "   ℹ️  No new changes to commit (already committed)"
fi

echo ""
echo "🚀 Step 7: Pushing to GitHub..."
echo ""
echo "⚠️  IMPORTANT: When prompted for credentials:"
echo "   Username: brostagni"
echo "   Password: [Paste your Personal Access Token]"
echo ""
read -p "Press Enter to continue..."

git push myfork feature/m365-copilot-support

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your changes are now on GitHub!"
    echo ""
    echo "🎯 Next Step: Create a Pull Request"
    echo "1. Go to: https://github.com/brostagni/ai-prompt-injector"
    echo "2. Click 'Compare & pull request'"
    echo "3. Fill in the form and submit"
    echo ""
    echo "📖 See QUICK_START_GUIDE.md for detailed PR instructions"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo ""
    echo "1. Invalid token:"
    echo "   - Make sure you copied the entire token (starts with ghp_)"
    echo "   - Token must have 'repo' scope"
    echo "   - Create new token at: https://github.com/settings/tokens"
    echo ""
    echo "2. Repository not found:"
    echo "   - Make sure you forked the repo first"
    echo "   - Check: https://github.com/brostagni/ai-prompt-injector"
    echo ""
    echo "3. Authentication issues:"
    echo "   - See GITHUB_SETUP_FOR_BROSTAGNI.md for detailed help"
    echo ""
fi

# Made with Bob
