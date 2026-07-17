/**
 * courseData.js
 * -------------
 * Master course database — 30 hand-curated high-quality courses.
 * Each entry maps to one or more skill keywords for fuzzy matching.
 */

export const COURSE_DB = [
  // ── Machine Learning ──
  {
    skill: 'Machine Learning', keywords: ['machine learning', 'ml', 'scikit', 'sklearn'],
    title: 'Machine Learning Specialization',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '3 months', level: 'Intermediate', free: false,
    link: 'https://www.coursera.org/specializations/machine-learning-introduction',
    impact: 'High', impactBoost: 12,
    description: 'Andrew Ng\'s flagship ML course. Gold standard for ML fundamentals.',
  },
  {
    skill: 'Machine Learning', keywords: ['machine learning', 'ml'],
    title: 'Intro to Machine Learning',
    platform: 'Kaggle', platformIcon: '🐍',
    duration: '5 hours', level: 'Beginner', free: true,
    link: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    impact: 'High', impactBoost: 10,
    description: 'Hands-on Kaggle micro-course with real datasets. Perfect starting point.',
  },

  // ── Deep Learning ──
  {
    skill: 'Deep Learning', keywords: ['deep learning', 'neural network', 'tensorflow', 'keras'],
    title: 'Deep Learning Specialization',
    platform: 'DeepLearning.AI', platformIcon: '🧠',
    duration: '4 months', level: 'Intermediate', free: false,
    link: 'https://www.coursera.org/specializations/deep-learning',
    impact: 'High', impactBoost: 14,
    description: 'The most trusted deep learning course by Andrew Ng. 5-course series.',
  },
  {
    skill: 'TensorFlow', keywords: ['tensorflow', 'tf', 'keras'],
    title: 'TensorFlow Developer Certificate',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '8 weeks', level: 'Intermediate', free: false,
    link: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice',
    impact: 'High', impactBoost: 11,
    description: 'Official TensorFlow certification prep. Highly recognized by recruiters.',
  },
  {
    skill: 'PyTorch', keywords: ['pytorch', 'torch'],
    title: 'PyTorch for Deep Learning',
    platform: 'freeCodeCamp', platformIcon: '🔥',
    duration: '25 hours', level: 'Intermediate', free: true,
    link: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
    impact: 'High', impactBoost: 10,
    description: 'Full PyTorch course — from tensors to building real neural networks.',
  },

  // ── Data Science ──
  {
    skill: 'Data Science', keywords: ['data science', 'data analysis', 'analytics'],
    title: 'IBM Data Science Professional Certificate',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '5 months', level: 'Beginner', free: false,
    link: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    impact: 'High', impactBoost: 13,
    description: '10-course IBM certification. Covers Python, SQL, ML, and visualization.',
  },
  {
    skill: 'Pandas', keywords: ['pandas', 'numpy', 'data analysis'],
    title: 'Pandas — Complete Guide',
    platform: 'Kaggle', platformIcon: '🐍',
    duration: '4 hours', level: 'Beginner', free: true,
    link: 'https://www.kaggle.com/learn/pandas',
    impact: 'Medium', impactBoost: 7,
    description: 'Essential pandas skills for data manipulation and analysis.',
  },
  {
    skill: 'Data Visualization', keywords: ['visualization', 'matplotlib', 'seaborn', 'plotly', 'tableau', 'power bi'],
    title: 'Data Visualization with Python',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '4 weeks', level: 'Beginner', free: false,
    link: 'https://www.coursera.org/learn/python-for-data-visualization',
    impact: 'Medium', impactBoost: 7,
    description: 'Master matplotlib, seaborn, and folium for professional visualizations.',
  },

  // ── Python ──
  {
    skill: 'Python', keywords: ['python'],
    title: 'Python for Everybody Specialization',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '8 months', level: 'Beginner', free: false,
    link: 'https://www.coursera.org/specializations/python',
    impact: 'High', impactBoost: 10,
    description: 'Dr. Chuck\'s legendary Python series. The #1 beginner Python course.',
  },
  {
    skill: 'Python', keywords: ['python', 'scripting'],
    title: 'Python Full Course',
    platform: 'freeCodeCamp', platformIcon: '🔥',
    duration: '12 hours', level: 'Beginner', free: true,
    link: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    impact: 'High', impactBoost: 9,
    description: 'Complete Python crash course — zero to hero in one sitting.',
  },

  // ── SQL & Databases ──
  {
    skill: 'SQL', keywords: ['sql', 'mysql', 'postgresql', 'database', 'relational'],
    title: 'SQL for Data Science',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '4 weeks', level: 'Beginner', free: false,
    link: 'https://www.coursera.org/learn/sql-for-data-science',
    impact: 'High', impactBoost: 9,
    description: 'UC Davis SQL course. Most popular SQL intro course on Coursera.',
  },
  {
    skill: 'SQL', keywords: ['sql', 'database'],
    title: 'Intro to SQL',
    platform: 'Kaggle', platformIcon: '🐍',
    duration: '3 hours', level: 'Beginner', free: true,
    link: 'https://www.kaggle.com/learn/intro-to-sql',
    impact: 'High', impactBoost: 8,
    description: 'Fast-track SQL with BigQuery. Hands-on with real Google datasets.',
  },

  // ── Web Development ──
  {
    skill: 'React', keywords: ['react', 'reactjs', 'react.js', 'frontend'],
    title: 'React - The Complete Guide',
    platform: 'Udemy', platformIcon: '🎯',
    duration: '48 hours', level: 'Intermediate', free: false,
    link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    impact: 'High', impactBoost: 11,
    description: 'Maximilian\'s React course. The most comprehensive React guide available.',
  },
  {
    skill: 'JavaScript', keywords: ['javascript', 'js', 'node', 'nodejs', 'typescript'],
    title: 'JavaScript Algorithms & Data Structures',
    platform: 'freeCodeCamp', platformIcon: '🔥',
    duration: '300 hours', level: 'Intermediate', free: true,
    link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    impact: 'High', impactBoost: 10,
    description: 'Full freeCodeCamp JS curriculum with certification. Completely free.',
  },
  {
    skill: 'Node.js', keywords: ['node', 'nodejs', 'express', 'backend api'],
    title: 'Node.js, Express, MongoDB Bootcamp',
    platform: 'Udemy', platformIcon: '🎯',
    duration: '42 hours', level: 'Intermediate', free: false,
    link: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
    impact: 'Medium', impactBoost: 8,
    description: 'Jonas Schmedtmann\'s full-stack Node bootcamp. Industry gold standard.',
  },

  // ── Cloud ──
  {
    skill: 'AWS', keywords: ['aws', 'amazon web services', 'cloud', 'ec2', 's3', 'lambda'],
    title: 'AWS Certified Cloud Practitioner',
    platform: 'AWS Training', platformIcon: '☁️',
    duration: '6 weeks', level: 'Beginner', free: true,
    link: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
    impact: 'High', impactBoost: 12,
    description: 'Official AWS foundational certification. Highly valued by recruiters.',
  },
  {
    skill: 'AWS', keywords: ['aws', 'cloud', 'solutions architect'],
    title: 'AWS Solutions Architect Associate',
    platform: 'Udemy', platformIcon: '🎯',
    duration: '27 hours', level: 'Intermediate', free: false,
    link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
    impact: 'High', impactBoost: 14,
    description: 'Stephane Maarek\'s SAA-C03 prep. #1 AWS certification course globally.',
  },
  {
    skill: 'GCP', keywords: ['gcp', 'google cloud', 'bigquery', 'google cloud platform'],
    title: 'Google Cloud Professional Data Engineer',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '8 weeks', level: 'Advanced', free: false,
    link: 'https://www.coursera.org/professional-certificates/gcp-data-engineering',
    impact: 'High', impactBoost: 13,
    description: 'Official Google Cloud certification path for data engineers.',
  },
  {
    skill: 'Azure', keywords: ['azure', 'microsoft azure', 'az-900'],
    title: 'Microsoft Azure AZ-900 Fundamentals',
    platform: 'Microsoft Learn', platformIcon: '🪟',
    duration: '10 hours', level: 'Beginner', free: true,
    link: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
    impact: 'High', impactBoost: 10,
    description: 'Free official Microsoft certification path. Azure 101 for all roles.',
  },

  // ── DevOps ──
  {
    skill: 'Docker', keywords: ['docker', 'container', 'containerization'],
    title: 'Docker & Kubernetes: The Practical Guide',
    platform: 'Udemy', platformIcon: '🎯',
    duration: '23 hours', level: 'Intermediate', free: false,
    link: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/',
    impact: 'High', impactBoost: 11,
    description: 'From Docker basics to Kubernetes orchestration. Complete DevOps stack.',
  },
  {
    skill: 'Kubernetes', keywords: ['kubernetes', 'k8s', 'orchestration'],
    title: 'Kubernetes for Absolute Beginners',
    platform: 'Udemy', platformIcon: '🎯',
    duration: '6 hours', level: 'Beginner', free: false,
    link: 'https://www.udemy.com/course/learn-kubernetes/',
    impact: 'Medium', impactBoost: 9,
    description: 'Hands-on Kubernetes from the creators of KodeKloud. Lab-based.',
  },
  {
    skill: 'CI/CD', keywords: ['ci/cd', 'cicd', 'github actions', 'jenkins', 'devops'],
    title: 'DevOps & CI/CD Pipelines',
    platform: 'freeCodeCamp', platformIcon: '🔥',
    duration: '8 hours', level: 'Intermediate', free: true,
    link: 'https://www.youtube.com/watch?v=scEDHsr3APg',
    impact: 'Medium', impactBoost: 8,
    description: 'Complete DevOps & CI/CD guide including GitHub Actions and Jenkins.',
  },

  // ── NLP / LLM ──
  {
    skill: 'NLP', keywords: ['nlp', 'natural language processing', 'text', 'spacy', 'nltk', 'bert', 'transformer'],
    title: 'Natural Language Processing Specialization',
    platform: 'DeepLearning.AI', platformIcon: '🧠',
    duration: '4 months', level: 'Advanced', free: false,
    link: 'https://www.coursera.org/specializations/natural-language-processing',
    impact: 'High', impactBoost: 13,
    description: 'Complete NLP from sentiment analysis to transformers and attention.',
  },
  {
    skill: 'LLM / GenAI', keywords: ['llm', 'generative ai', 'genai', 'gpt', 'chatgpt', 'langchain', 'prompt'],
    title: 'Generative AI with LLMs',
    platform: 'DeepLearning.AI', platformIcon: '🧠',
    duration: '3 weeks', level: 'Intermediate', free: false,
    link: 'https://www.coursera.org/learn/generative-ai-with-llms',
    impact: 'High', impactBoost: 15,
    description: 'AWS + DeepLearning.AI course on LLMs, fine-tuning, and RLHF.',
  },
  {
    skill: 'Hugging Face', keywords: ['hugging face', 'huggingface', 'transformers library'],
    title: 'Hugging Face NLP Course',
    platform: 'Hugging Face', platformIcon: '🤗',
    duration: '10 hours', level: 'Intermediate', free: true,
    link: 'https://huggingface.co/learn/nlp-course',
    impact: 'High', impactBoost: 11,
    description: 'Official Hugging Face course. Master the transformers library end-to-end.',
  },

  // ── Statistics / Math ──
  {
    skill: 'Statistics', keywords: ['statistics', 'probability', 'math', 'linear algebra', 'calculus'],
    title: 'Statistics with Python Specialization',
    platform: 'Coursera', platformIcon: '🎓',
    duration: '5 months', level: 'Intermediate', free: false,
    link: 'https://www.coursera.org/specializations/statistics-with-python',
    impact: 'Medium', impactBoost: 8,
    description: 'University of Michigan stats course — foundations for ML and data science.',
  },

  // ── System Design ──
  {
    skill: 'System Design', keywords: ['system design', 'scalability', 'architecture', 'microservices'],
    title: 'System Design for Interviews',
    platform: 'Udemy', platformIcon: '🎯',
    duration: '16 hours', level: 'Advanced', free: false,
    link: 'https://www.udemy.com/course/system-design-interview-prep/',
    impact: 'Medium', impactBoost: 9,
    description: 'Complete system design course — databases, caching, load balancing, and more.',
  },

  // ── Git / GitHub ──
  {
    skill: 'Git', keywords: ['git', 'github', 'version control'],
    title: 'Git & GitHub Crash Course',
    platform: 'freeCodeCamp', platformIcon: '🔥',
    duration: '4 hours', level: 'Beginner', free: true,
    link: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    impact: 'Low', impactBoost: 5,
    description: 'Complete Git and GitHub fundamentals for developers.',
  },

  // ── Computer Vision ──
  {
    skill: 'Computer Vision', keywords: ['computer vision', 'cv', 'opencv', 'image', 'object detection', 'yolo'],
    title: 'Convolutional Neural Networks (Course 4)',
    platform: 'DeepLearning.AI', platformIcon: '🧠',
    duration: '4 weeks', level: 'Advanced', free: false,
    link: 'https://www.coursera.org/learn/convolutional-neural-networks',
    impact: 'High', impactBoost: 12,
    description: 'Andrew Ng\'s CNNs course — object detection, face recognition, neural style transfer.',
  },

  // ── MLOps ──
  {
    skill: 'MLOps', keywords: ['mlops', 'ml pipeline', 'model deployment', 'mlflow', 'kubeflow'],
    title: 'Machine Learning Engineering for Production (MLOps)',
    platform: 'DeepLearning.AI', platformIcon: '🧠',
    duration: '4 months', level: 'Advanced', free: false,
    link: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops',
    impact: 'High', impactBoost: 13,
    description: 'Full MLOps specialization — deploy, monitor, and maintain ML systems at scale.',
  },
];

