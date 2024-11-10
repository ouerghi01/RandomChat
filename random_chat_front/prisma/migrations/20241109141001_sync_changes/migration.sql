-- CreateEnum
CREATE TYPE "user_gender_enum" AS ENUM ('m', 'f');

-- CreateEnum
CREATE TYPE "users_gender_enum" AS ENUM ('m', 'f');

-- CreateTable
CREATE TABLE "friendship" (
    "id" SERIAL NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" INTEGER,
    "receiver_id" INTEGER,

    CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "sender_id" INTEGER,
    "id" VARCHAR NOT NULL,
    "receiver_id" INTEGER,

    CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "user_gender_enum" NOT NULL,
    "password" VARCHAR(30) NOT NULL,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "users_gender_enum" NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" INTEGER,
    "roomId" VARCHAR,

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_53745bfa52d5d4c94fd4cd0ccb4" ON "rooms"("sender_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_4e3908821654edfa486d24a028f" ON "rooms"("receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_9485ab8767f336dce69c3b7631d" ON "users"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_33bc07e7cd5c7e8bb7ac570f1ed" ON "users"("roomId");

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "FK_86463167c10dc37dbf9d39728bd" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "FK_8cced01afb7c006b9643aed97bf" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "FK_4e3908821654edfa486d24a028f" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "FK_53745bfa52d5d4c94fd4cd0ccb4" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "FK_33bc07e7cd5c7e8bb7ac570f1ed" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "FK_9485ab8767f336dce69c3b7631d" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
