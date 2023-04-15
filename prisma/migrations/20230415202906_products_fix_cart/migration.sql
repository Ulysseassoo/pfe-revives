/*
  Warnings:

  - You are about to drop the column `price` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `products` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_productId_fkey`;

-- AlterTable
ALTER TABLE `Cart` DROP COLUMN `price`,
    DROP COLUMN `productId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `products` LONGTEXT NOT NULL;
