# 🔐 GitHub Authentication Setup for @brostagni

## The Problem
You're getting: `remote: Invalid username or token. Password authentication is not supported`

**Why?** GitHub stopped accepting passwords in 2021. You need to use a Personal Access Token (PAT) instead.

---

## ✅ Solution: Create a Personal Access Token (Easiest Method)

### Step 1: Create a Personal Access Token

1. **Go to**: https://github.com/settings/tokens
2. **Click**: "Generate new token" → "Generate new token (classic)"
3. **Note**: Give it a name like "AI Prompt Injector"
4. **Expiration**: Choose "90 days" or "No expiration" (your choice)
5. **Select scopes**: Check these boxes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
6. **Click**: "Generate token" at the bottom
7. **IMPORTANT**: Copy the token immediately! (It looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`)
   - **Save it somewhere safe** - you won't see it again!

### Step 2: Use the Token Instead of Password

When Git asks for your password, **paste the token instead**:

```bash
cd /Users/benoitrostagni/Desktop/ai-prompt-injector

# First, let's check if you've already forked the repo
# Go to: https://github.com/brostagni/ai-prompt-injector
# If it doesn't exist, fork it first from: https://github.com/sergemazille/ai-prompt-injector

# Add your fork as remote
git remote add myfork https://github.com/brostagni/ai-prompt-injector.git

# Create feature branch
git checkout -b feature/m365-copilot-support

# Stage your changes
git add manifest.json content.js M365_COPILOT_SUPPORT.md CHANGES_SUMMARY.md CONTRIBUTING_GUIDE.md QUICK_START_GUIDE.md GITHUB_SETUP_FOR_BROSTAGNI.md

# Commit
git commit -m "Add Microsoft 365 Copilot support"

# Push (it will ask for username and password)
git push myfork feature/m365-copilot-support
```

**When prompted:**
- Username: `brostagni`
- Password: **Paste your token** (ghp_xxxxxxxxxxxxxxxxxxxx)

---

## 🎯 Alternative: Store Token Permanently (Recommended)

So you don't have to enter it every time:

### Option A: Use Git Credential Helper (macOS)

```bash
# Tell Git to remember your credentials
git config --global credential.helper osxkeychain

# Now push - it will ask once, then remember
git push myfork feature/m365-copilot-support
```

Enter your token when prompted, and macOS Keychain will save it.

### Option B: Use GitHub CLI (Even Easier!)

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Authenticate
gh auth login

# Follow the prompts:
# - Choose: GitHub.com
# - Choose: HTTPS
# - Authenticate: Yes
# - Choose: Login with a web browser
# - Copy the code and press Enter
# - Browser opens, paste code, authorize

# Now you can push without tokens!
git push myfork feature/m365-copilot-support
```

---

## 📋 Complete Step-by-Step for @brostagni

### Step 1: Fork the Repository

1. Go to: https://github.com/sergemazille/ai-prompt-injector
2. Click "Fork" (top right)
3. This creates: https://github.com/brostagni/ai-prompt-injector

### Step 2: Get Your Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "AI Prompt Injector"
4. Check: `repo` and `workflow`
5. Click "Generate token"
6. **Copy and save the token!**

### Step 3: Configure Git and Push

```bash
cd /Users/benoitrostagni/Desktop/ai-prompt-injector

# Configure Git to remember credentials
git config --global credential.helper osxkeychain

# Add your fork
git remote add myfork https://github.com/brostagni/ai-prompt-injector.git

# Create branch
git checkout -b feature/m365-copilot-support

# Stage files
git add manifest.json content.js *.md

# Commit
git commit -m "Add Microsoft 365 Copilot support

- Added m365.cloud.microsoft to host_permissions and content_scripts
- Added domain-specific selectors for M365 Copilot input field
- Included comprehensive documentation"

# Push (will ask for credentials)
git push myfork feature/m365-copilot-support
```

**When prompted:**
- Username: `brostagni`
- Password: [Paste your token here]

### Step 4: Create Pull Request

1. Go to: https://github.com/brostagni/ai-prompt-injector
2. Click "Compare & pull request"
3. Fill in:
   - **Base repository**: sergemazille/ai-prompt-injector
   - **Base**: main
   - **Head repository**: brostagni/ai-prompt-injector
   - **Compare**: feature/m365-copilot-support
4. Title: "Add Microsoft 365 Copilot support"
5. Description: (copy from QUICK_START_GUIDE.md)
6. Click "Create pull request"

---

## 🆘 Troubleshooting

### "Repository not found"
You need to fork first: https://github.com/sergemazille/ai-prompt-injector

### "Remote already exists"
```bash
git remote remove myfork
# Then try adding it again
```

### "Token doesn't work"
Make sure you:
- Copied the entire token (starts with `ghp_`)
- Selected the `repo` scope when creating it
- Pasted it as the password (not username)

### "Still asking for password every time"
```bash
# Make sure credential helper is set
git config --global credential.helper osxkeychain

# Or use GitHub CLI instead
brew install gh
gh auth login
```

---

## 🔒 Security Tips

1. **Never share your token** - treat it like a password
2. **Don't commit tokens** to repositories
3. **Use expiration dates** for tokens (90 days is good)
4. **Revoke old tokens** you're not using
5. **Use SSH keys** for even better security (advanced)

---

## 🚀 Quick Commands Reference

```bash
# One-time setup
git config --global credential.helper osxkeychain
git remote add myfork https://github.com/brostagni/ai-prompt-injector.git

# Every time you make changes
git checkout -b feature/my-feature-name
git add .
git commit -m "Description of changes"
git push myfork feature/my-feature-name
```

---

## 📞 Need More Help?

- **GitHub Docs**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **GitHub CLI**: https://cli.github.com/
- **Git Credential Helper**: https://git-scm.com/docs/gitcredentials

---

**Your GitHub**: https://github.com/brostagni
**Your Fork** (after forking): https://github.com/brostagni/ai-prompt-injector
**Original Repo**: https://github.com/sergemazille/ai-prompt-injector

---

*Created specifically for @brostagni - January 30, 2026*