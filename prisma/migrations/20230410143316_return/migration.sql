/*
  Warnings:

  - Made the column `order_id` on table `Return` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason` on table `Return` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Return` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Return` DROP FOREIGN KEY `Return_order_id_fkey`;

-- AlterTable
ALTER TABLE `Return` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `reason` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Return` ADD CONSTRAINT `Return_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
