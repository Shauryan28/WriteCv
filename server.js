import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import puppeteer from 'puppeteer'; // Lazy load instead
import path from 'path';
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from 'docx';
import PDFDocument from 'pdfkit';

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
    'mentored', 'coordinated', 'achieved', 'driven', 'spearheaded', 'built', 'analyzed',
    'collaborated', 'initiated', 'executed', 'formulated', 'integrated', 'maximized'
];

function analyzeResume(data) {
    const { personal, experience, projects, education, skills } = data;
    let score = 100;
    const feedback = [];
    const strengths = [];

    // 1. Completeness Check
    if (!personal.name) { score -= 15; feedback.push("Critical: Missing Name."); }
    if (!personal.email) { score -= 15; feedback.push("Critical: Missing Email."); }
    if (!personal.phone) { score -= 5; feedback.push("Missing Phone Number."); }
    if (experience.length === 0) { score -= 20; feedback.push("Critical: No experience listed. Add internships or jobs."); }
    if (education.length === 0) { score -= 10; feedback.push("Critical: No education listed."); }
    if (!skills || skills.length < 5) { score -= 10; feedback.push("Skills section is empty or too sparse."); }

    // 2. Content Depth & Keywords
    let totalBullets = 0;
    let totalQuantifiable = 0; // Numbers, %, $

    // Helper to check for numbers
    const hasNumbers = (str) => /\d+%|\$\d+|\d+/.test(str);

    experience.forEach(exp => {
        if (exp.details) {
            const bullets = exp.details.split('\n').filter(line => line.trim().length > 10);
            totalBullets += bullets.length;

            bullets.forEach(b => {
                if (hasNumbers(b)) totalQuantifiable++;
            });

            if (bullets.length < 3) {
                score -= 3;
                feedback.push(`Role at ${exp.company || 'Unknown'} could use more detail (aim for 3+ bullets).`);
            }
        } else {
            score -= 5;
            feedback.push(`Role at ${exp.company || 'Unknown'} has no details.`);
        }
    });

    if (totalBullets >= 5) strengths.push("Good depth of experience.");
    if (totalQuantifiable >= 2) {
        strengths.push("Great use of quantifiable results (numbers/metrics).");
    } else if (experience.length > 0) {
        score -= 5;
        feedback.push("Add more numbers/metrics to your bullet points (e.g., 'Increased sales by 20%').");
    }

    // 3. Action Verbs Check
    let actionVerbCount = 0;
    const allText = JSON.stringify(data).toLowerCase();
    ACTION_VERBS.forEach(verb => {
        if (allText.includes(verb)) actionVerbCount++;
    });

    if (actionVerbCount < 3 && experience.length > 0) {
        score -= 10;
        feedback.push("Use more strong action verbs (e.g., 'Managed', 'Developed').");
    } else if (actionVerbCount >= 5) {
        strengths.push("Strong vocabulary and action verbs.");
    }

    // 4. Summary Check
    if (!personal.summary || personal.summary.length < 30) {
        score -= 5;
        feedback.push("Profile summary is missing or too short. Add a professional summary.");
    }

    // 5. Formatting/ATS (Simulated checks)
    // We assume the generator handles fonts/margins, but warn user about content
    if (personal.linkedin && !personal.linkedin.includes('linkedin.com')) {
        score -= 2;
        feedback.push("LinkedIn URL looks incomplete.");
    }

    return {
        score: Math.max(0, score),
        grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'F',
        feedback,
        strengths
    };
}

// --- HTML Template for Resume (ATS Optimized) ---
// Uses clean structure, Arial font, high contrast, single column
function generateResumeHTML(data) {
    const { personal = {}, experience = [], projects = [], education = [], skills = '' } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.name || 'Resume'}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif; /* ATS Standard */
            color: #000; /* Pure black for best OCR */
            line-height: 1.5;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            font-size: 11pt; /* Standard readable size */
        }

        a { color: #000; text-decoration: none; }
        
        /* Header */
        header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 15px; }
        h1 { font-size: 24pt; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; }
        .contact-info { font-size: 10pt; margin-top: 5px; }
        .contact-separator { margin: 0 5px; }

        /* Sections */
        section { margin-bottom: 20px; }
        h2 {
            font-size: 14pt;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            margin: 0 0 10px 0;
            padding-bottom: 3px;
            font-weight: bold;
        }

        /* Entries */
        .entry { margin-bottom: 12px; }
        .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
        .entry-title { font-weight: bold; font-size: 12pt; } /* Role/School */
        .entry-subtitle { font-style: italic; font-size: 11pt; } /* Company/Degree */
        .entry-date { font-weight: bold; font-size: 11pt; text-align: right; white-space: nowrap; }
        
        /* Lists */
        ul { margin: 5px 0 0 18px; padding: 0; }
        li { margin-bottom: 3px; text-align: justify; }

        /* Skills */
        .skills-section p { margin: 0; }
    </style>
