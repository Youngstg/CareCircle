CREATE TABLE `CircleInvite` (
  `id` VARCHAR(191) NOT NULL,
  `circleId` VARCHAR(191) NOT NULL,
  `codeHash` CHAR(64) NOT NULL,
  `createdById` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `maxUses` INTEGER NOT NULL DEFAULT 10,
  `useCount` INTEGER NOT NULL DEFAULT 0,
  `revokedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `CircleInvite_codeHash_key` (`codeHash`),
  INDEX `CircleInvite_circleId_createdAt_idx` (`circleId`, `createdAt`),
  INDEX `CircleInvite_createdById_idx` (`createdById`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CircleInvite` ADD CONSTRAINT `CircleInvite_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CircleInvite` ADD CONSTRAINT `CircleInvite_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
