-- AlterTable
ALTER TABLE `Location` ADD COLUMN `imageBase64` VARCHAR(191) NULL,
    ADD COLUMN `imageMime` VARCHAR(191) NULL,
    ADD COLUMN `locationName` VARCHAR(191) NULL,
    ADD COLUMN `screenHeight` DOUBLE NULL,
    ADD COLUMN `screenWidth` DOUBLE NULL;
