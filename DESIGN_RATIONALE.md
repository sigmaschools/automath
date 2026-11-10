# Automath - Design Rationale

## Core Philosophy

Automath is designed around a single guiding principle: **Build automaticity through low-pressure, adaptive practice that meets students where they are.**

### What is Automaticity?

**Automaticity** is the ability to perform low-level skills without conscious effort, freeing cognitive resources for higher-order reasoning. In mathematics, automaticity with basic arithmetic facts (2+3=5, 6×7=42) is essential because:

1. **Cognitive load reduction**: Students who automatically recall 7+8=15 can focus on problem-solving strategies rather than counting on fingers
2. **Gateway to expertise**: Automaticity in fundamentals enables access to advanced concepts
3. **Academic confidence**: Instant recall builds mathematical self-efficacy
4. **Efficiency**: Automatic fact retrieval is orders of magnitude faster than calculation

### Design Pillars

**1. Low Anxiety Environment**
- No countdown timers during practice (timer anxiety is real for young learners)
- No scoring pressure or failure states
- Supportive difficulty adjustment (wrong answers lead to easier problems, not penalties)
- Predictable session length (15 problems, not "go until you fail")

**2. Zone of Proximal Development**
- Start easy (Level 1: facts within 5)
- Progress only when ready (3 consecutive correct answers)
- Immediate support when struggling (difficulty drops on wrong answer)
- Ceiling appropriate for age group (Level 4 caps at 12× tables and the addition and subtraction facts that cross ten)

**3. Rapid Feedback Loops**
- Immediate visual feedback (✓ or ✗)
- Fast transitions (400ms between problems)
- No interruptions or explanations during practice
- Results shown at end for reflection

**4. Minimal Cognitive Load**
- One problem at a time, large and clear
- No distracting graphics, animations, or interface elements
- Direct-to-practice flow (no unnecessary decision points)
- Clean typography and generous whitespace

**5. Daily Warmup Context**
- Sessions designed for 2-4 minutes per operation
- Total time budget: ~5 minutes for all operations
- Fits into morning routine or class opening
- Repetition builds automaticity over weeks/months, not hours

---

## Research Foundation

Automath's design is informed by cognitive learning science, particularly principles from **The Math Academy Way** by Justin Skycak and Jason Roberts.

### Key Sources

