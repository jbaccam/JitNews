import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { dataSource } from '../db';
import { NewsletterSubscriber } from '../orm/entities/NewsletterSubscriber';
import crypto from 'crypto';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const confirmSchema = z.object({
  token: z.string().min(1, 'Confirmation token is required'),
});

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ input }) => {
      const subscriberRepo = dataSource.getRepository(NewsletterSubscriber);

      // Check if email already exists
      const existing = await subscriberRepo.findOne({
        where: { email: input.email },
      });

      if (existing) {
        if (existing.confirmed) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'This email is already subscribed',
          });
        }
        // Update confirmation token
        const confirmationToken = existing.confirmationToken || crypto.randomBytes(32).toString('hex');
        existing.confirmationToken = confirmationToken;
        await subscriberRepo.save(existing);

        return {
          success: true,
          message: 'Subscription updated. Email confirmation has been disabled.',
        };
      }

      // Create new subscriber
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const subscriber = subscriberRepo.create({
        email: input.email,
        zipCode: input.zipCode,
        city: input.city,
        state: input.state,
        confirmed: false,
        confirmationToken,
      });

      await subscriberRepo.save(subscriber);

      return {
        success: true,
        message: 'Subscription created. Email confirmation has been disabled.',
      };
    }),

  confirm: publicProcedure
    .input(confirmSchema)
    .mutation(async ({ input }) => {
      const subscriberRepo = dataSource.getRepository(NewsletterSubscriber);

      const subscriber = await subscriberRepo.findOne({
        where: { confirmationToken: input.token },
      });

      if (!subscriber) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid confirmation token',
        });
      }

      if (subscriber.confirmed) {
        return {
          success: true,
          message: 'Email already confirmed',
        };
      }

      subscriber.confirmed = true;
      subscriber.confirmedAt = new Date();
      subscriber.confirmationToken = null;

      await subscriberRepo.save(subscriber);

      return {
        success: true,
        message: 'Email confirmed successfully! You are now subscribed.',
      };
    }),
});


