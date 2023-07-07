/*
  Warnings:

  - Added the required column `usr_username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "usr_refreshToken" TEXT,
ADD COLUMN     "usr_username" TEXT NOT NULL;
