CREATE TABLE `Schedule` (
  `id` VARCHAR(191) NOT NULL,
  `circleId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(120) NOT NULL,
  `description` TEXT NULL,
  `locationName` VARCHAR(191) NULL,
  `startsAt` DATETIME(3) NOT NULL,
  `endsAt` DATETIME(3) NULL,
  `companionUserId` VARCHAR(191) NULL,
  `createdById` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Schedule_circleId_startsAt_idx` (`circleId`, `startsAt`),
  INDEX `Schedule_companionUserId_idx` (`companionUserId`),
  INDEX `Schedule_createdById_idx` (`createdById`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ChecklistItem` (
  `id` VARCHAR(191) NOT NULL,
  `circleId` VARCHAR(191) NOT NULL,
  `scheduleId` VARCHAR(191) NOT NULL,
  `label` VARCHAR(160) NOT NULL,
  `assignedToId` VARCHAR(191) NULL,
  `position` INTEGER NOT NULL DEFAULT 0,
  `completedAt` DATETIME(3) NULL,
  `completedById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `ChecklistItem_circleId_scheduleId_position_idx` (`circleId`, `scheduleId`, `position`),
  INDEX `ChecklistItem_assignedToId_idx` (`assignedToId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Note` (
  `id` VARCHAR(191) NOT NULL,
  `circleId` VARCHAR(191) NOT NULL,
  `body` TEXT NOT NULL,
  `scheduleId` VARCHAR(191) NULL,
  `isPinned` BOOLEAN NOT NULL DEFAULT false,
  `createdById` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Note_circleId_isPinned_createdAt_idx` (`circleId`, `isPinned`, `createdAt`),
  INDEX `Note_scheduleId_idx` (`scheduleId`),
  INDEX `Note_createdById_idx` (`createdById`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ActivityEvent`
  ADD COLUMN `scheduleId` VARCHAR(191) NULL,
  ADD COLUMN `noteId` VARCHAR(191) NULL,
  ADD INDEX `ActivityEvent_scheduleId_idx` (`scheduleId`),
  ADD INDEX `ActivityEvent_noteId_idx` (`noteId`);

ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_companionUserId_fkey` FOREIGN KEY (`companionUserId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ChecklistItem` ADD CONSTRAINT `ChecklistItem_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ChecklistItem` ADD CONSTRAINT `ChecklistItem_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ChecklistItem` ADD CONSTRAINT `ChecklistItem_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ChecklistItem` ADD CONSTRAINT `ChecklistItem_completedById_fkey` FOREIGN KEY (`completedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Note` ADD CONSTRAINT `Note_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Note` ADD CONSTRAINT `Note_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Note` ADD CONSTRAINT `Note_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ActivityEvent` ADD CONSTRAINT `ActivityEvent_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ActivityEvent` ADD CONSTRAINT `ActivityEvent_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
