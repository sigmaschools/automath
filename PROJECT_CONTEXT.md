# Automath - Project Context

## Project Overview

**Automath** is a minimal, browser-based math practice application designed for K-5 students to develop automaticity in basic arithmetic operations through daily warmup exercises.

### Purpose
- Enable students to practice basic math facts (addition, subtraction, multiplication, division)
- Develop automaticity through adaptive, focused practice sessions
- Provide a 5-minute or less daily warmup tool
- Minimize anxiety and cognitive load while maximizing effective practice time

### Target Users
- **Primary**: K-5 students (ages 5-11)
- **Secondary**: Teachers and parents facilitating daily math practice

### Key Characteristics
- Single-file HTML application (no dependencies, no build process)
- Adaptive progressive difficulty based on real-time performance
- Clean, minimal interface free of distracting elements
- Runs entirely in-browser with no backend required
- Deployable to any static hosting (currently GitHub Pages)

---

## Architecture & Design Decisions

### Single-File Architecture

**Decision**: Implement as a single HTML file with embedded CSS and JavaScript.

**Reasoning**:
- **Portability**: Easy to download, share, and run anywhere
- **Simplicity**: No build process, no dependencies, no configuration
- **Accessibility**: Students can open directly from local filesystem or web
- **Deployment**: Simple GitHub Pages hosting with zero configuration
- **Maintenance**: Everything in one place, easy to understand and modify

