/*
  Warnings:

  - You are about to drop the column `image_url` on the `article_categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `article_categories` table. All the data in the column will be lost.
  - You are about to drop the column `social_media_post` on the `article_ideas` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `article_tags` table. All the data in the column will be lost.
  - You are about to drop the column `banned_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_methods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plugins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taxi_car_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taxi_trips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taxi_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth" DROP CONSTRAINT "auth_user_id_fkey";

-- DropForeignKey
ALTER TABLE "logins" DROP CONSTRAINT "logins_authId_fkey";

-- DropForeignKey
ALTER TABLE "payment_methods" DROP CONSTRAINT "payment_methods_userID_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "taxi_trips" DROP CONSTRAINT "taxi_trips_car_type_fkey";

-- DropForeignKey
ALTER TABLE "taxi_trips" DROP CONSTRAINT "taxi_trips_passenger_id_fkey";

-- DropForeignKey
ALTER TABLE "taxi_users" DROP CONSTRAINT "taxi_users_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_subscription_id_fkey";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "article_categories" DROP COLUMN "image_url",
DROP COLUMN "updated_at",
ADD COLUMN     "logo_url" TEXT;

-- AlterTable
ALTER TABLE "article_ideas" DROP COLUMN "social_media_post",
ADD COLUMN     "tweet" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "article_tags" DROP COLUMN "image_url",
ADD COLUMN     "seo_image_url" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "outdated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "photo_urls" TEXT[],
ADD COLUMN     "source_code_url" TEXT,
ADD COLUMN     "table_of_contents" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "banned_at",
DROP COLUMN "display_name",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "encrypted_password" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "reset_token" TEXT;

-- DropTable
DROP TABLE "auth";

-- DropTable
DROP TABLE "logins";

-- DropTable
DROP TABLE "payment_methods";

-- DropTable
DROP TABLE "plugins";

-- DropTable
DROP TABLE "settings";

-- DropTable
DROP TABLE "subscription_plans";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "taxi_car_categories";

-- DropTable
DROP TABLE "taxi_trips";

-- DropTable
DROP TABLE "taxi_users";

-- DropTable
DROP TABLE "transactions";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "is_free" BOOLEAN,
    "subtitle" TEXT,
    "all_features_html" TEXT,
    "app_store_demo_url" TEXT,
    "cover_photo_url" TEXT,
    "demo_video_url" TEXT,
    "demo_image_url" TEXT,
    "description_html" TEXT,
    "main_features_html" TEXT,
    "play_store_demo_url" TEXT,
    "preview_photo_urls" TEXT[],
    "all_previews_html" TEXT,
    "second_subtitle" TEXT,
    "second_title" TEXT,
    "whats_included_html" TEXT,
    "author_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,
    "preview_section_title" TEXT,
    "seo_keyword" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "url" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "featured_on_front_page" BOOLEAN NOT NULL DEFAULT true,
    "is_premium_codebase" BOOLEAN,
    "is_bundle" BOOLEAN,
    "is_web_product" BOOLEAN DEFAULT false,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "price" TEXT,
    "fastspring_slug" TEXT,
    "buy_url" TEXT,
    "created_at" TEXT,
    "product_id" TEXT,
    "updated_at" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freebie_variants" (
    "id" TEXT NOT NULL,
    "download_url" TEXT,
    "repository_url" TEXT,
    "product_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "freebie_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "license_no" TEXT,
    "customer_email" TEXT,
    "fastspring_order_id" TEXT,
    "total_in_payout_currency" TEXT,
    "tax_in_payout_currency" TEXT,
    "net_income" TEXT,
    "discount_in_payout_currency" TEXT,
    "fastspring_product_slug" TEXT,
    "fastspring_download_url" TEXT,
    "fastspring_account_id" TEXT,
    "invoice_url" TEXT,
    "local_currency" TEXT,
    "payment_type" TEXT,
    "country" TEXT,
    "status" TEXT,
    "fastspring_json" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,
    "variant_id" TEXT,
    "user_id" TEXT,
    "is_refund" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freebie_downloads" (
    "id" TEXT NOT NULL,
    "customer_email" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,
    "user_id" TEXT,
    "freebie_variant_id" TEXT,

    CONSTRAINT "freebie_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "user_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "logo_url" TEXT,
    "parent_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "tag_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "logo_url" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "tag_category_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_reviews" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "star_count" INTEGER,
    "author_id" TEXT,
    "created_at" TEXT,
    "product_id" TEXT,
    "variant_id" TEXT,
    "updated_at" TEXT,
    "license_no" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "customer_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "email_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_subscriber_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "email_subscriber_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TEXT,
    "updated_at" TEXT,
    "email_subject" TEXT,
    "email_content" TEXT,
    "trigger" TEXT NOT NULL DEFAULT 'email_trigger_none',
    "timing_type" TEXT NOT NULL DEFAULT 'immediately',
    "delay_in_seconds" INTEGER DEFAULT 0,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_newsletters" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "email_subject" TEXT,
    "from_address" TEXT,
    "from_name" TEXT,
    "email_content" TEXT,
    "status" TEXT,
    "total_recipients" INTEGER,
    "current_recipients" INTEGER,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "email_newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_settings" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL DEFAULT '',
    "key" TEXT,
    "value" TEXT,

    CONSTRAINT "email_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL,
    "token" TEXT,
    "to" TEXT,
    "from" TEXT,
    "subject" TEXT,
    "content" TEXT,
    "created_at" TEXT,
    "marked_as_read" BOOLEAN NOT NULL DEFAULT false,
    "marked_as_open" BOOLEAN NOT NULL DEFAULT false,
    "send_at" TEXT,
    "campaign_id" TEXT,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_queue" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "data" TEXT,
    "status" TEXT,
    "priority" TEXT,
    "start_time" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "job_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_threads" (
    "id" TEXT NOT NULL,
    "number" INTEGER,
    "author_email" TEXT,
    "author_name" TEXT,
    "message_count" INTEGER,
    "subject" TEXT,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TEXT,
    "updated_at" TEXT,
    "user_id" TEXT,

    CONSTRAINT "ticket_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" TEXT NOT NULL,
    "author_email" TEXT,
    "from_original_poster" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "thread_id" TEXT,
    "user_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TEXT,

    CONSTRAINT "ticket_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respositories" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "respositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_jobs" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "data" TEXT,
    "status" TEXT,
    "priority" TEXT,
    "start_time" TEXT,
    "user_id" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "user_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToUserTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailSubscriberToEmailSubscriberTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailCampaignToEmailSubscriberTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailNewsletterToEmailSubscriberTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TicketTagToTicketThread" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_license_no_key" ON "purchases"("license_no");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_fastspring_order_id_key" ON "purchases"("fastspring_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_tags_slug_key" ON "user_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tag_categories_slug_key" ON "tag_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "email_subscribers_email_key" ON "email_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "emails_token_key" ON "emails"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_threads_number_key" ON "ticket_threads"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_tags_slug_key" ON "ticket_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "_ProductToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserTag_AB_unique" ON "_UserToUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserTag_B_index" ON "_UserToUserTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailSubscriberToEmailSubscriberTag_AB_unique" ON "_EmailSubscriberToEmailSubscriberTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailSubscriberToEmailSubscriberTag_B_index" ON "_EmailSubscriberToEmailSubscriberTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailCampaignToEmailSubscriberTag_AB_unique" ON "_EmailCampaignToEmailSubscriberTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailCampaignToEmailSubscriberTag_B_index" ON "_EmailCampaignToEmailSubscriberTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailNewsletterToEmailSubscriberTag_AB_unique" ON "_EmailNewsletterToEmailSubscriberTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailNewsletterToEmailSubscriberTag_B_index" ON "_EmailNewsletterToEmailSubscriberTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TicketTagToTicketThread_AB_unique" ON "_TicketTagToTicketThread"("A", "B");

-- CreateIndex
CREATE INDEX "_TicketTagToTicketThread_B_index" ON "_TicketTagToTicketThread"("B");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freebie_variants" ADD CONSTRAINT "freebie_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freebie_downloads" ADD CONSTRAINT "freebie_downloads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freebie_downloads" ADD CONSTRAINT "freebie_downloads_freebie_variant_id_fkey" FOREIGN KEY ("freebie_variant_id") REFERENCES "freebie_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_categories" ADD CONSTRAINT "tag_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "tag_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tag_category_id_fkey" FOREIGN KEY ("tag_category_id") REFERENCES "tag_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "email_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_threads" ADD CONSTRAINT "ticket_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "ticket_threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respositories" ADD CONSTRAINT "respositories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_jobs" ADD CONSTRAINT "user_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserTag" ADD CONSTRAINT "_UserToUserTag_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserTag" ADD CONSTRAINT "_UserToUserTag_B_fkey" FOREIGN KEY ("B") REFERENCES "user_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailSubscriberToEmailSubscriberTag" ADD CONSTRAINT "_EmailSubscriberToEmailSubscriberTag_A_fkey" FOREIGN KEY ("A") REFERENCES "email_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailSubscriberToEmailSubscriberTag" ADD CONSTRAINT "_EmailSubscriberToEmailSubscriberTag_B_fkey" FOREIGN KEY ("B") REFERENCES "email_subscriber_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailCampaignToEmailSubscriberTag" ADD CONSTRAINT "_EmailCampaignToEmailSubscriberTag_A_fkey" FOREIGN KEY ("A") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailCampaignToEmailSubscriberTag" ADD CONSTRAINT "_EmailCampaignToEmailSubscriberTag_B_fkey" FOREIGN KEY ("B") REFERENCES "email_subscriber_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailNewsletterToEmailSubscriberTag" ADD CONSTRAINT "_EmailNewsletterToEmailSubscriberTag_A_fkey" FOREIGN KEY ("A") REFERENCES "email_newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailNewsletterToEmailSubscriberTag" ADD CONSTRAINT "_EmailNewsletterToEmailSubscriberTag_B_fkey" FOREIGN KEY ("B") REFERENCES "email_subscriber_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketTagToTicketThread" ADD CONSTRAINT "_TicketTagToTicketThread_A_fkey" FOREIGN KEY ("A") REFERENCES "ticket_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketTagToTicketThread" ADD CONSTRAINT "_TicketTagToTicketThread_B_fkey" FOREIGN KEY ("B") REFERENCES "ticket_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
