/*
  Warnings:

  - The primary key for the `rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_RoomUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms_users_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_rooms_rooms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoomUsers" DROP CONSTRAINT "_RoomUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomUsers" DROP CONSTRAINT "_RoomUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "rooms_users_users" DROP CONSTRAINT "FK_6b3c5f4bbfb29a84a57e442af54";

-- DropForeignKey
ALTER TABLE "rooms_users_users" DROP CONSTRAINT "FK_cbe951142bc45a33a744256516d";

-- DropForeignKey
ALTER TABLE "users_rooms_rooms" DROP CONSTRAINT "FK_be046c829cc9f45adfe322e75e7";

-- DropForeignKey
ALTER TABLE "users_rooms_rooms" DROP CONSTRAINT "FK_df57dc27d23e464abaa467017a7";

-- AlterTable
ALTER TABLE "rooms" DROP CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2",
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_RoomUsers";

-- DropTable
DROP TABLE "rooms_users_users";

-- DropTable
DROP TABLE "users_rooms_rooms";

-- DropEnum
DROP TYPE "user_gender_enum";

-- CreateTable
CREATE TABLE "_UserRooms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserRooms_AB_unique" ON "_UserRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_UserRooms_B_index" ON "_UserRooms"("B");

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
