/* =========================================================
   Sakith's Personal AI Assistant -- assistant.js
   Version: 2.1 (ASCII-safe, encoding-proof)
   ========================================================= */

(function () {
  'use strict';

  // --- DOM refs ----------------------------------------
  const toggle    = document.getElementById('saToggle');
  const panel     = document.getElementById('saPanel');
  const msgs      = document.getElementById('saMessages');
  const input     = document.getElementById('saInput');
  const sendBtn   = document.getElementById('saSendBtn');
  const closeBtn  = document.getElementById('saCloseBtn');
  const minBtn    = document.getElementById('saMinimiseBtn');
  const clearBtn  = document.getElementById('saClearBtn');
  const badge     = document.getElementById('saBadge');
  const chips     = document.querySelectorAll('.sa-chip');
  const charCount = document.getElementById('saCharCount');

  if (!toggle || !panel) return;

  // --- State -------------------------------------------
  var isOpen      = false;
  var isMinimised = false;
  var isTyping    = false;
  var msgHistory  = [];
  var hasBadge    = true;
  var typingEl    = null;

  // Icon helpers (using Boxicons for a professional look)
  var E = {
    wave  : '<i class="bx bx-hand"></i>',
    pin   : '<i class="bx bx-map-pin"></i>',
    email : '<i class="bx bx-envelope"></i>',
    phone : '<i class="bx bx-phone"></i>',
    brief : '<i class="bx bx-briefcase-alt"></i>',
    octo  : '<i class="bx bxl-github"></i>',
    chat  : '<i class="bx bx-message-square-dots"></i>',
    play  : '<i class="bx bx-play-circle"></i>',
    smile : '<i class="bx bx-smile"></i>',
    spark : '<i class="bx bx-star"></i>',
    cal   : '<i class="bx bx-calendar"></i>',
    grad  : '<i class="bx bx-graduation"></i>',
    scroll: '<i class="bx bx-file"></i>',
    box   : '<i class="bx bx-package"></i>',
    green : '<i class="bx bxs-circle" style="color:#22c55e"></i>',
    dart  : '<i class="bx bx-target-lock"></i>',
    check : '<i class="bx bx-check-circle"></i>',
    bldg  : '<i class="bx bx-buildings"></i>',
    trophy: '<i class="bx bx-trophy"></i>',
    think : '<i class="bx bx-help-circle"></i>',
    lk    : '<i class="bx bx-globe"></i>',
    rocket: '<i class="bx bx-rocket"></i>',
    screen: '<i class="bx bx-desktop"></i>',
    art   : '<i class="bx bx-palette"></i>',
    gear  : '<i class="bx bx-cog"></i>',
    tools : '<i class="bx bx-wrench"></i>',
    masks : '<i class="bx bx-mask"></i>',
    handsh: '<i class="bx bx-wink-smile"></i>', // Changed to smile for friendlier greeting
    user  : '<i class="bx bx-user-circle"></i>',
    wrench: '<i class="bx bx-wrench"></i>',
    star  : '<i class="bx bxs-star"></i>',
    link  : '<i class="bx bx-link-external"></i>',
    map   : '<i class="bx bx-map-alt"></i>',
    bye   : '<i class="bx bx-wink-smile"></i>',
    yt    : '<i class="bx bxl-youtube"></i>',
    dash  : '\u2014',
    arrow : '\u2192',
  };

  /* ======================================================
     KNOWLEDGE BASE
  ====================================================== */
  var KB = {
    identity: {
      name      : 'Sakith Liyanage (Sakith Chanlaka)',
      title     : 'Software Engineer | Full Stack Developer | SLIIT Undergraduate',
      location  : 'Colombo, Western Province, Sri Lanka',
      company   : 'Data Management Systems (Pvt) Ltd (Aug 2025 \u2013 Present)',
      university: 'SLIIT \u2014 BSc (Hons) in IT, Software Engineering (2023\u20132027)',
      email     : 'sakithchanlaka2004@gmail.com',
      phone     : '+94 76 909 2755',
      github    : 'https://github.com/SakithLiyanage',
      linkedin  : 'https://www.linkedin.com/in/sakith-chanlaka/',
      whatsapp  : 'https://api.whatsapp.com/send?phone=94769092755',
      youtube   : 'https://www.youtube.com/channel/UCV0CYfi3zsP5MEstI24aPMA',
    },

    about: 'Sakith Liyanage is a passionate Software Engineer and Full Stack Developer at Data Management Systems (Pvt) Ltd (Division 2) in Colombo, Sri Lanka. With 5+ years of coding experience and currently pursuing a BSc (Hons) in Information Technology specializing in Software Engineering at SLIIT (Cumulative GPA: 3.55), he builds intuitive front-end architectures, enterprise .NET/Spring Boot backends, mobile apps, and AI-powered systems. A 3-time SLIIT Dean\'s List achiever (SGPA 3.7+), 1st Runner-Up at SLIIT MS Club Mini Hackathon 2025, and Top 10 Finalist at ReviveNation CodeFest 2025 \u2014 with 500+ LinkedIn connections, 42 public GitHub repositories, and 1,650+ contributions in the past year.',

    skills: {
      languages : 'Java, TypeScript, JavaScript (ES6+), C#, Kotlin, Python, Dart, C, C++, SQL',
      frontend  : 'React.js, Next.js, Vite, Tailwind CSS, Shadcn UI, Bootstrap, SASS, Framer Motion, HTML5, CSS3',
      backend   : 'Java Spring Boot, ASP.NET Core (.NET 8), Node.js, Express.js, Prisma, PostgreSQL, MongoDB, MySQL, RabbitMQ, Redis, Docker, Kubernetes, AWS',
      mobile    : 'Flutter (Dart), Android Studio (Java / Kotlin)',
      ai        : 'Google Gemini, Groq (Llama 3), OpenRouter, OCR (Tesseract.js), Qwen2-VL, Sentence-BERT',
      tools     : 'Git, GitHub, Docker, Kubernetes, IIS, VS Code, Postman, Android Studio, Terminal',
      design    : 'Figma, Adobe Photoshop, Adobe Illustrator',
      devops    : 'Docker, Kubernetes, AWS, DigitalOcean, Vercel, Render',
      soft      : 'Technical Leadership, Problem Solving, Agile Engineering, Cross-functional Collaboration, Clear Communication',
    },

    experience: [
      {
        role   : 'Software Engineer',
        company: 'Data Management Systems (Pvt) Ltd (Division 2)',
        period : 'August 2025 \u2013 Present \u00b7 Colombo, Sri Lanka \u00b7 Full-time (Hybrid)',
        desc   : 'Software Division \u2014 Architecting enterprise software solutions, designing robust REST APIs, full-stack web development, and cloud services.',
      },
    ],

    education: [
      {
        degree     : 'BSc (Hons) in Information Technology \u2014 Software Engineering (Cumulative GPA: 3.55)',
        institution: 'Sri Lanka Institute of Information Technology (SLIIT)',
        period     : '2023 \u2013 2027 (Currently pursuing) \u00b7 3x Dean\'s List Honoree \u00b7 MS Club, SLIIT FOSS, Rotaract',
      },
      {
        degree     : 'G.C.E. A/L \u2014 Business Studies, Accounting, IT (A2C1) & President, Commerce Society',
        institution: 'Mahinda Rajapaksha College, Homagama',
        period     : '2016 \u2013 2022 \u00b7 G.C.E. O/L \u2014 A7 B2',
      },
    ],

    certifications: [
      'AWS Essential Training for Developers \u2014 LinkedIn Learning (May 2026)',
      'Next.js: Creating and Hosting a Full-Stack Site \u2014 LinkedIn Learning (Feb 2026)',
      'AI/ML Engineer \u2013 Stage 1 \u2014 SLIIT',
      'MongoDB Node.js Developer Path \u2014 MongoDB',
      'JavaScript for Beginners Complete Course \u2014 Udemy (Nov 2024)',
      'Introduction to Java \u2014 Sololearn (Credential: CC-Q0EVVKUS)',
      'Certificate Course in Web Designing \u2014 University of Kelaniya (WD28/009)',
      'Certificate Course in Graphic Designing \u2014 University of Kelaniya (GD16/052)',
      'The Complete HTML & CSS Course \u2014 Udemy',
      'Python for Beginners \u2014 University of Moratuwa (EIvEg3O7o2)',
      'Web Design for Beginners \u2014 University of Moratuwa (QMODdWAeOJ)',
      'Front-End Web Development \u2014 University of Moratuwa',
      'Responsive Web Design Course, HTML & CSS \u2014 Sololearn',
      'Problem Solving (Intermediate) \u2014 HackerRank',
      'Project Management Foundations \u2014 LinkedIn Learning',
    ],

    awards: [
      { title: "Dean's List (3x Honoree)", org: 'SLIIT', detail: 'Year 1 Sem 2, Year 2 Sem 1 & Year 2 Sem 2 \u2014 SGPA 3.7+' },
      { title: '1st Runners-Up',          org: 'SLIIT MS Club Mini Hackathon 2025', detail: 'Team Nexor \u2014 prototype engineering & rapid problem solving' },
      { title: 'Top 10 Finalist',         org: 'ReviveNation CodeFest 2025', detail: 'e-Grama digital certificate platform' },
    ],

    services: [
      { name: 'Web Development',            desc: 'Dynamic, responsive, full-stack web apps (React, Next.js, TypeScript, Node.js, Spring Boot, ASP.NET Core)' },
      { name: 'Cloud & Backend Architecture', desc: 'Microservices, REST APIs, PostgreSQL, MongoDB, RabbitMQ, Docker, Kubernetes, AWS' },
      { name: 'Mobile App Development',     desc: 'Cross-platform Flutter (Dart) and Native Android (Kotlin/Java) mobile applications' },
      { name: 'UI/UX & Brand Design',       desc: 'Intuitive user interfaces, Figma design systems, and brand identity visuals' },
    ],

    projects: [
      { name: 'Solvance',         type: 'Web / Mobile / .NET', desc: 'Smart Solar Microgrid Trading System (Group Leader) with ASP.NET Core, React, Android Java & Google Maps.' },
      { name: 'HEART (J26-SE-334)', type: 'Research / AI',     desc: 'Human Behavior-Aware Robustness Testing Framework for mobile apps using Qwen2-VL & Sentence-BERT.' },
      { name: 'BizPilot AI',      type: 'Full-Stack / AI',     desc: 'Multi-platform AI Business OS monorepo (TypeScript, Express, Prisma, React, Flutter, Groq Llama 3, WhatsApp).' },
      { name: 'BuildMart Secure', type: 'Web / Security',      desc: 'Security-hardened contractor marketplace remediating 25 CWE vulnerabilities + Google OAuth 2.0 / OIDC.' },
      { name: 'SynapseCare',      type: 'Cloud / Web',         desc: 'Cloud-native healthcare platform with Java Spring Boot microservices, PostgreSQL, and RabbitMQ.' },
      { name: 'TrustFund',        type: 'Web',                 desc: 'NGO donation transparency tracker with AI affinity matching (Gemini) and trust score algorithm.' },
      { name: 'NovaPOS',          type: 'Web',                 desc: 'AI-powered Point of Sale system with barcode scanning, chatbot assistant, and analytics.' },
      { name: 'BizNest',          type: 'Mobile App',          desc: 'Entrepreneurial toolkit mobile app built with Flutter, Dart, and OpenRouter AI.' },
      { name: 'UrbanCare',        type: 'Web',                 desc: 'Smart Healthcare Management System \u2014 CSSE module group project.' },
      { name: 'Ripple Studio',    type: 'Web',                 desc: 'Full-stack recording studio booking platform with real-time discovery and payments.' },
      { name: 'e-Grama',          type: 'Web',                 desc: 'Digital certificate issuance platform for Sri Lanka \u2014 ReviveNation Codefest finalist.' },
      { name: 'LangBridge',       type: 'Web',                 desc: 'Full-stack Sinhala/English/Tamil translator with AI, voice, quizzes & community.' },
      { name: 'CreativeForge',    type: 'Web',                 desc: 'AI-powered creative studio for documents, images, QR codes, chatbot & more \u2014 MERN Stack.' },
      { name: 'LMS',              type: 'Web',                 desc: 'MERN-based Learning Management System with role-based access, grading & notifications.' },
      { name: 'YieldCore Systems', type: 'Web',                desc: 'Modern data science agency platform built with React 18, Tailwind CSS, and Framer Motion.' },
      { name: 'TuneLink',         type: 'Web',                 desc: 'Full-stack music & studio booking platform built with React 18, Tailwind CSS, Node.js, and MongoDB.' },
      { name: 'BuildMart',        type: 'Web',                 desc: 'Auction and procurement platform for the construction industry \u2014 MERN & Tailwind.' },
      { name: 'TradeSphere',      type: 'Web',                 desc: 'Full-stack MERN E-Commerce marketplace for buying and selling.' },
      { name: 'Employee Mgmt (.NET 8)', type: 'Web',           desc: 'CRUD Employee Management System built with ASP.NET Core Razor Pages, EF Core & PostgreSQL.' },
      { name: 'Smart Board Oil Lamp', type: 'Web',             desc: 'Interactive 18-lamp ceremony web app for Mahinda Rajapaksha College Homagama.' },
      { name: 'LankaSpire',       type: 'Web',                 desc: 'Sri Lankan cinnamon products e-commerce website built with HTML, SCSS, and JS.' },
      { name: 'CashWire',         type: 'Mobile',              desc: 'Kotlin Android smart money management app with budgeting, charts, and LKR goals.' },
      { name: 'SwiftRide',        type: 'Mobile',              desc: 'Kotlin Android ride & transport booking mobile application.' },
      { name: 'Pixelite',         type: 'Web',                 desc: 'Photography studio showcase and booking website.' },
      { name: 'SL Commerce Wiki', type: 'Web',                 desc: 'Open-source G.C.E. A/L Commerce stream learning portal.' },
      { name: 'ConnectHub',       type: 'Web',                 desc: 'Modern social media web application with responsive design.' },
      { name: 'Eventix',          type: 'Mobile',              desc: 'Event ticket booking mobile app with smooth discovery and management.' },
      { name: 'FinFlow',          type: 'Mobile',              desc: 'Kotlin-based financial tracking app for expense management and budget insights.' },
      { name: 'ToneGallery',      type: 'Web',                 desc: 'Java-based online music store with admin panel and payment simulation.' },
      { name: 'GalleryGavel',     type: 'Web',                 desc: 'Online art marketplace combining e-commerce and auctions \u2014 PHP, MySQL, JS.' },
      { name: 'SriCare',          type: 'Web',                 desc: 'Patient-centric healthcare services web platform.' },
      { name: 'VN Sports',        type: 'Web',                 desc: 'Sports fashion & dressings e-commerce website redesign.' },
      { name: 'Orbiter Shoes',    type: 'Web',                 desc: 'Cutting-edge footwear e-commerce showcase website.' },
      { name: 'Rapid Cart',       type: 'Web',                 desc: 'Sleek, fast-loading online retail shopping platform.' },
      { name: 'ColorScape IT',    type: 'Web',                 desc: 'IT solutions company website with vibrant, creative design.' },
      { name: 'Inland Coffee',    type: 'Branding',            desc: 'Package design and logo for New Inland Coffee brand.' },
    ],

    github: {
      url          : 'https://github.com/SakithLiyanage',
      repos        : '42 Public Repositories',
      contributions: '1,650+ in the last year (2,700+ since 2023)',
      focus        : 'Full-stack TypeScript/MERN, Java Spring Boot, C# ASP.NET Core, Flutter, and AI systems',
    },

    linkedin: {
      url        : 'https://www.linkedin.com/in/sakith-chanlaka/',
      connections: '500+',
      followers  : '2K+',
    },

    availability: 'Sakith is open to freelance projects, collaborations, and interesting job opportunities. Reach out via email or WhatsApp!',

    personality: 'Sakith is a passionate, detail-oriented developer who loves turning ideas into reality. Outside of code, he enjoys learning new technologies, contributing to open-source, and creating visual content.',
  };

  /* ======================================================
     INTENT DETECTION
  ====================================================== */
  function detectIntent(text) {
    var t = text.toLowerCase().trim();

    if (/^(hi|hello|hey|howdy|yo|sup|what'?s up|good\s?(morning|afternoon|evening|day))/.test(t))
      return 'greeting';

    if (/who (is|are) (sakith|you)|tell me about (sakith|yourself)|introduce|about (him|yourself|you)/.test(t))
      return 'about';

    if (/contact|reach|email|phone|call|whatsapp|message|dm|connect/.test(t))
      return 'contact';

    if (/service|offer|provide|what (can|do) (you|he)|help with|hire for/.test(t))
      return 'services';

    if (/skill|tech(nolog|nical)?|stack|language|framework|tool|know|proficient|good at|expertise/.test(t))
      return 'skills';

    if (/project|portfolio|work|built|created|made|app|website|develop/.test(t))
      return 'projects';

    if (/experience|work(ing| history)|job|company|employ|career|professional/.test(t))
      return 'experience';

    if (/education|study|school|university|college|degree|sliit|qualification|gpa|academ/.test(t))
      return 'education';

    if (/certif|course|udemy|moratuwa|kelaniya|hackerrank|mongodb|linkedin learn/.test(t))
      return 'certifications';

    if (/award|achiev|dean|hackathon|codefest|winner|finalist|recogn|honor/.test(t))
      return 'awards';

    if (/github|git|repo|contribut|open.?source/.test(t))
      return 'github';

    if (/linkedin/.test(t))
      return 'linkedin';

    if (/hire|available|availab|freelan|collab|opportunit|job offer|work together|partner/.test(t))
      return 'hire';

    if (/personalit|interes|hobby|passion|like|enjoy|outside|fun/.test(t))
      return 'personality';

    if (/thank|thanks|thx|ty|appreciate/.test(t))
      return 'thanks';

    if (/bye|goodbye|see ya|cya|later|farewell/.test(t))
      return 'bye';

    if (/age|old|born|birthday/.test(t))
      return 'age';

    if (/where|location|country|city|live|based|from/.test(t))
      return 'location';

    if (/social|youtube|instagram|twitter|tiktok|media/.test(t))
      return 'social';

    return 'unknown';
  }

  /* ======================================================
     REPLY BUILDER
  ====================================================== */
  function buildReply(intent) {
    var k = KB;
    var id = k.identity;

    switch (intent) {

      case 'greeting':
        return E.wave + ' Hey there! I\'m Sakith\'s personal assistant. It\'s great to meet you!\n\nI can tell you about Sakith\'s **skills**, **projects**, **services**, **experience**, **education**, and more. What would you like to know?';

      case 'about':
        return '**Who is Sakith?**\n\n' + k.about + '\n\n' + E.pin + ' Currently based in *' + id.location + '* and working at *' + id.company + '*.';

      case 'contact':
        return '**Get in touch with Sakith:**\n\n' +
          E.email + ' **Email:** [' + id.email + '](mailto:' + id.email + ')\n' +
          E.phone + ' **WhatsApp:** [' + id.phone + '](' + id.whatsapp + ')\n' +
          E.brief + ' **LinkedIn:** [sakith-chanlaka](' + id.linkedin + ')\n' +
          E.octo  + ' **GitHub:** [SakithLiyanage](' + id.github + ')\n\n' +
          'Feel free to reach out anytime ' + E.rocket;

      case 'services':
        return '**Services Sakith Offers:**\n' +
          k.services.map(function(s) {
            return '\n' + E.wrench + ' **' + s.name + '**\n' + s.desc;
          }).join('') +
          '\n\n' + E.arrow + ' Interested? [Contact Sakith](mailto:' + id.email + ') ' + E.chat;

      case 'skills': {
        var s = k.skills;
        return '**Sakith\'s Technical Skills:**\n\n' +
          E.screen + ' **Languages:** ' + s.languages + '\n' +
          E.art    + ' **Frontend:** '  + s.frontend + '\n' +
          E.gear   + ' **Backend & Cloud:** ' + s.backend + '\n' +
          E.phone  + ' **Mobile:** '    + s.mobile + '\n' +
          E.rocket + ' **AI & ML:** '   + s.ai + '\n' +
          E.tools  + ' **Tools & DevOps:** ' + s.tools + '\n' +
          E.masks  + ' **Design:** '    + s.design + '\n' +
          E.handsh + ' **Soft Skills:** ' + s.soft;
      }

      case 'projects': {
        var top = k.projects.slice(0, 8);
        return '**Sakith\'s Featured Projects (' + k.projects.length + '+ total):**\n' +
          top.map(function(p) {
            return '\n' + E.brief + ' **' + p.name + '** *(' + p.type + ')*\n  ' + p.desc;
          }).join('') +
          '\n\n*...and ' + (k.projects.length - 8) + ' more!* See portfolio above or on [LinkedIn](' + id.linkedin + ').';
      }

      case 'experience':
        return '**Work Experience:**\n' +
          k.experience.map(function(e) {
            return '\n' + E.bldg + ' **' + e.role + '**\n  ' + e.company + '\n  ' + E.cal + ' ' + e.period + '\n  ' + e.desc;
          }).join('');

      case 'education':
        return '**Academic Background:**\n' +
          k.education.map(function(e) {
            return '\n' + E.grad + ' **' + e.degree + '**\n  ' + e.institution + '\n  ' + E.cal + ' ' + e.period;
          }).join('');

      case 'certifications':
        return '**Certifications & Courses (' + k.certifications.length + '):**\n' +
          k.certifications.map(function(c) { return '\n' + E.scroll + ' ' + c; }).join('');

      case 'awards':
        return '**Awards & Achievements:**\n' +
          k.awards.map(function(a) {
            return '\n' + E.trophy + ' **' + a.title + '** \u2014 *' + a.org + '*\n  ' + a.detail;
          }).join('');

      case 'github':
        return '**Sakith on GitHub:**\n\n' +
          E.octo  + ' **Profile:** [github.com/SakithLiyanage](' + k.github.url + ')\n' +
          E.box   + ' **Public Repositories:** ' + k.github.repos + '\n' +
          E.green + ' **Contributions:** ' + k.github.contributions + '\n' +
          E.dart  + ' **Focus:** ' + k.github.focus;

      case 'linkedin':
        return '**Sakith on LinkedIn:**\n\n' +
          E.brief + ' **Profile:** [linkedin.com/in/sakith-chanlaka](' + k.linkedin.url + ')\n' +
          E.user  + ' **Connections:** ' + k.linkedin.connections + '\n' +
          E.star  + ' **Followers:** ' + k.linkedin.followers + '\n\n' +
          'Connect with Sakith on LinkedIn for professional updates!';

      case 'hire':
        return '**Is Sakith available for hire?**\n\n' +
          E.check + ' ' + k.availability + '\n\n' +
          E.email + ' [sakithchanlaka2004@gmail.com](mailto:' + id.email + ')\n' +
          E.chat  + ' [WhatsApp](' + id.whatsapp + ')\n' +
          E.brief + ' [LinkedIn](' + id.linkedin + ')';

      case 'personality':
        return '**A bit about Sakith personally:**\n\n' + k.personality;

      case 'thanks':
        return E.smile + ' You\'re very welcome! Feel free to ask anything else \u2014 I\'m here to help! ' + E.spark;

      case 'bye':
        return E.bye + ' Goodbye! Have a wonderful day. Come back anytime \u2014 I\'ll be here! ' + E.rocket;

      case 'age':
        return 'Sakith was born in **2004**, making him **22 years old**. He completed his A/Ls in 2022 and began his BSc (Hons) in Software Engineering at SLIIT in 2023.';

      case 'location':
        return 'Sakith is **based in Colombo, Western Province, Sri Lanka** ' + E.lk + '. He works both locally and remotely on projects worldwide.';

      case 'social':
        return '**Sakith\'s Social Media:**\n\n' +
          E.brief  + ' [LinkedIn](' + id.linkedin + ')\n' +
          E.octo   + ' [GitHub](' + id.github + ')\n' +
          E.play   + ' [YouTube](' + id.youtube + ')\n' +
          E.chat   + ' [WhatsApp](' + id.whatsapp + ')';

      default:
        return E.think + ' I\'m not quite sure about that!\n\nI can help with:\n\u2022 Who Sakith is\n\u2022 Skills & tech stack\n\u2022 Projects & portfolio\n\u2022 Services offered\n\u2022 Experience & education\n\u2022 Certifications & awards\n\u2022 Contact & hiring info\n\nTry: *"What are Sakith\'s skills?"* or *"Show me his projects"* ' + E.smile;
    }
  }

  /* ======================================================
     RENDER HELPERS
  ====================================================== */
  function getTimestamp() {
    var now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatText(text) {
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function getAvatarHTML() {
    return '<div class="sa-msg-avatar"><img src="img/itz me.jpg" alt="Sakith" onerror="this.style.display=\'none\'"></div>';
  }

  function appendMessage(role, text, animate) {
    var isBot = (role === 'bot');
    var row   = document.createElement('div');
    row.className = 'sa-msg sa-' + (isBot ? 'bot' : 'user');

    row.innerHTML =
      (isBot ? getAvatarHTML() : '') +
      '<div class="sa-msg-group">' +
        '<div class="sa-bubble">' + formatText(text) + '</div>' +
        '<span class="sa-ts">' + getTimestamp() + '</span>' +
      '</div>';

    if (animate === false) row.style.animation = 'none';
    msgs.appendChild(row);
    scrollBottom();
    msgHistory.push({ role: role, text: text });
  }

  function appendWelcomeCard() {
    var card = document.createElement('div');
    card.className = 'sa-welcome-card';
    card.innerHTML =
      '<span class="sa-wc-emoji">' + E.wave + '</span>' +
      '<h5>Hi! I\'m Sakith\'s Personal Assistant</h5>' +
      '<p>I know everything about Sakith \u2014 skills, projects, experience, certifications, and more. Ask me anything, or pick a topic below!</p>';
    msgs.appendChild(card);

    var divider = document.createElement('div');
    divider.className = 'sa-date-divider';
    divider.innerHTML = '<span>Today</span>';
    msgs.appendChild(divider);
  }

  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'sa-msg sa-bot sa-typing-indicator';
    typingEl.innerHTML =
      getAvatarHTML() +
      '<div class="sa-typing-bubble">' +
        '<span class="sa-dot"></span>' +
        '<span class="sa-dot"></span>' +
        '<span class="sa-dot"></span>' +
      '</div>';
    msgs.appendChild(typingEl);
    scrollBottom();
    isTyping = true;
  }

  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
    isTyping = false;
  }

  function scrollBottom() {
    msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });
  }

  /* ======================================================
     SEND LOGIC
  ====================================================== */
  function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text || isTyping) return;

    input.value = '';
    charCount.textContent = '';
    sendBtn.disabled = true;
    hideQuickReplies();

    appendMessage('user', text);

    var intent = detectIntent(text);
    var delay  = 700 + Math.random() * 600;

    showTyping();
    setTimeout(function() {
      hideTyping();
      var reply = buildReply(intent);
      appendMessage('bot', reply);
      sendBtn.disabled = false;
      input.focus();
    }, delay);
  }

  function hideQuickReplies() {
    var qr = document.getElementById('saQuickReplies');
    if (qr) qr.style.display = 'none';
  }

  /* ======================================================
     PANEL CONTROLS
  ====================================================== */
  function openPanel() {
    isOpen = true;
    panel.classList.add('sa-open');
    panel.classList.remove('sa-minimised');
    isMinimised = false;

    document.querySelector('.sa-fab-icon.open').style.display  = 'none';
    document.querySelector('.sa-fab-icon.close').style.display = 'flex';

    badge.classList.add('hidden');
    hasBadge = false;

    setTimeout(function() { if (input) input.focus(); }, 400);
    updateMinBtn();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('sa-open');
    document.querySelector('.sa-fab-icon.open').style.display  = 'flex';
    document.querySelector('.sa-fab-icon.close').style.display = 'none';
  }

  function togglePanel() {
    if (isOpen) { closePanel(); } else { openPanel(); }
  }

  function minimisePanel() {
    isMinimised = !isMinimised;
    panel.classList.toggle('sa-minimised', isMinimised);
    updateMinBtn();
  }

  function updateMinBtn() {
    var icon = minBtn.querySelector('i');
    if (!icon) return;
    icon.className = isMinimised ? 'bx bx-chevron-down' : 'bx bx-minus';
    minBtn.title   = isMinimised ? 'Expand' : 'Minimise';
  }

  function clearChat() {
    msgs.innerHTML = '';
    appendWelcomeCard();
    msgHistory = [];
    var qr = document.getElementById('saQuickReplies');
    if (qr) qr.style.display = 'flex';
  }

  /* ======================================================
     EVENT LISTENERS
  ====================================================== */
  toggle.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', closePanel);
  minBtn.addEventListener('click', minimisePanel);
  clearBtn.addEventListener('click', clearChat);
  sendBtn.addEventListener('click', function() { sendMessage(); });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  input.addEventListener('input', function() {
    var len = input.value.length;
    if (len > 240) {
      charCount.textContent = len + '/300';
      charCount.style.color = len > 280 ? '#ef4444' : 'rgba(100,116,139,.55)';
    } else {
      charCount.textContent = '';
    }
  });

  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      var msg = chip.dataset.msg;
      if (msg) sendMessage(msg);
    });
  });

  document.addEventListener('click', function(e) {
    if (isOpen && !panel.contains(e.target) && !toggle.contains(e.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  /* ======================================================
     INIT
  ====================================================== */
  function init() {
    appendWelcomeCard();
    setTimeout(function() {
      appendMessage('bot', E.wave + ' Hi! I\'m Sakith\'s personal AI assistant. What would you like to know about him?');
    }, 600);
  }

  init();

})();
