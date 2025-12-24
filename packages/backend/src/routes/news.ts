import { router, publicProcedure } from "../trpc";
import { NewsAggregationService } from "../services/NewsAggregation";
import { z } from 'zod';

export const newsRouter = router({
  test: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ input }) => {
      const newsApiKey = process.env.NEWS_API_KEY;
      const guardianApiKey = process.env.GUARDIAN_API_KEY;

      if (!newsApiKey || !guardianApiKey) {
        throw new Error('API keys not found in environment');
      }

      const newsService = new NewsAggregationService(newsApiKey, guardianApiKey);

      const articles = await newsService.fetchFromNewsApi(input.query);

      return {
        success: true,
        count: articles.length,
        articles: articles.slice(0, 5),
      };
    }),

  testBoth: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ input }) => {
      const newsApiKey = process.env.NEWS_API_KEY;
      const guardianApiKey = process.env.GUARDIAN_API_KEY;

      if (!newsApiKey || !guardianApiKey) {
        throw new Error('API keys not found in environment');
      }

      const newsService = new NewsAggregationService(newsApiKey, guardianApiKey);

      const [newsApiArticles, guardianArticles] = await Promise.all([
        newsService.fetchFromNewsApi(input.query),
        newsService.fetchFromGuardian(input.query),
      ]);

      return {
        success: true,
        newsApi: {
          count: newsApiArticles.length,
          articles: newsApiArticles.slice(0, 5),
        },
        guardian: {
          count: guardianArticles.length,
          articles: guardianArticles.slice(0, 5),
        },
      };
    }),
});