</head>
<body>
    <header>
        <h1>${personal.name || 'Your Name'}</h1>
        <div class="contact-info">
            ${[
            personal.email,
            personal.phone,
            personal.linkedin ? personal.linkedin.replace(/^https?:\/\//, '') : null
        ].filter(Boolean).join('<span class="contact-separator">|</span>')}
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
        <div class="entry">
            <div class="entry-header">
                <span class="entry-title">${exp.role}</span>
                <span class="entry-date">${exp.dates}</span>
            </div>
            <div class="entry-subtitle">${exp.company}</div>
            ${exp.details ? `
            <ul>
                ${exp.details.split('\n').filter(l => l.trim()).map(l => `<li>${l}</li>`).join('')}
            </ul>` : ''}
        </div>`).join('')}
    </section>` : ''}

    ${projects.length > 0 ? `
    <section>
        <h2>Projects</h2>
        ${projects.map(proj => `
        <div class="entry">
            <div class="entry-header">
                <span class="entry-title">${proj.name}</span>
            </div>
            <p>${proj.description}</p>
        </div>`).join('')}
    </section>` : ''}

    ${education.length > 0 ? `
    <section>
        <h2>Education</h2>
        ${education.map(edu => `
        <div class="entry">
            <div class="entry-header">
                <span class="entry-title">${edu.school}</span>
                <span class="entry-date">${edu.year}</span>
            </div>
            <div class="entry-subtitle">${edu.degree}</div>
        </div>`).join('')}
    </section>` : ''}

    ${skills ? `
    <section>
        <h2>Skills</h2>
        <div class="skills-section">
            <p>${skills}</p>
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
                new TextRun({ text: personal.location ? `${personal.location} | ` : '' }),
                new TextRun({ text: personal.website ? `${personal.website} | ` : '' }),
                new TextRun({ text: personal.linkedin ? `${personal.linkedin}` : '' }),
                // Cleanup trailing separator if needed, but for now simple stacking works
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

            if (exp.location) {
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: exp.location,
                                italics: true,
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                    })
                );
            }

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
                children: [
                    new TextRun({ text: proj.link ? `${proj.link}\n` : '', color: '0563C1', underline: {} }),
                    new TextRun({ text: proj.technologies ? `Stack: ${proj.technologies}\n` : '', italics: true }),
                    new TextRun({ text: proj.description || '' }),
                ],
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

// --- PDF Generation Logic ---
export function generateResumePDF(data) {
    return new Promise((resolve, reject) => {
        const { personal = {}, experience = [], projects = [], education = [], skills = '' } = data;
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.on('error', reject);

        // Fonts
        doc.font('Helvetica');

        // --- Content ---

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text(personal.name || 'Resume', { align: 'center' });
        doc.moveDown(0.2);

        const contactLine = [
            personal.email,
            personal.phone,
            personal.location,
            personal.website ? personal.website.replace(/^https?:\/\//, '') : null,
            personal.linkedin ? personal.linkedin.replace(/^https?:\/\//, '') : null
        ].filter(Boolean).join('  |  ');

        doc.fontSize(10).font('Helvetica').text(contactLine, { align: 'center' });
        doc.moveDown(1.0);

        // Divider
        doc.moveTo(50, doc.y).lineTo(595 - 50, doc.y).strokeColor('#aaaaaa').stroke().strokeColor('#000000');
        doc.moveDown(1.5);

        // Helper for Sections
        const drawSectionHeader = (title) => {
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(12).text(title.toUpperCase(), { characterSpacing: 1 });
            doc.moveTo(doc.x, doc.y + 4).lineTo(doc.page.width - 50, doc.y + 4).stroke();
            doc.moveDown(0.8);
            doc.font('Helvetica').fontSize(10);
        };

        // Summary
        if (personal.summary) {
            drawSectionHeader('Professional Summary');
            doc.text(personal.summary, { align: 'justify', lineGap: 2 });
            doc.moveDown(1);
        }

        // Experience
        if (experience.length > 0) {
            drawSectionHeader('Experience');
            experience.forEach(exp => {
                const startY = doc.y;

                // Date (Right Aligned)
                // We draw date first to ensure it fits, or we just position it manually
                const dateText = exp.dates || '';
                const dateWidth = doc.widthOfString(dateText, { font: 'Helvetica-Bold', fontSize: 10 });

                doc.font('Helvetica-Bold').fontSize(10);
                doc.text(dateText, 595 - 50 - dateWidth, startY); // Right aligned manually

                // Location (Below Date, Right Aligned)
                if (exp.location) {
                    const locWidth = doc.widthOfString(exp.location, { font: 'Helvetica-Oblique', fontSize: 9 });
                    doc.font('Helvetica-Oblique').fontSize(9).text(exp.location, 595 - 50 - locWidth, startY + 12);
                }

                // Role (Left Aligned)
                doc.font('Helvetica-Bold').fontSize(10);
                doc.text(exp.role || 'Role', 50, startY, { width: 595 - 100 - dateWidth });

                // Company
                doc.moveDown(0.2);
                doc.font('Helvetica-Oblique').fontSize(10).text(exp.company || 'Company');
                doc.moveDown(0.3);

                // Details (Bullets)
                doc.font('Helvetica');
                if (exp.details) {
                    const bullets = exp.details.split('\n').filter(l => l.trim());
                    bullets.forEach(b => {
                        // Hanging indent simulation
                        const bulletX = 65;
                        const textX = 80;
                        const currentY = doc.y;

                        doc.text('•', bulletX, currentY);
                        doc.text(b, textX, currentY, { width: 595 - 50 - textX, align: 'justify' });
                        doc.moveDown(0.2);
                    });
                }
                doc.moveDown(0.8);
            });
        }

        // Projects
        if (projects.length > 0) {
            drawSectionHeader('Projects');
            projects.forEach(proj => {
                const startY = doc.y;
                doc.font('Helvetica-Bold').text(proj.name || 'Project');

                if (proj.link) {
                    const linkText = proj.link.replace(/^https?:\/\//, '');
                    const linkWidth = doc.widthOfString(linkText, { fontSize: 9 });
                    doc.font('Helvetica').fontSize(9).text(linkText, 595 - 50 - linkWidth, startY, {
                        link: proj.link,
                        underline: true,
                        color: 'blue'
                    });
                    doc.fillColor('black'); // Reset color
                }

                if (proj.technologies) {
                    doc.font('Helvetica-Oblique').fontSize(9).text(proj.technologies);
                    doc.moveDown(0.2);
                }

                doc.font('Helvetica').fontSize(10).text(proj.description || '', { align: 'justify' });
                doc.moveDown(0.5);
            });
            doc.moveDown(0.5);
        }

        // Education
        if (education.length > 0) {
            drawSectionHeader('Education');
            education.forEach(edu => {
                const startY = doc.y;

                // Date (Right)
                const dateText = edu.year || '';
                const dateWidth = doc.widthOfString(dateText, { font: 'Helvetica-Bold', fontSize: 10 });
                doc.font('Helvetica-Bold').text(dateText, 595 - 50 - dateWidth, startY);

                // School (Left)
                doc.text(edu.school || 'School', 50, startY, { width: 595 - 100 - dateWidth });

                // Degree
                doc.moveDown(0.2);
                doc.font('Helvetica').text(edu.degree || 'Degree');
                doc.moveDown(0.5);
            });
            doc.moveDown(0.5);
        }

        // Skills
        if (skills) {
            drawSectionHeader('Skills');
            doc.text(skills, { align: 'justify' });
            doc.moveDown();
        }

        console.log('Finalizing PDF...');
        doc.end();
    }); // End Promise
}

export { analyzeResume, generateResumeDOCX };

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
    const { personal = {}, experience = [], projects = [], education = [], skills = '' } = data;
    const format = req.query.format || 'pdf'; // 'pdf' or 'docx'

    try {
        const fileName = `${personal.name ? personal.name.replace(/\s+/g, '_') : 'Resume'}`; // Fixed trailing space

        if (format === 'docx') {
            const doc = generateResumeDOCX(data);
            const buffer = await Packer.toBuffer(doc);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename = "${fileName}.docx"`);
            res.send(buffer);
        } else {
            // PDFKit Implementation
            console.log('Generating PDF with PDFKit...');
            const buffer = await generateResumePDF(data);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename = "${fileName}.pdf"`);
            res.send(buffer);
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
