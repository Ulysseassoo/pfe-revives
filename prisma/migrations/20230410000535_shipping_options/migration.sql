/*
  Warnings:

  - Made the column `name` on table `ShippingOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `ShippingOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ShippingOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimated_delivery_time` on table `ShippingOption` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ShippingOption` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `price` DOUBLE NOT NULL,
    MODIFY `estimated_delivery_time` VARCHAR(191) NOT NULL;
