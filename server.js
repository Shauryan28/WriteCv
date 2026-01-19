import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import puppeteer from 'puppeteer'; // Lazy load instead
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pdfParse = require('pdf-parse');
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from 'docx';
import PDFDocument from 'pdfkit';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs';

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
    'collaborated', 'initiated', 'executed', 'formulated', 'integrated', 'maximized',
    'established', 'delivered', 'enhanced', 'streamlined', 'resolved', 'pioneered'
];

const BUZZWORDS = ['synergy', 'leverage', 'utilize', 'paradigm', 'circle back', 'touch base'];
const ATS_KEYWORDS = ['teamwork', 'communication', 'leadership', 'project management', 'problem solving',
    'analytical', 'strategic', 'time management', 'adaptability', 'detail-oriented'];

function analyzeResume(data) {
    const { personal, experience, projects, education, skills } = data;

    // Category scores
    let contentScore = 100;
    let formatScore = 100;
    let keywordScore = 100;
    let impactScore = 100;

    const feedback = [];
    const strengths = [];
    const warnings = [];
    const categories = {};

    // === 1. COMPLETENESS & FORMAT ANALYSIS ===
    let missingFields = 0;

    if (!personal.name) { formatScore -= 20; feedback.push("❌ Critical: Name is missing."); missingFields++; }
    if (!personal.email) { formatScore -= 15; feedback.push("❌ Critical: Email is missing."); missingFields++; }
    else if (!personal.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        formatScore -= 5; feedback.push("⚠️ Email format looks invalid.");
    }

    if (!personal.phone) { formatScore -= 10; feedback.push("⚠️ Phone number is missing."); }
    else if (!personal.phone.match(/\d{3}.*\d{3}.*\d{4}/)) {
        formatScore -= 3; feedback.push("⚠️ Phone number format looks unusual.");
    }

    if (!personal.location) { formatScore -= 5; feedback.push("💡 Consider adding your location."); }
    if (personal.linkedin && !personal.linkedin.includes('linkedin.com')) {
        formatScore -= 3; feedback.push("⚠️ LinkedIn URL appears incomplete.");
    }

    categories.format = {
        score: Math.max(0, formatScore),
        missing: missingFields,
        title: 'Format & Contact'
    };

    // === 2. CONTENT DEPTH ANALYSIS ===
    const totalWords = JSON.stringify(data).split(/\s+/).length;
    let totalBullets = 0;
    let totalQuantifiable = 0;
    let shortDescriptions = 0;

    const hasNumbers = (str) => /\d+%|\$\d+|[\d,]+\s*(?:users|customers|people|hours|days|months)|increase.*\d+|reduce.*\d+|improve.*\d+/.test(str);

    if (experience.length === 0) {
        contentScore -= 30;
        feedback.push("❌ Critical: No work experience listed.");
    } else {
        experience.forEach(exp => {
            if (!exp.details || exp.details.trim().length === 0) {
                contentScore -= 8;
                feedback.push(`❌ Role at ${exp.company || 'Unknown'} has no description.`);
                shortDescriptions++;
            } else {
                const bullets = exp.details.split('\n').filter(line => line.trim().length > 10);
                totalBullets += bullets.length;

                bullets.forEach(b => {
                    if (hasNumbers(b)) totalQuantifiable++;
                });

                if (bullets.length < 2) {
                    contentScore -= 5;
                    feedback.push(`💡 Add more detail to ${exp.company || 'role'} (aim for 3-5 bullets).`);
                    shortDescriptions++;
                }

                if (bullets.length > 7) {
                    contentScore -= 2;
                    warnings.push(`⚠️ Role at ${exp.company} has too many bullets (${bullets.length}). Consider condensing.`);
                }
            }
        });

        if (totalBullets >= 10) strengths.push("✅ Excellent experience depth.");
        else if (totalBullets >= 5) strengths.push("✅ Good amount of experience detail.");
    }

    if (totalQuantifiable >= 5) {
        impactScore += 0; // Perfect
        strengths.push("✅ Excellent use of quantifiable achievements!");
    } else if (totalQuantifiable >= 2) {
        strengths.push("✅ Good use of metrics in descriptions.");
    } else {
        impactScore -= 15;
        feedback.push("💡 Add specific numbers/metrics (e.g., 'Increased efficiency by 40%').");
    }

    // Word count analysis
    if (totalWords < 200) {
        contentScore -= 15;
        feedback.push(`⚠️ Resume is too short (${totalWords} words). Aim for 400-600 words.`);
    } else if (totalWords > 800) {
        contentScore -= 5;
        warnings.push(`⚠️ Resume is quite long (${totalWords} words). Consider being more concise.`);
    } else {
        strengths.push(`✅ Good length (${totalWords} words).`);
    }

    categories.content = {
        score: Math.max(0, contentScore),
        bullets: totalBullets,
        metrics: totalQuantifiable,
        words: totalWords,
        title: 'Content Quality'
    };

    // === 3. KEYWORD & ATS ANALYSIS ===
    const allText = JSON.stringify(data).toLowerCase();
    let actionVerbCount = 0;
    const foundVerbs = [];

    ACTION_VERBS.forEach(verb => {
        if (allText.includes(verb)) {
            actionVerbCount++;
            if (foundVerbs.length < 5) foundVerbs.push(verb);
        }
    });

    if (actionVerbCount < 5 && experience.length > 0) {
        keywordScore -= 15;
        feedback.push("💡 Use more strong action verbs (Led, Developed, Managed, etc.).");
    } else if (actionVerbCount >= 8) {
        strengths.push(`✅ Strong use of action verbs (${actionVerbCount} found).`);
    }

    // ATS Keyword check
    const foundATSKeywords = ATS_KEYWORDS.filter(k => allText.includes(k.toLowerCase()));
    if (foundATSKeywords.length >= 5) {
        strengths.push("✅ Good coverage of ATS-friendly keywords.");
    } else if (foundATSKeywords.length < 3) {
        keywordScore -= 10;
        feedback.push("💡 Add more industry-standard keywords (leadership, communication, etc.).");
    }

    // Buzzword detection
    const foundBuzzwords = BUZZWORDS.filter(b => allText.includes(b.toLowerCase()));
    if (foundBuzzwords.length > 0) {
        keywordScore -= 5;
        warnings.push(`⚠️ Avoid buzzwords: ${foundBuzzwords.join(', ')}.`);
    }

    categories.keywords = {
        score: Math.max(0, keywordScore),
        actionVerbs: actionVerbCount,
        atsKeywords: foundATSKeywords.length,
        title: 'Keywords & ATS'
    };

    // === 4. IMPACT & PROFESSIONALISM ===
    if (!personal.summary || personal.summary.length < 50) {
        impactScore -= 10;
        feedback.push("💡 Add a professional summary (2-3 sentences about your background).");
    } else if (personal.summary.length > 300) {
        impactScore -= 5;
        warnings.push("⚠️ Summary is quite long. Aim for 100-200 words.");
    } else {
        strengths.push("✅ Good professional summary.");
    }

    if (education.length === 0) {
        impactScore -= 15;
        feedback.push("❌ No education listed.");
    } else {
        strengths.push("✅ Education included.");
    }

    if (!skills || skills.trim().length < 20) {
        impactScore -= 10;
        feedback.push("💡 Expand your skills section (list 8-12 relevant skills).");
    } else if (skills.split(',').length < 5) {
        impactScore -= 5;
        feedback.push("💡 Add more skills (aim for at least 8).");
    } else {
        strengths.push(`✅ Good skills coverage (${skills.split(',').length} skills).`);
    }

    if (projects && projects.length > 0) {
        strengths.push("✅ Projects section adds value.");
    }

    categories.impact = {
        score: Math.max(0, impactScore),
        hasSummary: personal.summary && personal.summary.length >= 50,
        hasEducation: education.length > 0,
        hasProjects: projects && projects.length > 0,
        title: 'Impact & Polish'
    };

    // === 5. OVERALL CALCULATION ===
    const overallScore = Math.round((contentScore + formatScore + keywordScore + impactScore) / 4);
    const atsScore = Math.round(overallScore * 0.95); // Slightly stricter for ATS

    let grade;
    if (overallScore >= 90) grade = 'A+';
    else if (overallScore >= 85) grade = 'A';
    else if (overallScore >= 80) grade = 'A-';
    else if (overallScore >= 75) grade = 'B+';
    else if (overallScore >= 70) grade = 'B';
    else if (overallScore >= 65) grade = 'B-';
    else if (overallScore >= 60) grade = 'C+';
    else if (overallScore >= 55) grade = 'C';
    else grade = 'D';

    return {
        score: Math.max(0, Math.min(100, overallScore)),
        atsScore: Math.max(0, Math.min(100, atsScore)),
        grade,
        feedback,
        strengths,
        warnings,
        categories,
        details: {
            totalWords,
            actionVerbs: actionVerbCount,
            quantifiableResults: totalQuantifiable,
            experienceEntries: experience.length,
            educationEntries: education.length
        }
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

// --- Upload & Parse Logic ---
const upload = multer({ storage: multer.memoryStorage() });

function extractContactInfo(text) {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const linkRegex = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.com|[a-zA-Z0-9-]+\.dev/g;

    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);
    const links = text.match(linkRegex) || [];

    let website = '';
    let linkedin = '';

    links.forEach(link => {
        if (link.includes('linkedin')) linkedin = link;
        else if (!website && !link.includes('@')) website = link; // First non-linkedin link
    });

    return {
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        website,
        linkedin
    };
}

function parseResumeSections(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const sections = {
        summary: [],
        experience: [],
        projects: [],
        education: [],
        skills: []
    };

    let currentSection = 'summary'; // Default to summary or personal
    const headerPatterns = {
        experience: /experience|work history|employment|career/i,
        education: /education|academic|background/i,
        projects: /projects|portfolio/i,
        skills: /skills|technologies|proficiencies/i,
        summary: /summary|profile|about|objective/i
    };

    // Skip first few lines assuming they are Name/Title
    let startIdx = 0;
    if (lines.length > 0) startIdx = Math.min(lines.length, 5); // Simplistic skip

    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        let isHeader = false;

        // Check for section headers
        for (const [key, regex] of Object.entries(headerPatterns)) {
            if (regex.test(line) && line.split(' ').length < 5) { // Headers are usually short
                currentSection = key;
                isHeader = true;
                break;
            }
        }

        if (!isHeader) {
            sections[currentSection].push(line);
        }
    }

    return sections;
}

