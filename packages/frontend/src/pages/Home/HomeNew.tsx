import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { trpc } from '../../lib/trpc';
import styles from './HomeNew.module.css';

type Scope = 'world' | 'us' | 'local';
type ValueKey = 'care' | 'liberty' | 'fairness' | 'security' | 'stewardship' | 'prosperity';

const STORIES: Record<Scope, Array<{
  kicker: string;
  title: string;
  summary: string;
  impact: string;
  time: string;
  accent: string;
}>> = {
  world: [
    {
      kicker: 'GLOBAL EXPLAINER',
      title: 'Why one narrow shipping route can change life at home',
      summary: 'A beginner-friendly guide to the Strait of Hormuz, energy markets, military risk, and the decisions facing the United States.',
      impact: 'Prices · foreign policy · national security',
      time: '6 min',
      accent: 'violet',
    },
    {
      kicker: 'CONFLICT & DIPLOMACY',
      title: 'How to follow an overseas conflict without losing the context',
      summary: 'Separate confirmed events, disputed claims, historical background, humanitarian impact, and U.S. involvement.',
      impact: 'Human rights · defense spending · diplomacy',
      time: '8 min',
      accent: 'blue',
    },
    {
      kicker: 'FOLLOW THE MONEY',
      title: 'What “foreign aid” actually includes',
      summary: 'See the difference between military assistance, humanitarian relief, loans, equipment, and money spent inside the United States.',
      impact: 'Federal budget · alliances · humanitarian aid',
      time: '5 min',
      accent: 'amber',
    },
  ],
  us: [
    {
      kicker: 'U.S. GOVERNMENT',
      title: 'A bill is moving. Here is what has actually happened so far.',
      summary: 'Follow the text, amendments, committee actions, votes, and public statements without treating a proposal as settled law.',
      impact: 'Law · representation · public spending',
      time: '4 min',
      accent: 'blue',
    },
    {
      kicker: 'YOUR PRIORITIES',
      title: 'The decisions touching education, rights, land, and work',
      summary: 'A briefing ordered by the values you choose, with evidence that supports and challenges your current view.',
      impact: 'Personalized, not filtered',
      time: '7 min',
      accent: 'violet',
    },
    {
      kicker: 'REPRESENTATIVE TRACKER',
      title: 'What officials said, sponsored, and voted for',
      summary: 'Compare public promises with official actions and open the primary source behind every claim.',
      impact: 'Accountability · elections',
      time: '5 min',
      accent: 'amber',
    },
  ],
  local: [
    {
      kicker: 'NEAR YOU',
      title: 'Your local briefing starts with a ZIP code',
      summary: 'Find state bills, representatives, public meetings, elections, and ways to help in your community.',
      impact: 'Local government · community',
      time: '2 min setup',
      accent: 'violet',
    },
    {
      kicker: 'GET INVOLVED',
      title: 'Turn reading into one useful next step',
      summary: 'Save a meeting, contact a representative, understand a ballot, or find a volunteer opportunity nearby.',
      impact: 'Action without pressure',
      time: 'When you are ready',
      accent: 'blue',
    },
  ],
};

const VALUE_LABELS: Record<ValueKey, string> = {
  care: 'Care & wellbeing',
  liberty: 'Freedom & expression',
  fairness: 'Fairness & equal treatment',
  security: 'Safety & stability',
  stewardship: 'Land & future generations',
  prosperity: 'Opportunity & prosperity',
};

