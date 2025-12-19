var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
function generateId() {
  return crypto.randomUUID();
}
var users, series, languages, seriesTranslations, chapters, settings, userLibrary, userFollows, comments, readingProgress, emailVerificationTokens, passwordResetTokens, userRatings, userFollowsUsers, readingLists, readingListItems, currencyTransactions, currencyPackages, userPurchases, chapterAccessControl, userChapterUnlocks, subscriptionPackages, userSubscriptions, dailyRewards, userDailyClaims, achievements, userAchievements, referralCodes, referrals, flashSales, giftTransactions, loyaltyTiers, userLoyalty, battlePassSeasons, battlePassRewards, userBattlePassProgress, dmcaNotices, coupons, couponRedemptions, packageBundles, invoices, invoiceItems, manualAssignments, advertisements, adCampaigns, advertisementsWithCampaign, adPerformanceHistory, adAssets, adCompliance, adUserImpressions, adAlerts, adTemplates, insertUserSchema, loginUserSchema, signupUserSchema, safeUserSchema, updateUserRoleSchema, insertSeriesSchema, updateSeriesSchema, insertLanguageSchema, updateLanguageSchema, insertSeriesTranslationSchema, updateSeriesTranslationSchema, insertChapterSchema, updateChapterSchema, insertSettingSchema, updateSettingSchema, settingValueSchema, insertUserLibrarySchema, updateUserLibrarySchema, insertCommentSchema, updateCommentSchema, insertReadingProgressSchema, updateReadingProgressSchema, insertUserRatingSchema, updateUserRatingSchema, insertCurrencyTransactionSchema, selectCurrencyTransactionSchema, insertCurrencyPackageSchema, selectCurrencyPackageSchema, updateCurrencyPackageSchema, insertUserPurchaseSchema, selectUserPurchaseSchema, updateUserPurchaseSchema, insertChapterAccessControlSchema, selectChapterAccessControlSchema, updateChapterAccessControlSchema, insertUserChapterUnlockSchema, selectUserChapterUnlockSchema, adminAddCurrencySchema, adminDeductCurrencySchema, insertReadingListSchema, selectReadingListSchema, updateReadingListSchema, insertReadingListItemSchema, selectReadingListItemSchema, insertAdvertisementSchema, selectAdvertisementSchema, updateAdvertisementSchema, adCampaignBaseSchema, insertAdCampaignSchema, updateAdCampaignSchema, insertAdPerformanceHistorySchema, insertAdAssetSchema, insertAdComplianceSchema, updateAdComplianceSchema, insertAdTemplateSchema, updateAdTemplateSchema, insertAdvertisementWithApprovalSchema, updateAdvertisementWithApprovalSchema, approveAdSchema, rejectAdSchema, insertCouponSchema, updateCouponSchema, insertPackageBundleSchema, updatePackageBundleSchema, insertInvoiceSchema, updateInvoiceSchema, insertInvoiceItemSchema, insertManualAssignmentSchema, updateManualAssignmentSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = sqliteTable("users", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      // Existing fields (preserved for backward compatibility)
      username: text("username").unique(),
      // Made optional to support social auth
      email: text("email").unique(),
      password: text("password"),
      // Made optional to support social auth only users
      profilePicture: text("profile_picture"),
      // Legacy field name
      country: text("country"),
      // Admin authorization field - proper security model
      isAdmin: text("is_admin").notNull().default("false"),
      // "true" or "false" for security
      // User role system (new comprehensive roles)
      role: text("role").notNull().default("user"),
      // user, premium, staff, admin, owner
      // Replit Auth required fields
      firstName: text("first_name"),
      lastName: text("last_name"),
      profileImageUrl: text("profile_image_url"),
      // Replit Auth field
      // Email verification fields
      emailVerified: text("email_verified").notNull().default("false"),
      // "true" or "false"
      emailVerifiedAt: text("email_verified_at"),
      // Timestamp when email was verified
      // Virtual currency fields
      currencyBalance: integer("currency_balance").default(0),
      // User's coin/points balance
      // Stripe integration fields
      stripeCustomerId: text("stripe_customer_id"),
      // Stripe customer ID for subscriptions
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    });
    series = sqliteTable("series", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      title: text("title").notNull(),
      description: text("description"),
      author: text("author"),
      artist: text("artist"),
      status: text("status").notNull().default("ongoing"),
      // ongoing, completed, hiatus, cancelled
      type: text("type").notNull().default("manga"),
      // manga, manhwa, manhua, webtoon
      genres: text("genres"),
      // JSON array stored as text in SQLite
      coverImageUrl: text("cover_image_url"),
      rating: text("rating"),
      // Stored as text to preserve decimal precision
      totalChapters: integer("total_chapters"),
      publishedYear: integer("published_year"),
      isAdult: text("is_adult").notNull().default("false"),
      // "true" or "false"
      // Section assignment flags for homepage control
      isFeatured: text("is_featured").notNull().default("false"),
      // For hero banner section
      isTrending: text("is_trending").notNull().default("false"),
      // For trending section
      isPopularToday: text("is_popular_today").notNull().default("false"),
      // For popular today section
      isLatestUpdate: text("is_latest_update").notNull().default("false"),
      // For latest updates section
      isPinned: text("is_pinned").notNull().default("false"),
      // For pinned section
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    });
    languages = sqliteTable("languages", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      code: text("code").notNull().unique(),
      // ISO 639-1 language code (en, es, ja, fr, etc.)
      name: text("name").notNull(),
      // Language name (English, Spanish, Japanese, French, etc.)
      nativeName: text("native_name").notNull(),
      // Native name (English, Español, 日本語, Français, etc.)
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      isDefault: text("is_default").notNull().default("false"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      codeIdx: uniqueIndex("language_code_idx").on(table.code)
    }));
    seriesTranslations = sqliteTable("series_translations", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      languageId: text("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
      title: text("title"),
      // Translated title
      description: text("description"),
      // Translated description
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      seriesLanguageIdx: index("series_language_idx").on(table.seriesId, table.languageId),
      uniqueSeriesLanguage: uniqueIndex("unique_series_language").on(table.seriesId, table.languageId)
    }));
    chapters = sqliteTable("chapters", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      chapterNumber: text("chapter_number").notNull(),
      // Stored as text to support decimals like "1.5"
      title: text("title"),
      // Optional chapter title
      pages: text("pages").notNull(),
      // JSON array of image paths/URLs
      totalPages: integer("total_pages").notNull().default(0),
      coverImageUrl: text("cover_image_url"),
      // URL/path to the chapter cover image (first image)
      isPublished: text("is_published").notNull().default("true"),
      // "true" or "false"
      uploadedBy: text("uploaded_by").references(() => users.id),
      requiresManualReorder: text("requires_manual_reorder").notNull().default("false"),
      // "true" if natural sorting confidence is low
      naturalSortConfidence: text("natural_sort_confidence").default("1.0"),
      // Confidence score 0.0-1.0 stored as text
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      // Create compound index for efficient queries
      seriesChapterIdx: index("series_chapter_idx").on(table.seriesId, table.chapterNumber),
      // UNIQUE constraint to prevent race conditions during chapter uploads
      uniqueSeriesChapter: uniqueIndex("unique_series_chapter").on(table.seriesId, table.chapterNumber)
    }));
    settings = sqliteTable("settings", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      category: text("category").notNull(),
      // site, users, content, system
      key: text("key").notNull(),
      value: text("value").notNull(),
      type: text("type").notNull().default("string"),
      // string, number, boolean, json
      description: text("description"),
      isPublic: text("is_public").notNull().default("false"),
      // Whether setting can be read by non-admins
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    });
    userLibrary = sqliteTable("user_library", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      status: text("status").notNull().default("reading"),
      // reading, completed, plan_to_read, on_hold, dropped
      addedAt: text("added_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userSeriesIdx: index("user_series_idx").on(table.userId, table.seriesId),
      uniqueUserSeries: uniqueIndex("unique_user_series").on(table.userId, table.seriesId)
    }));
    userFollows = sqliteTable("user_follows", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      followedAt: text("followed_at").default(sql`(datetime('now'))`),
      notificationsEnabled: text("notifications_enabled").notNull().default("true")
      // "true" or "false"
    }, (table) => ({
      userSeriesFollowIdx: index("user_series_follow_idx").on(table.userId, table.seriesId),
      uniqueUserSeriesFollow: uniqueIndex("unique_user_series_follow").on(table.userId, table.seriesId)
    }));
    comments = sqliteTable("comments", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      seriesId: text("series_id").references(() => series.id, { onDelete: "cascade" }),
      chapterId: text("chapter_id").references(() => chapters.id, { onDelete: "cascade" }),
      content: text("content").notNull(),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("comments_user_idx").on(table.userId),
      seriesIdx: index("comments_series_idx").on(table.seriesId),
      chapterIdx: index("comments_chapter_idx").on(table.chapterId)
    }));
    readingProgress = sqliteTable("reading_progress", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      chapterId: text("chapter_id").references(() => chapters.id, { onDelete: "set null" }),
      lastReadPage: integer("last_read_page").notNull().default(0),
      lastReadAt: text("last_read_at").default(sql`(datetime('now'))`),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userSeriesProgressIdx: index("user_series_progress_idx").on(table.userId, table.seriesId),
      uniqueUserSeriesProgress: uniqueIndex("unique_user_series_progress").on(table.userId, table.seriesId)
    }));
    emailVerificationTokens = sqliteTable("email_verification_tokens", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      token: text("token").notNull().unique(),
      expiresAt: text("expires_at").notNull(),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("email_verification_user_idx").on(table.userId),
      tokenIdx: uniqueIndex("email_verification_token_idx").on(table.token)
    }));
    passwordResetTokens = sqliteTable("password_reset_tokens", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      token: text("token").notNull().unique(),
      expiresAt: text("expires_at").notNull(),
      used: text("used").notNull().default("false"),
      // "true" or "false" - prevent token reuse
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("password_reset_user_idx").on(table.userId),
      tokenIdx: uniqueIndex("password_reset_token_idx").on(table.token)
    }));
    userRatings = sqliteTable("user_ratings", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      rating: integer("rating").notNull(),
      // 1-10 rating
      review: text("review"),
      // Optional text review
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userSeriesIdx: index("user_ratings_user_series_idx").on(table.userId, table.seriesId),
      uniqueUserSeriesRating: uniqueIndex("unique_user_series_rating").on(table.userId, table.seriesId),
      seriesIdx: index("user_ratings_series_idx").on(table.seriesId)
    }));
    userFollowsUsers = sqliteTable("user_follows_users", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      followerId: text("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      followingId: text("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      followedAt: text("followed_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      followerIdx: index("user_follows_follower_idx").on(table.followerId),
      followingIdx: index("user_follows_following_idx").on(table.followingId),
      uniqueUserFollow: uniqueIndex("unique_user_follow").on(table.followerId, table.followingId)
    }));
    readingLists = sqliteTable("reading_lists", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      visibility: text("visibility").notNull().default("private"),
      // private, public
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("reading_lists_user_idx").on(table.userId)
    }));
    readingListItems = sqliteTable("reading_list_items", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      listId: text("list_id").notNull().references(() => readingLists.id, { onDelete: "cascade" }),
      seriesId: text("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
      addedAt: text("added_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      listSeriesIdx: index("reading_list_items_list_series_idx").on(table.listId, table.seriesId),
      uniqueListSeries: uniqueIndex("unique_list_series").on(table.listId, table.seriesId)
    }));
    currencyTransactions = sqliteTable("currency_transactions", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      amount: integer("amount").notNull(),
      // Positive for credit, negative for debit
      type: text("type").notNull(),
      // purchase, admin_grant, unlock_chapter, refund, bonus
      description: text("description").notNull(),
      relatedEntityId: text("related_entity_id"),
      // Chapter/series ID if applicable
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userCreatedIdx: index("currency_transactions_user_created_idx").on(table.userId, table.createdAt),
      userIdx: index("currency_transactions_user_idx").on(table.userId)
    }));
    currencyPackages = sqliteTable("currency_packages", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      // Package name like "Starter Pack", "Premium Bundle"
      currencyAmount: integer("currency_amount").notNull(),
      // Coins/points in package
      priceUSD: text("price_usd").notNull(),
      // Price in USD, stored as text for precision like "4.99"
      bonusPercentage: integer("bonus_percentage").notNull().default(0),
      // Bonus coins percentage, 0-100
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false" - can be enabled/disabled by admin
      displayOrder: integer("display_order").notNull().default(0),
      // Sort order in shop
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      activeDisplayIdx: index("currency_packages_active_display_idx").on(table.isActive, table.displayOrder)
    }));
    userPurchases = sqliteTable("user_purchases", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      packageId: text("package_id").references(() => currencyPackages.id, { onDelete: "set null" }),
      amountPaid: text("amount_paid").notNull(),
      // Actual amount paid in USD
      currencyReceived: integer("currency_received").notNull(),
      // Coins/points received
      paymentProvider: text("payment_provider").notNull(),
      // stripe, paypal, admin_grant, etc.
      transactionId: text("transaction_id"),
      // Payment provider transaction ID
      status: text("status").notNull().default("pending"),
      // completed, pending, failed, refunded
      couponId: text("coupon_id"),
      // Reference to applied coupon (nullable)
      trialEndsAt: text("trial_ends_at"),
      // Trial expiration date if applicable
      isOffline: text("is_offline").notNull().default("false"),
      // "true" for offline/manual purchases
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userStatusIdx: index("user_purchases_user_status_idx").on(table.userId, table.status),
      userIdx: index("user_purchases_user_idx").on(table.userId)
    }));
    chapterAccessControl = sqliteTable("chapter_access_control", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      chapterId: text("chapter_id").notNull().references(() => chapters.id, { onDelete: "cascade" }),
      accessType: text("access_type").notNull(),
      // free, premium, locked, hot
      unlockCost: integer("unlock_cost").notNull().default(0),
      // Coins needed to unlock, 0 for free
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      uniqueChapter: uniqueIndex("unique_chapter_access").on(table.chapterId)
    }));
    userChapterUnlocks = sqliteTable("user_chapter_unlocks", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      chapterId: text("chapter_id").notNull().references(() => chapters.id, { onDelete: "cascade" }),
      unlockedAt: text("unlocked_at").default(sql`(datetime('now'))`),
      costPaid: integer("cost_paid").notNull(),
      // Coins spent to unlock
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      uniqueUserChapter: uniqueIndex("unique_user_chapter_unlock").on(table.userId, table.chapterId),
      userIdx: index("user_chapter_unlocks_user_idx").on(table.userId)
    }));
    subscriptionPackages = sqliteTable("subscription_packages", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      // "Basic VIP", "Premium VIP", "Elite VIP"
      description: text("description"),
      priceUSD: text("price_usd").notNull(),
      // Monthly price
      billingCycle: text("billing_cycle").notNull().default("monthly"),
      // monthly, yearly
      stripePriceId: text("stripe_price_id"),
      // Stripe recurring price ID
      features: text("features"),
      // JSON array of feature descriptions
      coinBonus: integer("coin_bonus").default(0),
      // Monthly coin bonus for subscribers
      discountPercentage: integer("discount_percentage").default(0),
      // Discount on coin purchases
      isAdFree: text("is_ad_free").notNull().default("false"),
      // "true" or "false"
      earlyAccess: text("early_access").notNull().default("false"),
      // "true" or "false" - early chapter access
      exclusiveContent: text("exclusive_content").notNull().default("false"),
      // "true" or "false"
      trialDays: integer("trial_days").notNull().default(0),
      // Free trial period in days
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      displayOrder: integer("display_order").notNull().default(0),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      activeDisplayIdx: index("subscription_packages_active_display_idx").on(table.isActive, table.displayOrder)
    }));
    userSubscriptions = sqliteTable("user_subscriptions", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      packageId: text("package_id").references(() => subscriptionPackages.id, { onDelete: "set null" }),
      stripeCustomerId: text("stripe_customer_id"),
      // Stripe customer ID
      stripeSubscriptionId: text("stripe_subscription_id"),
      // Stripe subscription ID
      status: text("status").notNull().default("active"),
      // active, cancelled, expired, past_due
      currentPeriodStart: text("current_period_start"),
      currentPeriodEnd: text("current_period_end"),
      cancelAtPeriodEnd: text("cancel_at_period_end").notNull().default("false"),
      // "true" or "false"
      trialStartDate: text("trial_start_date"),
      // When trial period started
      trialEndDate: text("trial_end_date"),
      // When trial period ends
      isTrialActive: text("is_trial_active").notNull().default("false"),
      // "true" if currently in trial
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userStatusIdx: index("user_subscriptions_user_status_idx").on(table.userId, table.status),
      stripeSubscriptionIdx: uniqueIndex("stripe_subscription_idx").on(table.stripeSubscriptionId)
    }));
    dailyRewards = sqliteTable("daily_rewards", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      day: integer("day").notNull().unique(),
      // Day 1, 2, 3, etc.
      coinReward: integer("coin_reward").notNull(),
      bonusMultiplier: text("bonus_multiplier").default("1"),
      // e.g., "1.5" for 50% bonus on day 7
      isSpecial: text("is_special").notNull().default("false"),
      // "true" for milestone days
      specialDescription: text("special_description"),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    });
    userDailyClaims = sqliteTable("user_daily_claims", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      claimDate: text("claim_date").notNull(),
      // YYYY-MM-DD format
      day: integer("day").notNull(),
      // Current streak day
      coinsEarned: integer("coins_earned").notNull(),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userDateIdx: uniqueIndex("user_daily_claims_user_date_idx").on(table.userId, table.claimDate),
      userIdx: index("user_daily_claims_user_idx").on(table.userId)
    }));
    achievements = sqliteTable("achievements", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      description: text("description").notNull(),
      category: text("category").notNull(),
      // reading, social, purchasing, milestone
      requirement: text("requirement").notNull(),
      // JSON describing requirement
      coinReward: integer("coin_reward").default(0),
      badgeIcon: text("badge_icon"),
      // Icon URL or emoji
      isHidden: text("is_hidden").notNull().default("false"),
      // "true" for secret achievements
      displayOrder: integer("display_order").notNull().default(0),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    });
    userAchievements = sqliteTable("user_achievements", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
      earnedAt: text("earned_at").default(sql`(datetime('now'))`),
      progress: text("progress")
      // JSON for tracking partial progress
    }, (table) => ({
      uniqueUserAchievement: uniqueIndex("unique_user_achievement").on(table.userId, table.achievementId),
      userIdx: index("user_achievements_user_idx").on(table.userId)
    }));
    referralCodes = sqliteTable("referral_codes", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      code: text("code").notNull().unique(),
      uses: integer("uses").notNull().default(0),
      maxUses: integer("max_uses"),
      // null for unlimited
      coinRewardReferrer: integer("coin_reward_referrer").default(100),
      // Coins for referrer
      coinRewardReferred: integer("coin_reward_referred").default(50),
      // Coins for new user
      expiresAt: text("expires_at"),
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("referral_codes_user_idx").on(table.userId),
      codeIdx: uniqueIndex("referral_codes_code_idx").on(table.code)
    }));
    referrals = sqliteTable("referrals", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      referrerId: text("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      referredId: text("referred_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      codeId: text("code_id").references(() => referralCodes.id, { onDelete: "set null" }),
      referrerRewardAmount: integer("referrer_reward_amount").default(0),
      referredRewardAmount: integer("referred_reward_amount").default(0),
      status: text("status").notNull().default("completed"),
      // pending, completed
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      referrerIdx: index("referrals_referrer_idx").on(table.referrerId),
      referredIdx: index("referrals_referred_idx").on(table.referredId)
    }));
    flashSales = sqliteTable("flash_sales", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      description: text("description"),
      type: text("type").notNull(),
      // coin_package, subscription, bundle
      targetId: text("target_id"),
      // ID of the package/subscription being discounted
      discountPercentage: integer("discount_percentage").notNull(),
      originalPrice: text("original_price").notNull(),
      salePrice: text("sale_price").notNull(),
      startTime: text("start_time").notNull(),
      endTime: text("end_time").notNull(),
      maxPurchases: integer("max_purchases"),
      // null for unlimited
      currentPurchases: integer("current_purchases").default(0),
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      activeTimeIdx: index("flash_sales_active_time_idx").on(table.isActive, table.startTime, table.endTime)
    }));
    giftTransactions = sqliteTable("gift_transactions", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      recipientId: text("recipient_id").references(() => users.id, { onDelete: "set null" }),
      recipientEmail: text("recipient_email"),
      // For gifts to non-users
      giftType: text("gift_type").notNull(),
      // coins, subscription, package
      giftAmount: integer("gift_amount"),
      // For coins
      packageId: text("package_id"),
      // For subscription/package gifts
      message: text("message"),
      status: text("status").notNull().default("pending"),
      // pending, claimed, expired
      claimedAt: text("claimed_at"),
      expiresAt: text("expires_at"),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      senderIdx: index("gift_transactions_sender_idx").on(table.senderId),
      recipientIdx: index("gift_transactions_recipient_idx").on(table.recipientId),
      statusIdx: index("gift_transactions_status_idx").on(table.status)
    }));
    loyaltyTiers = sqliteTable("loyalty_tiers", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      minPoints: integer("min_points").notNull(),
      maxPoints: integer("max_points"),
      coinBonusPercentage: integer("coin_bonus_percentage").default(0),
      // Bonus on purchases
      discountPercentage: integer("discount_percentage").default(0),
      perks: text("perks"),
      // JSON array of tier benefits
      badgeColor: text("badge_color").default("#gray"),
      displayOrder: integer("display_order").notNull().default(0),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    });
    userLoyalty = sqliteTable("user_loyalty", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      points: integer("points").notNull().default(0),
      tierId: text("tier_id").references(() => loyaltyTiers.id, { onDelete: "set null" }),
      lifetimePoints: integer("lifetime_points").notNull().default(0),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: uniqueIndex("user_loyalty_user_idx").on(table.userId)
    }));
    battlePassSeasons = sqliteTable("battle_pass_seasons", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      description: text("description"),
      startDate: text("start_date").notNull(),
      endDate: text("end_date").notNull(),
      isPremium: text("is_premium").notNull().default("false"),
      // "true" or "false"
      priceUSD: text("price_usd"),
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    });
    battlePassRewards = sqliteTable("battle_pass_rewards", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      seasonId: text("season_id").notNull().references(() => battlePassSeasons.id, { onDelete: "cascade" }),
      tier: integer("tier").notNull(),
      isPremium: text("is_premium").notNull().default("false"),
      // "true" or "false"
      rewardType: text("reward_type").notNull(),
      // coins, avatar, badge, unlock
      rewardValue: text("reward_value").notNull(),
      // JSON or amount
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      seasonTierIdx: index("battle_pass_rewards_season_tier_idx").on(table.seasonId, table.tier)
    }));
    userBattlePassProgress = sqliteTable("user_battle_pass_progress", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      seasonId: text("season_id").notNull().references(() => battlePassSeasons.id, { onDelete: "cascade" }),
      currentTier: integer("current_tier").notNull().default(0),
      experience: integer("experience").notNull().default(0),
      isPremium: text("is_premium").notNull().default("false"),
      // "true" if user bought premium pass
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      uniqueUserSeason: uniqueIndex("unique_user_season").on(table.userId, table.seasonId)
    }));
    dmcaNotices = sqliteTable("dmca_notices", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      fullName: text("full_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      copyrightWork: text("copyright_work").notNull(),
      infringingUrl: text("infringing_url").notNull(),
      description: text("description"),
      signature: text("signature").notNull(),
      ipAddress: text("ip_address"),
      // Track IP for fraud prevention
      goodFaithDeclaration: text("good_faith_declaration").notNull(),
      // Required: "true" under 17 U.S.C. §512(c)(3)(A)(v)
      accuracyDeclaration: text("accuracy_declaration").notNull(),
      // Required: "true" under penalty of perjury 17 U.S.C. §512(c)(3)(A)(vi)
      status: text("status").notNull().default("pending"),
      // pending, under_review, completed, rejected
      reviewedBy: text("reviewed_by").references(() => users.id, { onDelete: "set null" }),
      reviewNotes: text("review_notes"),
      reviewedAt: text("reviewed_at"),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      statusIdx: index("dmca_status_idx").on(table.status),
      emailIdx: index("dmca_email_idx").on(table.email),
      createdIdx: index("dmca_created_idx").on(table.createdAt)
    }));
    coupons = sqliteTable("coupons", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      code: text("code").notNull().unique(),
      // Unique coupon code
      type: text("type").notNull(),
      // percentage, fixed
      value: text("value").notNull(),
      // Discount value (percentage or fixed amount)
      minPurchaseAmount: text("min_purchase_amount"),
      // Minimum purchase required (USD)
      maxUses: integer("max_uses"),
      // Maximum uses (null = unlimited)
      currentUses: integer("current_uses").notNull().default(0),
      // Current usage count
      expiresAt: text("expires_at"),
      // Expiration date (null = no expiration)
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      codeIdx: uniqueIndex("coupons_code_idx").on(table.code),
      activeIdx: index("coupons_active_idx").on(table.isActive)
    }));
    couponRedemptions = sqliteTable("coupon_redemptions", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      couponId: text("coupon_id").notNull().references(() => coupons.id, { onDelete: "cascade" }),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      purchaseId: text("purchase_id").references(() => userPurchases.id, { onDelete: "set null" }),
      discountAmount: text("discount_amount").notNull(),
      // Actual discount applied (USD)
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      couponUserIdx: index("coupon_redemptions_coupon_user_idx").on(table.couponId, table.userId),
      purchaseIdx: index("coupon_redemptions_purchase_idx").on(table.purchaseId)
    }));
    packageBundles = sqliteTable("package_bundles", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      // Bundle name
      description: text("description"),
      bundleType: text("bundle_type").notNull(),
      // currency, subscription, chapter, mixed
      priceUSD: text("price_usd").notNull(),
      // Bundle price
      items: text("items").notNull(),
      // JSON array of bundle items with quantities
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      displayOrder: integer("display_order").notNull().default(0),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      activeDisplayIdx: index("package_bundles_active_display_idx").on(table.isActive, table.displayOrder)
    }));
    invoices = sqliteTable("invoices", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      purchaseId: text("purchase_id").references(() => userPurchases.id, { onDelete: "set null" }),
      invoiceNumber: text("invoice_number").notNull().unique(),
      // INV-20250101-0001 format
      totalAmount: text("total_amount").notNull(),
      // Total before tax/discount (USD)
      taxAmount: text("tax_amount").notNull().default("0.00"),
      // Tax amount (USD)
      discountAmount: text("discount_amount").notNull().default("0.00"),
      // Discount from coupon (USD)
      finalAmount: text("final_amount").notNull(),
      // Final amount charged (USD)
      status: text("status").notNull().default("draft"),
      // draft, issued, paid, voided
      pdfPath: text("pdf_path"),
      // Path to generated PDF invoice
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("invoices_user_idx").on(table.userId),
      invoiceNumberIdx: uniqueIndex("invoices_number_idx").on(table.invoiceNumber),
      purchaseIdx: index("invoices_purchase_idx").on(table.purchaseId)
    }));
    invoiceItems = sqliteTable("invoice_items", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      invoiceId: text("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
      itemType: text("item_type").notNull(),
      // currency_package, subscription, bundle, chapter_unlock
      itemId: text("item_id"),
      // Reference to the actual item (package/subscription/etc)
      description: text("description").notNull(),
      quantity: integer("quantity").notNull().default(1),
      unitPrice: text("unit_price").notNull(),
      // Price per unit (USD)
      totalPrice: text("total_price").notNull()
      // Total for this line item (USD)
    }, (table) => ({
      invoiceIdx: index("invoice_items_invoice_idx").on(table.invoiceId)
    }));
    manualAssignments = sqliteTable("manual_assignments", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      packageId: text("package_id").notNull(),
      // ID of package/subscription
      packageType: text("package_type").notNull(),
      // currency, subscription, bundle
      assignedBy: text("assigned_by").notNull().references(() => users.id, { onDelete: "set null" }),
      reason: text("reason").notNull(),
      // Admin reason for assignment
      expiresAt: text("expires_at"),
      // Expiration date (null = no expiration)
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false"
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      userIdx: index("manual_assignments_user_idx").on(table.userId),
      assignedByIdx: index("manual_assignments_assigned_by_idx").on(table.assignedBy),
      activeIdx: index("manual_assignments_active_idx").on(table.isActive)
    }));
    advertisements = sqliteTable("advertisements", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      title: text("title").notNull(),
      // Ad title/name
      description: text("description"),
      // Optional ad description
      imageUrl: text("image_url").notNull(),
      // URL/path to ad image
      linkUrl: text("link_url").notNull(),
      // Where ad navigates on click
      type: text("type").notNull(),
      // banner, sidebar, popup, inline
      placement: text("placement").notNull(),
      // homepage, manga-page, chapter-reader, browse, all
      isActive: text("is_active").notNull().default("true"),
      // "true" or "false" - enable/disable
      startDate: text("start_date"),
      // Scheduling start (nullable) - ISO datetime string
      endDate: text("end_date"),
      // Scheduling end (nullable) - ISO datetime string
      displayOrder: integer("display_order").notNull().default(0),
      // Priority ordering
      clickCount: integer("click_count").notNull().default(0),
      // Analytics: click tracking
      impressionCount: integer("impression_count").notNull().default(0),
      // Analytics: impression tracking
      variantGroup: text("variant_group"),
      // A/B testing: groups related ad variants together (nullable)
      variantName: text("variant_name"),
      // A/B testing: identifies specific variant (A, B, C, etc.) (nullable)
      // Advanced Targeting
      targetCountries: text("target_countries"),
      // JSON array of country codes (null = all countries)
      targetDeviceTypes: text("target_device_types"),
      // JSON array: ["mobile", "tablet", "desktop"] (null = all devices)
      targetUserRoles: text("target_user_roles"),
      // JSON array: ["user", "premium", "admin"] (null = all roles)
      targetLanguages: text("target_languages"),
      // JSON array of language codes (null = all languages)
      // Performance & Budget
      budget: text("budget"),
      // Max budget for paid ads (USD, stored as text for precision)
      costPerClick: text("cost_per_click"),
      // CPC for paid ads (USD)
      costPerImpression: text("cost_per_impression"),
      // CPM for paid ads (USD)
      conversionGoal: text("conversion_goal"),
      // click, signup, purchase, download
      conversionCount: integer("conversion_count").notNull().default(0),
      // Tracked conversions
      // Frequency & Delivery
      frequencyCap: integer("frequency_cap"),
      // Max impressions per user per day (null = unlimited)
      dailyBudget: text("daily_budget"),
      // Daily spending limit (USD)
      totalBudgetSpent: text("total_budget_spent").default("0.00"),
      // Total amount spent
      // Additional metadata
      tags: text("tags"),
      // JSON array of tags for organization
      notes: text("notes"),
      // Internal notes for admins
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      placementActiveIdx: index("ads_placement_active_idx").on(table.placement, table.isActive),
      displayOrderIdx: index("ads_display_order_idx").on(table.displayOrder),
      activeIdx: index("ads_active_idx").on(table.isActive),
      variantGroupIdx: index("ads_variant_group_idx").on(table.variantGroup)
    }));
    adCampaigns = sqliteTable("ad_campaigns", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      // Campaign name
      description: text("description"),
      // Optional description
      status: text("status").notNull().default("draft"),
      // draft, active, paused, completed, archived
      budget: text("budget"),
      // Total budget in USD (stored as text for precision)
      spentAmount: text("spent_amount").notNull().default("0.00"),
      // Amount spent so far
      startDate: text("start_date"),
      // Campaign start date
      endDate: text("end_date"),
      // Campaign end date
      createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      statusIdx: index("ad_campaigns_status_idx").on(table.status),
      createdByIdx: index("ad_campaigns_created_by_idx").on(table.createdBy)
    }));
    advertisementsWithCampaign = sqliteTable("advertisements_v2", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      campaignId: text("campaign_id").references(() => adCampaigns.id, { onDelete: "set null" }),
      title: text("title").notNull(),
      description: text("description"),
      imageUrl: text("image_url").notNull(),
      linkUrl: text("link_url").notNull(),
      type: text("type").notNull(),
      placement: text("placement").notNull(),
      isActive: text("is_active").notNull().default("true"),
      startDate: text("start_date"),
      endDate: text("end_date"),
      displayOrder: integer("display_order").notNull().default(0),
      clickCount: integer("click_count").notNull().default(0),
      impressionCount: integer("impression_count").notNull().default(0),
      status: text("status").notNull().default("approved"),
      // draft, pending, approved, rejected
      reviewedBy: text("reviewed_by").references(() => users.id, { onDelete: "set null" }),
      reviewNotes: text("review_notes"),
      reviewedAt: text("reviewed_at"),
      weight: integer("weight").notNull().default(1),
      // Rotation weight (higher = more frequent)
      frequencyCap: integer("frequency_cap"),
      // Max impressions per user per day (nullable = unlimited)
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      campaignIdx: index("ads_v2_campaign_idx").on(table.campaignId),
      placementActiveIdx: index("ads_v2_placement_active_idx").on(table.placement, table.isActive),
      statusIdx: index("ads_v2_status_idx").on(table.status)
    }));
    adPerformanceHistory = sqliteTable("ad_performance_history", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      adId: text("ad_id").notNull().references(() => advertisements.id, { onDelete: "cascade" }),
      date: text("date").notNull(),
      // Date in YYYY-MM-DD format
      impressions: integer("impressions").notNull().default(0),
      clicks: integer("clicks").notNull().default(0),
      ctr: text("ctr"),
      // Click-through rate (stored as text for precision)
      conversionCount: integer("conversion_count").notNull().default(0),
      // Conversions tracked
      spend: text("spend"),
      // Amount spent this day (for paid campaigns)
      variantName: text("variant_name"),
      // A/B testing: track which variant generated the performance (nullable)
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      adDateIdx: uniqueIndex("ad_performance_ad_date_idx").on(table.adId, table.date),
      adIdx: index("ad_performance_ad_idx").on(table.adId),
      dateIdx: index("ad_performance_date_idx").on(table.date),
      variantNameIdx: index("ad_performance_variant_name_idx").on(table.variantName)
    }));
    adAssets = sqliteTable("ad_assets", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      adId: text("ad_id").notNull().references(() => advertisements.id, { onDelete: "cascade" }),
      deviceType: text("device_type").notNull(),
      // mobile, tablet, desktop, all
      imageUrl: text("image_url").notNull(),
      // Path to device-specific image
      width: integer("width"),
      // Image width in pixels
      height: integer("height"),
      // Image height in pixels
      fileSize: integer("file_size"),
      // File size in bytes
      isPrimary: text("is_primary").notNull().default("false"),
      // "true" for primary asset
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      adDeviceIdx: index("ad_assets_ad_device_idx").on(table.adId, table.deviceType),
      adIdx: index("ad_assets_ad_idx").on(table.adId)
    }));
    adCompliance = sqliteTable("ad_compliance", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      adId: text("ad_id").notNull().references(() => advertisements.id, { onDelete: "cascade" }),
      checkType: text("check_type").notNull(),
      // content_policy, brand_safety, prohibited_content, manual_review
      status: text("status").notNull().default("pending"),
      // pending, approved, flagged, rejected
      flagReason: text("flag_reason"),
      // Reason if flagged/rejected
      checkedBy: text("checked_by").references(() => users.id, { onDelete: "set null" }),
      // Admin who reviewed
      autoCheckResult: text("auto_check_result"),
      // JSON result from automated checks
      checkedAt: text("checked_at").default(sql`(datetime('now'))`),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      adStatusIdx: index("ad_compliance_ad_status_idx").on(table.adId, table.status),
      adIdx: index("ad_compliance_ad_idx").on(table.adId)
    }));
    adUserImpressions = sqliteTable("ad_user_impressions", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      adId: text("ad_id").notNull().references(() => advertisements.id, { onDelete: "cascade" }),
      userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
      // Nullable for anonymous users
      sessionId: text("session_id"),
      // For anonymous tracking
      impressionDate: text("impression_date").notNull(),
      // Date in YYYY-MM-DD format
      impressionCount: integer("impression_count").notNull().default(1),
      createdAt: text("created_at").default(sql`(datetime('now'))`),
      updatedAt: text("updated_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      adUserDateIdx: uniqueIndex("ad_user_impressions_ad_user_date_idx").on(table.adId, table.userId, table.impressionDate),
      adSessionDateIdx: index("ad_user_impressions_ad_session_date_idx").on(table.adId, table.sessionId, table.impressionDate)
    }));
    adAlerts = sqliteTable("ad_alerts", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      adId: text("ad_id").references(() => advertisements.id, { onDelete: "cascade" }),
      campaignId: text("campaign_id").references(() => adCampaigns.id, { onDelete: "cascade" }),
      alertType: text("alert_type").notNull(),
      // low_performance, budget_warning, compliance_flag, expiring_soon
      severity: text("severity").notNull().default("info"),
      // info, warning, critical
      message: text("message").notNull(),
      isRead: text("is_read").notNull().default("false"),
      isResolved: text("is_resolved").notNull().default("false"),
      resolvedBy: text("resolved_by").references(() => users.id, { onDelete: "set null" }),
      resolvedAt: text("resolved_at"),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      adIdx: index("ad_alerts_ad_idx").on(table.adId),
      campaignIdx: index("ad_alerts_campaign_idx").on(table.campaignId),
      severityIdx: index("ad_alerts_severity_idx").on(table.severity),
      isResolvedIdx: index("ad_alerts_is_resolved_idx").on(table.isResolved)
    }));
    adTemplates = sqliteTable("ad_templates", {
      id: text("id").primaryKey().$defaultFn(() => generateId()),
      name: text("name").notNull(),
      // Template name
      description: text("description"),
      type: text("type").notNull(),
      // banner, sidebar, popup, inline
      category: text("category").notNull(),
      // manga_promotion, sponsor, announcement, partner
      thumbnailUrl: text("thumbnail_url"),
      // Preview image
      defaultConfig: text("default_config"),
      // JSON with default settings
      isActive: text("is_active").notNull().default("true"),
      usageCount: integer("usage_count").notNull().default(0),
      createdAt: text("created_at").default(sql`(datetime('now'))`)
    }, (table) => ({
      typeIdx: index("ad_templates_type_idx").on(table.type),
      categoryIdx: index("ad_templates_category_idx").on(table.category)
    }));
    insertUserSchema = createInsertSchema(users).pick({
      username: true,
      email: true,
      password: true,
      profilePicture: true,
      country: true,
      isAdmin: true
    });
    loginUserSchema = createInsertSchema(users).pick({
      username: true,
      password: true
    });
    signupUserSchema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
      country: z.string().optional(),
      profilePicture: z.string().optional()
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
    safeUserSchema = insertUserSchema.pick({
      username: true,
      email: true,
      profilePicture: true,
      country: true
    }).extend({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      profileImageUrl: z.string().optional(),
      role: z.enum(["user", "premium", "staff", "admin", "owner"]).default("user"),
      createdAt: z.string().optional(),
      // Stored as TEXT in SQLite
      updatedAt: z.string().optional()
      // Stored as TEXT in SQLite
    });
    updateUserRoleSchema = z.object({
      role: z.enum(["user", "premium", "staff", "admin", "owner"])
    });
    insertSeriesSchema = createInsertSchema(series, {
      title: z.string().min(1, "Title is required").max(200, "Title too long"),
      description: z.string().max(2e3, "Description too long").optional(),
      author: z.string().max(100, "Author name too long").optional(),
      artist: z.string().max(100, "Artist name too long").optional(),
      status: z.enum(["ongoing", "completed", "hiatus", "cancelled"]).default("ongoing"),
      type: z.enum(["manga", "manhwa", "manhua", "webtoon"]).default("manga"),
      genres: z.array(z.string()).optional().transform((val) => val ? JSON.stringify(val) : void 0),
      // Convert array to JSON string for SQLite storage
      coverImageUrl: z.string().refine(
        (val) => val === void 0 || val.startsWith("/uploads/") || val.startsWith("/api/chapters/image/") || /^https?:\/\//.test(val),
        "Cover image must be a valid URL or upload path"
      ).optional(),
      rating: z.coerce.number().min(0, "Rating must be at least 0").max(10, "Rating cannot exceed 10").optional(),
      totalChapters: z.coerce.number().int().min(0).optional(),
      publishedYear: z.coerce.number().int().min(1900).max((/* @__PURE__ */ new Date()).getFullYear() + 5).optional(),
      isAdult: z.enum(["true", "false"]).default("false"),
      // Section assignment fields
      isFeatured: z.enum(["true", "false"]).default("false"),
      isTrending: z.enum(["true", "false"]).default("false"),
      isPopularToday: z.enum(["true", "false"]).default("false"),
      isLatestUpdate: z.enum(["true", "false"]).default("false"),
      isPinned: z.enum(["true", "false"]).default("false")
    });
    updateSeriesSchema = insertSeriesSchema.omit({ genres: true }).partial().extend({
      genres: z.array(z.string()).optional()
      // Don't transform here - let storage layer handle serialization
    });
    insertLanguageSchema = createInsertSchema(languages, {
      code: z.string().min(2, "Language code must be at least 2 characters").max(5, "Language code too long").regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Invalid language code format (e.g., en, es, ja, en-US)"),
      name: z.string().min(1, "Language name is required").max(100, "Language name too long"),
      nativeName: z.string().min(1, "Native name is required").max(100, "Native name too long"),
      isActive: z.enum(["true", "false"]).default("true"),
      isDefault: z.enum(["true", "false"]).default("false")
    });
    updateLanguageSchema = insertLanguageSchema.partial();
    insertSeriesTranslationSchema = createInsertSchema(seriesTranslations, {
      seriesId: z.string().min(1, "Series ID is required"),
      languageId: z.string().min(1, "Language ID is required"),
      title: z.string().min(1, "Translated title is required").max(200, "Title too long").optional(),
      description: z.string().max(2e3, "Description too long").optional()
    });
    updateSeriesTranslationSchema = insertSeriesTranslationSchema.partial().omit({ seriesId: true, languageId: true });
    insertChapterSchema = createInsertSchema(chapters, {
      seriesId: z.string().min(1, "Series ID is required"),
      chapterNumber: z.string().min(1, "Chapter number is required").max(20, "Chapter number too long"),
      title: z.string().max(200, "Chapter title too long").optional(),
      pages: z.array(z.string()).min(1, "At least one page is required").transform((val) => JSON.stringify(val)),
      // Convert array to JSON string
      totalPages: z.coerce.number().int().min(1, "Must have at least 1 page").optional(),
      // Optional - computed by storage
      coverImageUrl: z.string().refine(
        (val) => val === void 0 || val.startsWith("/uploads/") || val.startsWith("/api/chapters/image/") || /^https?:\/\//.test(val),
        "Cover image must be a valid URL or upload path"
      ).optional(),
      isPublished: z.enum(["true", "false"]).default("true"),
      uploadedBy: z.string().optional(),
      requiresManualReorder: z.enum(["true", "false"]).default("false"),
      naturalSortConfidence: z.string().refine(
        (val) => val === void 0 || /^\d*\.?\d+$/.test(val) && parseFloat(val) >= 0 && parseFloat(val) <= 1,
        { message: "Natural sort confidence must be a number between 0.0 and 1.0" }
      ).default("1.0")
    });
    updateChapterSchema = insertChapterSchema.partial();
    insertSettingSchema = createInsertSchema(settings, {
      category: z.enum(["site", "users", "content", "system"]),
      key: z.string().min(1, "Key is required").max(100, "Key too long"),
      value: z.string().min(0, "Value is required"),
      type: z.enum(["string", "number", "boolean", "json"]).default("string"),
      description: z.string().max(500, "Description too long").optional(),
      isPublic: z.boolean().default(false).transform((val) => val ? "true" : "false")
    });
    updateSettingSchema = insertSettingSchema.partial();
    settingValueSchema = z.object({
      category: z.enum(["site", "users", "content", "system"]),
      key: z.string().min(1),
      value: z.any(),
      // Will be validated based on type in the API endpoint
      type: z.enum(["string", "number", "boolean", "json"]).default("string"),
      description: z.string().optional(),
      isPublic: z.boolean().default(false).transform((val) => val ? "true" : "false")
    });
    insertUserLibrarySchema = createInsertSchema(userLibrary, {
      userId: z.string().min(1, "User ID is required"),
      seriesId: z.string().min(1, "Series ID is required"),
      status: z.enum(["reading", "completed", "plan_to_read", "on_hold", "dropped"]).default("reading")
    });
    updateUserLibrarySchema = z.object({
      status: z.enum(["reading", "completed", "plan_to_read", "on_hold", "dropped"])
    });
    insertCommentSchema = createInsertSchema(comments, {
      userId: z.string().min(1, "User ID is required"),
      seriesId: z.string().optional(),
      chapterId: z.string().optional(),
      content: z.string().min(1, "Comment cannot be empty").max(1e3, "Comment cannot exceed 1000 characters")
    }).refine((data) => data.seriesId || data.chapterId, {
      message: "Comment must be for either a series or a chapter",
      path: ["seriesId"]
    }).refine((data) => !(data.seriesId && data.chapterId), {
      message: "Comment cannot be for both a series and a chapter",
      path: ["seriesId"]
    });
    updateCommentSchema = z.object({
      content: z.string().min(1, "Comment cannot be empty").max(1e3, "Comment cannot exceed 1000 characters")
    });
    insertReadingProgressSchema = createInsertSchema(readingProgress, {
      userId: z.string().min(1, "User ID is required"),
      seriesId: z.string().min(1, "Series ID is required"),
      chapterId: z.string().optional(),
      lastReadPage: z.coerce.number().int().min(0, "Page number must be at least 0").default(0)
    });
    updateReadingProgressSchema = z.object({
      chapterId: z.string().optional(),
      lastReadPage: z.coerce.number().int().min(0, "Page number must be at least 0")
    });
    insertUserRatingSchema = createInsertSchema(userRatings, {
      userId: z.string().min(1, "User ID is required"),
      seriesId: z.string().min(1, "Series ID is required"),
      rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10"),
      review: z.string().max(2e3, "Review cannot exceed 2000 characters").optional()
    });
    updateUserRatingSchema = z.object({
      rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10").optional(),
      review: z.string().max(2e3, "Review cannot exceed 2000 characters").optional()
    });
    insertCurrencyTransactionSchema = createInsertSchema(currencyTransactions, {
      userId: z.string().min(1, "User ID is required"),
      amount: z.coerce.number().int().refine((val) => val !== 0, "Amount cannot be zero"),
      type: z.enum(["purchase", "admin_grant", "unlock_chapter", "refund", "bonus"]),
      description: z.string().min(1, "Description is required").max(500, "Description too long"),
      relatedEntityId: z.string().optional()
    });
    selectCurrencyTransactionSchema = createSelectSchema(currencyTransactions);
    insertCurrencyPackageSchema = createInsertSchema(currencyPackages, {
      name: z.string().min(1, "Package name is required").max(100, "Package name too long"),
      currencyAmount: z.coerce.number().int().min(1, "Currency amount must be at least 1"),
      priceUSD: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid USD amount (e.g., 4.99)"),
      bonusPercentage: z.coerce.number().int().min(0, "Bonus percentage cannot be negative").max(100, "Bonus percentage cannot exceed 100").default(0),
      isActive: z.enum(["true", "false"]).default("true"),
      displayOrder: z.coerce.number().int().min(0, "Display order must be at least 0").default(0)
    });
    selectCurrencyPackageSchema = createSelectSchema(currencyPackages);
    updateCurrencyPackageSchema = insertCurrencyPackageSchema.partial();
    insertUserPurchaseSchema = createInsertSchema(userPurchases, {
      userId: z.string().min(1, "User ID is required"),
      packageId: z.string().optional(),
      amountPaid: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid USD amount (e.g., 4.99)"),
      currencyReceived: z.coerce.number().int().min(0, "Currency received must be at least 0"),
      paymentProvider: z.string().min(1, "Payment provider is required"),
      transactionId: z.string().optional(),
      status: z.enum(["completed", "pending", "failed", "refunded"]).default("pending")
    });
    selectUserPurchaseSchema = createSelectSchema(userPurchases);
    updateUserPurchaseSchema = z.object({
      status: z.enum(["completed", "pending", "failed", "refunded"])
    });
    insertChapterAccessControlSchema = createInsertSchema(chapterAccessControl, {
      chapterId: z.string().min(1, "Chapter ID is required"),
      accessType: z.enum(["free", "premium", "locked"]),
      unlockCost: z.coerce.number().int().min(0, "Unlock cost cannot be negative").default(0),
      isActive: z.enum(["true", "false"]).default("true")
    });
    selectChapterAccessControlSchema = createSelectSchema(chapterAccessControl);
    updateChapterAccessControlSchema = insertChapterAccessControlSchema.partial().omit({ chapterId: true });
    insertUserChapterUnlockSchema = createInsertSchema(userChapterUnlocks, {
      userId: z.string().min(1, "User ID is required"),
      chapterId: z.string().min(1, "Chapter ID is required"),
      costPaid: z.coerce.number().int().min(0, "Cost paid cannot be negative")
    });
    selectUserChapterUnlockSchema = createSelectSchema(userChapterUnlocks);
    adminAddCurrencySchema = z.object({
      userId: z.string().min(1, "User ID is required"),
      amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
      description: z.string().min(1, "Description is required").max(500, "Description too long"),
      relatedEntityId: z.string().optional()
    });
    adminDeductCurrencySchema = z.object({
      userId: z.string().min(1, "User ID is required"),
      amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
      description: z.string().min(1, "Description is required").max(500, "Description too long"),
      relatedEntityId: z.string().optional()
    });
    insertReadingListSchema = createInsertSchema(readingLists, {
      name: z.string().min(1, "List name is required").max(100, "Name too long"),
      description: z.string().max(500, "Description too long").optional(),
      visibility: z.enum(["private", "public"]).default("private")
    });
    selectReadingListSchema = createSelectSchema(readingLists);
    updateReadingListSchema = insertReadingListSchema.partial().omit({ userId: true });
    insertReadingListItemSchema = createInsertSchema(readingListItems, {
      listId: z.string().min(1, "List ID is required"),
      seriesId: z.string().min(1, "Series ID is required")
    });
    selectReadingListItemSchema = createSelectSchema(readingListItems);
    insertAdvertisementSchema = z.object({
      title: z.string().min(1, "Title is required").max(200, "Title too long"),
      description: z.string().max(1e3, "Description too long").optional(),
      imageUrl: z.string().url("Invalid image URL").or(z.string().startsWith("/uploads/", { message: "Image URL must be a valid URL or upload path" })),
      linkUrl: z.string().url("Invalid link URL"),
      type: z.enum(["banner", "sidebar", "popup", "inline"], { errorMap: () => ({ message: "Invalid ad type" }) }),
      placement: z.enum(["homepage", "manga-page", "chapter-reader", "browse", "all"], { errorMap: () => ({ message: "Invalid placement" }) }),
      isActive: z.enum(["true", "false"]).default("true"),
      startDate: z.string().datetime().optional().nullable(),
      endDate: z.string().datetime().optional().nullable(),
      displayOrder: z.coerce.number().int().min(0, "Display order must be at least 0").default(0),
      // Advanced Targeting (all optional)
      targetCountries: z.string().optional().nullable(),
      // JSON string array
      targetDeviceTypes: z.string().optional().nullable(),
      // JSON string array
      targetUserRoles: z.string().optional().nullable(),
      // JSON string array
      targetLanguages: z.string().optional().nullable(),
      // JSON string array
      // Performance & Budget (all optional)
      budget: z.string().optional().nullable(),
      costPerClick: z.string().optional().nullable(),
      costPerImpression: z.string().optional().nullable(),
      conversionGoal: z.enum(["click", "signup", "purchase", "download"]).optional().nullable(),
      frequencyCap: z.coerce.number().int().min(1).optional().nullable(),
      dailyBudget: z.string().optional().nullable(),
      // Metadata (all optional)
      tags: z.string().optional().nullable(),
      // JSON string array
      notes: z.string().max(5e3).optional().nullable()
    }).refine((data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    }, {
      message: "Start date must be before end date",
      path: ["endDate"]
    });
    selectAdvertisementSchema = createSelectSchema(advertisements);
    updateAdvertisementSchema = z.object({
      title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
      description: z.string().max(1e3, "Description too long").optional(),
      imageUrl: z.string().url("Invalid image URL").or(z.string().startsWith("/uploads/", { message: "Image URL must be a valid URL or upload path" })).optional(),
      linkUrl: z.string().url("Invalid link URL").optional(),
      type: z.enum(["banner", "sidebar", "popup", "inline"], { errorMap: () => ({ message: "Invalid ad type" }) }).optional(),
      placement: z.enum(["homepage", "manga-page", "chapter-reader", "browse", "all"], { errorMap: () => ({ message: "Invalid placement" }) }).optional(),
      isActive: z.enum(["true", "false"]).optional(),
      startDate: z.string().datetime().optional().nullable(),
      endDate: z.string().datetime().optional().nullable(),
      displayOrder: z.coerce.number().int().min(0, "Display order must be at least 0").optional(),
      // Advanced Targeting (all optional)
      targetCountries: z.string().optional().nullable(),
      targetDeviceTypes: z.string().optional().nullable(),
      targetUserRoles: z.string().optional().nullable(),
      targetLanguages: z.string().optional().nullable(),
      // Performance & Budget (all optional)
      budget: z.string().optional().nullable(),
      costPerClick: z.string().optional().nullable(),
      costPerImpression: z.string().optional().nullable(),
      conversionGoal: z.enum(["click", "signup", "purchase", "download"]).optional().nullable(),
      frequencyCap: z.coerce.number().int().min(1).optional().nullable(),
      dailyBudget: z.string().optional().nullable(),
      // Metadata (all optional)
      tags: z.string().optional().nullable(),
      notes: z.string().max(5e3).optional().nullable()
    }).refine((data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    }, {
      message: "Start date must be before end date",
      path: ["endDate"]
    });
    adCampaignBaseSchema = z.object({
      name: z.string().min(1, "Campaign name is required").max(200, "Campaign name too long"),
      description: z.string().max(1e3, "Description too long").optional(),
      status: z.enum(["draft", "active", "paused", "completed", "archived"]).default("draft"),
      budget: z.string().regex(/^\d+(\.\d{1,2})?$/, "Budget must be a valid USD amount").optional().nullable(),
      startDate: z.string().datetime().optional().nullable(),
      endDate: z.string().datetime().optional().nullable()
    });
    insertAdCampaignSchema = adCampaignBaseSchema.refine((data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    }, {
      message: "Start date must be before end date",
      path: ["endDate"]
    });
    updateAdCampaignSchema = adCampaignBaseSchema.partial().refine((data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    }, {
      message: "Start date must be before end date",
      path: ["endDate"]
    });
    insertAdPerformanceHistorySchema = z.object({
      adId: z.string().min(1, "Ad ID is required"),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
      impressions: z.coerce.number().int().min(0).default(0),
      clicks: z.coerce.number().int().min(0).default(0),
      conversionCount: z.coerce.number().int().min(0).default(0),
      spend: z.string().regex(/^\d+(\.\d{1,2})?$/, "Spend must be a valid USD amount").optional().nullable()
    });
    insertAdAssetSchema = z.object({
      adId: z.string().min(1, "Ad ID is required"),
      deviceType: z.enum(["mobile", "tablet", "desktop", "all"]),
      imageUrl: z.string().url("Invalid image URL").or(z.string().startsWith("/uploads/", { message: "Image URL must be a valid URL or upload path" })),
      width: z.coerce.number().int().min(1).optional().nullable(),
      height: z.coerce.number().int().min(1).optional().nullable(),
      fileSize: z.coerce.number().int().min(0).optional().nullable(),
      isPrimary: z.enum(["true", "false"]).default("false")
    });
    insertAdComplianceSchema = z.object({
      adId: z.string().min(1, "Ad ID is required"),
      checkType: z.enum(["content_policy", "brand_safety", "prohibited_content", "manual_review"]),
      status: z.enum(["pending", "approved", "flagged", "rejected"]).default("pending"),
      flagReason: z.string().max(500, "Flag reason too long").optional(),
      autoCheckResult: z.string().optional()
      // JSON string
    });
    updateAdComplianceSchema = z.object({
      status: z.enum(["pending", "approved", "flagged", "rejected"]),
      flagReason: z.string().max(500, "Flag reason too long").optional()
    });
    insertAdTemplateSchema = z.object({
      name: z.string().min(1, "Template name is required").max(200, "Template name too long"),
      description: z.string().max(1e3, "Description too long").optional(),
      type: z.enum(["banner", "sidebar", "popup", "inline"]),
      category: z.enum(["manga_promotion", "sponsor", "announcement", "partner"]),
      thumbnailUrl: z.string().url("Invalid thumbnail URL").or(z.string().startsWith("/uploads/")).optional(),
      defaultConfig: z.string().optional(),
      // JSON string
      isActive: z.enum(["true", "false"]).default("true")
    });
    updateAdTemplateSchema = insertAdTemplateSchema.partial();
    insertAdvertisementWithApprovalSchema = z.object({
      title: z.string().min(1, "Title is required").max(200, "Title too long"),
      description: z.string().max(1e3, "Description too long").optional(),
      imageUrl: z.string().url("Invalid image URL").or(z.string().startsWith("/uploads/", { message: "Image URL must be a valid URL or upload path" })),
      linkUrl: z.string().url("Invalid link URL"),
      type: z.enum(["banner", "sidebar", "popup", "inline"], { errorMap: () => ({ message: "Invalid ad type" }) }),
      placement: z.enum(["homepage", "manga-page", "chapter-reader", "browse", "all"], { errorMap: () => ({ message: "Invalid placement" }) }),
      isActive: z.enum(["true", "false"]).default("true"),
      startDate: z.string().datetime().optional().nullable(),
      endDate: z.string().datetime().optional().nullable(),
      displayOrder: z.coerce.number().int().min(0, "Display order must be at least 0").default(0),
      campaignId: z.string().optional().nullable(),
      status: z.enum(["draft", "pending", "approved", "rejected"]).default("draft"),
      weight: z.coerce.number().int().min(1, "Weight must be at least 1").default(1),
      frequencyCap: z.coerce.number().int().min(1).optional().nullable()
    }).refine((data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    }, {
      message: "Start date must be before end date",
      path: ["endDate"]
    });
    updateAdvertisementWithApprovalSchema = z.object({
      title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
      description: z.string().max(1e3, "Description too long").optional(),
      imageUrl: z.string().url("Invalid image URL").or(z.string().startsWith("/uploads/", { message: "Image URL must be a valid URL or upload path" })).optional(),
      linkUrl: z.string().url("Invalid link URL").optional(),
      type: z.enum(["banner", "sidebar", "popup", "inline"], { errorMap: () => ({ message: "Invalid ad type" }) }).optional(),
      placement: z.enum(["homepage", "manga-page", "chapter-reader", "browse", "all"], { errorMap: () => ({ message: "Invalid placement" }) }).optional(),
      isActive: z.enum(["true", "false"]).optional(),
      startDate: z.string().datetime().optional().nullable(),
      endDate: z.string().datetime().optional().nullable(),
      displayOrder: z.coerce.number().int().min(0, "Display order must be at least 0").optional(),
      campaignId: z.string().optional().nullable(),
      status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
      weight: z.coerce.number().int().min(1, "Weight must be at least 1").optional(),
      frequencyCap: z.coerce.number().int().min(1).optional().nullable()
    }).refine((data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    }, {
      message: "Start date must be before end date",
      path: ["endDate"]
    });
    approveAdSchema = z.object({
      reviewNotes: z.string().max(1e3, "Review notes too long").optional()
    });
    rejectAdSchema = z.object({
      reviewNotes: z.string().min(1, "Rejection reason is required").max(1e3, "Review notes too long")
    });
    insertCouponSchema = z.object({
      code: z.string().min(1, "Coupon code is required").max(50, "Code too long").regex(/^[A-Z0-9_-]+$/i, "Code must contain only letters, numbers, dashes, and underscores"),
      type: z.enum(["percentage", "fixed"], { errorMap: () => ({ message: "Type must be 'percentage' or 'fixed'" }) }),
      value: z.string().regex(/^\d+(\.\d{1,2})?$/, "Value must be a valid number"),
      minPurchaseAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Minimum purchase must be a valid amount").optional().nullable(),
      maxUses: z.coerce.number().int().min(1).optional().nullable(),
      expiresAt: z.string().datetime().optional().nullable(),
      isActive: z.enum(["true", "false"]).default("true")
    });
    updateCouponSchema = insertCouponSchema.partial();
    insertPackageBundleSchema = z.object({
      name: z.string().min(1, "Bundle name is required").max(200, "Name too long"),
      description: z.string().max(1e3, "Description too long").optional(),
      bundleType: z.enum(["currency", "subscription", "chapter", "mixed"]),
      priceUSD: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid USD amount"),
      items: z.string(),
      // JSON string
      isActive: z.enum(["true", "false"]).default("true"),
      displayOrder: z.coerce.number().int().min(0).default(0)
    });
    updatePackageBundleSchema = insertPackageBundleSchema.partial();
    insertInvoiceSchema = z.object({
      userId: z.string().min(1, "User ID is required"),
      purchaseId: z.string().optional().nullable(),
      invoiceNumber: z.string().min(1, "Invoice number is required").regex(/^INV-\d{8}-\d{4}$/, "Invalid invoice number format"),
      totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Total must be a valid USD amount"),
      taxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Tax must be a valid USD amount").default("0.00"),
      discountAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Discount must be a valid USD amount").default("0.00"),
      finalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Final amount must be a valid USD amount"),
      status: z.enum(["draft", "issued", "paid", "voided"]).default("draft"),
      pdfPath: z.string().optional().nullable()
    });
    updateInvoiceSchema = insertInvoiceSchema.partial();
    insertInvoiceItemSchema = z.object({
      invoiceId: z.string().min(1, "Invoice ID is required"),
      itemType: z.enum(["currency_package", "subscription", "bundle", "chapter_unlock"]),
      itemId: z.string().optional().nullable(),
      description: z.string().min(1, "Description is required").max(500, "Description too long"),
      quantity: z.coerce.number().int().min(1).default(1),
      unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Unit price must be a valid USD amount"),
      totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Total price must be a valid USD amount")
    });
    insertManualAssignmentSchema = z.object({
      userId: z.string().min(1, "User ID is required"),
      packageId: z.string().min(1, "Package ID is required"),
      packageType: z.enum(["currency", "subscription", "bundle"]),
      assignedBy: z.string().min(1, "Assigner ID is required"),
      reason: z.string().min(1, "Reason is required").max(500, "Reason too long"),
      expiresAt: z.string().datetime().optional().nullable(),
      isActive: z.enum(["true", "false"]).default("true")
    });
    updateManualAssignmentSchema = insertManualAssignmentSchema.partial();
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  db: () => db,
  initializeAdminUser: () => initializeAdminUser,
  storage: () => storage
});
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, sql as sql2, desc, asc, and, or, like, inArray, gte, lte } from "drizzle-orm";
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { randomBytes } from "crypto";
function isSevereCorruption(error) {
  if (!error || typeof error.message !== "string") return false;
  const severeCorruptionIndicators = [
    "database disk image is malformed",
    "file is not a database",
    "SQLITE_CORRUPT",
    "SQLITE_NOTADB",
    "corrupt database",
    "malformed database",
    "database corruption"
  ];
  return severeCorruptionIndicators.some(
    (indicator) => error.message.toLowerCase().includes(indicator.toLowerCase())
  );
}
function isRecoverableSchemaIssue(error) {
  if (!error || typeof error.message !== "string") return false;
  const recoverableIndicators = [
    "no such table",
    "table already exists",
    "database schema has changed",
    "no such column"
  ];
  return recoverableIndicators.some(
    (indicator) => error.message.toLowerCase().includes(indicator.toLowerCase())
  );
}
function isDiskSpaceIssue(error) {
  if (!error || typeof error.message !== "string") return false;
  return error.message.toLowerCase().includes("database or disk is full") || error.message.toLowerCase().includes("SQLITE_FULL");
}
function safeDatabaseBackup(dbFilePath, reason) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const fileName = `${dbFilePath.split("/").pop()?.replace(".db", "")}-backup-${timestamp}.db`;
  const backupPath = join(backupDir, fileName);
  try {
    if (existsSync(dbFilePath)) {
      console.log(`[data-protection] \u{1F6E1}\uFE0F  Creating safe backup of database before recovery`);
      console.log(`[data-protection] \u{1F4C4} Source: ${dbFilePath}`);
      console.log(`[data-protection] \u{1F4BE} Backup: ${backupPath}`);
      console.log(`[data-protection] \u{1F50D} Reason: ${reason}`);
      copyFileSync(dbFilePath, backupPath);
      try {
        const testDb = new Database(backupPath, { readonly: true });
        testDb.exec("SELECT 1");
        testDb.close();
        console.log(`[data-protection] \u2705 Backup validated successfully`);
      } catch (validationError) {
        console.error(`[data-protection] \u26A0\uFE0F  Backup validation failed, keeping original:`, validationError);
        return "";
      }
      const preservedPath = `${dbFilePath}.preserved-${timestamp}`;
      try {
        copyFileSync(dbFilePath, preservedPath);
        console.log(`[data-protection] \u{1F512} Original database preserved at: ${preservedPath}`);
        const corruptedMovePath = `${dbFilePath}.corrupted-${timestamp}`;
        const fs4 = __require("fs");
        fs4.renameSync(dbFilePath, corruptedMovePath);
        console.log(`[data-protection] \u{1F5D1}\uFE0F  Moved corrupted file to: ${corruptedMovePath}`);
        console.log(`[data-protection] \u{1F4A1} Recovery can now create fresh database at: ${dbFilePath}`);
      } catch (moveError) {
        console.error(`[data-protection] \u274C Could not move corrupted file - aborting recovery:`, moveError);
        return "";
      }
      return backupPath;
    }
  } catch (backupError) {
    console.error(`[data-protection] \u274C Failed to create safe backup: ${backupError}`);
  }
  return "";
}
function createDatabaseSafely(dbFilePath, initFunction) {
  try {
    const dbDirectory = dirname(dbFilePath);
    if (!existsSync(dbDirectory)) {
      mkdirSync(dbDirectory, { recursive: true, mode: 493 });
      console.log(`[data-protection] \u{1F4C1} Created data directory: ${dbDirectory}`);
    }
    console.log(`[recovery] \u{1F527} Creating fresh database: ${dbFilePath}`);
    const db2 = new Database(dbFilePath);
    db2.exec("SELECT 1");
    initFunction(db2);
    db2.exec("PRAGMA integrity_check");
    console.log(`[recovery] \u2705 Successfully created and verified: ${dbFilePath}`);
    return db2;
  } catch (error) {
    console.error(`[recovery] \u274C Failed to create database ${dbFilePath}:`, error);
    return null;
  }
}
function serializeJson(obj) {
  return obj ? JSON.stringify(obj) : "";
}
function deserializeJson(str) {
  if (!str || str === "" || str === "null") return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function getTableColumns(sqliteInstance2, tableName) {
  try {
    const columns = sqliteInstance2.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.map((col) => col.name);
  } catch (error) {
    console.log(`[migration] Table ${tableName} does not exist yet, will be created`);
    return [];
  }
}
function tableExists(sqliteInstance2, tableName) {
  try {
    const result = sqliteInstance2.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `).get(tableName);
    return !!result;
  } catch (error) {
    return false;
  }
}
function migrateTableColumns(sqliteInstance2, tableName, expectedColumns) {
  console.log(`[migration] Checking column drift for table: ${tableName}`);
  if (!tableExists(sqliteInstance2, tableName)) {
    console.log(`[migration] Table ${tableName} doesn't exist yet, will be created`);
    return;
  }
  const existingColumns = getTableColumns(sqliteInstance2, tableName);
  console.log(`[migration] Existing columns in ${tableName}:`, existingColumns);
  const missingColumns = expectedColumns.filter(
    (expected) => !existingColumns.includes(expected.name)
  );
  if (missingColumns.length === 0) {
    console.log(`[migration] \u2705 All columns present in ${tableName}`);
    return;
  }
  console.log(
    `[migration] Found ${missingColumns.length} missing columns in ${tableName}:`,
    missingColumns.map((col) => col.name)
  );
  for (const column of missingColumns) {
    try {
      let alterStatement = `ALTER TABLE "${tableName}" ADD COLUMN "${column.name}" ${column.type}`;
      if (!column.nullable && column.defaultValue) {
        alterStatement += ` NOT NULL DEFAULT ${column.defaultValue}`;
      } else if (column.defaultValue) {
        alterStatement += ` DEFAULT ${column.defaultValue}`;
      }
      console.log(`[migration] Adding column: ${alterStatement}`);
      sqliteInstance2.exec(alterStatement);
      console.log(`[migration] \u2705 Successfully added column ${column.name} to ${tableName}`);
    } catch (error) {
      console.error(`[migration] \u274C Failed to add column ${column.name} to ${tableName}:`, error);
    }
  }
}
function verifyAndEnforceUniqueConstraint(sqliteInstance2) {
  console.log("[constraint] Verifying unique constraint on chapters table...");
  try {
    const indexes = sqliteInstance2.prepare(`PRAGMA index_list('chapters')`).all();
    const existingUniqueIndex = indexes.find(
      (index2) => index2.unique === 1 && (index2.name === "unique_series_chapter" || index2.name === "sqlite_autoindex_chapters_1" || // SQLite auto-generated unique index
      index2.name.includes("unique") && index2.name.includes("series") && index2.name.includes("chapter"))
    );
    if (existingUniqueIndex) {
      console.log(`[constraint] \u2705 Unique constraint already exists: ${existingUniqueIndex.name}`);
      const indexInfo = sqliteInstance2.prepare(`PRAGMA index_info('${existingUniqueIndex.name}')`).all();
      const columnNames = indexInfo.map((col) => col.name).sort();
      const expectedColumns = ["series_id", "chapter_number"].sort();
      if (JSON.stringify(columnNames) === JSON.stringify(expectedColumns)) {
        console.log("[constraint] \u2705 Existing unique index covers correct columns");
        return;
      } else {
        console.log(`[constraint] \u26A0\uFE0F  Existing unique index covers wrong columns: ${columnNames.join(", ")} (expected: ${expectedColumns.join(", ")})`);
      }
    }
    console.log("[constraint] \u{1F527} Creating unique index on chapters(series_id, chapter_number)...");
    sqliteInstance2.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_series_chapter 
      ON chapters(series_id, chapter_number)
    `);
    const indexesAfter = sqliteInstance2.prepare(`PRAGMA index_list('chapters')`).all();
    const newUniqueIndex = indexesAfter.find(
      (index2) => index2.unique === 1 && index2.name === "unique_series_chapter"
    );
    if (!newUniqueIndex) {
      throw new Error("Failed to create unique index - index not found after creation");
    }
    const newIndexInfo = sqliteInstance2.prepare(`PRAGMA index_info('unique_series_chapter')`).all();
    const newColumnNames = newIndexInfo.map((col) => col.name).sort();
    const expectedCols = ["series_id", "chapter_number"].sort();
    if (JSON.stringify(newColumnNames) !== JSON.stringify(expectedCols)) {
      throw new Error(`Unique index created with wrong columns: ${newColumnNames.join(", ")} (expected: ${expectedCols.join(", ")})`);
    }
    console.log("[constraint] \u2705 Unique index created and verified successfully");
    const testResult = sqliteInstance2.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='index' AND name='unique_series_chapter'
    `).get();
    if (!testResult || !testResult.sql.toUpperCase().includes("UNIQUE")) {
      throw new Error("Unique index exists but may not be enforcing uniqueness");
    }
    console.log("[constraint] \u2705 Constraint enforcement verified");
  } catch (error) {
    console.error("[constraint] \u274C CRITICAL: Failed to verify/create unique constraint:", error);
    console.error("[constraint] \u{1F6A8} Database startup must abort - duplicate chapters could be created!");
    throw new Error(`CRITICAL DATABASE SAFETY ERROR: Could not ensure unique constraint on chapters table: ${error.message}`);
  }
}
function initializeSchema(sqliteInstance2) {
  console.log("[schema] Initializing database schema...");
  try {
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "username" TEXT UNIQUE,
        "email" TEXT UNIQUE,
        "password" TEXT,
        "profile_picture" TEXT,
        "country" TEXT,
        "is_admin" TEXT NOT NULL DEFAULT 'false',
        "role" TEXT NOT NULL DEFAULT 'user',
        "first_name" TEXT,
        "last_name" TEXT,
        "profile_image_url" TEXT,
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now'))
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "series" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "author" TEXT,
        "artist" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ongoing',
        "type" TEXT NOT NULL DEFAULT 'manga',
        "genres" TEXT,
        "cover_image_url" TEXT,
        "rating" TEXT,
        "total_chapters" INTEGER,
        "published_year" INTEGER,
        "is_adult" TEXT NOT NULL DEFAULT 'false',
        "is_featured" TEXT NOT NULL DEFAULT 'false',
        "is_trending" TEXT NOT NULL DEFAULT 'false',
        "is_popular_today" TEXT NOT NULL DEFAULT 'false',
        "is_latest_update" TEXT NOT NULL DEFAULT 'false',
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now'))
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "languages" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "code" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "native_name" TEXT NOT NULL,
        "is_active" TEXT NOT NULL DEFAULT 'true',
        "is_default" TEXT NOT NULL DEFAULT 'false',
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now'))
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "series_translations" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "series_id" TEXT NOT NULL,
        "language_id" TEXT NOT NULL,
        "title" TEXT,
        "description" TEXT,
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now')),
        FOREIGN KEY ("series_id") REFERENCES "series" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("language_id") REFERENCES "languages" ("id") ON DELETE CASCADE,
        UNIQUE ("series_id", "language_id")
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "category" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'string',
        "description" TEXT,
        "is_public" TEXT NOT NULL DEFAULT 'false',
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now'))
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "user_library" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "user_id" TEXT NOT NULL,
        "series_id" TEXT NOT NULL,
        "added_at" TEXT DEFAULT (datetime('now')),
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("series_id") REFERENCES "series" ("id") ON DELETE CASCADE,
        UNIQUE ("user_id", "series_id")
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "user_follows" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "user_id" TEXT NOT NULL,
        "series_id" TEXT NOT NULL,
        "followed_at" TEXT DEFAULT (datetime('now')),
        "notifications_enabled" TEXT NOT NULL DEFAULT 'true',
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("series_id") REFERENCES "series" ("id") ON DELETE CASCADE,
        UNIQUE ("user_id", "series_id")
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "user_id" TEXT NOT NULL,
        "series_id" TEXT,
        "chapter_id" TEXT,
        "content" TEXT NOT NULL,
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now')),
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("series_id") REFERENCES "series" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("chapter_id") REFERENCES "chapters" ("id") ON DELETE CASCADE
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "reading_progress" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "user_id" TEXT NOT NULL,
        "series_id" TEXT NOT NULL,
        "chapter_id" TEXT,
        "last_read_page" INTEGER NOT NULL DEFAULT 0,
        "last_read_at" TEXT DEFAULT (datetime('now')),
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now')),
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("series_id") REFERENCES "series" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("chapter_id") REFERENCES "chapters" ("id") ON DELETE SET NULL,
        UNIQUE ("user_id", "series_id")
      );
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "chapters" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "series_id" TEXT NOT NULL,
        "chapter_number" TEXT NOT NULL,
        "title" TEXT,
        "pages" TEXT NOT NULL,
        "total_pages" INTEGER NOT NULL DEFAULT 0,
        "is_published" TEXT NOT NULL DEFAULT 'true',
        "uploaded_by" TEXT,
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now')),
        FOREIGN KEY ("series_id") REFERENCES "series" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id"),
        UNIQUE ("series_id", "chapter_number")
      );
    `);
    sqliteInstance2.exec(`
      CREATE INDEX IF NOT EXISTS "series_chapter_idx" ON "chapters" ("series_id", "chapter_number");
    `);
    sqliteInstance2.exec(`
      CREATE TABLE IF NOT EXISTS "advertisements" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT NOT NULL,
        "link_url" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "placement" TEXT NOT NULL,
        "is_active" TEXT NOT NULL DEFAULT 'true',
        "start_date" TEXT,
        "end_date" TEXT,
        "display_order" INTEGER NOT NULL DEFAULT 0,
        "click_count" INTEGER NOT NULL DEFAULT 0,
        "impression_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" TEXT DEFAULT (datetime('now')),
        "updated_at" TEXT DEFAULT (datetime('now'))
      );
    `);
    sqliteInstance2.exec(`
      CREATE INDEX IF NOT EXISTS "ads_placement_active_idx" ON "advertisements" ("placement", "is_active");
      CREATE INDEX IF NOT EXISTS "ads_display_order_idx" ON "advertisements" ("display_order");
      CREATE INDEX IF NOT EXISTS "ads_active_idx" ON "advertisements" ("is_active");
    `);
    console.log("[migration] Starting column drift migration...");
    migrateTableColumns(sqliteInstance2, "users", USERS_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "series", SERIES_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "settings", SETTINGS_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "user_library", USER_LIBRARY_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "user_follows", USER_FOLLOWS_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "comments", COMMENTS_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "reading_progress", READING_PROGRESS_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "chapters", CHAPTERS_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "dmca_notices", DMCA_NOTICES_EXPECTED_COLUMNS);
    migrateTableColumns(sqliteInstance2, "advertisements", ADVERTISEMENTS_EXPECTED_COLUMNS);
    console.log("[migration] \u2705 Column drift migration completed");
    sqliteInstance2.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_username_unique" ON "users" ("username");
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
      CREATE INDEX IF NOT EXISTS "settings_category_idx" ON "settings" ("category");
      CREATE UNIQUE INDEX IF NOT EXISTS "settings_category_key_unique" ON "settings" ("category", "key");
      CREATE INDEX IF NOT EXISTS "user_series_idx" ON "user_library" ("user_id", "series_id");
      CREATE INDEX IF NOT EXISTS "comments_user_idx" ON "comments" ("user_id");
      CREATE INDEX IF NOT EXISTS "comments_series_idx" ON "comments" ("series_id");
      CREATE INDEX IF NOT EXISTS "comments_chapter_idx" ON "comments" ("chapter_id");
      CREATE INDEX IF NOT EXISTS "user_series_progress_idx" ON "reading_progress" ("user_id", "series_id");
    `);
    verifyAndEnforceUniqueConstraint(sqliteInstance2);
    console.log("[schema] \u2705 Database schema initialized successfully");
  } catch (error) {
    console.error("[schema] \u274C Failed to initialize schema:", error);
    throw error;
  }
}
function seedDefaultLanguages(sqliteInstance2) {
  try {
    const count = sqliteInstance2.prepare("SELECT COUNT(*) as count FROM languages").get();
    if (count.count === 0) {
      console.log("[seed] Seeding default languages...");
      const defaultLanguages = [
        { code: "en", name: "English", nativeName: "English", isDefault: "true" },
        { code: "es", name: "Spanish", nativeName: "Espa\xF1ol", isDefault: "false" },
        { code: "ja", name: "Japanese", nativeName: "\u65E5\u672C\u8A9E", isDefault: "false" },
        { code: "fr", name: "French", nativeName: "Fran\xE7ais", isDefault: "false" },
        { code: "de", name: "German", nativeName: "Deutsch", isDefault: "false" },
        { code: "zh", name: "Chinese", nativeName: "\u4E2D\u6587", isDefault: "false" },
        { code: "ko", name: "Korean", nativeName: "\uD55C\uAD6D\uC5B4", isDefault: "false" },
        { code: "pt", name: "Portuguese", nativeName: "Portugu\xEAs", isDefault: "false" },
        { code: "ru", name: "Russian", nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", isDefault: "false" },
        { code: "ar", name: "Arabic", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", isDefault: "false" }
      ];
      const stmt = sqliteInstance2.prepare(`
        INSERT INTO languages (id, code, name, native_name, is_active, is_default)
        VALUES (?, ?, ?, ?, 'true', ?)
      `);
      for (const lang of defaultLanguages) {
        stmt.run(crypto.randomUUID(), lang.code, lang.name, lang.nativeName, lang.isDefault);
      }
      console.log("[seed] \u2705 Default languages seeded successfully");
    } else {
      console.log("[seed] \u2705 Languages already exist, skipping seed");
    }
  } catch (error) {
    console.error("[seed] \u26A0\uFE0F  Failed to seed default languages:", error);
  }
}
function initializeMainDatabase() {
  let attempts = 0;
  const maxAttempts = 3;
  const dataDirectories = [dbDir, backupDir];
  dataDirectories.forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true, mode: 493 });
      console.log(`[data-protection] \u{1F4C1} Created directory: ${dir}`);
    }
  });
  while (attempts < maxAttempts) {
    try {
      console.log(`[database] Initializing main database (attempt ${attempts + 1}/${maxAttempts})`);
      const sqliteInstance2 = new Database(dbPath);
      const integrityResult = sqliteInstance2.prepare("PRAGMA integrity_check").get();
      if (integrityResult && integrityResult.integrity_check !== "ok") {
        console.log(`[database] \u26A0\uFE0F  Database integrity check warning: ${JSON.stringify(integrityResult)}`);
      }
      initializeSchema(sqliteInstance2);
      seedDefaultLanguages(sqliteInstance2);
      const drizzleDb2 = drizzle(sqliteInstance2);
      console.log("[database] \u2705 Main database initialized successfully");
      return { sqlite: sqliteInstance2, db: drizzleDb2 };
    } catch (error) {
      attempts++;
      console.error(`[database] \u274C Failed to initialize main database (attempt ${attempts}):`, error);
      if (isSevereCorruption(error)) {
        console.log("[data-protection] \u{1F6A8} SEVERE database corruption detected! Starting careful recovery...");
        const backupPath = safeDatabaseBackup(dbPath, `Severe corruption: ${error.message}`);
        if (backupPath) {
          console.log(`[data-protection] \u{1F4BE} Database safely backed up to: ${backupPath}`);
          const freshDb = createDatabaseSafely(dbPath, initializeSchema);
          if (freshDb) {
            const drizzleDb2 = drizzle(freshDb);
            console.log("[recovery] \u2705 Successfully recovered with fresh database");
            console.log(`[recovery] \u{1F4A1} Your original data is preserved in: ${backupPath}`);
            return { sqlite: freshDb, db: drizzleDb2 };
          }
        } else {
          console.error("[data-protection] \u274C Could not create safe backup - aborting recovery to protect your data");
        }
      } else if (isRecoverableSchemaIssue(error)) {
        console.log("[database] \u{1F527} Detected recoverable schema issue, attempting gentle repair...");
        try {
          const sqliteInstance2 = new Database(dbPath);
          initializeSchema(sqliteInstance2);
          const drizzleDb2 = drizzle(sqliteInstance2);
          console.log("[database] \u2705 Schema issue resolved successfully");
          return { sqlite: sqliteInstance2, db: drizzleDb2 };
        } catch (schemaError) {
          console.error("[database] \u274C Could not resolve schema issue:", schemaError);
        }
      } else if (isDiskSpaceIssue(error)) {
        console.error("[database] \u{1F4BE} DISK SPACE ISSUE: Cannot initialize database due to insufficient space");
        console.error("[database] \u{1F4A1} Please free up disk space and restart the application");
        throw new Error("Insufficient disk space for database operation");
      }
      if (attempts >= maxAttempts) {
        console.error("[database] \u274C Failed to initialize database after all attempts");
        console.error("[data-protection] \u{1F6E1}\uFE0F  Your data has been protected - no files were deleted");
        throw new Error(`Database initialization failed after ${maxAttempts} attempts: ${error.message}`);
      }
      console.log("[database] \u23F3 Waiting before retry...");
      __require("child_process").execSync("sleep 1");
    }
  }
  throw new Error("Unexpected error in database initialization");
}
function createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail) {
  try {
    const sentinelContent = `Admin user seeded on ${(/* @__PURE__ */ new Date()).toISOString()}
Username: ${adminUsername}
Email: ${adminEmail}
Note: This file prevents re-creation of admin users. Delete this file only if you want to reset admin seeding.
`;
    writeFileSync(adminSentinelFile, sentinelContent, "utf8");
    console.log("[init] \u{1F4C4} Created admin sentinel file:", adminSentinelFile);
  } catch (sentinelError) {
    console.warn("[init] \u26A0\uFE0F  Failed to create admin sentinel file:", sentinelError);
  }
}
async function initializeAdminUser() {
  const isProduction = process.env.NODE_ENV === "production";
  const adminSentinelFile = "./data/.admin-seeded";
  try {
    console.log("[init] \u{1F50D} Checking for existing admin users...");
    if (existsSync(adminSentinelFile)) {
      console.log("[init] \u2705 Admin already seeded (sentinel file exists) - skipping admin creation");
      return;
    }
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@localhost.com";
    let adminPassword;
    if (isProduction) {
      if (!process.env.ADMIN_PASSWORD) {
        const randomPassword = randomBytes(16).toString("base64").slice(0, 16);
        adminPassword = randomPassword;
        console.log("[init] \u{1F510} GENERATED ADMIN PASSWORD (SAVE THIS):");
        console.log(`[init] \u{1F511} Password: ${randomPassword}`);
        console.log("[init] \u26A0\uFE0F  This password will only be shown once! Set ADMIN_PASSWORD environment variable for future use.");
      } else {
        adminPassword = process.env.ADMIN_PASSWORD;
      }
    } else {
      adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      throw new Error(`Invalid admin email format: ${adminEmail}`);
    }
    if (adminUsername.length < 3 || adminUsername.length > 50) {
      throw new Error(`Invalid admin username length: ${adminUsername} (must be 3-50 characters)`);
    }
    if (isProduction && adminPassword === "change_me") {
      throw new Error('SECURITY ERROR: Cannot use default password "change_me" in production! Set ADMIN_PASSWORD environment variable.');
    }
    if (adminPassword.length < 6) {
      throw new Error(`Admin password too short: ${adminPassword.length} characters (minimum 6 required)`);
    }
    console.log("[init] \u{1F50D} Searching for existing admin users...");
    const allUsers = await storage.getAllUsers();
    const existingAdmins = allUsers.filter(
      (user) => user.isAdmin === "true" || user.role === "admin"
    );
    if (existingAdmins.length > 0) {
      console.log(`[init] \u2705 Found ${existingAdmins.length} existing admin user(s):`);
      existingAdmins.forEach((admin) => {
        console.log(`[init]    \u{1F464} Admin: ${admin.username || "N/A"} (${admin.email || "N/A"})`);
      });
      console.log("[init] \u2139\uFE0F  Skipping admin creation - admins already exist");
      createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
      return;
    }
    console.log("[init] \u{1F50D} Checking for legacy admin users to upgrade...");
    const legacyAdminByUsername = await storage.getUserByUsername(adminUsername);
    const legacyAdminByEmail = adminEmail ? await storage.getUserByEmail(adminEmail) : null;
    if (legacyAdminByUsername && legacyAdminByUsername.isAdmin !== "true" && legacyAdminByUsername.role !== "admin") {
      console.log(`[init] \u{1F527} Upgrading legacy user '${adminUsername}' to admin...`);
      await storage.updateUser(legacyAdminByUsername.id, {
        isAdmin: "true",
        role: "admin",
        email: adminEmail
        // Update email if provided
      });
      console.log("[init] \u2705 Successfully upgraded existing user to admin");
      console.log(`[init] \u{1F4E7} Username: ${adminUsername}`);
      console.log(`[init] \u{1F4E7} Email: ${adminEmail}`);
      console.log("[init] \u{1F510} Using existing password (unchanged)");
      createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
      return;
    }
    if (legacyAdminByEmail && legacyAdminByEmail.id !== legacyAdminByUsername?.id && legacyAdminByEmail.isAdmin !== "true" && legacyAdminByEmail.role !== "admin") {
      console.log(`[init] \u{1F527} Upgrading legacy user with email '${adminEmail}' to admin...`);
      await storage.updateUser(legacyAdminByEmail.id, {
        isAdmin: "true",
        role: "admin",
        username: adminUsername
        // Update username if provided
      });
      console.log("[init] \u2705 Successfully upgraded existing user to admin");
      console.log(`[init] \u{1F4E7} Username: ${adminUsername}`);
      console.log(`[init] \u{1F4E7} Email: ${adminEmail}`);
      console.log("[init] \u{1F510} Using existing password (unchanged)");
      createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
      return;
    }
    console.log("[init] \u{1F527} Creating new admin user...");
    console.log("[init] \u{1F50D} Checking for duplicate username/email...");
    const existingUserByUsername = await storage.getUserByUsername(adminUsername);
    const existingUserByEmail = await storage.getUserByEmail(adminEmail);
    if (existingUserByUsername) {
      console.log(`[init] \u26A0\uFE0F  User with username '${adminUsername}' already exists but is not admin`);
      console.log("[init] \u{1F527} Upgrading existing user to admin role...");
      await storage.updateUser(existingUserByUsername.id, {
        isAdmin: "true",
        role: "admin",
        email: adminEmail
        // Update email if provided
      });
      console.log("[init] \u2705 Successfully upgraded existing user to admin");
      createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
      return;
    }
    if (existingUserByEmail) {
      console.log(`[init] \u26A0\uFE0F  User with email '${adminEmail}' already exists but is not admin`);
      console.log("[init] \u{1F527} Upgrading existing user to admin role...");
      await storage.updateUser(existingUserByEmail.id, {
        isAdmin: "true",
        role: "admin",
        username: adminUsername
        // Update username if provided
      });
      console.log("[init] \u2705 Successfully upgraded existing user to admin");
      createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
      return;
    }
    const bcrypt2 = await import("bcryptjs");
    const saltRounds = 12;
    const hashedPassword = await bcrypt2.hash(adminPassword, saltRounds);
    let adminUser;
    try {
      adminUser = await storage.createUser({
        username: adminUsername,
        password: hashedPassword,
        email: adminEmail,
        isAdmin: "true",
        profilePicture: null,
        country: null
      });
    } catch (createError) {
      if (createError && typeof createError.message === "string") {
        if (createError.message.includes("UNIQUE constraint failed: users.username") || createError.message.includes("username") && createError.message.includes("unique")) {
          console.log(`[init] \u26A0\uFE0F  Username '${adminUsername}' constraint violation detected`);
          const existingUser = await storage.getUserByUsername(adminUsername);
          if (existingUser) {
            console.log("[init] \u{1F527} Upgrading conflicting user to admin...");
            await storage.updateUser(existingUser.id, {
              isAdmin: "true",
              role: "admin",
              email: adminEmail
            });
            console.log("[init] \u2705 Successfully resolved username conflict and upgraded to admin");
            createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
            return;
          }
        }
        if (createError.message.includes("UNIQUE constraint failed: users.email") || createError.message.includes("email") && createError.message.includes("unique")) {
          console.log(`[init] \u26A0\uFE0F  Email '${adminEmail}' constraint violation detected`);
          const existingUser = await storage.getUserByEmail(adminEmail);
          if (existingUser) {
            console.log("[init] \u{1F527} Upgrading conflicting user to admin...");
            await storage.updateUser(existingUser.id, {
              isAdmin: "true",
              role: "admin",
              username: adminUsername
            });
            console.log("[init] \u2705 Successfully resolved email conflict and upgraded to admin");
            createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
            return;
          }
        }
      }
      throw createError;
    }
    console.log("[init] \u2705 Admin user created successfully!");
    console.log(`[init] \u{1F464} Username: ${adminUsername}`);
    console.log(`[init] \u{1F4E7} Email: ${adminEmail}`);
    console.log(`[init] \u{1F194} User ID: ${adminUser.id}`);
    if (isProduction) {
      if (process.env.ADMIN_PASSWORD) {
        console.log("[init] \u{1F510} Using configured admin password from environment");
      } else {
        console.log("[init] \u26A0\uFE0F  Using default password - CHANGE IMMEDIATELY!");
      }
    } else {
      if (process.env.ADMIN_PASSWORD) {
        console.log("[init] \u{1F510} Using configured admin password from ADMIN_PASSWORD");
      } else {
        console.log("[init] \u{1F510} Using default password: change_me");
        console.log("[init] \u{1F4A1} Set ADMIN_PASSWORD environment variable to use custom password");
      }
    }
    if (adminPassword === "change_me") {
      console.log("[init] \u26A0\uFE0F  SECURITY REMINDER: Default password in use - change immediately!");
    }
    createAdminSentinelFile(adminSentinelFile, adminUsername, adminEmail);
    console.log("[init] \u{1F389} Admin initialization completed successfully");
  } catch (error) {
    console.error("[init] \u274C Failed to initialize admin user:", error);
    if (error instanceof Error) {
      console.error("[init] \u{1F4A5} Error details:", error.message);
      if (error.stack) {
        console.error("[init] \u{1F4CD} Stack trace:", error.stack);
      }
    }
    if (isProduction) {
      console.error("[init] \u{1F6A8} CRITICAL: Admin user initialization failed in production!");
      console.error("[init] \u{1F527} Manual intervention may be required to create admin user");
    } else {
      console.error("[init] \u{1F527} Admin user creation failed - check database and try again");
    }
    console.error("[init] \u26A0\uFE0F  Server will continue without admin user - this may cause issues!");
  }
}
var dbPath, backupDir, dbDir, USERS_EXPECTED_COLUMNS, SERIES_EXPECTED_COLUMNS, SETTINGS_EXPECTED_COLUMNS, USER_LIBRARY_EXPECTED_COLUMNS, USER_FOLLOWS_EXPECTED_COLUMNS, COMMENTS_EXPECTED_COLUMNS, READING_PROGRESS_EXPECTED_COLUMNS, CHAPTERS_EXPECTED_COLUMNS, DMCA_NOTICES_EXPECTED_COLUMNS, ADVERTISEMENTS_EXPECTED_COLUMNS, sqlite, db, sqliteInstance, drizzleDb, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    dbPath = "./data/database.db";
    backupDir = "./data/backups";
    dbDir = dirname(dbPath);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true });
      console.log("[backup] Created backup directory:", backupDir);
    }
    USERS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "username", type: "TEXT", nullable: true },
      { name: "email", type: "TEXT", nullable: true },
      { name: "password", type: "TEXT", nullable: true },
      { name: "profile_picture", type: "TEXT", nullable: true },
      { name: "country", type: "TEXT", nullable: true },
      { name: "is_admin", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "role", type: "TEXT", nullable: false, defaultValue: "'user'" },
      { name: "first_name", type: "TEXT", nullable: true },
      { name: "last_name", type: "TEXT", nullable: true },
      { name: "profile_image_url", type: "TEXT", nullable: true },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    SERIES_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "title", type: "TEXT", nullable: false },
      { name: "description", type: "TEXT", nullable: true },
      { name: "author", type: "TEXT", nullable: true },
      { name: "artist", type: "TEXT", nullable: true },
      { name: "status", type: "TEXT", nullable: false, defaultValue: "'ongoing'" },
      { name: "type", type: "TEXT", nullable: false, defaultValue: "'manga'" },
      { name: "genres", type: "TEXT", nullable: true },
      { name: "cover_image_url", type: "TEXT", nullable: true },
      { name: "rating", type: "TEXT", nullable: true },
      { name: "total_chapters", type: "INTEGER", nullable: true },
      { name: "published_year", type: "INTEGER", nullable: true },
      { name: "is_adult", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "is_featured", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "is_trending", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "is_popular_today", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "is_latest_update", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    SETTINGS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "category", type: "TEXT", nullable: false },
      { name: "key", type: "TEXT", nullable: false },
      { name: "value", type: "TEXT", nullable: false },
      { name: "type", type: "TEXT", nullable: false, defaultValue: "'string'" },
      { name: "description", type: "TEXT", nullable: true },
      { name: "is_public", type: "TEXT", nullable: false, defaultValue: "'false'" },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    USER_LIBRARY_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "user_id", type: "TEXT", nullable: false },
      { name: "series_id", type: "TEXT", nullable: false },
      { name: "status", type: "TEXT", nullable: false, defaultValue: "'reading'" },
      { name: "added_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    USER_FOLLOWS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "user_id", type: "TEXT", nullable: false },
      { name: "series_id", type: "TEXT", nullable: false },
      { name: "followed_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "notifications_enabled", type: "TEXT", nullable: false, defaultValue: "'true'" }
    ];
    COMMENTS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "user_id", type: "TEXT", nullable: false },
      { name: "series_id", type: "TEXT", nullable: true },
      { name: "chapter_id", type: "TEXT", nullable: true },
      { name: "content", type: "TEXT", nullable: false },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    READING_PROGRESS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "user_id", type: "TEXT", nullable: false },
      { name: "series_id", type: "TEXT", nullable: false },
      { name: "chapter_id", type: "TEXT", nullable: true },
      { name: "last_read_page", type: "INTEGER", nullable: false, defaultValue: "0" },
      { name: "last_read_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    CHAPTERS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "series_id", type: "TEXT", nullable: false },
      { name: "chapter_number", type: "TEXT", nullable: false },
      { name: "title", type: "TEXT", nullable: true },
      { name: "pages", type: "TEXT", nullable: false },
      { name: "total_pages", type: "INTEGER", nullable: false, defaultValue: "0" },
      { name: "is_published", type: "TEXT", nullable: false, defaultValue: "'true'" },
      { name: "uploaded_by", type: "TEXT", nullable: true },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    DMCA_NOTICES_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "full_name", type: "TEXT", nullable: false },
      { name: "email", type: "TEXT", nullable: false },
      { name: "phone", type: "TEXT", nullable: false },
      { name: "copyright_work", type: "TEXT", nullable: false },
      { name: "infringing_url", type: "TEXT", nullable: false },
      { name: "description", type: "TEXT", nullable: true },
      { name: "signature", type: "TEXT", nullable: false },
      { name: "ip_address", type: "TEXT", nullable: true },
      { name: "good_faith_declaration", type: "TEXT", nullable: false },
      { name: "accuracy_declaration", type: "TEXT", nullable: false },
      { name: "status", type: "TEXT", nullable: false, defaultValue: "'pending'" },
      { name: "reviewed_by", type: "TEXT", nullable: true },
      { name: "review_notes", type: "TEXT", nullable: true },
      { name: "reviewed_at", type: "TEXT", nullable: true },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    ADVERTISEMENTS_EXPECTED_COLUMNS = [
      { name: "id", type: "TEXT", nullable: false },
      { name: "title", type: "TEXT", nullable: false },
      { name: "description", type: "TEXT", nullable: true },
      { name: "image_url", type: "TEXT", nullable: false },
      { name: "link_url", type: "TEXT", nullable: false },
      { name: "type", type: "TEXT", nullable: false },
      { name: "placement", type: "TEXT", nullable: false },
      { name: "is_active", type: "TEXT", nullable: false, defaultValue: "'true'" },
      { name: "start_date", type: "TEXT", nullable: true },
      { name: "end_date", type: "TEXT", nullable: true },
      { name: "display_order", type: "INTEGER", nullable: false, defaultValue: "0" },
      { name: "click_count", type: "INTEGER", nullable: false, defaultValue: "0" },
      { name: "impression_count", type: "INTEGER", nullable: false, defaultValue: "0" },
      { name: "created_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" },
      { name: "updated_at", type: "TEXT", nullable: true, defaultValue: "(datetime('now'))" }
    ];
    ({ sqlite: sqliteInstance, db: drizzleDb } = initializeMainDatabase());
    sqlite = sqliteInstance;
    db = drizzleDb;
    DatabaseStorage = class {
      async validateConnection() {
        try {
          await db.select().from(users).limit(1);
          return true;
        } catch (error) {
          console.error("Database connection validation failed:", error);
          return false;
        }
      }
      async getUser(id) {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
      }
      async getUserByUsername(username) {
        if (!username) return void 0;
        const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
        return result[0];
      }
      async getUserByEmail(email) {
        if (!email) return void 0;
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0];
      }
      async createUser(insertUser) {
        const result = await db.insert(users).values(insertUser).returning();
        return result[0];
      }
      // Replit Auth required method
      async upsertUser(userData) {
        const existingUser = await this.getUser(userData.id);
        if (existingUser) {
          const result = await db.update(users).set({
            ...userData,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(users.id, userData.id)).returning();
          return result[0];
        } else {
          const result = await db.insert(users).values({
            ...userData,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).returning();
          return result[0];
        }
      }
      // Admin user management methods
      async getAllUsers() {
        const result = await db.select().from(users);
        return result;
      }
      async updateUser(id, userData) {
        const result = await db.update(users).set({
          ...userData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).where(eq(users.id, id)).returning();
        return result[0];
      }
      async deleteUser(id) {
        const result = await db.delete(users).where(eq(users.id, id)).returning();
        return result.length > 0;
      }
      // Series management methods
      // Helper method to enrich series with chapter data (count and latest chapters)
      async enrichSeriesWithChapterData(seriesList) {
        if (seriesList.length === 0) {
          return [];
        }
        const seriesIds = seriesList.map((s) => s.id);
        const allChaptersResult = await db.select().from(chapters).where(inArray(chapters.seriesId, seriesIds));
        const chaptersBySeriesId = /* @__PURE__ */ new Map();
        for (const chapter of allChaptersResult) {
          if (!chaptersBySeriesId.has(chapter.seriesId)) {
            chaptersBySeriesId.set(chapter.seriesId, []);
          }
          chaptersBySeriesId.get(chapter.seriesId).push({
            ...chapter,
            pages: deserializeJson(chapter.pages)
          });
        }
        for (const [seriesId, chapterList] of Array.from(chaptersBySeriesId.entries())) {
          chapterList.sort((a, b) => {
            const numA = parseFloat(a.chapterNumber) || 0;
            const numB = parseFloat(b.chapterNumber) || 0;
            return numB - numA;
          });
        }
        const allChapterIds = allChaptersResult.map((ch) => ch.id);
        const accessControlResults = allChapterIds.length > 0 ? await db.select().from(chapterAccessControl).where(inArray(chapterAccessControl.chapterId, allChapterIds)) : [];
        const accessControlMap = /* @__PURE__ */ new Map();
        for (const ac of accessControlResults) {
          accessControlMap.set(ac.chapterId, ac);
        }
        return seriesList.map((s) => {
          const seriesChapters = chaptersBySeriesId.get(s.id) || [];
          const latestChapters = seriesChapters.slice(0, 4);
          return {
            ...s,
            chapterCount: seriesChapters.length,
            latestChapters: latestChapters.map((ch) => {
              const accessControl = accessControlMap.get(ch.id);
              const hasLock = !!(accessControl && accessControl.accessType !== "free" && accessControl.isActive === "true");
              const createdDate = new Date(ch.createdAt);
              const now = /* @__PURE__ */ new Date();
              const daysDiff = (now.getTime() - createdDate.getTime()) / (1e3 * 60 * 60 * 24);
              const isNew = daysDiff <= 7;
              return {
                id: ch.id,
                chapterNumber: ch.chapterNumber,
                title: ch.title,
                createdAt: ch.createdAt,
                totalPages: ch.totalPages,
                hasLock,
                isNew
              };
            })
          };
        });
      }
      async getAllSeries() {
        const result = await db.select().from(series).orderBy(desc(series.createdAt));
        const deserializedSeries = result.map((s) => ({
          ...s,
          genres: deserializeJson(s.genres)
        }));
        return this.enrichSeriesWithChapterData(deserializedSeries);
      }
      async getSeries(id) {
        const result = await db.select().from(series).where(eq(series.id, id)).limit(1);
        if (result[0]) {
          return {
            ...result[0],
            genres: deserializeJson(result[0].genres)
          };
        }
        return void 0;
      }
      async createSeries(seriesData) {
        const processedData = {
          ...seriesData,
          genres: seriesData.genres ? serializeJson(seriesData.genres) : null,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const result = await db.insert(series).values(processedData).returning();
        const returnedSeries = result[0];
        return {
          ...returnedSeries,
          genres: deserializeJson(returnedSeries.genres)
        };
      }
      async updateSeries(id, seriesData) {
        const processedData = {
          ...seriesData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (seriesData.genres !== void 0) {
          processedData.genres = seriesData.genres ? serializeJson(seriesData.genres) : null;
        }
        const result = await db.update(series).set(processedData).where(eq(series.id, id)).returning();
        if (result[0]) {
          return {
            ...result[0],
            genres: deserializeJson(result[0].genres)
          };
        }
        return void 0;
      }
      async deleteSeries(id) {
        const result = await db.delete(series).where(eq(series.id, id)).returning();
        return result.length > 0;
      }
      async getSeriesBySection(section) {
        let whereCondition;
        switch (section) {
          case "featured":
            whereCondition = eq(series.isFeatured, "true");
            break;
          case "trending":
            whereCondition = eq(series.isTrending, "true");
            break;
          case "popularToday":
            whereCondition = eq(series.isPopularToday, "true");
            break;
          case "latestUpdate":
            whereCondition = eq(series.isLatestUpdate, "true");
            break;
          case "pinned":
            whereCondition = eq(series.isPinned, "true");
            break;
          default:
            throw new Error(`Invalid section: ${section}`);
        }
        const result = await db.select().from(series).where(whereCondition).orderBy(desc(series.updatedAt));
        const deserializedSeries = result.map((s) => ({
          ...s,
          genres: deserializeJson(s.genres)
        }));
        return this.enrichSeriesWithChapterData(deserializedSeries);
      }
      async searchSeries(query, filters) {
        if (!query.trim() && !filters) {
          return [];
        }
        let conditions = [];
        if (query.trim()) {
          const searchTerm = `%${query.trim()}%`;
          conditions.push(
            or(
              like(series.title, searchTerm),
              like(series.description, searchTerm),
              like(series.author, searchTerm),
              like(series.artist, searchTerm),
              like(series.genres, searchTerm)
              // Search in genres JSON string
            )
          );
        }
        if (filters?.status) {
          conditions.push(eq(series.status, filters.status));
        }
        if (filters?.type) {
          conditions.push(eq(series.type, filters.type));
        }
        if (filters?.genre && filters.genre !== "all") {
          conditions.push(like(series.genres, `%${filters.genre}%`));
        }
        const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
        const result = await db.select().from(series).where(whereClause).orderBy(desc(series.updatedAt)).limit(50);
        return result.map((s) => ({
          ...s,
          genres: deserializeJson(s.genres)
        }));
      }
      async getSeriesByAuthor(authorName) {
        const result = await db.select().from(series).where(eq(series.author, authorName)).orderBy(desc(series.updatedAt));
        const deserializedSeries = result.map((s) => ({
          ...s,
          genres: deserializeJson(s.genres)
        }));
        return this.enrichSeriesWithChapterData(deserializedSeries);
      }
      async getSeriesByArtist(artistName) {
        const result = await db.select().from(series).where(eq(series.artist, artistName)).orderBy(desc(series.updatedAt));
        const deserializedSeries = result.map((s) => ({
          ...s,
          genres: deserializeJson(s.genres)
        }));
        return this.enrichSeriesWithChapterData(deserializedSeries);
      }
      // Chapter management methods
      async getAllChapters() {
        const result = await db.select().from(chapters).orderBy(desc(chapters.createdAt));
        return result.map((c) => ({
          ...c,
          pages: deserializeJson(c.pages)
        }));
      }
      async getChapter(id) {
        const result = await db.select().from(chapters).where(eq(chapters.id, id)).limit(1);
        if (result[0]) {
          return {
            ...result[0],
            pages: deserializeJson(result[0].pages)
          };
        }
        return void 0;
      }
      async getChaptersBySeriesId(seriesId) {
        const result = await db.select().from(chapters).where(eq(chapters.seriesId, seriesId)).orderBy(sql2`CAST(${chapters.chapterNumber} AS REAL) ASC`);
        return result.map((c) => ({
          ...c,
          pages: deserializeJson(c.pages)
        }));
      }
      async checkChapterExists(seriesId, chapterNumber) {
        try {
          const result = await db.select().from(chapters).where(and(
            eq(chapters.seriesId, seriesId),
            eq(chapters.chapterNumber, chapterNumber)
          )).limit(1);
          if (result[0]) {
            return {
              ...result[0],
              pages: deserializeJson(result[0].pages)
            };
          }
          return void 0;
        } catch (error) {
          console.error("Error checking chapter existence:", error);
          throw new Error(`Database error while checking chapter existence: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      async createChapter(chapterData) {
        try {
          const pagesArray = Array.isArray(chapterData.pages) ? chapterData.pages : chapterData.pages ? JSON.parse(chapterData.pages) : [];
          const { totalPages: clientTotalPages, ...cleanedData } = chapterData;
          const processedData = {
            ...cleanedData,
            pages: serializeJson(pagesArray),
            // Ensure pages are properly serialized as JSON string
            totalPages: pagesArray.length,
            // Always server-computed, single source of truth
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          const result = await db.insert(chapters).values(processedData).returning();
          return {
            ...result[0],
            pages: deserializeJson(result[0].pages)
          };
        } catch (error) {
          console.error("Error creating chapter:", error);
          const isConstraintViolation = (
            // Specific SQLite constraint error codes
            error.code === "SQLITE_CONSTRAINT_UNIQUE" || error.code === "SQLITE_CONSTRAINT" || error.code === "UNIQUE constraint failed" || // Message pattern matching for unique constraint failures
            error.message?.includes("UNIQUE constraint failed") || error.message?.includes("uniqueSeriesChapter") || error.message?.includes("unique_series_chapter") || // General constraint patterns
            error.message?.toLowerCase().includes("constraint") && (error.message?.toLowerCase().includes("unique") || error.message?.toLowerCase().includes("duplicate")) || // SQLite-specific patterns
            error.message?.includes("chapters.series_id") && error.message?.includes("chapters.chapter_number") || // Error name patterns
            error.name?.includes("SqliteError") && error.message?.toLowerCase().includes("unique")
          );
          if (isConstraintViolation) {
            console.log(`[storage] \u{1F6AB} Unique constraint violation detected: ${error.message}`);
            console.log(`[storage] \u{1F4CA} Attempted to create duplicate: series_id=${chapterData.seriesId}, chapter_number=${chapterData.chapterNumber}`);
            const constraintError = new Error(`Chapter ${chapterData.chapterNumber} already exists for series ${chapterData.seriesId}`);
            constraintError.code = "DUPLICATE_CHAPTER";
            constraintError.statusCode = 409;
            constraintError.details = {
              seriesId: chapterData.seriesId,
              chapterNumber: chapterData.chapterNumber,
              constraint: "unique_series_chapter",
              action: "Please choose a different chapter number or update the existing chapter",
              originalError: {
                code: error.code,
                message: error.message,
                name: error.name
              }
            };
            console.log(`[storage] \u{1F50D} Original constraint error details:`, {
              code: error.code,
              message: error.message,
              name: error.name,
              stack: error.stack?.split("\n")[0]
              // Just first line of stack
            });
            throw constraintError;
          }
          console.error(`[storage] \u274C Unexpected error creating chapter:`, {
            code: error.code,
            message: error.message,
            name: error.name,
            seriesId: chapterData.seriesId,
            chapterNumber: chapterData.chapterNumber
          });
          throw error;
        }
      }
      async updateChapter(id, chapterData) {
        const processedData = {
          ...chapterData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (chapterData.pages !== void 0) {
          const pagesArray = Array.isArray(chapterData.pages) ? chapterData.pages : chapterData.pages ? JSON.parse(chapterData.pages) : [];
          delete processedData.totalPages;
          processedData.totalPages = pagesArray.length;
        } else {
          delete processedData.totalPages;
        }
        const result = await db.update(chapters).set(processedData).where(eq(chapters.id, id)).returning();
        if (result[0]) {
          return {
            ...result[0],
            pages: deserializeJson(result[0].pages)
          };
        }
        return void 0;
      }
      async deleteChapter(id) {
        const result = await db.delete(chapters).where(eq(chapters.id, id)).returning();
        return result.length > 0;
      }
      async deleteChaptersBySeriesId(seriesId) {
        const result = await db.delete(chapters).where(eq(chapters.seriesId, seriesId)).returning();
        return result.length > 0;
      }
      // Get site statistics for admin dashboard
      async getSiteStats() {
        try {
          const [userCount, seriesCount] = await Promise.all([
            db.select({ count: sql2`cast(count(*) as int)` }).from(users),
            db.select({ count: sql2`cast(count(*) as int)` }).from(series)
          ]);
          return {
            totalUsers: Number(userCount[0]?.count || 0),
            totalSeries: Number(seriesCount[0]?.count || 0),
            activeReaders: 0,
            // Will need session tracking to implement this
            dailyViews: 0
            // Will need view tracking to implement this
          };
        } catch (error) {
          console.error("Error fetching site stats:", error);
          return {
            totalUsers: 0,
            totalSeries: 0,
            activeReaders: 0,
            dailyViews: 0
          };
        }
      }
      // Get recent series for admin dashboard preview
      async getRecentSeries(limit = 6) {
        try {
          const validLimit = Math.max(1, Math.min(24, limit));
          const result = await db.select().from(series).orderBy(desc(series.createdAt)).limit(validLimit);
          return result.map((s) => ({
            ...s,
            genres: deserializeJson(s.genres)
          }));
        } catch (error) {
          console.error("Error fetching recent series:", error);
          throw error;
        }
      }
      // Update user role
      async updateUserRole(id, role) {
        try {
          const result = await db.update(users).set({
            role,
            // Also update isAdmin for backward compatibility
            isAdmin: role === "admin" || role === "owner" ? "true" : "false",
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(users.id, id)).returning();
          return result[0];
        } catch (error) {
          console.error("Error updating user role:", error);
          return void 0;
        }
      }
      // Get user by role (for owner role validation)
      async getUserByRole(role) {
        try {
          const result = await db.select().from(users).where(eq(users.role, role)).limit(1);
          return result[0];
        } catch (error) {
          console.error("Error fetching user by role:", error);
          return void 0;
        }
      }
      // Get user by ID (for role validation and authorization)
      async getUserById(id) {
        try {
          const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
          return result[0];
        } catch (error) {
          console.error("Error fetching user by id:", error);
          return void 0;
        }
      }
      // Verify unique constraints are properly enforced
      async verifyUniqueConstraints() {
        try {
          console.log("[verification] \u{1F50D} Verifying database unique constraints...");
          const indexes = sqlite.prepare(`PRAGMA index_list('chapters')`).all();
          const uniqueIndexes = indexes.filter((index2) => index2.unique === 1);
          console.log(`[verification] Found ${uniqueIndexes.length} unique indexes:`, uniqueIndexes.map((i) => i.name));
          const hasUniqueConstraint = uniqueIndexes.some(
            (index2) => index2.name === "unique_series_chapter" || index2.name === "sqlite_autoindex_chapters_1" || index2.name.includes("unique") && index2.name.includes("series") && index2.name.includes("chapter")
          );
          if (!hasUniqueConstraint) {
            return {
              isValid: false,
              details: {
                error: "No unique constraint found on chapters(series_id, chapter_number)",
                foundIndexes: uniqueIndexes,
                criticalIssue: "Database allows duplicate chapters!"
              }
            };
          }
          const constraintIndex = uniqueIndexes.find(
            (index2) => index2.name === "unique_series_chapter" || index2.name === "sqlite_autoindex_chapters_1" || index2.name.includes("unique") && index2.name.includes("series") && index2.name.includes("chapter")
          );
          const indexInfo = sqlite.prepare(`PRAGMA index_info('${constraintIndex.name}')`).all();
          const columnNames = indexInfo.map((col) => col.name).sort();
          const expectedColumns = ["series_id", "chapter_number"].sort();
          if (JSON.stringify(columnNames) !== JSON.stringify(expectedColumns)) {
            return {
              isValid: false,
              details: {
                error: "Unique constraint exists but covers wrong columns",
                expectedColumns,
                actualColumns: columnNames,
                indexName: constraintIndex.name
              }
            };
          }
          console.log(`[verification] \u2705 Unique constraint verified: ${constraintIndex.name} covers ${columnNames.join(", ")}`);
          return {
            isValid: true,
            details: {
              constraintName: constraintIndex.name,
              coveredColumns: columnNames,
              allUniqueIndexes: uniqueIndexes.map((i) => ({
                name: i.name,
                origin: i.origin
              })),
              message: "Unique constraint properly enforced on chapters(series_id, chapter_number)"
            }
          };
        } catch (error) {
          console.error("[verification] \u274C Error verifying unique constraints:", error);
          return {
            isValid: false,
            details: {
              error: "Failed to verify unique constraints",
              exception: error.message,
              criticalIssue: "Cannot verify database safety!"
            }
          };
        }
      }
      // Initialize owner role - assign to first admin if no owner exists
      async initializeOwnerRole() {
        try {
          const existingOwner = await this.getUserByRole("owner");
          if (existingOwner) {
            console.log("[owner-init] \u2705 Owner role already exists:", existingOwner.username);
            return;
          }
          const firstAdmin = await db.select().from(users).where(eq(users.isAdmin, "true")).orderBy(asc(users.createdAt)).limit(1);
          if (firstAdmin.length === 0) {
            console.log("[owner-init] \u26A0\uFE0F No admin users found to promote to owner");
            return;
          }
          const adminUser = firstAdmin[0];
          await db.update(users).set({
            role: "owner",
            isAdmin: "true",
            // Ensure isAdmin remains true
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(users.id, adminUser.id));
          console.log(`[owner-init] \u2705 Promoted admin '${adminUser.username}' to owner role`);
        } catch (error) {
          console.error("[owner-init] \u274C Error initializing owner role:", error);
        }
      }
      async initializeAdIntensity() {
        try {
          const existingLevelSetting = await this.getSetting("system", "ad_intensity_level");
          if (!existingLevelSetting) {
            await this.setSetting(
              "system",
              "ad_intensity_level",
              "2",
              "number",
              "Controls ad quantity per page: 1 (1 ad/page), 2 (multiple ads on big pages), 3 (max ads)",
              true
              // isPublic - so frontend can read it
            );
            console.log("[ad-intensity] \u2705 Ad intensity level initialized to Level 2 (Moderate)");
          } else {
            console.log("[ad-intensity] \u2705 Ad intensity level already configured:", existingLevelSetting.value);
          }
          const existingEnabledSetting = await this.getSetting("system", "ads_enabled");
          if (!existingEnabledSetting) {
            await this.setSetting(
              "system",
              "ads_enabled",
              "true",
              "boolean",
              "Global toggle to enable/disable all advertisements",
              true
              // isPublic - so frontend can read it
            );
            console.log("[ad-intensity] \u2705 Ads enabled status initialized to true (enabled)");
          } else {
            console.log("[ad-intensity] \u2705 Ads enabled status already configured:", existingEnabledSetting.value);
          }
        } catch (error) {
          console.error("[ad-intensity] \u274C Error initializing ad intensity:", error);
        }
      }
      // Settings management methods
      async getAllSettings() {
        try {
          const result = await db.select().from(settings).orderBy(asc(settings.category), asc(settings.key));
          return result.map((setting) => ({
            ...setting,
            isPublic: setting.isPublic === "true"
          }));
        } catch (error) {
          console.error("Error fetching all settings:", error);
          return [];
        }
      }
      async getSettingsByCategory(category) {
        try {
          const result = await db.select().from(settings).where(eq(settings.category, category)).orderBy(asc(settings.key));
          return result.map((setting) => ({
            ...setting,
            isPublic: setting.isPublic === "true"
          }));
        } catch (error) {
          console.error("Error fetching settings by category:", error);
          return [];
        }
      }
      async getSetting(category, key) {
        try {
          const result = await db.select().from(settings).where(and(
            eq(settings.category, category),
            eq(settings.key, key)
          )).limit(1);
          if (result[0]) {
            return {
              ...result[0],
              isPublic: result[0].isPublic === "true"
            };
          }
          return void 0;
        } catch (error) {
          console.error("Error fetching setting:", error);
          return void 0;
        }
      }
      async setSetting(category, key, value, type = "string", description, isPublic = false) {
        try {
          const existingSetting = await this.getSetting(category, key);
          if (existingSetting) {
            const result = await db.update(settings).set({
              value,
              type,
              description,
              isPublic: isPublic ? "true" : "false",
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }).where(eq(settings.id, existingSetting.id)).returning();
            return {
              ...result[0],
              isPublic: result[0].isPublic === "true"
            };
          } else {
            const result = await db.insert(settings).values({
              category,
              key,
              value,
              type,
              description,
              isPublic: isPublic ? "true" : "false",
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }).returning();
            return {
              ...result[0],
              isPublic: result[0].isPublic === "true"
            };
          }
        } catch (error) {
          console.error("Error setting value:", error);
          throw error;
        }
      }
      async updateSetting(id, settingData) {
        try {
          const processedData = {
            ...settingData,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          if (settingData.isPublic !== void 0) {
            processedData.isPublic = settingData.isPublic ? "true" : "false";
          }
          const result = await db.update(settings).set(processedData).where(eq(settings.id, id)).returning();
          if (result[0]) {
            return {
              ...result[0],
              isPublic: result[0].isPublic === "true"
            };
          }
          return void 0;
        } catch (error) {
          console.error("Error updating setting:", error);
          return void 0;
        }
      }
      async deleteSetting(id) {
        try {
          const result = await db.delete(settings).where(eq(settings.id, id)).returning();
          return result.length > 0;
        } catch (error) {
          console.error("Error deleting setting:", error);
          return false;
        }
      }
      async addToLibrary(userId, seriesId, status = "reading") {
        try {
          const result = await db.insert(userLibrary).values({
            userId,
            seriesId,
            status,
            addedAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).returning();
          return result[0];
        } catch (error) {
          if (error.message?.includes("UNIQUE constraint failed")) {
            throw new Error("Series is already in your library");
          }
          console.error("Error adding to library:", error);
          throw error;
        }
      }
      async updateLibraryStatus(userId, seriesId, status) {
        try {
          const result = await db.update(userLibrary).set({
            status,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).where(and(
            eq(userLibrary.userId, userId),
            eq(userLibrary.seriesId, seriesId)
          )).returning();
          return result[0];
        } catch (error) {
          console.error("Error updating library status:", error);
          return void 0;
        }
      }
      async removeFromLibrary(userId, seriesId) {
        try {
          const result = await db.delete(userLibrary).where(and(
            eq(userLibrary.userId, userId),
            eq(userLibrary.seriesId, seriesId)
          )).returning();
          return result.length > 0;
        } catch (error) {
          console.error("Error removing from library:", error);
          return false;
        }
      }
      async getUserLibrary(userId) {
        try {
          const result = await db.select({
            id: userLibrary.id,
            userId: userLibrary.userId,
            seriesId: userLibrary.seriesId,
            status: userLibrary.status,
            addedAt: userLibrary.addedAt,
            updatedAt: userLibrary.updatedAt,
            series
          }).from(userLibrary).innerJoin(series, eq(userLibrary.seriesId, series.id)).where(eq(userLibrary.userId, userId)).orderBy(desc(userLibrary.addedAt));
          return result.map((row) => ({
            id: row.id,
            userId: row.userId,
            seriesId: row.seriesId,
            status: row.status,
            addedAt: row.addedAt,
            updatedAt: row.updatedAt,
            series: row.series
          }));
        } catch (error) {
          console.error("Error fetching user library:", error);
          return [];
        }
      }
      async isInLibrary(userId, seriesId) {
        try {
          const result = await db.select().from(userLibrary).where(and(
            eq(userLibrary.userId, userId),
            eq(userLibrary.seriesId, seriesId)
          )).limit(1);
          return result.length > 0;
        } catch (error) {
          console.error("Error checking library status:", error);
          return false;
        }
      }
      async followSeries(userId, seriesId, notificationsEnabled = true) {
        try {
          const result = await db.insert(userFollows).values({
            userId,
            seriesId,
            followedAt: (/* @__PURE__ */ new Date()).toISOString(),
            notificationsEnabled: notificationsEnabled ? "true" : "false"
          }).returning();
          const follow = result[0];
          return {
            ...follow,
            notificationsEnabled: follow.notificationsEnabled === "true"
          };
        } catch (error) {
          if (error.message?.includes("UNIQUE constraint failed")) {
            throw new Error("You are already following this series");
          }
          console.error("Error following series:", error);
          throw error;
        }
      }
      async unfollowSeries(userId, seriesId) {
        try {
          const result = await db.delete(userFollows).where(and(
            eq(userFollows.userId, userId),
            eq(userFollows.seriesId, seriesId)
          )).returning();
          return result.length > 0;
        } catch (error) {
          console.error("Error unfollowing series:", error);
          return false;
        }
      }
      async getUserFollows(userId) {
        try {
          const result = await db.select({
            id: userFollows.id,
            userId: userFollows.userId,
            seriesId: userFollows.seriesId,
            followedAt: userFollows.followedAt,
            notificationsEnabled: userFollows.notificationsEnabled,
            series
          }).from(userFollows).innerJoin(series, eq(userFollows.seriesId, series.id)).where(eq(userFollows.userId, userId)).orderBy(desc(userFollows.followedAt));
          return result.map((row) => ({
            id: row.id,
            userId: row.userId,
            seriesId: row.seriesId,
            followedAt: row.followedAt,
            notificationsEnabled: row.notificationsEnabled === "true",
            series: row.series
          }));
        } catch (error) {
          console.error("Error fetching user follows:", error);
          return [];
        }
      }
      async isFollowing(userId, seriesId) {
        try {
          const result = await db.select().from(userFollows).where(and(
            eq(userFollows.userId, userId),
            eq(userFollows.seriesId, seriesId)
          )).limit(1);
          if (!result[0]) {
            return { isFollowing: false };
          }
          return {
            isFollowing: true,
            notificationsEnabled: result[0].notificationsEnabled === "true"
          };
        } catch (error) {
          console.error("Error checking follow status:", error);
          return { isFollowing: false };
        }
      }
      async updateFollowNotifications(userId, seriesId, enabled) {
        try {
          const result = await db.update(userFollows).set({
            notificationsEnabled: enabled ? "true" : "false"
          }).where(and(
            eq(userFollows.userId, userId),
            eq(userFollows.seriesId, seriesId)
          )).returning();
          if (!result[0]) return void 0;
          const follow = result[0];
          return {
            ...follow,
            notificationsEnabled: follow.notificationsEnabled === "true"
          };
        } catch (error) {
          console.error("Error updating follow notifications:", error);
          return void 0;
        }
      }
      async getSeriesFollowerCount(seriesId) {
        try {
          const result = await db.select({ count: sql2`count(*)` }).from(userFollows).where(eq(userFollows.seriesId, seriesId));
          return result[0]?.count || 0;
        } catch (error) {
          console.error("Error getting follower count:", error);
          return 0;
        }
      }
      async createComment(commentData) {
        const id = crypto.randomUUID();
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const newComment = await db.insert(comments).values({
          id,
          userId: commentData.userId,
          seriesId: commentData.seriesId || null,
          chapterId: commentData.chapterId || null,
          content: commentData.content,
          createdAt: now,
          updatedAt: now
        }).returning();
        const result = await db.select({
          id: comments.id,
          userId: comments.userId,
          seriesId: comments.seriesId,
          chapterId: comments.chapterId,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          username: users.username,
          profilePicture: users.profilePicture,
          profileImageUrl: users.profileImageUrl
        }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.id, id));
        const comment = result[0];
        return {
          id: comment.id,
          userId: comment.userId,
          seriesId: comment.seriesId,
          chapterId: comment.chapterId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          user: {
            id: comment.userId,
            username: comment.username,
            profilePicture: comment.profilePicture,
            profileImageUrl: comment.profileImageUrl
          }
        };
      }
      async updateComment(id, content) {
        const now = (/* @__PURE__ */ new Date()).toISOString();
        await db.update(comments).set({ content, updatedAt: now }).where(eq(comments.id, id));
        const result = await db.select({
          id: comments.id,
          userId: comments.userId,
          seriesId: comments.seriesId,
          chapterId: comments.chapterId,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          username: users.username,
          profilePicture: users.profilePicture,
          profileImageUrl: users.profileImageUrl
        }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.id, id));
        if (result.length === 0) return void 0;
        const comment = result[0];
        return {
          id: comment.id,
          userId: comment.userId,
          seriesId: comment.seriesId,
          chapterId: comment.chapterId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          user: {
            id: comment.userId,
            username: comment.username,
            profilePicture: comment.profilePicture,
            profileImageUrl: comment.profileImageUrl
          }
        };
      }
      async deleteComment(id) {
        try {
          await db.delete(comments).where(eq(comments.id, id));
          return true;
        } catch (error) {
          console.error("Error deleting comment:", error);
          return false;
        }
      }
      async getCommentsBySeriesId(seriesId) {
        const results = await db.select({
          id: comments.id,
          userId: comments.userId,
          seriesId: comments.seriesId,
          chapterId: comments.chapterId,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          username: users.username,
          profilePicture: users.profilePicture,
          profileImageUrl: users.profileImageUrl
        }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.seriesId, seriesId)).orderBy(desc(comments.createdAt));
        return results.map((comment) => ({
          id: comment.id,
          userId: comment.userId,
          seriesId: comment.seriesId,
          chapterId: comment.chapterId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          user: {
            id: comment.userId,
            username: comment.username,
            profilePicture: comment.profilePicture,
            profileImageUrl: comment.profileImageUrl
          }
        }));
      }
      async getCommentsByChapterId(chapterId) {
        const results = await db.select({
          id: comments.id,
          userId: comments.userId,
          seriesId: comments.seriesId,
          chapterId: comments.chapterId,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          username: users.username,
          profilePicture: users.profilePicture,
          profileImageUrl: users.profileImageUrl
        }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.chapterId, chapterId)).orderBy(desc(comments.createdAt));
        return results.map((comment) => ({
          id: comment.id,
          userId: comment.userId,
          seriesId: comment.seriesId,
          chapterId: comment.chapterId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          user: {
            id: comment.userId,
            username: comment.username,
            profilePicture: comment.profilePicture,
            profileImageUrl: comment.profileImageUrl
          }
        }));
      }
      async getUserComment(userId, seriesId, chapterId) {
        const baseQuery = db.select({
          id: comments.id,
          userId: comments.userId,
          seriesId: comments.seriesId,
          chapterId: comments.chapterId,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          username: users.username,
          profilePicture: users.profilePicture,
          profileImageUrl: users.profileImageUrl
        }).from(comments).leftJoin(users, eq(comments.userId, users.id));
        let results;
        if (seriesId) {
          results = await baseQuery.where(and(
            eq(comments.userId, userId),
            eq(comments.seriesId, seriesId)
          )).limit(1);
        } else if (chapterId) {
          results = await baseQuery.where(and(
            eq(comments.userId, userId),
            eq(comments.chapterId, chapterId)
          )).limit(1);
        } else {
          results = await baseQuery.where(eq(comments.userId, userId)).limit(1);
        }
        if (results.length === 0) return void 0;
        const comment = results[0];
        return {
          id: comment.id,
          userId: comment.userId,
          seriesId: comment.seriesId,
          chapterId: comment.chapterId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          user: {
            id: comment.userId,
            username: comment.username,
            profilePicture: comment.profilePicture,
            profileImageUrl: comment.profileImageUrl
          }
        };
      }
      async saveReadingProgress(userId, seriesId, chapterId, lastReadPage) {
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const existing = await db.select().from(readingProgress).where(and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.seriesId, seriesId)
        )).limit(1);
        if (existing.length > 0) {
          const updated = await db.update(readingProgress).set({
            chapterId,
            lastReadPage,
            lastReadAt: now,
            updatedAt: now
          }).where(and(
            eq(readingProgress.userId, userId),
            eq(readingProgress.seriesId, seriesId)
          )).returning();
          return updated[0];
        } else {
          const id = crypto.randomUUID();
          const inserted = await db.insert(readingProgress).values({
            id,
            userId,
            seriesId,
            chapterId,
            lastReadPage,
            lastReadAt: now,
            createdAt: now,
            updatedAt: now
          }).returning();
          return inserted[0];
        }
      }
      async getReadingProgress(userId, seriesId) {
        const results = await db.select().from(readingProgress).where(and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.seriesId, seriesId)
        )).limit(1);
        return results.length > 0 ? results[0] : void 0;
      }
      async getUserReadingProgress(userId) {
        const results = await db.select({
          id: readingProgress.id,
          userId: readingProgress.userId,
          seriesId: readingProgress.seriesId,
          chapterId: readingProgress.chapterId,
          lastReadPage: readingProgress.lastReadPage,
          lastReadAt: readingProgress.lastReadAt,
          createdAt: readingProgress.createdAt,
          updatedAt: readingProgress.updatedAt,
          seriesData: series,
          chapterData: chapters
        }).from(readingProgress).leftJoin(series, eq(readingProgress.seriesId, series.id)).leftJoin(chapters, eq(readingProgress.chapterId, chapters.id)).where(eq(readingProgress.userId, userId)).orderBy(desc(readingProgress.lastReadAt));
        return results.map((result) => ({
          id: result.id,
          userId: result.userId,
          seriesId: result.seriesId,
          chapterId: result.chapterId,
          chapterNumber: result.chapterData?.chapterNumber || null,
          lastReadPage: result.lastReadPage,
          lastReadAt: result.lastReadAt,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          series: result.seriesData
        }));
      }
      async deleteReadingProgress(userId, seriesId) {
        try {
          await db.delete(readingProgress).where(and(
            eq(readingProgress.userId, userId),
            eq(readingProgress.seriesId, seriesId)
          ));
          return true;
        } catch (error) {
          console.error("Error deleting reading progress:", error);
          return false;
        }
      }
      async createEmailVerificationToken(userId) {
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
        const result = await db.insert(emailVerificationTokens).values({
          userId,
          token,
          expiresAt
        }).returning();
        return result[0];
      }
      async getEmailVerificationToken(token) {
        const result = await db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.token, token)).limit(1);
        return result[0];
      }
      async deleteEmailVerificationToken(token) {
        try {
          await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
          return true;
        } catch (error) {
          console.error("Error deleting email verification token:", error);
          return false;
        }
      }
      async markEmailAsVerified(userId) {
        const result = await db.update(users).set({
          emailVerified: "true",
          emailVerifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).where(eq(users.id, userId)).returning();
        return result[0];
      }
      async createPasswordResetToken(userId) {
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1e3).toISOString();
        const result = await db.insert(passwordResetTokens).values({
          userId,
          token,
          expiresAt,
          used: "false"
        }).returning();
        return result[0];
      }
      async getPasswordResetToken(token) {
        const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
        return result[0];
      }
      async markPasswordResetTokenAsUsed(token) {
        try {
          await db.update(passwordResetTokens).set({ used: "true" }).where(eq(passwordResetTokens.token, token));
          return true;
        } catch (error) {
          console.error("Error marking password reset token as used:", error);
          return false;
        }
      }
      async deletePasswordResetToken(token) {
        try {
          await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
          return true;
        } catch (error) {
          console.error("Error deleting password reset token:", error);
          return false;
        }
      }
      async resetUserPassword(userId, newPasswordHash) {
        const result = await db.update(users).set({
          password: newPasswordHash,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).where(eq(users.id, userId)).returning();
        return result[0];
      }
      async createOrUpdateUserRating(userId, seriesId, rating, review) {
        const existing = await this.getUserRating(userId, seriesId);
        if (existing) {
          const result = await db.update(userRatings).set({
            rating,
            review,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).where(and(
            eq(userRatings.userId, userId),
            eq(userRatings.seriesId, seriesId)
          )).returning();
          return result[0];
        } else {
          const result = await db.insert(userRatings).values({
            userId,
            seriesId,
            rating,
            review
          }).returning();
          return result[0];
        }
      }
      async getUserRating(userId, seriesId) {
        const result = await db.select().from(userRatings).where(and(
          eq(userRatings.userId, userId),
          eq(userRatings.seriesId, seriesId)
        )).limit(1);
        return result[0];
      }
      async getSeriesRatings(seriesId) {
        const results = await db.select({
          id: userRatings.id,
          userId: userRatings.userId,
          seriesId: userRatings.seriesId,
          rating: userRatings.rating,
          review: userRatings.review,
          createdAt: userRatings.createdAt,
          updatedAt: userRatings.updatedAt,
          user: {
            id: users.id,
            username: users.username,
            profilePicture: users.profilePicture,
            profileImageUrl: users.profileImageUrl
          }
        }).from(userRatings).innerJoin(users, eq(userRatings.userId, users.id)).where(eq(userRatings.seriesId, seriesId)).orderBy(desc(userRatings.createdAt));
        return results;
      }
      async deleteUserRating(userId, seriesId) {
        try {
          await db.delete(userRatings).where(and(
            eq(userRatings.userId, userId),
            eq(userRatings.seriesId, seriesId)
          ));
          return true;
        } catch (error) {
          console.error("Error deleting user rating:", error);
          return false;
        }
      }
      async getSeriesAverageRating(seriesId) {
        const result = await db.select({
          avg: sql2`AVG(${userRatings.rating})`
        }).from(userRatings).where(eq(userRatings.seriesId, seriesId));
        return result[0]?.avg || 0;
      }
      async followUser(followerId, followingId) {
        const result = await db.insert(userFollowsUsers).values({
          followerId,
          followingId
        }).returning();
        return result[0];
      }
      async unfollowUser(followerId, followingId) {
        try {
          await db.delete(userFollowsUsers).where(and(
            eq(userFollowsUsers.followerId, followerId),
            eq(userFollowsUsers.followingId, followingId)
          ));
          return true;
        } catch (error) {
          console.error("Error unfollowing user:", error);
          return false;
        }
      }
      async getUserFollowers(userId) {
        const result = await db.select().from(userFollowsUsers).where(eq(userFollowsUsers.followingId, userId)).orderBy(desc(userFollowsUsers.followedAt));
        return result;
      }
      async getUserFollowing(userId) {
        const result = await db.select().from(userFollowsUsers).where(eq(userFollowsUsers.followerId, userId)).orderBy(desc(userFollowsUsers.followedAt));
        return result;
      }
      async isFollowingUser(followerId, followingId) {
        const result = await db.select().from(userFollowsUsers).where(and(
          eq(userFollowsUsers.followerId, followerId),
          eq(userFollowsUsers.followingId, followingId)
        )).limit(1);
        return result.length > 0;
      }
      async getUserCurrencyBalance(userId) {
        const user = await db.select({ currencyBalance: users.currencyBalance }).from(users).where(eq(users.id, userId)).limit(1);
        return user[0]?.currencyBalance ?? 0;
      }
      async getCurrencyTransactions(userId, limit = 50, offset = 0) {
        const transactions = await db.select().from(currencyTransactions).where(eq(currencyTransactions.userId, userId)).orderBy(desc(currencyTransactions.createdAt)).limit(limit).offset(offset);
        return transactions;
      }
      async addCurrencyTransaction(userId, amount, type, description, relatedEntityId) {
        const newTransaction = {
          userId,
          amount,
          type,
          description,
          relatedEntityId
        };
        const result = await db.insert(currencyTransactions).values(newTransaction).returning();
        return result[0];
      }
      async updateUserCurrencyBalance(userId, newBalance) {
        const updated = await db.update(users).set({
          currencyBalance: newBalance,
          updatedAt: sql2`(datetime('now'))`
        }).where(eq(users.id, userId)).returning();
        return updated[0];
      }
      async processCurrencyChange(userId, amount, type, description, relatedEntityId) {
        try {
          const userResult = await db.select({ username: users.username, currencyBalance: users.currencyBalance }).from(users).where(eq(users.id, userId)).limit(1);
          if (!userResult || userResult.length === 0) {
            return { success: false, error: "User not found" };
          }
          const user = userResult[0];
          const currentBalance = user.currencyBalance ?? 0;
          const newBalance = currentBalance + amount;
          console.log(`[BALANCE] User: ${user.username}, Current: ${currentBalance}, Amount: ${amount}, New: ${newBalance}`);
          const result = sqlite.transaction(() => {
            const isAdminOperation = type.includes("admin");
            if (newBalance < 0 && !isAdminOperation) {
              throw new Error("Insufficient currency balance");
            }
            const transactionId = randomBytes(16).toString("hex");
            const now = (/* @__PURE__ */ new Date()).toISOString();
            sqlite.prepare(`
          INSERT INTO currency_transactions (id, user_id, amount, type, description, related_entity_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(transactionId, userId, amount, type, description, relatedEntityId || null, now);
            sqlite.prepare(`
          UPDATE users 
          SET currency_balance = ?, updated_at = datetime('now')
          WHERE id = ?
        `).run(newBalance, userId);
            return { success: true, newBalance };
          })();
          return result;
        } catch (error) {
          console.error("Error processing currency change:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to process currency change"
          };
        }
      }
      async getAllCurrencyTransactions(limit = 100) {
        const result = sqlite.prepare(`
      SELECT 
        ct.id,
        ct.user_id as userId,
        u.username,
        ct.amount,
        ct.type,
        ct.description as reason,
        ct.created_at as createdAt
      FROM currency_transactions ct
      JOIN users u ON ct.user_id = u.id
      ORDER BY ct.created_at DESC
      LIMIT ?
    `).all(limit);
        return result;
      }
      async getCurrencyStats() {
        const distributed = sqlite.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM currency_transactions
      WHERE amount > 0
    `).get();
        const spent = sqlite.prepare(`
      SELECT COALESCE(SUM(ABS(amount)), 0) as total
      FROM currency_transactions
      WHERE amount < 0
    `).get();
        const activeUsers = sqlite.prepare(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM currency_transactions
    `).get();
        return {
          totalDistributed: distributed.total,
          totalSpent: spent.total,
          activeUsers: activeUsers.count
        };
      }
      async getCurrencyPackages(activeOnly = false) {
        let query = db.select().from(currencyPackages);
        if (activeOnly) {
          query = query.where(eq(currencyPackages.isActive, "true"));
        }
        const packages = await query.orderBy(asc(currencyPackages.displayOrder));
        return packages;
      }
      async createCurrencyPackage(data) {
        const result = await db.insert(currencyPackages).values(data).returning();
        return result[0];
      }
      async updateCurrencyPackage(id, data) {
        const updated = await db.update(currencyPackages).set({
          ...data,
          updatedAt: sql2`(datetime('now'))`
        }).where(eq(currencyPackages.id, id)).returning();
        return updated[0];
      }
      async deleteCurrencyPackage(id) {
        try {
          await db.delete(currencyPackages).where(eq(currencyPackages.id, id));
          return true;
        } catch (error) {
          console.error("Error deleting currency package:", error);
          return false;
        }
      }
      async createUserPurchase(data) {
        const result = await db.insert(userPurchases).values(data).returning();
        return result[0];
      }
      async getUserPurchases(userId) {
        const purchases = await db.select().from(userPurchases).where(eq(userPurchases.userId, userId)).orderBy(desc(userPurchases.createdAt));
        return purchases;
      }
      async getPurchaseByTransactionId(transactionId) {
        const purchase = await db.select().from(userPurchases).where(eq(userPurchases.transactionId, transactionId)).limit(1);
        return purchase[0];
      }
      // ========== REVENUE ANALYTICS IMPLEMENTATIONS ==========
      async getTotalRevenue(startDate, endDate) {
        try {
          const whereConditions = [eq(userPurchases.status, "completed")];
          if (startDate && endDate) {
            whereConditions.push(gte(userPurchases.createdAt, startDate));
            whereConditions.push(lte(userPurchases.createdAt, endDate));
          }
          const purchases = await db.select({ amount: userPurchases.amountPaid }).from(userPurchases).where(and(...whereConditions)).all();
          const total = purchases.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
          return Math.round(total * 100) / 100;
        } catch (error) {
          console.error("Error getting total revenue:", error);
          return 0;
        }
      }
      async getMonthlyRevenue(month) {
        try {
          const targetMonth = month || (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
          const startOfMonth = `${targetMonth}-01`;
          const endOfMonth = new Date(new Date(startOfMonth).getFullYear(), new Date(startOfMonth).getMonth() + 1, 0).toISOString();
          return await this.getTotalRevenue(startOfMonth, endOfMonth);
        } catch (error) {
          console.error("Error getting monthly revenue:", error);
          return 0;
        }
      }
      async getRevenueByType(startDate, endDate) {
        try {
          const whereConditions = [eq(userPurchases.status, "completed")];
          if (startDate && endDate) {
            whereConditions.push(gte(userPurchases.createdAt, startDate));
            whereConditions.push(lte(userPurchases.createdAt, endDate));
          }
          const purchases = await db.select().from(userPurchases).where(and(...whereConditions)).all();
          let subscriptionRevenue = 0;
          let coinSalesRevenue = 0;
          let flashSalesRevenue = 0;
          for (const purchase of purchases) {
            const amount = parseFloat(purchase.amountPaid || "0");
            if (purchase.paymentProvider === "stripe_subscription") {
              subscriptionRevenue += amount;
            } else if (purchase.paymentProvider === "flash_sale") {
              flashSalesRevenue += amount;
            } else {
              coinSalesRevenue += amount;
            }
          }
          return {
            subscriptionRevenue: Math.round(subscriptionRevenue * 100) / 100,
            coinSalesRevenue: Math.round(coinSalesRevenue * 100) / 100,
            flashSalesRevenue: Math.round(flashSalesRevenue * 100) / 100
          };
        } catch (error) {
          console.error("Error getting revenue by type:", error);
          return { subscriptionRevenue: 0, coinSalesRevenue: 0, flashSalesRevenue: 0 };
        }
      }
      async getRevenueGrowth(currentStart, currentEnd, previousStart, previousEnd) {
        try {
          const currentRevenue = await this.getTotalRevenue(currentStart, currentEnd);
          const previousRevenue = await this.getTotalRevenue(previousStart, previousEnd);
          if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
          const growth = (currentRevenue - previousRevenue) / previousRevenue * 100;
          return Math.round(growth * 10) / 10;
        } catch (error) {
          console.error("Error calculating revenue growth:", error);
          return 0;
        }
      }
      async getTopSellingPackages(limit = 10, startDate, endDate) {
        try {
          const whereConditions = [eq(userPurchases.status, "completed")];
          if (startDate && endDate) {
            whereConditions.push(gte(userPurchases.createdAt, startDate));
            whereConditions.push(lte(userPurchases.createdAt, endDate));
          }
          const purchases = await db.select().from(userPurchases).where(and(...whereConditions)).all();
          const packageStats = /* @__PURE__ */ new Map();
          for (const purchase of purchases) {
            if (!purchase.packageId) continue;
            const key = purchase.packageId;
            const existing = packageStats.get(key);
            const amount = parseFloat(purchase.amountPaid || "0");
            if (existing) {
              existing.totalSales++;
              existing.revenue += amount;
            } else {
              const pkg = await this.getCurrencyPackages(false).then((pkgs) => pkgs.find((p) => p.id === purchase.packageId));
              packageStats.set(key, {
                id: purchase.packageId,
                name: pkg?.name || "Unknown Package",
                type: purchase.paymentProvider === "stripe_subscription" ? "subscription" : "coin_package",
                totalSales: 1,
                revenue: amount
              });
            }
          }
          return Array.from(packageStats.values()).sort((a, b) => b.totalSales - a.totalSales).slice(0, limit).map((pkg) => ({
            ...pkg,
            revenue: pkg.revenue.toFixed(2)
          }));
        } catch (error) {
          console.error("Error getting top selling packages:", error);
          return [];
        }
      }
      async getRevenueHistory(startDate, endDate, interval = "daily") {
        try {
          const whereConditions = [eq(userPurchases.status, "completed")];
          if (startDate && endDate) {
            whereConditions.push(gte(userPurchases.createdAt, startDate));
            whereConditions.push(lte(userPurchases.createdAt, endDate));
          }
          const purchases = await db.select().from(userPurchases).where(and(...whereConditions)).all();
          const revenueByDate = /* @__PURE__ */ new Map();
          for (const purchase of purchases) {
            const date = new Date(purchase.createdAt);
            let dateKey;
            if (interval === "monthly") {
              dateKey = date.toISOString().substring(0, 7);
            } else {
              dateKey = date.toISOString().substring(0, 10);
            }
            const amount = parseFloat(purchase.amountPaid || "0");
            revenueByDate.set(dateKey, (revenueByDate.get(dateKey) || 0) + amount);
          }
          return Array.from(revenueByDate.entries()).map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 })).sort((a, b) => a.date.localeCompare(b.date));
        } catch (error) {
          console.error("Error getting revenue history:", error);
          return [];
        }
      }
      async getConversionRate(startDate, endDate) {
        try {
          const whereConditions = [eq(userPurchases.status, "completed")];
          if (startDate && endDate) {
            whereConditions.push(gte(userPurchases.createdAt, startDate));
            whereConditions.push(lte(userPurchases.createdAt, endDate));
          }
          const purchases = await db.select({ userId: userPurchases.userId }).from(userPurchases).where(and(...whereConditions)).all();
          const uniqueBuyers = new Set(purchases.map((p) => p.userId)).size;
          const stats = await this.getCurrencyStats();
          const totalUsers = stats.activeUsers || 1;
          const conversionRate = uniqueBuyers / totalUsers * 100;
          return Math.round(conversionRate * 10) / 10;
        } catch (error) {
          console.error("Error calculating conversion rate:", error);
          return 0;
        }
      }
      async getAverageOrderValue(startDate, endDate) {
        try {
          const whereConditions = [eq(userPurchases.status, "completed")];
          if (startDate && endDate) {
            whereConditions.push(gte(userPurchases.createdAt, startDate));
            whereConditions.push(lte(userPurchases.createdAt, endDate));
          }
          const purchases = await db.select({ amount: userPurchases.amountPaid }).from(userPurchases).where(and(...whereConditions)).all();
          if (purchases.length === 0) return 0;
          const total = purchases.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
          const average = total / purchases.length;
          return Math.round(average * 100) / 100;
        } catch (error) {
          console.error("Error calculating average order value:", error);
          return 0;
        }
      }
      async getActiveSubscriptionsCount() {
        try {
          const subscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.status, "active")).all();
          return subscriptions.length;
        } catch (error) {
          console.error("Error getting active subscriptions count:", error);
          return 0;
        }
      }
      async getMRR() {
        try {
          const activeSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.status, "active")).all();
          let mrr = 0;
          for (const sub of activeSubscriptions) {
            if (!sub.packageId) continue;
            const pkg = await this.getSubscriptionPackageById(sub.packageId);
            if (pkg && pkg.priceUSD) {
              const price = parseFloat(pkg.priceUSD);
              if (pkg.billingCycle === "yearly") {
                mrr += price / 12;
              } else {
                mrr += price;
              }
            }
          }
          return Math.round(mrr * 100) / 100;
        } catch (error) {
          console.error("Error calculating MRR:", error);
          return 0;
        }
      }
      async getAllPurchases(limit = 1e3, offset = 0, status) {
        try {
          let query = db.select({
            purchase: userPurchases,
            username: users.username
          }).from(userPurchases).leftJoin(users, eq(userPurchases.userId, users.id)).orderBy(desc(userPurchases.createdAt)).limit(limit).offset(offset);
          if (status) {
            query = query.where(eq(userPurchases.status, status));
          }
          const results = await query.all();
          return results.map((r) => ({
            ...r.purchase,
            username: r.username || "Unknown"
          }));
        } catch (error) {
          console.error("Error getting all purchases:", error);
          return [];
        }
      }
      async processRefund(purchaseId, adminId, reason) {
        try {
          const purchase = await db.select().from(userPurchases).where(eq(userPurchases.id, purchaseId)).limit(1).then((results) => results[0]);
          if (!purchase) {
            return { success: false, message: "Purchase not found" };
          }
          if (purchase.status === "refunded") {
            return { success: false, message: "Purchase already refunded" };
          }
          if (purchase.status !== "completed") {
            return { success: false, message: "Can only refund completed purchases" };
          }
          await db.update(userPurchases).set({ status: "refunded" }).where(eq(userPurchases.id, purchaseId)).run();
          if (purchase.currencyReceived > 0) {
            await this.processCurrencyChange(
              purchase.userId,
              -purchase.currencyReceived,
              "refund",
              `Refund for purchase ${purchaseId}: ${reason}`,
              purchaseId
            );
          }
          return { success: true, message: "Refund processed successfully" };
        } catch (error) {
          console.error("Error processing refund:", error);
          return { success: false, message: error.message || "Failed to process refund" };
        }
      }
      async getChapterAccessControl(chapterId) {
        const accessControl = await db.select().from(chapterAccessControl).where(eq(chapterAccessControl.chapterId, chapterId)).limit(1);
        return accessControl[0];
      }
      async setChapterAccessControl(chapterId, accessType, unlockCost) {
        const existing = await this.getChapterAccessControl(chapterId);
        if (existing) {
          const updated = await db.update(chapterAccessControl).set({
            accessType,
            unlockCost,
            isActive: "true",
            updatedAt: sql2`(datetime('now'))`
          }).where(eq(chapterAccessControl.chapterId, chapterId)).returning();
          return updated[0];
        } else {
          const inserted = await db.insert(chapterAccessControl).values({
            chapterId,
            accessType,
            unlockCost,
            isActive: "true"
          }).returning();
          return inserted[0];
        }
      }
      async hasUserUnlockedChapter(userId, chapterId) {
        const unlock = await db.select().from(userChapterUnlocks).where(
          and(
            eq(userChapterUnlocks.userId, userId),
            eq(userChapterUnlocks.chapterId, chapterId)
          )
        ).limit(1);
        return unlock.length > 0;
      }
      async unlockChapterForUser(userId, chapterId, costPaid) {
        try {
          return await db.transaction(async (tx) => {
            const chapter = await tx.select().from(chapters).where(eq(chapters.id, chapterId)).limit(1);
            if (!chapter || chapter.length === 0) {
              throw new Error("Chapter not found");
            }
            const accessControl = await tx.select().from(chapterAccessControl).where(eq(chapterAccessControl.chapterId, chapterId)).limit(1);
            if (!accessControl || accessControl.length === 0 || accessControl[0].accessType === "free") {
              throw new Error("Chapter is free or has no access control");
            }
            const alreadyUnlocked = await tx.select().from(userChapterUnlocks).where(
              and(
                eq(userChapterUnlocks.userId, userId),
                eq(userChapterUnlocks.chapterId, chapterId)
              )
            ).limit(1);
            if (alreadyUnlocked.length > 0) {
              throw new Error("Chapter already unlocked");
            }
            const user = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
            if (!user || user.length === 0) {
              throw new Error("User not found");
            }
            const currentBalance = user[0].currencyBalance || 0;
            if (currentBalance < costPaid) {
              throw new Error("Insufficient currency balance");
            }
            const newBalance = currentBalance - costPaid;
            await tx.update(users).set({ currencyBalance: newBalance }).where(eq(users.id, userId));
            await tx.insert(currencyTransactions).values({
              userId,
              amount: -costPaid,
              type: "unlock_chapter",
              description: `Unlocked chapter ${chapter[0].chapterNumber}`,
              relatedEntityId: chapterId
            });
            await tx.insert(userChapterUnlocks).values({
              userId,
              chapterId,
              costPaid
            });
            return { success: true, newBalance };
          });
        } catch (error) {
          console.error("Error unlocking chapter:", error);
          return {
            success: false,
            newBalance: 0,
            error: error.message || "Failed to unlock chapter"
          };
        }
      }
      async checkUserChapterAccess(userId, chapterId) {
        try {
          const user = await this.getUser(userId);
          if (!user) {
            return {
              canAccess: false,
              accessType: "unknown",
              reason: "User not found"
            };
          }
          if (user.role === "admin" || user.role === "owner" || user.role === "staff") {
            return {
              canAccess: true,
              accessType: "free",
              reason: "Admin/Staff bypass"
            };
          }
          const accessControl = await this.getChapterAccessControl(chapterId);
          if (!accessControl || accessControl.accessType === "free" || accessControl.isActive === "false") {
            return {
              canAccess: true,
              accessType: "free"
            };
          }
          const isUnlocked = await this.hasUserUnlockedChapter(userId, chapterId);
          if (isUnlocked) {
            return {
              canAccess: true,
              accessType: accessControl.accessType,
              isUnlocked: true
            };
          }
          return {
            canAccess: false,
            accessType: accessControl.accessType,
            unlockCost: accessControl.unlockCost,
            isUnlocked: false,
            reason: `Chapter requires ${accessControl.unlockCost} coins to unlock`
          };
        } catch (error) {
          console.error("Error checking chapter access:", error);
          return {
            canAccess: false,
            accessType: "unknown",
            reason: "Error checking access"
          };
        }
      }
      // Reading Lists operations
      async getReadingLists(userId) {
        try {
          const lists = await db.select().from(readingLists).where(eq(readingLists.userId, userId)).all();
          const listsWithCounts = await Promise.all(lists.map(async (list) => {
            const items = await db.select().from(readingListItems).where(eq(readingListItems.listId, list.id)).all();
            return { ...list, itemCount: items.length };
          }));
          return listsWithCounts;
        } catch (error) {
          console.error("Error getting reading lists:", error);
          return [];
        }
      }
      async getReadingListById(listId) {
        try {
          const [list] = await db.select().from(readingLists).where(eq(readingLists.id, listId)).limit(1).all();
          return list;
        } catch (error) {
          console.error("Error getting reading list:", error);
          return void 0;
        }
      }
      async createReadingList(userId, data) {
        const newList = await db.insert(readingLists).values({
          userId,
          name: data.name,
          description: data.description,
          visibility: data.visibility || "private"
        }).returning().get();
        return newList;
      }
      async updateReadingList(listId, userId, data) {
        try {
          const list = await this.getReadingListById(listId);
          if (!list || list.userId !== userId) return void 0;
          const updated = await db.update(readingLists).set({ ...data, updatedAt: sql2`(datetime('now'))` }).where(eq(readingLists.id, listId)).returning().get();
          return updated;
        } catch (error) {
          console.error("Error updating reading list:", error);
          return void 0;
        }
      }
      async deleteReadingList(listId, userId) {
        try {
          const list = await this.getReadingListById(listId);
          if (!list || list.userId !== userId) return false;
          await db.delete(readingLists).where(eq(readingLists.id, listId)).run();
          return true;
        } catch (error) {
          console.error("Error deleting reading list:", error);
          return false;
        }
      }
      async addToReadingList(listId, seriesId, userId) {
        const list = await this.getReadingListById(listId);
        if (!list || list.userId !== userId) {
          throw new Error("Reading list not found or access denied");
        }
        const existing = await db.select().from(readingListItems).where(and(eq(readingListItems.listId, listId), eq(readingListItems.seriesId, seriesId))).limit(1).all();
        if (existing.length > 0) {
          throw new Error("Series already in reading list");
        }
        const item = await db.insert(readingListItems).values({
          listId,
          seriesId
        }).returning().get();
        return item;
      }
      async removeFromReadingList(listId, seriesId, userId) {
        try {
          const list = await this.getReadingListById(listId);
          if (!list || list.userId !== userId) return false;
          await db.delete(readingListItems).where(and(eq(readingListItems.listId, listId), eq(readingListItems.seriesId, seriesId))).run();
          return true;
        } catch (error) {
          console.error("Error removing from reading list:", error);
          return false;
        }
      }
      async getReadingListItems(listId) {
        try {
          return await db.select().from(readingListItems).where(eq(readingListItems.listId, listId)).all();
        } catch (error) {
          console.error("Error getting reading list items:", error);
          return [];
        }
      }
      async getAllAds() {
        try {
          const ads = await db.select().from(advertisements).orderBy(asc(advertisements.displayOrder), desc(advertisements.createdAt)).all();
          return ads;
        } catch (error) {
          console.error("Error getting all ads:", error);
          return [];
        }
      }
      async getAdById(id) {
        try {
          const ad = await db.select().from(advertisements).where(eq(advertisements.id, id)).get();
          return ad;
        } catch (error) {
          console.error("Error getting ad by id:", error);
          return void 0;
        }
      }
      async getActiveAdsByPlacement(placement, context) {
        try {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const allAds = await db.select().from(advertisements).where(
            and(
              eq(advertisements.isActive, "true"),
              or(
                eq(advertisements.placement, placement),
                eq(advertisements.placement, "all")
              ),
              or(
                and(
                  sql2`${advertisements.startDate} IS NOT NULL`,
                  sql2`${advertisements.endDate} IS NOT NULL`,
                  sql2`${advertisements.startDate} <= ${now}`,
                  sql2`${advertisements.endDate} >= ${now}`
                ),
                and(
                  sql2`${advertisements.startDate} IS NULL`,
                  sql2`${advertisements.endDate} IS NULL`
                )
              )
            )
          ).orderBy(asc(advertisements.displayOrder), desc(advertisements.createdAt)).all();
          let targetedAds = allAds;
          if (context) {
            targetedAds = allAds.filter((ad) => {
              if (ad.targetCountries) {
                try {
                  const countries = JSON.parse(ad.targetCountries);
                  if (countries.length > 0 && context.userCountry) {
                    if (!countries.includes(context.userCountry)) {
                      return false;
                    }
                  }
                } catch (e) {
                  console.error(`[ads] Skipping ad ${ad.id} - malformed targetCountries JSON:`, e);
                  return false;
                }
              }
              if (ad.targetDeviceTypes) {
                try {
                  const devices = JSON.parse(ad.targetDeviceTypes);
                  if (devices.length > 0) {
                    if (!devices.includes(context.deviceType)) {
                      return false;
                    }
                  }
                } catch (e) {
                  console.error(`[ads] Skipping ad ${ad.id} - malformed targetDeviceTypes JSON:`, e);
                  return false;
                }
              }
              if (ad.targetUserRoles) {
                try {
                  const roles = JSON.parse(ad.targetUserRoles);
                  if (roles.length > 0) {
                    if (!roles.includes(context.userRole)) {
                      return false;
                    }
                  }
                } catch (e) {
                  console.error(`[ads] Skipping ad ${ad.id} - malformed targetUserRoles JSON:`, e);
                  return false;
                }
              }
              if (ad.targetLanguages) {
                try {
                  const languages3 = JSON.parse(ad.targetLanguages);
                  if (languages3.length > 0) {
                    if (!languages3.includes(context.userLanguage)) {
                      return false;
                    }
                  }
                } catch (e) {
                  console.error(`[ads] Skipping ad ${ad.id} - malformed targetLanguages JSON:`, e);
                  return false;
                }
              }
              return true;
            });
          }
          const variantGroups = /* @__PURE__ */ new Map();
          const nonVariantAds = [];
          for (const ad of targetedAds) {
            if (ad.variantGroup) {
              if (!variantGroups.has(ad.variantGroup)) {
                variantGroups.set(ad.variantGroup, []);
              }
              variantGroups.get(ad.variantGroup).push(ad);
            } else {
              nonVariantAds.push(ad);
            }
          }
          const selectedVariants = [];
          for (const [group, variants] of Array.from(variantGroups.entries())) {
            if (variants.length > 0) {
              const randomIndex = Math.floor(Math.random() * variants.length);
              selectedVariants.push(variants[randomIndex]);
            }
          }
          const finalAds = [...nonVariantAds, ...selectedVariants];
          finalAds.sort((a, b) => {
            if (a.displayOrder !== b.displayOrder) {
              return a.displayOrder - b.displayOrder;
            }
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          });
          return finalAds;
        } catch (error) {
          console.error("Error getting active ads by placement:", error);
          return [];
        }
      }
      async createAd(data) {
        try {
          const ad = await db.insert(advertisements).values(data).returning().get();
          return ad;
        } catch (error) {
          console.error("Error creating ad:", error);
          throw new Error("Failed to create advertisement");
        }
      }
      async updateAd(id, data) {
        try {
          const updated = await db.update(advertisements).set({
            ...data,
            updatedAt: sql2`(datetime('now'))`
          }).where(eq(advertisements.id, id)).returning().get();
          return updated;
        } catch (error) {
          console.error("Error updating ad:", error);
          return void 0;
        }
      }
      async deleteAd(id) {
        try {
          await db.delete(advertisements).where(eq(advertisements.id, id)).run();
          return true;
        } catch (error) {
          console.error("Error deleting ad:", error);
          return false;
        }
      }
      async bulkCreateAds(adsData) {
        const success = [];
        const failed = [];
        for (let i = 0; i < adsData.length; i++) {
          try {
            const ad = await db.insert(advertisements).values(adsData[i]).returning().get();
            success.push(ad);
          } catch (error) {
            console.error(`Error creating ad at index ${i}:`, error);
            failed.push({
              index: i,
              error: error?.message || "Failed to create advertisement"
            });
          }
        }
        return { success, failed };
      }
      async bulkUpdateAds(adIds, updates) {
        let successCount = 0;
        let failedCount = 0;
        for (const id of adIds) {
          try {
            const updated = await db.update(advertisements).set({
              ...updates,
              updatedAt: sql2`(datetime('now'))`
            }).where(eq(advertisements.id, id)).returning().get();
            if (updated) {
              successCount++;
            } else {
              failedCount++;
            }
          } catch (error) {
            console.error(`Error updating ad ${id}:`, error);
            failedCount++;
          }
        }
        return { successCount, failedCount };
      }
      async bulkDeleteAds(adIds) {
        let successCount = 0;
        let failedCount = 0;
        for (const id of adIds) {
          try {
            await db.delete(advertisements).where(eq(advertisements.id, id)).run();
            successCount++;
          } catch (error) {
            console.error(`Error deleting ad ${id}:`, error);
            failedCount++;
          }
        }
        return { successCount, failedCount };
      }
      async updateManyAdsStatus(ids, isActive) {
        try {
          const activeValue = isActive ? "true" : "false";
          for (const id of ids) {
            await db.update(advertisements).set({
              isActive: activeValue,
              updatedAt: sql2`(datetime('now'))`
            }).where(eq(advertisements.id, id)).run();
          }
        } catch (error) {
          console.error("Error updating ads status:", error);
          throw error;
        }
      }
      async deleteAdsByIds(ids) {
        try {
          for (const id of ids) {
            await db.delete(advertisements).where(eq(advertisements.id, id)).run();
          }
        } catch (error) {
          console.error("Error deleting ads:", error);
          throw error;
        }
      }
      async insertAdvertisementsBulk(ads) {
        let success = 0;
        const errors = [];
        for (let i = 0; i < ads.length; i++) {
          try {
            const adData = ads[i];
            if (!adData.title || !adData.imageUrl || !adData.linkUrl) {
              if (!adData.title) {
                errors.push({ row: i + 1, field: "title", message: "Title is required" });
              }
              if (!adData.imageUrl) {
                errors.push({ row: i + 1, field: "imageUrl", message: "Image URL is required" });
              }
              if (!adData.linkUrl) {
                errors.push({ row: i + 1, field: "linkUrl", message: "Link URL is required" });
              }
              continue;
            }
            if (adData.startDate && adData.endDate && adData.startDate > adData.endDate) {
              errors.push({
                row: i + 1,
                field: "dates",
                message: "Start date must be before end date"
              });
              continue;
            }
            await db.insert(advertisements).values(adData).run();
            success++;
          } catch (error) {
            console.error(`Error inserting ad at row ${i + 1}:`, error);
            errors.push({
              row: i + 1,
              field: "general",
              message: error?.message || "Failed to insert advertisement"
            });
          }
        }
        return { success, errors };
      }
      async autoUpdateAdSchedules() {
        try {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          let activated = 0;
          let deactivated = 0;
          const scheduledAds = await db.select().from(advertisements).where(
            or(
              sql2`${advertisements.startDate} IS NOT NULL`,
              sql2`${advertisements.endDate} IS NOT NULL`
            )
          ).all();
          for (const ad of scheduledAds) {
            if (ad.startDate && ad.startDate <= now && (!ad.endDate || ad.endDate > now) && ad.isActive === "false") {
              await db.update(advertisements).set({
                isActive: "true",
                updatedAt: sql2`(datetime('now'))`
              }).where(eq(advertisements.id, ad.id)).run();
              activated++;
              console.log(`[ad-scheduler] \u2705 Activated ad: "${ad.title}" (ID: ${ad.id})`);
            }
            if (ad.endDate && ad.endDate <= now && ad.isActive === "true") {
              await db.update(advertisements).set({
                isActive: "false",
                updatedAt: sql2`(datetime('now'))`
              }).where(eq(advertisements.id, ad.id)).run();
              deactivated++;
              console.log(`[ad-scheduler] \u{1F534} Deactivated ad: "${ad.title}" (ID: ${ad.id})`);
            }
          }
          if (activated > 0 || deactivated > 0) {
            console.log(`[ad-scheduler] \u{1F4CA} Schedule update complete: ${activated} activated, ${deactivated} deactivated`);
          }
          return { activated, deactivated };
        } catch (error) {
          console.error("[ad-scheduler] \u274C Error updating ad schedules:", error);
          return { activated: 0, deactivated: 0 };
        }
      }
      async trackAdClick(id) {
        try {
          const ad = await db.select().from(advertisements).where(eq(advertisements.id, id)).get();
          if (!ad) {
            console.error("Ad not found for tracking click:", id);
            return false;
          }
          await db.update(advertisements).set({
            clickCount: sql2`${advertisements.clickCount} + 1`
          }).where(eq(advertisements.id, id)).run();
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const existing = await db.select().from(adPerformanceHistory).where(and(eq(adPerformanceHistory.adId, id), eq(adPerformanceHistory.date, today))).get();
          if (existing) {
            const newClicks = existing.clicks + 1;
            const newCtr = existing.impressions > 0 ? (newClicks / existing.impressions * 100).toFixed(2) : "0.00";
            await db.update(adPerformanceHistory).set({ clicks: newClicks, ctr: newCtr }).where(eq(adPerformanceHistory.id, existing.id)).run();
          } else {
            await db.insert(adPerformanceHistory).values({
              adId: id,
              date: today,
              clicks: 1,
              impressions: 0,
              ctr: "0.00",
              variantName: ad.variantName || null
              // Track variant for A/B testing
            }).run();
          }
          return true;
        } catch (error) {
          console.error("Error tracking ad click:", error);
          return false;
        }
      }
      async trackAdImpression(id) {
        try {
          const ad = await db.select().from(advertisements).where(eq(advertisements.id, id)).get();
          if (!ad) {
            console.error("Ad not found for tracking impression:", id);
            return false;
          }
          await db.update(advertisements).set({
            impressionCount: sql2`${advertisements.impressionCount} + 1`
          }).where(eq(advertisements.id, id)).run();
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const existing = await db.select().from(adPerformanceHistory).where(and(eq(adPerformanceHistory.adId, id), eq(adPerformanceHistory.date, today))).get();
          if (existing) {
            const newImpressions = existing.impressions + 1;
            const newCtr = newImpressions > 0 ? (existing.clicks / newImpressions * 100).toFixed(2) : "0.00";
            await db.update(adPerformanceHistory).set({ impressions: newImpressions, ctr: newCtr }).where(eq(adPerformanceHistory.id, existing.id)).run();
          } else {
            await db.insert(adPerformanceHistory).values({
              adId: id,
              date: today,
              impressions: 1,
              clicks: 0,
              ctr: "0.00",
              variantName: ad.variantName || null
              // Track variant for A/B testing
            }).run();
          }
          return true;
        } catch (error) {
          console.error("Error tracking ad impression:", error);
          return false;
        }
      }
      async getAdAnalyticsOverview(startDate, endDate) {
        try {
          let query = db.select({
            impressions: adPerformanceHistory.impressions,
            clicks: adPerformanceHistory.clicks
          }).from(adPerformanceHistory);
          const conditions = [];
          if (startDate) {
            conditions.push(sql2`${adPerformanceHistory.date} >= ${startDate}`);
          }
          if (endDate) {
            conditions.push(sql2`${adPerformanceHistory.date} <= ${endDate}`);
          }
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
          const results = await query.all();
          const totalImpressions = results.reduce((sum, r) => sum + (r.impressions || 0), 0);
          const totalClicks = results.reduce((sum, r) => sum + (r.clicks || 0), 0);
          const averageCTR = totalImpressions > 0 ? totalClicks / totalImpressions * 100 : 0;
          return {
            totalImpressions,
            totalClicks,
            averageCTR: parseFloat(averageCTR.toFixed(2))
          };
        } catch (error) {
          console.error("Error getting ad analytics overview:", error);
          return { totalImpressions: 0, totalClicks: 0, averageCTR: 0 };
        }
      }
      async getAdPerformanceHistory(startDate, endDate) {
        try {
          let query = db.select({
            date: adPerformanceHistory.date,
            impressions: sql2`SUM(${adPerformanceHistory.impressions})`.as("impressions"),
            clicks: sql2`SUM(${adPerformanceHistory.clicks})`.as("clicks")
          }).from(adPerformanceHistory);
          const conditions = [];
          if (startDate) {
            conditions.push(sql2`${adPerformanceHistory.date} >= ${startDate}`);
          }
          if (endDate) {
            conditions.push(sql2`${adPerformanceHistory.date} <= ${endDate}`);
          }
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
          const results = await query.groupBy(adPerformanceHistory.date).orderBy(asc(adPerformanceHistory.date)).all();
          return results.map((r) => ({
            date: r.date,
            impressions: r.impressions || 0,
            clicks: r.clicks || 0,
            ctr: r.impressions > 0 ? parseFloat((r.clicks / r.impressions * 100).toFixed(2)) : 0
          }));
        } catch (error) {
          console.error("Error getting ad performance history:", error);
          return [];
        }
      }
      async getTopPerformingAds(limit = 5, startDate, endDate) {
        try {
          let query = db.select({
            adId: adPerformanceHistory.adId,
            impressions: sql2`SUM(${adPerformanceHistory.impressions})`.as("impressions"),
            clicks: sql2`SUM(${adPerformanceHistory.clicks})`.as("clicks")
          }).from(adPerformanceHistory);
          const conditions = [];
          if (startDate) {
            conditions.push(sql2`${adPerformanceHistory.date} >= ${startDate}`);
          }
          if (endDate) {
            conditions.push(sql2`${adPerformanceHistory.date} <= ${endDate}`);
          }
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
          const performanceData = await query.groupBy(adPerformanceHistory.adId).all();
          const adsWithCTR = performanceData.map((p) => ({
            adId: p.adId,
            impressions: p.impressions || 0,
            clicks: p.clicks || 0,
            ctr: p.impressions > 0 ? p.clicks / p.impressions * 100 : 0
          })).sort((a, b) => b.ctr - a.ctr).slice(0, limit);
          const adIds = adsWithCTR.map((a) => a.adId);
          if (adIds.length === 0) return [];
          const ads = await db.select().from(advertisements).where(inArray(advertisements.id, adIds)).all();
          const adMap = new Map(ads.map((ad) => [ad.id, ad]));
          return adsWithCTR.map((perf) => {
            const ad = adMap.get(perf.adId);
            if (!ad) return null;
            return {
              id: ad.id,
              title: ad.title,
              type: ad.type,
              placement: ad.placement,
              impressions: perf.impressions,
              clicks: perf.clicks,
              ctr: parseFloat(perf.ctr.toFixed(2))
            };
          }).filter(Boolean);
        } catch (error) {
          console.error("Error getting top performing ads:", error);
          return [];
        }
      }
      async getAdsByVariantGroup(variantGroup) {
        try {
          const ads = await db.select().from(advertisements).where(eq(advertisements.variantGroup, variantGroup)).orderBy(asc(advertisements.variantName)).all();
          return ads;
        } catch (error) {
          console.error("Error getting ads by variant group:", error);
          return [];
        }
      }
      async getVariantComparisonAnalytics(variantGroup, startDate, endDate) {
        try {
          const variantAds = await this.getAdsByVariantGroup(variantGroup);
          if (variantAds.length === 0) return [];
          const adIds = variantAds.map((ad) => ad.id);
          let query = db.select({
            variantName: adPerformanceHistory.variantName,
            adId: adPerformanceHistory.adId,
            impressions: sql2`SUM(${adPerformanceHistory.impressions})`.as("impressions"),
            clicks: sql2`SUM(${adPerformanceHistory.clicks})`.as("clicks")
          }).from(adPerformanceHistory).where(inArray(adPerformanceHistory.adId, adIds));
          const conditions = [inArray(adPerformanceHistory.adId, adIds)];
          if (startDate) {
            conditions.push(sql2`${adPerformanceHistory.date} >= ${startDate}`);
          }
          if (endDate) {
            conditions.push(sql2`${adPerformanceHistory.date} <= ${endDate}`);
          }
          const performanceData = await db.select({
            variantName: adPerformanceHistory.variantName,
            adId: adPerformanceHistory.adId,
            impressions: sql2`SUM(${adPerformanceHistory.impressions})`.as("impressions"),
            clicks: sql2`SUM(${adPerformanceHistory.clicks})`.as("clicks")
          }).from(adPerformanceHistory).where(and(...conditions)).groupBy(adPerformanceHistory.adId, adPerformanceHistory.variantName).all();
          const adMap = new Map(variantAds.map((ad) => [ad.id, ad]));
          const results = performanceData.map((perf) => {
            const ad = adMap.get(perf.adId);
            if (!ad) return null;
            const impressions = perf.impressions || 0;
            const clicks = perf.clicks || 0;
            const ctr = impressions > 0 ? clicks / impressions * 100 : 0;
            return {
              variantName: perf.variantName || ad.variantName || "Unknown",
              impressions,
              clicks,
              ctr: parseFloat(ctr.toFixed(2)),
              adId: ad.id,
              title: ad.title
            };
          }).filter(Boolean);
          for (const ad of variantAds) {
            if (!results.find((r) => r.adId === ad.id)) {
              results.push({
                variantName: ad.variantName || "Unknown",
                impressions: 0,
                clicks: 0,
                ctr: 0,
                adId: ad.id,
                title: ad.title
              });
            }
          }
          return results.sort((a, b) => a.variantName.localeCompare(b.variantName));
        } catch (error) {
          console.error("Error getting variant comparison analytics:", error);
          return [];
        }
      }
      async createVariantGroup(variants, variantGroup) {
        try {
          const createdAds = [];
          for (const variant of variants) {
            const adData = {
              ...variant,
              variantGroup
            };
            const ad = await db.insert(advertisements).values(adData).returning().get();
            createdAds.push(ad);
          }
          return createdAds;
        } catch (error) {
          console.error("Error creating variant group:", error);
          throw new Error("Failed to create variant group");
        }
      }
      async createDmcaNotice(data) {
        const result = await db.insert(dmcaNotices).values(data).returning();
        return result[0];
      }
      async getAllDmcaNotices() {
        const notices = await db.select().from(dmcaNotices).orderBy(desc(dmcaNotices.createdAt));
        return notices;
      }
      async getDmcaNoticeById(id) {
        const notice = await db.select().from(dmcaNotices).where(eq(dmcaNotices.id, id)).limit(1);
        return notice[0];
      }
      async updateDmcaNoticeStatus(id, status, reviewNotes, reviewedBy) {
        const updated = await db.update(dmcaNotices).set({
          status,
          reviewNotes: reviewNotes || null,
          reviewedBy: reviewedBy || null,
          reviewedAt: sql2`(datetime('now'))`,
          updatedAt: sql2`(datetime('now'))`
        }).where(eq(dmcaNotices.id, id)).returning();
        return updated[0];
      }
      // ========== SUBSCRIPTION STORAGE METHODS ==========
      async getSubscriptionPackages(activeOnly = true) {
        try {
          let query = db.select().from(subscriptionPackages);
          if (activeOnly) {
            query = query.where(eq(subscriptionPackages.isActive, "true"));
          }
          return await query.orderBy(subscriptionPackages.displayOrder).all();
        } catch (error) {
          console.error("Error getting subscription packages:", error);
          return [];
        }
      }
      async getSubscriptionPackageById(id) {
        try {
          const [pkg] = await db.select().from(subscriptionPackages).where(eq(subscriptionPackages.id, id)).limit(1).all();
          return pkg;
        } catch (error) {
          console.error("Error getting subscription package:", error);
          return void 0;
        }
      }
      async getUserActiveSubscription(userId) {
        try {
          const [subscription] = await db.select().from(userSubscriptions).where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, "active"))).limit(1).all();
          return subscription;
        } catch (error) {
          console.error("Error getting user subscription:", error);
          return void 0;
        }
      }
      async updateUserStripeCustomerId(userId, stripeCustomerId) {
        try {
          await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId)).run();
        } catch (error) {
          console.error("Error updating Stripe customer ID:", error);
        }
      }
      async activateUserSubscription(data) {
        try {
          await db.insert(userSubscriptions).values({
            userId: data.userId,
            packageId: data.packageId,
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
            status: "active",
            currentPeriodStart: data.currentPeriodStart,
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: "false"
          }).run();
        } catch (error) {
          console.error("Error activating subscription:", error);
        }
      }
      async cancelUserSubscription(subscriptionId) {
        try {
          await db.update(userSubscriptions).set({ cancelAtPeriodEnd: "true", updatedAt: sql2`(datetime('now'))` }).where(eq(userSubscriptions.id, subscriptionId)).run();
        } catch (error) {
          console.error("Error cancelling subscription:", error);
        }
      }
      async expireUserSubscription(stripeSubscriptionId) {
        try {
          await db.update(userSubscriptions).set({ status: "expired", updatedAt: sql2`(datetime('now'))` }).where(eq(userSubscriptions.stripeSubscriptionId, stripeSubscriptionId)).run();
        } catch (error) {
          console.error("Error expiring subscription:", error);
        }
      }
      async updateUserSubscriptionStatus(stripeSubscriptionId, status, cancelAtPeriodEnd) {
        try {
          await db.update(userSubscriptions).set({
            status,
            cancelAtPeriodEnd: cancelAtPeriodEnd ? "true" : "false",
            updatedAt: sql2`(datetime('now'))`
          }).where(eq(userSubscriptions.stripeSubscriptionId, stripeSubscriptionId)).run();
        } catch (error) {
          console.error("Error updating subscription status:", error);
        }
      }
      async recordCurrencyPurchase(data) {
        try {
          await db.insert(userPurchases).values(data).run();
        } catch (error) {
          console.error("Error recording currency purchase:", error);
        }
      }
      // ========== DAILY REWARDS STORAGE METHODS ==========
      async getUserDailyRewardStatus(userId) {
        try {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
          const [todayClaim] = await db.select().from(userDailyClaims).where(and(eq(userDailyClaims.userId, userId), eq(userDailyClaims.claimDate, today))).limit(1).all();
          if (todayClaim) {
            return { canClaim: false, currentDay: todayClaim.day, claimedToday: true };
          }
          const [yesterdayClaim] = await db.select().from(userDailyClaims).where(and(eq(userDailyClaims.userId, userId), eq(userDailyClaims.claimDate, yesterday))).limit(1).all();
          const currentDay = yesterdayClaim ? yesterdayClaim.day + 1 : 1;
          const [nextReward] = await db.select().from(dailyRewards).where(eq(dailyRewards.day, currentDay)).limit(1).all();
          return {
            canClaim: true,
            currentDay,
            claimedToday: false,
            nextReward: nextReward ? nextReward.coinReward : 10
          };
        } catch (error) {
          console.error("Error getting daily reward status:", error);
          return { canClaim: false, currentDay: 1, claimedToday: false };
        }
      }
      async claimDailyReward(userId) {
        try {
          const status = await this.getUserDailyRewardStatus(userId);
          if (!status.canClaim) {
            throw new Error("Already claimed today");
          }
          const [reward] = await db.select().from(dailyRewards).where(eq(dailyRewards.day, status.currentDay)).limit(1).all();
          const coinsEarned = reward ? reward.coinReward : 10;
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          await db.insert(userDailyClaims).values({
            userId,
            claimDate: today,
            day: status.currentDay,
            coinsEarned
          }).run();
          await this.processCurrencyChange(userId, coinsEarned, "daily_reward", `Daily login reward - Day ${status.currentDay}`);
          return { success: true, coinsEarned, day: status.currentDay };
        } catch (error) {
          console.error("Error claiming daily reward:", error);
          throw error;
        }
      }
      // ========== ACHIEVEMENTS STORAGE METHODS ==========
      async getAllAchievements() {
        try {
          return await db.select().from(achievements).orderBy(achievements.displayOrder).all();
        } catch (error) {
          console.error("Error getting achievements:", error);
          return [];
        }
      }
      async getUserAchievementProgress(userId) {
        try {
          const allAchievements = await this.getAllAchievements();
          const earnedAchievements = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId)).all();
          return allAchievements.map((achievement) => {
            const earned = earnedAchievements.find((ua) => ua.achievementId === achievement.id);
            return {
              ...achievement,
              earned: !!earned,
              earnedAt: earned?.earnedAt,
              progress: earned?.progress
            };
          });
        } catch (error) {
          console.error("Error getting achievement progress:", error);
          return [];
        }
      }
      // ========== REFERRAL STORAGE METHODS ==========
      async getUserReferralCode(userId) {
        try {
          const [existing] = await db.select().from(referralCodes).where(eq(referralCodes.userId, userId)).limit(1).all();
          if (existing) return existing;
          const code = `REF${userId.slice(0, 8).toUpperCase()}`;
          const newCode = await db.insert(referralCodes).values({
            userId,
            code,
            uses: 0,
            coinRewardReferrer: 100,
            coinRewardReferred: 50,
            isActive: "true"
          }).returning().get();
          return newCode;
        } catch (error) {
          console.error("Error getting referral code:", error);
          throw error;
        }
      }
      async getUserReferrals(userId) {
        try {
          return await db.select().from(referrals).where(eq(referrals.referrerId, userId)).all();
        } catch (error) {
          console.error("Error getting referrals:", error);
          return [];
        }
      }
      async applyReferralCode(userId, code) {
        try {
          const [referralCode] = await db.select().from(referralCodes).where(and(eq(referralCodes.code, code), eq(referralCodes.isActive, "true"))).limit(1).all();
          if (!referralCode) throw new Error("Invalid referral code");
          if (referralCode.userId === userId) throw new Error("Cannot use your own referral code");
          const [existing] = await db.select().from(referrals).where(eq(referrals.referredId, userId)).limit(1).all();
          if (existing) throw new Error("Referral code already used");
          await db.insert(referrals).values({
            referrerId: referralCode.userId,
            referredId: userId,
            codeId: referralCode.id,
            referrerRewardAmount: referralCode.coinRewardReferrer,
            referredRewardAmount: referralCode.coinRewardReferred,
            status: "completed"
          }).run();
          await db.update(referralCodes).set({ uses: referralCode.uses + 1 }).where(eq(referralCodes.id, referralCode.id)).run();
          await this.processCurrencyChange(referralCode.userId, referralCode.coinRewardReferrer ?? 0, "referral_reward", "Referral bonus - new user");
          await this.processCurrencyChange(userId, referralCode.coinRewardReferred ?? 0, "referral_bonus", "Referral bonus for joining");
          return { success: true, coinsEarned: referralCode.coinRewardReferred };
        } catch (error) {
          throw error;
        }
      }
      // ========== FLASH SALES STORAGE METHODS ==========
      async getActiveFlashSales() {
        try {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          return await db.select().from(flashSales).where(and(
            eq(flashSales.isActive, "true"),
            sql2`${flashSales.startTime} <= ${now}`,
            sql2`${flashSales.endTime} >= ${now}`
          )).all();
        } catch (error) {
          console.error("Error getting flash sales:", error);
          return [];
        }
      }
      async getAllFlashSales() {
        try {
          return await db.select().from(flashSales).orderBy(desc(flashSales.createdAt)).all();
        } catch (error) {
          console.error("Error getting all flash sales:", error);
          return [];
        }
      }
      async createFlashSale(data) {
        try {
          const sale = await db.insert(flashSales).values(data).returning().get();
          return sale;
        } catch (error) {
          console.error("Error creating flash sale:", error);
          throw new Error("Failed to create flash sale");
        }
      }
      async updateFlashSale(id, updates) {
        try {
          const updated = await db.update(flashSales).set(updates).where(eq(flashSales.id, id)).returning().get();
          return updated;
        } catch (error) {
          console.error("Error updating flash sale:", error);
          return void 0;
        }
      }
      async deleteFlashSale(id) {
        try {
          await db.delete(flashSales).where(eq(flashSales.id, id)).run();
          return true;
        } catch (error) {
          console.error("Error deleting flash sale:", error);
          return false;
        }
      }
      // ========== GIFT STORAGE METHODS ==========
      async sendGift(data) {
        try {
          const sender = await this.getUser(data.senderId);
          if (!sender) throw new Error("Sender not found");
          if (data.giftType === "coins") {
            if ((sender.currencyBalance ?? 0) < data.giftAmount) {
              throw new Error("Insufficient balance");
            }
            await this.processCurrencyChange(data.senderId, -data.giftAmount, "gift_sent", `Gift to user`);
          }
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
          const gift = await db.insert(giftTransactions).values({
            senderId: data.senderId,
            recipientId: data.recipientId,
            recipientEmail: data.recipientEmail,
            giftType: data.giftType,
            giftAmount: data.giftAmount,
            packageId: data.packageId,
            message: data.message,
            status: "pending",
            expiresAt
          }).returning().get();
          return { success: true, gift };
        } catch (error) {
          throw error;
        }
      }
      async getUserReceivedGifts(userId) {
        try {
          const user = await this.getUser(userId);
          return await db.select().from(giftTransactions).where(or(eq(giftTransactions.recipientId, userId), eq(giftTransactions.recipientEmail, user?.email || ""))).orderBy(desc(giftTransactions.createdAt)).all();
        } catch (error) {
          console.error("Error getting received gifts:", error);
          return [];
        }
      }
      async claimGift(giftId, userId) {
        try {
          const [gift] = await db.select().from(giftTransactions).where(eq(giftTransactions.id, giftId)).limit(1).all();
          if (!gift) throw new Error("Gift not found");
          if (gift.status !== "pending") throw new Error("Gift already claimed");
          if (gift.recipientId && gift.recipientId !== userId) throw new Error("This gift is not for you");
          if (gift.giftType === "coins" && gift.giftAmount) {
            await this.processCurrencyChange(userId, gift.giftAmount, "gift_received", `Gift from user`);
          }
          await db.update(giftTransactions).set({ status: "claimed", claimedAt: sql2`(datetime('now'))`, recipientId: userId }).where(eq(giftTransactions.id, giftId)).run();
          return { success: true, giftType: gift.giftType, amount: gift.giftAmount };
        } catch (error) {
          throw error;
        }
      }
      // ========== LOYALTY STORAGE METHODS ==========
      async getUserLoyaltyStatus(userId) {
        try {
          const [loyalty] = await db.select().from(userLoyalty).where(eq(userLoyalty.userId, userId)).limit(1).all();
          if (!loyalty) {
            const newLoyalty = await db.insert(userLoyalty).values({ userId, points: 0, lifetimePoints: 0 }).returning().get();
            return { ...newLoyalty, tier: null };
          }
          const [tier] = loyalty.tierId ? await db.select().from(loyaltyTiers).where(eq(loyaltyTiers.id, loyalty.tierId)).limit(1).all() : [null];
          return { ...loyalty, tier };
        } catch (error) {
          console.error("Error getting loyalty status:", error);
          return null;
        }
      }
      async getLoyaltyTiers() {
        try {
          return await db.select().from(loyaltyTiers).orderBy(loyaltyTiers.displayOrder).all();
        } catch (error) {
          console.error("Error getting loyalty tiers:", error);
          return [];
        }
      }
      // ========== BATTLE PASS STORAGE METHODS ==========
      async getCurrentBattlePassSeason() {
        try {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const [season] = await db.select().from(battlePassSeasons).where(and(
            eq(battlePassSeasons.isActive, "true"),
            sql2`${battlePassSeasons.startDate} <= ${now}`,
            sql2`${battlePassSeasons.endDate} >= ${now}`
          )).limit(1).all();
          return season;
        } catch (error) {
          console.error("Error getting current season:", error);
          return void 0;
        }
      }
      async getUserBattlePassProgress(userId) {
        try {
          const season = await this.getCurrentBattlePassSeason();
          if (!season) return null;
          const [progress] = await db.select().from(userBattlePassProgress).where(and(eq(userBattlePassProgress.userId, userId), eq(userBattlePassProgress.seasonId, season.id))).limit(1).all();
          if (!progress) {
            const newProgress = await db.insert(userBattlePassProgress).values({
              userId,
              seasonId: season.id,
              currentTier: 0,
              experience: 0,
              isPremium: "false"
            }).returning().get();
            return { ...newProgress, season };
          }
          return { ...progress, season };
        } catch (error) {
          console.error("Error getting battle pass progress:", error);
          return null;
        }
      }
      async claimBattlePassReward(userId, tier) {
        try {
          const progress = await this.getUserBattlePassProgress(userId);
          if (!progress || progress.currentTier < tier) {
            throw new Error("Tier not unlocked");
          }
          const [reward] = await db.select().from(battlePassRewards).where(and(eq(battlePassRewards.seasonId, progress.seasonId), eq(battlePassRewards.tier, tier))).limit(1).all();
          if (!reward) throw new Error("Reward not found");
          if (reward.isPremium === "true" && progress.isPremium !== "true") {
            throw new Error("Premium tier required");
          }
          if (reward.rewardType === "coins") {
            const amount = parseInt(reward.rewardValue);
            await this.processCurrencyChange(userId, amount, "battle_pass_reward", `Battle Pass Tier ${tier} reward`);
          }
          return { success: true, reward };
        } catch (error) {
          throw error;
        }
      }
      async getBattlePassRewards(seasonId) {
        try {
          return await db.select().from(battlePassRewards).where(eq(battlePassRewards.seasonId, seasonId)).orderBy(battlePassRewards.tier).all();
        } catch (error) {
          console.error("Error getting battle pass rewards:", error);
          return [];
        }
      }
      async upgradeBattlePassToPremium(userId, seasonId) {
        try {
          const [updated] = await db.update(userBattlePassProgress).set({ isPremium: "true" }).where(and(
            eq(userBattlePassProgress.userId, userId),
            eq(userBattlePassProgress.seasonId, seasonId)
          )).returning();
          return updated;
        } catch (error) {
          console.error("Error upgrading to premium:", error);
          throw error;
        }
      }
      // ========== FLASH SALES METHODS ==========
      async incrementFlashSalePurchaseCount(saleId) {
        try {
          await db.update(flashSales).set({ currentPurchases: sql2`${flashSales.currentPurchases} + 1` }).where(eq(flashSales.id, saleId)).run();
        } catch (error) {
          console.error("Error incrementing flash sale count:", error);
        }
      }
      // ========== SUBSCRIPTION METHODS ==========
      async createUserSubscription(data) {
        try {
          const [subscription] = await db.insert(userSubscriptions).values({
            ...data,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).returning();
          return subscription;
        } catch (error) {
          console.error("Error creating subscription:", error);
          throw error;
        }
      }
      // ========== BULK CHAPTER UNLOCK STORAGE METHODS ==========
      async unlockAllSeriesChapters(userId, seriesId) {
        try {
          const seriesChapters = await db.select().from(chapters).where(eq(chapters.seriesId, seriesId)).all();
          const chapterIds = seriesChapters.map((c) => c.id);
          if (chapterIds.length === 0) {
            return { success: true, chaptersUnlocked: 0, totalCost: 0 };
          }
          const accessControls = await db.select().from(chapterAccessControl).where(and(
            inArray(chapterAccessControl.chapterId, chapterIds),
            eq(chapterAccessControl.accessType, "premium")
          )).all();
          const totalCost = accessControls.reduce((sum, ac) => sum + ac.unlockCost, 0);
          const user = await this.getUser(userId);
          if (!user || (user.currencyBalance ?? 0) < totalCost) {
            throw new Error(`Insufficient balance. Need ${totalCost} coins`);
          }
          for (const control of accessControls) {
            const unlocked = await this.hasUserUnlockedChapter(userId, control.chapterId);
            if (!unlocked) {
              await db.insert(userChapterUnlocks).values({
                userId,
                chapterId: control.chapterId,
                costPaid: control.unlockCost
              }).run();
            }
          }
          await this.processCurrencyChange(userId, -totalCost, "bulk_unlock", `Unlocked all chapters of series`);
          return { success: true, chaptersUnlocked: accessControls.length, totalCost };
        } catch (error) {
          throw error;
        }
      }
      // ========== ADMIN SUBSCRIPTION PACKAGE MANAGEMENT ==========
      async createSubscriptionPackage(data) {
        try {
          const pkg = await db.insert(subscriptionPackages).values(data).returning().get();
          return pkg;
        } catch (error) {
          console.error("Error creating subscription package:", error);
          throw new Error("Failed to create subscription package");
        }
      }
      async updateSubscriptionPackage(id, data) {
        try {
          const updated = await db.update(subscriptionPackages).set(data).where(eq(subscriptionPackages.id, id)).returning().get();
          return updated;
        } catch (error) {
          console.error("Error updating subscription package:", error);
          throw new Error("Failed to update subscription package");
        }
      }
      async deleteSubscriptionPackage(id) {
        try {
          await db.delete(subscriptionPackages).where(eq(subscriptionPackages.id, id)).run();
        } catch (error) {
          console.error("Error deleting subscription package:", error);
          throw new Error("Failed to delete subscription package");
        }
      }
      // ========== ADMIN BATTLE PASS SEASON MANAGEMENT ==========
      async getAllBattlePassSeasons() {
        try {
          const seasons = await db.select().from(battlePassSeasons).orderBy(desc(battlePassSeasons.createdAt)).all();
          return seasons;
        } catch (error) {
          console.error("Error fetching all battle pass seasons:", error);
          return [];
        }
      }
      async createBattlePassSeason(data) {
        try {
          const season = await db.insert(battlePassSeasons).values(data).returning().get();
          return season;
        } catch (error) {
          console.error("Error creating battle pass season:", error);
          throw new Error("Failed to create battle pass season");
        }
      }
      async updateBattlePassSeason(id, data) {
        try {
          const updated = await db.update(battlePassSeasons).set(data).where(eq(battlePassSeasons.id, id)).returning().get();
          return updated;
        } catch (error) {
          console.error("Error updating battle pass season:", error);
          throw new Error("Failed to update battle pass season");
        }
      }
      async deleteBattlePassSeason(id) {
        try {
          await db.delete(battlePassSeasons).where(eq(battlePassSeasons.id, id)).run();
        } catch (error) {
          console.error("Error deleting battle pass season:", error);
          throw new Error("Failed to delete battle pass season");
        }
      }
      // ========== ADMIN BATTLE PASS TIER MANAGEMENT ==========
      async createBattlePassTier(data) {
        try {
          const tier = await db.insert(battlePassRewards).values(data).returning().get();
          return tier;
        } catch (error) {
          console.error("Error creating battle pass tier:", error);
          throw new Error("Failed to create battle pass tier");
        }
      }
      async updateBattlePassTier(id, data) {
        try {
          const updated = await db.update(battlePassRewards).set(data).where(eq(battlePassRewards.id, id)).returning().get();
          return updated;
        } catch (error) {
          console.error("Error updating battle pass tier:", error);
          throw new Error("Failed to update battle pass tier");
        }
      }
      async deleteBattlePassTier(id) {
        try {
          await db.delete(battlePassRewards).where(eq(battlePassRewards.id, id)).run();
        } catch (error) {
          console.error("Error deleting battle pass tier:", error);
          throw new Error("Failed to delete battle pass tier");
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/storage/local-storage.ts
var local_storage_exports = {};
__export(local_storage_exports, {
  deleteImage: () => deleteImage2,
  ensureDirectory: () => ensureDirectory,
  getImageBuffer: () => getImageBuffer,
  listImages: () => listImages,
  uploadImage: () => uploadImage
});
import fs from "fs/promises";
import path2 from "path";
function sanitizeFilePath(filename, folder) {
  const normalized = path2.normalize(filename);
  if (normalized.includes("..") || path2.isAbsolute(normalized) || normalized.includes("\\")) {
    throw new Error(`Invalid file path: ${filename}`);
  }
  const basename = path2.basename(normalized);
  const fullPath = path2.join(STORAGE_BASE_PATH, folder, basename);
  if (!fullPath.startsWith(STORAGE_BASE_PATH)) {
    throw new Error(`Path traversal attempt detected: ${filename}`);
  }
  return fullPath;
}
async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}
async function uploadImage(buffer, filename, folder) {
  try {
    const filePath = sanitizeFilePath(filename, folder);
    const folderPath = path2.dirname(filePath);
    await ensureDirectory(folderPath);
    console.log(`[LocalStorage] Uploading image to: ${filePath}`);
    await fs.writeFile(filePath, buffer);
    console.log(`[LocalStorage] Successfully uploaded: ${filePath}`);
    return path2.join(folder, path2.basename(filename));
  } catch (error) {
    console.error(`[LocalStorage] Error uploading image ${filename}:`, error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
async function getImageBuffer(filename) {
  try {
    const normalized = path2.normalize(filename);
    if (normalized.includes("..") || path2.isAbsolute(normalized)) {
      throw new Error(`Invalid file path: ${filename}`);
    }
    const filePath = path2.join(STORAGE_BASE_PATH, normalized);
    if (!filePath.startsWith(STORAGE_BASE_PATH)) {
      throw new Error(`Path traversal attempt detected: ${filename}`);
    }
    console.log(`[LocalStorage] Retrieving image: ${filePath}`);
    const buffer = await fs.readFile(filePath);
    console.log(`[LocalStorage] Successfully retrieved ${buffer.length} bytes for: ${filename}`);
    return buffer;
  } catch (error) {
    console.error(`[LocalStorage] Error retrieving image ${filename}:`, error);
    throw new Error(`Failed to retrieve image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
async function deleteImage2(filename) {
  try {
    const normalized = path2.normalize(filename);
    if (normalized.includes("..") || path2.isAbsolute(normalized)) {
      throw new Error(`Invalid file path: ${filename}`);
    }
    const filePath = path2.join(STORAGE_BASE_PATH, normalized);
    if (!filePath.startsWith(STORAGE_BASE_PATH)) {
      throw new Error(`Path traversal attempt detected: ${filename}`);
    }
    console.log(`[LocalStorage] Deleting image: ${filePath}`);
    await fs.unlink(filePath);
    console.log(`[LocalStorage] Successfully deleted: ${filePath}`);
  } catch (error) {
    console.error(`[LocalStorage] Error deleting image ${filename}:`, error);
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
async function listImages(prefix) {
  try {
    const normalized = path2.normalize(prefix);
    if (normalized.includes("..") || path2.isAbsolute(normalized)) {
      throw new Error(`Invalid path: ${prefix}`);
    }
    const dirPath = path2.join(STORAGE_BASE_PATH, normalized);
    if (!dirPath.startsWith(STORAGE_BASE_PATH)) {
      throw new Error(`Path traversal attempt detected: ${prefix}`);
    }
    console.log(`[LocalStorage] Listing images in: ${dirPath}`);
    await ensureDirectory(dirPath);
    const files = await fs.readdir(dirPath);
    const fullPaths = files.map((file) => path2.join(prefix, file));
    console.log(`[LocalStorage] Found ${fullPaths.length} images in: ${prefix}`);
    return fullPaths;
  } catch (error) {
    console.error(`[LocalStorage] Error listing images in ${prefix}:`, error);
    throw new Error(`Failed to list images: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
var STORAGE_BASE_PATH;
var init_local_storage = __esm({
  "server/storage/local-storage.ts"() {
    "use strict";
    STORAGE_BASE_PATH = path2.join(process.cwd(), "data", "storage");
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path4 from "path";
import { fileURLToPath } from "url";
import { cartographer } from "@replit/vite-plugin-cartographer";
import errorModal from "@replit/vite-plugin-runtime-error-modal";
var __filename, __dirname, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = path4.dirname(__filename);
    vite_config_default = defineConfig({
      plugins: [
        react(),
        cartographer(),
        errorModal()
      ],
      resolve: {
        alias: {
          "@": path4.resolve(__dirname, "./client/src"),
          "@db": path4.resolve(__dirname, "./db"),
          "@shared": path4.resolve(__dirname, "./shared")
        }
      },
      root: path4.resolve(__dirname, "client"),
      build: {
        outDir: path4.resolve(__dirname, "dist/public"),
        emptyOutDir: true,
        // PERFORMANCE OPTIMIZATION: Advanced build configuration
        minify: "esbuild",
        // Use esbuild for faster, efficient minification
        // Optimize chunk splitting for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              // Separate vendor chunks for better caching
              "react-vendor": ["react", "react-dom", "react-hook-form", "wouter"],
              "ui-vendor": [
                "@radix-ui/react-dialog",
                "@radix-ui/react-dropdown-menu",
                "@radix-ui/react-select",
                "@radix-ui/react-toast",
                "@radix-ui/react-tabs"
              ],
              "chart-vendor": ["chart.js", "react-chartjs-2"],
              "utils-vendor": ["date-fns", "clsx", "tailwind-merge", "zod"]
            }
          }
        },
        // Increase chunk size warning limit (we're optimizing it)
        chunkSizeWarningLimit: 1e3,
        // Disable source maps for smaller production builds
        sourcemap: false
      },
      // PERFORMANCE: Remove console logs in production via esbuild
      esbuild: {
        drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : []
      },
      // PERFORMANCE: Optimize dependencies
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "react-hook-form",
          "wouter",
          "@tanstack/react-query",
          "chart.js",
          "react-chartjs-2"
        ]
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express2 from "express";
import fs3 from "fs";
import path5 from "path";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await import("vite");
  const viteLogger = vite.createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const viteServer = await vite.createServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(viteServer.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path5.resolve(
        process.cwd(),
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    init_vite_config();
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
init_storage();
import { createServer } from "http";

// server/storage/package-management.ts
init_storage();
init_schema();
import { eq as eq2, and as and2, gte as gte2, lte as lte2, desc as desc2, sql as sql3, like as like2 } from "drizzle-orm";
import jsPDF from "jspdf";
import { writeFile, mkdir } from "fs/promises";
import { existsSync as existsSync2 } from "fs";
import path from "path";
async function getCoupons() {
  return await db.select().from(coupons).orderBy(desc2(coupons.createdAt));
}
async function getCouponByCode(code) {
  const result = await db.select().from(coupons).where(eq2(coupons.code, code.toUpperCase())).limit(1);
  return result[0] || null;
}
async function createCoupon(coupon) {
  const result = await db.insert(coupons).values({
    ...coupon,
    code: coupon.code.toUpperCase()
  }).returning();
  return result[0];
}
async function updateCoupon(id, updates) {
  const result = await db.update(coupons).set({ ...updates, code: updates.code ? updates.code.toUpperCase() : void 0 }).where(eq2(coupons.id, id)).returning();
  return result[0];
}
async function deleteCoupon(id) {
  await db.delete(coupons).where(eq2(coupons.id, id));
}
async function validateCoupon(code, purchaseAmount) {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }
  if (coupon.isActive !== "true") {
    return { valid: false, error: "Coupon is not active" };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < /* @__PURE__ */ new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }
  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, error: "Coupon usage limit reached" };
  }
  if (coupon.minPurchaseAmount) {
    const minAmount = parseFloat(coupon.minPurchaseAmount);
    const amount = parseFloat(purchaseAmount);
    if (amount < minAmount) {
      return { valid: false, error: `Minimum purchase of $${minAmount} required` };
    }
  }
  let discountAmount = 0;
  if (coupon.type === "percentage") {
    const percentage = parseFloat(coupon.value);
    discountAmount = parseFloat(purchaseAmount) * percentage / 100;
  } else if (coupon.type === "fixed") {
    discountAmount = parseFloat(coupon.value);
  }
  return {
    valid: true,
    coupon,
    discountAmount: discountAmount.toFixed(2)
  };
}
async function getPackageBundles() {
  return await db.select().from(packageBundles).orderBy(packageBundles.displayOrder);
}
async function createPackageBundle(bundle) {
  const result = await db.insert(packageBundles).values(bundle).returning();
  return result[0];
}
async function updatePackageBundle(id, updates) {
  const result = await db.update(packageBundles).set(updates).where(eq2(packageBundles.id, id)).returning();
  return result[0];
}
async function deletePackageBundle(id) {
  await db.delete(packageBundles).where(eq2(packageBundles.id, id));
}
async function getInvoices(filters) {
  let query = db.select().from(invoices);
  if (filters?.userId) {
    query = query.where(eq2(invoices.userId, filters.userId));
  }
  if (filters?.status) {
    query = query.where(eq2(invoices.status, filters.status));
  }
  if (filters?.startDate) {
    query = query.where(gte2(invoices.createdAt, filters.startDate));
  }
  if (filters?.endDate) {
    query = query.where(lte2(invoices.createdAt, filters.endDate));
  }
  return await query.orderBy(desc2(invoices.createdAt));
}
async function getInvoiceById(id) {
  const result = await db.select().from(invoices).where(eq2(invoices.id, id)).limit(1);
  return result[0] || null;
}
async function getInvoiceItems(invoiceId) {
  return await db.select().from(invoiceItems).where(eq2(invoiceItems.invoiceId, invoiceId));
}
async function updateInvoice(id, updates) {
  const result = await db.update(invoices).set(updates).where(eq2(invoices.id, id)).returning();
  return result[0];
}
async function generateInvoicePDF(invoiceId) {
  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) throw new Error("Invoice not found");
  const items = await getInvoiceItems(invoiceId);
  const user = await db.select().from(users).where(eq2(users.id, invoice.userId)).limit(1);
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("INVOICE", 105, 20, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 50);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 60);
  doc.text(`Customer: ${user[0]?.username || "N/A"}`, 120, 40);
  doc.text(`Email: ${user[0]?.email || "N/A"}`, 120, 50);
  let y = 80;
  doc.setFontSize(12);
  doc.text("Items", 20, y);
  y += 10;
  doc.setFontSize(10);
  doc.text("Description", 20, y);
  doc.text("Qty", 110, y);
  doc.text("Unit Price", 130, y);
  doc.text("Total", 170, y);
  y += 5;
  doc.line(20, y, 190, y);
  y += 10;
  for (const item of items) {
    doc.text(item.description, 20, y);
    doc.text(item.quantity.toString(), 110, y);
    doc.text(`$${item.unitPrice}`, 130, y);
    doc.text(`$${item.totalPrice}`, 170, y);
    y += 10;
  }
  y += 10;
  doc.text(`Subtotal: $${invoice.totalAmount}`, 140, y);
  y += 8;
  doc.text(`Tax: $${invoice.taxAmount}`, 140, y);
  y += 8;
  doc.text(`Discount: -$${invoice.discountAmount}`, 140, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`Total: $${invoice.finalAmount}`, 140, y);
  const invoicesDir = path.join(process.cwd(), "data", "invoices");
  if (!existsSync2(invoicesDir)) {
    await mkdir(invoicesDir, { recursive: true });
  }
  const pdfPath = `data/invoices/${invoice.invoiceNumber}.pdf`;
  const buffer = doc.output("arraybuffer");
  await writeFile(pdfPath, Buffer.from(buffer));
  await updateInvoice(invoiceId, { pdfPath });
  return pdfPath;
}
async function getManualAssignments(userId) {
  if (userId) {
    return await db.select().from(manualAssignments).where(eq2(manualAssignments.userId, userId)).orderBy(desc2(manualAssignments.createdAt));
  }
  return await db.select().from(manualAssignments).orderBy(desc2(manualAssignments.createdAt));
}
async function createManualAssignment(assignment) {
  const result = await db.insert(manualAssignments).values(assignment).returning();
  return result[0];
}
async function revokeManualAssignment(id) {
  const result = await db.update(manualAssignments).set({ isActive: "false" }).where(eq2(manualAssignments.id, id)).returning();
  return result[0];
}
async function activateTrial(userId, subscriptionId, trialDays) {
  const trialStartDate = (/* @__PURE__ */ new Date()).toISOString();
  const trialEndDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1e3).toISOString();
  const result = await db.update(userSubscriptions).set({
    trialStartDate,
    trialEndDate,
    isTrialActive: "true",
    status: "active"
  }).where(eq2(userSubscriptions.id, subscriptionId)).returning();
  return result[0];
}
async function flagPurchaseOffline(purchaseId) {
  const result = await db.update(userPurchases).set({ isOffline: "true" }).where(eq2(userPurchases.id, purchaseId)).returning();
  return result[0];
}
async function getOfflinePurchases() {
  return await db.select().from(userPurchases).where(eq2(userPurchases.isOffline, "true")).orderBy(desc2(userPurchases.createdAt));
}
async function reconcilePurchase(purchaseId, updates) {
  const result = await db.update(userPurchases).set({ ...updates, isOffline: "false" }).where(eq2(userPurchases.id, purchaseId)).returning();
  return result[0];
}
async function exportSubscribersToCSV(filters) {
  let query = db.select({
    subscription: userSubscriptions,
    user: users,
    package: subscriptionPackages
  }).from(userSubscriptions).leftJoin(users, eq2(userSubscriptions.userId, users.id)).leftJoin(subscriptionPackages, eq2(userSubscriptions.packageId, subscriptionPackages.id));
  if (filters?.status) {
    query = query.where(eq2(userSubscriptions.status, filters.status));
  }
  if (filters?.packageId) {
    query = query.where(eq2(userSubscriptions.packageId, filters.packageId));
  }
  if (filters?.startDate) {
    query = query.where(gte2(userSubscriptions.createdAt, filters.startDate));
  }
  if (filters?.endDate) {
    query = query.where(lte2(userSubscriptions.createdAt, filters.endDate));
  }
  const data = await query;
  const headers = [
    "User ID",
    "Username",
    "Email",
    "Package Name",
    "Status",
    "Trial Active",
    "Trial End Date",
    "Period Start",
    "Period End",
    "Created At"
  ];
  const rows = data.map((row) => [
    row.user?.id || "",
    row.user?.username || "",
    row.user?.email || "",
    row.package?.name || "",
    row.subscription.status,
    row.subscription.isTrialActive === "true" ? "Yes" : "No",
    row.subscription.trialEndDate || "",
    row.subscription.currentPeriodStart || "",
    row.subscription.currentPeriodEnd || "",
    row.subscription.createdAt || ""
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))
  ].join("\n");
  return csvContent;
}
async function getAllPackages() {
  const [currencyPkgs, subscriptionPkgs, bundles] = await Promise.all([
    db.select().from(currencyPackages).where(eq2(currencyPackages.isActive, "true")),
    db.select().from(subscriptionPackages).where(eq2(subscriptionPackages.isActive, "true")),
    db.select().from(packageBundles).where(eq2(packageBundles.isActive, "true"))
  ]);
  return {
    currency: currencyPkgs,
    subscriptions: subscriptionPkgs,
    bundles
  };
}

// server/routes.ts
init_schema();
import { z as z2 } from "zod";
import bcrypt from "bcryptjs";
import { eq as eq3 } from "drizzle-orm";

// server/utils/email.ts
async function sendEmail(options) {
  console.log(`[email] \u{1F4E7} Email would be sent to: ${options.to}`);
  console.log(`[email] \u{1F4DD} Subject: ${options.subject}`);
  console.log(`[email] \u{1F4AC} Text: ${options.text.substring(0, 100)}...`);
  if (options.html) {
    console.log(`[email] \u{1F3A8} HTML content included (${options.html.length} chars)`);
  }
  console.log(`[email] \u26A0\uFE0F  NOTE: Email integration not configured. To enable real email sending:`);
  console.log(`[email] 1. Set up SendGrid integration via Replit integrations panel`);
  console.log(`[email] 2. Or configure SMTP credentials as secrets`);
  console.log(`[email] 3. Update this file (server/utils/email.ts) with real email sending logic`);
  return true;
}
function generateVerificationEmailHtml(username, verificationUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 0; text-align: center;">
            <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <h1 style="color: #333333; margin: 0 0 20px 0; font-size: 28px;">Welcome to MangaVerse!</h1>
                  <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                    Hi ${username},
                  </p>
                  <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                    Thank you for signing up! Please verify your email address to activate your account and start reading your favorite manga.
                  </p>
                  <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                    Verify Email Address
                  </a>
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${verificationUrl}" style="color: #7c3aed; word-break: break-all;">${verificationUrl}</a>
                  </p>
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                    This link will expire in 24 hours.
                  </p>
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                    If you didn't create an account on MangaVerse, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} MangaVerse. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
function generatePasswordResetEmailHtml(username, resetUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 0; text-align: center;">
            <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <h1 style="color: #333333; margin: 0 0 20px 0; font-size: 28px;">Reset Your Password</h1>
                  <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                    Hi ${username},
                  </p>
                  <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                    We received a request to reset your password. Click the button below to create a new password:
                  </p>
                  <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                    Reset Password
                  </a>
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${resetUrl}" style="color: #7c3aed; word-break: break-all;">${resetUrl}</a>
                  </p>
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                    This link will expire in 1 hour.
                  </p>
                  <p style="color: #e53e3e; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; font-weight: bold;">
                    If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} MangaVerse. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// server/routes.ts
import rateLimit from "express-rate-limit";
import cors from "cors";
import multer from "multer";
import path3 from "path";
import { createWriteStream } from "fs";
import fsp from "fs/promises";
import express from "express";
import yauzl from "yauzl";

// server/naturalSort.ts
function extractNumericSequences(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "").toLowerCase();
  const numericMatches = nameWithoutExt.match(/\d+/g);
  if (!numericMatches) return [];
  return numericMatches.map((match) => parseInt(match, 10));
}
function getPrimaryNumber(filename) {
  const numbers = extractNumericSequences(filename);
  if (numbers.length === 0) {
    return filename.charCodeAt(0) || 0;
  }
  if (numbers.length === 1) {
    return numbers[0];
  }
  const lastNumber = numbers[numbers.length - 1];
  const maxNumber = Math.max(...numbers);
  return lastNumber >= 1 ? lastNumber : maxNumber;
}
function analyzeSequence(numbers) {
  if (numbers.length <= 1) {
    return {
      isSequential: true,
      gapCount: 0,
      duplicateCount: 0,
      hasConsistentPadding: true
    };
  }
  const sorted = [...numbers].sort((a, b) => a - b);
  let gapCount = 0;
  let duplicateCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i] - sorted[i - 1];
    if (diff === 0) {
      duplicateCount++;
    } else if (diff > 1) {
      gapCount++;
    }
  }
  const minValue = sorted[0];
  const maxValue = sorted[sorted.length - 1];
  const range = maxValue - minValue + 1;
  const actualCount = sorted.length;
  const missingCount = range - actualCount;
  const reasonableStart = minValue <= 3;
  const goodCoverage = missingCount <= Math.ceil(actualCount * 0.3);
  const lowGapRatio = gapCount <= Math.ceil(sorted.length * 0.25);
  const isSequential = reasonableStart && goodCoverage && lowGapRatio;
  return {
    isSequential,
    gapCount,
    duplicateCount,
    hasConsistentPadding: true
    // We'll check this separately with original strings
  };
}
function checkPaddingConsistency(filenames) {
  if (filenames.length === 0) return true;
  const primaryNumericTokens = filenames.map((filename) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const matches = nameWithoutExt.match(/\d+/g);
    if (!matches || matches.length === 0) return null;
    const numbers = matches.map((match) => parseInt(match, 10));
    let primaryValue;
    if (numbers.length === 1) {
      primaryValue = numbers[0];
    } else {
      const lastNumber = numbers[numbers.length - 1];
      const maxNumber = Math.max(...numbers);
      primaryValue = lastNumber >= 1 ? lastNumber : maxNumber;
    }
    const primaryToken = matches.find((match) => parseInt(match, 10) === primaryValue);
    return primaryToken || null;
  }).filter((token) => token !== null);
  if (primaryNumericTokens.length <= 1) return true;
  const firstTokenLength = primaryNumericTokens[0].length;
  const allSameLength = primaryNumericTokens.every((token) => token.length === firstTokenLength);
  if (!allSameLength) return false;
  const valueGroups = /* @__PURE__ */ new Map();
  primaryNumericTokens.forEach((token) => {
    const value = parseInt(token, 10);
    if (!valueGroups.has(value)) {
      valueGroups.set(value, []);
    }
    valueGroups.get(value).push(token);
  });
  for (const [value, tokens] of Array.from(valueGroups)) {
    if (tokens.length > 1) {
      const firstLength = tokens[0].length;
      if (!tokens.every((token) => token.length === firstLength)) {
        return false;
      }
    }
  }
  return true;
}
function calculateConfidence(files, metadata) {
  let confidence = 1;
  const totalFiles = files.length;
  if (totalFiles < 2) {
    confidence *= 0.95;
  } else if (totalFiles < 4) {
    confidence *= 0.92;
  }
  if (!metadata.hasNumericSequences) {
    confidence *= 0.2;
  }
  if (metadata.gapCount > 0) {
    const gapRatio = metadata.gapCount / totalFiles;
    if (gapRatio > 0.4) {
      confidence *= 0.4;
    } else if (gapRatio > 0.2) {
      confidence *= 0.7;
    } else {
      confidence *= 0.85;
    }
  }
  if (metadata.duplicateNumbers > 0) {
    const dupRatio = metadata.duplicateNumbers / totalFiles;
    if (dupRatio > 0.3) {
      confidence *= 0.3;
    } else if (dupRatio > 0.1) {
      confidence *= 0.6;
    } else {
      confidence *= 0.8;
    }
  }
  if (!metadata.consistentPadding) {
    confidence *= 0.75;
  }
  if (!metadata.sequentialNumbers) {
    confidence *= 0.8;
  }
  return Math.max(0, Math.min(1, confidence));
}
function naturalSortWithConfidence(files) {
  if (files.length === 0) {
    return {
      sortedFiles: [],
      confidence: 1,
      requiresManualReorder: false,
      metadata: {
        hasNumericSequences: false,
        consistentPadding: true,
        sequentialNumbers: true,
        gapCount: 0,
        duplicateNumbers: 0,
        totalFiles: 0
      }
    };
  }
  const processedFiles = files.map((file) => ({
    ...file,
    // Extract filename from path, handling nested folders
    sortingName: file.originalName.split("/").pop() || file.originalName
  }));
  const filesWithNumbers = processedFiles.map((file) => ({
    ...file,
    primaryNumber: getPrimaryNumber(file.sortingName),
    hasNumeric: extractNumericSequences(file.sortingName).length > 0
  }));
  const hasNumericSequences = filesWithNumbers.some((f) => f.hasNumeric);
  const sortedFiles = filesWithNumbers.sort((a, b) => {
    if (a.primaryNumber !== b.primaryNumber) {
      return a.primaryNumber - b.primaryNumber;
    }
    return a.sortingName.localeCompare(b.sortingName, void 0, {
      numeric: true,
      sensitivity: "base"
    });
  });
  const primaryNumbers = filesWithNumbers.map((f) => f.primaryNumber);
  const sequenceAnalysis = analyzeSequence(primaryNumbers);
  const filenames = processedFiles.map((f) => f.sortingName);
  const consistentPadding = checkPaddingConsistency(filenames);
  const metadata = {
    hasNumericSequences,
    consistentPadding,
    sequentialNumbers: sequenceAnalysis.isSequential,
    gapCount: sequenceAnalysis.gapCount,
    duplicateNumbers: sequenceAnalysis.duplicateCount,
    totalFiles: files.length
  };
  const confidence = calculateConfidence(files, metadata);
  const CONFIDENCE_THRESHOLD = 0.7;
  const requiresManualReorder = confidence < CONFIDENCE_THRESHOLD;
  return {
    sortedFiles: sortedFiles.map((f) => ({
      path: f.path,
      originalName: f.originalName,
      size: f.size,
      buffer: f.buffer
    })),
    confidence,
    requiresManualReorder,
    metadata
  };
}

// server/replitAuth.ts
import session from "express-session";
import Database2 from "better-sqlite3";
import { existsSync as existsSync3, mkdirSync as mkdirSync2, copyFileSync as copyFileSync2, readFileSync, writeFileSync as writeFileSync2, chmodSync, statSync } from "fs";
import { dirname as dirname2, join as join2 } from "path";
import { randomBytes as randomBytes2 } from "crypto";
var sessionsBackupDir = "./data/backups";
function isSessionSevereCorruption(error) {
  if (!error || typeof error.message !== "string") return false;
  const severeCorruptionIndicators = [
    "database disk image is malformed",
    "file is not a database",
    "SQLITE_CORRUPT",
    "SQLITE_NOTADB",
    "corrupt database",
    "malformed database",
    "database corruption"
  ];
  return severeCorruptionIndicators.some(
    (indicator) => error.message.toLowerCase().includes(indicator.toLowerCase())
  );
}
function isSessionRecoverableIssue(error) {
  if (!error || typeof error.message !== "string") return false;
  const recoverableIndicators = [
    "no such table",
    "table already exists",
    "database schema has changed"
  ];
  return recoverableIndicators.some(
    (indicator) => error.message.toLowerCase().includes(indicator.toLowerCase())
  );
}
function isSessionDiskSpaceIssue(error) {
  if (!error || typeof error.message !== "string") return false;
  return error.message.toLowerCase().includes("database or disk is full") || error.message.toLowerCase().includes("SQLITE_FULL");
}
function safeSessionDatabaseBackup(dbFilePath, reason) {
  if (!existsSync3(sessionsBackupDir)) {
    mkdirSync2(sessionsBackupDir, { recursive: true, mode: 493 });
    console.log("[sessions-protection] \u{1F4C1} Created sessions backup directory:", sessionsBackupDir);
  }
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const fileName = `${dbFilePath.split("/").pop()?.replace(".db", "")}-backup-${timestamp}.db`;
  const backupPath = join2(sessionsBackupDir, fileName);
  try {
    if (existsSync3(dbFilePath)) {
      console.log(`[sessions-protection] \u{1F6E1}\uFE0F  Creating safe backup of session database`);
      console.log(`[sessions-protection] \u{1F4C4} Source: ${dbFilePath}`);
      console.log(`[sessions-protection] \u{1F4BE} Backup: ${backupPath}`);
      console.log(`[sessions-protection] \u{1F50D} Reason: ${reason}`);
      copyFileSync2(dbFilePath, backupPath);
      try {
        const testDb = new Database2(backupPath, { readonly: true });
        testDb.exec("SELECT 1");
        testDb.close();
        console.log(`[sessions-protection] \u2705 Session backup validated successfully`);
      } catch (validationError) {
        console.error(`[sessions-protection] \u26A0\uFE0F  Session backup validation failed:`, validationError);
        return "";
      }
      const preservedPath = `${dbFilePath}.preserved-${timestamp}`;
      try {
        copyFileSync2(dbFilePath, preservedPath);
        console.log(`[sessions-protection] \u{1F512} Original session database preserved at: ${preservedPath}`);
        const corruptedMovePath = `${dbFilePath}.corrupted-${timestamp}`;
        const fs4 = __require("fs");
        fs4.renameSync(dbFilePath, corruptedMovePath);
        console.log(`[sessions-protection] \u{1F5D1}\uFE0F  Moved corrupted session file to: ${corruptedMovePath}`);
        console.log(`[sessions-protection] \u{1F4A1} Recovery can now create fresh session database at: ${dbFilePath}`);
      } catch (moveError) {
        console.error(`[sessions-protection] \u274C Could not move corrupted session file - aborting recovery:`, moveError);
        return "";
      }
      return backupPath;
    }
  } catch (backupError) {
    console.error(`[sessions-protection] \u274C Failed to create safe session backup: ${backupError}`);
  }
  return "";
}
function createSessionDatabaseSafely(dbFilePath) {
  try {
    console.log(`[sessions-recovery] \u{1F527} Creating fresh sessions database: ${dbFilePath}`);
    const db2 = new Database2(dbFilePath);
    db2.exec("SELECT 1");
    db2.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire INTEGER NOT NULL
      )
    `);
    db2.exec(`
      CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire)
    `);
    console.log(`[sessions-recovery] \u2705 Successfully created and initialized sessions database: ${dbFilePath}`);
    return db2;
  } catch (error) {
    console.error(`[sessions-recovery] \u274C Failed to create sessions database ${dbFilePath}:`, error);
    return null;
  }
}
var SQLiteSessionStore = class extends session.Store {
  db;
  constructor() {
    super();
    const sessionDbPath = "./data/sessions.db";
    const sessionDbDir = dirname2(sessionDbPath);
    if (!existsSync3(sessionDbDir)) {
      mkdirSync2(sessionDbDir, { recursive: true });
    }
    this.db = this.initializeSessionDatabase(sessionDbPath);
  }
  initializeSessionDatabase(sessionDbPath) {
    let attempts = 0;
    const maxAttempts = 3;
    const sessionDbDir = dirname2(sessionDbPath);
    if (!existsSync3(sessionDbDir)) {
      mkdirSync2(sessionDbDir, { recursive: true, mode: 493 });
      console.log(`[sessions-protection] \u{1F4C1} Created session database directory: ${sessionDbDir}`);
    }
    while (attempts < maxAttempts) {
      try {
        console.log(`[sessions] Initializing session database (attempt ${attempts + 1}/${maxAttempts})`);
        const db2 = new Database2(sessionDbPath);
        const integrityResult = db2.prepare("PRAGMA integrity_check").get();
        if (integrityResult && integrityResult.integrity_check !== "ok") {
          console.log(`[sessions] \u26A0\uFE0F  Session database integrity check warning: ${JSON.stringify(integrityResult)}`);
        }
        db2.exec(`
          CREATE TABLE IF NOT EXISTS sessions (
            sid TEXT PRIMARY KEY,
            sess TEXT NOT NULL,
            expire INTEGER NOT NULL
          )
        `);
        db2.exec(`
          CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire)
        `);
        console.log("[sessions] \u2705 SQLite session store initialized successfully");
        return db2;
      } catch (error) {
        attempts++;
        console.error(`[sessions] \u274C Failed to initialize session database (attempt ${attempts}):`, error);
        if (isSessionSevereCorruption(error)) {
          console.log("[sessions-protection] \u{1F6A8} SEVERE session database corruption detected! Starting careful recovery...");
          const backupPath = safeSessionDatabaseBackup(sessionDbPath, `Severe session corruption: ${error.message}`);
          if (backupPath) {
            console.log(`[sessions-protection] \u{1F4BE} Session database safely backed up to: ${backupPath}`);
            const freshDb = createSessionDatabaseSafely(sessionDbPath);
            if (freshDb) {
              console.log("[sessions-recovery] \u2705 Successfully recovered with fresh session database");
              console.log(`[sessions-recovery] \u{1F4A1} Your original session data is preserved in: ${backupPath}`);
              return freshDb;
            }
          } else {
            console.error("[sessions-protection] \u274C Could not create safe session backup - aborting recovery");
          }
        } else if (isSessionRecoverableIssue(error)) {
          console.log("[sessions] \u{1F527} Detected recoverable session schema issue, attempting gentle repair...");
          try {
            const db2 = new Database2(sessionDbPath);
            db2.exec(`
              CREATE TABLE IF NOT EXISTS sessions (
                sid TEXT PRIMARY KEY,
                sess TEXT NOT NULL,
                expire INTEGER NOT NULL
              )
            `);
            db2.exec(`
              CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire)
            `);
            console.log("[sessions] \u2705 Session schema issue resolved successfully");
            return db2;
          } catch (schemaError) {
            console.error("[sessions] \u274C Could not resolve session schema issue:", schemaError);
          }
        } else if (isSessionDiskSpaceIssue(error)) {
          console.error("[sessions] \u{1F4BE} SESSION DISK SPACE ISSUE: Cannot initialize session database");
          console.error("[sessions] \u{1F4A1} Please free up disk space and restart the application");
          throw new Error("Insufficient disk space for session database operation");
        }
        if (attempts >= maxAttempts) {
          console.error("[sessions] \u274C Failed to initialize session database after all attempts");
          console.error("[sessions-protection] \u{1F6E1}\uFE0F  Your session data has been protected - no files were deleted");
          throw new Error(`Session database initialization failed after ${maxAttempts} attempts: ${error.message}`);
        }
        console.log("[sessions] \u23F3 Waiting before retry...");
        __require("child_process").execSync("sleep 1");
      }
    }
    throw new Error("Unexpected error in session database initialization");
  }
  get(sid, callback) {
    try {
      const stmt = this.db.prepare("SELECT sess, expire FROM sessions WHERE sid = ? AND expire > ?");
      const result = stmt.get(sid, Date.now());
      if (result) {
        const sessionData = JSON.parse(result.sess);
        callback(null, sessionData);
      } else {
        callback(null, null);
      }
    } catch (error) {
      callback(error);
    }
  }
  set(sid, sess, callback) {
    try {
      const expire = sess.cookie?.expires ? sess.cookie.expires.getTime() : Date.now() + 7 * 24 * 60 * 60 * 1e3;
      const stmt = this.db.prepare("INSERT OR REPLACE INTO sessions (sid, sess, expire) VALUES (?, ?, ?)");
      stmt.run(sid, JSON.stringify(sess), expire);
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }
  destroy(sid, callback) {
    try {
      const stmt = this.db.prepare("DELETE FROM sessions WHERE sid = ?");
      stmt.run(sid);
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }
  clear(callback) {
    try {
      this.db.exec("DELETE FROM sessions");
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }
  length(callback) {
    try {
      const result = this.db.prepare("SELECT COUNT(*) as count FROM sessions WHERE expire > ?").get(Date.now());
      callback(null, result.count);
    } catch (error) {
      callback(error);
    }
  }
  // Clean up expired sessions
  cleanup() {
    try {
      const stmt = this.db.prepare("DELETE FROM sessions WHERE expire <= ?");
      const result = stmt.run(Date.now());
      if (result.changes > 0) {
        console.log(`[sessions] Cleaned up ${result.changes} expired sessions`);
      }
    } catch (error) {
      console.error("[sessions] Error cleaning up expired sessions:", error);
    }
  }
};
function getOrCreateSessionSecret() {
  const secretFilePath = "./data/session-secret.key";
  const dataDir = "./data";
  if (!existsSync3(dataDir)) {
    mkdirSync2(dataDir, { recursive: true });
    console.log("[sessions] Created data directory:", dataDir);
  }
  if (existsSync3(secretFilePath)) {
    try {
      const stats = statSync(secretFilePath);
      const mode = stats.mode & parseInt("777", 8);
      if (mode !== parseInt("600", 8)) {
        console.warn("[sessions] \u26A0\uFE0F  Session secret file has insecure permissions, fixing...");
        chmodSync(secretFilePath, 384);
      }
      const secret = readFileSync(secretFilePath, "utf8").trim();
      if (secret && secret.length >= 32) {
        console.log("[sessions] \u2705 Using existing persistent session secret");
        return secret;
      } else {
        console.warn("[sessions] \u26A0\uFE0F  Invalid session secret in file, generating new one");
      }
    } catch (error) {
      console.warn("[sessions] \u26A0\uFE0F  Failed to read session secret file, generating new one:", error);
    }
  }
  const newSecret = randomBytes2(64).toString("hex");
  try {
    writeFileSync2(secretFilePath, newSecret, { encoding: "utf8", mode: 384 });
    console.log("[sessions] \u2705 Generated and saved new persistent session secret to:", secretFilePath);
    return newSecret;
  } catch (error) {
    console.error("[sessions] \u274C Failed to save session secret to file:", error);
    console.warn("[sessions] \u26A0\uFE0F  Using temporary session secret (sessions will not persist)");
    return newSecret;
  }
}
function getOrCreateCsrfSecret() {
  const secretFilePath = "./data/csrf-secret.key";
  const dataDir = "./data";
  if (!existsSync3(dataDir)) {
    mkdirSync2(dataDir, { recursive: true });
    console.log("[csrf] Created data directory:", dataDir);
  }
  if (existsSync3(secretFilePath)) {
    try {
      const stats = statSync(secretFilePath);
      const mode = stats.mode & parseInt("777", 8);
      if (mode !== parseInt("600", 8)) {
        console.warn("[csrf] \u26A0\uFE0F  CSRF secret file has insecure permissions, fixing...");
        chmodSync(secretFilePath, 384);
      }
      const secret = readFileSync(secretFilePath, "utf8").trim();
      if (secret && secret.length >= 32) {
        console.log("[csrf] \u2705 Using existing persistent CSRF secret");
        return secret;
      } else {
        console.warn("[csrf] \u26A0\uFE0F  Invalid CSRF secret in file, generating new one");
      }
    } catch (error) {
      console.warn("[csrf] \u26A0\uFE0F  Failed to read CSRF secret file, generating new one:", error);
    }
  }
  const newSecret = randomBytes2(64).toString("hex");
  try {
    writeFileSync2(secretFilePath, newSecret, { encoding: "utf8", mode: 384 });
    console.log("[csrf] \u2705 Generated and saved new persistent CSRF secret to:", secretFilePath);
    return newSecret;
  } catch (error) {
    console.error("[csrf] \u274C Failed to save CSRF secret to file:", error);
    console.warn("[csrf] \u26A0\uFE0F  Using temporary CSRF secret (protection will not persist)");
    return newSecret;
  }
}
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const sessionSecret = getOrCreateSessionSecret();
  console.log("[sessions] Using SQLite session store for offline compatibility");
  const sessionStore = new SQLiteSessionStore();
  if (sessionStore instanceof SQLiteSessionStore) {
    setInterval(() => {
      sessionStore.cleanup();
    }, 60 * 60 * 1e3);
    sessionStore.cleanup();
  }
  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "auth.sid",
    // Align with logout cookie name
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl
    }
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  console.log("[auth] Local authentication only - using SQLite sessions");
  console.log("[auth] Username/password authentication ready");
}
async function getUserFromRequest(req) {
  if (!req.session?.user) {
    return null;
  }
  const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
  const user = await storage2.getUserByUsername(req.session.user.username);
  return user ?? null;
}
var isStaff = async (req, res, next) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const hasStaffAccess = ["staff", "admin", "owner"].includes(user.role || "") || user.isAdmin === "true";
    if (!hasStaffAccess) {
      return res.status(403).json({ message: "Forbidden: Staff access required" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Staff auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
var isOwner = async (req, res, next) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const hasOwnerAccess = user.role === "owner";
    if (!hasOwnerAccess) {
      return res.status(403).json({ message: "Forbidden: Owner access required" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Owner auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
var isStaffOrAbove = isStaff;

// server/routes.ts
import { doubleCsrf } from "csrf-csrf";
import DOMPurify from "isomorphic-dompurify";

// server/routes/seo.ts
init_storage();
import { Router } from "express";
var router = Router();
router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host");
    const allSeries = await storage.getAllSeries();
    const allChapters = await storage.getAllChapters();
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    sitemap += "  <url>\n";
    sitemap += `    <loc>${baseUrl}/</loc>
`;
    sitemap += `    <lastmod>${(/* @__PURE__ */ new Date()).toISOString()}</lastmod>
`;
    sitemap += "    <changefreq>daily</changefreq>\n";
    sitemap += "    <priority>1.0</priority>\n";
    sitemap += "  </url>\n";
    sitemap += "  <url>\n";
    sitemap += `    <loc>${baseUrl}/browse</loc>
`;
    sitemap += `    <lastmod>${(/* @__PURE__ */ new Date()).toISOString()}</lastmod>
`;
    sitemap += "    <changefreq>daily</changefreq>\n";
    sitemap += "    <priority>0.9</priority>\n";
    sitemap += "  </url>\n";
    for (const s of allSeries) {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}/manga/${s.id}</loc>
`;
      sitemap += `    <lastmod>${s.updatedAt ? new Date(s.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()}</lastmod>
`;
      sitemap += "    <changefreq>weekly</changefreq>\n";
      sitemap += "    <priority>0.8</priority>\n";
      sitemap += "  </url>\n";
    }
    for (const chapter of allChapters) {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}/manga/${chapter.seriesId}/chapter/${chapter.chapterNumber}</loc>
`;
      sitemap += `    <lastmod>${chapter.updatedAt ? new Date(chapter.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()}</lastmod>
`;
      sitemap += "    <changefreq>monthly</changefreq>\n";
      sitemap += "    <priority>0.7</priority>\n";
      sitemap += "  </url>\n";
    }
    const staticPages = [
      { path: "/privacy", priority: "0.3", changefreq: "monthly" },
      { path: "/dmca", priority: "0.3", changefreq: "monthly" }
    ];
    for (const page of staticPages) {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}${page.path}</loc>
`;
      sitemap += `    <lastmod>${(/* @__PURE__ */ new Date()).toISOString()}</lastmod>
`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>
`;
      sitemap += `    <priority>${page.priority}</priority>
`;
      sitemap += "  </url>\n";
    }
    sitemap += "</urlset>";
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});
router.get("/robots.txt", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  let robotsTxt = `# MangaVerse Robots.txt
# Allow all search engines to crawl

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/*
Disallow: /api/
Disallow: /settings
Disallow: /library
Disallow: /history

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (be nice to our servers)
Crawl-delay: 1
`;
  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
});
var seo_default = router;

// server/routes.ts
import Stripe from "stripe";

// server/storage/app-storage.ts
import { Client } from "@replit/object-storage";
var bucketName = process.env.REPL_SLUG || "mangaverse";
var client = new Client({ bucketId: bucketName });
async function deleteImage(filename) {
  try {
    console.log(`[AppStorage] Deleting image: ${filename}`);
    await client.delete(filename);
    console.log(`[AppStorage] Successfully deleted: ${filename}`);
  } catch (error) {
    console.error(`[AppStorage] Error deleting image ${filename}:`, error);
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// server/routes.ts
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-09-30.clover" }) : null;
var uploadProgressStore = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1e3;
  const tenMinutesAgo = now - 10 * 60 * 1e3;
  for (const [id, progress] of Array.from(uploadProgressStore.entries())) {
    if (progress.startTime < oneHourAgo) {
      console.log(`[${id}] Cleaning up expired upload (TTL: 1 hour)`);
      uploadProgressStore.delete(id);
      continue;
    }
    if ((progress.status === "complete" || progress.status === "error") && progress.startTime < now - 5 * 60 * 1e3) {
      console.log(`[${id}] Cleaning up completed/errored upload`);
      uploadProgressStore.delete(id);
      continue;
    }
    const lastActivity = progress.lastHeartbeat || progress.startTime;
    if (progress.status !== "complete" && progress.status !== "error" && lastActivity < tenMinutesAgo) {
      console.log(`[${id}] Cleaning up stalled upload (no heartbeat for 10+ minutes)`);
      updateProgress(id, {
        status: "error",
        progress: 0,
        message: "Upload timed out due to inactivity",
        error: "Upload session expired due to inactivity"
      });
    }
  }
}, 6e4);
var updateProgress = (id, updates) => {
  const current = uploadProgressStore.get(id);
  if (current) {
    const updated = {
      ...current,
      ...updates,
      lastHeartbeat: Date.now()
      // Update heartbeat on every progress update
    };
    const mergedDetails = { ...current.details, ...updates.details };
    if (mergedDetails.uploadedBytes && mergedDetails.totalBytes) {
      const timeElapsed = (Date.now() - updated.startTime) / 1e3;
      const bytesUploaded = mergedDetails.uploadedBytes;
      if (timeElapsed > 0 && bytesUploaded > 0) {
        updated.speed = bytesUploaded / (1024 * 1024) / timeElapsed;
        const remainingBytes = mergedDetails.totalBytes - bytesUploaded;
        if (updated.speed > 0 && remainingBytes > 0) {
          updated.estimatedTimeRemaining = remainingBytes / (updated.speed * 1024 * 1024);
        }
      }
    }
    updated.details = mergedDetails;
    uploadProgressStore.set(id, updated);
  }
};
var initializeProgress = (id) => {
  uploadProgressStore.set(id, {
    id,
    status: "initializing",
    progress: 0,
    message: "Initializing upload...",
    startTime: Date.now(),
    lastHeartbeat: Date.now(),
    cancelled: false
  });
};
var isUploadCancelled = (id) => {
  const progress = uploadProgressStore.get(id);
  return progress?.cancelled === true;
};
var processUploadInBackground;
async function registerRoutes(app2) {
  app2.use("/uploads", express.static(path3.join(process.cwd(), "uploads")));
  app2.use(cors({
    origin: process.env.NODE_ENV === "production" ? false : true,
    // Allow all in development
    credentials: true,
    optionsSuccessStatus: 200
  }));
  const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1e3,
    // 5 minutes
    max: 300,
    // 300 requests per 5 minutes (~1 req/sec sustained)
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests for read-only endpoints to avoid penalizing normal browsing
    skip: (req) => {
      const isReadOnlyEndpoint = req.method === "GET" && (req.path.includes("/series") || req.path.includes("/chapters") || req.path.includes("/genres") || req.path.includes("/settings"));
      return isReadOnlyEndpoint;
    }
  });
  app2.use("/api", apiLimiter);
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 5,
    // 5 attempts per window
    message: { message: "Too many authentication attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
  });
  const commentLimiter = rateLimit({
    windowMs: 60 * 1e3,
    // 1 minute
    max: 10,
    // 10 comments per minute
    message: { message: "Too many comments, please slow down" },
    standardHeaders: true,
    legacyHeaders: false
  });
  const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1e3,
    // 1 hour
    max: 20,
    // 20 uploads per hour
    message: { message: "Upload limit reached, please try again later" },
    standardHeaders: true,
    legacyHeaders: false
  });
  const actionLimiter = rateLimit({
    windowMs: 60 * 1e3,
    // 1 minute
    max: 30,
    // 30 actions per minute
    message: { message: "Too many requests, please slow down" },
    standardHeaders: true,
    legacyHeaders: false
  });
  const csrfSecret = getOrCreateCsrfSecret();
  const {
    generateCsrfToken,
    doubleCsrfProtection
  } = doubleCsrf({
    getSecret: () => csrfSecret,
    getSessionIdentifier: (req) => "",
    // Stateless - no session binding for double-submit cookies
    cookieName: "psifi.x-csrf-token",
    cookieOptions: {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production"
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"]
  });
  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      // Strip all HTML tags
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  };
  processUploadInBackground = async (uploadId, filePath, chapterDataTemplate) => {
    try {
      console.log(`[${uploadId}] Starting background processing`);
      if (isUploadCancelled(uploadId)) {
        console.log(`[${uploadId}] Upload cancelled before processing started`);
        return;
      }
      updateProgress(uploadId, {
        status: "processing",
        progress: 30,
        message: "Starting chapter extraction and processing..."
      });
      const result = await atomicChapterUpload(uploadId, filePath, chapterDataTemplate);
      if (isUploadCancelled(uploadId)) {
        console.log(`[${uploadId}] Upload cancelled during processing`);
        return;
      }
      const { chapter: newChapter, extractionResult } = result;
      const { imageUrls } = extractionResult;
      console.log(`[${uploadId}] Chapter upload completed successfully`);
      updateProgress(uploadId, {
        status: "complete",
        progress: 100,
        message: `Chapter uploaded successfully! ${imageUrls.length} pages processed.`,
        totalFiles: imageUrls.length,
        processedFiles: imageUrls.length
      });
    } catch (error) {
      console.error(`[${uploadId}] Error in background processing:`, error);
      updateProgress(uploadId, {
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "Upload failed",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      try {
        await fsp.unlink(filePath);
        console.log(`[${uploadId}] Successfully cleaned up uploaded ZIP file: ${filePath}`);
      } catch (cleanupError) {
        console.warn(`[${uploadId}] Warning: Could not clean up uploaded ZIP file (${filePath}):`, cleanupError);
      }
    }
  };
  const adminAuth = async (req, res, next) => {
    try {
      let hasAdminAccess = false;
      if (req.session?.user) {
        const user = await storage.getUserByUsername(req.session.user.username);
        if (user) {
          hasAdminAccess = user.isAdmin === "true" || user.role === "owner" || user.role === "admin";
        }
      }
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      next();
    } catch (error) {
      console.error("Admin auth error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  app2.get("/api/csrf-token", (req, res) => {
    const csrfToken = generateCsrfToken(req, res);
    res.json({ csrfToken });
  });
  app2.get("/api/auth/user", async (req, res) => {
    try {
      if (req.session?.user) {
        const user = await storage.getUserByUsername(req.session.user.username);
        if (user) {
          const { password: _, ...safeUser } = user;
          const userWithAdminFlag = {
            ...safeUser,
            isAdmin: user.isAdmin === "true" || user.role === "owner" || user.role === "admin",
            role: user.role || (user.isAdmin === "true" ? "admin" : "user")
          };
          return res.json(userWithAdminFlag);
        }
      }
      return res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/signup", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const result = signupUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.errors
        });
      }
      const { username, password, email, profilePicture, country } = result.data;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const existingUser = await storage.getUserByUsername(username);
      let existingEmail = null;
      if (email) {
        existingEmail = await storage.getUserByEmail(email);
      }
      if (existingUser || existingEmail) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return res.status(400).json({ message: "Unable to create account. Please try different credentials." });
      }
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log("Creating user with data:", { username, email, profilePicture: profilePicture ? "DATA_PROVIDED" : null, country });
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email: email || null,
        profilePicture: profilePicture || null,
        country: country || null
      });
      console.log("Created user:", { ...user, password: "HIDDEN" });
      if (user.email) {
        try {
          const token = await storage.createEmailVerificationToken(user.id);
          const baseUrl = req.protocol + "://" + req.get("host");
          const verificationUrl = `${baseUrl}/verify-email?token=${token.token}`;
          const emailHtml = generateVerificationEmailHtml(user.username || "User", verificationUrl);
          await sendEmail({
            to: user.email,
            subject: "Verify Your Email - MangaVerse",
            text: `Welcome to MangaVerse! Please verify your email by clicking this link: ${verificationUrl}`,
            html: emailHtml
          });
          console.log(`Verification email sent to ${user.email}`);
        } catch (emailError) {
          console.error("Error sending verification email:", emailError);
        }
      }
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        message: "Account created successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/login", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const result = loginUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.errors
        });
      }
      const { username, password } = result.data;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      let sessionRegenerationAttempts = 0;
      const maxRetries = 3;
      let sessionRegeneratedSuccessfully = false;
      while (sessionRegenerationAttempts < maxRetries) {
        try {
          await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
              if (err) {
                console.error(`Session regeneration attempt ${sessionRegenerationAttempts + 1} failed:`, err);
                reject(err);
              } else {
                resolve();
              }
            });
          });
          sessionRegeneratedSuccessfully = true;
          break;
        } catch (error) {
          sessionRegenerationAttempts++;
          if (sessionRegenerationAttempts >= maxRetries) {
            console.error(`SECURITY WARNING: Session regeneration failed after ${maxRetries} attempts`);
            return res.status(500).json({
              message: "Login failed due to session error. Please try again.",
              error: "SESSION_REGENERATION_FAILED"
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      const { password: _, ...safeUser } = user;
      req.session.userId = user.id;
      req.session.user = safeUser;
      res.json({
        message: "Login successful",
        user: {
          ...safeUser,
          isAdmin: user.isAdmin === "true"
        }
      });
    } catch (error) {
      const errorObj = error;
      console.error("Login error details:", {
        error: errorObj.message,
        stack: errorObj.stack,
        username: req.body?.username,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        errorType: errorObj.constructor.name
      });
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", doubleCsrfProtection, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("auth.sid", {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
      });
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ user: req.session.user });
  });
  app2.post("/api/auth/request-verification", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.emailVerified === "true") {
        return res.status(400).json({ message: "Email already verified" });
      }
      if (!user.email) {
        return res.status(400).json({ message: "No email address associated with this account" });
      }
      const token = await storage.createEmailVerificationToken(user.id);
      const baseUrl = req.protocol + "://" + req.get("host");
      const verificationUrl = `${baseUrl}/verify-email?token=${token.token}`;
      const emailHtml = generateVerificationEmailHtml(user.username || "User", verificationUrl);
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - MangaVerse",
        text: `Welcome to MangaVerse! Please verify your email by clicking this link: ${verificationUrl}`,
        html: emailHtml
      });
      res.json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Error requesting email verification:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });
  app2.post("/api/auth/verify-email", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
      }
      const verificationToken = await storage.getEmailVerificationToken(token);
      if (!verificationToken) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      if (new Date(verificationToken.expiresAt) < /* @__PURE__ */ new Date()) {
        await storage.deleteEmailVerificationToken(token);
        return res.status(400).json({ message: "Verification token has expired" });
      }
      await storage.markEmailAsVerified(verificationToken.userId);
      await storage.deleteEmailVerificationToken(token);
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });
  app2.post("/api/auth/forgot-password", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return res.json({ message: "If an account with that email exists, a password reset link has been sent" });
      }
      const token = await storage.createPasswordResetToken(user.id);
      const baseUrl = req.protocol + "://" + req.get("host");
      const resetUrl = `${baseUrl}/reset-password?token=${token.token}`;
      const emailHtml = generatePasswordResetEmailHtml(user.username || "User", resetUrl);
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - MangaVerse",
        text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
        html: emailHtml
      });
      res.json({ message: "If an account with that email exists, a password reset link has been sent" });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });
  app2.post("/api/auth/verify-reset-token", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Reset token is required" });
      }
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      if (resetToken.used === "true") {
        return res.status(400).json({ message: "Reset token has already been used" });
      }
      if (new Date(resetToken.expiresAt) < /* @__PURE__ */ new Date()) {
        await storage.deletePasswordResetToken(token);
        return res.status(400).json({ message: "Reset token has expired" });
      }
      res.json({ message: "Token is valid" });
    } catch (error) {
      console.error("Error verifying reset token:", error);
      res.status(500).json({ message: "Failed to verify reset token" });
    }
  });
  app2.post("/api/auth/reset-password", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      if (resetToken.used === "true") {
        return res.status(400).json({ message: "Reset token has already been used" });
      }
      if (new Date(resetToken.expiresAt) < /* @__PURE__ */ new Date()) {
        await storage.deletePasswordResetToken(token);
        return res.status(400).json({ message: "Reset token has expired" });
      }
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await storage.resetUserPassword(resetToken.userId, hashedPassword);
      await storage.markPasswordResetTokenAsUsed(token);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
  const dmcaNoticeSchema = z2.object({
    fullName: z2.string().min(1, "Full name is required").max(100),
    email: z2.string().email("Valid email is required"),
    phone: z2.string().min(1, "Phone number is required").max(30),
    copyrightWork: z2.string().min(10, "Description of copyrighted work is required").max(2e3),
    infringingUrl: z2.string().url("Valid URL is required"),
    description: z2.string().max(5e3).optional(),
    signature: z2.string().min(1, "Electronic signature is required").max(100),
    goodFaithDeclaration: z2.boolean().refine((val) => val === true, {
      message: "You must declare good faith belief under 17 U.S.C. \xA7512(c)(3)(A)(v)"
    }),
    accuracyDeclaration: z2.boolean().refine((val) => val === true, {
      message: "You must declare accuracy under penalty of perjury per 17 U.S.C. \xA7512(c)(3)(A)(vi)"
    })
  });
  app2.post("/api/dmca/submit", authLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      const result = dmcaNoticeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.errors
        });
      }
      const { fullName, email, phone, copyrightWork, infringingUrl, description, signature, goodFaithDeclaration, accuracyDeclaration } = result.data;
      const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
      const notice = await storage.createDmcaNotice({
        fullName,
        email,
        phone,
        copyrightWork,
        infringingUrl,
        description: description || null,
        signature,
        ipAddress: typeof ipAddress === "string" ? ipAddress : ipAddress[0],
        goodFaithDeclaration: goodFaithDeclaration ? "true" : "false",
        accuracyDeclaration: accuracyDeclaration ? "true" : "false",
        status: "pending"
      });
      res.json({
        message: "Your DMCA takedown notice has been received. We will review it within 48-72 hours.",
        noticeId: notice.id
      });
    } catch (error) {
      console.error("Error submitting DMCA notice:", error);
      res.status(500).json({ message: "Failed to submit DMCA notice" });
    }
  });
  app2.get("/api/admin/dmca", adminAuth, async (req, res) => {
    try {
      const notices = await storage.getAllDmcaNotices();
      res.json(notices);
    } catch (error) {
      console.error("Error fetching DMCA notices:", error);
      res.status(500).json({ message: "Failed to fetch DMCA notices" });
    }
  });
  app2.patch("/api/admin/dmca/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reviewNotes } = req.body;
      if (!["pending", "under_review", "completed", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const userId = req.session?.user?.id;
      const notice = await storage.updateDmcaNoticeStatus(id, status, reviewNotes, userId);
      if (!notice) {
        return res.status(404).json({ message: "DMCA notice not found" });
      }
      res.json({ message: "DMCA notice updated successfully", notice });
    } catch (error) {
      console.error("Error updating DMCA notice:", error);
      res.status(500).json({ message: "Failed to update DMCA notice" });
    }
  });
  const updateProfileSchema = z2.object({
    username: z2.string().min(3).max(30).optional(),
    email: z2.string().email().optional(),
    firstName: z2.string().min(1).max(50).optional(),
    lastName: z2.string().min(1).max(50).optional(),
    country: z2.string().max(50).optional()
  });
  const changePasswordSchema = z2.object({
    oldPassword: z2.string().min(1),
    newPassword: z2.string().min(8).max(100)
  });
  const profilePictureDir = path3.join(process.cwd(), "uploads", "profiles");
  const ensureProfilePictureDir = async () => {
    try {
      await fsp.access(profilePictureDir);
    } catch {
      await fsp.mkdir(profilePictureDir, { recursive: true });
    }
  };
  const profilePictureStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      await ensureProfilePictureDir();
      cb(null, profilePictureDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path3.extname(file.originalname).toLowerCase();
      cb(null, `profile-${uniqueSuffix}${extension}`);
    }
  });
  const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
      // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (allowedTypes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error("Only JPG, PNG, and WebP images are allowed!"));
      }
    }
  });
  app2.get("/api/user/profile", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...safeUser } = user;
      res.json({
        username: safeUser.username,
        email: safeUser.email,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        country: safeUser.country,
        profilePicture: safeUser.profilePicture,
        createdAt: safeUser.createdAt
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/user/profile", doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const validationResult = updateProfileSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors
        });
      }
      const updateData = validationResult.data;
      if (updateData.username && updateData.username !== req.session.user.username) {
        const existingUser = await storage.getUserByUsername(updateData.username);
        if (existingUser) {
          return res.status(409).json({ message: "Username already taken" });
        }
      }
      if (updateData.email && updateData.email !== req.session.user.email) {
        const existingEmailUser = await storage.getUserByEmail(updateData.email);
        if (existingEmailUser) {
          return res.status(409).json({ message: "Email already in use" });
        }
      }
      const currentUser = await storage.getUserByUsername(req.session.user.username);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await storage.updateUser(currentUser.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User update failed" });
      }
      const { password: _, ...safeUser } = updatedUser;
      req.session.user = safeUser;
      res.json({
        message: "Profile updated successfully",
        user: {
          username: safeUser.username,
          email: safeUser.email,
          firstName: safeUser.firstName,
          lastName: safeUser.lastName,
          country: safeUser.country,
          profilePicture: safeUser.profilePicture,
          createdAt: safeUser.createdAt
        }
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/user/profile-picture", doubleCsrfProtection, uploadProfilePicture.single("profilePicture"), async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const currentUser = await storage.getUserByUsername(req.session.user.username);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (currentUser.profilePicture) {
        try {
          const oldFileName = path3.basename(currentUser.profilePicture);
          const oldFilePath = path3.join(profilePictureDir, oldFileName);
          await fsp.unlink(oldFilePath);
        } catch (deleteError) {
          console.warn("Could not delete old profile picture:", deleteError);
        }
      }
      const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
      const updatedUser = await storage.updateUser(currentUser.id, {
        profilePicture: profilePictureUrl
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User update failed" });
      }
      const { password: _, ...safeUser } = updatedUser;
      req.session.user = safeUser;
      res.json({
        message: "Profile picture uploaded successfully",
        profilePicture: profilePictureUrl
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/user/password", doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const validationResult = changePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors
        });
      }
      const { oldPassword, newPassword } = validationResult.data;
      const currentUser = await storage.getUserByUsername(req.session.user.username);
      if (!currentUser || !currentUser.password) {
        return res.status(404).json({ message: "User not found or password not set" });
      }
      const isOldPasswordValid = await bcrypt.compare(oldPassword, currentUser.password);
      if (!isOldPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      const updatedUser = await storage.updateUser(currentUser.id, {
        password: hashedNewPassword
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "Password update failed" });
      }
      res.json({
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const safeUsers = users2.map((user) => {
        const { password: _, ...safeUser } = user;
        return {
          ...safeUser,
          isAdmin: user.isAdmin === "true",
          role: user.role || (user.isAdmin === "true" ? "admin" : "user")
          // Include role with fallback
        };
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/users-detailed", adminAuth, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const detailedUsers = await Promise.all(users2.map(async (user) => {
        const { password: _, ...safeUser } = user;
        const balance = await storage.getUserCurrencyBalance(user.id);
        const subscription = await storage.getUserActiveSubscription(user.id);
        let subscriptionPackage = null;
        if (subscription && subscription.packageId) {
          subscriptionPackage = await storage.getSubscriptionPackageById(subscription.packageId);
        }
        return {
          ...safeUser,
          isAdmin: user.isAdmin === "true",
          role: user.role || (user.isAdmin === "true" ? "admin" : "user"),
          currencyBalance: balance,
          subscription: subscription ? {
            packageId: subscription.packageId,
            packageName: subscriptionPackage?.name || "Unknown",
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd
          } : null
        };
      }));
      res.json(detailedUsers);
    } catch (error) {
      console.error("Error fetching detailed users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/users/search", adminAuth, async (req, res) => {
    try {
      const searchQuery = req.query.q;
      if (!searchQuery || searchQuery.trim() === "") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const allUsers = await storage.getAllUsers();
      const searchLower = searchQuery.toLowerCase();
      const matchedUsers = allUsers.filter(
        (user) => user.username && user.username.toLowerCase().includes(searchLower)
      );
      const detailedUsers = await Promise.all(matchedUsers.map(async (user) => {
        const { password: _, ...safeUser } = user;
        const balance = await storage.getUserCurrencyBalance(user.id);
        const subscription = await storage.getUserActiveSubscription(user.id);
        let subscriptionPackage = null;
        if (subscription && subscription.packageId) {
          subscriptionPackage = await storage.getSubscriptionPackageById(subscription.packageId);
        }
        return {
          ...safeUser,
          isAdmin: user.isAdmin === "true",
          role: user.role || (user.isAdmin === "true" ? "admin" : "user"),
          currencyBalance: balance,
          subscription: subscription ? {
            packageId: subscription.packageId,
            packageName: subscriptionPackage?.name || "Unknown",
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd
          } : null
        };
      }));
      res.json(detailedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const updateUserSchema = z2.object({
    firstName: z2.string().min(1).max(50).optional(),
    lastName: z2.string().min(1).max(50).optional(),
    email: z2.string().email().optional(),
    country: z2.string().max(50).optional(),
    username: z2.string().min(3).max(30).optional(),
    password: z2.string().min(8).max(100).optional()
  });
  app2.put("/api/admin/users/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors
        });
      }
      const updateData = validationResult.data;
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (existingUser.isAdmin === "true" && updateData.username && updateData.username !== existingUser.username) {
        return res.status(403).json({ message: "Cannot change admin user's username" });
      }
      if (updateData.password && updateData.password.trim() !== "") {
        const saltRounds = 12;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }
      const updatedUser = await storage.updateUser(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...safeUser } = updatedUser;
      const userWithAdminFlag = {
        ...safeUser,
        isAdmin: updatedUser.isAdmin === "true"
      };
      res.json({
        message: "User updated successfully",
        user: userWithAdminFlag
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/users/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.session.user?.username) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const currentUser = await storage.getUserByUsername(req.session.user.username);
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (targetUser.role === "owner" && currentUser.role !== "owner") {
        return res.status(403).json({ message: "Only the owner can delete owner accounts" });
      }
      if (targetUser.role === "owner") {
        const allOwners = await storage.getAllUsers();
        const ownerCount = allOwners.filter((u) => u.role === "owner").length;
        if (ownerCount <= 1) {
          return res.status(403).json({ message: "Cannot delete the last owner. Transfer ownership first." });
        }
      }
      if ((targetUser.isAdmin === "true" || targetUser.role === "admin") && currentUser.role !== "owner") {
        return res.status(403).json({ message: "Only the owner can delete admin accounts" });
      }
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User deletion failed" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/upload-progress/:uploadId", isStaff, async (req, res) => {
    try {
      const { uploadId } = req.params;
      const progress = uploadProgressStore.get(uploadId);
      if (!progress) {
        return res.status(404).json({
          message: "Upload not found",
          uploadId
        });
      }
      res.json({
        id: progress.id,
        status: progress.status,
        progress: progress.progress,
        message: progress.message,
        currentFile: progress.currentFile,
        totalFiles: progress.totalFiles,
        processedFiles: progress.processedFiles,
        startTime: progress.startTime,
        speed: progress.speed,
        estimatedTimeRemaining: progress.estimatedTimeRemaining,
        error: progress.error,
        details: progress.details
      });
    } catch (error) {
      console.error("Error fetching upload progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/upload-cancel/:uploadId", isStaff, doubleCsrfProtection, async (req, res) => {
    try {
      const { uploadId } = req.params;
      const progress = uploadProgressStore.get(uploadId);
      if (!progress) {
        return res.status(404).json({
          message: "Upload not found",
          uploadId
        });
      }
      if (progress.status === "complete" || progress.status === "error") {
        return res.status(400).json({
          message: "Upload cannot be cancelled - already finished",
          status: progress.status
        });
      }
      updateProgress(uploadId, {
        status: "error",
        progress: 0,
        message: "Upload cancelled by user",
        error: "Upload was cancelled by user",
        cancelled: true
      });
      console.log(`[${uploadId}] Upload cancelled by user request`);
      res.json({
        message: "Upload cancelled successfully",
        uploadId
      });
    } catch (error) {
      console.error("Error cancelling upload:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/series", adminAuth, async (req, res) => {
    try {
      const seriesList = await storage.getAllSeries();
      res.json(seriesList);
    } catch (error) {
      console.error("Error fetching series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/series", isStaff, doubleCsrfProtection, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = user.isAdmin === "true" || ["admin", "owner"].includes(user.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Forbidden: Admin or Owner access required to create series" });
      }
      const validationResult = insertSeriesSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors
        });
      }
      const seriesData = validationResult.data;
      const seriesDataForStorage = {
        ...seriesData,
        rating: seriesData.rating !== void 0 ? String(seriesData.rating) : void 0
      };
      const newSeries = await storage.createSeries(seriesDataForStorage);
      res.status(201).json({
        message: "Series created successfully",
        series: newSeries
      });
    } catch (error) {
      console.error("Error creating series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/admin/series/:id", isStaff, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const validationResult = updateSeriesSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors
        });
      }
      const updateData = validationResult.data;
      const existingSeries = await storage.getSeries(id);
      if (!existingSeries) {
        return res.status(404).json({ message: "Series not found" });
      }
      const updateDataForStorage = {
        ...updateData,
        rating: updateData.rating !== void 0 ? String(updateData.rating) : void 0,
        genres: updateData.genres !== void 0 ? JSON.stringify(updateData.genres) : void 0
      };
      const updatedSeries = await storage.updateSeries(id, updateDataForStorage);
      if (!updatedSeries) {
        return res.status(404).json({ message: "Series not found" });
      }
      res.json({
        message: "Series updated successfully",
        series: updatedSeries
      });
    } catch (error) {
      console.error("Error updating series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/series/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = user.isAdmin === "true" || ["admin", "owner"].includes(user.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Forbidden: Admin or Owner access required to delete series" });
      }
      const { id } = req.params;
      const seriesInfo = await storage.getSeries(id);
      if (!seriesInfo) {
        return res.status(404).json({ message: "Series not found" });
      }
      const seriesChapters = await storage.getChaptersBySeriesId(id);
      try {
        console.log(`[cleanup] Starting cleanup for series: ${seriesInfo.title} (${seriesChapters.length} chapters)`);
        let actualMangaName = null;
        if (seriesChapters.length > 0 && seriesChapters[0].pages && Array.isArray(seriesChapters[0].pages) && seriesChapters[0].pages.length > 0) {
          const firstPageUrl = seriesChapters[0].pages[0];
          console.log(`[cleanup] Analyzing first page URL: ${firstPageUrl}`);
          const urlParts = firstPageUrl.split("/");
          console.log(`[cleanup] URL parts:`, urlParts);
          if (urlParts.length >= 5 && urlParts[1] === "api" && urlParts[2] === "chapters" && urlParts[3] === "image") {
            actualMangaName = urlParts[4];
            console.log(`[cleanup] Extracted actual directory name from chapter data: ${actualMangaName}`);
          } else {
            console.log(`[cleanup] URL parsing failed - invalid format or insufficient parts`);
          }
        } else {
          console.log(`[cleanup] No chapters or pages found for directory name extraction`);
        }
        if (!actualMangaName) {
          console.log(`[cleanup] Attempting to find directory by scanning filesystem...`);
          try {
            const mangaBaseDir = path3.join(process.cwd(), "uploads", "manga");
            const existingDirs = await fsp.readdir(mangaBaseDir, { withFileTypes: true });
            const candidateNames = [
              sanitizeMangaName(seriesInfo.title)
              // Current title
              // Add other possible variations if we knew previous titles
            ];
            console.log(`[cleanup] Candidate directory names:`, candidateNames);
            console.log(`[cleanup] Existing directories:`, existingDirs.map((d) => d.name));
            for (const candidate of candidateNames) {
              const matchingDir = existingDirs.find((dir) => dir.isDirectory() && dir.name === candidate);
              if (matchingDir) {
                actualMangaName = candidate;
                console.log(`[cleanup] Found matching directory: ${actualMangaName}`);
                break;
              }
            }
          } catch (scanError) {
            console.warn(`[cleanup] Error scanning for directories:`, scanError);
          }
        }
        if (!actualMangaName) {
          actualMangaName = sanitizeMangaName(seriesInfo.title);
          console.log(`[cleanup] Using final fallback directory name from current title: ${actualMangaName}`);
        }
        const seriesDir = path3.join(process.cwd(), "uploads", "manga", actualMangaName);
        console.log(`[cleanup] Target series directory: ${seriesDir}`);
        for (const chapter of seriesChapters) {
          try {
            const chapterDir = path3.join(seriesDir, "chapters", chapter.chapterNumber);
            await fsp.rm(chapterDir, { recursive: true, force: true });
            console.log(`[cleanup] Deleted chapter directory: ${chapterDir}`);
          } catch (chapterCleanupError) {
            console.warn(`[cleanup] Warning: Could not clean up chapter ${chapter.chapterNumber}:`, chapterCleanupError);
          }
        }
        if (seriesInfo.coverImageUrl) {
          try {
            const coverFileName = path3.basename(seriesInfo.coverImageUrl);
            const coverImagePath = path3.join(process.cwd(), "uploads", "covers", coverFileName);
            await fsp.rm(coverImagePath, { force: true });
            console.log(`[cleanup] Deleted cover image: ${coverImagePath}`);
          } catch (coverCleanupError) {
            console.warn(`[cleanup] Warning: Could not clean up cover image:`, coverCleanupError);
          }
        }
        try {
          await fsp.rm(seriesDir, { recursive: true, force: true });
          console.log(`[cleanup] Deleted series directory: ${seriesDir}`);
        } catch (seriesDirCleanupError) {
          console.warn(`[cleanup] Warning: Could not clean up series directory:`, seriesDirCleanupError);
        }
      } catch (cleanupError) {
        console.warn("[cleanup] Warning: Could not clean up series files:", cleanupError);
      }
      const deleted = await storage.deleteSeries(id);
      if (!deleted) {
        return res.status(404).json({ message: "Series not found" });
      }
      res.json({ message: "Series deleted successfully" });
    } catch (error) {
      console.error("Error deleting series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/settings/public/ad-intensity", async (req, res) => {
    try {
      const levelSetting = await storage.getSetting("system", "ad_intensity_level");
      const enabledSetting = await storage.getSetting("system", "ads_enabled");
      const level = levelSetting ? parseInt(levelSetting.value) : 2;
      const enabled = enabledSetting ? enabledSetting.value === "true" : true;
      const descriptions = {
        1: "Light",
        2: "Moderate",
        3: "Heavy"
      };
      res.json({
        level,
        description: descriptions[level] || "Moderate",
        enabled
      });
    } catch (error) {
      console.error("Error fetching ad intensity:", error);
      res.json({ level: 2, description: "Moderate", enabled: true });
    }
  });
  app2.get("/api/admin/settings", isOwner, async (req, res) => {
    try {
      const { category } = req.query;
      let settings2;
      if (category && typeof category === "string") {
        settings2 = await storage.getSettingsByCategory(category);
      } else {
        settings2 = await storage.getAllSettings();
      }
      res.json(settings2);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.get("/api/admin/settings/:category", isOwner, async (req, res) => {
    try {
      const { category } = req.params;
      const settings2 = await storage.getSettingsByCategory(category);
      res.json(settings2);
    } catch (error) {
      console.error("Error fetching settings by category:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.get("/api/admin/settings/:category/:key", isOwner, async (req, res) => {
    try {
      const { category, key } = req.params;
      const setting = await storage.getSetting(category, key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  app2.put("/api/admin/settings/by-id/:id", isOwner, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const validation = updateSettingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid setting data",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
      const setting = await storage.updateSetting(id, validation.data);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });
  app2.put("/api/admin/settings/:category/:key", isOwner, doubleCsrfProtection, async (req, res) => {
    try {
      const { category, key } = req.params;
      const validation = settingValueSchema.safeParse({
        category,
        key,
        ...req.body
      });
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid setting data",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
      let { value, type, description, isPublic } = validation.data;
      let processedValue;
      try {
        switch (type) {
          case "number":
            const numValue = Number(value);
            if (isNaN(numValue)) {
              return res.status(400).json({ message: "Invalid number value" });
            }
            processedValue = String(numValue);
            break;
          case "boolean":
            if (typeof value === "string") {
              if (value === "true" || value === "false") {
                processedValue = value;
              } else {
                return res.status(400).json({ message: "Boolean value must be 'true' or 'false'" });
              }
            } else if (typeof value === "boolean") {
              processedValue = String(value);
            } else {
              return res.status(400).json({ message: "Invalid boolean value" });
            }
            break;
          case "json":
            if (typeof value === "object") {
              processedValue = JSON.stringify(value);
            } else if (typeof value === "string") {
              JSON.parse(value);
              processedValue = value;
            } else {
              return res.status(400).json({ message: "Invalid JSON value" });
            }
            break;
          default:
            processedValue = String(value);
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid value for specified type" });
      }
      const normalizedIsPublic = typeof isPublic === "boolean" ? isPublic : isPublic === "true";
      const setting = await storage.setSetting(
        category,
        key,
        processedValue,
        type,
        description,
        normalizedIsPublic
      );
      res.json(setting);
    } catch (error) {
      console.error("Error setting value:", error);
      res.status(500).json({ message: "Failed to set setting" });
    }
  });
  app2.delete("/api/admin/settings/:id", isOwner, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSetting(id);
      if (!success) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      console.error("Error deleting setting:", error);
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });
  app2.get("/api/admin/upload-config", isStaff, async (req, res) => {
    try {
      res.json({
        maxZipSizeMB: ZIP_LIMITS.UPLOAD_MAX_ZIP_MB,
        maxZipSizeBytes: ZIP_LIMITS.UPLOAD_MAX_ZIP_SIZE,
        maxArchiveFiles: ZIP_LIMITS.MAX_ENTRIES,
        maxFileSize: ZIP_LIMITS.MAX_FILE_SIZE,
        allowedExtensions: ZIP_LIMITS.ALLOWED_EXTENSIONS
      });
    } catch (error) {
      console.error("Error getting upload config:", error);
      res.status(500).json({ message: "Failed to get upload configuration" });
    }
  });
  const coversUploadDir = path3.join(process.cwd(), "uploads", "covers");
  try {
    await fsp.access(coversUploadDir);
  } catch {
    await fsp.mkdir(coversUploadDir, { recursive: true });
  }
  const coverImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, coversUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path3.extname(file.originalname).toLowerCase();
      cb(null, `cover-${uniqueSuffix}${extension}`);
    }
  });
  const upload = multer({
    storage: coverImageStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
      // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (allowedTypes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error("Only JPG, PNG, and WebP images are allowed!"));
      }
    }
  });
  app2.post("/api/admin/upload-cover", isStaff, doubleCsrfProtection, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const imageUrl = `/api/covers/${req.file.filename}`;
      res.json({
        message: "Image uploaded successfully",
        url: imageUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const adsUploadDir = path3.join(process.cwd(), "uploads", "ads");
  try {
    await fsp.access(adsUploadDir);
  } catch {
    await fsp.mkdir(adsUploadDir, { recursive: true });
  }
  const adImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, adsUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path3.extname(file.originalname).toLowerCase();
      cb(null, `ad-${uniqueSuffix}${extension}`);
    }
  });
  const adImageUpload = multer({
    storage: adImageStorage,
    limits: {
      fileSize: 10 * 1024 * 1024
      // 10MB limit for ads (higher quality images)
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (allowedTypes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error("Only JPG, PNG, WebP, and GIF images are allowed for ads!"));
      }
    }
  });
  app2.post("/api/admin/upload-ad-image", actionLimiter, isStaff, doubleCsrfProtection, adImageUpload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const deviceType = req.body.deviceType || "all";
      const imageUrl = `/api/ads/image/${req.file.filename}`;
      res.json({
        message: "Ad image uploaded successfully",
        url: imageUrl,
        filename: req.file.filename,
        deviceType,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error("Error uploading ad image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/ads/image/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      if (!/^ad-\d+-\d+\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) {
        return res.status(400).json({ message: "Invalid filename format or unsupported file type" });
      }
      const ext = path3.extname(filename).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif"
      };
      const contentType = mimeTypes[ext];
      if (!contentType) {
        return res.status(400).json({ message: "Unsupported file type" });
      }
      const adImagePath = path3.join(process.cwd(), "uploads", "ads", filename);
      try {
        await fsp.access(adImagePath);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.sendFile(adImagePath);
      } catch (fileError) {
        console.log(`[ad-404] Missing ad image in local storage: ${filename}`);
        return res.status(404).json({ message: "Ad image not found" });
      }
    } catch (error) {
      console.error("Error serving ad image:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  const getZipLimits = () => {
    const maxArchiveFiles = parseInt(process.env.MAX_ARCHIVE_FILES || "200", 10);
    const maxTotalBytes = parseInt(process.env.MAX_TOTAL_BYTES || (200 * 1024 * 1024).toString(), 10);
    const maxFileBytes = parseInt(process.env.MAX_FILE_BYTES || (10 * 1024 * 1024).toString(), 10);
    const uploadMaxZipMB = parseInt(process.env.UPLOAD_MAX_ZIP_MB || "200", 10);
    const uploadMaxZipBytes = uploadMaxZipMB * 1024 * 1024;
    if (isNaN(maxArchiveFiles) || maxArchiveFiles <= 0 || maxArchiveFiles > 1e3) {
      throw new Error("MAX_ARCHIVE_FILES must be a positive integer between 1 and 1000");
    }
    if (isNaN(maxTotalBytes) || maxTotalBytes <= 0 || maxTotalBytes > 1024 * 1024 * 1024) {
      throw new Error("MAX_TOTAL_BYTES must be a positive integer up to 1GB");
    }
    if (isNaN(maxFileBytes) || maxFileBytes <= 0 || maxFileBytes > 100 * 1024 * 1024) {
      throw new Error("MAX_FILE_BYTES must be a positive integer up to 100MB");
    }
    if (isNaN(uploadMaxZipMB) || uploadMaxZipMB <= 0 || uploadMaxZipMB > 1024) {
      throw new Error("UPLOAD_MAX_ZIP_MB must be a positive integer up to 1024MB (1GB)");
    }
    return {
      MAX_ENTRIES: maxArchiveFiles,
      MAX_TOTAL_SIZE: maxTotalBytes,
      MAX_FILE_SIZE: maxFileBytes,
      UPLOAD_MAX_ZIP_SIZE: uploadMaxZipBytes,
      UPLOAD_MAX_ZIP_MB: uploadMaxZipMB,
      MAX_FILENAME_LENGTH: 100,
      // Keep this static for now
      ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".tiff", ".tif"]
    };
  };
  const ZIP_LIMITS = getZipLimits();
  const sanitizeMangaName = (title) => {
    return title.replace(/[<>:"|?*\x00-\x1f]/g, "").replace(/[/\\]/g, "-").replace(/\s+/g, "_").substring(0, 50);
  };
  const chaptersUploadDir = path3.join(process.cwd(), "uploads", "chapters");
  try {
    await fsp.access(chaptersUploadDir);
  } catch {
    await fsp.mkdir(chaptersUploadDir, { recursive: true });
  }
  const chapterZipStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, chaptersUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `chapter-${uniqueSuffix}.zip`);
    }
  });
  const uploadChapterZip = multer({
    storage: chapterZipStorage,
    limits: {
      fileSize: ZIP_LIMITS.UPLOAD_MAX_ZIP_SIZE,
      // Use configurable ZIP upload limit
      files: 1
      // Only one file at a time
    },
    fileFilter: async (req, file, cb) => {
      try {
        const originalname = file.originalname || "";
        const mimetype = file.mimetype || "";
        if (!originalname || originalname.length === 0) {
          const error = new Error("Filename is required");
          error.code = "INVALID_FILENAME";
          return cb(error);
        }
        if (originalname.length > 255) {
          const error = new Error("Filename is too long (max 255 characters)");
          error.code = "INVALID_FILENAME";
          return cb(error);
        }
        if (/[<>:"|?*\x00-\x1f]/.test(originalname)) {
          const error = new Error("Filename contains invalid characters");
          error.code = "INVALID_FILENAME";
          return cb(error);
        }
        const ext = path3.extname(originalname).toLowerCase();
        const allowedExtensions = [".zip", ".cbz"];
        if (!allowedExtensions.includes(ext)) {
          const error = new Error(`Only ZIP and CBZ files are allowed. Received: ${ext || "no extension"}`);
          error.code = "LIMIT_UNEXPECTED_FILE";
          error.userAction = `Please select a ZIP or CBZ file. Supported extensions: ${allowedExtensions.join(", ")}`;
          return cb(error);
        }
        const allowedMimeTypes = [
          "application/zip",
          "application/x-zip-compressed",
          "application/x-zip",
          "application/octet-stream"
          // Browsers sometimes send this for ZIP files
        ];
        const dangerousMimeTypes = [
          "application/x-executable",
          "application/x-msdownload",
          "text/html",
          "text/javascript",
          "application/javascript"
        ];
        if (dangerousMimeTypes.includes(mimetype.toLowerCase())) {
          const error = new Error(`File type '${mimetype}' is not allowed for security reasons`);
          error.code = "SECURITY_VIOLATION";
          error.userAction = "Please upload only ZIP or CBZ files containing images";
          return cb(error);
        }
        if (!allowedMimeTypes.includes(mimetype)) {
          console.warn(`[Security] Unusual MIME type for ZIP file: ${mimetype}, filename: ${originalname}`);
          if (!ext.match(/\.(zip|cbz)$/i)) {
            const error = new Error(`Invalid file type. Expected ZIP/CBZ, received: ${mimetype}`);
            error.code = "LIMIT_UNEXPECTED_FILE";
            error.userAction = "Please ensure you are uploading a valid ZIP or CBZ file";
            return cb(error);
          }
        }
        const sanitizedName = path3.basename(originalname);
        if (sanitizedName !== originalname) {
          const error = new Error("Filenames with directory paths are not allowed");
          error.code = "SECURITY_VIOLATION";
          error.userAction = "Please ensure the filename does not contain directory paths";
          return cb(error);
        }
        console.log(`[Security] Accepted file upload: ${originalname}, size: ${file.size || "unknown"}, type: ${mimetype}`);
        cb(null, true);
      } catch (error) {
        console.error("[Security] FileFilter error:", error);
        const filterError = new Error("File validation failed");
        filterError.code = "VALIDATION_ERROR";
        filterError.userAction = "Please try uploading the file again or contact support";
        cb(filterError);
      }
    }
  });
  class ChapterUploadError extends Error {
    constructor(code, message, userAction, httpStatus = 400) {
      super(message);
      this.code = code;
      this.userAction = userAction;
      this.httpStatus = httpStatus;
      this.name = "ChapterUploadError";
    }
  }
  class SecurityError extends ChapterUploadError {
    constructor(message, userAction) {
      super("SECURITY_VIOLATION", message, userAction, 400);
      this.name = "SecurityError";
    }
  }
  class ValidationError extends ChapterUploadError {
    constructor(message, userAction) {
      super("VALIDATION_FAILED", message, userAction, 400);
      this.name = "ValidationError";
    }
  }
  class ExtractionError extends ChapterUploadError {
    constructor(message, userAction) {
      super("EXTRACTION_FAILED", message, userAction, 500);
      this.name = "ExtractionError";
    }
  }
  const sendChapterUploadError = (res, requestId, error) => {
    if (error instanceof ChapterUploadError) {
      return res.status(error.httpStatus).json({
        requestId,
        code: error.code,
        message: error.message,
        details: {
          userAction: error.userAction,
          errorType: error.name
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (error.code === "DUPLICATE_CHAPTER" && error.statusCode === 409) {
      return res.status(409).json({
        requestId,
        code: error.code,
        message: error.message,
        details: {
          ...error.details,
          errorType: "ConstraintViolation"
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (error.name === "ZodError" || error.issues) {
      const zodIssues = error.issues || error.errors || [];
      const detailedErrors = zodIssues.map((issue) => {
        const fieldPath = issue.path?.join(".") || "unknown";
        let userFriendlyMessage = issue.message;
        let actionRequired = "Please correct this field and try again";
        switch (fieldPath) {
          case "seriesId":
            actionRequired = "Please select a valid series from the dropdown";
            userFriendlyMessage = "Series ID is required or invalid";
            break;
          case "chapterNumber":
            actionRequired = 'Please enter a valid chapter number (e.g., "1", "1.5", "2")';
            userFriendlyMessage = "Chapter number must be provided and cannot be empty";
            break;
          case "title":
            actionRequired = "Please enter a chapter title or leave blank for auto-generation";
            break;
          case "pages":
            actionRequired = "Please ensure your ZIP file contains valid image files";
            userFriendlyMessage = "No valid pages found in uploaded file";
            break;
          default:
            if (issue.code === "invalid_type") {
              actionRequired = `Please provide a valid ${issue.expected} value for ${fieldPath}`;
            } else if (issue.code === "too_small") {
              actionRequired = `Please provide a larger value for ${fieldPath}`;
            } else if (issue.code === "too_big") {
              actionRequired = `Please provide a smaller value for ${fieldPath}`;
            }
        }
        return {
          field: fieldPath,
          message: userFriendlyMessage,
          code: issue.code,
          expected: issue.expected,
          received: issue.received,
          action: actionRequired
        };
      });
      return res.status(400).json({
        requestId,
        code: "VALIDATION_FAILED",
        message: "Chapter data validation failed",
        details: {
          validationErrors: detailedErrors,
          fieldCount: detailedErrors.length,
          summary: `${detailedErrors.length} validation error${detailedErrors.length !== 1 ? "s" : ""} found`
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        requestId,
        code: "FILE_TOO_LARGE",
        message: "Uploaded file exceeds size limit",
        details: {
          maxSize: "50MB",
          action: "Please upload a smaller ZIP file",
          tip: "Try compressing your images or reducing image quality"
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        requestId,
        code: "INVALID_FILE_TYPE",
        message: "Invalid file type uploaded",
        details: {
          allowedTypes: ["ZIP", "CBZ"],
          action: "Please upload a ZIP or CBZ file only",
          tip: "Ensure your file has the correct extension (.zip or .cbz)"
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    console.error("[chapter-upload] Unexpected error:", error);
    return res.status(500).json({
      requestId,
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred during upload",
      details: {
        action: "Please try again. If the issue persists, contact support",
        errorId: requestId
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  };
  const validateZipFile = async (zipPath) => {
    try {
      const buffer = Buffer.alloc(4);
      const fd = await fsp.open(zipPath, "r");
      await fd.read(buffer, 0, 4, 0);
      await fd.close();
      return buffer[0] === 80 && buffer[1] === 75 && buffer[2] === 3 && buffer[3] === 4;
    } catch {
      return false;
    }
  };
  const validateImageMagicBytes = (buffer, filename) => {
    if (!buffer || buffer.length < 4) {
      return {
        isValid: false,
        detectedType: null,
        error: "File too small or corrupted"
      };
    }
    if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
      const hasValidJpegMarker = buffer.length >= 4;
      return {
        isValid: hasValidJpegMarker,
        detectedType: "JPEG",
        error: hasValidJpegMarker ? void 0 : "Invalid JPEG header"
      };
    }
    if (buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10) {
      return {
        isValid: true,
        detectedType: "PNG"
      };
    }
    if (buffer.length >= 12 && buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80) {
      return {
        isValid: true,
        detectedType: "WebP"
      };
    }
    if (buffer.length >= 6 && buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56 && (buffer[4] === 55 || buffer[4] === 56) && buffer[5] === 97) {
      return {
        isValid: true,
        detectedType: buffer[4] === 55 ? "GIF87a" : "GIF89a"
      };
    }
    if (buffer.length >= 12 && buffer[4] === 102 && buffer[5] === 116 && buffer[6] === 121 && buffer[7] === 112 && // 'ftyp'
    buffer[8] === 97 && buffer[9] === 118 && buffer[10] === 105 && buffer[11] === 102) {
      return {
        isValid: true,
        detectedType: "AVIF"
      };
    }
    if (buffer.length >= 2 && buffer[0] === 66 && buffer[1] === 77) {
      return {
        isValid: true,
        detectedType: "BMP"
      };
    }
    if (buffer.length >= 4) {
      if (buffer[0] === 73 && buffer[1] === 73 && buffer[2] === 42 && buffer[3] === 0) {
        return {
          isValid: true,
          detectedType: "TIFF (LE)"
        };
      }
      if (buffer[0] === 77 && buffer[1] === 77 && buffer[2] === 0 && buffer[3] === 42) {
        return {
          isValid: true,
          detectedType: "TIFF (BE)"
        };
      }
    }
    let detectedType = "Unknown";
    if (buffer.length >= 4) {
      if (buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70) {
        detectedType = "PDF";
      } else if (buffer[0] === 80 && buffer[1] === 75) {
        detectedType = "ZIP archive";
      } else if (buffer[0] === 82 && buffer[1] === 97 && buffer[2] === 114) {
        detectedType = "RAR archive";
      } else if (buffer.every((byte) => byte >= 32 && byte <= 126 || byte === 9 || byte === 10 || byte === 13)) {
        detectedType = "Text file";
      } else if (buffer[0] === 77 && buffer[1] === 90) {
        detectedType = "Executable (PE)";
      } else if (buffer[0] === 127 && buffer[1] === 69 && buffer[2] === 76 && buffer[3] === 70) {
        detectedType = "Executable (ELF)";
      }
    }
    return {
      isValid: false,
      detectedType,
      error: `File '${filename}' is not a valid image file. Detected type: ${detectedType}. Only JPEG, PNG, WebP, GIF, AVIF, BMP, and TIFF images are allowed.`
    };
  };
  const detectSymlinksAndHardlinks = async (filePath) => {
    try {
      const stats = await fsp.lstat(filePath);
      if (stats.isSymbolicLink()) {
        return {
          isSafe: false,
          type: "symlink",
          error: `Symbolic link detected: ${path3.basename(filePath)}. Symlinks are not allowed for security reasons.`
        };
      }
      if (stats.nlink > 1) {
        return {
          isSafe: false,
          type: "hardlink",
          error: `Hard link detected: ${path3.basename(filePath)}. Hard links are not allowed for security reasons.`
        };
      }
      if (!stats.isFile()) {
        return {
          isSafe: false,
          type: "special",
          error: `Special file type detected: ${path3.basename(filePath)}. Only regular files are allowed.`
        };
      }
      return { isSafe: true };
    } catch (error) {
      return {
        isSafe: false,
        type: "error",
        error: `Failed to analyze file: ${path3.basename(filePath)}. ${error instanceof Error ? error.message : String(error)}`
      };
    }
  };
  const sanitizeZipPath = (entryPath, baseDir) => {
    const normalizedPath = path3.normalize(entryPath).replace(/^(\.\.[\/\\])+/, "");
    const filename = path3.basename(normalizedPath);
    if (filename.length === 0 || filename.length > ZIP_LIMITS.MAX_FILENAME_LENGTH) {
      return null;
    }
    if (/[<>:"|?*\x00-\x1f]/.test(filename) || filename === "." || filename === "..") {
      return null;
    }
    const outputPath = path3.join(baseDir, filename);
    if (!outputPath.startsWith(baseDir + path3.sep) && outputPath !== baseDir) {
      return null;
    }
    return outputPath;
  };
  const extractChapterZip = async (zipPath, seriesId, chapterNumber) => {
    const seriesInfo = await storage.getSeries(seriesId);
    if (!seriesInfo) {
      throw new ValidationError("Series not found", "The specified series does not exist");
    }
    const mangaName = sanitizeMangaName(seriesInfo.title);
    if (!await validateZipFile(zipPath)) {
      throw new ValidationError("Invalid ZIP file format", "Please ensure you are uploading a valid ZIP or CBZ file");
    }
    const tempDir = path3.join(chaptersUploadDir, "temp", `${Date.now()}-${Math.random()}`);
    const finalDir = path3.join(process.cwd(), "uploads", "manga", mangaName, "chapters", chapterNumber);
    let zipfile = null;
    let tempDirCreated = false;
    const cleanupResources = async () => {
      if (zipfile) {
        try {
          zipfile.close();
        } catch (e) {
          console.error("[cleanup] Error closing ZIP file:", e);
        }
        zipfile = null;
      }
      if (tempDirCreated) {
        try {
          await fsp.rm(tempDir, { recursive: true, force: true });
        } catch (e) {
          console.error("[cleanup] Error removing temp directory:", e);
        }
        tempDirCreated = false;
      }
    };
    try {
      await fsp.mkdir(tempDir, { recursive: true });
      tempDirCreated = true;
      const imageFiles = [];
      let totalUncompressedSize = 0;
      let entryCount = 0;
      await new Promise((resolve, reject) => {
        yauzl.open(zipPath, { lazyEntries: true }, (err, zf) => {
          if (err) return reject(err);
          zipfile = zf;
          const cleanup = () => {
            if (zipfile) {
              try {
                zipfile.close();
              } catch (e) {
                console.error("[cleanup] Error closing ZIP file in handler:", e);
              }
              zipfile = null;
            }
          };
          zipfile.readEntry();
          zipfile.on("entry", (entry) => {
            entryCount++;
            if (entryCount > ZIP_LIMITS.MAX_ENTRIES) {
              cleanup();
              return reject(new SecurityError(
                `ZIP contains too many files (${entryCount} > ${ZIP_LIMITS.MAX_ENTRIES})`,
                `Please limit your ZIP file to ${ZIP_LIMITS.MAX_ENTRIES} files or fewer`
              ));
            }
            if (/\/$/.test(entry.fileName)) {
              zipfile.readEntry();
              return;
            }
            if (entry.uncompressedSize > ZIP_LIMITS.MAX_FILE_SIZE) {
              cleanup();
              return reject(new SecurityError(
                `File too large: ${entry.fileName} (${entry.uncompressedSize} bytes > ${ZIP_LIMITS.MAX_FILE_SIZE} bytes)`,
                `Please ensure all files are smaller than ${Math.round(ZIP_LIMITS.MAX_FILE_SIZE / (1024 * 1024))}MB`
              ));
            }
            totalUncompressedSize += entry.uncompressedSize;
            if (totalUncompressedSize > ZIP_LIMITS.MAX_TOTAL_SIZE) {
              cleanup();
              return reject(new SecurityError(
                `ZIP total size exceeds limit (${totalUncompressedSize} bytes > ${ZIP_LIMITS.MAX_TOTAL_SIZE} bytes)`,
                `Please reduce the total size of your ZIP file to under ${Math.round(ZIP_LIMITS.MAX_TOTAL_SIZE / (1024 * 1024))}MB`
              ));
            }
            const ext = path3.extname(entry.fileName).toLowerCase();
            if (!ZIP_LIMITS.ALLOWED_EXTENSIONS.includes(ext)) {
              zipfile.readEntry();
              return;
            }
            const safePath = sanitizeZipPath(entry.fileName, tempDir);
            if (!safePath) {
              zipfile.readEntry();
              return;
            }
            zipfile.openReadStream(entry, (err2, readStream) => {
              if (err2) {
                cleanup();
                return reject(err2);
              }
              const writeStream = createWriteStream(safePath);
              let bytesWritten = 0;
              let fileBuffer = Buffer.alloc(0);
              let magicBytesValidated = false;
              readStream.on("data", (chunk) => {
                bytesWritten += chunk.length;
                if (bytesWritten > ZIP_LIMITS.MAX_FILE_SIZE) {
                  writeStream.destroy();
                  fsp.unlink(safePath).catch(() => {
                  });
                  cleanup();
                  return reject(new SecurityError(
                    `File size exceeded during extraction: ${entry.fileName}`,
                    `Please ensure all files are smaller than ${Math.round(ZIP_LIMITS.MAX_FILE_SIZE / (1024 * 1024))}MB`
                  ));
                }
                if (!magicBytesValidated) {
                  fileBuffer = Buffer.concat([fileBuffer, chunk]);
                  if (fileBuffer.length >= 12) {
                    const validationResult = validateImageMagicBytes(fileBuffer, entry.fileName);
                    if (!validationResult.isValid) {
                      writeStream.destroy();
                      fsp.unlink(safePath).catch(() => {
                      });
                      cleanup();
                      return reject(new ValidationError(
                        validationResult.error || `Invalid image file format: ${entry.fileName}`,
                        "Please ensure all files in the ZIP are valid images (JPEG, PNG, WebP, GIF)"
                      ));
                    }
                    magicBytesValidated = true;
                  }
                }
              });
              readStream.on("error", (err3) => {
                writeStream.destroy();
                fsp.unlink(safePath).catch(() => {
                });
                cleanup();
                reject(err3);
              });
              writeStream.on("error", (err3) => {
                fsp.unlink(safePath).catch(() => {
                });
                cleanup();
                reject(err3);
              });
              writeStream.on("close", async () => {
                try {
                  if (!magicBytesValidated && fileBuffer.length > 0) {
                    const validationResult = validateImageMagicBytes(fileBuffer, entry.fileName);
                    if (!validationResult.isValid) {
                      await fsp.unlink(safePath).catch(() => {
                      });
                      cleanup();
                      return reject(new ValidationError(
                        validationResult.error || `Invalid image file format: ${entry.fileName}`,
                        "Please ensure all files in the ZIP are valid images (JPEG, PNG, WebP, GIF)"
                      ));
                    }
                  }
                  const linkCheck = await detectSymlinksAndHardlinks(safePath);
                  if (!linkCheck.isSafe) {
                    await fsp.unlink(safePath).catch(() => {
                    });
                    cleanup();
                    return reject(new SecurityError(
                      linkCheck.error || `Security violation detected: ${entry.fileName}`,
                      "Please remove any symbolic links, hard links, or special files from your ZIP archive"
                    ));
                  }
                  const finalStats = await fsp.stat(safePath);
                  if (finalStats.size > ZIP_LIMITS.MAX_FILE_SIZE) {
                    await fsp.unlink(safePath).catch(() => {
                    });
                    cleanup();
                    return reject(new SecurityError(
                      `Extracted file size exceeds limit: ${entry.fileName} (${finalStats.size} bytes)`,
                      `Please ensure all files are smaller than ${Math.round(ZIP_LIMITS.MAX_FILE_SIZE / (1024 * 1024))}MB`
                    ));
                  }
                  imageFiles.push({
                    path: safePath,
                    originalName: entry.fileName,
                    size: finalStats.size
                  });
                  zipfile.readEntry();
                } catch (error) {
                  await fsp.unlink(safePath).catch(() => {
                  });
                  cleanup();
                  reject(error);
                }
              });
              readStream.pipe(writeStream);
            });
          });
          zipfile.on("end", () => {
            cleanup();
            resolve();
          });
          zipfile.on("error", (err2) => {
            cleanup();
            reject(err2);
          });
        });
      });
      if (imageFiles.length === 0) {
        throw new ValidationError(
          "No valid images found in ZIP file",
          "Please ensure your ZIP file contains valid image files (JPEG, PNG, WebP, GIF)"
        );
      }
      const sortResult = naturalSortWithConfidence(imageFiles);
      const sortedImageFiles = sortResult.sortedFiles;
      console.log(`[${Date.now()}] Natural sort result:`, {
        confidence: sortResult.confidence,
        requiresManualReorder: sortResult.requiresManualReorder,
        totalFiles: sortResult.metadata.totalFiles,
        hasNumericSequences: sortResult.metadata.hasNumericSequences,
        sequentialNumbers: sortResult.metadata.sequentialNumbers,
        gapCount: sortResult.metadata.gapCount
      });
      const imageUrls = [];
      const reorderedFiles = [];
      let coverImageUrl = "";
      for (let i = 0; i < sortedImageFiles.length; i++) {
        const file = sortedImageFiles[i];
        const ext = path3.extname(file.originalName).toLowerCase();
        const finalFileName = `page-${String(i + 1).padStart(3, "0")}${ext}`;
        const reorderedPath = path3.join(tempDir, finalFileName);
        await fsp.rename(file.path, reorderedPath);
        reorderedFiles.push(reorderedPath);
        const imageUrl = `/uploads/chapters/${seriesId}/${chapterNumber}/${finalFileName}`;
        imageUrls.push(imageUrl);
        if (i === 0) {
          coverImageUrl = imageUrl;
        }
      }
      const backupDir2 = `${finalDir}.backup-${Date.now()}`;
      let backupCreated = false;
      try {
        await fsp.mkdir(path3.dirname(finalDir), { recursive: true });
        try {
          await fsp.access(finalDir);
          await fsp.rename(finalDir, backupDir2);
          backupCreated = true;
        } catch (e) {
        }
        await fsp.rename(tempDir, finalDir);
        tempDirCreated = false;
        if (backupCreated) {
          await fsp.rm(backupDir2, { recursive: true, force: true });
          backupCreated = false;
        }
      } catch (atomicError) {
        if (backupCreated) {
          try {
            await fsp.rename(backupDir2, finalDir);
          } catch (rollbackError) {
            console.error("[atomic-rollback] Failed to restore backup:", rollbackError);
          }
        }
        throw atomicError;
      }
      return {
        imageUrls,
        coverImageUrl,
        naturalSortConfidence: sortResult.confidence,
        requiresManualReorder: sortResult.requiresManualReorder
      };
    } catch (error) {
      await cleanupResources();
      throw error;
    } finally {
      await cleanupResources();
      try {
        await fsp.unlink(zipPath);
      } catch (unlinkError) {
        console.warn("Failed to delete ZIP file:", unlinkError);
      }
    }
  };
  const extractChapterZipToStaging = async (zipPath, seriesId, chapterNumber, requestId) => {
    const seriesInfo = await storage.getSeries(seriesId);
    if (!seriesInfo) {
      throw new ValidationError("Series not found", "The specified series does not exist");
    }
    const mangaName = sanitizeMangaName(seriesInfo.title);
    if (!await validateZipFile(zipPath)) {
      throw new ValidationError("Invalid ZIP file format", "Please ensure you are uploading a valid ZIP or CBZ file");
    }
    const { uploadImage: uploadImage2 } = await Promise.resolve().then(() => (init_local_storage(), local_storage_exports));
    let zipfile = null;
    const cleanupZip = async () => {
      if (zipfile) {
        try {
          zipfile.close();
        } catch (e) {
          console.error("[cleanup] Error closing ZIP file:", e);
        }
        zipfile = null;
      }
    };
    try {
      const imageFiles = [];
      let totalUncompressedSize = 0;
      let entryCount = 0;
      await new Promise((resolve, reject) => {
        yauzl.open(zipPath, { lazyEntries: true }, (err, zf) => {
          if (err) return reject(err);
          zipfile = zf;
          const cleanup = () => {
            if (zipfile) {
              try {
                zipfile.close();
              } catch (e) {
                console.error("[cleanup] Error closing ZIP file in handler:", e);
              }
              zipfile = null;
            }
          };
          zipfile.readEntry();
          zipfile.on("entry", (entry) => {
            entryCount++;
            if (entryCount > ZIP_LIMITS.MAX_ENTRIES) {
              cleanup();
              return reject(new SecurityError(
                `ZIP contains too many files (${entryCount} > ${ZIP_LIMITS.MAX_ENTRIES})`,
                `Please limit your ZIP file to ${ZIP_LIMITS.MAX_ENTRIES} files or fewer`
              ));
            }
            if (/\/$/.test(entry.fileName)) {
              zipfile.readEntry();
              return;
            }
            if (entry.uncompressedSize > ZIP_LIMITS.MAX_FILE_SIZE) {
              cleanup();
              return reject(new SecurityError(
                `File too large: ${entry.fileName} (${entry.uncompressedSize} bytes > ${ZIP_LIMITS.MAX_FILE_SIZE} bytes)`,
                `Please ensure all files are smaller than ${Math.round(ZIP_LIMITS.MAX_FILE_SIZE / (1024 * 1024))}MB`
              ));
            }
            totalUncompressedSize += entry.uncompressedSize;
            if (totalUncompressedSize > ZIP_LIMITS.MAX_TOTAL_SIZE) {
              cleanup();
              return reject(new SecurityError(
                `ZIP total size exceeds limit (${totalUncompressedSize} bytes > ${ZIP_LIMITS.MAX_TOTAL_SIZE} bytes)`,
                `Please reduce the total size of your ZIP file to under ${Math.round(ZIP_LIMITS.MAX_TOTAL_SIZE / (1024 * 1024))}MB`
              ));
            }
            const ext = path3.extname(entry.fileName).toLowerCase();
            if (!ZIP_LIMITS.ALLOWED_EXTENSIONS.includes(ext)) {
              zipfile.readEntry();
              return;
            }
            zipfile.openReadStream(entry, (err2, readStream) => {
              if (err2) {
                cleanup();
                return reject(err2);
              }
              const chunks = [];
              let bytesRead = 0;
              let fileBuffer = Buffer.alloc(0);
              let magicBytesValidated = false;
              readStream.on("data", (chunk) => {
                bytesRead += chunk.length;
                if (bytesRead > ZIP_LIMITS.MAX_FILE_SIZE) {
                  readStream.destroy();
                  cleanup();
                  return reject(new SecurityError(
                    `File size exceeded during extraction: ${entry.fileName}`,
                    `Please ensure all files are smaller than ${Math.round(ZIP_LIMITS.MAX_FILE_SIZE / (1024 * 1024))}MB`
                  ));
                }
                if (!magicBytesValidated) {
                  fileBuffer = Buffer.concat([fileBuffer, chunk]);
                  if (fileBuffer.length >= 12) {
                    const validationResult = validateImageMagicBytes(fileBuffer, entry.fileName);
                    if (!validationResult.isValid) {
                      readStream.destroy();
                      cleanup();
                      return reject(new ValidationError(
                        validationResult.error || `Invalid image file format: ${entry.fileName}`,
                        "Please ensure all files in the ZIP are valid images (JPEG, PNG, WebP, GIF)"
                      ));
                    }
                    magicBytesValidated = true;
                  }
                }
                chunks.push(chunk);
              });
              readStream.on("error", (err3) => {
                cleanup();
                reject(err3);
              });
              readStream.on("end", () => {
                const buffer = Buffer.concat(chunks);
                imageFiles.push({
                  path: entry.fileName,
                  buffer,
                  originalName: entry.fileName,
                  size: buffer.length
                });
                zipfile.readEntry();
              });
            });
          });
          zipfile.on("end", () => {
            cleanup();
            resolve();
          });
          zipfile.on("error", (err2) => {
            cleanup();
            reject(err2);
          });
        });
      });
      const sortResult = naturalSortWithConfidence(imageFiles);
      const sortedImageFiles = sortResult.sortedFiles;
      console.log(`[${requestId}] Natural sort result:`, {
        confidence: sortResult.confidence,
        requiresManualReorder: sortResult.requiresManualReorder,
        totalFiles: sortResult.metadata.totalFiles
      });
      const imageUrls = [];
      let coverImageUrl = "";
      for (let i = 0; i < sortedImageFiles.length; i++) {
        const file = sortedImageFiles[i];
        const ext = path3.extname(file.originalName).toLowerCase();
        const finalFileName = `${mangaName}-ch${chapterNumber}-page${String(i + 1).padStart(3, "0")}${ext}`;
        await uploadImage2(file.buffer, finalFileName, "chapters");
        const imageUrl = `/api/chapters/image/${finalFileName}`;
        imageUrls.push(imageUrl);
        if (i === 0) {
          coverImageUrl = imageUrl;
        }
      }
      return {
        imageUrls,
        coverImageUrl,
        naturalSortConfidence: sortResult.confidence,
        requiresManualReorder: sortResult.requiresManualReorder
      };
    } catch (error) {
      await cleanupZip();
      throw error;
    }
  };
  const commitStagingToFinal = async (stagingDir, finalDir, requestId) => {
    const backupDir2 = `${finalDir}.backup-${Date.now()}`;
    let backupCreated = false;
    try {
      await fsp.mkdir(path3.dirname(finalDir), { recursive: true });
      try {
        await fsp.access(finalDir);
        await fsp.rename(finalDir, backupDir2);
        backupCreated = true;
        console.log(`[${requestId}] Backed up existing directory to ${backupDir2}`);
      } catch (accessError) {
      }
      await fsp.rename(stagingDir, finalDir);
      console.log(`[${requestId}] Committed staging to final location`);
      if (backupCreated) {
        await fsp.rm(backupDir2, { recursive: true, force: true });
      }
    } catch (commitError) {
      if (backupCreated) {
        try {
          await fsp.rename(backupDir2, finalDir);
          console.log(`[${requestId}] Restored from backup after commit failure`);
        } catch (rollbackError) {
          console.error(`[${requestId}] CRITICAL: Failed to restore backup:`, rollbackError);
        }
      }
      throw commitError;
    }
  };
  const atomicChapterUpload = async (requestId, zipPath, chapterData) => {
    let databaseChapterId = null;
    try {
      console.log(`[${requestId}] Starting atomic chapter upload to App Storage`);
      updateProgress(requestId, {
        status: "extracting",
        progress: 30,
        message: "Extracting and uploading ZIP file to App Storage..."
      });
      console.log(`[${requestId}] Phase 1: Extracting and uploading to App Storage`);
      const extractionResult = await extractChapterZipToStaging(zipPath, chapterData.seriesId, chapterData.chapterNumber, requestId);
      updateProgress(requestId, {
        status: "processing",
        progress: 60,
        message: "Files uploaded to App Storage successfully, validating...",
        totalFiles: extractionResult.imageUrls?.length || 0,
        processedFiles: extractionResult.imageUrls?.length || 0
      });
      const { imageUrls, coverImageUrl } = extractionResult;
      if (!imageUrls || imageUrls.length === 0) {
        throw new ValidationError(
          "No valid images found in ZIP file",
          "Please ensure your ZIP file contains valid image files (JPEG, PNG, WebP, GIF)"
        );
      }
      const parsedChapterData = insertChapterSchema.parse({
        ...chapterData,
        pages: imageUrls,
        coverImageUrl,
        requiresManualReorder: extractionResult.requiresManualReorder ? "true" : "false",
        naturalSortConfidence: extractionResult.naturalSortConfidence.toString()
      });
      updateProgress(requestId, {
        status: "finalizing",
        progress: 90,
        message: "Creating database record...",
        totalFiles: imageUrls.length,
        processedFiles: imageUrls.length
      });
      console.log(`[${requestId}] Phase 2: Creating database record with ${imageUrls.length} pages`);
      const newChapter = await storage.createChapter(parsedChapterData);
      databaseChapterId = newChapter.id;
      console.log(`[${requestId}] Atomic upload completed successfully`);
      return {
        chapter: newChapter,
        extractionResult,
        success: true
      };
    } catch (error) {
      console.error(`[${requestId}] Atomic upload failed, initiating rollback:`, error);
      if (databaseChapterId) {
        try {
          console.log(`[${requestId}] Rolling back database: deleting chapter ${databaseChapterId}`);
          const rollbackSuccess = await storage.deleteChapter(databaseChapterId);
          if (rollbackSuccess) {
            console.log(`[${requestId}] Database rollback completed successfully`);
          } else {
            console.error(`[${requestId}] Database rollback failed: chapter not found`);
          }
        } catch (dbRollbackError) {
          console.error(`[${requestId}] CRITICAL: Database rollback failed:`, dbRollbackError);
        }
      }
      throw error;
    }
  };
  app2.post("/api/admin/upload-chapter", uploadLimiter, isStaff, doubleCsrfProtection, (req, res, next) => {
    const requestId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    initializeProgress(requestId);
    req.uploadId = requestId;
    uploadChapterZip.single("zip")(req, res, (err) => {
      if (err) {
        updateProgress(requestId, {
          status: "error",
          progress: 0,
          message: "Upload failed",
          error: err.message
        });
        return sendChapterUploadError(res, requestId, err);
      }
      next();
    });
  }, async (req, res) => {
    const requestId = req.uploadId;
    let extractionCompleted = false;
    let extractionStarted = false;
    let chapterCreated = false;
    let tempFilesCreated = [];
    try {
      console.log(`[${requestId}] Chapter upload request started`);
      updateProgress(requestId, {
        status: "uploading",
        progress: 10,
        message: "File uploaded successfully, validating...",
        details: {
          uploadedBytes: req.file ? req.file.size : 0,
          totalBytes: req.file ? req.file.size : 0
        }
      });
      if (!req.file) {
        updateProgress(requestId, {
          status: "error",
          progress: 0,
          message: "No file provided",
          error: "No ZIP file provided"
        });
        return res.status(400).json({
          requestId,
          code: "MISSING_FILE",
          message: "No ZIP file provided",
          details: {
            action: "Please select a ZIP file containing chapter images"
          }
        });
      }
      updateProgress(requestId, {
        status: "processing",
        progress: 15,
        message: "Validating upload parameters..."
      });
      let { seriesId, chapterNumber, title } = req.body;
      seriesId = typeof seriesId === "string" ? seriesId.trim() : "";
      chapterNumber = typeof chapterNumber === "string" ? chapterNumber.trim() : "";
      title = typeof title === "string" ? title.trim() : "";
      if (!seriesId || !chapterNumber) {
        await fsp.unlink(req.file.path).catch(() => {
        });
        updateProgress(requestId, {
          status: "error",
          progress: 0,
          message: "Missing required fields",
          error: "Series ID and chapter number are required"
        });
        return res.status(400).json({
          requestId,
          code: "MISSING_REQUIRED_FIELDS",
          message: "Series ID and chapter number are required",
          details: {
            missingFields: {
              seriesId: !seriesId,
              chapterNumber: !chapterNumber
            },
            action: "Please provide both series ID and chapter number"
          }
        });
      }
      if (seriesId.length > 50) {
        await fsp.unlink(req.file.path).catch(() => {
        });
        return res.status(400).json({
          requestId,
          code: "INVALID_SERIES_ID",
          message: "Series ID is too long",
          details: {
            maxLength: 50,
            action: "Please provide a valid series ID"
          }
        });
      }
      if (chapterNumber.length > 20) {
        await fsp.unlink(req.file.path).catch(() => {
        });
        return res.status(400).json({
          requestId,
          code: "INVALID_CHAPTER_NUMBER",
          message: "Chapter number is too long",
          details: {
            maxLength: 20,
            action: "Please provide a valid chapter number (e.g., '1', '1.5', '2')"
          }
        });
      }
      if (title && title.length > 200) {
        await fsp.unlink(req.file.path).catch(() => {
        });
        return res.status(400).json({
          requestId,
          code: "INVALID_TITLE_LENGTH",
          message: "Chapter title is too long",
          details: {
            maxLength: 200,
            action: "Please shorten the chapter title or leave it blank"
          }
        });
      }
      console.log(`[${requestId}] Running pre-extraction validations`);
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        await fsp.unlink(req.file.path).catch(() => {
        });
        return res.status(404).json({
          requestId,
          code: "SERIES_NOT_FOUND",
          message: "Series not found",
          details: {
            seriesId,
            action: "Please verify the series ID exists and try again"
          }
        });
      }
      console.log(`[${requestId}] Checking for duplicate chapter: series=${seriesId}, chapter=${chapterNumber}`);
      const existingChapter = await storage.checkChapterExists(seriesId, chapterNumber);
      if (existingChapter) {
        await fsp.unlink(req.file.path).catch(() => {
        });
        return res.status(409).json({
          requestId,
          code: "DUPLICATE_CHAPTER",
          message: `Chapter ${chapterNumber} already exists for this series`,
          details: {
            seriesId,
            chapterNumber,
            existingChapterId: existingChapter.id,
            action: "Please choose a different chapter number or update the existing chapter",
            suggestion: "Consider using a decimal number (e.g., '1.5') for special chapters"
          }
        });
      }
      console.log(`[${requestId}] Pre-extraction validations passed`);
      updateProgress(requestId, {
        status: "processing",
        progress: 25,
        message: "Validation complete, preparing to extract files..."
      });
      const currentUser = req.session.user;
      const chapterDataTemplate = {
        seriesId,
        chapterNumber,
        title: title || void 0,
        isPublished: "true",
        uploadedBy: currentUser?.id || null
      };
      console.log(`[${requestId}] Validation complete, starting background processing`);
      res.status(202).json({
        uploadId: requestId,
        message: "Upload accepted, processing in background",
        status: "processing"
      });
      setImmediate(async () => {
        if (!req.file) {
          console.error(`[${requestId}] No file found in request`);
          updateProgress(requestId, {
            status: "error",
            progress: 0,
            message: "No file found in request",
            error: "File upload failed - no file received"
          });
          return;
        }
        await processUploadInBackground(requestId, req.file.path, chapterDataTemplate);
      });
    } catch (error) {
      console.error(`[${requestId}] Error in upload validation:`, error);
      updateProgress(requestId, {
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "Upload validation failed",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      if (req.file) {
        try {
          await fsp.unlink(req.file.path);
          console.log(`[${requestId}] Cleaned up uploaded ZIP file after validation error`);
        } catch (cleanupError) {
          console.error(`[${requestId}] Error cleaning up ZIP file:`, cleanupError);
        }
      }
      return sendChapterUploadError(res, requestId, error);
    }
  });
  app2.get("/api/series/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const series2 = await storage.getSeries(id);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      res.json(series2);
    } catch (error) {
      console.error("Error fetching series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/series/:seriesId/chapters", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const allChapters = await storage.getChaptersBySeriesId(seriesId);
      const publishedChapters = allChapters.filter((chapter) => chapter.isPublished === "true");
      const chaptersWithAccessInfo = await Promise.all(
        publishedChapters.map(async (chapter) => {
          const accessControl = await storage.getChapterAccessControl(chapter.id);
          let hasAccess = true;
          let isLocked = false;
          let accessType = "free";
          let unlockCost = 0;
          if (accessControl && accessControl.isActive === "true" && accessControl.accessType !== "free") {
            accessType = accessControl.accessType;
            unlockCost = accessControl.unlockCost;
            if (req.session?.userId) {
              const accessCheck = await storage.checkUserChapterAccess(req.session.userId, chapter.id);
              hasAccess = accessCheck.canAccess;
              isLocked = !accessCheck.canAccess;
            } else {
              hasAccess = false;
              isLocked = true;
            }
          }
          const chapterData = {
            ...chapter,
            isLocked,
            accessType,
            unlockCost
          };
          if (!hasAccess) {
            delete chapterData.pages;
          }
          return chapterData;
        })
      );
      res.json(chaptersWithAccessInfo);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/chapters/:chapterId", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      if (chapter.isPublished !== "true") {
        return res.status(404).json({ message: "Chapter not found" });
      }
      if (req.session?.userId) {
        const accessCheck = await storage.checkUserChapterAccess(req.session.userId, chapterId);
        if (!accessCheck.canAccess) {
          return res.status(403).json({
            message: accessCheck.reason || "You don't have access to this chapter",
            accessType: accessCheck.accessType,
            unlockCost: accessCheck.unlockCost,
            isUnlocked: false
          });
        }
      } else {
        const accessControl = await storage.getChapterAccessControl(chapterId);
        if (accessControl && accessControl.accessType !== "free" && accessControl.isActive === "true") {
          return res.status(401).json({
            message: "Please log in to access this chapter",
            accessType: accessControl.accessType,
            unlockCost: accessControl.unlockCost,
            requiresAuth: true
          });
        }
      }
      res.json(chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/chapters/:chapterId/access-info", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const accessControl = await storage.getChapterAccessControl(chapterId);
      if (!accessControl || accessControl.accessType === "free" || accessControl.isActive === "false") {
        return res.json({
          accessType: "free",
          unlockCost: 0,
          isActive: false
        });
      }
      res.json({
        accessType: accessControl.accessType,
        unlockCost: accessControl.unlockCost,
        isActive: accessControl.isActive === "true"
      });
    } catch (error) {
      console.error("Error fetching chapter access info:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const { q: query, genre, status, type } = req.query;
      if (!query && !genre && !status && !type) {
        return res.status(400).json({ message: "At least one search parameter is required" });
      }
      const searchQuery = typeof query === "string" ? query : "";
      const filters = {};
      if (typeof genre === "string" && genre) filters.genre = genre;
      if (typeof status === "string" && status) filters.status = status;
      if (typeof type === "string" && type) filters.type = type;
      const results = await storage.searchSeries(searchQuery, filters);
      res.json({
        query: searchQuery,
        filters,
        results,
        total: results.length
      });
    } catch (error) {
      console.error("Error searching series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/admin/chapters/:chapterId", isStaff, doubleCsrfProtection, async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { title, isPublished } = req.body;
      const existingChapter = await storage.getChapter(chapterId);
      if (!existingChapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const updateData = {};
      if (title !== void 0) updateData.title = title;
      if (isPublished !== void 0) updateData.isPublished = isPublished;
      const updatedChapter = await storage.updateChapter(chapterId, updateData);
      if (!updatedChapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      res.json({
        message: "Chapter updated successfully",
        chapter: updatedChapter
      });
    } catch (error) {
      console.error("Error updating chapter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/chapters/:chapterId", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const deleted = await storage.deleteChapter(chapterId);
      if (!deleted) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      try {
        if (chapter.pages && Array.isArray(chapter.pages)) {
          console.log(`[cleanup] Deleting ${chapter.pages.length} chapter images from local storage...`);
          for (const pageUrl of chapter.pages) {
            try {
              const filename = pageUrl.replace("/api/chapters/image/", "");
              await deleteImage(filename);
              console.log(`[cleanup] Deleted chapter image: ${filename}`);
            } catch (deleteError) {
              console.warn(`[cleanup] Warning: Could not delete image ${pageUrl}:`, deleteError);
            }
          }
          console.log(`[cleanup] Chapter images cleanup completed`);
        }
      } catch (cleanupError) {
        console.warn("Warning: Could not clean up chapter files:", cleanupError);
      }
      res.json({ message: "Chapter deleted successfully" });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/chapters", adminAuth, async (req, res) => {
    try {
      const { seriesId } = req.query;
      if (seriesId) {
        if (typeof seriesId !== "string") {
          return res.status(400).json({ message: "Invalid series ID" });
        }
        const series2 = await storage.getSeries(seriesId);
        if (!series2) {
          return res.status(404).json({ message: "Series not found" });
        }
        const chapters2 = await storage.getChaptersBySeriesId(seriesId);
        res.json(chapters2);
      } else {
        const chapters2 = await storage.getAllChapters();
        res.json(chapters2);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/chapters/:chapterId", adminAuth, async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/chapters/:chapterId/access", async (req, res) => {
    try {
      const { chapterId } = req.params;
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const accessCheck = await storage.checkUserChapterAccess(req.session.userId, chapterId);
      res.json({
        hasAccess: accessCheck.canAccess,
        accessType: accessCheck.accessType,
        unlockCost: accessCheck.unlockCost,
        isUnlocked: accessCheck.isUnlocked
      });
    } catch (error) {
      console.error("Error checking chapter access:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/chapters/:chapterId/unlock", doubleCsrfProtection, actionLimiter, async (req, res) => {
    try {
      const { chapterId } = req.params;
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const accessControl = await storage.getChapterAccessControl(chapterId);
      if (!accessControl || accessControl.accessType === "free") {
        return res.status(400).json({ message: "This chapter is free" });
      }
      const alreadyUnlocked = await storage.hasUserUnlockedChapter(req.session.userId, chapterId);
      if (alreadyUnlocked) {
        return res.status(400).json({ message: "Chapter already unlocked" });
      }
      const result = await storage.unlockChapterForUser(
        req.session.userId,
        chapterId,
        accessControl.unlockCost
      );
      if (!result.success) {
        return res.status(400).json({ message: result.error || "Failed to unlock chapter" });
      }
      res.json({
        success: true,
        newBalance: result.newBalance,
        costPaid: accessControl.unlockCost
      });
    } catch (error) {
      console.error("Error unlocking chapter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/chapters/:chapterId/access", adminAuth, async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const accessControl = await storage.getChapterAccessControl(chapterId);
      if (!accessControl) {
        return res.json({
          chapterId,
          accessType: "free",
          unlockCost: 0,
          isActive: "true"
        });
      }
      res.json(accessControl);
    } catch (error) {
      console.error("Error fetching chapter access control:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/chapters/:chapterId/access", adminAuth, doubleCsrfProtection, actionLimiter, async (req, res) => {
    try {
      const { chapterId } = req.params;
      const validatedData = updateChapterAccessControlSchema.parse(req.body);
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      if (!validatedData.accessType || validatedData.unlockCost === void 0) {
        return res.status(400).json({ message: "accessType and unlockCost are required" });
      }
      const accessControl = await storage.setChapterAccessControl(
        chapterId,
        validatedData.accessType,
        validatedData.unlockCost
      );
      res.json({
        success: true,
        accessControl
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error setting chapter access control:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/chapters/bulk-access", adminAuth, doubleCsrfProtection, actionLimiter, async (req, res) => {
    try {
      const { chapterIds, accessType, unlockCost } = req.body;
      if (!chapterIds || !Array.isArray(chapterIds) || chapterIds.length === 0) {
        return res.status(400).json({ message: "chapterIds array is required" });
      }
      const validatedData = updateChapterAccessControlSchema.parse({
        accessType,
        unlockCost
      });
      const results = [];
      for (const chapterId of chapterIds) {
        try {
          const accessControl = await storage.setChapterAccessControl(
            chapterId,
            validatedData.accessType ?? "free",
            validatedData.unlockCost ?? 0
          );
          results.push({ chapterId, success: true, accessControl });
        } catch (error) {
          results.push({ chapterId, success: false, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;
      if (successCount === 0) {
        return res.status(400).json({
          success: false,
          message: "All updates failed",
          results
        });
      }
      res.json({
        success: successCount === chapterIds.length,
        message: failureCount > 0 ? `Updated ${successCount} of ${chapterIds.length} chapters (${failureCount} failed)` : `Successfully updated ${successCount} chapters`,
        successCount,
        failureCount,
        results
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error in bulk chapter access update:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/stats", adminAuth, async (req, res) => {
    try {
      const stats = await storage.getSiteStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching site stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/recent-series", adminAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }
      const recentSeries = await storage.getRecentSeries(limit);
      res.json(recentSeries);
    } catch (error) {
      console.error("Error fetching recent series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/admin/users/:id/role", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const roleData = updateUserRoleSchema.parse(req.body);
      if (!req.session.user?.username) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const currentUser = await storage.getUserByUsername(req.session.user.username);
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const targetUser = await storage.getUserById(id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (targetUser.role === "owner" && currentUser.role !== "owner") {
        return res.status(403).json({ message: "Only the current owner can modify the owner's role" });
      }
      if (roleData.role === "owner") {
        if (currentUser.role !== "owner") {
          return res.status(403).json({ message: "Only the current owner can assign owner privileges" });
        }
        const existingOwner = await storage.getUserByRole("owner");
        if (existingOwner && existingOwner.id !== id) {
          return res.status(409).json({ message: "Only one owner can exist at a time. Please demote the current owner first." });
        }
      }
      if (targetUser.role === "owner" && roleData.role !== "owner") {
        const allUsers = await storage.getAllUsers();
        const ownerCount = allUsers.filter((u) => u.role === "owner").length;
        if (ownerCount <= 1) {
          return res.status(403).json({ message: "Cannot demote the last owner. Transfer ownership to another user first." });
        }
      }
      if ((roleData.role === "admin" || roleData.role === "owner") && currentUser.role !== "owner") {
        return res.status(403).json({ message: "Only the owner can assign admin or owner privileges" });
      }
      if (currentUser.id === id && currentUser.role === "owner" && roleData.role !== "owner") {
        return res.status(403).json({ message: "Owners cannot demote themselves. Transfer ownership to another user first." });
      }
      if (currentUser.id === id && currentUser.isAdmin === "true" && !["admin", "owner"].includes(roleData.role)) {
        return res.status(403).json({ message: "Cannot demote yourself from admin role" });
      }
      const updatedUser = await storage.updateUserRole(id, roleData.role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/sections/featured", async (req, res) => {
    try {
      const featuredSeries = await storage.getSeriesBySection("featured");
      res.json(featuredSeries);
    } catch (error) {
      console.error("Error fetching featured series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/sections/trending", async (req, res) => {
    try {
      const trendingSeries = await storage.getSeriesBySection("trending");
      res.json(trendingSeries);
    } catch (error) {
      console.error("Error fetching trending series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/sections/popular-today", async (req, res) => {
    try {
      const popularSeries = await storage.getSeriesBySection("popularToday");
      res.json(popularSeries);
    } catch (error) {
      console.error("Error fetching popular today series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/sections/latest-updates", async (req, res) => {
    try {
      const latestSeries = await storage.getSeriesBySection("latestUpdate");
      res.json(latestSeries);
    } catch (error) {
      console.error("Error fetching latest updates series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/sections/pinned", async (req, res) => {
    try {
      const pinnedSeries = await storage.getSeriesBySection("pinned");
      res.json(pinnedSeries);
    } catch (error) {
      console.error("Error fetching pinned series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/series", async (req, res) => {
    try {
      const allSeries = await storage.getAllSeries();
      res.json(allSeries);
    } catch (error) {
      console.error("Error fetching all series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/library/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const { status = "reading" } = req.body;
      const validStatuses = ["reading", "completed", "plan_to_read", "on_hold", "dropped"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const libraryItem = await storage.addToLibrary(user.id, seriesId, status);
      res.json(libraryItem);
    } catch (error) {
      if (error.message?.includes("already in your library")) {
        return res.status(409).json({ message: error.message });
      }
      console.error("Error adding to library:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/library/:seriesId/status", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const validStatuses = ["reading", "completed", "plan_to_read", "on_hold", "dropped"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const updatedItem = await storage.updateLibraryStatus(user.id, seriesId, status);
      if (!updatedItem) {
        return res.status(404).json({ message: "Series not in library" });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating library status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/library/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const removed = await storage.removeFromLibrary(user.id, seriesId);
      if (!removed) {
        return res.status(404).json({ message: "Series not in library" });
      }
      res.json({ message: "Series removed from library" });
    } catch (error) {
      console.error("Error removing from library:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/library", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const library = await storage.getUserLibrary(user.id);
      res.json(library);
    } catch (error) {
      console.error("Error fetching user library:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/library/check/:seriesId", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const inLibrary = await storage.isInLibrary(user.id, seriesId);
      res.json({ inLibrary });
    } catch (error) {
      console.error("Error checking library status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/follow/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const { notificationsEnabled } = req.body;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const follow = await storage.followSeries(
        user.id,
        seriesId,
        notificationsEnabled !== void 0 ? notificationsEnabled : true
      );
      res.json(follow);
    } catch (error) {
      if (error.message?.includes("already following")) {
        return res.status(409).json({ message: error.message });
      }
      console.error("Error following series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/follow/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const unfollowed = await storage.unfollowSeries(user.id, seriesId);
      if (!unfollowed) {
        return res.status(404).json({ message: "Series not in follows" });
      }
      res.json({ message: "Series unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/follow", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const follows = await storage.getUserFollows(user.id);
      res.json(follows);
    } catch (error) {
      console.error("Error fetching user follows:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/follow/check/:seriesId", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const status = await storage.isFollowing(user.id, seriesId);
      res.json(status);
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/follow/:seriesId/notifications", doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const notificationSchema = z2.object({ enabled: z2.boolean() });
      const validation = notificationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: validation.error.errors
        });
      }
      const { enabled } = validation.data;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const updated = await storage.updateFollowNotifications(user.id, seriesId, enabled);
      if (!updated) {
        return res.status(404).json({ message: "Follow not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating follow notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/series/:seriesId/followers", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const followerCount = await storage.getSeriesFollowerCount(seriesId);
      res.json({ count: followerCount });
    } catch (error) {
      console.error("Error getting follower count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/reading-lists", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const lists = await storage.getReadingLists(user.id);
      res.json(lists);
    } catch (error) {
      console.error("Error fetching reading lists:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/reading-lists", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const list = await storage.createReadingList(user.id, req.body);
      res.json(list);
    } catch (error) {
      console.error("Error creating reading list:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
  app2.patch("/api/reading-lists/:listId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { listId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const updated = await storage.updateReadingList(listId, user.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Reading list not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating reading list:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
  app2.delete("/api/reading-lists/:listId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { listId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const deleted = await storage.deleteReadingList(listId, user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Reading list not found" });
      }
      res.json({ message: "Reading list deleted successfully" });
    } catch (error) {
      console.error("Error deleting reading list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/reading-lists/:listId/items", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { listId } = req.params;
      const { seriesId } = req.body;
      if (!seriesId) {
        return res.status(400).json({ message: "Series ID is required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const item = await storage.addToReadingList(listId, seriesId, user.id);
      res.json(item);
    } catch (error) {
      console.error("Error adding to reading list:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
  app2.delete("/api/reading-lists/:listId/items/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { listId, seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const removed = await storage.removeFromReadingList(listId, seriesId, user.id);
      if (!removed) {
        return res.status(404).json({ message: "Item not found in reading list" });
      }
      res.json({ message: "Item removed from reading list" });
    } catch (error) {
      console.error("Error removing from reading list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/reading-lists/:listId/items", async (req, res) => {
    try {
      const { listId } = req.params;
      const list = await storage.getReadingListById(listId);
      if (!list) {
        return res.status(404).json({ message: "Reading list not found" });
      }
      if (list.visibility === "private") {
        if (!req.session?.user) {
          return res.status(401).json({ message: "Authentication required" });
        }
        const user = await storage.getUserByUsername(req.session.user.username);
        if (!user || list.userId !== user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      const items = await storage.getReadingListItems(listId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching reading list items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/ratings/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const { rating, review } = req.body;
      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: "Rating must be between 1 and 10" });
      }
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const userRating = await storage.createOrUpdateUserRating(user.id, seriesId, rating, review || null);
      res.json(userRating);
    } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/ratings/:seriesId/user", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const userRating = await storage.getUserRating(user.id, seriesId);
      res.json(userRating || null);
    } catch (error) {
      console.error("Error fetching user rating:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/ratings/:seriesId", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const ratings = await storage.getSeriesRatings(seriesId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching series ratings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/ratings/:seriesId/stats", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const ratings = await storage.getSeriesRatings(seriesId);
      const average = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
      const stats = {
        average: Math.round(average * 10) / 10,
        count: ratings.length
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching rating stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/ratings/:seriesId", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const deleted = await storage.deleteUserRating(user.id, seriesId);
      if (!deleted) {
        return res.status(404).json({ message: "Rating not found" });
      }
      res.json({ message: "Rating deleted successfully" });
    } catch (error) {
      console.error("Error deleting rating:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/report", adminAuth, async (req, res) => {
    try {
      const stats = await storage.getSiteStats();
      const allUsers = await storage.getAllUsers();
      const allSeries = await storage.getAllSeries();
      const adminCount = allUsers.filter((user) => user.isAdmin === "true").length;
      const usersByRole = allUsers.reduce((acc, user) => {
        const role = user.role || "user";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      const seriesByStatus = allSeries.reduce((acc, series2) => {
        acc[series2.status] = (acc[series2.status] || 0) + 1;
        return acc;
      }, {});
      const seriesByType = allSeries.reduce((acc, series2) => {
        acc[series2.type] = (acc[series2.type] || 0) + 1;
        return acc;
      }, {});
      const featuredCount = allSeries.filter((series2) => series2.isFeatured === "true").length;
      const trendingCount = allSeries.filter((series2) => series2.isTrending === "true").length;
      const report = {
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        summary: {
          totalUsers: stats.totalUsers,
          totalSeries: stats.totalSeries,
          adminUsers: adminCount,
          featuredSeries: featuredCount,
          trendingSeries: trendingCount
        },
        userAnalytics: {
          byRole: usersByRole,
          recentUsers: allUsers.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 10).map((user) => ({
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
          }))
        },
        seriesAnalytics: {
          byStatus: seriesByStatus,
          byType: seriesByType,
          recentSeries: allSeries.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 10).map((series2) => ({
            title: series2.title,
            author: series2.author,
            type: series2.type,
            status: series2.status,
            createdAt: series2.createdAt
          }))
        }
      };
      res.json(report);
    } catch (error) {
      console.error("Error generating admin report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });
  app2.post("/api/admin/backup", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { spawn } = await import("child_process");
      const backupName = req.body.name || "admin-backup";
      const backup = spawn("npx", ["tsx", "scripts/db-backup.ts", backupName], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let output = "";
      let errorOutput = "";
      backup.stdout.on("data", (data) => {
        output += data.toString();
      });
      backup.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });
      backup.on("close", (code) => {
        if (code === 0) {
          const filenameMatch = output.match(/Backup saved as: (.+)/);
          const filename = filenameMatch ? filenameMatch[1] : "backup created";
          res.json({
            message: "Database backup created successfully",
            filename,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        } else {
          console.error("Backup script error:", errorOutput);
          res.status(500).json({
            message: "Failed to create backup",
            error: errorOutput || "Backup process failed"
          });
        }
      });
      backup.on("error", (error) => {
        console.error("Backup spawn error:", error);
        res.status(500).json({
          message: "Failed to start backup process",
          error: error.message
        });
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });
  app2.get("/api/admin/analytics", adminAuth, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allSeries = await storage.getAllSeries();
      const now = /* @__PURE__ */ new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const newUsersLast30Days = allUsers.filter(
        (user) => user.createdAt && new Date(user.createdAt) >= thirtyDaysAgo
      ).length;
      const newUsersLast7Days = allUsers.filter(
        (user) => user.createdAt && new Date(user.createdAt) >= sevenDaysAgo
      ).length;
      const newSeriesLast30Days = allSeries.filter(
        (series2) => series2.createdAt && new Date(series2.createdAt) >= thirtyDaysAgo
      ).length;
      const newSeriesLast7Days = allSeries.filter(
        (series2) => series2.createdAt && new Date(series2.createdAt) >= sevenDaysAgo
      ).length;
      const userGrowthRate = allUsers.length > 0 ? newUsersLast30Days / allUsers.length * 100 : 0;
      const seriesGrowthRate = allSeries.length > 0 ? newSeriesLast30Days / allSeries.length * 100 : 0;
      const genrePopularity = allSeries.reduce((acc, series2) => {
        if (series2.genres) {
          try {
            const genres = JSON.parse(series2.genres);
            if (Array.isArray(genres)) {
              genres.forEach((genre) => {
                acc[genre] = (acc[genre] || 0) + 1;
              });
            }
          } catch (e) {
          }
        }
        return acc;
      }, {});
      const dailyActivity = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1e3);
        return {
          date: date.toISOString().split("T")[0],
          users: Math.floor(Math.random() * 50) + 10,
          // Simulated
          views: Math.floor(Math.random() * 500) + 100
          // Simulated
        };
      }).reverse();
      const analytics = {
        overview: {
          totalUsers: allUsers.length,
          totalSeries: allSeries.length,
          newUsersLast30Days,
          newUsersLast7Days,
          newSeriesLast30Days,
          newSeriesLast7Days,
          userGrowthRate: Math.round(userGrowthRate * 100) / 100,
          seriesGrowthRate: Math.round(seriesGrowthRate * 100) / 100
        },
        genrePopularity: Object.entries(genrePopularity).sort(([, a], [, b]) => b - a).slice(0, 10).map(([genre, count]) => ({ genre, count })),
        dailyActivity,
        userDistribution: {
          byRole: allUsers.reduce((acc, user) => {
            const role = user.role || "user";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
          }, {})
        },
        seriesDistribution: {
          byStatus: allSeries.reduce((acc, series2) => {
            acc[series2.status] = (acc[series2.status] || 0) + 1;
            return acc;
          }, {}),
          byType: allSeries.reduce((acc, series2) => {
            acc[series2.type] = (acc[series2.type] || 0) + 1;
            return acc;
          }, {})
        }
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error generating analytics:", error);
      res.status(500).json({ message: "Failed to generate analytics" });
    }
  });
  function generatePlaceholderSVG(filename) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(45,27,61);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(26,22,37);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="28" fill="#9333ea" text-anchor="middle" dominant-baseline="middle">
    Page Not Available
  </text>
  <text x="50%" y="52%" font-family="Arial, sans-serif" font-size="16" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle">
    ${filename}
  </text>
  <text x="50%" y="58%" font-family="Arial, sans-serif" font-size="14" fill="#71717a" text-anchor="middle" dominant-baseline="middle">
    This page is missing from the chapter
  </text>
  <rect x="350" y="520" width="100" height="100" rx="10" fill="#2d1b3d" stroke="#9333ea" stroke-width="2"/>
  <path d="M 380 550 L 420 550 L 420 570 L 380 570 Z M 390 575 L 390 590 M 410 575 L 410 590" stroke="#9333ea" stroke-width="3" fill="none"/>
</svg>`;
  }
  function generateCoverPlaceholderSVG() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(45,27,61);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(26,22,37);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#coverGrad)"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#9333ea" text-anchor="middle" dominant-baseline="middle">
    No Cover
  </text>
  <text x="50%" y="52%" font-family="Arial, sans-serif" font-size="16" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle">
    Upload a cover image in admin panel
  </text>
  <g transform="translate(250, 300)">
    <rect x="0" y="0" width="100" height="140" rx="8" fill="#2d1b3d" stroke="#9333ea" stroke-width="3"/>
    <rect x="15" y="15" width="70" height="80" rx="4" fill="#1a1625" stroke="#9333ea" stroke-width="2"/>
    <circle cx="50" cy="40" r="12" fill="#9333ea"/>
    <path d="M 15 80 L 35 60 L 55 75 L 75 55 L 85 65 L 85 95 L 15 95 Z" fill="#9333ea" opacity="0.6"/>
    <rect x="15" y="105" width="70" height="8" rx="2" fill="#9333ea" opacity="0.4"/>
    <rect x="15" y="118" width="50" height="6" rx="2" fill="#9333ea" opacity="0.3"/>
  </g>
</svg>`;
  }
  app2.get("/api/chapters/image/*", async (req, res) => {
    try {
      const fullPath = req.params[0];
      if (!/^[a-zA-Z0-9_\-.\s()\[\]!\/]+\.(jpg|jpeg|png|webp|gif|avif|bmp|tiff|tif)$/i.test(fullPath)) {
        return res.status(400).json({ message: "Invalid filename format or unsupported file type" });
      }
      if (fullPath.includes("..") || fullPath.includes("//")) {
        return res.status(400).json({ message: "Invalid path" });
      }
      const { getImageBuffer: getImageBuffer2 } = await Promise.resolve().then(() => (init_local_storage(), local_storage_exports));
      const ext = path3.extname(fullPath).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif"
      };
      const contentType = mimeTypes[ext];
      if (!contentType) {
        return res.status(400).json({ message: "Unsupported file type" });
      }
      try {
        const storageKey = `chapters/${fullPath}`;
        const imageBuffer = await getImageBuffer2(storageKey);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Content-Length", imageBuffer.length.toString());
        res.send(imageBuffer);
      } catch (storageError) {
        console.log(`[image-404] Missing image in local storage: ${fullPath}`);
        return res.status(200).setHeader("Content-Type", "image/svg+xml").setHeader("Cache-Control", "no-cache").send(generatePlaceholderSVG(fullPath));
      }
    } catch (error) {
      console.error("Error serving chapter image:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  app2.get("/api/covers/placeholder", (req, res) => {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateCoverPlaceholderSVG());
  });
  app2.get("/api/covers/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      if (!/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) {
        return res.status(400).json({ message: "Invalid filename format or unsupported file type" });
      }
      const ext = path3.extname(filename).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif"
      };
      const contentType = mimeTypes[ext];
      if (!contentType) {
        return res.status(400).json({ message: "Unsupported file type" });
      }
      const coverPath = path3.join(process.cwd(), "uploads", "covers", filename);
      try {
        await fsp.access(coverPath);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.sendFile(coverPath);
      } catch (fileError) {
        console.log(`[cover-404] Missing cover in local storage: ${filename}`);
        return res.status(404).json({ message: "Cover image not found" });
      }
    } catch (error) {
      console.error("Error serving cover image:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  app2.get("/api/series/:seriesId/comments", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const comments2 = await storage.getCommentsBySeriesId(seriesId);
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching series comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.get("/api/chapters/:chapterId/comments", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const comments2 = await storage.getCommentsByChapterId(chapterId);
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching chapter comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/series/:seriesId/progress", doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const { chapterId, lastReadPage } = req.body;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const progress = await storage.saveReadingProgress(
        user.id,
        seriesId,
        chapterId || null,
        lastReadPage || 0
      );
      res.json(progress);
    } catch (error) {
      console.error("Error saving reading progress:", error);
      res.status(500).json({ message: "Failed to save reading progress" });
    }
  });
  app2.get("/api/series/:seriesId/progress", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const progress = await storage.getReadingProgress(user.id, seriesId);
      if (!progress) {
        return res.status(404).json({ message: "No reading progress found" });
      }
      res.json(progress);
    } catch (error) {
      console.error("Error fetching reading progress:", error);
      res.status(500).json({ message: "Failed to fetch reading progress" });
    }
  });
  app2.get("/api/progress", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const progressList = await storage.getUserReadingProgress(user.id);
      res.json(progressList);
    } catch (error) {
      console.error("Error fetching user reading progress:", error);
      res.status(500).json({ message: "Failed to fetch reading progress" });
    }
  });
  app2.delete("/api/series/:seriesId/progress", doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const deleted = await storage.deleteReadingProgress(user.id, seriesId);
      if (!deleted) {
        return res.status(404).json({ message: "No reading progress found" });
      }
      res.json({ message: "Reading progress cleared successfully" });
    } catch (error) {
      console.error("Error deleting reading progress:", error);
      res.status(500).json({ message: "Failed to clear reading progress" });
    }
  });
  app2.post("/api/series/:seriesId/comments", commentLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { seriesId } = req.params;
      const rawContent = req.body.content;
      const sanitizedContent = sanitizeHtml(rawContent);
      const validationResult = insertCommentSchema.safeParse({
        userId: req.session.user.id,
        seriesId,
        content: sanitizedContent
      });
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors
        });
      }
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const comment = await storage.createComment({
        userId: user.id,
        seriesId,
        content: sanitizedContent
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating series comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app2.post("/api/chapters/:chapterId/comments", commentLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { chapterId } = req.params;
      const rawContent = req.body.content;
      const sanitizedContent = sanitizeHtml(rawContent);
      const validationResult = insertCommentSchema.safeParse({
        userId: req.session.user.id,
        chapterId,
        content: sanitizedContent
      });
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors
        });
      }
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const comment = await storage.createComment({
        userId: user.id,
        chapterId,
        content: sanitizedContent
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating chapter comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app2.patch("/api/comments/:id", commentLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { id } = req.params;
      const rawContent = req.body.content;
      const sanitizedContent = sanitizeHtml(rawContent);
      const validationResult = updateCommentSchema.safeParse({ content: sanitizedContent });
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors
        });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const existingComment = await storage.getUserComment(user.id);
      if (!existingComment || existingComment.id !== id) {
        const commentResults = await storage.getCommentsBySeriesId("");
        const allComments = [...commentResults];
        const targetComment = allComments.find((c) => c.id === id);
        if (!targetComment) {
          return res.status(404).json({ message: "Comment not found" });
        }
        if (targetComment.userId !== user.id) {
          return res.status(403).json({ message: "You can only edit your own comments" });
        }
      }
      const updatedComment = await storage.updateComment(id, sanitizedContent);
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });
  app2.delete("/api/comments/:id", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { id } = req.params;
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const commentsByUser = await storage.getUserComment(user.id);
      const isOwner2 = commentsByUser && commentsByUser.id === id;
      const hasStaffAccess = ["staff", "admin", "owner"].includes(user.role || "") || user.isAdmin === "true";
      if (!isOwner2 && !hasStaffAccess) {
        return res.status(403).json({ message: "You can only delete your own comments" });
      }
      const deleted = await storage.deleteComment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  async function processCurrencyChange(userId, amount, type, description, relatedEntityId) {
    return await storage.processCurrencyChange(userId, amount, type, description, relatedEntityId);
  }
  app2.get("/api/currency/balance", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const balance = await storage.getUserCurrencyBalance(user.id);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching currency balance:", error);
      res.status(500).json({ message: "Failed to fetch currency balance" });
    }
  });
  app2.get("/api/currency/transactions", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const transactionQuerySchema = z2.object({
        limit: z2.coerce.number().min(1).max(100).default(50),
        offset: z2.coerce.number().min(0).default(0)
      });
      const validatedQuery = transactionQuerySchema.parse({
        limit: req.query.limit,
        offset: req.query.offset
      });
      const transactions = await storage.getCurrencyTransactions(user.id, validatedQuery.limit, validatedQuery.offset);
      res.json(transactions);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      }
      console.error("Error fetching currency transactions:", error);
      res.status(500).json({ message: "Failed to fetch currency transactions" });
    }
  });
  app2.get("/api/admin/user-transactions/:userId", adminAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const transactionQuerySchema = z2.object({
        limit: z2.coerce.number().min(1).max(100).default(50),
        offset: z2.coerce.number().min(0).default(0)
      });
      const validatedQuery = transactionQuerySchema.parse({
        limit: req.query.limit,
        offset: req.query.offset
      });
      const transactions = await storage.getCurrencyTransactions(userId, validatedQuery.limit, validatedQuery.offset);
      res.json(transactions);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      }
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });
  app2.post("/api/currency/admin/add", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const validatedData = adminAddCurrencySchema.parse(req.body);
      const result = await processCurrencyChange(
        validatedData.userId,
        validatedData.amount,
        "admin_grant",
        validatedData.description,
        validatedData.relatedEntityId
      );
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      res.json({
        message: "Currency added successfully",
        newBalance: result.newBalance
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error adding currency:", error);
      res.status(500).json({ message: "Failed to add currency" });
    }
  });
  app2.post("/api/currency/admin/deduct", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const validatedData = adminDeductCurrencySchema.parse(req.body);
      const result = await processCurrencyChange(
        validatedData.userId,
        -validatedData.amount,
        "admin_deduct",
        validatedData.description,
        validatedData.relatedEntityId
      );
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      res.json({
        message: "Currency deducted successfully",
        newBalance: result.newBalance
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error deducting currency:", error);
      res.status(500).json({ message: "Failed to deduct currency" });
    }
  });
  app2.get("/api/admin/currency/transactions", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const transactions = await storage.getAllCurrencyTransactions(100);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching admin currency transactions:", error);
      res.status(500).json({ message: "Failed to fetch currency transactions" });
    }
  });
  app2.get("/api/admin/currency/stats", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const stats = await storage.getCurrencyStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching currency stats:", error);
      res.status(500).json({ message: "Failed to fetch currency stats" });
    }
  });
  app2.post("/api/admin/currency/adjust", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { userId, amount, reason } = req.body;
      if (!userId || amount === void 0 || !reason) {
        return res.status(400).json({ message: "userId, amount, and reason are required" });
      }
      const result = await processCurrencyChange(
        userId,
        amount,
        amount > 0 ? "admin_grant" : "admin_deduct",
        reason
      );
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      res.json({
        message: "Currency adjusted successfully",
        newBalance: result.newBalance
      });
    } catch (error) {
      console.error("Error adjusting currency:", error);
      res.status(500).json({ message: "Failed to adjust currency" });
    }
  });
  app2.get("/api/currency/packages", async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly !== "false";
      const packages = await storage.getCurrencyPackages(activeOnly);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching currency packages:", error);
      res.status(500).json({ message: "Failed to fetch currency packages" });
    }
  });
  app2.post("/api/currency/packages", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const validatedData = insertCurrencyPackageSchema.parse(req.body);
      const newPackage = await storage.createCurrencyPackage(validatedData);
      res.status(201).json(newPackage);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating currency package:", error);
      res.status(500).json({ message: "Failed to create currency package" });
    }
  });
  app2.patch("/api/currency/packages/:id", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const validatedData = updateCurrencyPackageSchema.parse(req.body);
      const updatedPackage = await storage.updateCurrencyPackage(id, validatedData);
      if (!updatedPackage) {
        return res.status(404).json({ message: "Currency package not found" });
      }
      res.json(updatedPackage);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error updating currency package:", error);
      res.status(500).json({ message: "Failed to update currency package" });
    }
  });
  app2.delete("/api/currency/packages/:id", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const hasAdminAccess = admin.isAdmin === "true" || ["admin", "owner"].includes(admin.role || "");
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const deleted = await storage.deleteCurrencyPackage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Currency package not found" });
      }
      res.json({ message: "Currency package deleted successfully" });
    } catch (error) {
      console.error("Error deleting currency package:", error);
      res.status(500).json({ message: "Failed to delete currency package" });
    }
  });
  app2.get("/api/admin/ads", adminAuth, async (req, res) => {
    try {
      const ads = await storage.getAllAds();
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });
  app2.post("/api/admin/ads", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const validatedData = insertAdvertisementSchema.parse(req.body);
      const newAd = await storage.createAd(validatedData);
      res.status(201).json(newAd);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating ad:", error);
      res.status(500).json({ message: "Failed to create advertisement" });
    }
  });
  app2.patch("/api/admin/ads/:id", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateAdvertisementSchema.parse(req.body);
      const updatedAd = await storage.updateAd(id, validatedData);
      if (!updatedAd) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.json(updatedAd);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error updating ad:", error);
      res.status(500).json({ message: "Failed to update advertisement" });
    }
  });
  app2.delete("/api/admin/ads/:id", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAd(id);
      if (!deleted) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.json({ message: "Advertisement deleted successfully" });
    } catch (error) {
      console.error("Error deleting ad:", error);
      res.status(500).json({ message: "Failed to delete advertisement" });
    }
  });
  app2.get("/api/ads/placement/:placement", async (req, res) => {
    try {
      const { placement } = req.params;
      const validPlacements = ["homepage", "manga-page", "chapter-reader", "browse", "all"];
      if (!validPlacements.includes(placement)) {
        return res.status(400).json({ message: "Invalid placement value" });
      }
      const userAgent = req.headers["user-agent"] || "";
      const deviceType = userAgent.match(/(mobile|tablet|ipad|iphone|android)/i) ? userAgent.match(/(tablet|ipad)/i) ? "tablet" : "mobile" : "desktop";
      const user = req.session?.user ? await storage.getUserByUsername(req.session.user.username) : null;
      const userRole = user?.role || "user";
      const userCountry = user?.country || null;
      const acceptLanguage = req.headers["accept-language"] || "";
      const userLanguage = acceptLanguage.split(",")[0]?.split("-")[0] || "en";
      const context = {
        deviceType,
        userRole,
        userCountry,
        userLanguage
      };
      const ads = await storage.getActiveAdsByPlacement(placement, context);
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads by placement:", error);
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });
  app2.post("/api/ads/:id/click", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.trackAdClick(id);
      if (!success) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.json({ message: "Click tracked successfully" });
    } catch (error) {
      console.error("Error tracking ad click:", error);
      res.status(500).json({ message: "Failed to track click" });
    }
  });
  app2.post("/api/ads/:id/impression", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.trackAdImpression(id);
      if (!success) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.json({ message: "Impression tracked successfully" });
    } catch (error) {
      console.error("Error tracking ad impression:", error);
      res.status(500).json({ message: "Failed to track impression" });
    }
  });
  app2.get("/api/ads/analytics/overview", isStaffOrAbove, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const overview = await storage.getAdAnalyticsOverview(
        startDate,
        endDate
      );
      res.json(overview);
    } catch (error) {
      console.error("Error getting analytics overview:", error);
      res.status(500).json({ message: "Failed to get analytics overview" });
    }
  });
  app2.get("/api/ads/analytics/performance-history", isStaffOrAbove, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const history = await storage.getAdPerformanceHistory(
        startDate,
        endDate
      );
      res.json(history);
    } catch (error) {
      console.error("Error getting performance history:", error);
      res.status(500).json({ message: "Failed to get performance history" });
    }
  });
  app2.get("/api/ads/analytics/top-performers", isStaffOrAbove, async (req, res) => {
    try {
      const { limit, startDate, endDate } = req.query;
      const topAds = await storage.getTopPerformingAds(
        limit ? parseInt(limit) : 5,
        startDate,
        endDate
      );
      res.json(topAds);
    } catch (error) {
      console.error("Error getting top performers:", error);
      res.status(500).json({ message: "Failed to get top performers" });
    }
  });
  app2.get("/api/ads/variants/:variantGroup", isStaffOrAbove, async (req, res) => {
    try {
      const { variantGroup } = req.params;
      if (!variantGroup) {
        return res.status(400).json({ message: "Variant group is required" });
      }
      const variants = await storage.getAdsByVariantGroup(variantGroup);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching variant group:", error);
      res.status(500).json({ message: "Failed to fetch variant group" });
    }
  });
  app2.get("/api/ads/analytics/variant-comparison/:variantGroup", isStaffOrAbove, async (req, res) => {
    try {
      const { variantGroup } = req.params;
      const { startDate, endDate } = req.query;
      if (!variantGroup) {
        return res.status(400).json({ message: "Variant group is required" });
      }
      const comparison = await storage.getVariantComparisonAnalytics(
        variantGroup,
        startDate,
        endDate
      );
      res.json(comparison);
    } catch (error) {
      console.error("Error getting variant comparison:", error);
      res.status(500).json({ message: "Failed to get variant comparison" });
    }
  });
  app2.post("/api/ads/variants", actionLimiter, doubleCsrfProtection, isStaffOrAbove, async (req, res) => {
    try {
      const { variantGroup, variants } = req.body;
      if (!variantGroup || typeof variantGroup !== "string") {
        return res.status(400).json({ message: "Variant group name is required" });
      }
      if (!Array.isArray(variants) || variants.length < 2) {
        return res.status(400).json({ message: "At least 2 variants are required for A/B testing" });
      }
      for (const variant of variants) {
        if (!variant.variantName || !variant.title || !variant.imageUrl || !variant.linkUrl) {
          return res.status(400).json({
            message: "Each variant must have variantName, title, imageUrl, and linkUrl"
          });
        }
      }
      const createdVariants = await storage.createVariantGroup(variants, variantGroup);
      res.status(201).json({
        message: "Variant group created successfully",
        variants: createdVariants
      });
    } catch (error) {
      console.error("Error creating variant group:", error);
      res.status(500).json({ message: "Failed to create variant group" });
    }
  });
  app2.get("/api/ads/schedule-status", isStaffOrAbove, async (req, res) => {
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const allAds = await storage.getAllAds();
      const scheduled = allAds.filter(
        (ad) => ad.startDate && ad.endDate && ad.startDate > now
      ).length;
      const active = allAds.filter(
        (ad) => ad.isActive === "true" && (!ad.startDate || !ad.endDate || ad.startDate <= now && ad.endDate > now)
      ).length;
      const expired = allAds.filter(
        (ad) => ad.endDate && ad.endDate <= now
      ).length;
      const upcoming = allAds.filter(
        (ad) => ad.startDate && ad.startDate > now && ad.isActive === "false"
      ).length;
      res.json({
        scheduled,
        active,
        expired,
        upcoming,
        total: allAds.length,
        lastUpdated: now
      });
    } catch (error) {
      console.error("Error getting schedule status:", error);
      res.status(500).json({ message: "Failed to get schedule status" });
    }
  });
  app2.post("/api/admin/ads/refresh-schedules", actionLimiter, doubleCsrfProtection, isStaffOrAbove, async (req, res) => {
    try {
      const result = await storage.autoUpdateAdSchedules();
      res.json({
        success: true,
        activated: result.activated,
        deactivated: result.deactivated,
        message: `Schedule refreshed: ${result.activated} ads activated, ${result.deactivated} ads deactivated`
      });
    } catch (error) {
      console.error("Error refreshing schedules:", error);
      res.status(500).json({ message: "Failed to refresh schedules" });
    }
  });
  app2.post("/api/admin/ads/bulk-enable", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid or empty ids array" });
      }
      await storage.updateManyAdsStatus(ids, true);
      res.json({
        success: true,
        message: `${ids.length} ad(s) enabled successfully`
      });
    } catch (error) {
      console.error("Error enabling ads:", error);
      res.status(500).json({ message: "Failed to enable ads" });
    }
  });
  app2.post("/api/admin/ads/bulk-disable", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid or empty ids array" });
      }
      await storage.updateManyAdsStatus(ids, false);
      res.json({
        success: true,
        message: `${ids.length} ad(s) disabled successfully`
      });
    } catch (error) {
      console.error("Error disabling ads:", error);
      res.status(500).json({ message: "Failed to disable ads" });
    }
  });
  app2.post("/api/admin/ads/bulk-delete", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid or empty ids array" });
      }
      await storage.deleteAdsByIds(ids);
      res.json({
        success: true,
        message: `${ids.length} ad(s) deleted successfully`
      });
    } catch (error) {
      console.error("Error deleting ads:", error);
      res.status(500).json({ message: "Failed to delete ads" });
    }
  });
  app2.post("/api/admin/ads/import", actionLimiter, doubleCsrfProtection, adminAuth, async (req, res) => {
    try {
      const { ads } = req.body;
      if (!Array.isArray(ads) || ads.length === 0) {
        return res.status(400).json({ message: "Invalid or empty ads array" });
      }
      const result = await storage.insertAdvertisementsBulk(ads);
      res.json({
        success: result.success,
        errors: result.errors,
        message: result.errors.length > 0 ? `Imported ${result.success} ad(s) with ${result.errors.length} error(s)` : `Successfully imported ${result.success} ad(s)`
      });
    } catch (error) {
      console.error("Error importing ads:", error);
      res.status(500).json({ message: "Failed to import ads" });
    }
  });
  app2.get("/api/admin/ads/export", adminAuth, async (req, res) => {
    try {
      const format = req.query.format || "csv";
      const ads = await storage.getAllAds();
      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=ads-export.json");
        res.json(ads);
      } else if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=ads-export.csv");
        const headers = [
          "id",
          "title",
          "description",
          "imageUrl",
          "linkUrl",
          "type",
          "placement",
          "isActive",
          "startDate",
          "endDate",
          "displayOrder",
          "targetCountries",
          "targetDeviceTypes",
          "targetUserRoles",
          "targetLanguages",
          "budget",
          "costPerClick",
          "costPerImpression",
          "conversionGoal",
          "frequencyCap",
          "dailyBudget",
          "tags",
          "notes"
        ];
        const csvRows = [headers.join(",")];
        for (const ad of ads) {
          const row = [
            ad.id || "",
            `"${(ad.title || "").replace(/"/g, '""')}"`,
            `"${(ad.description || "").replace(/"/g, '""')}"`,
            ad.imageUrl || "",
            ad.linkUrl || "",
            ad.type || "",
            ad.placement || "",
            ad.isActive || "false",
            ad.startDate || "",
            ad.endDate || "",
            ad.displayOrder || "0",
            ad.targetCountries ? (typeof ad.targetCountries === "string" ? JSON.parse(ad.targetCountries) : ad.targetCountries).join("|") : "",
            ad.targetDeviceTypes ? (typeof ad.targetDeviceTypes === "string" ? JSON.parse(ad.targetDeviceTypes) : ad.targetDeviceTypes).join("|") : "",
            ad.targetUserRoles ? (typeof ad.targetUserRoles === "string" ? JSON.parse(ad.targetUserRoles) : ad.targetUserRoles).join("|") : "",
            ad.targetLanguages ? (typeof ad.targetLanguages === "string" ? JSON.parse(ad.targetLanguages) : ad.targetLanguages).join("|") : "",
            ad.budget || "",
            ad.costPerClick || "",
            ad.costPerImpression || "",
            ad.conversionGoal || "",
            ad.frequencyCap || "",
            ad.dailyBudget || "",
            ad.tags ? (typeof ad.tags === "string" ? JSON.parse(ad.tags) : ad.tags).join("|") : "",
            `"${(ad.notes || "").replace(/"/g, '""')}"`
          ];
          csvRows.push(row.join(","));
        }
        res.send(csvRows.join("\n"));
      } else {
        res.status(400).json({ message: "Invalid format. Use 'csv' or 'json'" });
      }
    } catch (error) {
      console.error("Error exporting ads:", error);
      res.status(500).json({ message: "Failed to export ads" });
    }
  });
  app2.post("/api/currency/purchase", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { packageId } = req.body;
      if (!packageId) {
        return res.status(400).json({ message: "Package ID is required" });
      }
      const packages = await storage.getCurrencyPackages(false);
      const currencyPackage = packages.find((p) => p.id === packageId);
      if (!currencyPackage || currencyPackage.isActive !== "true") {
        return res.status(404).json({ message: "Currency package not found or inactive" });
      }
      if (!stripe) {
        return res.status(503).json({
          message: "Payment processing not configured. Please contact administrator.",
          isStripeConfigured: false
        });
      }
      const amount = Math.round(parseFloat(currencyPackage.priceUSD) * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          userId: user.id,
          packageId: currencyPackage.id,
          packageName: currencyPackage.name,
          currencyAmount: currencyPackage.currencyAmount.toString(),
          bonusPercentage: currencyPackage.bonusPercentage.toString()
        }
      });
      res.json({
        clientSecret: paymentIntent.client_secret,
        isStripeConfigured: true
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        message: "Error creating payment intent: " + error.message
      });
    }
  });
  app2.get("/api/currency/purchases", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const purchases = await storage.getUserPurchases(user.id);
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching user purchases:", error);
      res.status(500).json({ message: "Failed to fetch user purchases" });
    }
  });
  app2.get("/api/subscriptions/packages", async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly !== "false";
      const packages = await storage.getSubscriptionPackages(activeOnly);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching subscription packages:", error);
      res.status(500).json({ message: "Failed to fetch subscription packages" });
    }
  });
  app2.get("/api/subscriptions/my-subscription", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const subscription = await storage.getUserActiveSubscription(user.id);
      res.json(subscription || null);
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });
  app2.post("/api/subscriptions/create-payment", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { packageId } = req.body;
      if (!packageId) {
        return res.status(400).json({ message: "Package ID is required" });
      }
      const pkg = await storage.getSubscriptionPackageById(packageId);
      if (!pkg || pkg.isActive !== "true") {
        return res.status(404).json({ message: "Subscription package not found or inactive" });
      }
      if (!stripe) {
        return res.status(503).json({
          message: "Payment processing not configured",
          isStripeConfigured: false
        });
      }
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email || void 0,
          name: user.username || void 0,
          metadata: { userId: user.id }
        });
        stripeCustomerId = customer.id;
        await storage.updateUserStripeCustomerId(user.id, stripeCustomerId);
      }
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: pkg.stripePriceId || void 0 }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: user.id,
          packageId: pkg.id,
          packageName: pkg.name
        }
      });
      const invoice = subscription.latest_invoice;
      const paymentIntent = invoice?.payment_intent;
      res.json({
        clientSecret: paymentIntent?.client_secret || "",
        subscriptionId: subscription.id,
        isStripeConfigured: true
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({
        message: "Error creating subscription: " + error.message
      });
    }
  });
  app2.get("/api/subscriptions/current", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const subscription = await storage.getUserActiveSubscription(user.id);
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription" });
      }
      const pkg = subscription.packageId ? await storage.getSubscriptionPackageById(subscription.packageId) : null;
      res.json({
        ...subscription,
        packageName: pkg?.name || "Unknown",
        priceUSD: pkg?.priceUSD || "0",
        features: pkg?.features || "[]"
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });
  app2.post("/api/subscriptions/subscribe", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { packageId } = req.body;
      const pkg = await storage.getSubscriptionPackageById(packageId);
      if (!pkg || pkg.isActive !== "true") {
        return res.status(404).json({ message: "Package not found or inactive" });
      }
      const existingSub = await storage.getUserActiveSubscription(user.id);
      if (existingSub && existingSub.status === "active") {
        return res.status(400).json({ message: "You already have an active subscription" });
      }
      const now = /* @__PURE__ */ new Date();
      const monthLater = new Date(now);
      monthLater.setMonth(monthLater.getMonth() + 1);
      await storage.createUserSubscription({
        userId: user.id,
        packageId: pkg.id,
        status: "active",
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: monthLater.toISOString(),
        cancelAtPeriodEnd: "false",
        stripeCustomerId: null,
        stripeSubscriptionId: null
      });
      if (pkg.coinBonus && pkg.coinBonus > 0) {
        await storage.processCurrencyChange(
          user.id,
          pkg.coinBonus,
          "subscription_bonus",
          `${pkg.name} monthly coin bonus`
        );
      }
      res.json({
        message: `Successfully subscribed to ${pkg.name}!`,
        success: true,
        package: pkg
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/subscriptions/cancel", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const subscription = await storage.getUserActiveSubscription(user.id);
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      if (stripe && subscription.stripeSubscriptionId) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      }
      await storage.cancelUserSubscription(subscription.id);
      res.json({ message: "Subscription will be cancelled at period end" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });
  app2.post("/api/subscriptions/reactivate", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const subscription = await storage.getUserActiveSubscription(user.id);
      if (!subscription) {
        return res.status(404).json({ message: "No subscription found" });
      }
      if (stripe && subscription.stripeSubscriptionId) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false
        });
      }
      await db.update(userSubscriptions).set({ cancelAtPeriodEnd: "false" }).where(eq3(userSubscriptions.id, subscription.id)).run();
      res.json({ message: "Subscription reactivated successfully" });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      res.status(500).json({ message: "Failed to reactivate subscription" });
    }
  });
  app2.post("/api/flash-sales/purchase", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { saleId } = req.body;
      if (!saleId) {
        return res.status(400).json({ message: "Sale ID is required" });
      }
      const sales = await storage.getActiveFlashSales();
      const sale = sales.find((s) => s.id === saleId);
      if (!sale) {
        return res.status(404).json({ message: "Flash sale not found or expired" });
      }
      if (sale.maxPurchases && (sale.currentPurchases || 0) >= sale.maxPurchases) {
        return res.status(400).json({ message: "Flash sale sold out" });
      }
      let coinsToGrant = 0;
      if (sale.type === "coin_package" && sale.targetId) {
        const packages = await storage.getCurrencyPackages(false);
        const pkg = packages.find((p) => p.id === sale.targetId);
        if (pkg) {
          coinsToGrant = pkg.currencyAmount + Math.floor(pkg.currencyAmount * (pkg.bonusPercentage || 0) / 100);
        }
      } else {
        coinsToGrant = 500;
      }
      await storage.processCurrencyChange(
        user.id,
        coinsToGrant,
        "flash_sale",
        `Flash Sale: ${sale.name}`
      );
      await storage.incrementFlashSalePurchaseCount(saleId);
      res.json({
        message: "Flash sale purchase successful!",
        success: true,
        coinsReceived: coinsToGrant,
        saleName: sale.name
      });
    } catch (error) {
      console.error("Error purchasing flash sale:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/battle-pass/progress", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const progress = await storage.getUserBattlePassProgress(user.id);
      const season = await storage.getCurrentBattlePassSeason();
      if (!progress || !season) {
        return res.json({ progress: null, season: null });
      }
      res.json({
        progress,
        season: {
          id: season.id,
          name: season.name,
          description: season.description,
          startDate: season.startDate,
          endDate: season.endDate
        }
      });
    } catch (error) {
      console.error("Error fetching battle pass progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });
  app2.get("/api/battle-pass/rewards", async (req, res) => {
    try {
      const season = await storage.getCurrentBattlePassSeason();
      if (!season) {
        return res.json([]);
      }
      const rewards = await storage.getBattlePassRewards(season.id);
      const tierMap = /* @__PURE__ */ new Map();
      rewards.forEach((reward) => {
        const tier = reward.tier;
        if (!tierMap.has(tier)) {
          tierMap.set(tier, {
            level: tier,
            freeReward: { type: "coins", amount: 0, name: "No reward" },
            premiumReward: { type: "coins", amount: 0, name: "No reward" },
            claimed: reward.claimed || false
          });
        }
        const tierData = tierMap.get(tier);
        const rewardObj = {
          type: reward.rewardType || "coins",
          amount: parseInt(reward.rewardValue) || 0,
          name: reward.rewardName || `${reward.rewardType} reward`
        };
        const isPremium2 = reward.isPremium === true || reward.isPremium === "true";
        if (isPremium2) {
          tierData.premiumReward = rewardObj;
        } else {
          tierData.freeReward = rewardObj;
        }
        if (reward.claimed !== void 0) {
          tierData.claimed = reward.claimed;
        }
      });
      const structuredRewards = Array.from(tierMap.values()).sort((a, b) => a.level - b.level);
      res.json(structuredRewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });
  app2.post("/api/battle-pass/upgrade", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const season = await storage.getCurrentBattlePassSeason();
      if (!season) {
        return res.status(404).json({ message: "No active season" });
      }
      const progress = await storage.getUserBattlePassProgress(user.id);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      await storage.upgradeBattlePassToPremium(user.id, season.id);
      res.json({
        message: "Successfully upgraded to Premium Battle Pass!",
        success: true
      });
    } catch (error) {
      console.error("Error upgrading battle pass:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/battle-pass/claim", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { level } = req.body;
      res.json({ message: "Reward claimed", level });
    } catch (error) {
      console.error("Error claiming reward:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/subscriptions", isStaffOrAbove, async (req, res) => {
    try {
      const packages = await storage.getSubscriptionPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching subscription packages:", error);
      res.status(500).json({ message: "Failed to fetch subscription packages" });
    }
  });
  app2.post("/api/admin/subscriptions", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const {
        name,
        description,
        priceUSD,
        billingCycle,
        features,
        coinBonus,
        discountPercentage,
        isAdFree,
        trialDays,
        isActive,
        displayOrder,
        stripePriceId
      } = req.body;
      const newPackage = await storage.createSubscriptionPackage({
        name,
        description,
        priceUSD,
        billingCycle,
        features: typeof features === "string" ? features : JSON.stringify(features),
        coinBonus: coinBonus || 0,
        discountPercentage: discountPercentage || 0,
        isAdFree: isAdFree || "false",
        earlyAccess: "false",
        exclusiveContent: "false",
        trialDays: trialDays || 0,
        isActive: isActive || "true",
        displayOrder: displayOrder || 0,
        stripePriceId: stripePriceId || null
      });
      res.json(newPackage);
    } catch (error) {
      console.error("Error creating subscription package:", error);
      res.status(500).json({ message: "Failed to create subscription package" });
    }
  });
  app2.put("/api/admin/subscriptions/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.features && typeof updates.features !== "string") {
        updates.features = JSON.stringify(updates.features);
      }
      const updated = await storage.updateSubscriptionPackage(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating subscription package:", error);
      res.status(500).json({ message: "Failed to update subscription package" });
    }
  });
  app2.delete("/api/admin/subscriptions/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSubscriptionPackage(id);
      res.json({ message: "Subscription package deleted successfully" });
    } catch (error) {
      console.error("Error deleting subscription package:", error);
      res.status(500).json({ message: "Failed to delete subscription package" });
    }
  });
  app2.get("/api/admin/battle-pass/seasons", isStaffOrAbove, async (req, res) => {
    try {
      const seasons = await storage.getAllBattlePassSeasons();
      res.json(seasons);
    } catch (error) {
      console.error("Error fetching battle pass seasons:", error);
      res.status(500).json({ message: "Failed to fetch battle pass seasons" });
    }
  });
  app2.post("/api/admin/battle-pass/seasons", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { name, startDate, endDate, premiumPrice } = req.body;
      const newSeason = await storage.createBattlePassSeason({
        name,
        startDate,
        endDate,
        premiumPrice: premiumPrice || "9.99",
        maxTier: 50
      });
      res.json(newSeason);
    } catch (error) {
      console.error("Error creating battle pass season:", error);
      res.status(500).json({ message: "Failed to create battle pass season" });
    }
  });
  app2.put("/api/admin/battle-pass/seasons/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await storage.updateBattlePassSeason(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating battle pass season:", error);
      res.status(500).json({ message: "Failed to update battle pass season" });
    }
  });
  app2.delete("/api/admin/battle-pass/seasons/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBattlePassSeason(id);
      res.json({ message: "Battle pass season deleted successfully" });
    } catch (error) {
      console.error("Error deleting battle pass season:", error);
      res.status(500).json({ message: "Failed to delete battle pass season" });
    }
  });
  app2.get("/api/admin/battle-pass/tiers/:seasonId", isStaffOrAbove, async (req, res) => {
    try {
      const { seasonId } = req.params;
      const tiers = await storage.getBattlePassRewards(seasonId);
      res.json(tiers);
    } catch (error) {
      console.error("Error fetching battle pass tiers:", error);
      res.status(500).json({ message: "Failed to fetch battle pass tiers" });
    }
  });
  app2.post("/api/admin/battle-pass/tiers", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { seasonId, tier, freeReward, premiumReward, xpRequired } = req.body;
      const newTier = await storage.createBattlePassTier({
        seasonId,
        tier,
        freeReward: JSON.stringify(freeReward),
        premiumReward: JSON.stringify(premiumReward),
        xpRequired: xpRequired || 100
      });
      res.json(newTier);
    } catch (error) {
      console.error("Error creating battle pass tier:", error);
      res.status(500).json({ message: "Failed to create battle pass tier" });
    }
  });
  app2.put("/api/admin/battle-pass/tiers/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.freeReward && typeof updates.freeReward !== "string") {
        updates.freeReward = JSON.stringify(updates.freeReward);
      }
      if (updates.premiumReward && typeof updates.premiumReward !== "string") {
        updates.premiumReward = JSON.stringify(updates.premiumReward);
      }
      const updated = await storage.updateBattlePassTier(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating battle pass tier:", error);
      res.status(500).json({ message: "Failed to update battle pass tier" });
    }
  });
  app2.delete("/api/admin/battle-pass/tiers/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBattlePassTier(id);
      res.json({ message: "Battle pass tier deleted successfully" });
    } catch (error) {
      console.error("Error deleting battle pass tier:", error);
      res.status(500).json({ message: "Failed to delete battle pass tier" });
    }
  });
  app2.get("/api/admin/monetization/purchases", isStaffOrAbove, async (req, res) => {
    try {
      const { limit = "1000", offset = "0", status } = req.query;
      const purchases = await storage.getAllPurchases(
        parseInt(limit),
        parseInt(offset),
        status
      );
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });
  app2.post("/api/admin/monetization/refund", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const admin = await storage.getUserByUsername(req.session.user.username);
      if (!admin) {
        return res.status(401).json({ message: "User not found" });
      }
      const { purchaseId, reason } = req.body;
      if (!purchaseId || !reason) {
        return res.status(400).json({ message: "Purchase ID and reason are required" });
      }
      const result = await storage.processRefund(purchaseId, admin.id, reason);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      res.json({ message: result.message });
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(500).json({ message: "Failed to process refund" });
    }
  });
  app2.get("/api/admin/monetization/stats", isStaffOrAbove, async (req, res) => {
    try {
      const { range } = req.query;
      const now = /* @__PURE__ */ new Date();
      let startDate;
      let endDate = now.toISOString();
      let previousStartDate;
      let previousEndDate;
      if (range === "7d") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3).toISOString();
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1e3).toISOString();
        previousEndDate = startDate;
      } else if (range === "30d") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString();
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1e3).toISOString();
        previousEndDate = startDate;
      } else if (range === "90d") {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3).toISOString();
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1e3).toISOString();
        previousEndDate = startDate;
      } else if (range === "1y") {
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3).toISOString();
        previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1e3).toISOString();
        previousEndDate = startDate;
      }
      const [
        totalRevenue,
        monthlyRevenue,
        revenueByType,
        activeSubscriptions,
        mrr,
        averageOrderValue,
        conversionRate,
        revenueGrowth
      ] = await Promise.all([
        storage.getTotalRevenue(startDate, endDate),
        storage.getMonthlyRevenue(),
        storage.getRevenueByType(startDate, endDate),
        storage.getActiveSubscriptionsCount(),
        storage.getMRR(),
        storage.getAverageOrderValue(startDate, endDate),
        storage.getConversionRate(startDate, endDate),
        previousStartDate && previousEndDate ? storage.getRevenueGrowth(startDate, endDate, previousStartDate, previousEndDate) : Promise.resolve(0)
      ]);
      const stats = {
        totalRevenue,
        monthlyRevenue,
        revenueGrowth,
        activeSubscriptions,
        subscriptionRevenue: revenueByType.subscriptionRevenue,
        coinSalesRevenue: revenueByType.coinSalesRevenue,
        flashSalesRevenue: revenueByType.flashSalesRevenue,
        averageOrderValue,
        conversionRate,
        mrr
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching monetization stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/admin/monetization/top-packages", isStaffOrAbove, async (req, res) => {
    try {
      const { range, limit = "10" } = req.query;
      const now = /* @__PURE__ */ new Date();
      let startDate;
      let endDate = now.toISOString();
      if (range === "7d") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3).toISOString();
      } else if (range === "30d") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString();
      } else if (range === "90d") {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3).toISOString();
      } else if (range === "1y") {
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3).toISOString();
      }
      const packages = await storage.getTopSellingPackages(parseInt(limit), startDate, endDate);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching top packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app2.get("/api/admin/monetization/revenue-history", isStaffOrAbove, async (req, res) => {
    try {
      const { range } = req.query;
      const now = /* @__PURE__ */ new Date();
      let startDate;
      let endDate = now.toISOString();
      let interval = "daily";
      if (range === "7d") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3).toISOString();
        interval = "daily";
      } else if (range === "30d") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString();
        interval = "daily";
      } else if (range === "90d") {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3).toISOString();
        interval = "daily";
      } else if (range === "1y") {
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3).toISOString();
        interval = "monthly";
      }
      const history = await storage.getRevenueHistory(startDate, endDate, interval);
      res.json(history);
    } catch (error) {
      console.error("Error fetching revenue history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });
  app2.get("/api/rewards/daily-status", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const status = await storage.getUserDailyRewardStatus(user.id);
      res.json(status);
    } catch (error) {
      console.error("Error fetching daily reward status:", error);
      res.status(500).json({ message: "Failed to fetch daily reward status" });
    }
  });
  app2.post("/api/rewards/claim-daily", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const result = await storage.claimDailyReward(user.id);
      res.json(result);
    } catch (error) {
      console.error("Error claiming daily reward:", error);
      res.status(400).json({ message: error.message || "Failed to claim daily reward" });
    }
  });
  app2.get("/api/achievements", async (req, res) => {
    try {
      const achievements2 = await storage.getAllAchievements();
      res.json(achievements2);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  app2.get("/api/achievements/my-progress", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const progress = await storage.getUserAchievementProgress(user.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching achievement progress:", error);
      res.status(500).json({ message: "Failed to fetch achievement progress" });
    }
  });
  app2.get("/api/referrals/my-code", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const code = await storage.getUserReferralCode(user.id);
      res.json(code);
    } catch (error) {
      console.error("Error fetching referral code:", error);
      res.status(500).json({ message: "Failed to fetch referral code" });
    }
  });
  app2.get("/api/referrals/my-referrals", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const referrals2 = await storage.getUserReferrals(user.id);
      res.json(referrals2);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });
  app2.post("/api/referrals/apply", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Referral code is required" });
      }
      const result = await storage.applyReferralCode(user.id, code);
      res.json(result);
    } catch (error) {
      console.error("Error applying referral code:", error);
      res.status(400).json({ message: error.message || "Failed to apply referral code" });
    }
  });
  app2.get("/api/flash-sales/active", async (req, res) => {
    try {
      const sales = await storage.getActiveFlashSales();
      res.json(sales);
    } catch (error) {
      console.error("Error fetching flash sales:", error);
      res.status(500).json({ message: "Failed to fetch flash sales" });
    }
  });
  app2.get("/api/admin/flash-sales", isStaffOrAbove, async (req, res) => {
    try {
      const sales = await storage.getAllFlashSales();
      res.json(sales);
    } catch (error) {
      console.error("Error fetching flash sales:", error);
      res.status(500).json({ message: "Failed to fetch flash sales" });
    }
  });
  app2.post("/api/admin/flash-sales/create", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { name, description, type, targetId, discountPercentage, originalPrice, salePrice, startTime, endTime, maxPurchases } = req.body;
      if (!name || !type || !discountPercentage || !originalPrice || !salePrice || !startTime || !endTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const sale = await storage.createFlashSale({
        name,
        description,
        type,
        targetId,
        discountPercentage,
        originalPrice,
        salePrice,
        startTime,
        endTime,
        maxPurchases,
        currentPurchases: 0,
        isActive: "true"
      });
      res.status(201).json(sale);
    } catch (error) {
      console.error("Error creating flash sale:", error);
      res.status(500).json({ message: "Failed to create flash sale" });
    }
  });
  app2.patch("/api/admin/flash-sales/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedSale = await storage.updateFlashSale(id, updates);
      if (!updatedSale) {
        return res.status(404).json({ message: "Flash sale not found" });
      }
      res.json(updatedSale);
    } catch (error) {
      console.error("Error updating flash sale:", error);
      res.status(500).json({ message: "Failed to update flash sale" });
    }
  });
  app2.delete("/api/admin/flash-sales/:id", isStaffOrAbove, doubleCsrfProtection, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFlashSale(id);
      if (!deleted) {
        return res.status(404).json({ message: "Flash sale not found" });
      }
      res.json({ message: "Flash sale deleted successfully" });
    } catch (error) {
      console.error("Error deleting flash sale:", error);
      res.status(500).json({ message: "Failed to delete flash sale" });
    }
  });
  app2.post("/api/gifts/send", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { recipientId, recipientEmail, giftType, giftAmount, packageId, message } = req.body;
      const result = await storage.sendGift({
        senderId: user.id,
        recipientId,
        recipientEmail,
        giftType,
        giftAmount,
        packageId,
        message
      });
      res.json(result);
    } catch (error) {
      console.error("Error sending gift:", error);
      res.status(400).json({ message: error.message || "Failed to send gift" });
    }
  });
  app2.get("/api/gifts/received", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const gifts = await storage.getUserReceivedGifts(user.id);
      res.json(gifts);
    } catch (error) {
      console.error("Error fetching received gifts:", error);
      res.status(500).json({ message: "Failed to fetch received gifts" });
    }
  });
  app2.post("/api/gifts/:giftId/claim", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const result = await storage.claimGift(req.params.giftId, user.id);
      res.json(result);
    } catch (error) {
      console.error("Error claiming gift:", error);
      res.status(400).json({ message: error.message || "Failed to claim gift" });
    }
  });
  app2.get("/api/loyalty/my-status", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const status = await storage.getUserLoyaltyStatus(user.id);
      res.json(status);
    } catch (error) {
      console.error("Error fetching loyalty status:", error);
      res.status(500).json({ message: "Failed to fetch loyalty status" });
    }
  });
  app2.get("/api/loyalty/tiers", async (req, res) => {
    try {
      const tiers = await storage.getLoyaltyTiers();
      res.json(tiers);
    } catch (error) {
      console.error("Error fetching loyalty tiers:", error);
      res.status(500).json({ message: "Failed to fetch loyalty tiers" });
    }
  });
  app2.get("/api/battle-pass/current-season", async (req, res) => {
    try {
      const season = await storage.getCurrentBattlePassSeason();
      res.json(season || null);
    } catch (error) {
      console.error("Error fetching current season:", error);
      res.status(500).json({ message: "Failed to fetch current season" });
    }
  });
  app2.get("/api/battle-pass/my-progress", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const progress = await storage.getUserBattlePassProgress(user.id);
      res.json(progress || null);
    } catch (error) {
      console.error("Error fetching battle pass progress:", error);
      res.status(500).json({ message: "Failed to fetch battle pass progress" });
    }
  });
  app2.post("/api/battle-pass/claim-reward", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { tier } = req.body;
      const result = await storage.claimBattlePassReward(user.id, tier);
      res.json(result);
    } catch (error) {
      console.error("Error claiming battle pass reward:", error);
      res.status(400).json({ message: error.message || "Failed to claim reward" });
    }
  });
  app2.post("/api/chapters/unlock-series", actionLimiter, doubleCsrfProtection, async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserByUsername(req.session.user.username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { seriesId } = req.body;
      if (!seriesId) {
        return res.status(400).json({ message: "Series ID is required" });
      }
      const result = await storage.unlockAllSeriesChapters(user.id, seriesId);
      res.json(result);
    } catch (error) {
      console.error("Error unlocking series:", error);
      res.status(400).json({ message: error.message || "Failed to unlock series" });
    }
  });
  app2.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) {
      return res.status(400).json({ message: "Missing signature or webhook secret" });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          const { userId, packageId, currencyAmount, bonusPercentage } = paymentIntent.metadata;
          if (userId && packageId && currencyAmount) {
            const totalCoins = parseInt(currencyAmount) + Math.floor(parseInt(currencyAmount) * parseInt(bonusPercentage || "0") / 100);
            await storage.recordCurrencyPurchase({
              userId,
              packageId,
              amountPaid: (paymentIntent.amount / 100).toFixed(2),
              currencyReceived: totalCoins,
              paymentProvider: "stripe",
              transactionId: paymentIntent.id,
              status: "completed"
            });
            await storage.processCurrencyChange(
              userId,
              totalCoins,
              "purchase",
              `Purchased ${currencyAmount} coins (+${bonusPercentage}% bonus)`,
              packageId
            );
          }
          break;
        }
        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          const subscriptionId = invoice.subscription;
          if (subscriptionId) {
            const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
            const subscription = subscriptionResponse;
            const userId = subscription.metadata?.userId;
            const packageId = subscription.metadata?.packageId;
            if (userId && packageId) {
              await storage.activateUserSubscription({
                userId,
                packageId,
                stripeCustomerId: subscription.customer,
                stripeSubscriptionId: subscription.id,
                currentPeriodStart: new Date((subscription.current_period_start || Date.now() / 1e3) * 1e3).toISOString(),
                currentPeriodEnd: new Date((subscription.current_period_end || Date.now() / 1e3) * 1e3).toISOString()
              });
            }
          }
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          if (subscription.id) {
            await storage.expireUserSubscription(subscription.id);
          }
          break;
        }
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          if (subscription.id) {
            await storage.updateUserSubscriptionStatus(
              subscription.id,
              subscription.status,
              subscription.cancel_at_period_end
            );
          }
          break;
        }
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/rss/all", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const allSeries = await storage.getAllSeries();
      const recentSeries = allSeries.sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? Date.now()).getTime() - new Date(a.updatedAt ?? a.createdAt ?? Date.now()).getTime()).slice(0, limit);
      const baseUrl = req.protocol + "://" + req.get("host");
      let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MangaVerse - All Series Updates</title>
    <link>${baseUrl}</link>
    <description>Latest manga and manhwa series updates from MangaVerse</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/api/rss/all" rel="self" type="application/rss+xml" />
`;
      for (const series2 of recentSeries) {
        const pubDate = new Date(series2.updatedAt ?? series2.createdAt ?? Date.now()).toUTCString();
        rssXml += `
    <item>
      <title>${series2.title}</title>
      <link>${baseUrl}/series/${series2.id}</link>
      <description>${series2.description || "No description available"}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${baseUrl}/series/${series2.id}</guid>
    </item>`;
      }
      rssXml += `
  </channel>
</rss>`;
      res.set("Content-Type", "application/rss+xml");
      res.send(rssXml);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).json({ message: "Failed to generate RSS feed" });
    }
  });
  app2.get("/api/rss/series/:seriesId", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const series2 = await storage.getSeries(seriesId);
      if (!series2) {
        return res.status(404).json({ message: "Series not found" });
      }
      const chapters2 = await storage.getChaptersBySeriesId(series2.id);
      const recentChapters = chapters2.sort((a, b) => new Date(b.createdAt ?? Date.now()).getTime() - new Date(a.createdAt ?? Date.now()).getTime()).slice(0, 50);
      const baseUrl = req.protocol + "://" + req.get("host");
      let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MangaVerse - ${series2.title}</title>
    <link>${baseUrl}/series/${seriesId}</link>
    <description>Latest chapter updates for ${series2.title}</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/api/rss/series/${seriesId}" rel="self" type="application/rss+xml" />
`;
      for (const chapter of recentChapters) {
        const pubDate = new Date(chapter.createdAt ?? Date.now()).toUTCString();
        rssXml += `
    <item>
      <title>Chapter ${chapter.chapterNumber}${chapter.title ? ": " + chapter.title : ""}</title>
      <link>${baseUrl}/read/${seriesId}/${chapter.chapterNumber}</link>
      <description>Chapter ${chapter.chapterNumber} of ${series2.title}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${baseUrl}/read/${seriesId}/${chapter.chapterNumber}</guid>
    </item>`;
      }
      rssXml += `
  </channel>
</rss>`;
      res.set("Content-Type", "application/rss+xml");
      res.send(rssXml);
    } catch (error) {
      console.error("Error generating series RSS feed:", error);
      res.status(500).json({ message: "Failed to generate RSS feed" });
    }
  });
  app2.get("/api/admin/packages", adminAuth, async (req, res) => {
    try {
      const packages = await getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app2.get("/api/admin/coupons", adminAuth, async (req, res) => {
    try {
      const coupons3 = await getCoupons();
      res.json(coupons3);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });
  app2.post("/api/admin/coupons", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const coupon = await createCoupon(req.body);
      res.json(coupon);
    } catch (error) {
      console.error("Error creating coupon:", error);
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });
  app2.put("/api/admin/coupons/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const coupon = await updateCoupon(req.params.id, req.body);
      res.json(coupon);
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).json({ message: "Failed to update coupon" });
    }
  });
  app2.delete("/api/admin/coupons/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      await deleteCoupon(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });
  app2.post("/api/admin/coupons/validate", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { code, amount } = req.body;
      const validation = await validateCoupon(code, amount);
      res.json(validation);
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ message: "Failed to validate coupon" });
    }
  });
  app2.get("/api/admin/bundles", adminAuth, async (req, res) => {
    try {
      const bundles = await getPackageBundles();
      res.json(bundles);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      res.status(500).json({ message: "Failed to fetch bundles" });
    }
  });
  app2.post("/api/admin/bundles", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const bundle = await createPackageBundle(req.body);
      res.json(bundle);
    } catch (error) {
      console.error("Error creating bundle:", error);
      res.status(500).json({ message: "Failed to create bundle" });
    }
  });
  app2.put("/api/admin/bundles/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const bundle = await updatePackageBundle(req.params.id, req.body);
      res.json(bundle);
    } catch (error) {
      console.error("Error updating bundle:", error);
      res.status(500).json({ message: "Failed to update bundle" });
    }
  });
  app2.delete("/api/admin/bundles/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      await deletePackageBundle(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting bundle:", error);
      res.status(500).json({ message: "Failed to delete bundle" });
    }
  });
  app2.get("/api/admin/invoices", adminAuth, async (req, res) => {
    try {
      const { userId, status, startDate, endDate } = req.query;
      const invoices3 = await getInvoices({
        userId,
        status,
        startDate,
        endDate
      });
      res.json(invoices3);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/admin/invoices/:id", adminAuth, async (req, res) => {
    try {
      const invoice = await getInvoiceById(req.params.id);
      const items = await getInvoiceItems(req.params.id);
      res.json({ ...invoice, items });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  app2.post("/api/admin/invoices/:id/pdf", adminAuth, async (req, res) => {
    try {
      const pdfPath = await generateInvoicePDF(req.params.id);
      res.json({ pdfPath });
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });
  app2.get("/api/admin/manual-assignments", adminAuth, async (req, res) => {
    try {
      const { userId } = req.query;
      const assignments = await getManualAssignments(userId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });
  app2.post("/api/admin/manual-assignments", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const assignment = await createManualAssignment({
        ...req.body,
        assignedBy: req.session?.user?.id
      });
      res.json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });
  app2.delete("/api/admin/manual-assignments/:id", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      await revokeManualAssignment(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error revoking assignment:", error);
      res.status(500).json({ message: "Failed to revoke assignment" });
    }
  });
  app2.get("/api/admin/subscribers", adminAuth, async (req, res) => {
    try {
      const { status, packageId, startDate, endDate } = req.query;
      const csv = await exportSubscribersToCSV({
        status,
        packageId,
        startDate,
        endDate
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error exporting subscribers:", error);
      res.status(500).json({ message: "Failed to export subscribers" });
    }
  });
  app2.get("/api/admin/offline-purchases", adminAuth, async (req, res) => {
    try {
      const purchases = await getOfflinePurchases();
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching offline purchases:", error);
      res.status(500).json({ message: "Failed to fetch offline purchases" });
    }
  });
  app2.post("/api/admin/purchases/:id/offline", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const purchase = await flagPurchaseOffline(req.params.id);
      res.json(purchase);
    } catch (error) {
      console.error("Error flagging purchase:", error);
      res.status(500).json({ message: "Failed to flag purchase" });
    }
  });
  app2.post("/api/admin/purchases/:id/reconcile", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const purchase = await reconcilePurchase(req.params.id, req.body);
      res.json(purchase);
    } catch (error) {
      console.error("Error reconciling purchase:", error);
      res.status(500).json({ message: "Failed to reconcile purchase" });
    }
  });
  app2.post("/api/admin/subscriptions/:id/activate-trial", adminAuth, doubleCsrfProtection, async (req, res) => {
    try {
      const { userId, trialDays } = req.body;
      const subscription = await activateTrial(userId, req.params.id, trialDays);
      res.json(subscription);
    } catch (error) {
      console.error("Error activating trial:", error);
      res.status(500).json({ message: "Failed to activate trial" });
    }
  });
  app2.use(seo_default);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
init_storage();
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createBrotliCompress, createGzip, constants } from "zlib";
import { Writable, pipeline } from "stream";
import Stripe2 from "stripe";
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express3();
app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|woff|woff2|ttf|svg|webp|avif)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (req.url.match(/\.html$/) || req.url === "/") {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate, stale-while-revalidate=86400");
  } else if (req.url.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  }
  next();
});
var isDevelopment = process.env.NODE_ENV !== "production";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // PRODUCTION: No unsafe-inline/eval. DEVELOPMENT: Allow for Vite HMR
      scriptSrc: [
        "'self'",
        "https://js.stripe.com",
        ...isDevelopment ? ["'unsafe-inline'", "'unsafe-eval'"] : []
      ],
      // PRODUCTION: Use nonce for inline styles. DEVELOPMENT: Allow unsafe-inline
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        ...isDevelopment ? ["'unsafe-inline'"] : []
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:", process.env.REPLIT_DEV_DOMAIN].filter((x) => Boolean(x)),
      connectSrc: ["'self'", "wss:", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://*.stripe.com", process.env.REPLIT_DEV_DOMAIN].filter((x) => Boolean(x)),
      fontSrc: ["'self'", "data:", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://*.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536e3,
    // 1 year
    includeSubDomains: true,
    preload: false
  },
  frameguard: {
    action: "sameorigin"
  },
  noSniff: true,
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  }
}));
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    return next();
  }
  const acceptEncoding = (req.headers["accept-encoding"] || "").toLowerCase();
  if (req.headers["x-no-compression"] || res.getHeader("Content-Encoding")) {
    return next();
  }
  let compressionMethod = null;
  if (acceptEncoding.includes("br")) {
    compressionMethod = "br";
  } else if (acceptEncoding.includes("gzip")) {
    compressionMethod = "gzip";
  }
  if (!compressionMethod) {
    return next();
  }
  const compressibleTypes = /text\/|application\/json|application\/javascript|application\/xml/;
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);
  const originalSetHeader = res.setHeader.bind(res);
  let compressionStream = null;
  let compressionInitialized = false;
  res.setHeader = function(name, value) {
    const result = originalSetHeader(name, value);
    if (name.toLowerCase() === "content-type" && !compressionInitialized) {
      const shouldCompress = compressibleTypes.test(String(value));
      if (shouldCompress) {
        compressionInitialized = true;
        if (compressionMethod === "br") {
          compressionStream = createBrotliCompress({
            params: {
              [constants.BROTLI_PARAM_QUALITY]: 6
            }
          });
        } else {
          compressionStream = createGzip({ level: 6 });
        }
        const destStream = new Writable({
          write(chunk, encoding, callback) {
            const canContinue = originalWrite(chunk, encoding);
            if (canContinue) {
              callback();
            } else {
              res.once("drain", () => callback());
            }
          },
          final(callback) {
            originalEnd();
            callback();
          }
        });
        pipeline(compressionStream, destStream, (err) => {
          if (err) {
            console.error("Compression pipeline error:", err);
          }
        });
        compressionStream.on("drain", () => {
          res.emit("drain");
        });
        originalSetHeader("Content-Encoding", compressionMethod);
        originalSetHeader("Vary", "Accept-Encoding");
        res.removeHeader("Content-Length");
      }
    }
    return result;
  };
  res.write = function(chunk, encoding, callback) {
    if (compressionStream) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = void 0;
      }
      return compressionStream.write(chunk, encoding, callback);
    } else {
      if (typeof encoding === "function") {
        return originalWrite(chunk, encoding);
      }
      return originalWrite(chunk, encoding, callback);
    }
  };
  res.end = function(chunk, encoding, callback) {
    if (compressionStream) {
      if (typeof chunk === "function") {
        callback = chunk;
        chunk = void 0;
        encoding = void 0;
      } else if (typeof encoding === "function") {
        callback = encoding;
        encoding = void 0;
      }
      compressionStream.end(chunk, encoding, callback);
    } else {
      if (typeof chunk === "function") {
        originalEnd(chunk);
      } else if (typeof encoding === "function") {
        originalEnd(chunk, encoding);
      } else if (callback) {
        originalEnd(chunk, encoding, callback);
      } else if (encoding !== void 0) {
        originalEnd(chunk, encoding);
      } else if (chunk !== void 0) {
        originalEnd(chunk);
      } else {
        originalEnd();
      }
    }
    return res;
  };
  next();
});
var stripe2 = process.env.STRIPE_SECRET_KEY ? new Stripe2(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-11-20.acacia" }) : null;
app.post("/api/webhooks/stripe", express3.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe2) {
    return res.status(503).send("Stripe not configured");
  }
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig) {
    return res.status(400).send("No signature");
  }
  let event;
  try {
    if (webhookSecret) {
      event = stripe2.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;
      if (metadata.userId && metadata.packageId) {
        const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
        const existingPurchase = await storage2.getPurchaseByTransactionId(paymentIntent.id);
        if (existingPurchase) {
          console.log(`Payment ${paymentIntent.id} already processed (found in database), skipping`);
          return res.json({ received: true, already_processed: true });
        }
        const packages = await storage2.getCurrencyPackages(false);
        const currencyPackage = packages.find((p) => p.id === metadata.packageId);
        if (!currencyPackage) {
          console.error(`Package ${metadata.packageId} not found`);
          return res.status(400).json({ error: "Package not found" });
        }
        const expectedAmount = Math.round(parseFloat(currencyPackage.priceUSD) * 100);
        if (paymentIntent.amount !== expectedAmount) {
          console.error(`Amount mismatch: expected ${expectedAmount}, got ${paymentIntent.amount}`);
          return res.status(400).json({ error: "Amount mismatch" });
        }
        const currencyAmount = currencyPackage.currencyAmount;
        const bonusPercentage = currencyPackage.bonusPercentage;
        const totalCoins = currencyAmount + Math.floor(currencyAmount * bonusPercentage / 100);
        const currencyResult = await storage2.processCurrencyChange(
          metadata.userId,
          totalCoins,
          "purchase",
          `Purchased ${metadata.packageName}`,
          metadata.packageId
        );
        if (!currencyResult.success) {
          console.error(`Failed to add currency: ${currencyResult.error}`);
          return res.status(500).json({ error: currencyResult.error });
        }
        await storage2.createUserPurchase({
          userId: metadata.userId,
          packageId: metadata.packageId,
          amountPaid: (paymentIntent.amount / 100).toFixed(2),
          currencyReceived: totalCoins,
          paymentProvider: "stripe",
          transactionId: paymentIntent.id,
          status: "completed"
        });
        console.log(`Successfully processed payment ${paymentIntent.id} for user ${metadata.userId}: +${totalCoins} coins`);
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: error.message });
  }
});
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
    }
  });
  next();
});
(async () => {
  await setupAuth(app);
  await initializeAdminUser();
  const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
  await storage2.initializeOwnerRole();
  await storage2.initializeAdIntensity();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(app, server);
  } else {
    const { serveStatic: serveStatic2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    serveStatic2(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log2(`serving on http://0.0.0.0:${port}`);
  });
  const AD_SCHEDULER_INTERVAL = 5 * 60 * 1e3;
  log2("Starting ad scheduler - running initial schedule update...", "ad-scheduler");
  storage2.autoUpdateAdSchedules().catch((error) => {
    console.error("[ad-scheduler] Error in initial schedule update:", error);
  });
  setInterval(async () => {
    try {
      const result = await storage2.autoUpdateAdSchedules();
      if (result.activated > 0 || result.deactivated > 0) {
        log2(`Schedule update: ${result.activated} activated, ${result.deactivated} deactivated`, "ad-scheduler");
      }
    } catch (error) {
      console.error("[ad-scheduler] Error in scheduled update:", error);
    }
  }, AD_SCHEDULER_INTERVAL);
  log2(`Ad scheduler initialized - will run every ${AD_SCHEDULER_INTERVAL / 1e3 / 60} minutes`, "ad-scheduler");
})();
