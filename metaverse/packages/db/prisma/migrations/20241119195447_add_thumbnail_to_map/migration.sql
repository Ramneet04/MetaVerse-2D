/*
  Warnings:

  - Added the required column `thumbNail` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "thumbNail" TEXT NOT NULL;
