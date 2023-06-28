/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `ShippingAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ShippingAddress_user_id_key` ON `ShippingAddress`(`user_id`);
