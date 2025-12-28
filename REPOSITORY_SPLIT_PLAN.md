# Repository Split Plan

## Current Structure Problem
Everything is in one repo (184MB+ for website alone). This makes:
- Main repo slower to clone
- CI/CD runs for all projects even when only one changes
- Harder for contributors to focus on specific areas

## New Multi-Repo Structure (Vue.js Style)

### 1. Main Monorepo: `nadijs/nadi` (Keep)
**Purpose:** Core framework packages for npm

**Contents:**
- ✅ `packages/` - All npm packages (core, compiler, router, forms, etc.)
- ✅ `examples/` - Simple .nadi file examples (Counter, TodoApp)
- ✅ `README.md`, `LICENSE`, `CONTRIBUTING.md`
- ✅ `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- ✅ `.github/workflows/` - CI for packages only

**Remove:**
- ❌ `website/` → Move to `nadijs/docs`
- ❌ `devtools/` → Move to `nadijs/devtools`
- ❌ `sample_apps/` → Move to `nadijs/sample-apps`
- ❌ `playground/` → Move to `nadijs/playground`

---

### 2. New Repo: `nadijs/docs`
**Purpose:** Documentation website (nadijs.org)

**Contents:**
- `website/` → Root of new repo
- Separate CI/CD for docs deployment
- Independent versioning from core packages

**Setup:**
```bash
# From current website/
git init
npm install
npm run docs:dev
```

---

### 3. New Repo: `nadijs/devtools`
**Purpose:** Browser extension for debugging

**Contents:**
- `devtools/` → Root of new repo
- Chrome/Firefox extension packaging
- Independent release cycle

---

### 4. New Repo: `nadijs/sample-apps`
**Purpose:** Full example applications

**Contents:**
- `sample_apps/` → Root of new repo
- Each app as subdirectory
- Independent from core package versions

---

### 5. New Repo: `nadijs/playground`
**Purpose:** Development testing environment

**Contents:**
- `playground/` → Root of new repo
- Quick testing of framework features
- Can use published npm packages

---

## Migration Steps

### Step 1: Create GitHub Repositories
```bash
# Via GitHub UI at https://github.com/organizations/nadijs/repositories/new
# Create 4 new repos:
# - nadijs/docs
# - nadijs/devtools  
# - nadijs/sample-apps
# - nadijs/playground
```

### Step 2: Extract and Push Subdirectories

**For docs:**
```bash
cd /Users/ajaydev/Documents/AI/Nadi
git subtree split -P website -b docs-branch
mkdir ../nadi-docs && cd ../nadi-docs
git init
git pull ../Nadi docs-branch
git remote add origin https://github.com/nadijs/docs.git
git push -u origin main
```

**Repeat for devtools, sample-apps, playground**

### Step 3: Clean Main Repo
```bash
cd /Users/ajaydev/Documents/AI/Nadi
git rm -rf website devtools sample_apps playground
git commit -m "chore: split monorepo - move website, devtools, sample-apps, playground to separate repos"
```

### Step 4: Update References
- Update main README with links to new repos
- Update CONTRIBUTING.md
- Update package.json scripts if needed
- Create REPOSITORIES.md listing all repos

---

## Advantages

### For Core Packages
- ✅ Faster clones (remove 184MB website)
- ✅ Focused CI/CD
- ✅ Cleaner contribution workflow
- ✅ Package-only changes don't trigger docs rebuilds

### For Documentation
- ✅ Independent deployment
- ✅ Non-technical contributors can focus on docs only
- ✅ Different release schedule

### For DevTools
- ✅ Browser extension release cycle separate from core
- ✅ Easier to manage browser store submissions

### For Examples
- ✅ Can test against published npm packages
- ✅ Independent updates without touching core

---

## References

See how other frameworks organize:
- **Vue.js:** `vuejs/core` (packages) + `vuejs/docs` + `vuejs/devtools`
- **React:** `facebook/react` (packages) + `reactjs/react.dev` (docs)
- **Svelte:** `sveltejs/svelte` (packages) + `sveltejs/sites` (docs)
