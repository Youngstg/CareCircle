-- CreateTable
CREATE TABLE `CareContact` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `role` VARCHAR(80) NOT NULL,
    `phoneNumber` VARCHAR(50) NOT NULL,
    `whatsapp` VARCHAR(50) NULL,
    `address` VARCHAR(255) NULL,
    `note` TEXT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CareContact_circleId_role_idx`(`circleId`, `role`),
    INDEX `CareContact_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CareContact` ADD CONSTRAINT `CareContact_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareContact` ADD CONSTRAINT `CareContact_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
