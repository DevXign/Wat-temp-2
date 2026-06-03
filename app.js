document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // SCROLL NAVBAR BACKGROUND EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // LIGHTWEIGHT CANVAS PARTICLE BACKGROUND
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 100 };

    // Set canvas sizes
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse position tracking
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle constructor
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Wall collisions
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse collision interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
              this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
              this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
              this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
              this.y -= 2;
            }
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize particles
    function initParticles() {
      particlesArray = [];
      let numberOfParticles = (canvas.width * canvas.height) / 18000;
      numberOfParticles = Math.min(numberOfParticles, 80); // Cap it for performance
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        // Accent-colored particles (Blue and White)
        let colors = ['rgba(59, 130, 246, 0.25)', 'rgba(96, 165, 250, 0.25)', 'rgba(255, 255, 255, 0.15)'];
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Connecting lines between close particles
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            opacityValue = 1 - (distance / 120);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.08})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
    window.addEventListener('resize', initParticles);
  }

  // ==========================================
  // AI BUSINESS ADVISOR WIDGET CHAT LOGIC
  // ==========================================
  const chatBody = document.getElementById('advisor-chat-body');
  const chatInput = document.getElementById('advisor-chat-input');
  const sendBtn = document.getElementById('advisor-send-btn');
  const quickPrompts = document.getElementById('advisor-quick-prompts');

  // Simulated AI Knowledge Base answers
  const advisoryReplies = {
    "scale customer experience with ai agents": {
      reply: "To scale customer experience, we suggest deploying **Watashi Core Orchestration** loops connected directly to your front-facing support channels. This integrates with standard vector cache structures allowing agents to pull historic context in < 15ms and resolve tickets autonomously.",
      prompts: ["How do we train these agents?", "What's the API integration delay?"]
    },
    "migrate databases to dynamic vector stores": {
      reply: "Database migration begins by deploying a data listener stream. Legacy strings are routed to our chunking pipelines, embedded into high-dimensional space (e.g. 1536-width), and written to **Vector Graph databases** with row-level compliance encryption locks.",
      prompts: ["Which vector databases are supported?", "How do you preserve security compliance?"]
    },
    "design serverless micro-services pipeline": {
      reply: "The recommended pipeline architecture utilizes isolated Kubernetes containers paired with serverless edge triggers. The flow runs through: API Gateway -> Authentication Gateway -> Ingestion Router -> Dynamic Core Executor. This handles peaks of up to 45k RPS automatically.",
      prompts: ["How does scaling handle spikes?", "Is there AWS Cloud integration?"]
    },
    // Sub-prompts
    "how do we train these agents?": {
      reply: "Training is achieved by fine-tuning adapter layers (LoRA weights) on your historical transaction logs and enterprise knowledge articles. This guarantees that your model maintains Watashi's brand voice and strict security compliance guidelines.",
      prompts: ["Design serverless micro-services pipeline", "Consult a live architect"]
    },
    "what's the api integration delay?": {
      reply: "The round-trip API network latency of the **Watashi Brain** core is typically < 120ms. In-memory context checks resolve in under 12ms, enabling conversational speeds that mimic organic human messaging.",
      prompts: ["Scale customer experience with ai agents", "Consult a live architect"]
    },
    "which vector databases are supported?": {
      reply: "We provide native connections for Qdrant, Pinecone, pgvector, and Milvus. The setup abstracts connection strings inside environment parameters and scales them in clusters.",
      prompts: ["Migrate databases to dynamic vector stores", "Consult a live architect"]
    },
    "how do you preserve security compliance?": {
      reply: "We enforce absolute container isolation, column-level data hashes, and active validation nodes. This prevents any parameter leakage into base models and guarantees complete compliance with GDPR and SOC2 frameworks.",
      prompts: ["Migrate databases to dynamic vector stores", "Consult a live architect"]
    },
    "how does scaling handle spikes?": {
      reply: "Our infrastructure triggers scaling rules when CPU threshold reaches 70%. We provision replica pods dynamically on Kubernetes clusters to spread requests across global regional nodes.",
      prompts: ["Design serverless micro-services pipeline", "Consult a live architect"]
    },
    "is there aws cloud integration?": {
      reply: "Yes, we support full AWS VPC peering. Standard blueprints map resources directly to your AWS Lambda, DynamoDB tables, and CloudWatch telemetry dashboard widgets.",
      prompts: ["Design serverless micro-services pipeline", "Consult a live architect"]
    },
    "consult a live architect": {
      reply: "Wonderful! Our digital transformation architects can build a custom system topology map for you. Send a message to **info@watashi.ai** or click the request demo CTA to book a detailed planning session.",
      prompts: ["Scale Customer Experience", "Migrate Database to Vector", "Design Serverless Pipeline"]
    }
  };

  function addChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user');
    bubble.innerHTML = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('chat-bubble', 'chat-bubble-ai', 'typing-indicator');
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  function handleAiResponse(userInput) {
    const normalizedInput = userInput.trim().toLowerCase();
    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      let matchedData = advisoryReplies[normalizedInput];
      
      if (!matchedData) {
        // Fallback fuzzy search keywords
        if (normalizedInput.includes('scale') || normalizedInput.includes('speed') || normalizedInput.includes('volume')) {
          matchedData = advisoryReplies["scale customer experience with ai agents"];
        } else if (normalizedInput.includes('database') || normalizedInput.includes('vector') || normalizedInput.includes('store') || normalizedInput.includes('data')) {
          matchedData = advisoryReplies["migrate databases to dynamic vector stores"];
        } else if (normalizedInput.includes('cloud') || normalizedInput.includes('pipeline') || normalizedInput.includes('serverless') || normalizedInput.includes('micro')) {
          matchedData = advisoryReplies["design serverless micro-services pipeline"];
        } else {
          // Default response
          matchedData = {
            reply: "That is an excellent inquiry. For your specific architecture pain points, we recommend conducting a structured alignment check. Would you like to review our automated system design blueprints or contact an architect?",
            prompts: ["Design serverless micro-services pipeline", "Consult a live architect"]
          };
        }
      }

      addChatMessage('ai', matchedData.reply);
      
      // Update quick prompt buttons
      quickPrompts.innerHTML = '';
      matchedData.prompts.forEach(pText => {
        const btn = document.createElement('button');
        btn.classList.add('quick-prompt-btn');
        btn.setAttribute('data-prompt', pText);
        btn.textContent = pText;
        quickPrompts.appendChild(btn);
      });
      
    }, 1200);
  }

  // Event delegation for prompt buttons
  if (quickPrompts) {
    quickPrompts.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-prompt-btn')) {
        const promptText = e.target.getAttribute('data-prompt');
        addChatMessage('user', promptText);
        handleAiResponse(promptText);
      }
    });
  }

  // Handle manual input send
  function sendManualMessage() {
    const text = chatInput.value.trim();
    if (text) {
      addChatMessage('user', text);
      chatInput.value = '';
      handleAiResponse(text);
    }
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', sendManualMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendManualMessage();
    });
  }


  // ==========================================
  // SOLUTION FINDER STATE ENGINE
  // ==========================================
  const steps = document.querySelectorAll('.solution-step');
  const progressBar = document.getElementById('solution-bar');
  const solutionFinder = document.getElementById('solution-finder-widget');
  
  // Selection State
  let selectedObjective = null;
  let selectedScale = null;
  let selectedEnvironment = null;

  // Track button events
  if (solutionFinder) {
    // Select option card
    solutionFinder.addEventListener('click', (e) => {
      const optionCard = e.target.closest('.option-card');
      if (optionCard) {
        // Unselect siblings
        const key = optionCard.getAttribute('data-step-key');
        const parent = optionCard.parentElement;
        parent.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
        
        optionCard.classList.add('selected');
        const val = optionCard.getAttribute('data-val');

        if (key === 'objective') selectedObjective = val;
        if (key === 'scale') selectedScale = val;
        if (key === 'environment') selectedEnvironment = val;
      }
      
      // Handle button clicks
      if (e.target.classList.contains('btn-next')) {
        const nextStepNum = e.target.getAttribute('data-next');
        
        // Validation check for selecting option
        if (nextStepNum == 2 && !selectedObjective) {
          alert("Please select your primary objective to proceed.");
          return;
        }
        if (nextStepNum == 3 && !selectedScale) {
          alert("Please select your business scale to proceed.");
          return;
        }

        goToStep(nextStepNum);
      }
      
      if (e.target.classList.contains('btn-prev')) {
        const prevStepNum = e.target.getAttribute('data-prev');
        goToStep(prevStepNum);
      }
    });

    const btnSubmit = document.getElementById('btn-solution-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        if (!selectedEnvironment) {
          alert("Please select your cloud stack environment to proceed.");
          return;
        }
        generateAndShowResults();
      });
    }

    const btnReset = document.getElementById('btn-solution-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        selectedObjective = null;
        selectedScale = null;
        selectedEnvironment = null;
        solutionFinder.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
        goToStep(1);
      });
    }
  }

  function goToStep(stepNum) {
    steps.forEach(step => {
      step.classList.remove('active');
      if (step.getAttribute('data-step') == stepNum) {
        step.classList.add('active');
      }
    });

    // Update Progress Bar width
    let progressVal = "25%";
    if (stepNum == 2) progressVal = "50%";
    if (stepNum == 3) progressVal = "75%";
    if (stepNum == 4) progressVal = "100%";
    progressBar.style.width = progressVal;
  }

  function generateAndShowResults() {
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');
    const resultContainer = document.getElementById('result-items-container');

    let titleText = "Watashi Cloud Native Pipeline";
    let descText = "";
    let recommendations = [];

    // Construct recommended systems array based on state
    if (selectedObjective === 'automation') {
      titleText = "MERN Stack Automation Blueprint";
      descText = "Your objectives require high-velocity software integrations. We recommend linking Express.js event routes with background Node.js process worker queues.";
      recommendations = [
        { name: "Node.js Process Queue Worker", desc: "Manitors database change collections and runs background retry routines." },
        { name: "Express.js Endpoint Hooks", desc: "Automates webhooks parsing and writes transactions to MongoDB collections." }
      ];
    } else if (selectedObjective === 'intelligence') {
      titleText = "React & Node AI Interface Blueprint";
      descText = "Your goal is human-grade, automated front-line support running on a React.js client wrapper linked to Node.js agent loops.";
      recommendations = [
        { name: "React.js Live Chat Interface", desc: "Provides fluid conversation views, typing states, and responsive elements." },
        { name: "Node.js Agentic Core & MongoDB Vector", desc: "Processes user queries and fetches relevant indices from MongoDB stores." }
      ];
    } else if (selectedObjective === 'data') {
      titleText = "MongoDB Data Insights Platform";
      descText = "Your requirements focus on aggregating massive logging collections inside MongoDB to compile real-time analytical dashboards.";
      recommendations = [
        { name: "React dashboard components", desc: "Visualizes trends, latency metrics, and API request volumes." },
        { name: "MongoDB Atlas Aggregations", desc: "Compiles logging entries to update operational stats dynamically." }
      ];
    } else {
      // Cloud migration
      titleText = "MERN Server Cluster Blueprint";
      descText = "Deconstruct old relational databases into responsive Node.js micro-services and scalable MongoDB clusters.";
      recommendations = [
        { name: "Node.js API Clusters", desc: "Handles heavy client volumes, runs business validations, and links to Express routes." },
        { name: "MongoDB Scalable Shards", desc: "Distributes document models across clusters to optimize search and write loads." }
      ];
    }

    // Adapt recommendations based on Scale & Environment
    if (selectedScale === 'enterprise') {
      recommendations.push({
        name: "Enterprise Compliance Protection Core",
        desc: "Automates SOC2 audit checks, logs security operations, and protects private data variables."
      });
    }

    if (selectedEnvironment === 'aws') {
      recommendations.push({
        name: "AWS VPC Peering & Serverless Nodes",
        desc: "Links deployment clusters with AWS API Gateway, Lambdas, and secure CloudWatch logging dashboards."
      });
    } else {
      recommendations.push({
        name: "Multi-Cloud Portability Package",
        desc: "Packages deployments in standard Docker layers for migration between GCP, Azure, and private servers."
      });
    }

    // Inject content
    resultTitle.textContent = titleText;
    resultDesc.textContent = descText;
    resultContainer.innerHTML = '';

    recommendations.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('rec-item');
      card.innerHTML = `
        <div class="rec-name">${item.name}</div>
        <div class="rec-desc">${item.desc}</div>
      `;
      resultContainer.appendChild(card);
    });

    goToStep(4);
  }

  // ==========================================
  // INTERACTIVE ARCHITECTURE DIAGRAM
  // ==========================================
  const archNodes = document.querySelectorAll('.arch-node');
  const flowLines = document.querySelectorAll('.arch-flow-line');
  
  // Panel elements
  const archBadge = document.getElementById('arch-badge');
  const archTitle = document.getElementById('arch-title');
  const archDesc = document.getElementById('arch-desc');
  const archVal1 = document.getElementById('arch-val-1');
  const archLabel1 = document.getElementById('arch-label-1');
  const archVal2 = document.getElementById('arch-val-2');
  const archLabel2 = document.getElementById('arch-label-2');

  const nodeInfo = {
    sources: {
      badge: "Input Stage",
      title: "Data Ingestion Hub",
      desc: "Loads databases, application API streams, and device logs. All data passes through active validation checks to ensure telemetry is uniform and correct.",
      val1: "99.99%", label1: "DATA AVAILABILITY",
      val2: "< 14ms", label2: "INGESTION DELAY",
      activeFlows: ["flow-source-top", "flow-source-bottom", "flow-sources-ingest"]
    },
    ingest: {
      badge: "Processing Layer",
      title: "Cognitive Vector Pipeline",
      desc: "Chunks raw document strings, generates high-dimensional embeddings, and writes to dedicated vector stores. Automatically structures unstructured corporate documents.",
      val1: "92.4k/s", label1: "CHUNK VELOCITY",
      val2: "1536d", label2: "DIMENSION WIDTH",
      activeFlows: ["flow-sources-ingest", "flow-ingest-agent"]
    },
    agent: {
      badge: "Execution Core",
      title: "Agentic Loop Orchestrator",
      desc: "Leverages custom LLMs running self-correcting feedback loops. Evaluates data payloads against strict compliance constraints before generating system actions.",
      val1: "0.12s", label1: "LOOP LATENCY",
      val2: "98.7%", label2: "ACCURACY BOUND",
      activeFlows: ["flow-ingest-agent", "flow-agent-api"]
    },
    delivery: {
      badge: "Delivery Stage",
      title: "Secure Enterprise Gateway",
      desc: "Exposes micro-services endpoints to secure Web applications, client SDK pipelines, and REST targets. Governs request volumes and checks security keys.",
      val1: "45k/s", label1: "MAX RPS CAPACITY",
      val2: "0.00%", label2: "COMPLIANCE LEAK",
      activeFlows: ["flow-agent-api", "flow-delivery-top", "flow-delivery-bottom"]
    }
  };

  function updateArchPanel(nodeKey) {
    const info = nodeInfo[nodeKey];
    if (!info) return;

    // Apply active class to current node group
    archNodes.forEach(node => {
      node.classList.remove('active');
      const nodeCircle = node.querySelector('circle, rect');
      if (nodeCircle) {
        nodeCircle.style.strokeWidth = "1.5px";
      }
    });

    const activeNode = document.getElementById(`node-${nodeKey}`);
    if (activeNode) {
      activeNode.classList.add('active');
      const activeCircle = activeNode.querySelector('circle, rect');
      if (activeCircle) {
        activeCircle.style.strokeWidth = "2.5px";
      }
    }

    // Toggle active classes on flow paths
    flowLines.forEach(line => {
      line.classList.remove('active');
      if (info.activeFlows.includes(line.id)) {
        line.classList.add('active');
      }
    });

    // Update panel text content
    archBadge.textContent = info.badge;
    archTitle.textContent = info.title;
    archDesc.textContent = info.desc;
    archVal1.textContent = info.val1;
    archLabel1.textContent = info.label1;
    archVal2.textContent = info.val2;
    archLabel2.textContent = info.label2;
  }

  // Attach click listener to nodes
  archNodes.forEach(node => {
    node.addEventListener('click', () => {
      const target = node.getAttribute('data-target');
      updateArchPanel(target);
    });
  });

  // Initialize first view
  updateArchPanel('sources');


  // ==========================================
  // TECHNOLOGY STACK SHOWCASE FILTERING
  // ==========================================
  const techTabs = document.querySelectorAll('.tech-tab');
  const techGridContainer = document.getElementById('tech-grid-container');

  if (techTabs && techGridContainer) {
    techTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Toggle tabs active
        techTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter cards
        const filterVal = tab.getAttribute('data-filter');
        const cards = techGridContainer.querySelectorAll('.tech-card');
        
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  // ==========================================
  // GLOBAL CLIENT MAP HOTSPOTS TOOLTIP
  // ==========================================
  const mapHotspots = document.querySelectorAll('.map-hotspot');
  const tooltip = document.getElementById('map-tooltip');
  const mapParent = document.getElementById('map-parent');

  if (mapHotspots && tooltip && mapParent) {
    mapHotspots.forEach(hotspot => {
      hotspot.addEventListener('mouseenter', () => {
        const city    = hotspot.getAttribute('data-city');
        const metric  = hotspot.getAttribute('data-metric');
        const desc    = hotspot.getAttribute('data-desc');
        const region  = hotspot.getAttribute('data-region') || 'GLOBAL HUB';

        document.getElementById('tooltip-title').textContent  = city;
        document.getElementById('tooltip-metric').textContent = metric;
        document.getElementById('tooltip-desc').textContent   = desc;
        document.getElementById('tooltip-subtitle').textContent = region;

        // Position: find the solid dot (last circle inside the group)
        const circles = hotspot.querySelectorAll('circle');
        const dotEl   = circles[circles.length - 2] || circles[0]; // solid glow circle
        const dotRect = dotEl.getBoundingClientRect();
        const parentRect = mapParent.getBoundingClientRect();

        const xPos = (dotRect.left + dotRect.width  / 2) - parentRect.left;
        const yPos = (dotRect.top  + dotRect.height / 2) - parentRect.top;

        tooltip.style.left = `${xPos}px`;
        tooltip.style.top  = `${yPos}px`;
        tooltip.classList.add('active');
      });

      hotspot.addEventListener('mouseleave', () => {
        tooltip.classList.remove('active');
      });
    });

    // Hide tooltip if mouse leaves the map wrapper entirely
    mapParent.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  }

});
