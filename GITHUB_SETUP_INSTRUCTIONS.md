# GitHub Setup Instructions

Follow these steps to push Nadi Framework to GitHub:

## Step 1: Create GitHub Repository (Manual - 2 minutes)

1. **Go to:** https://github.com/organizations/nadijs/repositories/new

2. **Repository settings:**
   - **Name:** `nadi`
   - **Description:** `Ultra-lightweight reactive framework with fine-grained signals`
   - **Visibility:** ✅ Public
   - **Initialize:** ❌ Do NOT add README, .gitignore, or license (we already have them)

3. **Click:** "Create repository"

## Step 2: Push Code to GitHub (Run Commands)

After creating the repository on GitHub, run this command:

```bash
cd /Users/ajaydev/Documents/AI/Nadi
bash .github-setup-commands.sh
```

This will:

- ✅ Stage all files
- ✅ Create initial commit
- ✅ Add GitHub remote
- ✅ Push to main branch

**Alternative (Manual commands):**

```bash
cd /Users/ajaydev/Documents/AI/Nadi

# Add all files
git add .

# Create commit
git commit -m "Initial commit: Nadi Framework v0.2.0-alpha.1

- Core packages: @nadi/core, @nadi/compiler, @nadi/router
- CLI tool: create-nadi
- Documentation website
- Example applications
- DevTools extension"

# Add remote
git remote add origin https://github.com/nadijs/nadi.git

# Push code
git branch -M main
git push -u origin main
```

## Step 3: Configure Repository Settings (Manual - 1 minute)

Once code is pushed, configure the repository:

### A. Add Topics

1. Go to: https://github.com/nadijs/nadi
2. Click on the gear icon (⚙️) next to "About"
3. Add topics: `javascript`, `framework`, `reactive`, `signals`, `typescript`, `ui-framework`
4. Click "Save changes"

### B. Configure Description

1. In the same "About" section:
   - **Description:** `Ultra-lightweight reactive framework with fine-grained signals`
   - **Website:** `https://nadijs.org`
2. Click "Save changes"

### C. Enable Discussions (Optional but Recommended)

1. Go to Settings → Features
2. Check ✅ "Discussions"
3. Click "Set up discussions"

### D. Add Repository Social Card (Optional)

1. Go to Settings → General
2. Scroll to "Social preview"
3. Upload an image (1280x640px) for social sharing

## Step 4: Verify Everything

Check that:

- ✅ Code is visible at https://github.com/nadijs/nadi
- ✅ Topics are displayed
- ✅ Website link works
- ✅ README renders correctly
- ✅ All packages are in `packages/` directory

## Step 5: Next Steps

Now you're ready to:

1. Proceed with the 5-step alpha publishing plan
2. Update package.json files with repository URLs
3. Publish packages to npm

---

## Troubleshooting

**If push fails with authentication error:**

```bash
# Use GitHub CLI
gh auth login

# Or configure SSH
# Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

**If remote already exists:**

```bash
git remote remove origin
git remote add origin https://github.com/nadijs/nadi.git
```

**To force push (use with caution):**

```bash
git push -u origin main --force
```
