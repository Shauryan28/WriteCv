import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- HTML Template for Resume ---
function generateResumeHTML(data) {
    const { personal = {}, experience = [], projects = [], education = [], skills = '' } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.name || 'Resume'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 48px 56px;
            background: white;
        }
        
        /* Header */
        .header {
            text-align: center;
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 2px solid #111;
        }
        
        .name {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            color: #111;
        }
        
        .contact {
            font-size: 11px;
            color: #555;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 6px 16px;
        }
        
        .contact span {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        
        .contact a {
            color: #0066cc;
            text-decoration: none;
        }
        
        /* Sections */
        .section {
            margin-bottom: 24px;
        }
        
        .section-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #111;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #ddd;
        }
        
        /* Summary */
        .summary {
            font-size: 12px;
            color: #333;
            text-align: justify;
        }
        
        /* Experience & Education Items */
        .item {
            margin-bottom: 16px;
        }
        
        .item:last-child {
            margin-bottom: 0;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2px;
        }
        
        .item-title {
            font-size: 13px;
            font-weight: 600;
            color: #111;
        }
        
        .item-date {
            font-size: 11px;
            color: #666;
            font-weight: 500;
        }
        
        .item-subtitle {
            font-size: 12px;
            color: #555;
            font-style: italic;
            margin-bottom: 6px;
        }
        
        .item-details {
            font-size: 11px;
            color: #333;
            padding-left: 16px;
        }
        
        .item-details li {
            margin-bottom: 3px;
        }
        
        /* Projects */
        .project {
            margin-bottom: 12px;
        }
        
        .project:last-child {
            margin-bottom: 0;
        }
        
        .project-name {
            font-size: 13px;
            font-weight: 600;
            color: #111;
            margin-bottom: 4px;
        }
        
        .project-desc {
            font-size: 11px;
            color: #444;
        }
        
        /* Skills */
        .skills-content {
            font-size: 12px;
            color: #333;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #f0f0f0;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            color: #333;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <h1 class="name">${personal.name || 'Your Name'}</h1>
        <div class="contact">
            ${personal.email ? `<span>✉ ${personal.email}</span>` : ''}
            ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
            ${personal.linkedin ? `<span>🔗 <a href="${personal.linkedin}">${personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>` : ''}
        </div>
    </header>

    <!-- Summary -->
    ${personal.summary ? `
    <section class="section">
        <h2 class="section-title">Summary</h2>
        <p class="summary">${personal.summary}</p>
    </section>
    ` : ''}

    <!-- Experience -->
    ${experience.length > 0 ? `
    <section class="section">
        <h2 class="section-title">Experience</h2>
        ${experience.map(exp => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${exp.role || 'Role'}</span>
                <span class="item-date">${exp.dates || ''}</span>
            </div>
            <div class="item-subtitle">${exp.company || 'Company'}</div>
            ${exp.details ? `
            <ul class="item-details">
                ${exp.details.split('\n').filter(line => line.trim()).map(line => `<li>${line.trim()}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('')}
    </section>
    ` : ''}

    <!-- Projects -->
    ${projects.length > 0 ? `
    <section class="section">
        <h2 class="section-title">Projects</h2>
        ${projects.map(proj => `
        <div class="project">
            <div class="project-name">${proj.name || 'Project Name'}</div>
            ${proj.description ? `<p class="project-desc">${proj.description}</p>` : ''}
        </div>
        `).join('')}
    </section>
    ` : ''}

    <!-- Education -->
    ${education.length > 0 ? `
    <section class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
        <div class="item">
            <div class="item-header">
                <span class="item-title">${edu.degree || 'Degree'}</span>
                <span class="item-date">${edu.year || ''}</span>
            </div>
            <div class="item-subtitle">${edu.school || 'Institution'}</div>
        </div>
        `).join('')}
    </section>
    ` : ''}

    <!-- Skills -->
    ${skills ? `
    <section class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-list">
            ${skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
        </div>
    </section>
    ` : ''}

</body>
</html>
    `;
}

// --- PDF Generation Endpoint ---
app.post('/api/generate', async (req, res) => {
    const data = req.body;
    const { personal = {} } = data;

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Generate HTML and set page content
        const html = generateResumeHTML(data);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            }
        });

        await browser.close();

        // Set response headers
        const fileName = `${personal.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
