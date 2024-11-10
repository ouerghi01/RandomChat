/*
  Warnings:

  - You are about to drop the `_roomsTousers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_roomsTousers" DROP CONSTRAINT "_roomsTousers_A_fkey";

-- DropForeignKey
ALTER TABLE "_roomsTousers" DROP CONSTRAINT "_roomsTousers_B_fkey";

-- DropTable
DROP TABLE "_roomsTousers";

-- DropTable
DROP TABLE "message";

-- CreateTable
CREATE TABLE "users_rooms_rooms" (
    "usersId" INTEGER NOT NULL,
    "roomsId" VARCHAR NOT NULL,

    CONSTRAINT "PK_70f0b3aef34e4e66970a4957278" PRIMARY KEY ("usersId","roomsId")
);

-- CreateIndex
CREATE INDEX "IDX_be046c829cc9f45adfe322e75e" ON "users_rooms_rooms"("usersId");

-- CreateIndex
CREATE INDEX "IDX_df57dc27d23e464abaa467017a" ON "users_rooms_rooms"("roomsId");

-- AddForeignKey
ALTER TABLE "users_rooms_rooms" ADD CONSTRAINT "FK_be046c829cc9f45adfe322e75e7" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_rooms_rooms" ADD CONSTRAINT "FK_df57dc27d23e464abaa467017a7" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "UQ_9485ab8767f336dce69c3b7631d" RENAME TO "REL_9485ab8767f336dce69c3b7631";