const QUESTIONS: Array<{
  eyebrow: string;
  prompt: string;
  context: string;
  options: Array<{ label: string; detail: string; values: ValueKey[] }>;
}> = [
  {
    eyebrow: 'Start with real life',
    prompt: 'When you imagine a good community, what feeling matters most?',
    context: 'There is no political vocabulary to know here. Pick what feels closest today.',
    options: [
      { label: 'People are looked after', detail: 'No one is abandoned when life goes wrong.', values: ['care', 'fairness'] },
      { label: 'People can live freely', detail: 'Others cannot control harmless personal choices.', values: ['liberty'] },
      { label: 'People feel secure', detail: 'Rules are dependable and daily life feels stable.', values: ['security'] },
    ],
  },
  {
    eyebrow: 'A hard tradeoff',
    prompt: 'Your town has extra money, but it can only do one thing first. What pulls you most?',
    context: 'Not what sounds impressive—what would you feel proud to defend to a neighbor?',
    options: [
      { label: 'Help people struggling now', detail: 'Expand housing, food, health, or student support.', values: ['care', 'fairness'] },
      { label: 'Invest for the long term', detail: 'Protect land, schools, and infrastructure for the future.', values: ['stewardship', 'prosperity'] },
      { label: 'Let residents keep more', detail: 'Limit spending and leave more choices to individuals.', values: ['liberty', 'prosperity'] },
    ],
  },
  {
    eyebrow: 'Speech and harm',
    prompt: 'Someone publicly says something you find deeply offensive. What worries you more?',
    context: 'Most people care about both freedom and harm. This asks which risk feels more urgent.',
    options: [
      { label: 'Silencing lawful expression', detail: 'Power to suppress speech can be abused.', values: ['liberty'] },
      { label: 'The harm the speech may cause', detail: 'Words can intimidate people or push them out of public life.', values: ['care', 'fairness'] },
      { label: 'Losing a shared standard', detail: 'Clear, consistently applied rules matter most.', values: ['security', 'fairness'] },
    ],
  },
  {
    eyebrow: 'The world beyond us',
    prompt: 'When people overseas are in danger, what responsibility should the U.S. feel first?',
    context: 'You can care about several answers. Choose the one you would least want leaders to ignore.',
    options: [
      { label: 'Protect human life', detail: 'Use aid and diplomacy to reduce suffering.', values: ['care', 'fairness'] },
      { label: 'Protect Americans from wider risk', detail: 'Consider security, alliances, and escalation.', values: ['security'] },
      { label: 'Avoid controlling other countries', detail: 'Intervene rarely and respect self-determination.', values: ['liberty', 'prosperity'] },
    ],
  },
  {
    eyebrow: 'Growth and place',
    prompt: 'A major project promises jobs but would permanently change nearby land. What comes first?',
    context: 'This is about the tension, not a correct answer.',
    options: [
      { label: 'Protect what cannot be replaced', detail: 'Some land and ecosystems should remain intact.', values: ['stewardship'] },
      { label: 'Create opportunity now', detail: 'Jobs and affordable growth can change families’ lives.', values: ['prosperity', 'care'] },
      { label: 'Demand a better compromise', detail: 'Move forward only with enforceable protections.', values: ['stewardship', 'fairness', 'prosperity'] },
    ],
  },
];

