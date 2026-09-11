# Based News project handoff

Last updated: September 11, 2026

This document preserves the product discussion, research conclusions, current implementation state, and recommended next steps for continuing Based News on another computer or in a new Codex conversation.

## Repository

- GitHub: <https://github.com/jbaccam/JitNews>
- Primary branch: `main`
- Product name: **Based News**
- Git author used for project commits: `Jeremiah Baccam <jjaybaccam@gmail.com>`
- Full research notes: [`docs/PRODUCT_RESEARCH.md`](docs/PRODUCT_RESEARCH.md)

Clone and start the project:

```bash
git clone https://github.com/jbaccam/JitNews.git
cd JitNews
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173` and the backend at `http://localhost:7001`.

Before committing on a new computer, configure Jeremiah's Git identity if needed:

```bash
git config user.name "Jeremiah Baccam"
git config user.email "jjaybaccam@gmail.com"
```

## The original project

The hackathon project was a civic engagement site. A user entered a ZIP code and received local government information, community events, volunteer opportunities, bills, representatives, and a newsletter signup. It also helped users draft messages to elected representatives.

The original names are retired. Do not restore Sous Teach, Sous-Chef, Involvee Times, Involve Times, or The Rundown as product branding. The new product is Based News.

The strongest idea from the original project remains important: reduce the effort between learning what is happening and taking meaningful civic action.

## Current product vision

Based News is a beginner-friendly news and civic understanding platform, primarily for college-age readers around 18 to 23 who want to be informed but feel overwhelmed or intimidated by politics and world events.

The product should help someone answer:

1. What happened?
2. What background do I need to understand it?
3. Why does it matter to the United States?
4. Why might it matter to me or my community?
5. What facts, priorities, or framing differ across sources?
6. What can I verify, learn, or do next?

Coverage should include:

- World news, including conflicts, diplomacy, trade routes, foreign aid, intervention, and humanitarian effects
- United States national news, policy, elections, legislation, and the economy
- Local news and civic information based on ZIP code
- Representatives, bills, meetings, volunteer opportunities, and other paths to involvement

ZIP code should remain useful, but it should not block entry into the product. A reader should be able to open Based News and immediately understand important world and national stories. Location becomes an optional context layer for local relevance.

## Product principles decided so far

### Explain without talking down to people

Assume the reader is curious and intelligent but may not know political vocabulary, historical context, government structure, or the people involved. Define unfamiliar terms in plain language. Avoid making beginners feel behind.

### Do not claim to be perfectly unbiased

Perfect neutrality is not a defensible promise. Based News should be transparent about evidence, uncertainty, source selection, and framing instead.

Separate these concepts:

- Political or editorial orientation
- Factual reliability
- Opinion versus reported news
- Confirmed facts versus disputed claims
- The amount of attention different sources give a story

Use **Source lens** for left, center, and right orientation. Do not call it a truth score. Center does not mean unbiased, and a political label does not determine whether an individual article is true.

### Compare story clusters, not isolated headlines

Group articles covering the same underlying event. Then show which facts, arguments, sources, and consequences different outlets emphasize. A left or right label on one isolated headline is not enough.

### Personalize relevance, not reality

What a user values may influence ordering, explanations, and the personal impact section. It must not hide major public-interest stories or factual information that challenges the user's current view.

### Keep the experience calm

Avoid panic-driven breaking-news styling, shame, infinite scroll, streak pressure, rage bait, and political team language. Prefer a finite briefing, visible reading time, clear hierarchy, and optional depth.

## Values and political self-understanding

The user wanted Based News to help people identify what they value and understand how candidates or representatives align with those values.

Do not begin by asking whether someone is liberal or conservative. Do not infer politics from ZIP code, race, gender, family background, or passive browsing behavior.

The recommended profile has three layers:

1. **Human values:** care, liberty, fairness, security, stewardship, community, and prosperity
2. **Issue priorities:** education, cost of living, equal rights, environment, healthcare, public safety, technology, free expression, and foreign policy
3. **Policy tradeoffs:** how a person balances competing benefits, risks, rights, and responsibilities

Question-writing rules:

- Start with lived experience instead of political terminology
- Ask one question at a time
- Explain the tradeoff in one short sentence
- Make every question skippable
- Include answers such as both or it depends when they are honest
- Avoid making one answer sound kinder or smarter
- Return themes and tensions, not a permanent political identity
- Explain how answers shaped the result
- Let users edit, reset, or delete the profile

The current homepage includes a five-question values check-in. It produces a small set of value themes in memory. It is a concept interaction only. It does not yet save a profile, rank real stories, or compare representatives.

## Editorial structure for a future story page

A full Based News story should use consistent sections:

1. **What happened**
2. **What you need to know first**
3. **Why it matters**
4. **The U.S. connection**
5. **How coverage differs**
6. **What is confirmed**
7. **What is disputed or still unknown**
8. **Primary sources and original reporting**
9. **What this connects to in your values or community**
10. **What you can do next**, only when a real action exists

Useful reading modes could eventually be:

- 30 seconds
- Understand it
- Go deeper

