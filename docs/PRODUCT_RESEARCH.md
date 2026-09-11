# Based News product and data research

Updated September 11, 2026.

## Product thesis

Based News should answer five questions in order:

1. What happened?
2. What context does a beginner need?
3. Why could this matter in the United States and in the user's community?
4. Where do credible sources disagree or emphasize different facts?
5. What can the user verify or do next?

The ZIP code is a local context layer, not an onboarding gate. A user can read world and U.S. coverage immediately and add location when they want local reporting, representatives, elections, and opportunities.

## What to learn from existing products

### Ground News

Ground News clusters articles about the same event and compares coverage by source bias, factuality, ownership, geography, and chronology. Its bias label is attached to the publication rather than independently determining the truth of each article. Ground averages ratings from AllSides, Ad Fontes Media, and Media Bias/Fact Check. Its Blindspot feature measures imbalanced attention across differently leaning sources.

Useful pattern: cluster first, then compare coverage. Do not present one isolated headline as “the left” or “the right.”

Sources: [Ground News rating system](https://ground.news/rating-system), [Ground News FAQ](https://ground.news/frequently-asked-questions)

### AllSides

AllSides uses categories from Left through Right and combines blind surveys, multipartisan editorial review, independent review, and some third-party research. It explicitly separates bias from accuracy and publishes a confidence level. Commercial products require a license for its ratings/API.

Useful pattern: show provenance, method, last review date, and confidence beside every label. Let users dispute a label without silently changing the shared rating.

Sources: [AllSides methodology](https://www.allsides.com/about/media-bias-rating-methods), [AllSides licensing/API](https://www.allsides.com/tools-services/bias-ratings-license-api)

### Semafor, Tangle, and Axios

Semafor separates facts, analysis, opinion, counter-narratives, and global perspectives. Tangle summarizes a central story and then presents strong arguments from the left, right, and center. Axios makes “why it matters” a first-class part of a short briefing.

Useful pattern: a Based News story should have stable blocks: Known, Why it matters, U.S. connection, Views in tension, What is uncertain, and Primary sources.

Sources: [Semafor's approach](https://www.semafor.com/about), [Tangle's format](https://tangle.substack.com/about), [Axios Smart Brevity](https://help.axios.com/hc/en-us/articles/36222626161435-What-is-the-Axios-Smart-Brevity-style)

## Recommended data architecture

No single API is sufficient. Use a layered pipeline.

### 1. Story discovery and clustering

- **Prototype:** NewsAPI can supply headlines and article metadata, but its free plan is development-only, delayed by 24 hours, and limited to 100 requests per day. Production begins at a substantial monthly cost.
- **Global breadth:** GDELT provides global event/news infrastructure, entities, story clusters, tone, and multilingual coverage. Its newer cloud API is metered and paid for ongoing API use.
- **Research/fallback:** Media Cloud exposes a large open news archive and search APIs, but it is better suited to research and analysis than a consumer breaking-news dependency.
- **Long-term:** ingest licensed feeds and publisher RSS feeds into Based News's own normalized article index. Store metadata, excerpts permitted by license, canonical URLs, timestamps, language, location, and source. Do not republish full copyrighted articles without rights.

Sources: [NewsAPI documentation](https://newsapi.org/docs), [NewsAPI pricing](https://newsapi.org/pricing), [GDELT Cloud API](https://gdeltcloud.com/api-docs), [GDELT Cloud pricing](https://gdeltcloud.com/pricing), [Media Cloud documentation](https://www.mediacloud.org/documentation)

### 2. Government ground truth

- **Federal:** Congress.gov API for bills, summaries, sponsors, members, committees, actions, amendments, and House roll-call votes.
- **State:** Open States API v3 for bills, votes, legislators, jurisdictions, committees, and some legislative events.
- **Elections/local representation:** Google Civic Information for election data, contests, polling/early-vote information, and political geography when supported. Data availability varies and election information changes close to election day, so the UI must show an official-source link and freshness timestamp.

Sources: [Congress.gov API](https://api.congress.gov/), [Open States API](https://docs.openstates.org/api-v3/), [Google Civic Information](https://developers.google.com/civic-information), [Google data guidelines](https://developers.google.com/civic-information/docs/data_guidelines)

### 3. Source-lens metadata

Preferred production option: license ratings from AllSides and/or Ad Fontes/MBFC rather than inventing a definitive classifier. Normalize to a Based News schema:

```text
source_id
lens_label             left | lean-left | center | lean-right | right | mixed | unrated
rating_provider
confidence             low | medium | high
reviewed_at
applies_to             news | opinion | both
method_url
```

Article-level AI may identify framing signals, including loaded language, omitted context relative to the cluster, quoted sources, or whether a piece is news/opinion. It should not silently overwrite the licensed source rating. AI analysis needs evidence spans, a confidence score, and an “insufficient evidence” outcome.

Critical wording:

- Say **Source lens**, not “truth score.”
- Say **Center**, not “unbiased.”
- Say **Coverage gap**, not “the other side is hiding this.”
- Keep factual reliability separate from political orientation.

### 4. Enrichment and explanation

For each story cluster:

1. extract entities, places, institutions, legislation, and claims;
2. deduplicate syndications and rewrites;
3. attach source-lens metadata;
4. retrieve primary sources and official records;
5. generate a structured beginner explanation from retrieved evidence;
6. run citation entailment and contradiction checks;
7. require human editorial review for high-risk breaking stories until the workflow is proven;
8. publish the cluster with timestamps, corrections, and an evidence trail.

LLMs should organize and translate evidence, not serve as the evidence.

## Identifying what a user values

Do not begin with “Are you liberal or conservative?” and do not infer ideology from ZIP code, race, gender, browsing behavior, or other sensitive proxies. Ask users directly, explain why, make every question skippable, and let them delete or edit the profile.

### Framework

Use three layers rather than one political score:

1. **Human values:** care, liberty, fairness, security, stewardship, tradition/community, and opportunity/prosperity. Schwartz's basic human values and moral-foundations research can inform coverage, but Based News should not claim to administer a validated psychological test unless it uses a licensed, validated instrument exactly as designed.
2. **Issue priorities:** education, cost of living, equal rights, environment, public safety, healthcare, technology, foreign policy, and others. Ask importance separately from policy position.
3. **Policy tradeoffs:** scenario questions reveal how a person balances two good outcomes or two feared harms. Preserve tension rather than collapsing it into a party label.

Pew's political typology is a useful precedent: it groups people using many values-and-attitudes questions rather than party affiliation alone, and acknowledges that some response patterns do not fit a group neatly.

Sources: [Pew typology methodology](https://www.pewresearch.org/politics/2021/11/09/political-typology-appendix-b/), [Pew explanation](https://www.pewresearch.org/politics/2021/11/09/how-we-identified-your-typology-group-2/)

### Question design rules

- Begin with lived experience, not political terms.
- Ask one question per screen.
- Explain the tension in one sentence.
- Offer “both,” “it depends,” and “skip” where they are honest answers.
- Avoid moralized answer wording where one option sounds obviously kinder or smarter.
- Ask the same underlying value in more than one context to reduce random results.
- Return themes and tensions, not a diagnostic identity.
- Say “Your current priorities suggest…” rather than “You are…”
- Show how each answer affected the result.
- Revisit the profile over time; values and positions can change.

### Scoring model for the MVP

Represent the profile as user-controlled weights, not a left/right scalar:

```text
value_weights:  care=.82, liberty=.71, stewardship=.68, ...
issue_interest: education=.95, foreign_policy=.62, ...
tradeoff_edges: speech_over_harm=.58, aid_over_nonintervention=.44, ...
confidence:     based on consistency and answered-question count
```

Use the profile to rank explanatory relevance. Always reserve part of the feed for major public-interest stories and credible challenge material so personalization does not become avoidance.

## Beginner-safe experience

Research on young audiences and news avoidance repeatedly points to overload, low personal relevance, difficulty understanding news, distrust, anxiety, and a sense that nothing can be done. Design for relief rather than urgency.

- Default to a finite briefing, not infinite scroll.
- Put reading time on every story.
- Define unfamiliar people, places, and terms inline without talking down to the reader.
- Offer “30 seconds,” “Understand it,” and “Go deeper.”
- Visually separate known facts, interpretation, disputed claims, and unknowns.
- Include a calm “What can I do?” section only when a real action exists.
- Let users pause distressing topics without erasing major safety-critical developments.
- Avoid streaks, shame, breaking-news red everywhere, and engagement bait.
- Explain recommendation reasons and allow “less like this.”

Sources: [Reuters Institute on news avoidance](https://reutersinstitute.politics.ox.ac.uk/news/people-are-turning-away-news-heres-why-it-may-be-happening), [Reuters Institute on young audiences](https://reutersinstitute.politics.ox.ac.uk/understanding-young-news-audiences-time-rapid-change)

## MVP sequence

### Phase 1: trustworthy prototype

- World / U.S. / Near You feed navigation
- Manually curated or development-API story clusters
- Source-lens labels with visible provider and confidence
- Beginner story template with primary-source links
- Five-question values check-in stored only on the device
- Existing ZIP, state-bill, representative, newsletter, and civic-opportunity features

### Phase 2: working ingestion

- Scheduled ingestion, canonicalization, and clustering
- Topic/entity graph and geographic relevance
- Congress.gov federal data alongside Open States
- Editorial review console, corrections, and audit trail
- User accounts with explicit consent and export/delete controls

### Phase 3: representative alignment

- Map official actions to issues and values
- Show evidence cards instead of one opaque match percentage
- Distinguish promises, sponsorships, votes, statements, and outcomes
- Add candidate comparison only when data quality and election coverage are adequate

## Brand risk

“Based” is memorable for the intended age group, but it can also be read as internet slang with a partisan or combative connotation. The visual language and copy should counterbalance that: calm, evidence-forward, curious, and explicit that “based” means grounded in sources rather than aligned with a faction.
