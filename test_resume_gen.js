import { analyzeResume, generateResumeDOCX, generateResumePDF } from './server.js';
import { Packer } from 'docx';
import fs from 'fs';
import path from 'path';

const outputDir = './output_test';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const sampleData = {
    personal: {
        name: 'John Doe',
        email: 'john.doe@example.com', // +15
        phone: '123-456-7890', // +5
        location: 'New York, NY',
        website: 'johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        summary: 'Experienced Software Engineer with a passion for building scalable web applications. Proven track record of optimizing performance and leading teams to success.'
    },
    experience: [
        {
            role: 'Senior Software Engineer',
            company: 'Tech Corp',
            dates: '2020 - Present',
            location: 'San Francisco, CA',
            details: '• Led a team of 5 engineers to develop a new e-commerce platform.\n• Optimized database queries, reducing load times by 40%.\n• Collaborated with product managers to define roadmap and features.'
        },
        {
            role: 'Software Engineer',
            company: 'Startup Inc',
            dates: '2018 - 2020',
            location: 'Remote',
            details: '• Developed RESTful APIs using Node.js and Express.\n• Implemented automated testing, increasing code coverage to 90%.\n• Managed deployment pipelines using Jenkins and Docker.'
        }
    ],
    projects: [
        {
            name: 'Personal Portfolio',
            description: 'Built a responsive portfolio website using React and Tailwind CSS.',
            technologies: 'React, Tailwind, Framer Motion',
            link: 'https://johndoe.dev'
        },
        {
            name: 'Task Manager',
            description: 'Created a task management app with real-time updates using Socket.io.',
            technologies: 'Node.js, Socket.io, MongoDB',
            link: 'https://github.com/johndoe/tasks'
        }
    ],
    education: [
        {
            school: 'University of Technology',
            degree: 'B.S. Computer Science',
            year: '2018'
        }
    ],
    skills: 'JavaScript, TypeScript, React, Node.js, Python, Docker, AWS, SQL' // >5 items
};

// Analysis Validation
console.log('--- Analyzing Resume ---');
const analysis = analyzeResume(sampleData);
console.log('Score:', analysis.score);
console.log('Grade:', analysis.grade);
console.log('Feedback:', analysis.feedback);
console.log('Strengths:', analysis.strengths);

if (analysis.score >= 90) {
    console.log('PASS: Score is 90+');
} else {
    console.error('FAIL: Score is less than 90');
    // process.exit(1); 
}

// PDF Generation
console.log('--- Generating PDF ---');
try {
    const pdfPath = path.join(outputDir, 'Resume_Test.pdf');
    const pdfBuffer = await generateResumePDF(sampleData);
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`PDF generated at ${pdfPath}`);
} catch (e) {
    console.error('PDF Generation Error:', e);
}

// DOCX Generation
console.log('--- Generating DOCX ---');
try {
    const doc = generateResumeDOCX(sampleData);
    Packer.toBuffer(doc).then((buffer) => {
        const docxPath = path.join(outputDir, 'Resume_Test.docx');
        fs.writeFileSync(docxPath, buffer);
        console.log(`DOCX generated at ${docxPath}`);
    });
} catch (e) {
    console.error('DOCX Generation Error:', e);
}
