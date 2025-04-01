-- CreateTable
CREATE TABLE "installment" (
    "id" UUID NOT NULL,
    "generate_id" VARCHAR,
    "installment_date" VARCHAR,
    "due_amount" VARCHAR,
    "receiving_date" VARCHAR,
    "status" VARCHAR,
    "loan_id" UUID,
    "accepted_amount" VARCHAR,

    CONSTRAINT "installment_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "generate_id" VARCHAR,
    "id" UUID NOT NULL,
    "type" VARCHAR,
    "installment_id" UUID,
    "payment_date" VARCHAR,
    "amount" VARCHAR,
    "balance" VARCHAR,
    "account_details" VARCHAR,
    "loan_id" UUID,

    CONSTRAINT "payment_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_loan_fk" FOREIGN KEY ("loan_id") REFERENCES "loan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_installment_fk" FOREIGN KEY ("installment_id") REFERENCES "installment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_loan_fk" FOREIGN KEY ("loan_id") REFERENCES "loan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
