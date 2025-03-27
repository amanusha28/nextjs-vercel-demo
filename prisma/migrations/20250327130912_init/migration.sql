-- CreateTable
CREATE TABLE "customer" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255),
    "generate_id" VARCHAR,
    "gender" VARCHAR(255),
    "ic" VARCHAR(255),
    "name" VARCHAR(255),
    "passport" VARCHAR(255),
    "race" VARCHAR(255),
    "deleted_at" TIMESTAMP(3),
    "bank_details" JSONB,
    "customer_address" JSONB,
    "employment" JSONB,
    "relations" JSONB,
    "supervisor" UUID,
    "car_plate" VARCHAR(255),
    "marital_status" VARCHAR(255),
    "mobile_no" VARCHAR(255),
    "no_of_child" INTEGER,
    "tel_code" VARCHAR(255),
    "tel_no" VARCHAR(255),
    "status" VARCHAR(255),
    "remarks" JSONB,
    "created_by" UUID,

    CONSTRAINT "customer_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_ic_key" ON "customer"("ic");

-- CreateIndex
CREATE UNIQUE INDEX "customer_passport_key" ON "customer"("passport");
