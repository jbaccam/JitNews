import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@the-rundown/api-types';

export const trpc = createTRPCReact<AppRouter>();
