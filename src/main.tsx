/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.css';

// Custom easing function for natural count-up acceleration/deceleration
function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Animated count-up function that counts from zero to a target number over a duration.
 * @param elementId The HTML ID of the element to update
 * @param targetValue The end target score
 * @param duration Duration in milliseconds (approx 2000ms as requested)
 */
function animateCounter(elementId: string, targetValue: number, duration: number = 2000) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startValue = 0;
  let startTime: number | null = null;

  function updateCount(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth progress with Ease Out Quad
    const easeProgress = easeOutQuad(progress);
    const currentValue = Math.floor(startValue + easeProgress * (targetValue - startValue));
    
    element.textContent = currentValue.toString();

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = targetValue.toString(); // Ensure exact alignment on final frame
    }
  }

  requestAnimationFrame(updateCount);
}

// Initialize operational DOM routines safely on window paint
function initHandlers() {
  // 1. Initialise the Stat Counters in the Hero over 2 seconds
  setTimeout(() => {
    animateCounter('counter-cuts', 43, 2000);
    animateCounter('counter-outages', 577, 2100);
    animateCounter('counter-services', 6, 1800);
  }, 300);

  // 2. Navigation bar styling transitions on scroll
  const navbar = document.getElementById('navbar');
  const updateNavbarState = () => {
    if (window.scrollY >= 80) {
      // Solid dark navy layout with fine bottom border and high blur backdrop
      navbar?.classList.add('bg-[#090D16]/95', 'backdrop-blur-md', 'shadow-xl', 'border-b', 'border-white/5', 'py-3');
      navbar?.classList.remove('bg-transparent', 'py-4');
    } else {
      // Return to transparent top spacious navigation
      navbar?.classList.remove('bg-[#090D16]/95', 'backdrop-blur-md', 'shadow-xl', 'border-b', 'border-white/5', 'py-3');
      navbar?.classList.add('bg-transparent', 'py-4');
    }
  };
  
  // Evaluate immediately on initialization
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  // 3. Scroll reveals utilizing high-performing Intersection Observer API
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stop tracking once revealed to save browser computing resources
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport window
    threshold: 0.12, // element must be 12% visible before triggering animation
    rootMargin: '0px 0px -40px 0px' // safety bottom offset
  });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

