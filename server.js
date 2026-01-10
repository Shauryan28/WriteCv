import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import puppeteer from 'puppeteer'; // Lazy load instead
import path from 'path';
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Analysis Logic ---
const ACTION_VERBS = [
    'managed', 'led', 'developed', 'created', 'implemented', 'optimized', 'engineered',
    'designed', 'launched', 'improved', 'increased', 'reduced', 'saved', 'structured',
    'mentored', 'coordinated', 'achieved', 'driven', 'spearheaded', 'built', 'analyzed'
];

function analyzeResume(data) {
    const { personal, experience, projects, education, skills } = data;
    let score = 100;
    const feedback = [];
    const strengths = [];

    // 1. Completeness Check
    if (!personal.name) { score -= 10; feedback.push("Missing Name."); }
    if (!personal.email) { score -= 10; feedback.push("Missing Email."); }
    if (experience.length === 0) { score -= 20; feedback.push("No experience listed. Add internships or jobs."); }
    if (education.length === 0) { score -= 10; feedback.push("No education listed."); }
    if (!skills) { score -= 10; feedback.push("No skills listed."); }

    // 2. Content Depth (Bullet Points)
    let totalBullets = 0;
    experience.forEach(exp => {
        if (exp.details) {
            const bullets = exp.details.split('\n').filter(line => line.trim().length > 10);
            totalBullets += bullets.length;
            if (bullets.length < 2) {
                score -= 5;
                feedback.push(`Role at ${exp.company || 'Unknown'} has very few details.`);
            }
        }
    });

    if (totalBullets > 5) strengths.push("Good amount of detail in experience.");

    // 3. Action Verbs Check
    let actionVerbCount = 0;
    const allText = JSON.stringify(data).toLowerCase();
    ACTION_VERBS.forEach(verb => {
        if (allText.includes(verb)) actionVerbCount++;
    });

    if (actionVerbCount < 3 && experience.length > 0) {
        score -= 10;
        feedback.push("Use more strong action verbs (e.g., 'Managed', 'Developed').");
    } else if (actionVerbCount >= 3) {
        strengths.push("Strong use of action verbs.");
    }

    // 4. Summary Check
    if (!personal.summary || personal.summary.length < 50) {
        score -= 5;
        feedback.push("Summary is too short or missing. Tell your story!");
    }

    return {
        score: Math.max(0, score),
        grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'F',
        feedback,
        strengths
    };
}

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
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Nunito', sans-serif;
            color: #2d3748;
            line-height: 1.6;
            padding: 40px 50px;
            background: white;
            font-size: 13px;
        }
        
        /* Header */
        header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #edf2f7; padding-bottom: 20px; }
        h1 { font-size: 28px; font-weight: 800; color: #1a202c; letter-spacing: -0.5px; text-transform: uppercase; margin-bottom: 8px; }
        .contact { display: flex; justify-content: center; gap: 20px; font-size: 12px; color: #718096; flex-wrap: wrap; }
        .contact span { display: flex; align-items: center; gap: 5px; }
        a { color: #3182ce; text-decoration: none; }

        /* Sections */
        section { margin-bottom: 25px; }
        h2 { 
            font-size: 14px; 
            font-weight: 800; 
            color: #2b6cb0; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            border-bottom: 1px solid #e2e8f0; 
            padding-bottom: 5px; 
            margin-bottom: 15px; 
        }

        /* Items */
        .item { margin-bottom: 15px; page-break-inside: avoid; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
        .role { font-size: 14px; font-weight: 700; color: #1a202c; }
        .date { font-size: 12px; font-weight: 600; color: #718096; }
        .company { font-size: 13px; color: #4a5568; font-style: italic; margin-bottom: 6px; }
        
        ul { list-style: none; padding-left: 0; }
        li { 
            position: relative; 
            padding-left: 15px; 
            margin-bottom: 4px; 
            color: #4a5568; 
            text-align: justify;
        }
        li::before { 
            content: "•"; 
            position: absolute; 
            left: 0; 
            color: #cbd5e0; 
            font-weight: bold; 
        }

        /* Skills */
        .skills-container { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { 
            background: #f7fafc; 
            border: 1px solid #edf2f7; 
            padding: 3px 10px; 
            border-radius: 9999px; 
            font-size: 11px; 
            font-weight: 600; 
            color: #4a5568; 
        }
    </style>
</head>
<body>
    <header>
        <h1>${personal.name || 'Your Name'}</h1>
        <div class="contact">
            ${personal.email ? `<span>✉ ${personal.email}</span>` : ''}
            ${personal.phone ? `<span>� ${personal.phone}</span>` : ''}
            ${personal.linkedin ? `<span>🔗 ${personal.linkedin.replace(/https?:\/\//, '')}</span>` : ''}
        </div>
    </header>

    ${personal.summary ? `
    <section>
        <h2>Professional Summary</h2>
        <p>${personal.summary}</p>
    </section>` : ''}

    ${experience.length > 0 ? `
    <section>
        <h2>Experience</h2>
        ${experience.map(exp => `
        <div class="item">
            <div class="item-header">
                <span class="role">${exp.role}</span>
                <span class="date">${exp.dates}</span>
            </div>
            <div class="company">${exp.company}</div>
            <ul>
                ${exp.details ? exp.details.split('\n').filter(l => l.trim()).map(l => `<li>${l}</li>`).join('') : ''}
            </ul>
        </div>`).join('')}
    </section>` : ''}

    ${projects.length > 0 ? `
    <section>
        <h2>Projects</h2>
        ${projects.map(proj => `
        <div class="item">
            <div class="item-header">
                <span class="role">${proj.name}</span>
            </div>
            <p>${proj.description}</p>
        </div>`).join('')}
    </section>` : ''}

    ${education.length > 0 ? `
    <section>
        <h2>Education</h2>
        ${education.map(edu => `
        <div class="item">
            <div class="item-header">
                <span class="role">${edu.school}</span>
                <span class="date">${edu.year}</span>
            </div>
            <div class="company">${edu.degree}</div>
        </div>`).join('')}
    </section>` : ''}

    ${skills ? `
    <section>
        <h2>Skills</h2>
        <div class="skills-container">
            ${skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
        </div>
    </section>` : ''}
</body>
</html>`;
}

// --- DOCX Generation Logic ---
function createDocxSectionHeader(title) {
    return new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        thematicBreak: true,
        spacing: {
            before: 200,
            after: 100,
        },
    });
}

function generateResumeDOCX(data) {
    const { personal = {}, experience = [], projects = [], education = [], skills = '' } = data;
    const children = [];

    // Header
    children.push(
        new Paragraph({
            text: personal.name || 'Resume',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: personal.email ? `${personal.email} | ` : '' }),
                new TextRun({ text: personal.phone ? `${personal.phone} | ` : '' }),
                new TextRun({ text: personal.linkedin ? `${personal.linkedin}` : '' }),
            ],
            spacing: { after: 200 },
        })
    );

    // Summary
    if (personal.summary) {
        children.push(createDocxSectionHeader('Professional Summary'));
        children.push(new Paragraph({
            text: personal.summary,
            spacing: { after: 200 },
        }));
    }

    // Experience
    if (experience.length > 0) {
        children.push(createDocxSectionHeader('Experience'));
        experience.forEach(exp => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.role || 'Role', bold: true, size: 24 }),
                        new TextRun({ text: ` | ${exp.company || 'Company'}`, italics: true }),
                        new TextRun({
                            text: `\t${exp.dates || ''}`,
                            bold: true,
                        }),
                    ],
                    tabStops: [
                        { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                    ],
                })
            );

            if (exp.details) {
                const bullets = exp.details.split('\n').filter(l => l.trim());
                bullets.forEach(bullet => {
                    children.push(new Paragraph({
                        text: bullet,
                        bullet: { level: 0 },
                    }));
                });
            }
            children.push(new Paragraph({ text: "" })); // Spacer
        });
    }

    // Projects
    if (projects.length > 0) {
        children.push(createDocxSectionHeader('Projects'));
        projects.forEach(proj => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: proj.name || 'Project Name', bold: true, size: 24 }),
                    ],
                })
            );
            children.push(new Paragraph({
                text: proj.description || '',
                spacing: { after: 100 },
            }));
        });
    }

    // Education
    if (education.length > 0) {
        children.push(createDocxSectionHeader('Education'));
        education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.school || 'School', bold: true }),
                        new TextRun({ text: ` - ${edu.degree || 'Degree'}` }),
                        new TextRun({
                            text: `\t${edu.year || ''}`,
                            bold: true,
                        }),
                    ],
                    tabStops: [
                        { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                    ],
                    spacing: { after: 100 },
                })
            );
        });
    }

    // Skills
    if (skills) {
        children.push(createDocxSectionHeader('Skills'));
        children.push(new Paragraph({
            text: skills,
        }));
    }

    return new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });
}

// --- Endpoints ---

app.post('/api/analyze', (req, res) => {
    try {
        const analysis = analyzeResume(req.body);
        setTimeout(() => res.json(analysis), 1500); // Fake delay for dramatic effect
    } catch (error) {
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// --- Document Generation Endpoint ---
app.post('/api/generate', async (req, res) => {
    const data = req.body;
    const { personal = {} } = data;
    const format = req.query.format || 'pdf'; // 'pdf' or 'docx'

    try {
        const fileName = `${personal.name ? personal.name.replace(/\s+/g, '_') : 'Resume'} `;

        if (format === 'docx') {
            const doc = generateResumeDOCX(data);
            const buffer = await Packer.toBuffer(doc);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename = "${fileName}.docx"`);
            res.send(buffer);
        } else {
            // Default to PDF
            const puppeteer = (await import('puppeteer')).default;
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--single-process', // Often needed in lightweight environments
                    '--no-zygote'
                ]
            });

            const page = await browser.newPage();
            const html = generateResumeHTML(data);

            // Wait for fonts to load
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
            });

            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename = "${fileName}.pdf"`);
            res.send(pdfBuffer);
        }

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: 'Failed to generate document' });
    }
});

// Serve static files from the React app
const distPath = path.join(process.cwd(), 'dist');
console.log('Serving uploaded files from:', distPath);
app.use(express.static(distPath));

// SPA Fallback: Send index.html for any other GET request
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
