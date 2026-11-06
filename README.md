# Automath

A minimal, research-backed math practice app for K-5 students to develop automaticity in basic arithmetic through adaptive, low-pressure daily warmups.

**[Try it now →](https://sigmaschools.github.io/automath/)**

![Automath Screenshot](https://img.shields.io/badge/Grade-K--5-blue) ![No Dependencies](https://img.shields.io/badge/dependencies-none-green) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

## What is Automath?

Automath helps elementary students build **automaticity** with basic math facts—the ability to instantly recall answers like 7+8=15 or 6×9=54 without conscious calculation. This frees up cognitive resources for higher-order mathematical thinking and problem-solving.

### Key Features

✨ **Adaptive Difficulty** - Starts easy and automatically adjusts based on performance
🎯 **Low-Pressure Design** - No timers during practice, supportive feedback, predictable sessions
⚡ **Quick Sessions** - 10 problems per operation, ~1-3 minutes when automatic
🧠 **Research-Based** - Built on learning science principles from *The Math Academy Way*
📱 **Works Anywhere** - Single HTML file, runs in any browser, works offline
🔒 **Privacy-First** - No data collection, no tracking, no login required

## How It Works

1. **Select an operation** - Addition, Subtraction, Multiplication, or Division
2. **Practice 10 problems** - Difficulty adapts in real-time based on your answers
3. **View your results** - See your score, accuracy, and total time

### Adaptive Difficulty System

- **4 difficulty levels** tailored to K-5 curriculum
- **Start easy** (facts within 5, simple times tables)
- **Progress gradually** after 2 quick, correct answers in a row (no visible timer)
- **Correct every miss** - the right answer shows, and the problem comes back once a few problems later
- **Get support immediately** when struggling (difficulty decreases on wrong answer)
- **Cap at age-appropriate level** (12× tables, addition and subtraction facts within 20)

### Running inside Compass

Compass, the school shell that runs a learner's apps in order, opens Automath as a daily warm-up. With `?compass_parts=addition,subtraction,…` the picker is skipped and the listed operations run in one visit: grouped one after another on odd local days, one mixed set on even days (`mode=mixed|grouped` forces one for testing). Each finished operation leaves a `kind: "part"` report in the page, and a `kind: "state"` report carries the learner's per-fact record, which Compass hands back next time as `compass_state`. With that record each day's problems aim at weak and due facts, reviews are spaced out, and an operation whose facts are mastered graduates out of the daily warm-up to short check-ins. Automath itself still stores nothing. The contract is `compass/APP-CONTRACT.md` in the Compass repository; the decisions are 12 to 22 in [DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md).

## Educational Principles

Automath is designed around cognitive learning science:

- **Mastery Learning** - Students demonstrate proficiency (2 correct in a row) before advancing
- **Zone of Proximal Development** - Adaptive difficulty keeps students challenged but not overwhelmed
- **Automaticity Development** - Focus on instant recall, not calculation strategies
- **Minimal Cognitive Load** - One problem at a time, clean interface, zero distractions
- **Low Anxiety Environment** - No countdown timers, no failure states, supportive feedback
- **Rapid Feedback Loops** - Immediate ✓/✗ feedback, fast transitions between problems

Based on research from [*The Math Academy Way*](https://www.justinmath.com/books/) by Justin Skycak and Jason Roberts.

## For Teachers & Parents

### Daily Warmup Routine

Automath is designed for **5 minutes or less** of daily practice:

- Morning classroom warmup (2-4 minutes per operation)
- Homework routine (practice one operation daily, rotate through the week)
- Intervention support (targeted practice on specific operations)

### Why Automaticity Matters

Students who automatically recall basic facts can:
- Solve complex problems faster
- Focus mental energy on problem-solving strategies
- Build mathematical confidence
- Access advanced concepts more easily

Automaticity is the foundation of mathematical fluency.

## Technical Details

### Built With

- Pure HTML5, CSS3, and vanilla JavaScript
- Zero dependencies, zero build process
- Single self-contained file (~87KB), with the practice rules and the fact record in their own script blocks so `node --test` can check them
- Works on all modern browsers

### Design Constraints

- **Single-file architecture** - Maximum portability
- **No external services** - Runs entirely client-side
- **Privacy-first** - No analytics, tracking, or data collection
- **Accessibility** - High contrast, large text, keyboard-friendly

### Problem Quality Features

✓ No duplicate problems in a session
✓ No commutative duplicates (7×2 and 2×7 treated as same)
✓ Limited trivial problems (×0, ×1, etc.)
✓ Reduced number pattern clustering
✓ Division always produces whole numbers

## Getting Started

### Use Online

Visit **[https://sigmaschools.github.io/automath/](https://sigmaschools.github.io/automath/)** in any modern browser.

### Use Offline

1. Download `automath.html` from this repository
2. Open it in your browser (Chrome, Firefox, Safari, Edge)
3. Works without internet connection

### For Developers

```bash
# Clone the repository
git clone https://github.com/sigmaschools/automath.git

# Open in browser
open automath.html

# Run the tests (Node 18+)
node --test
node tests/simulate.js
node tests/simulate-days.js

# Or use a local server
python3 -m http.server 8000
# Then visit http://localhost:8000/automath.html
```

## Documentation

- **[Claude.md](./Claude.md)** - Quick start guide and project overview
- **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - Technical documentation and architecture decisions
- **[DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md)** - Educational philosophy and design principles

## Roadmap

Future enhancements under consideration:

- [x] Progress across days: a per-fact record, spaced review and graduation in Compass runs (Decision 19); the stand-alone page still starts fresh each time
- [x] Mixed practice mode (Compass runs, alternate days); still to do on the stand-alone picker
- [ ] Visual progress indicator
- [ ] Keyboard shortcuts for operation selection
- [ ] Accessibility improvements (ARIA labels, screen reader support)
- [ ] Optional sound feedback

See [DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md) for full discussion of future features.

## Contributing

Contributions are welcome! When proposing changes, please ensure they align with our core design principles:

1. Does this reduce cognitive load (or increase it)?
2. Does this reduce anxiety (or create it)?
3. Does this support automaticity development?
4. Is this necessary for a 5-minute warmup tool?
5. Does this align with learning science research?
6. Can a kindergartener use it independently?
7. Does this maintain single-file architecture?

See [DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md) for detailed principles.

## License

MIT License - feel free to use, modify, and distribute.

## Acknowledgments

- Educational principles based on [*The Math Academy Way*](https://www.justinmath.com/books/)
- Inspired by Math Academy's adaptive learning platform
- Built with learning science research on automaticity, mastery learning, and cognitive load

## Support

Questions or feedback? [Open an issue](https://github.com/sigmaschools/automath/issues) on GitHub.

---

**Made for students, teachers, and parents who believe in the power of daily practice.**