#### The Math Academy Way (2025)
**Source**: [The Math Academy Way PDF](https://www.justinmath.com/files/the-math-academy-way.pdf)

**Key Insights Applied**:

1. **Mastery Learning**
   - Students must demonstrate proficiency before advancing
   - Implementation: Require 3 consecutive correct answers before increasing difficulty

2. **Developing Automaticity**
   - Low-level skills must become automatic to free cognitive resources
   - Implementation: Focus on rapid recall, not calculation strategies or explanation

3. **Minimizing Cognitive Load**
   - Remove extraneous information and decisions
   - Implementation: One problem at a time, minimal UI, no mid-session choices

4. **Adaptive Pacing**
   - Students struggling should get more practice at current level (slower pace)
   - Students excelling should advance to maintain engagement
   - Implementation: Difficulty adapts in real-time based on performance (streak-based progression/regression)

5. **Spaced Repetition** (future enhancement)
   - Distributed practice is more effective than massed practice
   - Current limitation: No cross-session memory (always starts at Level 1)
   - Planned: LocalStorage to remember difficulty levels and schedule reviews

6. **Interleaving** (future enhancement)
   - Mixed practice across skills improves retention and transfer
   - Current limitation: Single operation per session
   - Planned: "All Operations" mode that randomly interleaves all four operations

7. **Layering**
   - Move students forward as soon as they demonstrate mastery
   - Don't keep them at easy levels unnecessarily
   - Implementation: Immediate progression after 3 correct answers

**Math Academy's Approach to Warmups**:
While the full PDF was not accessible, research into Math Academy revealed their platform uses:
- Spaced repetition algorithms that adapt to individual student pace
- Task selection that optimizes for "minimal effective dose" of practice
- Implicit repetition (reviewing skills across multiple contexts)
- Speed calibration (students move through material at personalized rates)

Automath implements the core principles in a simplified, single-session context suitable for K-5 warmups.

#### Cognitive Science Principles

**Working Memory Constraints** (Miller, 1956; Cowan, 2001)
- Limited capacity: ~4 chunks of information
- **Application**: Only show one problem at a time, no history or future problems visible
- Feedback is binary (✓/✗), not explanatory text that requires processing

**Desirable Difficulties** (Bjork, 1994)
- Learning is enhanced by introducing appropriate challenges
- Too easy = no learning; too hard = frustration and disengagement
- **Application**: Adaptive difficulty keeps students in "desirable difficulty" range
- 3-correct-to-advance ensures mastery before challenge increases

**Testing Effect** (Roediger & Karpicke, 2006)
- Retrieval practice (testing) is more effective than re-studying
- **Application**: Every problem is a retrieval practice opportunity
- No "study mode" or answer reveals during practice

**Immediate Feedback** (Hattie & Timperley, 2007)
- Feedback is most effective when immediate and specific
- **Application**: Instant ✓/✗ after each answer
- No delay that allows incorrect responses to be encoded

---

## Design Decisions Log

### Decision 1: Remove Difficulty Selection

**Date**: Initial design iteration
**Context**: Original design had three difficulty levels (Easy, Medium, Hard) that users selected before practice.

**Problem**:
- Students don't know their appropriate difficulty level
- Choosing wrong level leads to frustration (too hard) or boredom (too easy)
- Adds decision fatigue before practice even begins
- Doesn't adapt to student's actual performance

**Alternatives Considered**:
1. **Keep manual selection** - Simple to implement, but doesn't solve fit problem
2. **Pre-assessment** - Add diagnostic test before practice - rejected (adds friction, anxiety)
3. **Adaptive difficulty** - Start easy, adjust based on performance - **selected**

**Decision**: Remove difficulty selection entirely, implement adaptive difficulty that starts at Level 1 and adjusts based on real-time performance.

**Rationale**:
- Aligns with mastery learning (demonstrate competence before advancing)
- Automatically finds each student's zone of proximal development
- Reduces cognitive load (one less decision)
- Supports diverse skill levels without stigma

**Outcome**: Significantly simplified start screen, eliminated mismatch between student ability and practice difficulty.

---

### Decision 2: Auto-Start Practice (Remove "Start Practice" Button)

**Date**: Second design iteration
**Context**: Initial flow was: Select operation → Start button appears → Click Start → Practice begins

**Problem**:
- Unnecessary friction in daily warmup routine
- Extra click serves no purpose (no configuration options to review)
- Students already made their choice (operation selection)
- Delay between decision and action reduces engagement

**Alternatives Considered**:
1. **Keep Start button** - Provides explicit confirmation, but adds friction
2. **Auto-start immediately** - Begin practice the moment operation is clicked - **selected**

**Decision**: Clicking an operation button immediately starts practice for that operation.

**Rationale**:
- Reduces steps from 2 to 1 (select operation → practice)
- Faster flow better for daily warmup context
- No downside - students can return to start screen if they misclick

**Outcome**: Cleaner, faster user experience. Students can begin practice with single click.

---

### Decision 3: Slow Down Difficulty Progression

**Date**: Second design iteration
**Context**: Initial adaptive system increased difficulty after every correct answer.

**Problem**:
- Difficulty ramped up too quickly
- Students reached hard problems before developing automaticity at easier levels
- Violates "zone of proximal development" principle
- Optimized for challenge rather than mastery through repetition

**Alternatives Considered**:
1. **1 correct to advance** - Too fast, original approach
2. **2 consecutive correct to advance** - Better, but still somewhat fast
3. **3 consecutive correct to advance** - **selected**
4. **5 consecutive correct to advance** - Too slow, frustrating for strong students

**Decision**: Require 3 consecutive correct answers before increasing difficulty. Immediately decrease difficulty on any wrong answer.

**Rationale**:
- 3 correct answers provides confidence that skill is developing
- Asymmetric progression/regression (3 up, 1 down) keeps students in productive zone
- Allows multiple repetitions at each level before advancing
- Balances challenge with mastery

**Outcome**: Students spend more time at appropriate difficulty level, better for automaticity development.

*Superseded by Decision 17: 2 correct in a row to advance (3 to re-enter a level already slipped out of).*

---

### Decision 4: Remove On-Screen Timer

**Date**: Second design iteration
**Context**: Initial design showed a running timer (MM:SS) during practice.

**Problem**:
- Timer creates anxiety, especially for young students
- Constant reminder of time passing increases pressure
- Contradicts "low-pressure environment" goal
- Speed ≠ automaticity (automaticity is instant recall, but rushing creates errors)
- Students glance at timer instead of focusing on problems

**Alternatives Considered**:
1. **Keep timer visible** - Provides time awareness, but causes anxiety
2. **Remove timer completely** - Eliminates anxiety, but loses time tracking
3. **Show timer only in results** - **selected** - No pressure during practice, data available at end

**Decision**: Remove timer from practice screen, show total elapsed time only in results screen.

**Rationale**:
- Reduces anxiety during practice
- Students focus on accuracy, not speed
- Time data still available for self-reflection after completion
- Speed naturally develops as automaticity increases (no need to pressure it)

**Outcome**: Less stressful practice experience, maintained time tracking for review.

---

### Decision 5: Cap Difficulty at Level 4

**Date**: Third design iteration
**Context**: Initial adaptive system had 5 difficulty levels.

**Problem**:
- Level 5 problems (15× tables, 100+ two-digit arithmetic) exceed K-5 curriculum
- With 10 problems per session, students couldn't reach Level 5 anyway (requires 12 consecutive correct)
- Created unrealistic expectations

**Alternatives Considered**:
1. **Keep 5 levels** - Aspirational but unreachable
2. **Cap at Level 4** - **selected** - Aligns with K-5 curriculum and session length
3. **Cap at Level 3** - Too limiting for advanced 5th graders

**Decision**: Cap maximum difficulty at Level 4, appropriate for K-5 curriculum.

**Level 4 Targets**:
- Addition/Subtraction: Two-digit numbers within 75 (*replaced by Decision 18: the facts within 20 that cross ten*)
- Multiplication/Division: Up to 12× tables (standard curriculum endpoint)

**Rationale**:
- Aligns with Common Core and typical K-5 math standards
- Reachable within session length (9 correct answers to reach Level 4)
- Provides appropriate ceiling for age group
- Leaves room for 6 problems at max difficulty

**Outcome**: Realistic difficulty progression that students can actually complete.

---

### Decision 6: Increase Problems from 10 to 15

**Date**: Third design iteration
**Context**: Originally 10 problems per session.

**Problem**:
- With 3-correct-to-advance rule, students needed 9 consecutive correct to reach Level 4
- Only 1 problem remained at Level 4 (inefficient)
- Not enough practice time at target difficulty

**Math**:
- Level 1→2: Problems 1-3 (3 correct)
- Level 2→3: Problems 4-6 (3 correct)
- Level 3→4: Problems 7-9 (3 correct)
- Level 4: Problem 10 only (1 problem)

**Alternatives Considered**:
1. **Keep 10 problems** - Too short, only 1 problem at max difficulty
2. **15 problems** - **selected** - Allows 6 problems at max difficulty
3. **20 problems** - Too long for daily warmup (exceeds 5-minute goal)

**Decision**: Increase to 15 problems per session.

**New Math**:
- Level 1→2: Problems 1-3
- Level 2→3: Problems 4-6
- Level 3→4: Problems 7-9
- Level 4: Problems 10-15 (6 problems at target difficulty)

**Rationale**:
- Provides meaningful practice time at maximum difficulty
- Still fits within 5-minute warmup goal (~3-4 minutes at automaticity level)
- Better balance between progression and practice

**Outcome**: Students get substantial practice at their appropriate difficulty level.

---

### Decision 7: 400ms Feedback Delay

**Date**: Initial design
**Context**: How long to display feedback (✓/✗) before next problem?

**Alternatives Considered**:
1. **No delay (instant)** - Too jarring, students can't process feedback
2. **200ms** - Too fast, barely perceptible
3. **400ms** - **selected** - Brief but perceptible
4. **800ms** - Original choice - too slow for automaticity practice
5. **1000ms+** - Way too slow, breaks flow

**Decision**: 400ms delay between answer submission and next problem.

**Rationale**:
- Long enough to register feedback (human reaction time ~200-300ms)
- Short enough to maintain flow state
- Fast pace reinforces that this is about instant recall, not calculation
- Math Academy research emphasizes minimal effective dose of practice

**Outcome**: Rapid flow that supports automaticity development without feeling rushed.

---

### Decision 8: Vertical Problem Layout

**Date**: Later design iteration
**Context**: Initial design displayed problems horizontally (7 × 8 = [box]), then switched to inline equation format.

**Problem with Horizontal/Inline**:
- Doesn't match how K-5 students actually write arithmetic
- Elementary curriculum teaches stacking numbers vertically
- Multi-digit addition/subtraction requires place value alignment
- Unfamiliar format adds cognitive load

**Alternative Considered**:
1. **Horizontal layout** (7 + 8 = ___) - Compact but not pedagogically aligned
2. **Inline layout** (7 + 8 = [box]) - Better but still horizontal
3. **Vertical stacked layout** - **selected** - Matches school format

**Decision**: Display problems in vertical stacked format:
```
   47
+  28
────
[box]
```

**Rationale**:
- Matches pencil-and-paper format students use in school
- Enables proper place value alignment (ones, tens, hundreds columns)
- Reduces cognitive load (familiar format requires no translation)
- Scales naturally to multi-digit problems
- More authentic to actual arithmetic practice

**Implementation**:
- Numbers right-aligned (place value alignment)
- Operator absolutely positioned on left (consistent location)
- Answer box width matches problem width
- Border-top on answer box simulates underline from written math

**Outcome**: More authentic math practice experience that matches students' school learning.

---

### Decision 9: In-Box Feedback with Colored Borders

**Date**: Later design iteration
**Context**: Original design showed feedback (✓/✗) below the answer box.

**Problem**:
- Students' eyes had to move from input area to feedback area
- Easy to miss feedback when focused on typing
- Split attention between answer box and feedback element
- Not focused enough for rapid practice flow

**Alternatives Considered**:
1. **Feedback below box** - Original design, splits attention
2. **Feedback beside box** - Horizontal split attention
3. **Feedback inside box** - **selected** - Keeps focus in one place

**Decision**: Clear typed answer and show feedback (✓/✗) as placeholder inside answer box, with colored border and background.

**Implementation**:
- Correct: Green border-top, light green background, green ✓ placeholder
- Incorrect: Red border-top, light red background, red ✗ placeholder
- Cursor hidden during feedback (caret-color: transparent)
- 400ms display before clearing for next problem

**Rationale**:
- Keeps attention in exact location where student is working
- Impossible to miss feedback
- Color + symbol = dual encoding (accessibility)
- Simpler visual design (one element instead of two)

**Outcome**: More focused practice experience, impossible to miss feedback.

---

### Decision 10: Problem Quality Controls

**Date**: Later design iteration
**Context**: Random problem generation was creating duplicate problems, consecutive trivial problems (×0, ×1), and same-number patterns.

**Problem**:
- Duplicate problems waste practice time (no new learning)
- Commutative duplicates (7×2 and 2×7) feel repetitive to students
- Multiple consecutive ×0 or ×1 problems are trivial (no challenge)
- Seeing same number repeatedly (8+3, 8-2, 8×5) creates pattern recognition instead of fact recall

**Alternatives Considered**:
1. **Pure random** - Simple but creates quality issues
2. **Pre-generate entire session** - Could optimize but adds complexity
3. **Validate on generation with retry logic** - **selected** - Good balance

**Decision**: Implement quality validation with retry logic (max 50 attempts per problem).

**Rules Implemented**:
1. No exact duplicate problems in a session
2. No commutative duplicates (treat 7×2 and 2×7 as same for addition/multiplication)
3. Maximum 1 trivial problem consecutively
4. Maximum 3 trivial problems per session (~20%)
5. No operand clustering (don't use same number in last 2 problems)

**Rationale**:
- Ensures every problem adds practice value
- Prevents gaming or pattern recognition
- Maintains randomness while enforcing quality
- Low computational cost (typically finds valid problem in 1-3 attempts)

**Outcome**: Higher quality practice sessions with no wasted problems.

*Revised by Decision 17: the retry loop could keep a duplicate when no draw passed every rule; problems are now picked from each level's full list, and repeats are never allowed while an unseen problem is left.*

---

### Decision 11: Review Table on Results Screen

**Date**: Later design iteration
**Context**: Results screen originally showed only summary stats (score, accuracy, time).

**Problem**:
- Students couldn't review which specific problems they got wrong
- No way to learn from mistakes
- Teachers/parents couldn't see what errors were made
- Missed learning opportunity (testing effect)

**Alternatives Considered**:
1. **No review** - Simple but misses learning opportunity
2. **Show only incorrect problems** - Focused but incomplete picture
3. **Show all problems with answers and corrections** - **selected** - Complete review

**Decision**: Add comprehensive review table showing all 15 problems, student answers, and correct answers when wrong.

**Table Design**:
- Three columns: Problem | Your Answer | Correct Answer
- Correct rows: White background, green ✓ in Correct Answer column
- Incorrect rows: Red background, red text, black correct answer
- Problems displayed horizontally for compactness (7 + 3 =)
- Positioned after summary stats and "Practice Again" button

**Rationale**:
- Enables learning from mistakes (retrieval practice + correction)
- Quick visual scanning (red rows stand out)
- Shows correct answers only when needed (reduces clutter)
- Allows reflection after completion
- Helps teachers/parents identify problem areas

**Outcome**: Students can review their work and learn from errors without anxiety.

---

## Constraints & Requirements

### Problem We're Solving

**Primary Problem**: Elementary students need daily, low-pressure practice to develop automaticity in basic arithmetic facts.

**Sub-Problems**:
1. Traditional flashcards are boring and don't adapt to skill level
2. Many math apps are over-designed with distracting gamification
3. Timed drills create anxiety in young learners
4. One-size-fits-all difficulty doesn't fit diverse classrooms
5. Teachers need simple tools that "just work" without setup

### Hard Requirements

**Must Have**:
- ✅ Works on iPad without app installation (browser-based)
- ✅ Zero friction to start (no login, no setup, no configuration)
- ✅ Minimal, distraction-free interface
- ✅ Adaptive difficulty (meets students where they are)
- ✅ Complete session in 5 minutes or less
- ✅ K-5 appropriate content and difficulty

**Must Not Have**:
- ❌ No countdown timers during practice
- ❌ No complex gamification (points, levels, avatars)
- ❌ No social/competitive features
- ❌ No ads or commercial elements
- ❌ No data collection or analytics (privacy-first)
- ❌ No dependencies on external services

### Soft Requirements

**Should Have** (future):
- Progress tracking across sessions (LocalStorage)
- Mixed operation mode (interleaving)
- Keyboard shortcuts for power users
- Accessibility features (screen reader support)

**Could Have** (nice to have):
- Optional sound feedback
- Parent/teacher dashboard
- Custom problem sets
- Minimal streaks/badges

---

### Decision 12: Run a List of Operations When Compass Asks (3 November 2026)

**Decision**: When the page is opened with `?compass_parts=addition,subtraction,multiplication,division` (any subset, in any order), Automath skips the operation picker and runs those operations one after another, 15 problems each. Between operations a calm screen says which one is done and how many are left, with one button to start the next (it takes Enter after a 0.6 s pause, so the Enter that answered the last problem cannot skip it). After the last one, the results screen covers the whole run and "Practice Again" is hidden (superseded by Decision 13: one score per operation). Each finished operation leaves a `<script type="application/json" data-compass-report>` block in the page: `kind: "part"`, the operation, `correct`, `wrong`, `seconds`, and every problem with the learner's answer, the right answer and the response time in ms. Opened without the parameter, Automath works exactly as before (it also leaves a report, which no one reads outside Compass).

**Why**: Compass runs Automath as a once-a-day warm-up before the main math app, and the warm-up counts only when all four operations are done; a student who stops partway resumes later with only the missing operations. Compass therefore has to tell Automath which operations to run and learn each one as it finishes. The per-problem response times are the first data for telling when a student's facts are automatic (accuracy alone cannot show that), which is when the warm-up could switch off for that student.

**Alternatives considered**: four separate Compass steps, one per operation (four hand-off screens and four app loads, and Automath has no way to be told the operation); mixing all four operations in one 60-problem set (changes the learning design; a later decision if wanted).

**Contract**: the parameter and report follow the Compass app contract (`compass/APP-CONTRACT.md` in the Compass repository, version 0.1). Keep both working through any rewrite of Automath.

### Decision 13: One Score per Operation, Shown as Each One Finishes (3 November 2026)

**Decision**: In a Compass run, the screen between operations shows that operation's own score, accuracy and time, above a "Start Subtraction" button, with that operation's problems reviewed below the button. The final screen does the same for the last operation, then a table with one row per operation finished in this visit (score, accuracy, time). The run is no longer summed into one score or one list of every problem. Outside Compass nothing changes. What Compass records was already per operation (one `part` report each, Decision 12).

**Why**: Each operation is its own exercise with its own result, and the learner should see that result right after doing the work, while it still means something. A learner who stops after two operations has already seen both scores. The four operations are also not equally hard, so one combined score hides the operation that needs practice.

**Alternatives considered**: all four scores only at the end (feedback comes up to three exercises late, and a learner who stops early never sees it); one combined score (the old behaviour, which hides which operation is weak).
Decided with the product owner on 3 November 2026.

### Decision 14: A Clear Way Forward, Where-Am-I Pills and Colored Results (3 November 2026)

**Decision**: Three changes from the product owner's first full morning in Compass. (1) Between operations, the one control is a large blue "Next: Subtraction →" button straight under the score, with "or press Enter" beneath it; it used to be a plain black button below the "N more to go" line. (2) In a Compass run of two or more operations, every screen starts with "Exercise 2 of 4" over one pill per operation in this visit: finished ones green with a tick, the current one blue, the rest outlined. (3) Score, accuracy and time each have their own color (blue, teal, violet), on the big numbers, their labels and the matching columns of the summary table. Each `part` report also carries `index` (1-based) and `of` (operations in this visit). App version 1.2.0.

**Why**: The tester could not see where to click to go on: a black button on a white page with black text reads as more text. The learner should never have to hunt for the way forward. Knowing how many exercises are left makes a fixed-length warm-up predictable, which lowers anxiety for the same reason the fixed problem count does. The pills sit above the problem, small and grey except for the current one, so they do not pull attention from the problem (the reason a progress bar was left out in Lesson 1). On the results screens all-black numbers ran together; one color per measure lets the eye find each value and match it to the table.

**Alternatives considered**: auto-advancing to the next operation after a few seconds (takes the pause and the review away from the learner); a progress bar (draws the eye during practice, Lesson 1); green for accuracy (reads as "good" even when accuracy is low, so a neutral teal is used). `of` counts this visit only: a resumed warm-up that runs the two missing operations shows "1 of 2"; the whole day's count is Compass's to show, since only Compass knows what was done earlier.

### Decision 15: No "Exercise N of M" Pills (4 November 2026)

**Decision**: The "Exercise N of M" line and the row of one pill per operation (Decision 14, part 2) are removed from Compass runs. The practice screen keeps its "Addition · Problem 3 of 15" line, the screen between operations keeps "One more to go" and the "Next: Subtraction →" button, and the results screen keeps one row per operation. `part` reports still carry `index` and `of`. App version 1.3.0. Closes #4.

**Why**: The pilot student, after the second morning in Compass, said the row of operations above every screen is a distraction. Compass already shows the warm-up's progress in its own top bar ("Warm-up 1 of 4", counted across the day), so the app was repeating it, above the problem, which is where Lesson 1 says nothing should pull the eye.

**Alternatives considered**: keeping the line and dropping only the pills (still repeats Compass's bar); hiding them only during practice (the student's complaint was about the row itself).

### Decision 16: Mixed and Grouped Days Alternate (4 November 2026)

**Decision**: In a Compass run of two or more operations, the layout alternates by the learner's local calendar day. On even days (days since 1 January 1970, counted in local time) the operations are interleaved in one mixed set; on odd days they run grouped, one after another, as before. A mixed set has 15 problems of each listed operation: 15 rounds, each round every operation once in a random order, and never the same operation twice in a row across rounds. Each operation keeps its own difficulty level, streak, trivial-problem limits and recent operands, exactly as if it ran alone. The practice line reads "Mixed · Problem 12 of 60" and there is no screen between operations. Each operation's `part` report appears the moment its 15th problem is answered, with its own items, and `seconds` is the sum of its own response times (the set interleaves it with the others, so wall time cannot be split). Every `part` report gains `mode` (`mixed` or `grouped`). The results screen says "Mixed practice done ✓" with the whole set's score and time, one row per operation (so a weak operation still shows, Decision 13), and every problem. A run of one operation (a resumed warm-up missing one) is always grouped. `mode=mixed` or `mode=grouped` in the URL forces one, for testing. Outside Compass nothing changes. This settles open question 4 with option B (even distribution, random order within each round).

**Why**: The pilot student asked for mixed problems, and the product owner chose to alternate days between mixed and grouped. Mixed practice makes the learner recognise which operation each problem needs instead of repeating one procedure fifteen times, which is the interleaving principle (Rohrer, Dedrick & Stershic 2015: interleaved maths practice scored much better a day and a month later); interleaving suits facts that are already learned, which is what a warm-up practises. Grouped days keep each operation's practice concentrated. Equal rounds keep exactly 15 problems per operation, so Compass's per-operation `part` reports, XP of 2 per operation and resume rules work unchanged; pure random choice would give uneven counts. The app decides the day itself from the device's local date because the learner's day in Compass is the local day too, and that needs no change to Compass, its plan or its shells, and goes live with the next GitHub Pages publish.

**Alternatives considered**: Compass choosing the mode through a new launch parameter (needs a shell build and a plan field for a rule the app can apply alone; possible later if a guide should choose); alternating by session instead of by day (two visits on one day would differ); fully random operation per problem (uneven counts per operation); weighting towards weak operations (open question 4, option C; needs the per-operation fluency data first). Expect mixed days to score a little lower than grouped days: interleaving is harder in the moment while helping retention, so compare mixed days with mixed days.

**Known limit**: all operations of a mixed set finish in its last round, so a learner who stops partway through a mixed set has finished no operation and does the whole set again on the next visit that day (Compass then launches the same parts, still mixed on that day).

### Decision 17: No Repeats, Faster Climb, Fireworks (4 November 2026)

**Decision**: Three changes from the product owner's testing. (1) A session never repeats a problem (7 × 2 and 2 × 7 still count as one) while an unused problem is left anywhere in reach. Each level now lists every problem it can give; the next problem is drawn from the unseen ones at the learner's level, preferring those that keep the soft rules of Decision 10 (trivial limits, no number from the last two problems). If a level runs out, an unseen problem comes from the nearest level, one up first. (2) The learner moves up a level after 2 correct in a row instead of 3, except that climbing back into a level they slipped out of earlier in the same exercise takes 3. Any wrong answer still drops one level. (3) When an exercise's accuracy is above 85% (13/15 or better; 52/60 or better for a mixed set), a few seconds of square-spark fireworks go off over its score screen. They use the app's own colors, make no sound, let clicks through, stop when the learner moves on, and do not run at all when the device asks for reduced motion. App version 1.4.0.

**Why (repeats)**: the old generator drew at random and retried up to 50 times; when no draw passed every rule it kept the last draw, duplicate or not. Levels 1 and 2 are tiny (addition within 5 has 6 distinct facts; the only non-trivial level-1 multiplication fact is ×2, and the "no recent number" rule then blocks every ×2 problem right after one), so that fallback fired constantly, most of all after a wrong answer sent the learner back down. Simulated with the old code, about half of 15-problem exercises and over 90% of 60-problem mixed sets had a repeat; a weaker learner saw about 15 repeats per mixed set. With the new picker: none, and the soft rules hold far more often too (more than 3 trivial problems in 31% of exercises before, under 1% now). Repeats are a hard rule; the soft rules give way first.

**Why (2 up, 1 down, 3 to go back)**: every exercise starts at level 1, so with 3 to advance a strong learner spends 9 of 15 problems climbing. With 2 it takes 6, and a strong learner's average level rises from about 2.6 to 3.0. The cost is that a learner who reaches the edge of their ability settles where they get fewer right: a "2 up, 1 down" staircase settles where the learner is right about 71% of the time (0.71² = 0.5), against 79% for "3 up, 1 down". Requiring 3 to re-enter a level already slipped out of keeps the fast first climb but stops a learner bouncing in and out of a level that is too hard today; in simulation it recovers about half the accuracy given up (a typical learner: 89% with 3-up, 84% with plain 2-up, 85% with this rule). Softening the drop (for example, dropping only after 2 misses in a row) was rejected: it makes the settling point harder, not easier (it settles near 50%), and a wrong answer making the next problem easier is part of the low-anxiety design (Lessons Learned 2).

**Why (fireworks)**: a clear, earned celebration for an exercise done well, in the spirit of an end-of-level fireworks burst. It appears only on the score screen, after practice, so it cannot distract from a problem, and it adds no pressure during practice. This is a deliberate exception to "no animations" (Minimal UI Design).

**Alternatives considered**: pre-generating the whole session (Decision 10's option 2; the per-problem picker keeps adaptive difficulty simple); allowing a missed fact to come back later in the session (useful retrieval practice, but the product owner asked for no repeats); fireworks at 80% (12/15 would earn them, which makes them less special).

### Decision 18: Fluency Counts, Misses Are Corrected, Facts Only (5 November 2026)

**Decision**: Five changes from a review of the app against fact-fluency research, none of which needs anything from Compass. App version 1.5.0.

1. **Fluent = correct and fast.** A correct answer given within 3 seconds (`FLUENT_MS`, per operation) is *fluent*. Only fluent answers build the streak that moves a learner up a level; a correct but slow answer neither builds nor breaks it, and a wrong answer still drops one level. The learner never sees a timer or the threshold: a slow correct answer gets the same green tick. Each `part` report adds `fluent` (fluent answers out of 15) and `fluentMs` (the threshold), and each item adds `fluent`.
2. **Every miss is corrected.** After a wrong answer the right answer appears in the answer box, in dark text on the red box with a red ✗ beside it, for 1.5 s. The same problem then comes back once, 3 problems later ("Try this one again" on the progress line), or at the end of the exercise if fewer than 3 are left. The retry is not scored, does not move the level, and is not in the report or the review table; the original miss is. This is a narrow exception to Decision 17's no-repeat rule: only a missed problem comes back, and only once.
3. **Facts only.** Level 4 of addition is now the single-digit facts that cross ten (8 + 7; 36 of them, 20 once 7 + 8 and 8 + 7 count as one), and level 4 of subtraction their inverses (13 − 6; 36 facts), replacing two-digit sums within 75 (Decision 5). Level 3 addition is capped at 20; before, 45 of its 150 problems went over 20 (up to 19 + 10).
4. **Cleaner response times and a number pad.** Time spent with the page hidden (another tab, the device asleep) no longer counts towards a problem's `ms` or the exercise time, and items over 30 s are marked `outlier: true` in the report. On touch screens a 0–9 pad with ⌫ and Enter sits under the problem and the device keyboard stays down (`inputmode="none"`); `keypad=1` or `keypad=0` in the URL forces it on or off.
5. **Tests.** The practice rules moved into their own `<script id="automath-core">` block with no page code, so `node --test` can check them without a browser (`tests/`), and `node tests/simulate.js` plays simulated learners through them. A GitHub Action runs both on every PR, and fails when `index.html` and `automath.html` differ.

The picker also changed in one way the tests found: a level-1 learner who stayed there all exercise could run out of ×2 facts and get a run of ×0 and ×1 problems (multiplication or division broke the trivial limits in about 30% of such exercises). The picker now weighs every unseen problem by its distance from the learner's level as well as the soft rules, so a trivial problem the limits forbid is replaced by a fresh one from the next level up.

**Why (fluency)**: automaticity is fast, effortless recall. A learner who counts on their fingers gets the answer right, so accuracy alone could not tell that apart from recall, and the app moved such a learner up to harder facts while the easy ones were still slow. Mastery for facts needs speed as well as accuracy (Learning-science principles 6 and 11). Keeping the threshold hidden keeps Decision 4: no timer pressure during practice. In simulation (`node tests/simulate.js`, compared with `--accuracy-only`), a learner who knows level 3 but recalls slowly now practises at an average level of 1.7 instead of 2.9 and gets 94% right instead of 86%: they stay on the facts they know until those are fast. A learner who is fast through level 4 is barely affected (average level 3.1 either way).

**Why (corrections)**: a red ✗ alone tells the learner they were wrong, not what is right; the right answer was only in the review table at the end, which a learner can skip. Seeing the correct fact and then producing it again a few problems later is what turns a miss into learning (principle 13). Open Question 5 had already leaned this way ("showing correct answer after wrong response could support learning").

**Why (facts only)**: two-digit sums are worked out, not recalled, so they cannot become automatic in this sense, and their long response times would hide the fluency signal. The facts that cross ten are the ones students most often stay slow on.

**Alternatives considered**: showing a timer or a speed score (rejected by Decision 4); making a slow answer reset the streak (it punishes a learner for something they cannot see); a lower threshold for young learners (needs Compass to say who is young, a later change); keeping two-digit sums as an optional exercise (possible later as its own app or mode).

**Later, with Compass**: starting each learner at their last level, per-fact practice and review across days, dropping fluent operations from the daily warm-up, and a fluency report for guides. All of these build on the `fluent` data added here.

### Decision 19: Track Every Fact, Practise the Weak Ones, Graduate (5 November 2026)

**Decision**: In Compass runs Automath keeps a record of every fact for each learner, chooses each operation's problems from it, and lets an operation graduate out of the daily warm-up once its facts are mastered, coming back only for short check-ins. Automath still stores nothing: the record travels to Compass in a new `state` report and comes back in a new `compass_state` launch parameter. App version 1.6.0. The design document is "Automath fact mastery and graduation (design)", 5 November 2026.

1. **The fact table** is every problem any level can give, counted once (7 × 8 and 8 × 7 are one fact): 100 addition, 145 subtraction, 90 multiplication and 142 division facts, 477 in all. A fact's *tier* is the first level that gives it, and new facts are introduced tier by tier.
2. **Each fact has a state.** Unseen; Learning (missed, slow, or not yet fast twice in a row); Fluent (fast and correct); Mastered (fluent on 3 separate days). A fact answered fast and correctly the first time it is ever asked was known already, so it starts as Fluent with two days' credit and is Mastered by one more fast answer 3 or more days later. *Fast* is the 3 s of Decision 18, or the learner's own typing time on rule facts (n + 0, n × 1) plus 1.5 s if that is longer, never over 6 s.
3. **Spaced review.** Each Fluent or Mastered fact has a review date. A fast, correct answer on or after it moves the next one out: 1, 3, 7, 14, 30, 60, then 120 days (60% of that for a fact that has slipped before). A wrong or slow answer is a slip: the fact goes back to Learning, due at once. Answering a fact before its date changes nothing, and a retried miss (Decision 18) is never recorded.
4. **A practice day** is still 15 problems per operation, with mixed and grouped days as before (Decision 16). It holds the 4 weakest Learning facts 2 or 3 times each, the reviews that are due (Fluent before Mastered, longest overdue first; 5 places while new facts are still coming), up to 2 new facts per free Learning place (none once 6 facts are being learned), and known facts to fill. At most 3 rule facts, the same fact never within 3 problems of itself, and no two problems in a row sharing a number where avoidable.
5. **Graduation.** An operation graduates when 95% of its facts are Mastered and none is Learning. It then rests, with a 10-problem check-in after 1, 2 and 4 weeks, then every 8 weeks. A check-in asks the facts that slipped, the due reviews, then a sample of mastered facts. One slip is allowed. Two or more bring the operation back to daily practice; only the slipped facts are Learning again, so it graduates again as soon as they are fluent. After a good check-in, overdue mastered facts that have never slipped move out too, since the sample stood for them.
6. **Compass.** The `state` report carries `data` (the record, about 2,400 URL-safe characters), `due` (the date each operation is next needed: today for daily practice, the check-in date for a graduated one), `summary` (per operation: mastered, fluent, learning, unseen, total, graduated) and `fluentMs`. It appears after every finished operation, so a learner who stops partway keeps what they did. Compass is to keep the newest one per learner and pass `data` back as `compass_state`, and to launch only the parts whose `due` date has come (app contract 0.4).
7. **Without a record** (a first day, or a Compass that does not pass one back yet) the level staircase picks the problems exactly as before and its answers start a new record. Outside Compass nothing changes. A record that is missing, damaged or in an unknown format is ignored, so a learner never gets stuck.
8. **If Compass launches a resting operation anyway**, it is reported finished at once (`rest: true`, no items) and nothing is asked; if every listed operation is resting, the app says "Nothing due today ✓". A check-in's `part` report has `check: true` and 10 items. With a record, the screens add one line per operation: "Multiplication facts mastered: 72 of 90", or the news that it graduated, came back, or passed its check-in.

**Why**: the goal of the warm-up is to make itself unnecessary. Practising a fixed level every day spends most of a strong learner's time on facts they already know, and gives a learner who is slow on the 8s and 9s only an occasional 8 × 7. Practice is aimed at the facts that are weak (principle 12: practise at the edge), mastery needs fast answers on separate days, not one good sitting (principles 1, 6 and 7), reviews spread out as facts hold (principle 8), and a graduated operation is checked rather than dropped, since forgetting shows first as slowness. Keeping the record in Compass but its rules in Automath follows the app contract's aim that an app needs no code in Compass.

**Simulation** (`node tests/simulate-days.js`, 180 days of warm-ups for four model learners): a learner who knows almost every fact graduates the four operations on days 34, 58, 32 and 46 (+, −, ×, ÷) and has a warm-up on 126 of 180 days; one who knows the easy half graduates by day 104; one weak on the 8s and 9s by day 71; one who knows few facts and learns slowly graduates addition and multiplication by day 127 and is still practising subtraction at day 180. Accuracy stays between 88% and 95%. A learner who knows every fact graduates subtraction, the largest table, on day 26 (each fact must be asked on two separate days). The learner model is crude; the numbers are for comparing rule changes, not predictions.

**Alternatives considered**: Compass working out the weak facts from the answers it already stores and passing a list (`compass_focus`), rejected because the learning rules would live in two repositories; storing the record in the browser (lost between devices and when storage is cleared, and Compass is the learner's record); counting first-sight fluent facts as Mastered at once (mastery is shown on separate days, never in one sitting); a fixed check-in of every fact (about 50 reviews a fortnight even at long intervals, so check-ins sample instead); stopping the times tables at 10 (the app already goes to 12).

**Known limits**: changing any level's problems changes the fact table and needs a new record format (`FORMAT`); `tests/facts.test.js` fails until it is bumped. Facts practised in the main math app are not counted as review, since Compass cannot see them. The `due` date is the device's local day, like Decision 16.

### Decision 20: A Color for Each Operation (5 November 2026)

**Decision**: The problem sits on a card colored by its operation: a bar along the top, a light tint behind the numbers, and the sign in the same color. Addition is blue (#2563eb), subtraction amber (#d97706), multiplication purple (#7c3aed), division teal (#0f766e). The sign keeps the numbers' size and weight, and there is no word label. The sign moves 28 px in from the card's left edge; the answer box still runs the card's full width. App version 1.7.0.

**Why**: in a mixed run (Decision 16) almost every problem changes operation, and a tester answered several with the wrong one (adding instead of dividing). The thin black signs at the numbers' weight made + and ÷ look alike at a glance. Color tells the operations apart before the numbers are read, and each sign still has its own shape, so a colorblind learner loses nothing. Noticing the operation is part of what mixed practice trains; the color makes the sign easy to see, it does not answer the problem.

**Alternatives considered**: a larger, bold sign and a word label ("Add", "Divide") above the problem, both tried in a mockup and dropped by the tester as unnecessary once color was there; a flash when the operation changes (it would fire on nearly every mixed problem).

### Decision 21: 10 Problems per Operation (5 November 2026)

**Decision**: A practice day is 10 problems per operation instead of 15, so a mixed day with all four operations is 40 problems instead of 60 (plus retried misses). The staircase without a record gives 10 too. Focus facts (Decision 19) now take at most 6 places, so at least 4 are left for reviews and new facts. Check-ins stay at 10. App version 1.7.0.

**Why**: a tester found a 60-problem mixed day too long for a warm-up meant to take about 5 minutes.

**Cost**: fewer asks a day means slower progress through the fact table. In `node tests/simulate-days.js`, the learner who knows almost every fact graduates on days 62, 99, 49 and 87 (+, −, ×, ÷; was 34, 58, 32, 46), and the learner weak on the 8s and 9s on days 78, 100, 102 and 116 (was 37, 64, 71, 67). The slowest model learner graduates only multiplication within 180 days. If that is too slow, the next levers are more new facts per day or fewer known-fact fillers, not a longer day.

### Decision 22: A Slow Answer Steps a Mastered Fact Down, Not Back (5 November 2026)

**Decision**: A right but slow answer on a Mastered fact makes it Fluent again, with two days' credit, due the next day. One fast answer then makes it Mastered again. A wrong answer is still a slip back to Learning (Decision 19), and so is a slow answer on a fact that is not yet Mastered. Either way the fact counts as having slipped before, so its later reviews come sooner. App version 1.7.0.

**Why**: the first answer after days away (a vacation, a weekend, an illness) is often a little slow even when the fact is known. Under Decision 19 that one answer wiped out all of the fact's credit, so a learner would have to re-earn mastery over three more days. Being slow but right is weaker evidence of forgetting than being wrong, so it gets a smaller step back. Nothing in the model expires during an absence: "3 separate days" never needed consecutive days, and a review is due *on or after* its date.

**Simulation** (`node tests/simulate-days.js`, at 10 problems per operation): the learner who knows almost every fact graduates on days 55, 91, 48 and 73 (was 62, 99, 49, 87 at 10 problems without this rule); the learner weak on the 8s and 9s on days 71, 103, 97 and 105 (was 78, 100, 102, 116).

### Decision 23: Answer Out Loud (10 November 2026)

**Decision**: A learner can say the answer instead of typing it. A switch under the answer box, "Answer out loud", turns the microphone on; it then reads "I'm listening" and stays on for every problem, and on this device for later visits, until it is tapped off. The number heard goes in the answer box. A heard number that is the right answer is checked after a 250 ms pause (so "four" can still become "fourteen"); any other number is checked when the recognizer decides the learner has stopped talking. The last number said counts, so "five... no, six" is 6. Talk during the tick or the correction is ignored, and the recognizer restarts after each answer so the end of one answer cannot run into the next. The number pad and keyboard work as before, alongside. App version 1.8.0.

**How**: the browser's own speech recognizer (the Web Speech API: Chrome, Edge, Safari on iPad and Mac; not Firefox). No library and no server of ours, so the app stays one file. The switch shows only where the browser has a recognizer. If the microphone is refused or the recognizer keeps failing, the switch turns off and reads "Microphone is off"; tapping it tries again. `<script id="automath-speech">` turns what the recognizer writes ("919", "1,121", "nine hundred nineteen", "for", "it's 12") into a number, and `tests/speech.test.js` checks it against every answer the warm-up can ask for. `voice=1` or `voice=0` in the URL forces the switch.

**Timing**: a spoken answer's time runs from the problem appearing to the moment the recognizer first heard the number that was checked. That includes the time to say it and the recognizer's own delay (a few hundred ms), much as a typed answer's time includes typing it and pressing Enter. The 3 s fluency line (Decisions 18 and 19) is unchanged; each answer in the `part` report now carries `voice: true` when it was spoken, so Compass data can show whether spoken answers need their own line.

**Where the voice goes**: Chrome and Edge send the audio to their speech service unless the browser can recognize speech on the device; newer Chrome can, and Automath asks for that from the second answer on (asking any earlier crashes Chromium that has no speech service). Safari uses Apple's recognizer, on the device where the iPad supports it. Nothing is recorded or kept by Automath.

**Compass**: both Compass shells refused every microphone request from an app. Compass app contract 1.3 adds the registry's `media` list: an app listed for `microphone` may use it from its own page while it is on screen (sigmaschools/compass-lab#208, same day). The iPad shell also needs the speech-recognition usage string (compass-lab#206). Once both ship in a shell build and Automath's registry entry has `media: ["microphone"]`, spoken answers work in Compass on the iPad. On the Mac they do not yet: Electron has no working speech recognizer (its built-in one needs a Google service key it does not ship with), so the recognizer fails with `network` and the switch turns itself off and reads "Microphone is off". Until then the switch reads the same in Compass.

**Why**: the person running the project shared a video of a young child answering a flashcard app out loud, hands in lap, with "I'm listening" above the number pad. For young learners, saying a fact is faster and closer to recall than finding digits on a pad, and it removes typing speed from the fluency measure.

**Risks**: a misheard number counts as a miss (and a slip in the fact record). Recognizers are good at single numbers, but a noisy classroom or a learner who pauses mid-number ("one hundred... forty-four") can produce a wrong one. Watch the share of spoken misses in Compass data.

## Lessons Learned

### 1. Simplicity is Hard

Creating a truly minimal interface required more design decisions than a feature-rich app. Every element had to justify its existence. The discipline of asking "Does this reduce cognitive load?" led to removing many "helpful" features.

**Example**: Removed progress bar initially, kept only text ("Problem 5 of 15") because visual bar drew attention away from problem.

### 2. Anxiety is the Enemy of Learning

Multiple decisions were driven by anxiety reduction:
- Removed timer from practice screen
- Fixed problem count (predictable endpoint)
- Removed failure states or negative feedback
- Made wrong answers helpful (difficulty decreases, student gets easier problems)

**Insight**: For K-5 students, emotional safety > efficiency. A slower student who enjoys practice will build more automaticity over time than a faster student who dreads it.

### 3. Adaptive Systems Need Tuning

Initial adaptive difficulty (1 correct → level up) was too aggressive. Finding the right balance (3 consecutive correct) required thinking about:
- Zone of proximal development (Vygotsky)
- Mastery learning (Bloom)
- Desirable difficulty (Bjork)
- Practical constraints (session length)

**Insight**: Adaptive algorithms must be tuned for both learning science AND real-world constraints (time, attention span, curriculum).

### 4. K-5 is a Wide Range

What works for kindergarten doesn't work for 5th grade:
- Kindergarteners need facts within 5
- 5th graders need 12× tables

The 4-level adaptive system handles this range well, but future features (like mixed practice) will need age-appropriate variations.

### 5. Context Matters: Warmup vs. Primary Instruction

Automath is designed for **warmup/practice**, not primary instruction. This means:
- No explanations or teaching during problems
- No worked examples or hints
- Focus on retrieval, not learning new concepts
- Assumes students have been taught these operations elsewhere

**Insight**: A good warmup tool is different from a good learning tool. Stay focused on the use case.

### 6. Single-File Architecture is Powerful

The constraint of a single HTML file forced:
- Zero dependencies (learn vanilla JavaScript better)
- Simple state management (no framework needed)
- Clear code organization (everything in one place)
- Ultimate portability (works anywhere)

**Insight**: Modern web development often over-engineers. For small, focused tools, vanilla HTML/CSS/JS is often the right choice.

### 7. Context Matters: Elementary vs. Abstract Math

Initial design showed equations horizontally (7 + 8 = ___) like adult mathematics. But K-5 students learn arithmetic vertically:
```
   7
 + 8
───
```

**Insight**: Always design for the user's context, not abstract "correctness." Elementary students need elementary formats.

### 8. Focus Beats Tradition

Original feedback design followed convention (feedback appears in separate area below input). But placing feedback inside the answer box with colored borders is superior because it keeps attention focused.

**Insight**: Question UI conventions when they split user attention. Sometimes the "wrong" design is actually better.

### 9. Problem Quality Matters More Than Quantity

Random problem generation is simple but creates duplicates, trivial problems, and patterns. Adding validation (no duplicates, limited trivial, reduced clustering) significantly improves practice quality.

**Insight**: For learning tools, quality of each interaction > speed of implementation. The extra 50 lines of validation code are worth it.

### 10. Research-Informed ≠ Research-Validated

Automath is informed by learning science research, but hasn't been empirically validated. Design decisions are based on:
- Published research on automaticity, mastery learning, etc.
- Expert consensus (Math Academy's principles)
- Common sense and user empathy
- Iterative user feedback and testing

**Next step**: Would benefit from formal user testing with real K-5 students and teachers in classroom settings.

### 11. The Decisions Log Stays Current; the Summaries Drift

Between 3 and 5 November 2026 eleven Decisions (12 to 22) were each recorded here in the pull request that made them, but the summary pages (README, Claude.md, PROJECT_CONTEXT.md) still said 15 problems per exercise, offered LocalStorage as the way to keep progress, gave line numbers from a 450-line file that is now about 2,000, and told contributors to push to a long-gone branch. A docs pass on 6 November brought them in line. **Lesson**: a change that alters a number or a workflow the summaries quote (problem counts, file layout, how to deploy) updates them in the same pull request; refer to functions and script blocks by name, not by line.

---

## Open Questions

### 1. Optimal Progression Rate

**Question**: Is 3 consecutive correct answers the right threshold for increasing difficulty?

**Current thinking**:
- 3 seems to work well (provides confidence before advancing)
- But we don't have empirical data
- May need to be different for different operations (multiplication harder than addition)

**Research needed**: User testing with students at different skill levels.

### 2. Session Length vs. Frequency

**Question**: Is 15 problems per operation optimal, or should we adjust?

**Current thinking**:
- 15 problems = ~2-4 minutes at automaticity level
- 4 operations = ~8-16 minutes total (exceeds 5-minute goal)
- Maybe students don't practice all operations daily?

**Alternative approach**:
- Reduce to 10 problems per operation (fit all 4 in ~5 minutes)
- Add "All Operations" mixed mode as primary path
- Keep single-operation mode for targeted practice

**Research needed**: Observational studies of actual usage patterns.

### 3. Starting Difficulty for Returning Users

**Question**: When implementing LocalStorage progress tracking, should we:
- A) Always start at last-achieved difficulty level
- B) Start one level below last-achieved (review/warmup)
- C) Use spaced repetition algorithm to determine starting point

**Current thinking**: Option B might be best for warmup context (start slightly easier, warm up to challenge).

**Research needed**: Review Math Academy's approach to warmup vs. learning modes.

### 4. Interleaving Strategy

**Question**: In a mixed operation mode, should we:
- A) Randomly select any operation for each problem
- B) Ensure even distribution (cycle through operations)
- C) Weight towards operations where student is struggling

