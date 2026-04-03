import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { athletes, deals, payments } from './schema.js';

// Athlete queries
export async function getAthletes() {
  return db.query.athletes.findMany();
}

export async function getAthleteById(id: number) {
  return db.query.athletes.findFirst({
    where: eq(athletes.id, id),
    with: {
      deals: {
        with: {
          payments: true,
        },
      },
    },
  });
}

// Deal queries
export async function getDealsByAthleteId(athleteId: number) {
  return db.query.deals.findMany({
    where: eq(deals.athleteId, athleteId),
    with: {
      payments: true,
    },
  });
}

export async function getDealById(dealId: number) {
  return db.query.deals.findFirst({
    where: eq(deals.id, dealId),
    with: {
      payments: true,
      athlete: true,
    },
  });
}

// Payment queries
export async function getPaymentsByDealId(dealId: number) {
  return db.query.payments.findMany({
    where: eq(payments.dealId, dealId),
  });
}

// Earnings summary
export async function getAthleteEarnings(athleteId: number) {
  const athleteData = await getAthleteById(athleteId);
  if (!athleteData) return null;

  let totalEarnings = 0;
  let totalPending = 0;

  for (const deal of athleteData.deals) {
    for (const payment of deal.payments) {
      if (payment.status === 'completed') {
        totalEarnings += Number(payment.amount);
      } else if (payment.status === 'pending') {
        totalPending += Number(payment.amount);
      }
    }
  }

  return {
    athlete: athleteData,
    totalEarnings,
    totalPending,
    totalDeals: athleteData.deals.length,
  };
}
