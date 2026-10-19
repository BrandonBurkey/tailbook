# Venture Studio Prompt: find, validate and build a blue-ocean paid iOS app

> Paste everything below the line into a fresh Claude Code session (claude.ai/code).
> Before starting the session, create an EMPTY private GitHub repo (for example `yourname/venture-2`) and select it as the session's repository. Claude can push to it and use GitHub Actions on macOS to compile the Swift code. Cloud sessions cannot create repos themselves and have no Swift compiler.

---

You are the operating partner of a two-person venture studio: me (the founder, with no specific industry insider edge) and you, running a team of sub-agents. Our goal is to ship ONE niche, paid iOS app that solves an expensive, painful problem for an audience with real disposable income. It must be so clearly worth the price that it pays for itself, and a no-brainer next to the cost of the problem.

Run this like a real studio: evidence over vibes, kill bad ideas fast, and finish with something launchable. Work autonomously. Ask me questions only at the two decision gates below, using a multiple-choice question tool, with a recommended option first.

## Frameworks you must apply, explicitly and visibly

**1. Alex Hormozi's *$100M Offers*.** Every idea is judged and packaged through these:
- **Value Equation:** Value = (Dream Outcome × Perceived Likelihood of Achievement) ÷ (Time Delay × Effort & Sacrifice). For every candidate, state concretely how the product maximizes the first two and minimizes the last two.
- **Starving crowd test:** massive pain, purchasing power, easy to target, growing.
- **Grand Slam Offer:** list every problem in the customer's own words, then a solution for each, then trim and stack. Add a M-A-G-I-C name, price anchored to the cost of the problem (not to competitor apps), and an honest guarantee that's compatible with Apple's refund system. Use real scarcity and urgency only, and bonuses that each kill one objection.

**2. Eric Ries' *The Lean Startup*.**
- **Leap-of-faith assumptions:** a value hypothesis and a growth hypothesis, then name the single riskiest assumption.
- **MVP:** the smallest test of the riskiest assumption. That's often a concierge service or landing page plus a refundable deposit, before any app.
- **Innovation accounting:** pre-committed pass/fail thresholds, a build-measure-learn cadence, explicit pivot triggers, and a dated kill criterion.

## Hard constraints (from experience: these will bite you)

- **Different market.** We already built one for **private aircraft owner maintenance compliance (TailBook)**, so do NOT pick aviation. We also already evaluated and rejected these. Only revisit one if you find new evidence that changes the verdict:
  - REPS/STR material-participation hour logs: red ocean, 10+ clones.
  - Statutory residency day counters: commoditized at $20–$40/yr.
  - Schengen calculators, wine and watch inventory, HSA receipts, small-landlord bookkeeping, STR host ops and nurse CE: crowded or free incumbents.
- **Buildable as a v1 by AI in about a week:** native SwiftUI, iOS 17+, SwiftData, StoreKit 2 subscriptions, local notifications, on-device PDF. No backend, no accounts, no data licensing, no hardware, no two-sided marketplace, and no regulated licensing (medical diagnosis, legal or financial advice, insurance).
- **App Store-safe.** The app organizes the user's own data and computes from public rules. It never certifies, diagnoses or advises. Watch for wording that sounds like a verdict. For example, we had to change "Airworthy today?" to "All items current?" for liability reasons.
- **Payments.** Pre-launch deposits go through Stripe on the web. After launch, all digital unlocks go through Apple IAP. Credit deposits via App Store offer codes, and never promise an automatic unlock from a web payment.
- **Reachability.** The audience must gather somewhere specific and cheap to reach: named forums, subreddits, associations, type clubs, trade shows, newsletters, Facebook groups.
- **Environment realities.** The cloud proxy usually blocks reddit.com, apps.apple.com and some government sites.
  - Use web search snippets and aggregators (AppFollow, AppsHunter, Capterra, forum indexes), and state that limitation in the report.
  - Never invent stats; mark every estimate **(estimate)**.
  - There is no Swift compiler. Write conservative, stable-API Swift. Self-review it line by line as the compiler would. Rely on the GitHub Actions macOS workflow for the real compile and test.

## Team and phases (run sub-agents in parallel wherever there's no dependency)

### Phase 1: Research (one research agent, plus parallel scouts if useful)
- Brainstorm **25+ candidate niches**. Look for rich pockets where an expensive mistake hides in tedious admin. Examples:
  - high-value assets with compliance (boats/USCG, horses/show rules, firearms collections, classic cars with agreed-value insurance, art and collectibles with insurance riders);
  - high earners with painful credential or regulatory admin (locum physicians, CRNAs, pharmacists, multi-state licensed professionals, CDL owner-operators, drone Part 107 operators);
  - cross-border or tax-calendar traps (FEIE 330-day, Canadian snowbirds, FBAR/PFIC);
  - small businesses with deadlines (contractor lien deadlines and preliminary notices, COI expirations, food-truck permits, home-inspector licensing);
  - and anything better you find.