export function HomeNew() {
  const [scope, setScope] = useState<Scope>('world');
  const [zip, setZip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuesOpen, setValuesOpen] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!valuesOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setValuesOpen(false);
      if (event.key !== 'Tab') return;
      const buttons = modalRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [valuesOpen]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<ValueKey, number>>({
    care: 0, liberty: 0, fairness: 0, security: 0, stewardship: 0, prosperity: 0,
  });
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();

  const valuesComplete = questionIndex >= QUESTIONS.length;
  const topValues = useMemo(
    () => Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => VALUE_LABELS[key as ValueKey]),
    [scores],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedZip = zip.trim();
    if (trimmedZip.length !== 5) return;
    setIsLoading(true);
    setError(null);
    try {
      const locationData = await trpcUtils.community.zipLookup.fetch({ zipCode: trimmedZip });
      navigate({
        to: '/civic',
        search: { zip: trimmedZip, city: locationData.city, state: locationData.state, county: locationData.county },
      });
    } catch {
      setError('We could not match that ZIP code. Check it and try again.');
      setIsLoading(false);
    }
  };

  const answerQuestion = (values: ValueKey[]) => {
    setScores((current) => {
      const next = { ...current };
      values.forEach((value) => { next[value] += 1; });
      return next;
    });
    setQuestionIndex((current) => current + 1);
  };

  const resetValues = () => {
    setQuestionIndex(0);
    setScores({ care: 0, liberty: 0, fairness: 0, security: 0, stewardship: 0, prosperity: 0 });
  };

  const dateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const leadStory = STORIES[scope][0];

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className={styles.header}>
        <div className={styles.mastheadTop}><span>Est. 2025</span><strong>FREE</strong></div>
        <Link to="/" className={styles.brand} aria-label="Based News home">
          <span>Based News</span>
        </Link>
        <p className={styles.tagline}>Your community. Your country. Your world.</p>
        <div className={styles.edition}><span>{dateString}</span><span>CONCEPT EDITION</span></div>
        <nav className={styles.nav} aria-label="Primary navigation">
          <button className={styles.desktopNav} type="button" onClick={() => setScope('world')}>World</button>
          <button className={styles.desktopNav} type="button" onClick={() => setScope('us')}>U.S.</button>
          <button className={styles.desktopNav} type="button" onClick={() => setScope('local')}>Local</button>
          <Link to="/games">Learn</Link>
        </nav>
        <button className={styles.valuesButton} type="button" onClick={() => setValuesOpen(true)}>Find my values</button>
      </header>

      <main>
        <section className={styles.briefingHeader}>
          <div>
            <p className={styles.dateline}>THE WORLD, WITH CONTEXT</p>
            <h1><span className={styles.desktopHeadline}>Know what happened.<br />Understand what it means.</span><span className={styles.mobileHeadline}>Your daily briefing</span></h1>
          </div>
          <p className={styles.intro}>
            Clear news for people who do not have time to become political experts. See the facts, the disagreement,
            and the connection to your life—from your street to the rest of the world.
          </p>
        </section>

        <div className={styles.scopeTabs} role="tablist" aria-label="Choose your news scope">
          {(['world', 'us', 'local'] as Scope[]).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={scope === item}
              className={scope === item ? styles.activeScope : ''} onClick={() => setScope(item)}>
              <span className={styles.desktopTab}>{item === 'world' ? 'Around the world' : item === 'us' ? 'Across the U.S.' : 'Near you'}</span>
              <span className={styles.mobileTab}>{item === 'world' ? 'World' : item === 'us' ? 'U.S.' : 'Near you'}</span>
            </button>
          ))}
        </div>

        <section className={`${styles.feed} ${scope === 'local' ? styles.localFeed : ''}`} aria-live="polite">
          <article className={`${styles.leadStory} ${styles[leadStory.accent]}`}>
            <div className={styles.storyTopline}><span>{leadStory.kicker}</span><span>{leadStory.time}</span></div>
            <h2>{leadStory.title}</h2>
            <p className={styles.storySummary}>{leadStory.summary}</p>
            <p className={styles.impact}><strong>Connects to:</strong> {leadStory.impact}</p>
            <div className={styles.coveragePanel}>
              <div>
                <span className={styles.coverageLabel}>HOW COVERAGE DIFFERS</span>
                <p>Compare which facts and arguments are emphasized by sources with different editorial leanings.</p>
              </div>
              <div className={styles.lensScale} aria-label="Example source lenses: left, center, and right">
                <span className={styles.leftLens}>Left</span>
                <span className={styles.centerLens}>Center</span>
                <span className={styles.rightLens}>Right</span>
              </div>
              <p className={styles.methodNote}>Labels describe a source’s editorial pattern—not whether this story is true.</p>
            </div>
          </article>

          <aside className={styles.sideRail}>
            {STORIES[scope].slice(1).map((story) => (
              <article key={story.title} className={styles.storyCard}>
                <div className={styles.storyTopline}><span>{story.kicker}</span><span>{story.time}</span></div>
                <h3>{story.title}</h3>
                <p>{story.summary}</p>
                <span className={styles.cardImpact}>{story.impact}</span>
              </article>
            ))}

            <form className={styles.localCard} onSubmit={handleSubmit}>
              <p className={styles.localLabel}>MAKE IT LOCAL</p>
              <h3>What is happening near you?</h3>
              <p>Your ZIP helps find public decisions and opportunities nearby. It does not change which world stories you can see.</p>
              <div className={styles.zipRow}>
                <label className={styles.srOnly} htmlFor="home-zip">ZIP code</label>
                <input id="home-zip" inputMode="numeric" autoComplete="postal-code" placeholder="ZIP code" value={zip}
                  onChange={(event) => setZip(event.target.value.replace(/\D/g, '').slice(0, 5))} disabled={isLoading} />
                <button type="submit" disabled={zip.length !== 5 || isLoading}>{isLoading ? 'Finding…' : 'See local'}</button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </form>
          </aside>
        </section>

        <section className={styles.promise}>
          <p>BASED, NOT BOXED IN</p>
          <h2>Your values shape the context—not the facts you are allowed to see.</h2>
          <button type="button" onClick={() => setValuesOpen(true)}>Start a 2-minute values check-in</button>
        </section>
      </main>

      {valuesOpen && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setValuesOpen(false)}>
          <section ref={modalRef} className={styles.valuesModal} role="dialog" aria-modal="true" aria-labelledby="values-title"
            onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.closeButton} type="button" onClick={() => setValuesOpen(false)} aria-label="Close values check-in">×</button>
            {!valuesComplete ? (
              <>
                <div className={styles.progress} aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}>
                  <span style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} />
                </div>
                <p className={styles.questionCount}>QUESTION {questionIndex + 1} OF {QUESTIONS.length} · {QUESTIONS[questionIndex].eyebrow}</p>
                <h2 id="values-title">{QUESTIONS[questionIndex].prompt}</h2>
                <p className={styles.questionContext}>{QUESTIONS[questionIndex].context}</p>
                <div className={styles.answers}>
                  {QUESTIONS[questionIndex].options.map((option) => (
                    <button type="button" key={option.label} onClick={() => answerQuestion(option.values)}>
                      <strong>{option.label}</strong><span>{option.detail}</span>
                    </button>
                  ))}
                </div>
                <button className={styles.skipButton} type="button" onClick={() => setQuestionIndex((current) => current + 1)}>
                  I’m not sure—skip this one
                </button>
              </>
            ) : (
              <div className={styles.results}>
                <p className={styles.questionCount}>YOUR STARTING POINT</p>
                <h2 id="values-title">You are more than a left-or-right label.</h2>
                <p>These themes came through most strongly today. They can change, overlap, and sometimes conflict—that is normal.</p>
                <div className={styles.valueChips}>{topValues.map((value) => <span key={value}>{value}</span>)}</div>
                <p className={styles.resultNote}>Based News would use these to explain relevance and compare representatives’ actions. It would never hide a story because it challenges you.</p>
                <div className={styles.resultActions}>
                  <button type="button" onClick={() => setValuesOpen(false)}>Use these values</button>
                  <button type="button" onClick={resetValues}>Take it again</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </motion.div>
  );
}