function processParsedData(rawSections, contactInfo, fullText) {
    // 1. Personal
    const nameLine = fullText.split('\n')[0].trim(); // Naive assumption: Name is first line
    const personal = {
        name: nameLine || '',
        email: contactInfo.email,
        phone: contactInfo.phone,
        linkedin: contactInfo.linkedin,
        website: contactInfo.website,
        location: '', // Hard to extract reliably without NLP
        summary: rawSections.summary.join(' ')
    };

    // 2. Experience (Basic Chunking)
    // We look for patterns like dates or company names? Hard rule-based.
    // Instead, we just dump text into the first item if specific structure isn't found.
    // Enhanced: Try to find blocks.
    const experience = [];
    if (rawSections.experience.length > 0) {
        // Naive: Just one big block for now, or split by simple heuristics?
        // Let's make one "Imported Role" and put everything in details
        experience.push({
            role: 'Imported Role',
            company: 'See Details',
            dates: 'Various',
            location: '',
            details: rawSections.experience.join('\n')
        });
    }

    // 3. Education
    const education = [];
    if (rawSections.education.length > 0) {
        education.push({
            school: rawSections.education[0] || 'Imported School',
            degree: 'See Details',
            year: '',
            location: ''
        });
    }

    // 4. Projects
    const projects = [];
    if (rawSections.projects.length > 0) {
        projects.push({
            name: 'Imported Projects',
            description: rawSections.projects.join('\n')
        });
    }

    // 5. Skills
    const skills = rawSections.skills.join(', ');

    return { personal, experience, projects, education, skills };
}

app.post('/api/analyze', (req, res) => {
    try {
        const analysis = analyzeResume(req.body);
        setTimeout(() => res.json(analysis), 1500); // Fake delay for dramatic effect
    } catch (error) {
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// --- Document Generation Endpoint ---
app.post('/api/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            // Unpack pdfParse if it's wrapped in default (common issue with require in ESM)
            const parseFn = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
            if (typeof parseFn !== 'function') {
                throw new Error('pdf-parse library not loaded correctly');
            }
            const data = await parseFn(req.file.buffer);
            text = data.text;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            text = result.value;
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Use PDF or DOCX.' });
        }

        // Parse Text
        const contactInfo = extractContactInfo(text);
        const rawSections = parseResumeSections(text);
        const structure = processParsedData(rawSections, contactInfo, text);

        res.json(structure);

    } catch (error) {
        console.error('Upload Parse Error:', error);
        res.status(500).json({ error: 'Failed to parse resume' });
    }
});

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
