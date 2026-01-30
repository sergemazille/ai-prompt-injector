# Contributing Your Changes to the Original Project

Great news - your Microsoft 365 Copilot support is working! Here's how to share it with the community.

## Question 1: Should You Put This on Your GitHub?

**YES! Here are the benefits:**

### ✅ Advantages of Publishing to Your GitHub:

1. **Personal Backup**: Your work is safely stored in the cloud
2. **Version Control**: Track changes and revert if needed
3. **Share with Others**: Help people who need M365 Copilot support
4. **Portfolio**: Showcase your contribution to open source
5. **Collaboration**: Others can suggest improvements
6. **Easy Updates**: Pull future updates from the original repo

### 📝 How to Publish to Your GitHub:

#### Option A: Create Your Own Repository (Recommended for Learning)

```bash
cd /Users/benoitrostagni/Desktop/ai-prompt-injector

# Initialize as your own repo
git remote remove origin  # Remove link to original repo
git remote add origin https://github.com/YOUR_USERNAME/ai-prompt-injector-m365.git

# Commit your changes
git add manifest.json content.js M365_COPILOT_SUPPORT.md CHANGES_SUMMARY.md CONTRIBUTING_GUIDE.md
git commit -m "Add Microsoft 365 Copilot support

- Added m365.cloud.microsoft to host_permissions and content_scripts
- Added domain-specific selectors for M365 Copilot input field
- Included comprehensive documentation"

# Create repo on GitHub first, then push
git push -u origin main
```

#### Option B: Fork the Original Repository (Recommended for Contributing)

1. **Go to**: https://github.com/sergemazille/ai-prompt-injector
2. **Click**: "Fork" button (top right)
3. **This creates**: Your own copy at `github.com/YOUR_USERNAME/ai-prompt-injector`

```bash
cd /Users/benoitrostagni/Desktop/ai-prompt-injector

# Add your fork as remote
git remote add myfork https://github.com/YOUR_USERNAME/ai-prompt-injector.git

# Create a feature branch
git checkout -b feature/m365-copilot-support

# Commit your changes
git add manifest.json content.js M365_COPILOT_SUPPORT.md CHANGES_SUMMARY.md CONTRIBUTING_GUIDE.md
git commit -m "Add Microsoft 365 Copilot support

- Added m365.cloud.microsoft to host_permissions and content_scripts
- Added domain-specific selectors for M365 Copilot input field
- Included comprehensive documentation"

# Push to your fork
git push myfork feature/m365-copilot-support
```

---

## Question 2: How to Contribute to the Original Project

### 🎯 Step-by-Step Guide to Submit a Pull Request

#### Step 1: Prepare Your Fork (if not done already)

If you followed Option B above, you're ready. Otherwise:

1. Fork the repository on GitHub: https://github.com/sergemazille/ai-prompt-injector
2. Add your fork as a remote:
   ```bash
   cd /Users/benoitrostagni/Desktop/ai-prompt-injector
   git remote add myfork https://github.com/YOUR_USERNAME/ai-prompt-injector.git
   ```

#### Step 2: Create a Clean Feature Branch

```bash
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Create a new branch for your feature
git checkout -b feature/m365-copilot-support

# Verify your changes
git status
```

#### Step 3: Commit Your Changes

```bash
# Stage the files
git add manifest.json content.js M365_COPILOT_SUPPORT.md CHANGES_SUMMARY.md

# Create a descriptive commit
git commit -m "Add Microsoft 365 Copilot support

This commit adds support for Microsoft 365 Copilot (m365.cloud.microsoft) 
to the AI Prompt Injector extension.

Changes:
- Added m365.cloud.microsoft to host_permissions in manifest.json
- Added m365.cloud.microsoft to content_scripts matches in manifest.json
- Added domain-specific selectors for M365 Copilot input field in content.js
- Included comprehensive documentation in M365_COPILOT_SUPPORT.md
- Added quick reference guide in CHANGES_SUMMARY.md

Tested and working on Firefox with Microsoft 365 Copilot web interface."
```

#### Step 4: Push to Your Fork

