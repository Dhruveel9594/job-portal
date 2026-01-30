const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Sample data
const users = [
  { id: 1, email: "recruiter@techcorp.com", password: "password123", name: "Sarah Tech", role: "recruiter" },
  { id: 2, email: "hr@startupco.com", password: "password123", name: "Mike Startup", role: "recruiter" },
  { id: 3, email: "jobs@mobiletech.com", password: "password123", name: "Lisa Mobile", role: "recruiter" },
  { id: 4, email: "alice@example.com", password: "password123", name: "Alice Johnson", role: "candidate" },
  { id: 5, email: "bob@example.com", password: "password123", name: "Bob Smith", role: "candidate" },
  { id: 6, email: "carol@example.com", password: "password123", name: "Carol Williams", role: "candidate" }
];

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    description: "We're looking for an experienced React developer to join our frontend team.",
    skills: "React, JavaScript, TypeScript, Redux, CSS",
    recruiterId: 1,
    recruiterName: "recruiter@techcorp.com"
  },
  {
    id: 2,
    title: "Full Stack Node.js Developer",
    description: "Join our backend team to build robust APIs and microservices.",
    skills: "Node.js, Express, MongoDB, AWS, REST APIs",
    recruiterId: 1,
    recruiterName: "recruiter@techcorp.com"
  },
  {
    id: 3,
    title: "DevOps Engineer",
    description: "Help us scale our infrastructure and improve deployment processes.",
    skills: "Docker, Kubernetes, AWS, Jenkins, Terraform",
    recruiterId: 2,
    recruiterName: "hr@startupco.com"
  },
  {
    id: 4,
    title: "Python Data Scientist",
    description: "Analyze large datasets and build machine learning models.",
    skills: "Python, Machine Learning, Pandas, Scikit-learn, SQL",
    recruiterId: 2,
    recruiterName: "hr@startupco.com"
  }
];

const candidates = [
  {
    id: 1,
    name: "Alice Johnson",
    skills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    resume: { filename: "alice_resume.txt", originalname: "alice_resume.txt" },
    userId: 4,
    userEmail: "alice@example.com"
  },
  {
    id: 2,
    name: "Bob Smith",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Docker"],
    resume: { filename: "bob_resume.txt", originalname: "bob_resume.txt" },
    userId: 5,
    userEmail: "bob@example.com"
  }
];

