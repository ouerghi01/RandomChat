/*
  Warnings:

  - You are about to drop the column `roomId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UQ_33bc07e7cd5c7e8bb7ac570f1ed";

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "date_created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roomId";

-- CreateTable
CREATE TABLE "rooms_users_users" (
    "roomsId" VARCHAR NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "PK_ec0e74b500eaad3d92f5179fb01" PRIMARY KEY ("roomsId","usersId")
);

-- CreateTable
CREATE TABLE "users_rooms_rooms" (
    "usersId" INTEGER NOT NULL,
    "roomsId" VARCHAR NOT NULL,

    CONSTRAINT "PK_70f0b3aef34e4e66970a4957278" PRIMARY KEY ("usersId","roomsId")
);

-- CreateIndex
CREATE INDEX "IDX_6b3c5f4bbfb29a84a57e442af5" ON "rooms_users_users"("usersId");

-- CreateIndex
CREATE INDEX "IDX_cbe951142bc45a33a744256516" ON "rooms_users_users"("roomsId");

-- CreateIndex
CREATE INDEX "IDX_be046c829cc9f45adfe322e75e" ON "users_rooms_rooms"("usersId");

-- CreateIndex
CREATE INDEX "IDX_df57dc27d23e464abaa467017a" ON "users_rooms_rooms"("roomsId");

-- AddForeignKey
ALTER TABLE "rooms_users_users" ADD CONSTRAINT "FK_6b3c5f4bbfb29a84a57e442af54" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rooms_users_users" ADD CONSTRAINT "FK_cbe951142bc45a33a744256516d" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_rooms_rooms" ADD CONSTRAINT "FK_be046c829cc9f45adfe322e75e7" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_rooms_rooms" ADD CONSTRAINT "FK_df57dc27d23e464abaa467017a7" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
