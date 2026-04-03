import 'dotenv/config';
import { db } from './db.js';
import { athletes, deals, payments } from './schema.js';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Clear existing data
    await db.delete(payments);
    await db.delete(deals);
    await db.delete(athletes);
    console.log('✓ Cleared existing data');

    // Seed athletes
    const athletesData = [
      {
        name: 'Marcus Johnson',
        sport: 'basketball' as const,
        school: 'Duke University',
        bio: 'All-star basketball player',
        imageUrl: 'https://api.example.com/athletes/marcus.jpg',
      },
      {
        name: 'Sarah Williams',
        sport: 'soccer' as const,
        school: 'Stanford University',
        bio: 'Professional soccer prospect',
        imageUrl: 'https://api.example.com/athletes/sarah.jpg',
      },
      {
        name: 'James Chen',
        sport: 'football' as const,
        school: 'University of California',
        bio: 'Quarterback with NFL potential',
        imageUrl: 'https://api.example.com/athletes/james.jpg',
      },
      {
        name: 'Emma Davis',
        sport: 'volleyball' as const,
        school: 'University of Texas',
        bio: 'Olympic volleyball team member',
        imageUrl: 'https://api.example.com/athletes/emma.jpg',
      },
      {
        name: 'Alex Rodriguez',
        sport: 'tennis' as const,
        school: 'University of Southern California',
        bio: 'Rising tennis star',
        imageUrl: 'https://api.example.com/athletes/alex.jpg',
      },
    ];

    const insertedAthletes = await db
      .insert(athletes)
      .values(athletesData)
      .returning();
    console.log(`✓ Seeded ${insertedAthletes.length} athletes`);

    // Seed deals and payments
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const dealsData = [
      // Marcus Johnson deals
      {
        athleteId: insertedAthletes[0].id,
        brandName: 'Nike',
        description: 'Social media endorsement campaign',
        dealValue: '15000.00',
        status: 'active' as const,
        startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: threeMonthsLater,
      },
      {
        athleteId: insertedAthletes[0].id,
        brandName: 'Gatorade',
        description: 'Fitness beverage partnership',
        dealValue: '8000.00',
        status: 'active' as const,
        startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        endDate: nextMonth,
      },
      {
        athleteId: insertedAthletes[0].id,
        brandName: 'Beats by Dre',
        description: 'Audio equipment promotion',
        dealValue: '5000.00',
        status: 'completed' as const,
        startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        endDate: now,
      },

      // Sarah Williams deals
      {
        athleteId: insertedAthletes[1].id,
        brandName: 'Adidas',
        description: 'Soccer equipment and apparel',
        dealValue: '12000.00',
        status: 'active' as const,
        startDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        endDate: threeMonthsLater,
      },
      {
        athleteId: insertedAthletes[1].id,
        brandName: 'Lululemon',
        description: 'Activewear collaboration',
        dealValue: '6000.00',
        status: 'pending' as const,
        startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000),
      },

      // James Chen deals
      {
        athleteId: insertedAthletes[2].id,
        brandName: 'Under Armour',
        description: 'Football equipment deal',
        dealValue: '20000.00',
        status: 'active' as const,
        startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        endDate: threeMonthsLater,
      },
      {
        athleteId: insertedAthletes[2].id,
        brandName: 'SeatGeek',
        description: 'Ticket platform promotion',
        dealValue: '4000.00',
        status: 'active' as const,
        startDate: now,
        endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      },

      // Emma Davis deals
      {
        athleteId: insertedAthletes[3].id,
        brandName: 'Spieth America',
        description: 'Volleyball equipment',
        dealValue: '7000.00',
        status: 'active' as const,
        startDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        endDate: threeMonthsLater,
      },

      // Alex Rodriguez deals
      {
        athleteId: insertedAthletes[4].id,
        brandName: 'Wilson Sporting Goods',
        description: 'Tennis equipment partnership',
        dealValue: '9000.00',
        status: 'active' as const,
        startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        endDate: nextMonth,
      },
    ];

    const insertedDeals = await db.insert(deals).values(dealsData).returning();
    console.log(`✓ Seeded ${insertedDeals.length} deals`);

    // Seed payments
    const paymentsData: typeof payments.$inferInsert[] = [];

    // Payments for Marcus - Nike deal
    paymentsData.push(
      {
        dealId: insertedDeals[0].id,
        amount: '5000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[0].id,
        amount: '5000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[0].id,
        amount: '5000.00',
        status: 'pending' as const,
        dueDate: now,
        paidDate: undefined,
      }
    );

    // Payments for Marcus - Gatorade deal
    paymentsData.push(
      {
        dealId: insertedDeals[1].id,
        amount: '4000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[1].id,
        amount: '4000.00',
        status: 'pending' as const,
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        paidDate: undefined,
      }
    );

    // Payments for Marcus - Beats deal (completed)
    paymentsData.push({
      dealId: insertedDeals[2].id,
      amount: '5000.00',
      status: 'completed' as const,
      dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      paidDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    });

    // Payments for Sarah - Adidas deal
    paymentsData.push(
      {
        dealId: insertedDeals[3].id,
        amount: '4000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[3].id,
        amount: '4000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[3].id,
        amount: '4000.00',
        status: 'pending' as const,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        paidDate: undefined,
      }
    );

    // Payments for Sarah - Lululemon deal (pending)
    paymentsData.push({
      dealId: insertedDeals[4].id,
      amount: '6000.00',
      status: 'pending' as const,
      dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      paidDate: undefined,
    });

    // Payments for James - Under Armour deal
    paymentsData.push(
      {
        dealId: insertedDeals[5].id,
        amount: '10000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[5].id,
        amount: '10000.00',
        status: 'pending' as const,
        dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        paidDate: undefined,
      }
    );

    // Payments for James - SeatGeek deal
    paymentsData.push({
      dealId: insertedDeals[6].id,
      amount: '4000.00',
      status: 'pending' as const,
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      paidDate: undefined,
    });

    // Payments for Emma - Spieth America deal
    paymentsData.push(
      {
        dealId: insertedDeals[7].id,
        amount: '3500.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[7].id,
        amount: '3500.00',
        status: 'pending' as const,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        paidDate: undefined,
      }
    );

    // Payments for Alex - Wilson Sporting Goods deal
    paymentsData.push(
      {
        dealId: insertedDeals[8].id,
        amount: '3000.00',
        status: 'completed' as const,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        dealId: insertedDeals[8].id,
        amount: '3000.00',
        status: 'completed' as const,
        dueDate: now,
        paidDate: now,
      },
      {
        dealId: insertedDeals[8].id,
        amount: '3000.00',
        status: 'pending' as const,
        dueDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        paidDate: undefined,
      }
    );

    const insertedPayments = await db
      .insert(payments)
      .values(paymentsData)
      .returning();
    console.log(`✓ Seeded ${insertedPayments.length} payments`);

    console.log('✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
