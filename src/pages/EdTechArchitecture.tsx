import React from 'react';

const EdTechArchitecture: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">EdTech Platform Architecture</h1>
      <div className="bg-slate-800 rounded-lg p-6">
        <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          {/* Definitions for arrow markers */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,8 L10,4 z" fill="#666"/>
            </marker>
          </defs>

          {/* Frontend */}
          <g id="frontend">
            <rect x="50" y="50" width="200" height="120" rx="8" ry="8" fill="#e3f2fd" stroke="#90caf9" strokeWidth="2"/>
            <text x="150" y="90" textAnchor="middle" fontSize="14" fill="#333">Frontend<br/>(React SPA)</text>
          </g>

          {/* API Gateway */}
          <g id="apigw">
            <rect x="300" y="50" width="180" height="100" rx="8" ry="8" fill="#bbdefb" stroke="#64b5f6" strokeWidth="2"/>
            <text x="390" y="100" textAnchor="middle" fontSize="14" fill="#333">API Gateway</text>
          </g>

          {/* Auth Service */}
          <g id="auth">
            <rect x="520" y="50" width="180" height="100" rx="8" ry="8" fill="#bbdefb" stroke="#64b5f6" strokeWidth="2"/>
            <text x="610" y="100" textAnchor="middle" fontSize="14" fill="#333">Auth Service</text>
          </g>

          {/* Core Services */}
          <g id="services">
            <rect x="300" y="200" width="400" height="180" rx="8" ry="8" fill="#c8e6c9" stroke="#a5d6a7" strokeWidth="2"/>
            <text x="500" y="210" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">Core Services</text>
            <rect x="320" y="240" width="160" height="60" rx="4" ry="4" fill="#fff" stroke="#90a4ae" strokeWidth="1"/>
            <text x="400" y="275" textAnchor="middle" fontSize="13" fill="#333">Content Service</text>
            <rect x="520" y="240" width="160" height="60" rx="4" ry="4" fill="#fff" stroke="#90a4ae" strokeWidth="1"/>
            <text x="600" y="275" textAnchor="middle" fontSize="13" fill="#333">User Service</text>
            <rect x="420" y="320" width="160" height="60" rx="4" ry="4" fill="#fff" stroke="#90a4ae" strokeWidth="1"/>
            <text x="500" y="355" textAnchor="middle" fontSize="13" fill="#333">Assessment Service</text>
          </g>

          {/* Data Layer */}
          <g id="data">
            <rect x="750" y="50" width="180" height="100" rx="8" ry="8" fill="#fff3e0" stroke="#ffb74d" strokeWidth="2"/>
            <text x="840" y="100" textAnchor="middle" fontSize="14" fill="#333">PostgreSQL</text>
            <rect x="960" y="50" width="180" height="100" rx="8" ry="8" fill="#fff3e0" stroke="#ffb74d" strokeWidth="2"/>
            <text x="1050" y="100" textAnchor="middle" fontSize="14" fill="#333">Redis</text>
            <rect x="855" y="180" width="180" height="100" rx="8" ry="8" fill="#fff3e0" stroke="#ffb74d" strokeWidth="2"/>
            <text x="945" y="225" textAnchor="middle" fontSize="14" fill="#333">ElasticSearch</text>
          </g>

          {/* ML & Analytics */}
          <g id="ml">
            <rect x="750" y="320" width="200" height="100" rx="8" ry="8" fill="#f3e5f5" stroke="#ce93d8" strokeWidth="2"/>
            <text x="850" y="370" textAnchor="middle" fontSize="14" fill="#333">Recommendation Engine</text>
            <rect x="980" y="320" width="160" height="100" rx="8" ry="8" fill="#f3e5f5" stroke="#ce93d8" strokeWidth="2"/>
            <text x="1060" y="370" textAnchor="middle" fontSize="14" fill="#333">Analytics Pipeline</text>
          </g>

          {/* Content Storage */}
          <g id="storage">
            <rect x="50" y="300" width="200" height="120" rx="8" ry="8" fill="#ffe0b2" stroke="#ffb74d" strokeWidth="2"/>
            <text x="150" y="360" textAnchor="middle" fontSize="14" fill="#333">Object Storage<br/>(Videos, PDFs)</text>
          </g>

          {/* DevOps & Infra */}
          <g id="infra">
            <rect x="300" y="420" width="400" height="180" rx="8" ry="8" fill="#e8eaf6" stroke="#c5cae9" strokeWidth="2"/>
            <text x="500" y="430" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">DevOps & Infrastructure</text>
            <rect x="320" y="460" width="120" height="60" rx="4" ry="4" fill="#fff" stroke="#90a4ae" strokeWidth="1"/>
            <text x="380" y="495" textAnchor="middle" fontSize="13" fill="#333">CI/CD</text>
            <rect x="480" y="460" width="120" height="60" rx="4" ry="4" fill="#fff" stroke="#90a4ae" strokeWidth="1"/>
            <text x="540" y="495" textAnchor="middle" fontSize="13" fill="#333">Monitoring</text>
            <rect x="640" y="460" width="120" height="60" rx="4" ry="4" fill="#fff" stroke="#90a4ae" strokeWidth="1"/>
            <text x="700" y="495" textAnchor="middle" fontSize="13" fill="#333">Logging</text>
          </g>

          {/* External Integrations */}
          <g id="external">
            <rect x="750" y="460" width="180" height="100" rx="8" ry="8" fill="#ffe0b2" stroke="#ffb74d" strokeWidth="2"/>
            <text x="840" y="510" textAnchor="middle" fontSize="14" fill="#333">LMS Integration</text>
            <rect x="960" y="460" width="180" height="100" rx="8" ry="8" fill="#ffe0b2" stroke="#ffb74d" strokeWidth="2"/>
            <text x="1050" y="510" textAnchor="middle" fontSize="14" fill="#333">Payment Gateway</text>
          </g>

          {/* Connections */}
          {/* Frontend to API Gateway */}
          <line x1="250" y1="110" x2="300" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* API Gateway to Auth */}
          <line x1="390" y1="100" x2="520" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* API Gateway to Core Services */}
          <line x1="390" y1="150" x2="300" y2="210" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* Auth to Core Services */}
          <line x1="610" y1="100" x2="500" y2="210" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* Core Services to Data */}
          <line x1="500" y1="300" x2="840" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          <line x1="500" y1="300" x2="1050" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          <line x1="500" y1="300" x2="945" y2="230" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* Core Services to ML */}
          <line x1="500" y1="380" x2="850" y2="370" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          <line x1="500" y1="380" x2="1060" y2="370" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* Core Services to Storage */}
          <line x1="300" y1="290" x2="150" y2="360" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* Core Services to Infra */}
          <line x1="500" y1="380" x2="500" y2="460" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          {/* Infra to External */}
          <line x1="700" y1="520" x2="840" y2="510" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
          <line x1="700" y1="520" x2="1050" y2="510" stroke="#666" strokeWidth="2" markerEnd="url(#arrow)"/>
        </svg>
      </div>
      <p className="mt-4 text-sm text-slate-400">
        This diagram shows the high-level architecture of the EdTech platform, highlighting the separation of concerns between frontend, backend services, data storage, machine learning components, and DevOps infrastructure.
      </p>
    </div>
  );
};

export default EdTechArchitecture;