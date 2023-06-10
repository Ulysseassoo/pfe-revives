/*
  Warnings:

  - You are about to drop the column `size` on the `Shoe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Shoe` DROP COLUMN `size`;

-- CreateTable
CREATE TABLE `Size` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size` DOUBLE NOT NULL,
    `shoeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Size` ADD CONSTRAINT `Size_shoeId_fkey` FOREIGN KEY (`shoeId`) REFERENCES `Shoe`(`shoe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
