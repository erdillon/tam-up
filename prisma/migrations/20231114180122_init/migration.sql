-- CreateEnum
CREATE TYPE "ResolveStatus" AS ENUM ('RESOLVED', 'UNRESOLVED', 'ERROR');

-- CreateEnum
CREATE TYPE "CrawlStatus" AS ENUM ('PENDING', 'COMPLETE', 'ERROR');

-- CreateTable
CREATE TABLE "hosts" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "resolvedRecords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "labels" TEXT[],
    "lastResolveTime" TIMESTAMP(3),
    "lastResolveResult" "ResolveStatus",

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastCrawlResult" TEXT,
    "lastCrawlStatus" "CrawlStatus",
    "lastCrawledAt" TIMESTAMP(3),
    "visitedPages" TEXT[],

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT,
    "websiteId" TEXT NOT NULL,
    "resolvedCnames" TEXT[],

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hosts_hostname_key" ON "hosts"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "websites_accountId_key" ON "websites"("accountId");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
