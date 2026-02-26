-- CreateTable
CREATE TABLE "tenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "branch_id" INTEGER,
    "role_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "features" JSONB,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_subscription" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tenant_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "pdf_url" TEXT,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_history" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "PLU" TEXT,
    "barcode" TEXT,
    "time_availability" JSONB,
    "day_availability" JSONB,
    "stock_qty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon_group" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "addon_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon" (
    "id" SERIAL NOT NULL,
    "addon_group_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_collection" (
    "product_id" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,

    CONSTRAINT "product_collection_pkey" PRIMARY KEY ("product_id","collection_id")
);

-- CreateTable
CREATE TABLE "allergen" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_allergen" (
    "product_id" INTEGER NOT NULL,
    "allergen_id" INTEGER NOT NULL,

    CONSTRAINT "product_allergen_pkey" PRIMARY KEY ("product_id","allergen_id")
);

-- CreateTable
CREATE TABLE "dietary_flag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "dietary_flag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_dietary_flag" (
    "product_id" INTEGER NOT NULL,
    "dietary_flag_id" INTEGER NOT NULL,

    CONSTRAINT "product_dietary_flag_pkey" PRIMARY KEY ("product_id","dietary_flag_id")
);

-- CreateTable
CREATE TABLE "table_entity" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shape" TEXT,
    "seats" INTEGER,
    "QR_code" TEXT,
    "status" TEXT,
    "floor" TEXT,

    CONSTRAINT "table_entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "table_id" INTEGER NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "waiter_id" INTEGER,
    "status" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_entity" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER,
    "branch_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "order_type" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "status" TEXT,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "payment_method" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "tip" DECIMAL(10,2) DEFAULT 0,
    "card_type" TEXT,
    "card_last4" TEXT,
    "split_cash_amount" DECIMAL(10,2),
    "split_card_amount" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_zone" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "polygon_coords" TEXT,
    "min_order_value" DECIMAL(10,2),
    "pricing_tier" JSONB,

    CONSTRAINT "delivery_zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kds_screen" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "name" TEXT,
    "type" TEXT,

    CONSTRAINT "kds_screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kds_order" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "screen_id" INTEGER NOT NULL,
    "status" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kds_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_points" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT,
    "criteria" JSONB,

    CONSTRAINT "segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_code" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT,
    "value" DECIMAL(10,2),
    "valid_from" TIMESTAMP(3),
    "valid_to" TIMESTAMP(3),

    CONSTRAINT "discount_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_log" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER,
    "error_message" TEXT,
    "stack_trace" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "success" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiskaly_transaction" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "transaction_id" TEXT,
    "status" TEXT,
    "signed_at" TIMESTAMP(3),

    CONSTRAINT "fiskaly_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_payment" (
    "id" SERIAL NOT NULL,
    "payment_id" TEXT,
    "order_id" INTEGER,
    "amount" DECIMAL(10,2),
    "status" TEXT,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "stripe_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paypal_payment" (
    "id" SERIAL NOT NULL,
    "payment_id" TEXT,
    "order_id" INTEGER,
    "amount" DECIMAL(10,2),
    "status" TEXT,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "paypal_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sendgrid_email" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "template_id" TEXT,
    "sent_at" TIMESTAMP(3),
    "status" TEXT,

    CONSTRAINT "sendgrid_email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twilio_sms" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "message" TEXT,
    "sent_at" TIMESTAMP(3),
    "status" TEXT,

    CONSTRAINT "twilio_sms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google_maps_address" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "address" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "validated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "google_maps_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_subdomain_key" ON "tenant"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "allergen_name_key" ON "allergen"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dietary_flag_name_key" ON "dietary_flag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_points_customer_id_key" ON "loyalty_points"("customer_id");

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_subscription" ADD CONSTRAINT "tenant_subscription_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_subscription" ADD CONSTRAINT "tenant_subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_group" ADD CONSTRAINT "addon_group_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon" ADD CONSTRAINT "addon_addon_group_id_fkey" FOREIGN KEY ("addon_group_id") REFERENCES "addon_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_collection" ADD CONSTRAINT "product_collection_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_collection" ADD CONSTRAINT "product_collection_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_allergen" ADD CONSTRAINT "product_allergen_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_allergen" ADD CONSTRAINT "product_allergen_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "allergen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_dietary_flag" ADD CONSTRAINT "product_dietary_flag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_dietary_flag" ADD CONSTRAINT "product_dietary_flag_dietary_flag_id_fkey" FOREIGN KEY ("dietary_flag_id") REFERENCES "dietary_flag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_entity" ADD CONSTRAINT "table_entity_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "table_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_waiter_id_fkey" FOREIGN KEY ("waiter_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_entity" ADD CONSTRAINT "order_entity_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_entity" ADD CONSTRAINT "order_entity_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_entity" ADD CONSTRAINT "order_entity_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_zone" ADD CONSTRAINT "delivery_zone_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kds_screen" ADD CONSTRAINT "kds_screen_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kds_order" ADD CONSTRAINT "kds_order_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kds_order" ADD CONSTRAINT "kds_order_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "kds_screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment" ADD CONSTRAINT "segment_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_code" ADD CONSTRAINT "discount_code_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_log" ADD CONSTRAINT "error_log_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiskaly_transaction" ADD CONSTRAINT "fiskaly_transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_payment" ADD CONSTRAINT "stripe_payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paypal_payment" ADD CONSTRAINT "paypal_payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sendgrid_email" ADD CONSTRAINT "sendgrid_email_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twilio_sms" ADD CONSTRAINT "twilio_sms_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_maps_address" ADD CONSTRAINT "google_maps_address_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