**Current thinking**: Option A (random) aligns with interleaving research, but Option C might be more effective for automaticity development.

**Research needed**: Literature review on interleaving in arithmetic practice.

### 5. Feedback Granularity

**Question**: Should we ever provide more than binary ✓/✗ feedback?

**Possibilities**:
- Show correct answer after wrong response
- Provide hints for problems students skip
- Display running accuracy percentage during practice

**Current thinking**: All of these add cognitive load and might create anxiety. But showing correct answer after wrong response could support learning.

**Constraint**: Automath is for practice (retrieval), not instruction. If students don't know answers, they need teaching first.

### 6. Division by Zero

**Question**: Should we include division by zero as a special case lesson?

**Current thinking**:
- Currently avoided (divisors start at 1 or 2)
- Not typically K-5 curriculum
- Could cause confusion

**Decision**: Exclude for now, focus on standard arithmetic facts.

### 7. Negative Numbers

**Question**: Should subtraction problems ever result in negative answers?

**Current thinking**:
- Currently prevented (always subtract smaller from larger)
- Negative numbers introduced late elementary (4th-5th grade)
- Adds complexity to mental math

**Decision**: Exclude for now, focus on positive integers for automaticity.

### 8. Problem Sequencing

**Question**: Should problems within a difficulty level be:
- A) Completely random
- B) Ordered by sub-difficulty (e.g., 2× before 9× within same level)
- C) Spaced repetition of specific facts