LLMs may organize and explain retrieved evidence, but they should not be treated as the evidence. Generated explanations need source links, claim checks, confidence handling, timestamps, and a correction trail.

## Design direction

The visual reference was the original hackathon interface, which looked like a physical newspaper page with torn or irregular edges.

The current design intentionally preserves:

- A white newspaper sheet on a warm background
- Jagged but smooth torn-paper edges
- A large serif masthead
- Thin rules, double rules, editorial columns, and monospaced metadata
- Modern spacing, restrained motion, and readable controls
- A calm black, paper, and muted blue palette

Mobile is the primary experience. Desktop should feel like a newspaper laid on a table. Mobile should feel like a folded newspaper section designed specifically for a phone, not a desktop page squeezed smaller.

Permanent writing rule: do not use em dashes in product copy, documentation, commit messages, or user-facing communication.

## What is implemented now

### Homepage

Key files:

- `packages/frontend/src/pages/Home/HomeNew.tsx`
- `packages/frontend/src/pages/Home/HomeNew.module.css`

The homepage currently has:

- Based News masthead and newspaper presentation
- World, U.S., and Local scopes
- Static example stories that demonstrate the intended editorial experience
- Source lens labels for left, center, and right
- A clear note that source orientation does not determine truth
- A ZIP-code form that calls the backend ZIP lookup and opens the civic page
- A keyboard-accessible values modal with focus handling and Escape support
- A five-question values check-in
- Responsive mobile and desktop styles

Important limitation: the polished homepage still uses static example story data. It is not connected to the existing NewsAPI and Guardian aggregation route yet.

### News aggregation prototype

Key files:

- `packages/backend/src/routes/news.ts`
- `packages/backend/src/services/NewsAggregation.ts`
- `packages/frontend/src/routes/test.tsx`

The backend can query NewsAPI and The Guardian. The `/test` frontend route displays the first five results from each provider for a hard-coded climate query.

This is only a technical prototype. It currently lacks:

- Scheduled ingestion
- Persistent article storage in the active route flow
- Canonical URL handling and duplicate removal
- Story clustering
- Topic and geographic classification
- Source lens metadata
- Primary-source retrieval
- Beginner summaries
- Citation or contradiction checks
- Homepage integration
- Production caching, quotas, and fallback behavior

### Local and civic features

Key files:

- `packages/backend/src/routes/community.ts`
- `packages/frontend/src/pages/Civic/CivicSnapshot.tsx`
- `packages/frontend/src/routes/civic.tsx`

ZIP lookup currently uses the public Zippopotam.us API. The backend returns the city and state and may return a county.

Community opportunity search currently returns an empty array. It needs a new real data source before volunteer, nonprofit, and donation results work again.

The civic screen contains a larger presentation layer for local information, but some data and features remain placeholders or disconnected from live services.

### Newsletter

The newsletter route stores subscribers in PostgreSQL and creates confirmation tokens. SendGrid delivery was removed from the repository. New subscribers therefore do not receive a confirmation email, and the current response explicitly says email confirmation is disabled.

The confirmation endpoint still exists, but a complete delivery flow needs a new email provider and clear consent, unsubscribe, and privacy behavior.

### Civic learning games

The repository still includes the civic games routes and components. The main header label was changed from Games to Learn. Some game content is mock data.

## Technical structure

The repository is an npm workspace monorepo:

```text
JitNews/
  packages/
    api-types/    Shared tRPC router types
    backend/      Express, tRPC, TypeORM, PostgreSQL
    frontend/     React, Vite, TanStack Router, React Query
  docs/
    PRODUCT_RESEARCH.md
  AGENTS.md
  PROJECT_HANDOFF.md
  README.md
```

Main backend routers:

- `ping`
- `community`
- `newsletter`
- `news`

The shared package is named `@based-news/api-types`.

## Environment variables

Do not commit API keys or database passwords. Create a local `.env` file as needed.

News retrieval:

```text
NEWS_API_KEY=
GUARDIAN_API_KEY=
```

Backend and frontend connection:

```text
PORT=7001
FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:7001
```

PostgreSQL:

```text
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=the_rundown
RUN_MIGRATIONS=false
```

The default database name still contains a legacy internal name. Rename it later through an intentional database migration and environment update. Do not casually change it if an existing database contains data.

There is a small inconsistency in default database ports between backend files. Review database configuration before relying on defaults on a fresh computer.

## Research conclusions

The detailed research and links are in [`docs/PRODUCT_RESEARCH.md`](docs/PRODUCT_RESEARCH.md). The most important conclusions are summarized here.

### Products studied

- **Ground News:** strong model for story clustering, source comparison, ownership, and coverage gaps
- **AllSides:** useful methodology and confidence patterns for media bias ratings; commercial use requires licensing
- **Semafor:** separates facts, analysis, competing views, and broader perspective
- **Tangle:** summarizes one issue and presents substantial arguments from multiple political viewpoints
- **Axios:** useful pattern for short, direct explanations of why a story matters
- **Pew political typology:** useful precedent for values-based grouping that uses many questions instead of one party label

