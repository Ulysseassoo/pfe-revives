/*
  Warnings:

  - You are about to drop the column `colorway` on the `Shoe` table. All the data in the column will be lost.
  - Added the required column `color` to the `Shoe` table without a default value. This is not possible if the table is not empty.
  - Made the column `brand` on table `Shoe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model` on table `Shoe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `Shoe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Shoe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Shoe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Shoe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Shoe` DROP COLUMN `colorway`,
    ADD COLUMN `color` VARCHAR(255) NOT NULL,
    MODIFY `brand` VARCHAR(255) NOT NULL,
    MODIFY `model` VARCHAR(255) NOT NULL,
    MODIFY `size` DOUBLE NOT NULL,
    MODIFY `status` VARCHAR(255) NOT NULL,
    MODIFY `price` DOUBLE NOT NULL,
    MODIFY `description` VARCHAR(255) NOT NULL;
