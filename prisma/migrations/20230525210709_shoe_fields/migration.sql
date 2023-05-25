/*
  Warnings:

  - Added the required column `rate` to the `Shoe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `real_price` to the `Shoe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shoe` ADD COLUMN `rate` INTEGER NOT NULL,
    ADD COLUMN `real_price` DOUBLE NOT NULL;
