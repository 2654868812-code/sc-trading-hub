-- CreateTable
CREATE TABLE "Commodity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" TEXT,
    "weightScu" REAL,
    "isBuyable" BOOLEAN NOT NULL DEFAULT false,
    "isSellable" BOOLEAN NOT NULL DEFAULT false,
    "isIllegal" BOOLEAN NOT NULL DEFAULT false,
    "isRaw" BOOLEAN NOT NULL DEFAULT false,
    "isRefined" BOOLEAN NOT NULL DEFAULT false,
    "dateAdded" INTEGER,
    "dateModified" INTEGER
);

-- CreateTable
CREATE TABLE "Terminal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT,
    "starSystemName" TEXT,
    "planetName" TEXT,
    "moonName" TEXT,
    "cityName" TEXT,
    "spaceStationName" TEXT,
    "hasCargoCenter" BOOLEAN NOT NULL DEFAULT false,
    "hasDockingPort" BOOLEAN NOT NULL DEFAULT false,
    "hasFreightElevator" BOOLEAN NOT NULL DEFAULT false,
    "isAutoLoad" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commodityId" INTEGER NOT NULL,
    "terminalId" INTEGER NOT NULL,
    "priceBuy" REAL,
    "priceSell" REAL,
    "scuBuyStock" INTEGER,
    "scuSellStock" INTEGER,
    "fetchedAt" DATETIME NOT NULL,
    CONSTRAINT "PriceSnapshot_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "Commodity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PriceSnapshot_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PriceSnapshot_commodityId_terminalId_fetchedAt_idx" ON "PriceSnapshot"("commodityId", "terminalId", "fetchedAt");

-- CreateIndex
CREATE INDEX "PriceSnapshot_fetchedAt_idx" ON "PriceSnapshot"("fetchedAt");
