import { Hono } from 'hono';
import { z } from 'zod';
import {
  getAthletes,
  getAthleteById,
  getDealsByAthleteId,
  getPaymentsByDealId,
  getAthleteEarnings,
} from '@nil-club/database';

const app = new Hono().basePath('/api');

// Validation schemas
const athleteResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  sport: z.string(),
  school: z.string(),
  bio: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

const dealResponseSchema = z.object({
  id: z.number(),
  athleteId: z.number(),
  brandName: z.string(),
  description: z.string().nullable().optional(),
  dealValue: z.string(),
  status: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const paymentResponseSchema = z.object({
  id: z.number(),
  dealId: z.number(),
  amount: z.string(),
  status: z.string(),
  dueDate: z.string(),
  paidDate: z.string().nullable().optional(),
});

// Routes
app.get('/athletes', async (c) => {
  try {
    const allAthletes = await getAthletes();
    return c.json(allAthletes);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return c.json({ error: 'Failed to fetch athletes' }, 500);
  }
});

app.get('/athletes/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: 'Invalid athlete ID' }, 400);
    }

    const athlete = await getAthleteById(id);
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }

    return c.json(athlete);
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return c.json({ error: 'Failed to fetch athlete' }, 500);
  }
});

app.get('/athletes/:id/deals', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: 'Invalid athlete ID' }, 400);
    }

    const athleteDeals = await getDealsByAthleteId(id);
    return c.json(athleteDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return c.json({ error: 'Failed to fetch deals' }, 500);
  }
});

app.get('/athletes/:id/earnings', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: 'Invalid athlete ID' }, 400);
    }

    const earnings = await getAthleteEarnings(id);
    if (!earnings) {
      return c.json({ error: 'Athlete not found' }, 404);
    }

    return c.json(earnings);
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return c.json({ error: 'Failed to fetch earnings' }, 500);
  }
});

app.get('/deals/:id/payments', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: 'Invalid deal ID' }, 400);
    }

    const dealPayments = await getPaymentsByDealId(id);
    return c.json(dealPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

// Error handling
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
