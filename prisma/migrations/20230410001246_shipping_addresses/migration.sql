/*
  Warnings:

  - Made the column `user_id` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `full_name` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address_line_1` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zip_code` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ShippingAddress` DROP FOREIGN KEY `ShippingAddress_user_id_fkey`;

-- AlterTable
ALTER TABLE `ShippingAddress` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `full_name` VARCHAR(255) NOT NULL,
    MODIFY `address_line_1` VARCHAR(255) NOT NULL,
    MODIFY `city` VARCHAR(255) NOT NULL,
    MODIFY `state` VARCHAR(255) NOT NULL,
    MODIFY `zip_code` VARCHAR(255) NOT NULL,
    MODIFY `country` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `ShippingAddress` ADD CONSTRAINT `ShippingAddress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
