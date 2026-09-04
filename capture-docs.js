const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { exportHtmlToPdf } = require('./doc-generator-template/pdf-exporter');

const BASE_URL = 'https://minimines.twenty.com';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const roleArg = process.argv[2] ? process.argv[2].toLowerCase() : 'hod';

let HTML_FILE = path.join(__dirname, 'user-manual.html'); // Default (HOD)
let FINAL_PDF = path.join(__dirname, 'Final-User-Manual.pdf');
let modulesToCapture = [];

if (roleArg === 'associate') {
    HTML_FILE = path.join(__dirname, 'user-manual-associate.html');
    FINAL_PDF = path.join(__dirname, 'Manual-Associate.pdf');
    modulesToCapture = [
        { id: 'leads-dashboard', url: '/objects/leads' },
        { id: 'opportunity-pipeline', url: '/objects/bdOpportunities' },
        { id: 'quotation-dashboard', url: '/objects/quotations' },
        { id: 'products', url: '/objects/products' }
    ];
} else if (roleArg === 'manager') {
    HTML_FILE = path.join(__dirname, 'user-manual-manager.html');
    FINAL_PDF = path.join(__dirname, 'Manual-Manager.pdf');
    modulesToCapture = [
        { id: 'leads-dashboard', url: '/objects/leads' },
        { id: 'opportunity-pipeline', url: '/objects/bdOpportunities' },
        { id: 'quotation-dashboard', url: '/objects/quotations' },
        { id: 'products', url: '/objects/products' },
        { id: 'analytics-dashboard', url: '/objects/leads/views/analytics' }
    ];
} else {
    // HOD / Master
    HTML_FILE = path.join(__dirname, 'user-manual.html'); // The master one we already created
    FINAL_PDF = path.join(__dirname, 'Manual-HOD.pdf');
    modulesToCapture = [
        { id: 'enquiries', url: '/objects/enquiries' },
        { id: 'leads-dashboard', url: '/objects/leads' },
        { id: 'opportunity-pipeline', url: '/objects/bdOpportunities' },
        { id: 'quotation-dashboard', url: '/objects/quotations' },
        { id: 'sales-orders', url: '/objects/salesOrders' },
        { id: 'contracts', url: '/objects/contracts' },
        { id: 'products', url: '/objects/products' },
        { id: 'export-shipments', url: '/objects/exportShipments' },
        { id: 'export-documents', url: '/objects/exportDocuments' },
        { id: 'analytics-dashboard', url: '/objects/leads/views/analytics' },
    ];
}

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
    console.log(`Starting Doc Capture Automation for Role: ${roleArg.toUpperCase()}`);
    console.log('NOTE: Running in visible mode (headless: false) because Twenty uses Cloudflare/ReCaptcha bot protection. If a captcha appears, please solve it quickly so the script can continue!');
    
    const browser = await chromium.launch({ headless: false });
    
    // We create a wide viewport for nice documentation screenshots
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log(`Navigating to ${BASE_URL}...`);
        await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle' });

        console.log('---------------------------------------------------------');
        console.log(`ACTION REQUIRED: Please log in MANUALLY with a ${roleArg.toUpperCase()} account!`);
        console.log('You have 45 seconds to enter your credentials and log in.');
        console.log('---------------------------------------------------------');
        
        // Give the user 45 seconds to manually log in and let the dashboard load
        await page.waitForTimeout(45000);
        
        // Let's add a slight delay to ensure UI animations finish
        await page.waitForTimeout(3000);

        const shotPaths = {};

        for (const mod of modulesToCapture) {
            console.log(`Capturing ${mod.id}...`);
            await page.goto(`${BASE_URL}${mod.url}`, { waitUntil: 'domcontentloaded' });
            // Wait 5 seconds for SPAs to fully render data
            await page.waitForTimeout(5000);
            
            const shotPath = path.join(SCREENSHOTS_DIR, `${roleArg}-${mod.id}.png`);
            await page.screenshot({ path: shotPath });
            shotPaths[mod.id] = shotPath;
        }

        await browser.close();
        console.log('All screenshots captured successfully.');

        // Update HTML with base64 images to ensure they render in PDF
        console.log('Injecting screenshots into HTML...');
        let htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');

        // Helper to convert image to base64
        function getBase64Src(filePath) {
            if (fs.existsSync(filePath)) {
                const b64 = fs.readFileSync(filePath).toString('base64');
                return `data:image/png;base64,${b64}`;
            }
            return '';
        }

        for (const mod of modulesToCapture) {
            const regex = new RegExp(`id="screenshot-${mod.id}" src=""`, 'g');
            htmlContent = htmlContent.replace(
                regex, 
                `id="screenshot-${mod.id}" src="${getBase64Src(shotPaths[mod.id])}"`
            );
        }

        fs.writeFileSync(HTML_FILE, htmlContent);
        console.log('HTML updated.');

        // Generate PDF
        await exportHtmlToPdf(HTML_FILE, FINAL_PDF);

    } catch (error) {
        console.error('Error during automation:', error);
        await browser.close();
    }
}

run();