// Platform color map for UI rendering
export const PLATFORM_COLORS = {
  'Coursera':       { bg: 'rgba(0,86,210,0.12)',   border: 'rgba(0,86,210,0.3)',    color: '#60a5fa' },
  'DeepLearning.AI':{ bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',   color: '#22d3ee' },
  'Kaggle':         { bg: 'rgba(32,201,151,0.12)', border: 'rgba(32,201,151,0.3)',  color: '#34d399' },
  'freeCodeCamp':   { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',  color: '#4ade80' },
  'Udemy':          { bg: 'rgba(244,114,182,0.12)',border: 'rgba(244,114,182,0.3)', color: '#f472b6' },
  'AWS Training':   { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',  color: '#fbbf24' },
  'Udacity':        { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)',  color: '#818cf8' },
  'Microsoft Learn':{ bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)',  color: '#818cf8' },
  'Hugging Face':   { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)',  color: '#fde68a' },
};

export const LEVEL_COLORS = {
  'Beginner':    '#10b981',
  'Intermediate':'#f59e0b',
  'Advanced':    '#ef4444',
};

export const IMPACT_STYLES = {
  High:   { bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)',    color: '#f87171', icon: '🔴' },
  Medium: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  color: '#fbbf24', icon: '🟡' },
  Low:    { bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.15)', color: '#94a3b8', icon: '⚪' },
};
