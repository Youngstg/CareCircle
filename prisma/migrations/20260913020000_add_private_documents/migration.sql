CREATE TABLE `Document` (
  `id` VARCHAR(191) NOT NULL,
  `circleId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `category` VARCHAR(80) NOT NULL,
  `originalName` VARCHAR(255) NOT NULL,
  `objectKey` VARCHAR(191) NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `sizeBytes` INTEGER NOT NULL,
  `note` TEXT NULL,
  `uploaderId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `Document_objectKey_key` (`objectKey`),
  INDEX `Document_circleId_category_createdAt_idx` (`circleId`, `category`, `createdAt`),
  INDEX `Document_uploaderId_idx` (`uploaderId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ActivityEvent`
  ADD COLUMN `documentId` VARCHAR(191) NULL,
  ADD INDEX `ActivityEvent_documentId_idx` (`documentId`);

ALTER TABLE `Document` ADD CONSTRAINT `Document_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Document` ADD CONSTRAINT `Document_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ActivityEvent` ADD CONSTRAINT `ActivityEvent_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
