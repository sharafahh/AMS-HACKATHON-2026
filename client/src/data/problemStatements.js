export const PROBLEM_STATEMENTS = [
  {
    "id": "PS-AI-01",
    "title": "Autonomous Multi-Agent Regulatory & Compliance Auditing System",
    "track": "AI & Machine Learning",
    "category": "Software",
    "difficulty": "Advanced",
    "summary": "Develop a cooperative multi-agent LLM framework that scans unstructured enterprise policies, contracts, and financial records to flag non-compliance and generate audit trails.",
    "context": "Modern enterprises spend thousands of hours manually reviewing thousands of pages of evolving compliance regulations. An autonomous multi-agent system can verify clauses against state and federal laws with high fidelity.",
    "deliverables": [
      "Agent orchestration pipeline (retriever, compliance evaluator, synthesizer)",
      "Interactive dashboard highlighting non-compliant clauses with citation references",
      "Automated PDF compliance audit report generator",
      "Confidence scoring and human-in-the-loop dispute workflow"
    ],
    "techStack": [
      "Python / FastAPI",
      "LangChain / LlamaIndex",
      "Vector DB (Milvus/Chroma)",
      "React + Tailwind"
    ],
    "evaluation": [
      "Accuracy of citation extraction (30%)",
      "Multi-agent coordination logic (25%)",
      "Dashboard UI/UX (25%)",
      "Real-time query latency (20%)"
    ]
  },
  {
    "id": "PS-AI-02",
    "title": "Real-Time Multimodal Edge Vision Defect Detection for Micro-Manufacturing",
    "track": "AI & Machine Learning",
    "category": "Dual Track",
    "difficulty": "Grand Challenge",
    "summary": "Construct a lightweight computer vision pipeline capable of detecting micro-surface defects on printed circuit boards (PCBs) at sub-second frame rates on edge hardware.",
    "context": "High-speed assembly lines require visual inspection systems that can detect solder bridging, missing components, and trace fractures without sending raw video feeds to high-latency cloud servers.",
    "deliverables": [
      "Trained YOLO / Edge-SAM model quantized for edge inference",
      "Live camera stream inference dashboard with bounding boxes and heatmaps",
      "Automated defect classification and reject-signal trigger simulation",
      "Historical defect analytics log with exportable CSV audit data"
    ],
    "techStack": [
      "PyTorch / ONNX Runtime",
      "OpenCV",
      "FastAPI / WebSockets",
      "Raspberry Pi / ESP32-CAM Compatible"
    ],
    "evaluation": [
      "Inference FPS & latency (30%)",
      "Defect detection F1-score (30%)",
      "Edge deployment architecture (25%)",
      "Interface usability (15%)"
    ]
  },
  {
    "id": "PS-CS-01",
    "title": "Zero-Trust Behavioral Identity Verification & Session Hijacking Sentinel",
    "track": "Cyber Security",
    "category": "Software",
    "difficulty": "Advanced",
    "summary": "Build a continuous zero-trust authentication engine that analyzes biometric keystroke dynamics, mouse trajectory patterns, and network anomalies to detect unauthorized session takeovers.",
    "context": "Static single-sign-on (SSO) is vulnerable to session token theft (Pass-The-Cookie). Continuous behavioral verification flags account hijacking even when valid credentials are used.",
    "deliverables": [
      "Client-side passive telemetry collector (keystroke timing, mouse vectors)",
      "Machine learning risk scoring engine calculating instantaneous threat levels",
      "Automated step-up MFA challenge trigger when anomaly threshold is breached",
      "Security Operations Center (SOC) incident visualization dashboard"
    ],
    "techStack": [
      "Node.js / Go",
      "TensorFlow.js / Scikit-Learn",
      "Redis",
      "React + Tailwind"
    ],
    "evaluation": [
      "Keystroke behavioral anomaly accuracy (35%)",
      "Zero false-positive user friction (25%)",
      "SOC Alert real-time dashboard (25%)",
      "Code security posture (15%)"
    ]
  },
  {
    "id": "PS-CS-02",
    "title": "Automated Smart Contract Bytecode Vulnerability & Reentrancy Scanner",
    "track": "Cyber Security",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Design an automated static analysis scanner that disassembles EVM bytecode, identifies flash loan vulnerability vectors, reentrancy loops, and generates automated remediation patches.",
    "context": "DeFi protocols continue to lose millions to subtle smart contract bugs. A fast static analyzer empowers developers to audit contracts prior to mainnet deployment.",
    "deliverables": [
      "EVM bytecode disassembler and abstract syntax tree (AST) analyzer",
      "Detection rules for Reentrancy, Timestamp Dependence, and Integer Overflows",
      "Interactive code diff view showing proposed vulnerability fixes",
      "Comprehensive audit score matrix and shareable badge generation"
    ],
    "techStack": [
      "Solidity",
      "Rust / Python",
      "Slither / Mythril AST Hooks",
      "React"
    ],
    "evaluation": [
      "Vulnerability detection rate (35%)",
      "Remediation patch correctness (30%)",
      "Execution speed (20%)",
      "User experience (15%)"
    ]
  },
  {
    "id": "PS-HC-01",
    "title": "Smart ICU Patient Multi-Vital Telemetry & Early Sepsis Warning Engine",
    "track": "Healthcare",
    "category": "Dual Track",
    "difficulty": "Grand Challenge",
    "summary": "Create an end-to-end IoT patient telemetry monitor that ingests HR, SpO2, and temperature readings to calculate real-time SOFA scores and forecast septic shocks 4 hours in advance.",
    "context": "Sepsis is one of the leading causes of ICU mortality. Early predictive intervention based on continuous vital telemetry dramatically improves patient survival rates.",
    "deliverables": [
      "ESP32 sensor payload interface simulating ECG/Pulse/SpO2/Temp telemetry",
      "Real-time clinician monitoring dashboard with audible emergency triage alerts",
      "Time-series ML forecasting model for 4-hour sepsis onset risk",
      "Automated SMS/Email escalation to on-call medical personnel"
    ],
    "techStack": [
      "ESP32 / Arduino C++",
      "MQTT / WebSockets",
      "Python XGBoost / LSTM",
      "React Chart.js"
    ],
    "evaluation": [
      "Prediction lead time and ROC-AUC (35%)",
      "Hardware telemetry reliability (25%)",
      "Triage UI clarity for nurses (25%)",
      "Alert delivery speed (15%)"
    ]
  },
  {
    "id": "PS-HC-02",
    "title": "Decentralized Medical Prescription & Anti-Counterfeit Drug Verification",
    "track": "Healthcare",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Architect a tamper-proof digital prescription verification network using cryptographic signatures to eliminate counterfeit pharmaceuticals and illegal prescription reuse.",
    "context": "Prescription forgery and black-market drug counterfeiting cause severe global health risks. Cryptographic prescription verification ensures single-dispense authenticity.",
    "deliverables": [
      "Doctor portal for signing cryptographic e-prescriptions with digital keys",
      "Pharmacy dispense validation scanner that invalidates one-time redemption tokens",
      "Patient mobile-friendly prescription wallet and QR verification link",
      "Drug batch provenance tracker mapping serial numbers to manufacturers"
    ],
    "techStack": [
      "Node.js / Express",
      "ECDSA Cryptographic Signatures",
      "MongoDB",
      "React QR Scanner"
    ],
    "evaluation": [
      "Cryptographic tamper resistance (35%)",
      "Workflow simplicity (25%)",
      "Batch traceability (25%)",
      "Role access control (15%)"
    ]
  },
  {
    "id": "PS-AG-01",
    "title": "Smart Agricultural Soil NPK Telemetry & LoRaWAN Drone Mesh Gateway",
    "track": "Agriculture",
    "category": "Hardware",
    "difficulty": "Advanced",
    "summary": "Construct a solar-powered field sensor node measuring Nitrogen, Phosphorus, Potassium (NPK), moisture, and pH, communicating across miles via LoRaWAN telemetry.",
    "context": "Rural farmlands lack cellular broadband. Low-power LoRa mesh nodes allow farmers to monitor vast hectares of soil without recurring data charges.",
    "deliverables": [
      "Embedded sensor node schematic using Arduino/ESP32 and LoRa transceivers",
      "Solar power management and ultra-low-power sleep cycle firmware",
      "Central gateway receiver relaying telemetry to cloud dashboard",
      "Farmer dashboard providing automated fertilizer mixing recommendations"
    ],
    "techStack": [
      "Arduino / ESP32 C++",
      "LoRa SX1278 (433/868 MHz)",
      "MQTT Broker",
      "React Mapbox"
    ],
    "evaluation": [
      "Power efficiency & sleep cycle design (30%)",
      "Telemetry transmission range (25%)",
      "Soil health prescription logic (25%)",
      "Enclosure ruggedness design (20%)"
    ]
  },
  {
    "id": "PS-AG-02",
    "title": "AI-Driven Satellite Crop Health Analyzer & Direct Market Aggregator",
    "track": "Agriculture",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Develop a platform utilizing Sentinel-2 satellite NDVI imagery to monitor regional crop health and connect farmers directly with wholesale food aggregators.",
    "context": "Middlemen take over 40% of agricultural profits. Direct price discovery based on verified crop quality data maximizes farm gate revenue.",
    "deliverables": [
      "Satellite NDVI calculation pipeline from public Copernicus Sentinel-2 data",
      "Geospatial crop health map with pest/drought vulnerability heatmaps",
      "B2B marketplace with live crop bidding and smart transport route matching",
      "Multilingual SMS advisory for non-smartphone farmers"
    ],
    "techStack": [
      "Python GeoPandas / Rasterio",
      "FastAPI",
      "PostGIS",
      "React Tailwind"
    ],
    "evaluation": [
      "Satellite NDVI processing speed (30%)",
      "Marketplace bidding workflow (25%)",
      "Advisory actionable quality (25%)",
      "Multilingual accessibility (20%)"
    ]
  },
  {
    "id": "PS-ED-01",
    "title": "Gamified Adaptive STEM Tutor & Neurodivergent Focus Assistant",
    "track": "Smart Education",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Build an interactive web-based STEM learning companion that dynamically adjusts question difficulty, visual complexity, and audio pacing based on student focus signals.",
    "context": "One-size-fits-all education leaves neurodivergent and struggling students behind. Adaptive pacing creates engaging learning environments for all cognitive types.",
    "deliverables": [
      "Adaptive quiz progression algorithm with dynamic hint revelation",
      "Interactive 3D physics / chemistry micro-lab simulators in browser",
      "Visual distraction filter and high-contrast dyslexia-friendly mode",
      "Teacher analytics view showing concept mastery and struggle points"
    ],
    "techStack": [
      "React",
      "Three.js / Canvas API",
      "Node.js",
      "Web Speech API"
    ],
    "evaluation": [
      "Adaptive algorithm effectiveness (30%)",
      "Interactive simulator design (30%)",
      "Accessibility standards compliance (25%)",
      "Teacher report utility (15%)"
    ]
  },
  {
    "id": "PS-ED-02",
    "title": "AI Peer Code Reviewer & Automated Plagiarism Disassembler for Universities",
    "track": "Smart Education",
    "category": "Software",
    "difficulty": "Advanced",
    "summary": "Create an automated code assignment evaluator that provides semantic line-by-line feedback, detects structural AST-level code cloning, and generates unit test harnesses.",
    "context": "University professors struggle to grade hundreds of coding submissions manually. An intelligent grading engine provides instant constructive pedagogical feedback.",
    "deliverables": [
      "AST-based code similarity analyzer immune to variable renaming or code reordering",
      "Automated sandboxed test runner executing student code with timeout guards",
      "AI code reviewer generating hints without revealing direct answers",
      "Classroom leaderboard and progress tracking portal"
    ],
    "techStack": [
      "Python AST",
      "Docker Container Sandbox",
      "FastAPI",
      "React UI"
    ],
    "evaluation": [
      "Anti-plagiarism obfuscation resilience (35%)",
      "Sandbox execution security (30%)",
      "Pedagogical feedback quality (20%)",
      "UI/UX (15%)"
    ]
  },
  {
    "id": "PS-MO-01",
    "title": "EV Fleet Battery Telemetry & Dynamic Smart Charging Grid Allocator",
    "track": "Smart Mobility",
    "category": "Dual Track",
    "difficulty": "Advanced",
    "summary": "Architect an intelligent EV fleet management system that forecasts battery thermal degradation and schedules charging slots based on real-time grid tariff fluctuations.",
    "context": "Uncoordinated EV charging overloads local transformers. Intelligent grid-aware charging balances power demand while minimizing charging costs for commercial fleets.",
    "deliverables": [
      "OBD-II / CAN-Bus telemetry ingestion simulator (SoC, Temperature, Voltage)",
      "Battery Remaining Useful Life (RUL) predictive regression model",
      "Linear programming optimizer for low-tariff charging schedule allocation",
      "Live vehicle map with geofencing and emergency battery reserve alerts"
    ],
    "techStack": [
      "Python SciPy / PuLP",
      "Node.js WebSockets",
      "Mapbox GL",
      "React + Tailwind"
    ],
    "evaluation": [
      "Charging cost optimization efficiency (35%)",
      "Battery RUL estimation accuracy (25%)",
      "Fleet live map responsiveness (25%)",
      "System architecture (15%)"
    ]
  },
  {
    "id": "PS-MO-02",
    "title": "Dynamic Real-Time Urban Traffic Light Controller via Edge Camera Counts",
    "track": "Smart Mobility",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Develop an automated traffic signal controller that calculates vehicle queue density at intersections from camera feeds and dynamically adjusts green-light duration.",
    "context": "Fixed-timer traffic lights waste millions of hours in gridlock. Adaptive signal timing based on real-time vehicle queues slashes congestion and vehicle idling emissions.",
    "deliverables": [
      "Vehicle queue counting simulation using mock intersection camera feeds",
      "Adaptive Webster green-split signal timing algorithm",
      "Emergency vehicle priority override with beacon detection",
      "City-wide traffic flow synchronization visualization dashboard"
    ],
    "techStack": [
      "OpenCV / YOLO",
      "Python / Node.js",
      "HTML5 Canvas Traffic Sim",
      "React"
    ],
    "evaluation": [
      "Congestion reduction percentage in sim (35%)",
      "Emergency vehicle override latency (25%)",
      "Intersection simulator fidelity (25%)",
      "Dashboard metrics (15%)"
    ]
  },
  {
    "id": "PS-AT-01",
    "title": "Autonomous Industrial Warehouse Obstacle Navigation & Pallet Rover",
    "track": "Smart Automation",
    "category": "Hardware",
    "difficulty": "Grand Challenge",
    "summary": "Build a microcontroller-powered autonomous rover capable of following dynamic warehouse path markers, avoiding obstacles with ultrasonic/LiDAR sensors, and docking safely.",
    "context": "Modern fulfillment centers require automated guided vehicles (AGVs) that can safely navigate around workers and dynamic obstacles without fixed track infrastructure.",
    "deliverables": [
      "4-wheel rover chassis with motor driver (L298N/TB6612) and sensor array",
      "Obstacle avoidance and line-following PID control algorithm",
      "Central warehouse dispatch dashboard sending target waypoint missions",
      "Emergency stop fail-safe and battery status telemetry"
    ],
    "techStack": [
      "Arduino / Raspberry Pi",
      "Ultrasonic / IR Sensor Array",
      "Node.js WebSocket Server",
      "React Web Telemetry"
    ],
    "evaluation": [
      "Navigation accuracy & PID stability (35%)",
      "Obstacle stop reliability (30%)",
      "Dispatch UI command response (20%)",
      "Hardware build quality (15%)"
    ]
  },
  {
    "id": "PS-AT-02",
    "title": "Commercial Building HVAC & Lighting Micro-Grid Energy Optimizer",
    "track": "Smart Automation",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Design an automated building management system that models occupancy patterns and ambient sunlight to automate lighting and climate zones for 30%+ energy savings.",
    "context": "Commercial buildings waste vast amounts of energy cooling empty conference rooms. Automated zone sensing reduces carbon footprints and operational costs.",
    "deliverables": [
      "Multi-zone building occupancy and temperature simulation engine",
      "Rule-based & ML predictive cooling/heating scheduler",
      "Solar irradiance daylight harvesting algorithm for automatic dimming",
      "Interactive 2.5D building floorplan energy heatmap view"
    ],
    "techStack": [
      "Python / FastAPI",
      "React Three Fiber / SVG Floorplan",
      "SQLite / TimescaleDB",
      "Tailwind CSS"
    ],
    "evaluation": [
      "Energy savings calculation model (35%)",
      "Interactive floorplan UI (30%)",
      "Zone control response time (20%)",
      "Data logging capability (15%)"
    ]
  },
  {
    "id": "PS-FT-01",
    "title": "Real-Time Anti-Money Laundering (AML) Graph Neural Network Sentinel",
    "track": "FinTech",
    "category": "Software",
    "difficulty": "Advanced",
    "summary": "Build a graph analytics engine that constructs multi-hop transaction networks, detects smurfing/layering rings, and computes fraud probability scores in real time.",
    "context": "Financial criminals disperse illicit funds across thousands of shell accounts in rapid succession. Graph network algorithms identify circular wash-trading patterns instantly.",
    "deliverables": [
      "Graph database schema for high-throughput transaction mapping",
      "Circular transaction and layering cycle detection algorithm",
      "Interactive graph network visualizer with node drill-down and risk badges",
      "Regulatory Suspicious Activity Report (SAR) one-click PDF exporter"
    ],
    "techStack": [
      "Neo4j / NetworkX",
      "Python / FastAPI",
      "React D3 / Cytoscape.js",
      "Tailwind CSS"
    ],
    "evaluation": [
      "Cycle detection algorithm precision (35%)",
      "Graph visualization responsiveness (25%)",
      "SAR Report export completeness (25%)",
      "API latency under load (15%)"
    ]
  },
  {
    "id": "PS-FT-02",
    "title": "Offline-Capable Secure Micro-Payments Protocol with Cryptographic Vouchers",
    "track": "FinTech",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Develop a secure peer-to-peer offline transaction protocol utilizing digitally signed cryptovouchers and double-spend proof verification upon network reconnection.",
    "context": "Disaster zones and rural areas with zero internet connectivity cannot use UPI or card payments. Offline cryptographic vouchers enable commerce without live cell towers.",
    "deliverables": [
      "Offline voucher generation with asymmetric digital signatures (RSA/Ed25519)",
      "P2P BLE / QR code exchange interface between buyer and merchant",
      "Reconnection reconciliation engine with double-spend detection and dispute resolution",
      "Merchant audit ledger and settlement dashboard"
    ],
    "techStack": [
      "JavaScript Web Crypto API",
      "Node.js / IndexedDB",
      "React Progressive Web App (PWA)",
      "Tailwind CSS"
    ],
    "evaluation": [
      "Double-spending prevention mechanism (40%)",
      "Offline PWA experience (25%)",
      "Reconciliation speed (20%)",
      "Security audit score (15%)"
    ]
  },
  {
    "id": "PS-SU-01",
    "title": "Scope 3 Supply Chain Carbon Emissions Tracker & Supplier ESG Scorecard",
    "track": "Sustainability",
    "category": "Software",
    "difficulty": "Intermediate",
    "summary": "Design an enterprise carbon accounting tool that ingests supplier invoices and logistics manifests to estimate Scope 1, 2, and 3 GHG emissions and suggest carbon offsets.",
    "context": "Over 70% of an enterprise's carbon footprint lies in Scope 3 indirect supply chain emissions. Transparent tracking helps enterprises achieve carbon neutrality milestones.",
    "deliverables": [
      "Automated invoice and freight manifest emission factor calculator (GHG Protocol)",
      "Supplier ESG compliance scorecard and carbon reduction target tracker",
      "Verified carbon offset marketplace integration simulation",
      "Audit-ready ESG disclosure PDF generator matching GRI standards"
    ],
    "techStack": [
      "Node.js / Python",
      "MongoDB / PostgreSQL",
      "Chart.js / ApexCharts",
      "React + Tailwind"
    ],
    "evaluation": [
      "Emission factor calculation accuracy (35%)",
      "Supplier benchmarking dashboard (25%)",
      "Report generation quality (25%)",
      "Platform usability (15%)"
    ]
  },
  {
    "id": "PS-SU-02",
    "title": "Smart Urban Solar-Powered Waste Bin Level Telemetry & Route Optimizer",
    "track": "Sustainability",
    "category": "Hardware",
    "difficulty": "Advanced",
    "summary": "Create an ultrasonic fill-level sensor node for city trash bins that transmits fill percentages via GSM/LoRa to dynamically calculate optimal municipal garbage truck routes.",
    "context": "Garbage trucks currently follow fixed routes, emptying half-empty bins while overflowing bins cause sanitation hazards. Dynamic routing cuts fuel waste by 40%.",
    "deliverables": [
      "Ultrasonic bin fill sensor with fire/odor detection sensors and solar charging",
      "Municipal routing dashboard with Travelling Salesperson Problem (TSP) optimization",
      "Live sanitation truck driver mobile web view with turn-by-turn waypoint routing",
      "Citizen waste reporting portal with geolocation tagging"
    ],
    "techStack": [
      "ESP32 / Arduino C++",
      "Ultrasonic HC-SR04 & MQ-135 Sensors",
      "Leaflet / OSRM Routing Engine",
      "React UI"
    ],
    "evaluation": [
      "Hardware sensor battery & weatherproofing design (30%)",
      "Route optimization distance reduction (30%)",
      "Driver map interface (25%)",
      "Citizen reporting flow (15%)"
    ]
  },
  {
    "id": "PS-DM-01",
    "title": "Emergency First-Responder Offline Mesh Communicator & SOS Beacon",
    "track": "Disaster Management",
    "category": "Hardware",
    "difficulty": "Grand Challenge",
    "summary": "Construct a handheld emergency mesh communication device that lets trapped civilians send SOS GPS beacons and text messages to rescue teams without internet or cellular networks.",
    "context": "During floods and earthquakes, cell towers collapse within hours. Self-healing LoRa mesh networks allow survivors to broadcast distress signals across kilometers.",
    "deliverables": [
      "Handheld ESP32 + LoRa radio device with OLED display and emergency SOS button",
      "Multi-hop mesh routing protocol forwarding packets between distant nodes",
      "Rescue command center map plotting survivor GPS coordinates and triage tags",
      "Civilian smartphone web app connecting to node via local WiFi AP"
    ],
    "techStack": [
      "ESP32 / LoRa SX1276",
      "C++ Meshtastic / RadioHead",
      "Leaflet GIS",
      "React Web App"
    ],
    "evaluation": [
      "Mesh multi-hop reliability under packet loss (40%)",
      "Hardware battery life & portable form-factor (25%)",
      "Rescue command map speed (20%)",
      "Civilian interface simplicity (15%)"
    ]
  },
  {
    "id": "PS-DM-02",
    "title": "AI Satellite Flood Inundation Predictor & Safe Evacuation Route Engine",
    "track": "Disaster Management",
    "category": "Software",
    "difficulty": "Advanced",
    "summary": "Develop a geospatial simulation system that models river elevation data and precipitation forecasts to predict flood inundation zones and generate real-time safe evacuation paths.",
    "context": "Flash floods cut off standard evacuation highways. Predictive flood path mapping identifies which roads will submerge hours before water levels peak.",
    "deliverables": [
      "Digital Elevation Model (DEM) and rainfall runoff hydrological simulation",
      "Dynamic road submergence forecast map with 6-hour warning lead time",
      "A* / Dijkstra evacuation route planner avoiding submerged corridors",
      "Public emergency broadcast banner with shelter locations and helpline contacts"
    ],
    "techStack": [
      "Python GDAL / Shapely",
      "FastAPI",
      "Mapbox GL / Deck.gl",
      "React UI"
    ],
    "evaluation": [
      "Hydrological simulation accuracy (35%)",
      "Safe routing algorithm speed (30%)",
      "Public alert UI clarity (20%)",
      "Scalability (15%)"
    ]
  },
  {
    "id": "PS-OI-01",
    "title": "Next-Generation Multidisciplinary Breakthrough Challenge",
    "track": "Open Innovation",
    "category": "Dual Track",
    "difficulty": "Grand Challenge",
    "summary": "Propose and construct an ambitious prototype uniting hardware, software, AI, or distributed ledgers to solve a high-impact humanitarian or engineering problem of your choice.",
    "context": "The most disruptive innovations defy rigid boundaries. This open track welcomes radical inventions that blend mechanics, machine intelligence, and society-level scale.",
    "deliverables": [
      "Comprehensive problem statement definition and target audience impact analysis",
      "Working prototype demonstration (Hardware and/or Software implementation)",
      "Technical architecture diagram and scalability roadmap",
      "Live interactive pitch and jury Q&A demonstration"
    ],
    "techStack": [
      "Any Modern Tech Stack (React, Python, Node, Embedded C, Rust, Cloud, Robotics)"
    ],
    "evaluation": [
      "Originality & innovation degree (35%)",
      "Working prototype execution quality (30%)",
      "Real-world social/market impact (20%)",
      "Pitch clarity (15%)"
    ]
  },
  {
    "id": "PS-OI-02",
    "title": "Quantum Algorithm Simulator & Post-Quantum Cryptography Migration Tool",
    "track": "Open Innovation",
    "category": "Software",
    "difficulty": "Advanced",
    "summary": "Build a web-based quantum computing circuit simulator that demonstrates Shor's and Grover's algorithms while testing classical cryptographic key vulnerability against quantum threats.",
    "context": "The advent of quantum computing threatens legacy RSA and ECC encryption. A visual simulator and migration tool helps engineers transition to NIST-standardized PQC algorithms.",
    "deliverables": [
      "Interactive drag-and-drop quantum logic gate circuit builder (Hadamard, CNOT, Phase)",
      "Statevector and Bloch sphere 3D visualization of qubit superpositions",
      "Post-Quantum Cryptography (Kyber / Dilithium) performance benchmark sandbox",
      "Exportable migration readiness report for web servers"
    ],
    "techStack": [
      "JavaScript / WebAssembly",
      "Three.js (Bloch Sphere)",
      "React + Tailwind",
      "Rust / C++ WASM"
    ],
    "evaluation": [
      "Quantum circuit simulation fidelity (35%)",
      "Bloch sphere 3D visuals (25%)",
      "PQC benchmark utility (25%)",
      "Educational UX (15%)"
    ]
  }
];
