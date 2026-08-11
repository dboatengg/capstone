/*
  Warnings:

  - A unique constraint covering the columns `[clientId,propertyId]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_clientId_propertyId_key" ON "Inquiry"("clientId", "propertyId");
