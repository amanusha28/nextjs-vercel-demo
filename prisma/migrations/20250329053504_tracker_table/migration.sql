/*
  Warnings:

  - You are about to drop the column `email` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "tracker" (
    "id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL,

    CONSTRAINT "tracker_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracker_category_year_key" ON "tracker"("category", "year");
