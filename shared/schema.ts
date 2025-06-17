import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  url: text("url"),
  rating: integer("rating").notNull().default(0),
  likes: integer("likes").notNull().default(0),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  sport: text("sport").notNull(),
  injuryType: text("injury_type").notNull(),
  email: text("email").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").notNull().default(false),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  approved: true,
  submittedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  submittedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
