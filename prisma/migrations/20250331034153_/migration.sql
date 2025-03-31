/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `loan` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `loan` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor` on the `loan` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor_2` on the `loan` table. All the data in the column will be lost.
  - You are about to drop the column `unit_of_date` on the `loan` table. All the data in the column will be lost.
  - The `repayment_date` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `principal_amount` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deposit_amount` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `application_fee` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interest` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_period` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `loan_remark` on the `loan` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - The `repayment_term` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `status` on the `loan` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - The `amount_given` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interest_amount` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `payment_per_term` column on the `loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "loan" DROP COLUMN "deleted_at",
DROP COLUMN "remark",
DROP COLUMN "supervisor",
DROP COLUMN "supervisor_2",
DROP COLUMN "unit_of_date",
ADD COLUMN     "agent_1" UUID,
ADD COLUMN     "agent_2" UUID,
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "unit_period" INTEGER,
DROP COLUMN "repayment_date",
ADD COLUMN     "repayment_date" TIMESTAMP(3),
DROP COLUMN "principal_amount",
ADD COLUMN     "principal_amount" DOUBLE PRECISION,
DROP COLUMN "deposit_amount",
ADD COLUMN     "deposit_amount" DOUBLE PRECISION,
DROP COLUMN "application_fee",
ADD COLUMN     "application_fee" DOUBLE PRECISION,
DROP COLUMN "interest",
ADD COLUMN     "interest" DOUBLE PRECISION,
DROP COLUMN "date_period",
ADD COLUMN     "date_period" INTEGER,
ALTER COLUMN "loan_remark" SET DATA TYPE VARCHAR(255),
DROP COLUMN "repayment_term",
ADD COLUMN     "repayment_term" INTEGER,
ALTER COLUMN "status" SET DATA TYPE VARCHAR(255),
DROP COLUMN "amount_given",
ADD COLUMN     "amount_given" DOUBLE PRECISION,
DROP COLUMN "interest_amount",
ADD COLUMN     "interest_amount" DOUBLE PRECISION,
DROP COLUMN "payment_per_term",
ADD COLUMN     "payment_per_term" DOUBLE PRECISION;
