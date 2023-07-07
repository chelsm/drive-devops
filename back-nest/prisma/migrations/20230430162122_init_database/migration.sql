-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "users" (
    "usr_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usr_email" TEXT NOT NULL,
    "usr_password" TEXT NOT NULL,
    "usr_profile" UUID,
    "usr_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("usr_id")
);

-- CreateTable
CREATE TABLE "profile" (
    "prf_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prf_firstname" TEXT,
    "prf_lastname" TEXT,
    "prf_civility" TEXT,
    "prf_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prf_updatedAt" TIMESTAMP(3),

    CONSTRAINT "profile_pkey" PRIMARY KEY ("prf_id")
);

-- CreateTable
CREATE TABLE "civility" (
    "cvl_id" SERIAL NOT NULL,
    "cvl_label" TEXT NOT NULL,
    "cvl_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cvl_updatedAt" TIMESTAMP(3),

    CONSTRAINT "civility_pkey" PRIMARY KEY ("cvl_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_email_key" ON "users"("usr_email");

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_profile_key" ON "users"("usr_profile");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_usr_profile_fkey" FOREIGN KEY ("usr_profile") REFERENCES "profile"("prf_id") ON DELETE SET NULL ON UPDATE CASCADE;