```bash
# Push your branch to your fork
git push myfork feature/m365-copilot-support
```

#### Step 5: Create a Pull Request on GitHub

1. **Go to your fork**: `https://github.com/YOUR_USERNAME/ai-prompt-injector`
2. **You'll see**: A yellow banner saying "Compare & pull request"
3. **Click**: "Compare & pull request" button
4. **Fill in the PR form**:

   **Title**: 
   ```
   Add Microsoft 365 Copilot support
   ```

   **Description**:
   ```markdown
   ## Description
   This PR adds support for Microsoft 365 Copilot (m365.cloud.microsoft) to the AI Prompt Injector extension.

   ## Changes Made
   - ✅ Added `m365.cloud.microsoft` to `host_permissions` in manifest.json
   - ✅ Added `m365.cloud.microsoft` to `content_scripts.matches` in manifest.json
   - ✅ Added domain-specific selectors for M365 Copilot input field in content.js
   - ✅ Included comprehensive documentation

   ## Testing
   - Tested on Firefox (latest version)
   - Verified prompt injection works correctly on Microsoft 365 Copilot
   - Confirmed no breaking changes to existing functionality

   ## Documentation
   - Added M365_COPILOT_SUPPORT.md with detailed setup and troubleshooting
   - Added CHANGES_SUMMARY.md for quick reference

   ## Screenshots
   [Optional: Add a screenshot of it working]

   ## Checklist
   - [x] Code follows the project's style
   - [x] Tested locally and works as expected
   - [x] Documentation included
   - [x] No breaking changes
   ```

5. **Click**: "Create pull request"

#### Step 6: Wait for Review

The maintainer (sergemazille) will:
- Review your code
- Test it
- Possibly request changes
- Merge it if everything looks good

**Be patient and responsive** - maintainers are often busy!

---

## 📋 Best Practices for Contributing

### ✅ DO:
- **Test thoroughly** before submitting
- **Write clear commit messages** explaining what and why
- **Include documentation** for new features
- **Be respectful** in all communications
- **Respond to feedback** promptly
- **Keep PRs focused** - one feature per PR

### ❌ DON'T:
- Submit untested code
- Make unrelated changes in the same PR
- Take criticism personally
- Ignore maintainer feedback
- Submit duplicate PRs

---

## 🔄 Keeping Your Fork Updated

After your PR is merged (or to get latest changes):

```bash
# Add original repo as upstream (if not done)
git remote add upstream https://github.com/sergemazille/ai-prompt-injector.git

# Fetch latest changes
git fetch upstream

# Update your main branch
git checkout main
git merge upstream/main

# Push to your fork
git push myfork main
```

---

## 🎓 Learning Resources

### Git & GitHub:
- [GitHub's Pull Request Guide](https://docs.github.com/en/pull-requests)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [First Contributions](https://github.com/firstcontributions/first-contributions)

### Open Source Etiquette:
- Be patient - maintainers are volunteers
- Accept that your PR might be rejected
- Learn from feedback
- Celebrate when merged! 🎉

---

## 🚀 Quick Command Reference

```bash
# Fork workflow
git clone https://github.com/YOUR_USERNAME/ai-prompt-injector.git
cd ai-prompt-injector
git remote add upstream https://github.com/sergemazille/ai-prompt-injector.git
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "Description of changes"
git push origin feature/my-feature
# Then create PR on GitHub

# Update from upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 💡 Alternative: Just Share Your Fork

If you don't want to submit a PR, you can:
1. Push to your own GitHub repository
2. Share the link with people who need M365 Copilot support
3. Add a note in the README that it's a fork with M365 support

This is perfectly fine and still helps the community!

---

## 🤝 Need Help?

- **GitHub Issues**: Ask questions on the original repo's issues
- **Discussions**: Many repos have a Discussions tab
- **Email**: Contact the maintainer (check their GitHub profile)
- **Community**: Join relevant Discord/Slack channels

---

**Good luck with your contribution! The open source community appreciates your work! 🌟**

---

*Last Updated: January 30, 2026*