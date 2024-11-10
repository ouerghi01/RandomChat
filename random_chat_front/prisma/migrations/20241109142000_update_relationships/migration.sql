/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `rooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "FK_4e3908821654edfa486d24a028f";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "FK_53745bfa52d5d4c94fd4cd0ccb4";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "FK_33bc07e7cd5c7e8bb7ac570f1ed";

-- DropIndex
DROP INDEX "UQ_4e3908821654edfa486d24a028f";

-- DropIndex
DROP INDEX "UQ_53745bfa52d5d4c94fd4cd0ccb4";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "receiver_id",
DROP COLUMN "sender_id";

-- CreateTable
CREATE TABLE "_RoomUsers" (
    "A" VARCHAR NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomUsers_AB_unique" ON "_RoomUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomUsers_B_index" ON "_RoomUsers"("B");

-- AddForeignKey
ALTER TABLE "_RoomUsers" ADD CONSTRAINT "_RoomUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomUsers" ADD CONSTRAINT "_RoomUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
