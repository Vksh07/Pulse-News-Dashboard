import React, { useState, useEffect } from 'react';

interface ContentItem {
  id: string;
  title: string;
  platform: 'LinkedIn' | 'X' | 'WordPress' | 'Research';
  status: 'Draft' | 'Staged' | 'Approved' | 'Live' | 'Pending Review';
  category: string;
  authorAgent: string;
  timestamp: string;
  deploySequence?: number;
}

interface PlatformStatus {
  name: string;
  status: '🟢 Active' | '🟡 Limited' | '🔴 Blocked' | '⚪ Unconfigured';
  note: string;
}

export function SocialPulse() {
  const [contentPipeline, setContentPipeline] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'AaS Creator-Ops Pack — LinkedIn Post 1 (Creator Pain)',
      platform: 'LinkedIn',
      status: 'Approved',
      category: 'AaS Launch',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 17:40',
      deploySequence: 1,
    },
    {
      id: '2',
      title: 'AaS Research Intel Pack — LinkedIn Post 2 (UPSC Angle)',
      platform: 'LinkedIn',
      status: 'Approved',
      category: 'AaS Launch',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 17:40',
      deploySequence: 2,
    },
    {
      id: '3',
      title: 'AaS AI Eval Pack — LinkedIn Post 3 (Enterprise)',
      platform: 'LinkedIn',
      status: 'Approved',
      category: 'AaS Launch',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 17:40',
      deploySequence: 3,
    },
    {
      id: '4',
      title: 'AaS Launch — X Thread (5-tweet sequence)',
      platform: 'X',
      status: 'Approved',
      category: 'AaS Launch',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 17:40',
      deploySequence: 4,
    },
    {
      id: '5',
      title: 'AaS Blog Teaser — WordPress (T+48h anchor)',
      platform: 'WordPress',
      status: 'Approved',
      category: 'AaS Launch',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 17:40',
      deploySequence: 5,
    },
    {
      id: '6',
      title: 'IT Rules 2026 Part 1 — Pre-Verdict (5 posts)',
      platform: 'LinkedIn',
      status: 'Staged',
      category: 'IT Rules Series',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 12:00',
      deploySequence: 6,
    },
    {
      id: '7',
      title: 'IT Rules 2026 Part 2 — Post-Verdict (5 posts)',
      platform: 'LinkedIn',
      status: 'Staged',
      category: 'IT Rules Series',
      authorAgent: 'SM-OC',
      timestamp: '2026-06-19 19:00',
      deploySequence: 7,
    },
    {
      id: '8',
      title: 'AaS Landing Page — Research-OC v0.1',
      platform: 'Research',
      status: 'Live',
      category: 'AaS Launch',
      authorAgent: 'Research-OC',
      timestamp: '2026-06-19 14:40',
    },
    {
      id: '9',
      title: 'MarketFin — Dashboard Deploy',
      platform: 'Research',
      status: 'Live',
      category: 'Dashboard',
      authorAgent: 'zFinance-OC',
      timestamp: '2026-06-19 19:15',
    },
    {
      id: '10',
      title: 'Health Pulse — Dashboard Deploy',
      platform: 'Research',
      status: 'Live',
      category: 'Dashboard',
      authorAgent: 'Health-OC',
      timestamp: '2026-06-19 19:00',
    },
    {
      id: '11',
      title: 'Psychology Optional — Dashboard Deploy',
      platform: 'Research',
      status: 'Live',
      category: 'Dashboard',
      authorAgent: 'Tutor-OC',
      timestamp: '2026-06-19 17:59',
    },
    {
      id: '12',
      title: 'CSAT Dashboard — Stage 1 Merge',
      platform: 'Research',
      status: 'Live',
      category: 'Dashboard',
      authorAgent: 'UPSC-OC',
      timestamp: '2026-06-19',
    },
    {
      id: '13',
      title: 'Research Intelligence — Dashboard Deploy',
      platform: 'Research',
      status: 'Live',
      category: 'Dashboard',
      authorAgent: 'Research-OC',
      timestamp: '2026-06-19 19:15',
    },
  ]);

  const [platforms, setPlatforms] = useState<PlatformStatus[]>([
    { name: 'LinkedIn', status: '🟢 Active', note: 'Primary authority channel. 10 IT Rules posts + 3 AaS posts staged.' },
    { name: 'X (Twitter)', status: '🟢 Active', note: 'Velocity channel. Configure your handle in settings.' },
    { name: 'WordPress', status: '🟢 Active', note: 'SEO anchor. Configure your blog URL in settings.' },
    { name: 'Telegram', status: '🔴 Blocked', note: 'Rate-limited or blocked. Cross-platform validation.' },
    { name: 'WhatsApp', status: '🟡 Limited', note: 'Rate-limited.' },
    { name: 'Instagram', status: '⚪ Unconfigured', note: 'Not yet set up. Configure handle in settings.' },
  ]);

  const statusColors: Record<string, string> = {
    'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Approved': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Staged': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Draft': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Pending Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const platformColors: Record<string, string> = {
    'LinkedIn': 'text-blue-400',
    'X': 'text-sky-400',
    'WordPress': 'text-gray-300',
    'Research': 'text-purple-400',
  };

  const [filter, setFilter] = useState<string>('All');

  const filteredContent = filter === 'All' ? contentPipeline : contentPipeline.filter(c => c.category === filter);

  const deployReady = contentPipeline.filter(c => c.status === 'Approved' || c.status === 'Staged').length;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Social Pulse 📱</h1>
          <p className="text-slate-400 mt-1">Fleet content pipeline & platform status</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{deployReady}</div>
          <div className="text-xs text-slate-500">Assets Deploy-Ready</div>
        </div>
      </div>

      {/* Platform Health Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {platforms.map(p => (
          <div key={p.name} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="text-sm font-semibold text-white">{p.name}</div>
            <div className="text-xs mt-1">{p.status}</div>
            <div className="text-[10px] text-slate-500 mt-1 leading-tight">{p.note}</div>
          </div>
        ))}
      </div>

      {/* Wave 1 Deploy Sequence */}
      <div className="bg-slate-800/40 border border-blue-500/20 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">🚀 Wave 1 — AaS Launch Sequence</h2>
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          <span className="text-green-400">🟢 Approved</span>
          <span>→</span>
          <span>LinkedIn (3 posts)</span>
          <span className="text-slate-600">→</span>
          <span>X (5-tweet thread)</span>
          <span className="text-slate-600">→</span>
          <span>WordPress (T+48h)</span>
        </div>
        <div className="text-xs text-slate-500">
          Tweaks pending: Post 2 tone optimization (aspirant pain-point framing) | Anti-capitalist ethos line in WP teaser | Crypto payment option in X Tweet 5
        </div>
      </div>

      {/* Content Pipeline */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">📋 Content Pipeline</h2>
          <div className="flex gap-2">
            {['All', 'AaS Launch', 'IT Rules Series', 'Dashboard'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 text-xs rounded ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredContent.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${platformColors[item.platform] || 'text-slate-400'}`}>
                    {item.platform}
                  </span>
                  <span className="text-sm text-white truncate">{item.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-500">{item.authorAgent}</span>
                  <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  {item.deploySequence && (
                    <span className="text-[10px] text-slate-600">#{item.deploySequence}</span>
                  )}
                </div>
              </div>
              <span className={`ml-3 px-2 py-0.5 text-[10px] font-medium rounded-full border ${statusColors[item.status] || 'bg-slate-700 text-slate-400'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">3</div>
          <div className="text-xs text-slate-400">LinkedIn Posts</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-sky-400">1</div>
          <div className="text-xs text-slate-400">X Threads</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">10</div>
          <div className="text-xs text-slate-400">IT Rules Posts</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">5</div>
          <div className="text-xs text-slate-400">Content Categories</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">📰 Breaking Social Signals</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-red-400">⚡</span>
            <span><b className="text-white">Delhi HC upholds Telegram ban</b> — Section 69A order valid, ban till Jun 22/re-exam security. Telegram expected to approach SC. Cross-platform strategy validated as permanent. [Source: India Today, The Hindu, 19-JUN'26]</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">⚡</span>
            <span><b className="text-white">Creator Economy Bill passes Rajya Sabha</b> — Creators formally recognised as professionals, mandatory registration above income threshold. Regulatory sandwich: legitimacy (carrot) + IT Rules (stick) + Telegram ban (deterrent). [Source: Multiple, Apr-Jun 2026]</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400">⚡</span>
            <span><b className="text-white">UK bans social media for under-16s</b> — Global age-gating wave. India IT Rules amendments likely to follow age verification mandates. [Source: Indian Express, 16-JUN'26]</span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-400">⚡</span>
            <span><b className="text-white">Social content authenticity shifted</b> — Audiences now prioritize utility/entertainment over provenance in AI-generated content. Design for shareability first. [Source: ModernComment, Jun 2026]</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-400">⚡</span>
            <span><b className="text-white">81% social managers spend more time creating than engaging</b> — Agent-driven content ops is the cost arbitrage vs $4,200/mo freelance benchmark. [Source: Social Media Examiner 2026]</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
