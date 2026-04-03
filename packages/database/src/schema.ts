import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  numeric,
  integer,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const athleteSportEnum = pgEnum('athlete_sport', [
  'basketball',
  'football',
  'soccer',
  'volleyball',
  'track',
  'tennis',
  'swimming',
  'other',
]);

export const dealStatusEnum = pgEnum('deal_status', [
  'active',
  'pending',
  'completed',
  'cancelled',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'cancelled',
]);

// Tables
export const athletes = pgTable('athletes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sport: athleteSportEnum('sport').notNull(),
  school: varchar('school', { length: 255 }).notNull(),
  bio: text('bio'),
  imageUrl: varchar('image_url', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const deals = pgTable(
  'deals',
  {
    id: serial('id').primaryKey(),
    athleteId: integer('athlete_id').notNull(),
    brandName: varchar('brand_name', { length: 255 }).notNull(),
    description: text('description'),
    dealValue: numeric('deal_value', { precision: 12, scale: 2 }).notNull(), // Use numeric for precise money handling
    status: dealStatusEnum('status').default('active').notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    athleteIdFk: foreignKey({
      columns: [table.athleteId],
      foreignColumns: [athletes.id],
    }),
  })
);

export const payments = pgTable(
  'payments',
  {
    id: serial('id').primaryKey(),
    dealId: integer('deal_id').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    status: paymentStatusEnum('status').default('pending').notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
    paidDate: timestamp('paid_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    dealIdFk: foreignKey({
      columns: [table.dealId],
      foreignColumns: [deals.id],
    }),
  })
);

// Relations
export const athletesRelations = relations(athletes, ({ many }) => ({
  deals: many(deals),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  athlete: one(athletes, {
    fields: [deals.athleteId],
    references: [athletes.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  deal: one(deals, {
    fields: [payments.dealId],
    references: [deals.id],
  }),
}));
