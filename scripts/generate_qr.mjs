#!/usr/bin/env node
import QRCode from "qrcode";

const url = process.argv[2];

if (!url) {
    console.error('Usage: node scripts/generate_qr.mjs "exps://..."');
    process.exit(1);
}

try {
    await QRCode.toFile("expo-qr-code.png", url, { width: 512 });
    console.log("QR code saved to expo-qr-code.png");
} catch (error) {
    console.error("Failed to generate QR code:", error);
    process.exit(1);
}