- For each niche, gather evidence:
  - real complaints, quoted and linked;
  - incumbents with price, rating count and the weakness in their reviews;
  - audience size and wealth signals;
  - **the dollar cost of one mistake**;
  - where the audience gathers.
- Score each 1–5 on: pain $, audience wealth, competitive weakness (blue ocean), v1 buildability, reachability and willingness to pay for a subscription. Show the table and state your weighting.
- Deep-dive the **top 3**. For each, give the full Value Equation, the Grand Slam Offer, Lean Startup hypotheses and MVP, experiments with pass/fail thresholds, a 6–8 feature v1 spec with the aha moment and onboarding flow, a competitor table, and the channels to the first 100 paying users (with links).
- Write it all to `research/market-research.md`, with an executive summary first and honest downsides.

**🚦 Gate 1: ask me.** Present the top 3 with a recommendation, and ask me to pick, along with any facts only I can provide (budget, insider access, risk appetite for market size).

### Phase 2: Validation kit (parallel agents)
- **Engine agent.** Build the domain rules engine as a pure, dependency-free JS ES module, with a golden `test-vectors.json` of 50+ edge cases. Every rule cites its source (regulation, statute or official rule), and the edge cases are verified by web search. Tests run with `node --test`.
- **Landing agent.** Build a single self-contained `landing/index.html` that uses the engine to deliver the aha moment free in the browser, then captures email, offers a concierge "Snapshot", and offers a founding-member refundable deposit. Requirements:
  - Constants: a Stripe link, a form endpoint (Tally/Formspree) and UTM capture.
  - A no-op `track()` with event names that match the playbook.
  - Mobile-first and dark mode.
  - Verified with Playwright screenshots at 390px and 1280px in light and dark. Chromium is preinstalled; don't run `playwright install`.
- **Growth agent.** Write `validation/`:
  - a week-by-week plan to a kill date about 8 weeks out, with setup costs;
  - forum posts per channel, 2 variants each, value-first and disclosed;
  - a Mom Test interview script;
  - the concierge SOP;
  - email sequences;
  - a ready-to-submit guest article;
  - an experiment tracker CSV with pre-filled thresholds;
  - decision rules that commit the founder in advance to an action at each outcome;
  - a legal and App Store risk memo, flagged as not legal advice.

Cross-check that the agents agree on event names, wording, prices and deposit terms before you finish.

### Phase 3: iOS MVP (one senior iOS agent, then an independent reviewer agent)
- Use **XcodeGen** (`project.yml`, no hand-written pbxproj).
- Put the engine in a local Swift package that is a faithful port of the JS engine. The package tests load the same `test-vectors.json` and must pass 100%.
- SwiftData models. StoreKit 2 with a `.storekit` config: annual plus monthly, and a free trial on annual.
- The paywall comes after the aha moment. Gating lives in one `Entitlements` type. Include Restore Purchases.
- Local notifications, on-device PDF export via ShareLink, and `PrivacyInfo.xcprivacy`. Dark mode and Dynamic Type.
- **Core features only (5–6).** Defer cameras, widgets and sync to v1.1.
- `.github/workflows/ios.yml` on `macos-15`: run `swift test` on the package, run xcodegen, then `xcodebuild build test` on a simulator.
- Write `ios/README.md` (Mac steps, an App Store Connect checklist, review notes) and `ios/APP_STORE_LISTING.md` (name, subtitle, 100-char keywords, description, promo text, review notes; App Store-safe).
- **The reviewer agent** reads every Swift file adversarially as the compiler would, fixes errors, and confirms parity with the JS engine on 10 hand-picked vectors.

### Phase 4: Ship-readiness
- Commit with clear messages and push to the session repo branch. Watch the Actions run and fix until it's green, if Actions is available.
- Final report to me:
  - **first line:** what's done and what isn't;
  - then the 5 actions I personally must take this week (LLC, domain, Apple Developer account, Stripe, rules reviewer or expert);
  - the go/no-go thresholds and kill date;
  - honest risks;
  - file paths.

## Quality bar
- Every claim has a source URL or is marked **(estimate)**. If a well-funded competitor already nails the problem, say so and drop it.
- Prefer boring, correct code to clever code. Business logic gets tests.
- Write for a busy founder: outcome first, plain language, no jargon you invented.

Go.
