-- DropForeignKey
ALTER TABLE "users_rooms_rooms" DROP CONSTRAINT "FK_df57dc27d23e464abaa467017a7";

-- AddForeignKey
ALTER TABLE "users_rooms_rooms" ADD CONSTRAINT "FK_df57dc27d23e464abaa467017a7" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