const applications = [];

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Auth routes
app.post('/api/register', async (req, res) => {
  const { email, password, name, role = 'candidate' } = req.body;
  
  console.log('🔵 Registration attempt:', { email, name, role });
  
  if (!email || !password || !name) {
    console.log('❌ Missing fields');
    return res.status(400).json({ error: 'Email, password and name are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    console.log('❌ User already exists');
    return res.status(400).json({ error: 'User already exists' });
  }

  try {
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const user = {
      id: newId,
      email,
      password,
      name,
      role: ['candidate', 'recruiter'].includes(role) ? role : 'candidate'
    };
    
    users.push(user);
    console.log('✅ User created:', { id: user.id, email: user.email, role: user.role });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔵 Login attempt:', { email, password });
  
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  console.log('🔍 Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'NOT FOUND');
  
  if (!user) {
    console.log('❌ User not found');
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  if (user.password !== password) {
    console.log('❌ Password mismatch');
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  
  console.log('✅ Login successful:', { id: user.id, email: user.email, role: user.role });
  
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  console.log('📋 Returning jobs:', jobs.length);
  res.json(jobs);
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Only recruiters can post jobs' });
  }
  
  const newId = Math.max(...jobs.map(j => j.id)) + 1;
  const job = { 
    id: newId, 
    ...req.body, 
    recruiterId: req.user.id,
    recruiterName: req.user.email 
  };
  jobs.push(job);
  console.log('✅ New job posted:', job.title, 'by', req.user.email);
  res.status(201).json(job);
});

// APPLICATION ROUTES - THIS IS THE KEY PART
app.post('/api/apply', authenticateToken, (req, res) => {
  const { jobId } = req.body;
  
  console.log('🔵 APPLY REQUEST:', { jobId, userId: req.user.id, userEmail: req.user.email });
  
  if (req.user.role !== 'candidate') {
    console.log('❌ Only candidates can apply');
    return res.status(403).json({ error: 'Only candidates can apply for jobs' });
  }

  const job = jobs.find(j => j.id === parseInt(jobId));
  if (!job) {
    console.log('❌ Job not found:', jobId);
    return res.status(404).json({ error: 'Job not found' });
  }

  // Check if already applied
  const existingApplication = applications.find(a => 
    a.jobId === parseInt(jobId) && a.candidateId === req.user.id
  );
  
  if (existingApplication) {
    console.log('❌ Already applied');
    return res.status(400).json({ error: 'You have already applied for this job' });
  }

  const application = {
    id: applications.length + 1,
    jobId: parseInt(jobId),
    candidateId: req.user.id,
    candidateName: req.user.name || req.user.email,
    candidateEmail: req.user.email,
    jobTitle: job.title,
    appliedAt: new Date().toISOString(),
    status: 'pending'
  };

  applications.push(application);
  console.log('✅ APPLICATION SUCCESSFUL:', application.candidateName, 'applied for', application.jobTitle);
  
  res.status(201).json({ 
    message: 'Application submitted successfully',
    application 
  });
});

app.get('/api/applications', authenticateToken, (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Only recruiters can view applications' });
  }

  const recruiterJobs = jobs.filter(j => j.recruiterId === req.user.id);
  const jobIds = recruiterJobs.map(j => j.id);
  const recruiterApplications = applications.filter(a => jobIds.includes(a.jobId));
  
  console.log('📊 Applications for recruiter:', req.user.email, recruiterApplications.length);
  res.json(recruiterApplications);
});

app.get('/api/job-stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Only recruiters can view job statistics' });
  }

  const recruiterJobs = jobs.filter(j => j.recruiterId === req.user.id);
  const recruiterApplications = applications.filter(a => 
    recruiterJobs.some(j => j.id === a.jobId)
  );

  const stats = {
    totalJobs: recruiterJobs.length,
    totalApplications: recruiterApplications.length,
    totalCandidates: new Set(recruiterApplications.map(a => a.candidateId)).size
  };

  res.json(stats);
});

// Other routes
app.post('/api/match', authenticateToken, (req, res) => {
  const { skills = [] } = req.body;
  const scored = jobs.map(job => {
    const text = (job.title + ' ' + (job.description || '') + ' ' + (job.skills || '')).toLowerCase();
    let score = 0;
    skills.forEach(s => { if (text.includes(s.toLowerCase())) score += 1; });
    return { ...job, score };
  }).filter(j => j.score > 0).sort((a, b) => b.score - a.score);
  res.json(scored);
});

app.get('/api/candidates', authenticateToken, (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Only recruiters can view candidates' });
  }
  
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json(candidates);
  const filtered = candidates.filter(c => c.skills.join(' ').toLowerCase().includes(q));
  res.json(filtered);
});

app.get('/api/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    endpoints: ['/api/jobs', '/api/apply', '/api/applications']
  });
});

console.log('\n🚀 Job Portal Backend Starting...');
console.log('📊 Sample Data:');
console.log(`   • ${jobs.length} Jobs`);
console.log(`   • ${candidates.length} Candidates`);
console.log(`   • ${users.length} Users`);
console.log('\n🔐 Login Credentials:');
users.forEach(user => {
  console.log(`   • ${user.email} / ${user.password} (${user.role})`);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`\n✅ Backend running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   • GET  /api/test');
  console.log('   • GET  /api/jobs');
  console.log('   • POST /api/apply  ← THIS IS THE MISSING ONE!');
  console.log('   • GET  /api/applications');
  console.log('\n🔥 Ready for job applications!\n');
});