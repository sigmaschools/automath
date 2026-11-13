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
- Hosted on Vercel at https://sigma-automath.vercel.app/ and run inside Compass (Decision 27)

---

## Architecture & Design Decisions

### Single-File Architecture

**Decision**: Implement as a single HTML file with embedded CSS and JavaScript.

**Reasoning**:
- **Portability**: Easy to download, share, and run anywhere
- **Simplicity**: No build process, no dependencies, no configuration
- **Accessibility**: Students can open directly from local filesystem or web
- **Deployment**: Static hosting with zero configuration (Vercel)
- **Maintenance**: Everything in one place, easy to understand and modify

**Trade-offs**:
- Limited modularity (acceptable for this scope)
- No code splitting (file size ~15KB, negligible)
- No external library benefits (don't need them for this use case)

### Adaptive Difficulty System

**Decision**: Use a 4-level adaptive difficulty system with streak-based progression.

**Reasoning**:
- **Alignment with learning science**: Implements zone of proximal development
- **Mastery learning**: Students must demonstrate competence (2 correct in a row, 3 to re-enter a level they slipped out of) before advancing (Decision 17)
- **Supportive scaffolding**: Immediate difficulty reduction on errors prevents frustration
- **Appropriate ceiling**: Level 4 cap matches K-5 curriculum expectations

**Implementation Details**:
```javascript
// 4 difficulty levels (1-4)
// Progression: +1 level after 2 fluent correct answers in a row (correct within 3 s;
//   a slow correct answer neither builds nor breaks the streak, Decision 18)
//   (3 to climb back into a level slipped out of earlier in the exercise)
// Regression: -1 level immediately after any wrong answer
// Session: 10 problems (level 4 can be reached by problem 7: 2+2+2; Decision 21)
// With a fact record from Compass, problems come from the record instead (Decision 19)
```

**Difficulty Level Ranges**:

| Operation | Level 1 | Level 2 | Level 3 | Level 4 |
|-----------|---------|---------|---------|---------|
| Addition | Facts ≤5 | Facts ≤10 | Facts ≤20 | Facts crossing ten (8 + 7) |
| Subtraction | Facts ≤5 | Facts ≤10 | Facts ≤20 | Facts crossing ten (13 − 6) |
| Multiplication | 0-2× tables | 0-5× tables | 0-10× tables | 0-12× tables |
| Division | 0-2÷ tables | 0-5÷ tables | 0-10÷ tables | 0-12÷ tables |

### Session Structure

**Decision**: 10 problems per operation (15 until Decision 21, 5 Nov 2026), no time limit during practice. A graduated operation's check-in is also 10.

**Reasoning**:
- **Math**: 10 problems still reaches Level 4 (2+2+2 to climb, then 4 problems at target difficulty)
- **Time**: a 60-problem mixed day (4 × 15) was found too long for a ~5-minute warm-up; 40 fits
- **Predictability**: Fixed count reduces anxiety vs. timed practice
- **Progress visibility**: Students see "Problem X of 10" and know endpoint

**Alternative considered**: Time-based (60 seconds) - rejected due to anxiety concerns

### User Experience Flow

**Decision**: Direct-to-practice flow with no intermediate steps.

**Reasoning**:
- **Speed**: Click operation → immediate practice (removes friction)
- **Focus**: Eliminates decision fatigue from difficulty selection
- **Daily warmup context**: Students want to jump in quickly each morning

**Flow**:
1. Compass opens the page with today's operations; the first starts at once
2. Complete 10 problems per operation with adaptive difficulty
3. View results (score, accuracy, time); Compass moves on

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

### Deployment: Vercel (Decision 27)
- **Why**: the same host as Sigma's other Compass apps; a preview link for every pull request; no 10-minute CDN cache
- **Configuration**: Vercel project `automath` (Sigma School team), linked to this repository; `main` deploys production; no build step, it serves `index.html`
- **URL**: `https://sigma-automath.vercel.app/` (Compass loads this page)
- **Updates**: Automatic on merge (about a minute); no Compass rebuild is needed
- **Old address**: `https://sigmaschools.github.io/automath/` redirects here, keeping the query and hash, except Compass launches (`compass_parts` in the query) until every Compass registry points at Vercel; then GitHub Pages can be switched off in the repository settings

---

## File Structure

```
/home/user/automath/
├── automath.html          # Main application file
├── index.html             # The page Vercel serves (copy of automath.html)
├── Claude.md              # Entry point - read this first each session
├── PROJECT_CONTEXT.md     # This file - technical documentation
├── DESIGN_RATIONALE.md    # Conceptual and decision documentation
├── README.md              # GitHub repository readme
├── tests/                 # node --test suites (core.test.js, facts.test.js) and simulators
└── .github/workflows/     # test.yml runs the tests on every PR
```

### Key Files

**automath.html**
- Complete self-contained application, about 2,000 lines
- Script blocks: `automath-core` (the level staircase and practice rules, no page code), `automath-facts` (the per-fact record, session planning, review and graduation, no page code), then the page code (screens, input, Compass reports)
- The two rule blocks are loaded by `tests/load-core.js`, so they are tested without a browser

**index.html**
- Exact copy of automath.html, the page Vercel serves at the root
- Kept in sync via `cp automath.html index.html` before commits

---

## Implementation Details

### Problem Generation Algorithm

Each level lists every problem it can give; the next problem is picked from that list (Decision 17):

```javascript
function problemsAt(operation, level) {
    // Every problem in the level's range, cached
    // Returns: [{ num1, num2, operator, answer }, ...]
}
function pickProblem(operation, level) {
    // An unseen problem, preferring ones that keep the quality rules
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
- Maximum 3 trivial problems per session (~30% of 10 problems)
- Trivial problems defined as: ×0, ×1, ÷1, +0, -0

**3. Operand Clustering Reduction**
- Tracks last 4 operands used (last 2 problems)
- Prevents patterns like: 8+3, 8-2, 8×5 appearing consecutively
- Reduces pattern recognition, forces actual fact recall

**4. Picking (Decision 17)**
- `problemsAt(operation, level)` lists every problem a level can give
- `pickProblem()` draws from the unseen ones, preferring those that keep rules 2 and 3
- Repeats are a hard rule: if a level runs out, an unseen problem comes from the nearest level (one up first)

**5. Fireworks (Decision 17)**
- Accuracy above 85% on a score screen launches `launchFireworks()` on a fixed, click-through canvas (~3 s)
- Skipped when the device prefers reduced motion; stopped by `stopFireworks()` when the learner moves on

### Review Table

**Decision**: Display comprehensive review of all problems after session completion.

**Features**:
- Shows all 10 problems in order
- Displays student's answer for each problem
- Shows correct answer only when student got it wrong
- Visual feedback: Green ✓ for correct, red row highlighting for incorrect
- Positioned after the summary stats

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

Simple global state (no framework needed). The snippet below is the original page state; the staircase state now lives in `automath-core` (`recordAnswer(s, correct, fluent)`), the fact record in `automath-facts`, and `totalProblems` is a constant taken from `AutomathFacts.SESSION`.

```javascript
// Core session state
let selectedOperation = null;      // 'addition', 'subtraction', etc.
let currentProblem = 0;            // 0-14 (current problem index)
let totalProblems = 15;            // Session length
let correctAnswers = 0;            // Total correct in session
let currentDifficulty = 1;         // 1-4 (adaptive difficulty level)
let correctStreak = 0;             // 0-2+ (for difficulty progression)
let droppedFrom = [];              // levels slipped out of this exercise (need 3 to re-enter)
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
- ✅ 10-problem practice sessions (Decision 21); a color per operation (Decision 20); a mastered fact answered slowly steps down to Fluent, not back to Learning (Decision 22)
- ✅ Vertical problem layout (mimics pencil-and-paper format)
- ✅ In-box feedback with colored borders/backgrounds (✓/✗)
- ✅ Results screen with summary stats (score, accuracy, total time)
- ✅ Review table showing all problems, student answers, and corrections
- ✅ Problem quality controls (no duplicates, limited trivial problems, reduced clustering)
- ✅ Clean, minimal UI with focused attention design
- ✅ Responsive design (works on iPad and desktop)
- ✅ Direct-to-practice flow (no intermediate screens)
- ✅ Hosted on Vercel; the old GitHub Pages address redirects (Decision 27)
- ✅ Compass mode: `?compass_parts=` runs a list of operations in order and reports each finished one to Compass (see Decision 12 in DESIGN_RATIONALE.md)
- ✅ Compass mode shows a large blue Next button between operations and colored score values (Decision 14); the "Exercise N of M" pills were removed again (Decision 15)
- ✅ Compass mode alternates by the learner's local day between grouped operations and one mixed set that interleaves them (Decision 16)
- ✅ No repeated problems in a session, 2-in-a-row level-up, fireworks above 85% (Decision 17)
- ✅ Fluency (correct within 3 s) drives levelling up and is reported; misses show the right answer and come back once; level 4 is facts crossing ten; hidden-page time not counted; on-screen number pad on touch screens; `node --test` and a simulator in `tests/` (Decision 18)
- ✅ Per-fact record across days via Compass (`state` report, `compass_state` launch parameter): sessions aimed at weak and due facts, spaced review, operations graduate and get check-ins (Decision 19)
- ✅ Answer out loud: a microphone switch under the answer where the browser can recognize speech (Chrome, Edge, Safari); the number heard goes in the box and is checked; remembered per device; `voice=1`/`voice=0` forces it (Decision 23). Not yet inside Compass: both Compass shells deny the microphone
- ✅ In Compass, answers out loud use the Compass voice kit (contract 1.5), loaded from a listed Compass server named in the profile note; a misheard number waits for the learner instead of counting as a miss; tap-to-talk beside the answer box (Decision 24, removed by Decision 29)
- ✅ While answering out loud, a live waveform of the learner's voice replaces the number pad and the "I'm listening" label; "Type instead" brings the pad back; Enter appears for a misheard number (Decision 25)
- ✅ A wrong spoken answer counts as a miss once the learner stops talking, with the right answer shown, so the Enter button for a held number is gone; a right answer shows its number with a green tick (Decision 26)
- ✅ No standalone mode: no operation picker, no "Practice Again", no browser speech recognizer; opened without `compass_parts` the page runs all four operations (Decision 27)
- ✅ A miss, typed or spoken, shows the learner's answer in red with a cross, then the right answer in green with no mark, then moves on (Decision 28)
- ✅ Voice is either on or off: the one-answer microphone in the answer box is gone, so "Answer out loud" and "Type instead" are the only switches (Decision 29)
- ✅ Each visit also sends a `mastery` report listing every fact and its stage (unseen, learning, fluent, mastered), by operation, for the fact chart Compass draws for guides and parents (Decision 32)

### Known Limitations 🔄
- Progress across sessions is kept by Compass (the `state` report, passed back as `compass_state`, app contract 0.4); a page opened without it starts a fresh record
- A mixed set reports its operations only near its end (all four finish in the last round), so a learner who stops partway through a mixed set keeps none of it that visit
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

**1. Visual Progress Indicator**
- Subtle dots or progress bar (e.g., "●●●○○○○○○○" for 3/10)
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

### Deployment (Vercel)
1. Make changes to `automath.html`
2. Copy to `index.html`: `cp automath.html index.html`
3. Run `node --test`
4. Commit on a branch, push, open a pull request to `main` (the test Action must pass); Vercel posts a preview link on the pull request
5. After the merge, about a minute for Vercel
6. Verify at `https://sigma-automath.vercel.app/`

### Automated Tests
`node --test` checks the practice rules (the `automath-core` script block) and that `index.html` and `automath.html` match; `node tests/simulate.js` prints how simulated learners move through the levels (add `--accuracy-only` to compare with the rules before Decision 18). `node tests/simulate-days.js` plays model learners through 180 days of warm-ups with the fact record (Decision 19) and prints when each operation graduates. All three run in a GitHub Action on every PR.

### Testing Checklist
- [ ] All four operations generate valid problems
- [ ] Problems display in vertical format with proper alignment
- [ ] No duplicate problems in a session (including commutative duplicates)
- [ ] Trivial problems limited (max 1 consecutive, max 3 total)
- [ ] No excessive operand clustering (same number in 3+ consecutive problems)
- [ ] Difficulty progression works correctly (2 correct → level up; 3 to re-enter a level slipped out of)
- [ ] Difficulty regression works (1 wrong → level down)
- [ ] In-box feedback displays correctly (green ✓ or red ✗ with colored borders)
- [ ] Cursor disappears during feedback display
- [ ] Results screen calculates accuracy correctly
- [ ] Review table shows all 10 problems with correct/incorrect marking
- [ ] Review table shows correct answers only for incorrect problems
- [ ] Time displays correctly (MM:SS format)
- [ ] Input field auto-focuses after each problem
- [ ] Enter key submits answers
- [ ] Horizontal results layout (Score, Accuracy, Time) wraps on mobile
- [ ] `?compass_parts=subtraction,division`: Subtraction starts at once; the progress line names the operation; after 10 problems a "Subtraction done ✓" screen with Subtraction's own score, accuracy and time, "One more to go", "Start Division" and Subtraction's 10 problems; Division; the results screen shows Division's own score and 10 problems and a two-row table (Subtraction, Division); two `data-compass-report` blocks with `kind: "part"`
- [ ] Unknown names in `compass_parts` are ignored; an empty or all-unknown list (or none) runs all four operations
- [ ] Compass run of 2+ operations, grouped (`&mode=grouped` or an odd local day): no "Exercise N of M" line or pills; the next operation starts straight after the last one's final problem, with no screen between (Decision 30); the line counts through the whole run ("Subtraction · Problem 11 of 40"); the results screen says "Practice done ✓" with one score for the run, one row per operation and every problem; Score, Accuracy and Time in blue, teal and violet, matching the summary columns; each `part` report has `index`, `of` and `mode: "grouped"` and appears as its operation finishes
- [ ] Compass run of 2+ operations, mixed (`&mode=mixed` or an even local day): one set of 10 × the operations, progress line "Mixed · Problem N of 40" with all four, never the same operation twice in a row, no screen between operations; each operation reported (`mode: "mixed"`, its own 10 items, `seconds` = sum of its response times) the moment its 10th problem is answered; results screen "Mixed practice done ✓" with the set's score, one row per operation in `compass_parts` order and every problem below
- [ ] One operation in `compass_parts` always runs grouped
- [ ] Every Compass run leaves a `kind: "state"` report after each finished operation, with `data`, `due` (an ISO date per operation), `summary` and `fluentMs`
- [ ] Passing that `data` back as `compass_state` gives fact-chosen sets: the weakest facts come back 2 or 3 times, never within 3 problems of themselves; the results screen shows "<Operation> facts mastered: N of M"
- [ ] A record with an operation graduated and its check-in in the future: that operation is reported at once with `rest: true` and not asked; with its check-in due: 10 problems, progress line "<Operation> check-in · Problem N of 10", report `check: true`
- [ ] Every listed operation resting: "Nothing due today ✓", one `rest` report per operation
- [ ] A damaged `compass_state` is ignored (the level staircase runs, as on a first day)

---

## Maintenance Notes

### Code Organization
- CSS in the head, then the screens' HTML, then three script blocks: `automath-core`, `automath-facts` and the page code
- Find a function by name rather than by line number; the file grows with each Decision

**Key Functions**:
- `problemsAt()` / `pickProblem()`: List a level's problems / pick an unseen one
- `showNextProblem()`: Displays problem with quality validation
- `checkAnswer()`: Evaluates answer, updates difficulty, saves to history
- `showResults()`: Displays summary stats and populates review table
- Helper functions: `isTrivial()`, `isDuplicate()`, `normalizeProblem()`, `hasRecentOperand()`

### Modifying Difficulty Levels
To adjust difficulty ranges, edit the `problemsAt()` function:
```javascript
// Example: Making Level 1 addition easier (facts within 3 instead of 5)
if (level === 1) pairs(1, 2, 1, a => 3 - a, plus);
```

### Changing Session Length
Update `SESSION` (and `CHECKIN` for check-ins) at the top of the `automath-facts` block; the page's `totalProblems` follows it:
```javascript
const SESSION = 10;           // problems per operation on a practice day (Decision 21)
```

Then run `node --test` and `node tests/simulate-days.js` and record the change as a Decision.

### Adjusting Difficulty Progression Speed
Modify the streak requirement in `checkAnswer()`:
```javascript
// 2 correct in a row to level up, 3 to re-enter a level slipped out of
const needed = droppedFrom.includes(currentDifficulty + 1) ? 3 : 2;
if (correctStreak >= needed && currentDifficulty < 4) {
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
