-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;
