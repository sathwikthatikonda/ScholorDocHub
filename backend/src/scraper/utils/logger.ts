// Logger utility for scraper operations

import fs from "fs";
import path from "path";

const LOG_DIR = path.join(__dirname, "../../../logs");

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

function timestamp(): string {
    return new Date().toISOString();
}

function formatMsg(level: string, source: string, message: string): string {
    return `[${timestamp()}] [${level.toUpperCase()}] [${source}] ${message}`;
}

export const logger = {
    info(source: string, message: string) {
        const msg = formatMsg("INFO", source, message);
        console.log(`✅ ${msg}`);
        appendToFile(msg);
    },

    warn(source: string, message: string, err?: any) {
        const errDetail = err instanceof Error ? err.message : String(err || "");
        const msg = formatMsg("WARN", source, `${message} ${errDetail}`);
        console.warn(`⚠️ ${msg}`);
        appendToFile(msg);
    },

    error(source: string, message: string, err?: any) {
        const errDetail = err instanceof Error ? err.message : String(err || "");
        const msg = formatMsg("ERROR", source, `${message} ${errDetail}`);
        console.error(`❌ ${msg}`);
        appendToFile(msg);
    },

    success(source: string, message: string) {
        const msg = formatMsg("SUCCESS", source, message);
        console.log(`🎉 ${msg}`);
        appendToFile(msg);
    },

    scraperStart(source: string) {
        logger.info(source, `Starting scrape from ${source}...`);
    },

    scraperEnd(source: string, count: number, durationMs: number) {
        logger.success(source, `Scraped ${count} scholarships in ${(durationMs / 1000).toFixed(1)}s`);
    },
};

function appendToFile(line: string) {
    try {
        ensureLogDir();
        const logFile = path.join(LOG_DIR, `scraper-${new Date().toISOString().slice(0, 10)}.log`);
        fs.appendFileSync(logFile, line + "\n");
    } catch {
        // silently fail - logging should never crash the scraper
    }
}
