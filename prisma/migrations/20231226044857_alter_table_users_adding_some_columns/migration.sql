/*
  Warnings:

  - You are about to drop the column `cpf` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "roles" ADD VALUE 'PREMIUM';

-- DropIndex
DROP INDEX "users_cpf_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cpf",
DROP COLUMN "genre",
DROP COLUMN "phone",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
