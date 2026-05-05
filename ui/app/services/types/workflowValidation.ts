import { z } from 'zod';
import { defaultRateCard } from '../../constants/Default_RateCard';

const timePointSchema = z.object({
  type: z.string({ error: 'Type is required' }),
  value: z.string({ error: 'Value is required' }),
  absoluteDate: z.string({ error: 'Absolute date is required' }),
});

const rateCardCapabilitiesSchema = z.object({
  key: z.string(),
  name: z.string(),
  quotedPrice: z.string(), // could refine to regex/number string if needed
  quotedUnitOfMeasure: z.string(),
  price: z.string(), // same here, refine if numeric
});

// schema for full rate card
const rateCardResponseSchema = z.object({
  quoteNumber: z.string(),
  startTime: z.string(), // refine to ISO date if required
  endTime: z.string(),
  currencyCode: z.string().length(3), // enforce ISO currency code
  capabilities: z.array(rateCardCapabilitiesSchema),
});

export const HighConsumptionUsers = z.object({
  eventType: z.string(),
  timeframe: z.object({
    from: timePointSchema,
    to: timePointSchema,
  }),
  rateCard: z.array(rateCardResponseSchema).default(defaultRateCard),
  requestToken: z.string().optional(),
});

export type GetHighConsumptionUsers = z.infer<typeof HighConsumptionUsers>;

/** ----Group Action Schema---- */
const setBySchema = z.object({
  group_name: z.string(),
  uuid: z.string(),
  threshold: z.number(),
});

const consumptionUserSchema = z.object({
  set_by: setBySchema,
  cost: z.number(),
  user_email: z.string(),
  user_uuid: z.string(),
});

export const ConsumptionUserGroupSchema = z.object({
  eventType: z.string(),
  users: z.array(consumptionUserSchema),
});