**Current thinking**: Option A (random) is simplest and prevents pattern recognition/gaming.

**Future consideration**: Option C would be powerful with cross-session tracking.

### 9. Accessibility vs. Simplicity

**Question**: How much accessibility infrastructure should we add?

**Examples**:
- ARIA labels for screen readers
- Keyboard navigation
- High contrast mode
- Font size adjustment

**Tension**: These features add complexity to a minimal design.

**Resolution needed**: Can we implement core accessibility (ARIA, keyboard) without compromising simplicity?

### 10. Measurement & Analytics

**Question**: Should we ever collect usage data to improve the app?

**Possibilities**:
- Anonymous analytics (how long sessions take, accuracy rates)
- A/B testing different progression rates
- Sharing aggregated data with education researchers

**Constraint**: Privacy-first design, especially for children.

**Current thinking**:
- No external data collection (too complex, privacy concerns)
- LocalStorage only (stays on device)
- Future: Export feature for teachers/researchers (opt-in, student-level data)

---

## Design Principles Summary

When evaluating future changes, ask:

1. **Does this reduce cognitive load?**
   If it adds complexity, it needs strong justification.

2. **Does this reduce anxiety?**
   K-5 students are emotionally developing. Safety > efficiency.

3. **Does this support automaticity?**
   Fast, accurate recall is the goal. Does this help or hinder?

4. **Is this truly necessary for a 5-minute warmup?**
   Feature creep kills simplicity. When in doubt, leave it out.

5. **Does this align with learning science?**
   Reference Math Academy principles and cognitive research.

6. **Can a kindergartener use it independently?**
   If it requires adult explanation, it's too complex.

7. **Does this maintain the single-file architecture?**
   Portability and simplicity are core values.

---

## Conclusion

Automath is an exercise in minimalism guided by learning science. Every design decision prioritizes:
- Student emotional safety (low anxiety)
- Cognitive efficiency (low load)
- Learning effectiveness (automaticity through adaptive practice)
- Practical constraints (5-minute warmup, K-5 curriculum, zero setup)

The result is an app that does one thing well: provide daily, adaptive practice in basic arithmetic facts. Resistance to feature creep is essential to maintaining this focus.

Future development should be guided by:
1. Learning science research (particularly Math Academy principles)
2. User testing with real K-5 students and teachers
3. The design principles outlined above

When uncertain, default to simplicity. The best feature is often the one you don't add.
