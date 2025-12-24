import { router } from './trpc';
import { pingRouter } from './routes/ping';
import { communityRouter } from './routes/community';
import { openstatesRouter } from './routes/openstates';
import { newsletterRouter } from './routes/newsletter';
import { newsRouter } from './routes/news';

export const appRouter = router({
  ping: pingRouter,
  community: communityRouter,
  openstates: openstatesRouter,
  newsletter: newsletterRouter,
  news: newsRouter,
});

export type AppRouter = typeof appRouter;