### Data source direction

No single API is enough.

- **NewsAPI:** useful for early development and headline discovery, but free access has production limitations
- **The Guardian API:** already integrated as a second source
- **GDELT:** useful for broad international discovery, entities, events, tone, and multilingual coverage
- **Media Cloud:** useful for research and large-scale media analysis
- **Congress.gov API:** preferred official source for federal bills, actions, members, committees, and votes
- **Open States:** useful for state bills, legislators, votes, committees, and legislative events if the integration is restored
- **Google Civic Information:** useful for supported election and political geography data, with availability and freshness caveats

For source orientation, prefer licensed ratings from AllSides, Ad Fontes, or Media Bias/Fact Check instead of presenting an internally invented classifier as definitive.

## Recommended architecture

The next real data pipeline should be layered:

1. Fetch licensed feeds, APIs, and allowed RSS metadata
2. Normalize article title, URL, source, author, timestamp, image, language, and excerpt
3. Resolve canonical URLs and remove syndication duplicates
4. Cluster articles about the same event
5. Attach source orientation, methodology, provider, review date, and confidence
6. Identify entities, places, government bodies, legislation, and topics
7. Retrieve primary sources and official records
8. Produce structured beginner explanations from retrieved evidence
9. Validate citations and flag contradictions or insufficient evidence
10. Publish with timestamps, corrections, and an evidence trail

Do not republish full copyrighted articles unless Based News has the rights to do so. Store and display only metadata, licensed excerpts, original Based News explanation, and links where appropriate.

## Recommended next steps

### Priority 1: connect real news to the polished homepage

- Replace the hard-coded climate query with a general feed endpoint
- Add query parameters for scope, topic, page, and freshness
- Normalize NewsAPI and Guardian output into one shared article shape
- Add loading, empty, partial-provider, and error states
- Feed real results into the current World and U.S. tabs
- Preserve static fixtures only for development and tests

### Priority 2: cluster coverage

- Add canonicalization and duplicate detection
- Build a story-cluster model instead of rendering a flat list of articles
- Show all sources attached to one event
- Create the first story detail route using the editorial structure above

### Priority 3: source lens foundation

- Decide whether to license AllSides, Ad Fontes, or another provider
- Store provider, label, confidence, review date, and method URL
- Keep orientation separate from reliability
- Add unrated and insufficient-evidence states
- Never label an article left or right solely from an unsupported AI guess

### Priority 4: make values useful

- Save the values profile locally with explicit user control
- Add issue-priority questions separately from human-value questions
- Let users inspect, edit, reset, and delete their answers
- Use values to explain relevance and rank some content
- Reserve feed space for major public-interest and challenging stories

### Priority 5: connect civic evidence

- Integrate Congress.gov for federal bills and votes
- Restore or replace a state-legislation provider
- Map official actions to issues and values
- Distinguish votes, sponsorships, statements, promises, and outcomes
- Show evidence cards instead of one unexplained representative match score

### Priority 6: restore local action

- Choose reliable sources for public meetings, local reporting, elections, and volunteer opportunities
- Use ZIP code as a location preference rather than an onboarding barrier
- Display source and freshness information for every local result

### Priority 7: privacy and editorial safeguards

- Write a plain-language privacy model before storing political preferences on a server
- Keep values on the device for the early version
- Add export, reset, and deletion controls before account-based storage
- Establish corrections, attribution, conflict, and human-review policies
- Require editorial review for high-risk breaking stories until automated checks are proven

## Known technical cleanup

- The homepage uses static article examples
- `/test` is a developer page and is not responsive enough for production
- News routes are named `test` and `testBoth`
- Community opportunities are disabled
- Newsletter email delivery is disabled
- Some civic and learning content uses mocks
- Database defaults retain the internal name `the_rundown`
- Database port defaults are inconsistent
- No `.env.example` is currently committed
- The dependency audit previously reported vulnerabilities that should be reviewed without applying a blind breaking upgrade
- Production deployment and hosting have not been finalized in this conversation

## Recent project history

Important commits before this handoff:

- `fae53ee` added NewsAPI and Guardian retrieval and display
- `1effb72` removed OpenRouter integration
- `69fcce7` and `0298729` removed Open States integration
- `a1e61f2` removed SendGrid email integration
- `e3e5262` rebranded the product as Based News and restored the responsive newspaper interface
- `0a250a9` removed em dashes from product copy and documentation

The rebrand was applied on top of the existing remote history. The news API work was preserved instead of overwriting the repository with the earlier local clone.

## Definition of a strong first release

A useful first release does not need every political feature. It should let a beginner:

1. Open the site and see a finite set of important world, U.S., and local stories
2. Understand one story without already knowing the vocabulary or history
3. Compare how several credible sources cover the same event
4. See what is confirmed, disputed, and unknown
5. Understand why it could affect the United States and their own priorities
6. Set or skip a small values profile without being assigned a party identity
7. Follow links to original reporting and primary evidence
8. Find a local or civic next step when one genuinely exists

That is the clearest path from the hackathon concept to a trustworthy Based News MVP.
