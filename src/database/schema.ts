import { pgTable, uuid, varchar, timestamp, text, boolean, integer, decimal, serial } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: varchar('full_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default('student'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Instructors Table
export const instructors = pgTable('instructors', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    bio: text('bio'),
    avatarUrl: varchar('avatar_url', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Courses Table
export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    thumbnailUrl: varchar('thumbnail_url', { length: 255 }),
    instructorId: uuid('instructor_id').notNull().references(() => instructors.id, { onDelete: 'cascade' }),
    category: varchar('category', { length: 100 }),
    isFree: boolean('is_free').notNull().default(false),
    difficultyLevel: varchar('difficulty_level', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subscription Plans Table
export const subscriptionPlans = pgTable('subscription_plans', {
    id: uuid('id').primaryKey().defaultRandom(),
    planName: varchar('plan_name', { length: 100 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    durationMonths: integer('duration_months').notNull(),
    features: text('features'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enrollments Table
export const enrollments = pgTable('enrollments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    subscriptionPlanId: uuid('subscription_plan_id').references(() => subscriptionPlans.id, { onDelete: 'set null' }),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
    status: varchar('status', { length: 50 }).notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payment Gateway Table
export const paymentGateway = pgTable('payment_gateway', {
    id: uuid('id').primaryKey().defaultRandom(),
    gatewayName: varchar('gateway_name', { length: 100 }).notNull(),
    transactionId: varchar('transaction_id', { length: 255 }),
    snapToken: varchar('snap_token', { length: 255 }),
    gatewayResponse: text('gateway_response'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments Table
export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    subscriptionPlanId: uuid('subscription_plan_id').references(() => subscriptionPlans.id, { onDelete: 'set null' }),
    orderId: varchar('order_id', { length: 255 }).unique().notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }),
    paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'),
    gatewayId: uuid('gateway_id').references(() => paymentGateway.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Content Modules Table
export const contentModules = pgTable('content_modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    moduleName: varchar('module_name', { length: 255 }).notNull(),
    moduleDescription: text('module_description'),
    orderSequence: integer('order_sequence').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Course Content Table
export const courseContent = pgTable('course_content', {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    moduleId: uuid('module_id').notNull().references(() => contentModules.id, { onDelete: 'cascade' }),
    contentTitle: varchar('content_title', { length: 255 }).notNull(),
    contentDescription: text('content_description'),
    videoUrl: varchar('video_url', { length: 500 }),
    textContent: text('text_content'),
    orderSequence: integer('order_sequence').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Course Progress Table
export const courseProgress = pgTable('course_progress', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    contentId: uuid('content_id').references(() => courseContent.id, { onDelete: 'cascade' }),
    isCompleted: boolean('is_completed').notNull().default(false),
    progressPercentage: integer('progress_percentage').notNull().default(0),
    lastAccessed: timestamp('last_accessed').defaultNow(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Testimonials Table
export const testimonials = pgTable('testimonials', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    testimonialText: text('testimonial_text').notNull(),
    rating: integer('rating').notNull(),
    isFeatured: boolean('is_featured').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Instructor = typeof instructors.$inferSelect;
export type NewInstructor = typeof instructors.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

export type PaymentGateway = typeof paymentGateway.$inferSelect;
export type NewPaymentGateway = typeof paymentGateway.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type ContentModule = typeof contentModules.$inferSelect;
export type NewContentModule = typeof contentModules.$inferInsert;

export type CourseContent = typeof courseContent.$inferSelect;
export type NewCourseContent = typeof courseContent.$inferInsert;

export type CourseProgress = typeof courseProgress.$inferSelect;
export type NewCourseProgress = typeof courseProgress.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;