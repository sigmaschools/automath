# Claude Instructions for Automath Project

## ⚠️ IMPORTANT: Read This First

Before making **any changes** to this project, you MUST read these two documents:

1. **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - Technical documentation
   - Architecture decisions and reasoning
   - Technology stack
   - Implementation details
   - Current state and future considerations

2. **[DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md)** - Design philosophy and decisions
   - Core educational principles
   - Research foundation (Math Academy principles)
   - Design decisions log with alternatives considered
   - Lessons learned and open questions

## Why This Matters

Automath is built on specific learning science principles and design constraints. Every feature, every UI choice, and every piece of code has intentional reasoning behind it. Making changes without understanding this context risks:

- Breaking the low-anxiety environment for K-5 students
- Adding cognitive load instead of reducing it
- Violating research-backed learning principles
- Introducing unnecessary complexity

## Quick Start

```bash
# 1. Read the documentation first
cat PROJECT_CONTEXT.md
cat DESIGN_RATIONALE.md

# 2. Test the current app locally
open automath.html

# 3. Make changes to automath.html

# 4. Copy to index.html for GitHub Pages
cp automath.html index.html

# 5. Commit and push
git add automath.html index.html
git commit -m "Description of changes"
git push -u origin claude/create-automath-app-icRFe
```

## Design Principles Checklist

Before implementing any change, ask:

- ✅ Does this **reduce** cognitive load (or increase it)?
- ✅ Does this **reduce** anxiety (or create it)?
- ✅ Does this support **automaticity development**?
- ✅ Is this necessary for a **5-minute warmup tool**?
- ✅ Does this align with **learning science** research?
- ✅ Can a **kindergartener use it independently**?
- ✅ Does this maintain the **single-file architecture**?

**When in doubt, default to simplicity.** The best feature is often the one you don't add.

## Project Overview

**Automath** is a minimal, browser-based math practice app for K-5 students to develop automaticity in basic arithmetic through adaptive, low-pressure daily warmups.

**Key characteristics:**
- Single HTML file (zero dependencies)
- Adaptive progressive difficulty (4 levels)
- 15 problems per operation
- No timers during practice (reduces anxiety)
- Clean, minimal UI (black text on white)
- ~2-4 minute sessions per operation

**Target: 5 minutes total daily practice across all operations**

## Current File Structure

```
/home/user/automath/
├── automath.html              # Main application (edit this)
├── index.html                 # GitHub Pages entry (copy of automath.html)
├── Claude.md                  # This file - start here every session
├── README.md                  # GitHub repository readme
├── PROJECT_CONTEXT.md         # Technical documentation - READ THIS
├── DESIGN_RATIONALE.md        # Design philosophy - READ THIS
└── .git/
```

## Common Tasks

### Testing Changes
```bash
# Just open in browser
open automath.html
```

### Deploying to GitHub Pages
```bash
# Copy, commit, push
cp automath.html index.html
git add automath.html index.html
git commit -m "Your change description"
git push
# Wait 1-2 minutes, then check: https://sigmaschools.github.io/automath/
```

### Modifying Difficulty Levels
Edit the `problemsAt()` function in automath.html (each level lists every problem it can give)

### Changing Session Length
Edit `totalProblems` variable (line ~260) and update HTML placeholder (line ~209)

### Adjusting Progression Speed
Edit the streak requirement (`needed`) in `recordAnswer()` in the `automath-core` script block, then run `node --test` and `node tests/simulate.js`

### Changing Fact Mastery, Review or Graduation
The constants at the top of the `automath-facts` script block (intervals, the graduation share, the session mix). Run `node --test` and `node tests/simulate-days.js` and compare. Changing any level's problems changes the fact table: bump `FORMAT` (Decision 19)

## Key Implementation Details

**Adaptive Difficulty:**
- 4 levels (1-4), start at Level 1
- Advance: 2 fluent correct answers in a row, fluent = within 3 s (3 to re-enter a level slipped out of this exercise)
- Regress: Immediately on wrong answer
- Session: 15 problems (enough to reach Level 4 and practice there)

**Difficulty Ranges:**
- Level 1: Facts within 5 (addition/subtraction), 0-2× tables (mult/div)
- Level 2: Facts within 10, 0-5× tables
- Level 3: Facts within 20, 0-10× tables
- Level 4: Addition/subtraction facts crossing ten (8 + 7, 13 − 6), 0-12× tables

**UX Flow:**
1. Click operation → immediate practice start
2. 15 problems with adaptive difficulty (vertical layout)
3. View results: summary stats + review table with all problems/answers
4. "Practice Again" returns to operation selection

**Problem Format:**
```
   47
+  28
────
[box]  ← In-box feedback (✓/✗) with colored border/background
Problem 5 of 15
```

## Research Foundation

Based on **The Math Academy Way** principles:
- Mastery learning (demonstrate proficiency before advancing)
- Developing automaticity (instant recall, not calculation)
- Minimizing cognitive load (one problem at a time, minimal UI)
- Adaptive pacing (slower for struggling, faster for excelling)
- Zone of proximal development (appropriate challenge level)

## Future Enhancements (Not Yet Implemented)

**High Priority:**
1. LocalStorage progress tracking (remember difficulty levels across sessions)
2. Mixed practice on the stand-alone picker (Compass runs already alternate mixed and grouped days, Decision 16)
3. Visual progress indicator (subtle dots showing 15 problems)

**Medium Priority:**
4. Keyboard shortcuts (1/2/3/4 for operation selection)
5. Accessibility (ARIA labels, screen reader support)
6. Optional sound feedback (off by default)

**See DESIGN_RATIONALE.md for full list and open questions**

## Remember

This is a **warmup tool**, not a teaching tool:
- No explanations during practice
- No worked examples or hints
- Focus on retrieval, not instruction
- Assumes students learned operations elsewhere

The goal is **automaticity through low-pressure, adaptive practice**.

---

**Human collaborator: When starting a new session, please ask Claude to read this file first.**

Example: "Read Claude.md, then [your task]"
