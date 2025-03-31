-- CreateTable
CREATE TABLE "loan" (
    "id" UUID NOT NULL,
    "customer_id" UUID,
    "repayment_date" VARCHAR,
    "principal_amount" VARCHAR,
    "deposit_amount" VARCHAR,
    "application_fee" VARCHAR,
    "interest" VARCHAR,
    "remark" VARCHAR,
    "created_by" UUID,
    "supervisor" UUID,
    "supervisor_2" UUID,
    "date_period" VARCHAR,
    "loan_remark" VARCHAR,
    "unit_of_date" VARCHAR,
    "generate_id" VARCHAR NOT NULL,
    "repayment_term" VARCHAR,
    "status" VARCHAR,
    "amount_given" VARCHAR,
    "interest_amount" VARCHAR,
    "payment_per_term" VARCHAR,

    CONSTRAINT "loan_pk" PRIMARY KEY ("id")
);
