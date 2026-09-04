/*
 * Universal PDF Exporter
 * This script is intended to be used by the AI-generated 'capture-docs.js'
 * to ensure that HTML to PDF conversion is perfectly formatted with no page cuts.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function exportHtmlToPdf(htmlFilePath, outputPdfPath) {
    const absoluteHtmlPath = path.resolve(htmlFilePath);
    if (!fs.existsSync(absoluteHtmlPath)) {
        console.error(`Error: HTML file not found at ${absoluteHtmlPath}`);
        process.exit(1);
    }

    console.log(`Starting PDF conversion for: ${absoluteHtmlPath}`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Load the HTML file
    await page.goto(`file://${absoluteHtmlPath}`, { waitUntil: 'networkidle' });

    // Inject the print styles if not already present
    const cssPath = path.join(__dirname, 'print-styles.css');
    if (fs.existsSync(cssPath)) {
        await page.addStyleTag({ path: cssPath });
    }

    // Generate the PDF
    await page.pdf({
        path: outputPdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm',
        }
    });

    await browser.close();
    console.log(`Success! PDF saved to: ${outputPdfPath}`);
}

module.exports = { exportHtmlToPdf };
