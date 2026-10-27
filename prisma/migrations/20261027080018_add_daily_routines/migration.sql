-- CreateTable
CREATE TABLE `DailyRoutine` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'MEDICATION',
    `timeOfDay` ENUM('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT') NOT NULL DEFAULT 'MORNING',
    `customTime` VARCHAR(20) NULL,
    `note` TEXT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DailyRoutine_circleId_timeOfDay_idx`(`circleId`, `timeOfDay`),
    INDEX `DailyRoutine_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoutineLog` (
    `id` VARCHAR(191) NOT NULL,
    `routineId` VARCHAR(191) NOT NULL,
    `dateStr` VARCHAR(10) NOT NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedById` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,

    INDEX `RoutineLog_routineId_dateStr_idx`(`routineId`, `dateStr`),
    INDEX `RoutineLog_completedById_idx`(`completedById`),
    UNIQUE INDEX `RoutineLog_routineId_dateStr_key`(`routineId`, `dateStr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyRoutine` ADD CONSTRAINT `DailyRoutine_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `CareCircle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyRoutine` ADD CONSTRAINT `DailyRoutine_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineLog` ADD CONSTRAINT `RoutineLog_routineId_fkey` FOREIGN KEY (`routineId`) REFERENCES `DailyRoutine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineLog` ADD CONSTRAINT `RoutineLog_completedById_fkey` FOREIGN KEY (`completedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
