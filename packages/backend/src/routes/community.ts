import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

interface LeadsResponse {
  opportunities: Array<{
    title: string;
    organization?: string;
    url?: string;
    date?: string;
    location?: string;
    focus?: Focus;
    description?: string;
  }>;
}

type Focus = 'volunteer' | 'nonprofit' | 'donation';

interface LeadsInput {
  city: string;
  state: string;
  country: string;
  focus?: Focus;
}

const inputSchema = z.object({
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State / region is required'),
  country: z.string().min(1, 'Country is required'),
  focus: z.enum(['volunteer', 'nonprofit', 'donation']).optional(),
});

async function fetchCommunityLeads(input: LeadsInput): Promise<LeadsResponse> {
  // Community leads functionality has been removed
  return {
    opportunities: [],
  };
}

const zipCodeSchema = z.object({
  zipCode: z.string().length(5, 'ZIP code must be 5 digits'),
});

export interface ZipCodeResponse {
  city: string;
  state: string;
  county?: string;
}

async function fetchCityFromZip(zipCode: string): Promise<ZipCodeResponse> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

    if (!response.ok) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `ZIP code ${zipCode} not found`,
      });
    }

    const data = await response.json();

    // zippopotam.us response format:
    // { "post code": "02139", "country": "United States", "places": [{ "place name": "Cambridge", "state": "Massachusetts", ... }] }
    const place = data.places?.[0];

    if (!place) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No location data found for ZIP code ${zipCode}`,
      });
    }

    return {
      city: place['place name'],
      state: place.state,
      county: place['county'] || undefined,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Failed to fetch ZIP code data: ${error instanceof Error ? error.message : 'Unknown error'
        }`,
      cause: error,
    });
  }
}

export const communityRouter = router({
  search: publicProcedure.input(inputSchema).mutation(async ({ input }) => {
    const data = await fetchCommunityLeads(input);

    return {
      opportunities: data.opportunities,
    };
  }),
  zipLookup: publicProcedure.input(zipCodeSchema).query(async ({ input }) => {
    const locationData = await fetchCityFromZip(input.zipCode);
    return locationData;
  }),
});

