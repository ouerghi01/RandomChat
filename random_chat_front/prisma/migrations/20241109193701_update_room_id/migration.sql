/*
  Warnings:

  - The primary key for the `rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the `_UserRooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserRooms" DROP CONSTRAINT "_UserRooms_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRooms" DROP CONSTRAINT "_UserRooms_B_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2",
DROP COLUMN "name",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id");
DROP SEQUENCE "rooms_id_seq";

-- DropTable
DROP TABLE "_UserRooms";

-- CreateTable
CREATE TABLE "_roomsTousers" (
    "A" VARCHAR NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_roomsTousers_AB_unique" ON "_roomsTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_roomsTousers_B_index" ON "_roomsTousers"("B");

-- AddForeignKey
ALTER TABLE "_roomsTousers" ADD CONSTRAINT "_roomsTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roomsTousers" ADD CONSTRAINT "_roomsTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
