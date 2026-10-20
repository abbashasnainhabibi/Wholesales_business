-- Update category metaTitle strings to clean, short titles (< 42 chars)
-- Real table: `category`, columns: `metaTitle`, `slug` from prisma/schema.prisma

UPDATE `category` SET `metaTitle` = 'Webbing Slings & Safety Belts, Karachi' WHERE `slug` = 'safety-belts-webbing-slings';
UPDATE `category` SET `metaTitle` = 'Tarpaulins & Canvas Tents, Karachi' WHERE `slug` = 'tarpaulins-canvas-tents';
UPDATE `category` SET `metaTitle` = 'Building & Flexible Pipes, Karachi' WHERE `slug` = 'building-flexible-pipes';
UPDATE `category` SET `metaTitle` = 'Polythene Sheets & Films, Karachi' WHERE `slug` = 'polythene-sheets-films';
UPDATE `category` SET `metaTitle` = 'Packaging & Strapping Materials, Karachi' WHERE `slug` = 'packaging-strapping';
UPDATE `category` SET `metaTitle` = 'Ropes & Twines Supplier, Karachi' WHERE `slug` = 'ropes';
UPDATE `category` SET `metaTitle` = 'Shade, Safety & Sports Nets, Karachi' WHERE `slug` = 'nets';
