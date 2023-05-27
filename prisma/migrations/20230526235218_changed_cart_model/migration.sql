/*
  Warnings:

  - You are about to alter the column `products` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `Cart` MODIFY `products` JSON NOT NULL;