**Trade-offs**:
- Limited modularity (acceptable for this scope)
- No code splitting (file size ~15KB, negligible)
- No external library benefits (don't need them for this use case)

### Adaptive Difficulty System

**Decision**: Use a 4-level adaptive difficulty system with streak-based progression.

**Reasoning**:
- **Alignment with learning science**: Implements zone of proximal development
- **Mastery learning**: Students must demonstrate competence (3 correct in a row) before advancing
- **Supportive scaffolding**: Immediate difficulty reduction on errors prevents frustration
- **Appropriate ceiling**: Level 4 cap matches K-5 curriculum expectations

**Implementation Details**:
```javascript
// 4 difficulty levels (1-4)
// Progression: +1 level after 3 consecutive correct answers
// Regression: -1 level immediately after any wrong answer
// Session: 15 problems (enough to reach max difficulty: 3+3+3+6 = 15)
```

**Difficulty Level Ranges**:

| Operation | Level 1 | Level 2 | Level 3 | Level 4 |
|-----------|---------|---------|---------|---------|
| Addition | Facts ≤5 | Facts ≤10 | Facts ≤20 | 2-digit ≤75 |
| Subtraction | Facts ≤5 | Facts ≤10 | Facts ≤20 | 2-digit ≤75 |
| Multiplication | 0-2× tables | 0-5× tables | 0-10× tables | 0-12× tables |
| Division | 0-2÷ tables | 0-5÷ tables | 0-10÷ tables | 0-12÷ tables |

### Session Structure

**Decision**: 15 problems per operation, no time limit during practice.

**Reasoning**:
- **Math**: 15 problems allows reaching Level 4 (3+3+3 to reach Level 4, then 6 problems at target difficulty)
- **Time**: ~2-4 minutes at automaticity level, fits 5-minute warmup goal (4 operations)
- **Predictability**: Fixed count reduces anxiety vs. timed practice
- **Progress visibility**: Students see "Problem X of 15" and know endpoint

**Alternative considered**: Time-based (60 seconds) - rejected due to anxiety concerns

### User Experience Flow

**Decision**: Direct-to-practice flow with no intermediate steps.

**Reasoning**:
- **Speed**: Click operation → immediate practice (removes friction)
- **Focus**: Eliminates decision fatigue from difficulty selection
- **Daily warmup context**: Students want to jump in quickly each morning

**Flow**:
1. Select operation (Addition/Subtraction/Multiplication/Division)
2. Immediately start practice at Level 1
3. Complete 15 problems with adaptive difficulty
4. View results (score, accuracy, time)
5. Click "Practice Again" to return to operation selection

### Minimal UI Design

**Decision**: Extreme minimalism - black text on white, large clear typography, no animations.

**Reasoning**:
- **Cognitive load**: Nothing to distract from math problems
- **Accessibility**: High contrast, large text (72px for problems and input)
- **Anxiety reduction**: No countdown timers, pressure indicators, or flashy elements
- **Speed**: No animations between problems (400ms feedback delay only)

**Visual Hierarchy & Layout**:
- **Vertical problem format**: Mimics pencil-and-paper arithmetic
  ```
     47
  +  28
  ─────
  [box]
  ```
- Problem display: 72px, right-aligned for place value alignment
- Answer input: 72px, right-aligned to match numbers above
- Operator: Absolutely positioned on left, consistent across all problems
- Feedback: In-box (✓/✗ as placeholder) with colored border and background
- Progress counter: 14px, positioned below answer box

### Feedback Mechanism

**Decision**: In-box visual feedback with colored borders/backgrounds and 400ms delay before next problem.

**Implementation**:
- **Correct answers**: Green border-top, light green background, green ✓ appears in answer box
- **Incorrect answers**: Red border-top, light red background, red ✗ appears in answer box
- Answer is cleared and feedback appears as placeholder text (keeps focus in one place)
- Cursor hidden during feedback (caret-color: transparent)

**Reasoning**:
- **Focused attention**: Feedback appears where student is already looking (in the answer box)
- **Clarity**: Color + symbol provides redundant encoding (better accessibility)
- **Speed**: 400ms is fast enough to maintain flow state
- **Low pressure**: No sound by default, no penalty beyond difficulty adjustment
- **Automaticity focus**: Quick feedback loop reinforces instant recall

---

## Technology Stack

### HTML5
- **Why**: Universal browser support, semantic structure
- **Version**: Living standard (all modern features available)
- **Usage**: Minimal DOM structure, three main screens (start/practice/results)

### CSS3
- **Why**: Native styling, no framework overhead
- **Approach**: Simple utility classes, flexbox for layout
- **Features**: Responsive design (viewport units, max-width container)

### Vanilla JavaScript (ES6+)
- **Why**: Zero dependencies, maximum portability, sufficient for scope
- **Features used**:
  - `let`/`const` for scoping
  - Template literals for string interpolation
  - Arrow functions for callbacks
  - `Math.random()` for problem generation
  - `setTimeout` for feedback delays
  - DOM manipulation (classList, querySelector)

**No frameworks needed because**:
- Simple state management (8 variables)
- Minimal DOM updates (problem display, feedback, results)
- No complex data flow or component hierarchy
- No routing (3 screens managed with CSS classes)

### Deployment: GitHub Pages
- **Why**: Free, fast, integrated with repository
- **Configuration**: Deploy from branch `claude/create-automath-app-icRFe`
- **URL pattern**: `https://<username>.github.io/automath/`
- **Updates**: Automatic on push (1-2 minute deploy time)

---

## File Structure

```
/home/user/automath/
├── automath.html          # Main application file
├── index.html             # GitHub Pages entry point (copy of automath.html)
├── Claude.md              # Entry point - read this first each session
├── PROJECT_CONTEXT.md     # This file - technical documentation
├── DESIGN_RATIONALE.md    # Conceptual and decision documentation
├── README.md              # GitHub repository readme
└── .git/                  # Git repository
```

### Key Files

**automath.html**
- Complete self-contained application
- Sections: HTML structure, CSS styles, JavaScript logic
- ~450 lines total (~150 HTML, ~100 CSS, ~200 JS)

**index.html**
- Exact copy of automath.html for GitHub Pages root deployment
- Kept in sync via `cp automath.html index.html` before commits

---

## Implementation Details

### Problem Generation Algorithm

Problems are generated dynamically based on current difficulty level and operation type:

```javascript
function generateProblem(operation, difficultyLevel) {
    // Generates random problem within difficulty constraints
    // Returns: { num1, num2, operator, answer }
}
```

**Key constraints**:
- Addition/Subtraction: Positive integers only, no negatives
- Division: Always produces whole number results (no remainders)
- Multiplication: Commutative (either order acceptable for input)
- Random distribution: Uniform within difficulty range

### Problem Quality Controls

To ensure high-quality practice sessions, the app implements validation to prevent:

**1. Duplicate Problems**
- Exact duplicates: Same problem won't appear twice (7 × 2)
- Commutative duplicates: For addition/multiplication, (7 × 2) and (2 × 7) treated as same problem
- Implementation: Normalized problem tracking in `sessionProblems[]` array

**2. Trivial Problem Limitations**
- Maximum 1 trivial problem consecutively (no back-to-back ×0, ×1, +0, etc.)
- Maximum 3 trivial problems per session (~20% of 15 problems)
- Trivial problems defined as: ×0, ×1, ÷1, +0, -0

**3. Operand Clustering Reduction**
- Tracks last 4 operands used (last 2 problems)
- Prevents patterns like: 8+3, 8-2, 8×5 appearing consecutively
- Reduces pattern recognition, forces actual fact recall

**4. Retry Logic**
- Attempts up to 50 times to generate valid problem meeting all criteria
- Accepts problem if max attempts reached (prevents infinite loops)
- In practice, valid problems found within 1-3 attempts

### Review Table

**Decision**: Display comprehensive review of all problems after session completion.

**Features**:
- Shows all 15 problems in order
- Displays student's answer for each problem
- Shows correct answer only when student got it wrong
- Visual feedback: Green ✓ for correct, red row highlighting for incorrect
- Positioned after summary stats and "Practice Again" button

**Table Structure**:
| Problem | Your Answer | Correct Answer |
|---------|-------------|----------------|
| 7 + 3 = | 10          | ✓              |
| 8 - 5 = | 2           | 3              |

**Visual Design**:
- Correct rows: White background, green ✓ in Correct Answer column
- Incorrect rows: Light red background (#ffebee), red text, black number in Correct Answer column
- Allows quick scanning for errors (red rows stand out)
- Enables learning from mistakes (shows what the correct answer was)

### State Management

Simple global state (no framework needed):

```javascript
// Core session state
let selectedOperation = null;      // 'addition', 'subtraction', etc.
let currentProblem = 0;            // 0-14 (current problem index)
let totalProblems = 15;            // Session length
let correctAnswers = 0;            // Total correct in session
let currentDifficulty = 1;         // 1-4 (adaptive difficulty level)
let correctStreak = 0;             // 0-2+ (for difficulty progression)
let currentProblemData = null;     // { num1, num2, operator, answer }
let startTime = null;              // timestamp (for elapsed time)

// Problem quality tracking
let sessionProblems = [];          // Normalized problems (prevents duplicates)
let consecutiveTrivialCount = 0;   // Consecutive trivial problems (×0, ×1, etc.)
let totalTrivialCount = 0;         // Total trivial problems in session (max 3)
let recentOperands = [];           // Last 4 operands (prevents clustering)
let sessionHistory = [];           // All problems/answers for review table
```

### Screen Transitions

Managed via CSS classes (no routing library):

```javascript
// Show screen: element.classList.add('active')
// Hide screen: element.classList.remove('active')
// CSS: .screen { display: none; } .screen.active { display: block; }
```

### Input Handling

- Number input field (`type="number"`)
- Enter key submits answer
- Auto-focus on input after each problem
- Value cleared between problems

---

## Current State

### Working Features ✅
- ✅ Four operation types (addition, subtraction, multiplication, division)
- ✅ Adaptive difficulty (4 levels, streak-based progression)
- ✅ 15-problem practice sessions
- ✅ Vertical problem layout (mimics pencil-and-paper format)
- ✅ In-box feedback with colored borders/backgrounds (✓/✗)
- ✅ Results screen with summary stats (score, accuracy, total time)
- ✅ Review table showing all problems, student answers, and corrections
- ✅ Problem quality controls (no duplicates, limited trivial problems, reduced clustering)
- ✅ Clean, minimal UI with focused attention design
- ✅ Responsive design (works on iPad and desktop)
- ✅ Direct-to-practice flow (no intermediate screens)
- ✅ GitHub Pages deployment
- ✅ Compass mode: `?compass_parts=` runs a list of operations in order and reports each finished one to Compass (see Decision 12 in DESIGN_RATIONALE.md)

### Known Limitations 🔄
- No progress tracking across sessions (always starts at Level 1)
- No mixed operation mode (one operation at a time; Compass mode runs several one after another)
- No keyboard shortcuts for operation selection
- No accessibility labels (screen reader support)
- No sound feedback
- No parent/teacher visibility into progress
- No customization options (problem count, difficulty ranges)

### Browser Compatibility
- **Tested**: Modern Safari (iPad), Chrome, Firefox
- **Minimum**: ES6 support (2015+)
- **Known issues**: None reported

---

## Future Considerations

### High Priority (Aligned with Learning Science)

**1. LocalStorage Progress Tracking**
- Save per-operation performance data (accuracy, speed, difficulty level)
- Start sessions at last achieved difficulty level (implements spaced repetition)
- Track historical performance trends
- Implementation: ~50 lines of JavaScript, no backend needed

**2. Mixed Practice Mode**
- "All Operations" button that interleaves all four operations
- Aligns with interleaving principle from learning science
- Randomly selects operation for each problem
- Maintains separate difficulty levels per operation

**3. Visual Progress Indicator**
- Subtle dots or progress bar (e.g., "●●●○○○○○○○○○○○○" for 3/15)
- Non-distracting, helps students gauge progress
- Could use CSS circles or Unicode characters

### Medium Priority (UX Improvements)

**4. Keyboard Shortcuts**
- Number keys 1-4 for operation selection on start screen
- Reduces friction for daily warmup routine

**5. Accessibility Enhancements**
- ARIA labels for screen readers
- Keyboard navigation throughout
- High contrast mode toggle
- Font size adjustment

**6. Optional Sound Feedback**
- Gentle chime for correct, soft tone for incorrect
- Off by default (opt-in to avoid anxiety)
- Respects system mute settings

### Lower Priority (Extended Features)

**7. Parent/Teacher Dashboard**
- Read-only view of student progress
- Export LocalStorage data to JSON
- Simple charts: accuracy trends, time per operation
- No login required (local data only)

**8. Minimal Gamification**
- Daily streak counter (encourages consistency)
- No points or competitive elements (avoids anxiety)
- Simple badge system (e.g., "7-day streak!")

**9. Customization Options**
- Adjustable problem count per session
- Custom difficulty ranges (for advanced/struggling students)
- Teacher-defined problem sets

---

## Performance Considerations

### Current Performance
- **Load time**: <100ms (single ~15KB file)
- **Problem generation**: <1ms (pure computation)
- **Feedback delay**: 400ms (intentional UX choice)
- **Memory footprint**: Minimal (~100KB browser process overhead)

### Scalability
- **Not applicable**: Single-user, client-side application
- No server scaling concerns
- No database queries
- No API calls

### Optimization Opportunities
- Current implementation is already highly optimized for its scope
- Future LocalStorage writes are negligible performance impact
- No bundling/minification needed (file size already tiny)

---

## Development Workflow

### Local Testing
1. Open `automath.html` directly in browser (file://)
2. Make changes in text editor
3. Refresh browser to see updates
4. No build process required

### Deployment to GitHub Pages
1. Make changes to `automath.html`
2. Copy to `index.html`: `cp automath.html index.html`
3. Commit: `git add . && git commit -m "description"`
4. Push: `git push -u origin claude/create-automath-app-icRFe`
5. Wait 1-2 minutes for GitHub Pages deploy
6. Verify at `https://<username>.github.io/automath/`

### Testing Checklist
- [ ] All four operations generate valid problems
- [ ] Problems display in vertical format with proper alignment
- [ ] No duplicate problems in a session (including commutative duplicates)
- [ ] Trivial problems limited (max 1 consecutive, max 3 total)
- [ ] No excessive operand clustering (same number in 3+ consecutive problems)
- [ ] Difficulty progression works correctly (3 correct → level up)
- [ ] Difficulty regression works (1 wrong → level down)
- [ ] In-box feedback displays correctly (green ✓ or red ✗ with colored borders)
- [ ] Cursor disappears during feedback display
- [ ] Results screen calculates accuracy correctly
- [ ] Review table shows all 15 problems with correct/incorrect marking
- [ ] Review table shows correct answers only for incorrect problems
- [ ] Time displays correctly (MM:SS format)
- [ ] "Practice Again" button resets to start screen
- [ ] Input field auto-focuses after each problem
- [ ] Enter key submits answers
- [ ] Horizontal results layout (Score, Accuracy, Time) wraps on mobile
- [ ] `?compass_parts=subtraction,division`: no picker; Subtraction starts at once; the progress line names the operation; after 15 problems a "Subtraction done ✓" screen with Subtraction's own score, accuracy and time, "One more to go", "Start Division" and Subtraction's 15 problems; Division; the results screen shows Division's own score and 15 problems, a two-row table (Subtraction, Division) and no "Practice Again"; two `data-compass-report` blocks with `kind: "part"`
- [ ] Unknown names in `compass_parts` are ignored; an empty or all-unknown list gives the normal picker

---

## Maintenance Notes

### Code Organization
- HTML structure: Lines 1-270
- CSS styles: Lines 7-290
- JavaScript: Lines 272-630
- Clear separation of concerns within single file

**Key Functions**:
- `generateProblem()`: Creates random problem at specified difficulty
- `showNextProblem()`: Displays problem with quality validation
- `checkAnswer()`: Evaluates answer, updates difficulty, saves to history
- `showResults()`: Displays summary stats and populates review table
- Helper functions: `isTrivial()`, `isDuplicate()`, `normalizeProblem()`, `hasRecentOperand()`

### Modifying Difficulty Levels
To adjust difficulty ranges, edit the `generateProblem()` function (lines 287-375):
```javascript
// Example: Making Level 1 easier (facts within 3 instead of 5)
if (difficultyLevel === 1) {
    num1 = Math.floor(Math.random() * 3) + 1;
    num2 = Math.floor(Math.random() * (3 - num1)) + 1;
}
```

### Changing Session Length
Update `totalProblems` variable (line 260):
```javascript
let totalProblems = 15;  // Change this number
```

Also update HTML placeholder (line 209):
```html
<div class="progress" id="progress">Problem 1 of 15</div>
```

### Adjusting Difficulty Progression Speed
Modify streak requirement in `checkAnswer()` function (line 416):
```javascript
// Require 3 consecutive correct answers to level up
if (correctStreak >= 3 && currentDifficulty < 4) {
```

---

## Contact & Contribution

This is a self-contained educational project. Future enhancements should maintain:
- Single-file architecture
- Zero dependencies
- Minimal, distraction-free UI
- Alignment with learning science principles (see DESIGN_RATIONALE.md)
- K-5 appropriate content and difficulty

When adding features, always ask:
1. Does this reduce cognitive load or increase it?
2. Does this create anxiety or reduce it?
3. Does this support automaticity development?
4. Is this truly necessary for a 5-minute daily warmup tool?
