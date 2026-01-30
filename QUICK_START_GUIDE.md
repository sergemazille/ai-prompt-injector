# 🚀 Quick Start: Share Your M365 Copilot Support

## TL;DR - Two Simple Options

### Option 1: Just Want to Use It? ✅ You're Done!
The extension works on your computer. No GitHub needed.

### Option 2: Want to Share It? Follow These Steps:

---

## ⚠️ IMPORTANT: Authentication Required!

**Getting "Invalid username or token" error?**
👉 **See GITHUB_SETUP_FOR_BROSTAGNI.md first!** 👈

You need a Personal Access Token to push to GitHub. The guide has step-by-step instructions.

---

## 📤 Publishing to Your GitHub (5 Minutes)

### Step 1: Your GitHub Account ✅
You already have one: https://github.com/brostagni

### Step 2: Fork the Original Repository

1. Go to: https://github.com/sergemazille/ai-prompt-injector
2. Click the **"Fork"** button (top right corner)
3. GitHub creates your copy at: `github.com/brostagni/ai-prompt-injector`

### Step 3: Connect Your Local Files to Your Fork

Open Terminal and run:

```bash
cd /Users/benoitrostagni/Desktop/ai-prompt-injector

# Add your fork as a remote
git remote add myfork https://github.com/brostagni/ai-prompt-injector.git

# Create a feature branch
git checkout -b feature/m365-copilot-support

# Stage your changes
git add manifest.json content.js M365_COPILOT_SUPPORT.md CHANGES_SUMMARY.md CONTRIBUTING_GUIDE.md QUICK_START_GUIDE.md

# Commit with a message
git commit -m "Add Microsoft 365 Copilot support"

# Push to your fork
git push myfork feature/m365-copilot-support
```

**Done!** Your changes are now on your GitHub account.

---

## 🎯 Contributing to the Original Project (10 Minutes)

### Step 1: Push to Your Fork (if not done above)
Follow "Publishing to Your GitHub" steps above.

### Step 2: Create a Pull Request

1. **Go to your fork**: `https://github.com/brostagni/ai-prompt-injector`

2. **You'll see a yellow banner**: 
   ```
   feature/m365-copilot-support had recent pushes
   [Compare & pull request]
   ```

3. **Click**: "Compare & pull request"

4. **Fill in the form**:
   - **Title**: `Add Microsoft 365 Copilot support`
   - **Description**: Copy this:
   
   ```
   This PR adds support for Microsoft 365 Copilot (m365.cloud.microsoft).
   
   Changes:
   - Added m365.cloud.microsoft to manifest.json permissions
   - Added domain-specific selectors for M365 Copilot input field
   - Included documentation
   
   Tested and working on Firefox with Microsoft 365 Copilot.
   ```

5. **Click**: "Create pull request"

6. **Wait**: The maintainer will review (usually within a few days)

**That's it!** You've contributed to open source! 🎉

---

## 🔍 What Happens Next?

### Possible Outcomes:

1. **✅ Merged**: Your code is added to the official extension!
2. **💬 Feedback**: Maintainer asks for changes (normal, don't worry!)
3. **❌ Declined**: Rare, but they might have other plans
4. **⏰ No Response**: Maintainers are busy, be patient

### If They Ask for Changes:

```bash
# Make the requested changes to the files
# Then:
git add .
git commit -m "Address review feedback"
git push myfork feature/m365-copilot-support
```

The PR updates automatically!

---

## 📊 Summary Table

| Action | Time | Difficulty | Benefit |
|--------|------|------------|---------|
| Use locally | 0 min | ✅ Easy | Works for you |
| Push to your GitHub | 5 min | ✅ Easy | Backup + Share |
| Submit Pull Request | 10 min | 🟡 Medium | Help everyone! |

---

## 🆘 Troubleshooting

### "Permission denied" when pushing?
You need to authenticate with GitHub:
- Use GitHub CLI: `gh auth login`
- Or use Personal Access Token
- Or use SSH keys

### "Remote already exists"?
```bash
git remote remove myfork
# Then try again
```

### "Nothing to commit"?
```bash
git status  # Check what's staged
git add manifest.json content.js  # Add files
```

### Need to start over?
```bash
cd /Users/benoitrostagni/Desktop
rm -rf ai-prompt-injector
git clone https://github.com/sergemazille/ai-prompt-injector.git
# Then reapply your changes
```

---

## 🎓 Learn More

- **CONTRIBUTING_GUIDE.md** - Detailed explanation
- **M365_COPILOT_SUPPORT.md** - Technical documentation
- **CHANGES_SUMMARY.md** - What changed

---

## 💡 Pro Tips

1. **Test before pushing** - Make sure it works!
2. **Write clear messages** - Help others understand
3. **Be patient** - Maintainers are volunteers
4. **Celebrate** - You're contributing to open source! 🎉

---

**Questions?** Check CONTRIBUTING_GUIDE.md for detailed answers!

*Last Updated: January 30, 2026*