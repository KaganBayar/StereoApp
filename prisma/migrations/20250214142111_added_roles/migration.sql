-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY['member']::TEXT[];