// Interactive SOW Tab Switcher
function switchSowSection(sectionId: string) {
  // Hide all sections
  const sections = document.querySelectorAll('.sow-content');
  sections.forEach((sec) => {
    sec.classList.add('hidden');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // Swap active button state
  const buttons = document.querySelectorAll('.sow-tab-btn');
  buttons.forEach((btn) => {
    btn.classList.remove('active');
  });

  const activeBtn = document.getElementById(`btn-${sectionId}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

/// Full Statement of Work Markdown Downloader
function downloadSowDocument() {
  const markdownText = `# STATEMENT OF WORK (SOW)
## Cloud-Driven Infrastructure Resilience and Security for Airtel Nigeria

### SOW-01: Executive Summary / Charter
- **Project Title**: Cloud-Driven Infrastructure Resilience and Security for Airtel Nigeria
- **Lead Architect**: Abdus-somad Olanrewaju Gbadamosi (Airtel Africa Tech Fellow)
- **Sponsors**: AWS Student Builder Group & Airtel Africa Foundation
- **Target Operations**: Remote Base Transceiver Stations (BTS) Region Lagos, Southwest Nigeria
- **Status**: Final Capstone Spec Release • Q2 2026

**Executive Summary:**
Airtel Nigeria, the country's second-largest MNO with over 57 million subscribers, faces severe infrastructure issues. Fibre cables carrying network signals are cut at an average rate of 43 incidents daily. Generator batteries and fuel are routinely stolen from remote sites. Each of these events causes network outages. Under the current reactive operations model, Airtel only discovers faults after subscribers lose service and complain.

This platform does not prevent vandalism. Its purpose is to ensure Airtel discovers physical outages in seconds instead of hours, shortening the gap between physical damage and network restoration to under two minutes via AWS IoT, CloudWatch, serverless Lambda handlers, DynamoDB records, and SNS SMS notifications.

---

### SOW-02: Company Background
#### 2.1 About Airtel Africa Plc
Airtel Africa Plc is one of the largest telecommunications companies on the African continent, operating across 14 countries. Its subsidiary, Airtel Nigeria, serves over 57 million subscribers across all 36 states and the FCT.

#### 2.2 The Nigerian Telecommunications Sector
The NCC reports over 145,000 active base stations. The digital economy contributes ~18% of Nigeria's GDP. President Bola Ahmed Tinubu signed the Critical National Information Infrastructure (CNII) Order on June 24, 2024, designating telecom assets as Critical National Infrastructure and making damage to them a serious criminal offence.

#### 2.3 Airtel Nigeria's Competitive Position
In the Nigerian market, Airtel competes directly with MTN Nigeria. Since subscribers possess mobile number portability, network reliability is a critical retention metric.

---

### SOW-03: Ground Research Findings
All metrics cited in this SOW are derived from public media releases, ALTON statements, and reports in BusinessDay NG, Legit.ng, France24, and Blueprint Newspapers:
- **Daily fibre cuts**: Averaging 43 cuts across Airtel's Nigerian routes (BusinessDay NG, April 2025).
- **Annual cost of repairs**: Over $23 million spent on physical infrastructure cable adjustments (France24 / AFP, August 2025).
- **Site outages**: 577 national telecom incidents logged during Q1 2026 (Blueprint Newspapers, May 2026).
- **Auxiliary theft loss**: N2.3 billion in diesel generator hardware and batteries stolen across Nigeria in 2025 (Blueprint Newspapers, May 2026).

---

### SOW-04: Problem Statement
The central problem is not vandalism itself, but the lack of real-time site visibility—specifically, the "Detection Gap". Currently, base station outages are detected post-facto via subscriber complaints. This passive approach keeps sites offline for 8 to 24 hours.

#### Three Core Dimensions:
1. **Fibre cuts at remote sites**: Breaks knock thousands of subscribers offline instantly.
2. **Power equipment theft**: Leaves base stations dependent on an unreliable grid; power failures go undetected until backup batteries run dry.
3. **No real-time visibility**: Staff have no tools to detect fiber signal losses or battery discharges before a total blackout occurs.

---

### SOW-05: Business Impact
- **Revenue Theft**: Outage hours directly prevent data/call voucher transactions. Lagos operators lost an estimated N5 billion in 2024 due to infrastructure damage.
- **Regulatory Penalties**: In October 2025, Airtel was fined N45 million for QoS service violations alongside other telecom carriers.
- **Subscriber Churn**: Frequent outages drive high attrition rates via mobile number portability.

---

### SOW-06: Proposed AWS Solution
An edge-monitoring platform aligned with the AWS Well-Architected Framework:
1. **AWS IoT Core**: Receives health metrics (loops, battery voltages, fuel) via out-of-band cellular connections independent of the monitored fibre path.
2. **Amazon CloudWatch**: Evaluates telemetry streams and raises metric warning alarms on threshold breaches.
3. **AWS Lambda**: Executes serverless classification code when triggered by Alarms.
4. **Amazon DynamoDB**: Serves as a low-latency NoSQL registry for sites and incident history logs.
5. **Amazon SNS**: Sends SMS and push alerts automatically to regional technician field crews.

---

### SOW-07: Architecture Overview
#### Full Event-Driven Pipeline:
- **Step 1 (Anomaly)**: Physical fibre cut or auxiliary battery disconnect occurs.
- **Step 2 (Ingress)**: Edge microcontroller packages telemetry and publishes to AWS IoT Core via MQTT topic \`airtel/telemetry/nga-bts-404\`.
- **Step 3 (Metric Evaluation)**: CloudWatch processes incoming records and transitions to ALARM state.
- **Step 4 (Remediation)**: AWS Lambda launches serverless functions, pulls station details from registry, and maps dependencies.
- **Step 5 (Log Storage)**: Writes incident history into DynamoDB \`AirtelIncidentStore\` master ledger.
- **Step 6 (Alert Dispatch)**: Amazon SNS fires automated SMS alerts to field technicians with maps and system coordinates in seconds.

---

### SOW-08: Implementation Approach
A 4-phase schedule designed for minimum operational fallout:
- **Phase 1: Foundation (Months 1-2)**: IAM security structures, DynamoDB schema setups, CloudWatch initial alarms.
- **Phase 2: Pilot Deployment (Months 3-4)**: Rollout across 50 high-theft base stations in Lagos Mainland West (Alimosho, Mainland) to align alarm profiles.
- **Phase 3: Refinement (Months 5-6)**: Fine-tune alarm configurations, remove false alarms, optimize Lambda execution.
- **Phase 4: National Scale (Month 7+)**: Gradual expansion based on incident frequency mappings.

---

### SOW-09: Security Considerations
- **IAM Policies**: Fine-grained, least-privilege IAM credentials limit container and execution boundaries.
- **Amazon Cognito**: Web-based operator dashboards require Cognito authentication with mandatory MFA.
- **Data Protection**: AES-256 encryption at rest in DynamoDB; TLS 1.3 encryption in-transit.
- **NDPR Compliance**: Meets Nigeria Data Protection Regulation standards for carrier operational storage.

---

### SOW-10: Reliability and Scalability
- **Multi-Incident Parallelism**: Parallel AWS Lambda functions isolate and handle multiple concurrent outages without starvation.
- **Global Durability**: Amazon DynamoDB replicates transaction records across multi-region physical environments with Point-in-Time Recovery.
- **Uptime SLAs**: Underpinning serverless services maintain a 99.9% uptime baseline.

---

### SOW-11: Cost Considerations
Calculated consumption costs using the AWS Billing Calculator for 50,000 active base stations:
- AWS IoT Core (Inbound telemetry): $3,456.00 / mo
- Amazon CloudWatch (Monitoring & Log Storage): $450.00 / mo
- AWS Lambda (Remediation logic runs): $200.00 / mo
- Amazon DynamoDB (NoSQL Transactions): $180.00 / mo
- Amazon SNS (SMS dispatch blocks): $300.00 / mo
- Amazon Cognito (Operator tokens): $50.00 / mo
- **TOTAL OPERATING OVERHEAD**: **$4,636.00 / month**

*Cost justification*: A single regulatory fine exceeds N45 million ($30,000+ USD). Resolving a single major outage pays for months of AWS serverless operations.

---

### SOW-12: Expected Benefits
- **Operational**: Slashes fault detection times from several hours to under 2 minutes. Eliminates diagnostic delays.
- **Financial**: Mitigates costly hardware deterioration, saves revenue streams, and avoids NCC fines.
- **Governance**: CloudTrail audit trails support regulatory SLA compliance reviews.

---

### SOW-13: Limitations & Assumptions
- **Limitations**: Detects and alerts on anomalies but cannot physically prevent vandalism. Requires out-of-band cellular signal availability.
- **Assumptions**: Out-of-band cellular microcontroller modems are available. Crews carry SMS-enabled mobile devices.

---

### SOW-14: Project Conclusion
The Nigerian digital economy demands highly resilient infrastructure. In a network that registers over 43 daily fiber cuts, response times are a critical survival factor. By establishing an automated AWS alarm pipeline, Airtel Nigeria can turn a reactive model into a proactive serverless system, restoring services before subscribers file complains.

*"Designed around real operational parameters using six AWS services to secure digital pathways for over 57 million connected citizens."*

---

### SOW-15: References
1. Airtel Africa Plc. Annual Report and Accounts 2023/2024.
2. BusinessDay NG. "Subscribers hit as telco towers turn targets for vandals." April 1, 2025.
3. Business AM Live. "Nigeria's digital backbone faces early-year shock from rising fibre damage." February 23, 2026.
4. Blueprint Newspapers. "How surge in attacks on telecoms infrastructure slows digital economy growth." May 2026.
5. France24 / AFP. "Vandalism hobbles Nigeria's mobile telephone services." August 29, 2025.
6. Legit.ng. "Network Disrupts Calls, Data, Subscribers Call on MTN, Airtel." June 4, 2025.
7. Nigerian Communications Commission (NCC). Quality of Service Regulations 2024.
`;

  const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Airtel-Resilience-SOW-Abdussomad.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Active simulation state variables
let activeScenario: 'fiber' | 'fuel' = 'fiber';
let isSimulating = false;

// Scenario toggling function
function selectScenario(scenario: 'fiber' | 'fuel') {
  if (isSimulating) return; // Prevent toggling while a simulation is actively running
  activeScenario = scenario;

  const btnFiber = document.getElementById('scenario-btn-fiber');
  const btnFuel = document.getElementById('scenario-btn-fuel');

  if (scenario === 'fiber') {
    btnFiber?.classList.add('border-[#C8102E]/30', 'bg-[#C8102E]/5', 'active-scenario');
    btnFiber?.classList.remove('border-white/5', 'bg-[#141C2A]/40');
    
    btnFuel?.classList.remove('border-[#C8102E]/30', 'bg-[#C8102E]/5', 'active-scenario');
    btnFuel?.classList.add('border-white/5', 'bg-[#141C2A]/40');
  } else {
    btnFuel?.classList.add('border-[#C8102E]/30', 'bg-[#C8102E]/5', 'active-scenario');
    btnFuel?.classList.remove('border-white/5', 'bg-[#141C2A]/40');
    
    btnFiber?.classList.remove('border-[#C8102E]/30', 'bg-[#C8102E]/5', 'active-scenario');
    btnFiber?.classList.add('border-white/5', 'bg-[#141C2A]/40');
  }

  // Clear console to state expectation
  const consoleEl = document.getElementById('sim-console');
  if (consoleEl) {
    consoleEl.innerHTML = `<div class="text-gray-500 font-mono">&gt; Scenario changed to ${scenario === 'fiber' ? 'Fiber Line Sabotage' : 'Generator Fuel Theft'}. Click "Trigger Incident Fault" to start the simulation.</div>`;
  }
  
  const latencyEl = document.getElementById('sim-latency');
  if (latencyEl) {
    latencyEl.textContent = '--';
    latencyEl.className = 'text-white';
  }
}

// Sequential micro-logger pipeline simulation
function runIncidentSimulation() {
  if (isSimulating) return;
  isSimulating = true;

  const consoleEl = document.getElementById('sim-console');
  const triggerBtn = document.getElementById('trigger-sim-btn');
  const latencyEl = document.getElementById('sim-latency');
  const serviceNodes = document.querySelectorAll('.service-node');

  if (triggerBtn) {
    triggerBtn.setAttribute('disabled', 'true');
    triggerBtn.classList.add('opacity-50', 'cursor-not-allowed');
    triggerBtn.innerHTML = '<span>⏳</span> <span>Simulation Running...</span>';
  }

  if (consoleEl) {
    consoleEl.innerHTML = ''; // Reset console outputs
  }

  if (latencyEl) {
    latencyEl.textContent = 'EVALUATING...';
    latencyEl.className = 'text-yellow-500 animate-pulse';
  }

  // Clear previous glows from AWS cards
  serviceNodes.forEach((node) => {
    node.classList.remove('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
  });

  const appendLog = (text: string, type: 'info' | 'warn' | 'success' | 'payload' = 'info') => {
    if (!consoleEl) return;
    const logDiv = document.createElement('div');
    const timestamp = new Date().toISOString().split('T')[1].replace('Z', '');
    
    let colorClass = 'text-gray-400';
    if (type === 'warn') colorClass = 'text-red-400';
    if (type === 'success') colorClass = 'text-green-400 font-bold';
    if (type === 'payload') colorClass = 'text-blue-400 font-mono text-[10px] bg-[#111823] p-2.5 rounded-lg border border-white/5 my-1';

    logDiv.className = `${colorClass} font-mono animate-[fade-in_0.2s_ease-out]`;
    
    if (type === 'payload') {
      logDiv.innerHTML = text;
    } else {
      logDiv.textContent = `[${timestamp}] ${text}`;
    }
    
    consoleEl.appendChild(logDiv);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };

  // 1. Initial trigger fault (0ms)
  appendLog(`[STATION] Incident trigger initiated. Active Scenario: ${activeScenario === 'fiber' ? 'Terrestrial Fiber Breakage' : 'Auxiliary Fuel Tank Drain'}`, 'warn');
  
  // 2. Transmit packet Cellular backhaul via AWS IoT (600ms)
  setTimeout(() => {
    appendLog(`[EDGE] Edge MCU sensors deployed at Lagos Hub triggered. Packaging cellular message...`, 'info');
    
    // Highlight Card 1: AWS IoT Core
    if (serviceNodes[0]) {
      serviceNodes[0].classList.add('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
    }

    const payloadJSON = activeScenario === 'fiber' 
      ? `{\n  "station_id": "NGA-BTS-LXS-404",\n  "telemetry": {\n    "fiber_loop_continuity": 0,\n    "optical_db_loss": 99.9,\n    "backup_power": "battery_100",\n    "uplink_channel": "oob_cellular_active"\n  }\n}`
      : `{\n  "station_id": "NGA-BTS-LXS-404",\n  "telemetry": {\n    "diesel_reservoir_gallons": 14.2,\n    "drain_rate_gpm": 84.0,\n    "enclosure_contact_sensor": "OPEN_ALERT",\n    "uplink_channel": "oob_cellular_active"\n  }\n}`;
    
    appendLog(`MQTT Publish payload size: 142B → AWS IoT Core topic: <code>airtel/telemetry/nga-bts-404</code><br><pre class="whitespace-pre">${payloadJSON}</pre>`, 'payload');
  }, 600);

  // 3. CloudWatch alarm Raised (1400ms)
  setTimeout(() => {
    appendLog(`[CLOUDWATCH] IoT Topic rule triggered. Parsing input indicators. Threshold comparison initiated...`, 'info');
    
    if (serviceNodes[1]) {
      serviceNodes[1].classList.add('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
    }

    if (activeScenario === 'fiber') {
      appendLog(`[ALARM] Metric continuity (0.0) broken threshold (< 1.0) continuous readings of 1 period. State transitioning to ALARM!`, 'warn');
    } else {
      appendLog(`[ALARM] Drain Rate limit (84.0 gpm) exceeded threshold (> 5.0 gpm). Fuel tank tampering detected! State transitioning to ALARM!`, 'warn');
    }
  }, 1800);

  // 4. Serverless lambda launched to remediate (2800ms)
  setTimeout(() => {
    appendLog(`[LAMBDA] CloudWatch target rule fired. AWS Lambda concurrent function provisioned. Memory Allocated: 128MB.`, 'info');
    
    if (serviceNodes[2]) {
      serviceNodes[2].classList.add('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
    }

    appendLog(`[HANDLER] Fetching station address vectors, regional dispatch unit keys, and previous 24h metrics from DynamoDB...`, 'info');
  }, 2800);

  // 5. DynamoDB log write committed (3600ms)
  setTimeout(() => {
    appendLog(`[DYNAMODB] Accessing DynamoDB Master Ledger table 'AirtelIncidentStore' for write log action...`, 'info');
    
    if (serviceNodes[3]) {
      serviceNodes[3].classList.add('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
    }

    appendLog(`[LEDGER] Write Transaction successful! Inserted PartitionKey: NGA-BTS-LXS-404 | SortKey: ${new Date().getTime()}`, 'success');
  }, 3600);

  // 6. SNS Notification dispatches alerts (4400ms)
  setTimeout(() => {
    appendLog(`[SNS] Initiating Amazon SNS SMS/Email push routines to regional responder list groups...`, 'info');
    
    if (serviceNodes[4]) {
      serviceNodes[4].classList.add('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
    }

    const messageAlert = activeScenario === 'fiber' 
      ? `CRITICAL OUTAGE: Fiber Cut detected at Airtel Lagos BTS LXS-404. Location: https://maps.google.com/?q=6.5244,3.3792. Dispatch Code: OPT-RED-01.`
      : `CRITICAL SEC: Enclosure Door Intruders / Rapid Diesel Theft alert at BTS LXS-404. Level: RED danger. Security team alert dispatched: https://maps.google.com/?q=6.5244,3.3792.`;

    appendLog(`[SMS SCRIPT] SNS Short SMS dispatched successfully to 14 regional technicians:\n"${messageAlert}"`, 'success');
  }, 4400);

  // 7. Security IAM constraints audited (5200ms)
  setTimeout(() => {
    appendLog(`[COGNITO] Verifying access token. IAM Role check: lambda-remediator-execution checked.`, 'info');
    
    if (serviceNodes[5]) {
      serviceNodes[5].classList.add('ring-2', 'ring-[#FF9900]', 'scale-105', 'bg-[#1A2536]');
    }

    appendLog(`[INCIDENT STATUS] Event execution complete. MTTR recovery clock initialized. Uptime saved.`, 'success');

    // Final Statistics Success State
    if (triggerBtn) {
      triggerBtn.removeAttribute('disabled');
      triggerBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      triggerBtn.innerHTML = '<span>⚡</span> <span>Trigger Incident Fault</span>';
    }

    if (latencyEl) {
      latencyEl.textContent = '1.24 SECONDS';
      latencyEl.className = 'text-green-400 font-extrabold shadow-sm bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded';
    }

    isSimulating = false;
  }, 5200);
}

// Attach interactive callbacks directly to the global window scope
(window as any).switchSowSection = switchSowSection;
(window as any).downloadSowDocument = downloadSowDocument;
(window as any).selectScenario = selectScenario;
(window as any).runIncidentSimulation = runIncidentSimulation;

// Wire-up event listeners for both DOMContentLoaded and subsequent page checks
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHandlers);
} else {
  initHandlers();
}
