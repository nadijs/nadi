#!/bin/bash

# Step 1: Add all files
git add .

# Step 2: Create initial commit
git commit -m "Initial commit: Nadi Framework v0.2.0-alpha.1

- Core packages: @nadi/core, @nadi/compiler, @nadi/router
- CLI tool: create-nadi
- Documentation website
- Example applications
- DevTools extension"

# Step 3: Add remote (replace with your actual repo URL after creating it on GitHub)
git remote add origin https://github.com/nadijs/nadi.git

# Step 4: Push to GitHub
git branch -M main
git push -u origin main

echo "✅ Code pushed to GitHub successfully!"
