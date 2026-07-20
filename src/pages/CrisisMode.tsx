import React from 'react';

export function CrisisMode() {
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-rose-300">🚨 Crisis Mode</h1>
            <p className="text-sm text-slate-400">Auto-trigger: panic / crash / IBS flare / depersonalization</p>
          </div>
          <a className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-sm" href="/">
            ← Back to Pulse
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <section className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-4">
            <h2 className="font-semibold text-rose-200">Immediate actions</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-200">
              <li>Lie down flat. Release jaw, shoulders, stomach.</li>
              <li>Sip room-temperature water. Not cold.</li>
              <li>Use 5-4-3-2-1 grounding first. Then breathing if needed.</li>
              <li>Sugar-free electrolytes only.</li>
              <li>No phone alerts. No blue light.</li>
              <li>Do not search symptoms.</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="px-3 py-1.5 rounded bg-rose-600 text-white text-sm"
                onClick={() => speak('I am safe. This will pass. I have survived 100 percent of my worst days.')}
              >
                🔊 Calm voice
              </button>
              <button
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-sm"
                onClick={() => {
                  const tasks = [
                    'Look around and name 5 things you can see.',
                    'Touch 4 different textures nearby.',
                    'Listen for 3 distinct sounds.',
                    'Notice 2 smells.',
                    'Take 1 slow sip of water.',
                  ];
                  tasks.forEach((t, i) =>
                    setTimeout(() => speak(t), (i + 1) * 8000)
                  );
                }}
              >
                🧠 Start guided grounding
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="font-semibold text-emerald-200">Grounding</h2>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-200">
              <div><span className="font-semibold">5</span> — see</div>
              <div><span className="font-semibold">4</span> — touch</div>
              <div><span className="font-semibold">3</span> — hear</div>
              <div><span className="font-semibold">2</span> — smell</div>
              <div><span className="font-semibold">1</span> — taste</div>
            </div>
            <p className="mt-2 text-xs text-slate-400">If still spiraling: cold splash, hold ice cube, name 60 blue things, or progressive countdown.</p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="font-semibold">Meds reference</h2>
            <p className="mt-1 text-xs text-slate-400">No dose changes without psych. Abrupt stops risk withdrawal.</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              <li>Clonazepam 0.25 — 1-0-2; acute spike</li>
              <li>Vortioxetine 20 — night</li>
              <li>Carbamazepine 200 — 1-0-1</li>
              <li>Etizolam 0.25 — evening</li>
              <li>Ramosetron 5 mcg — SOS for IBS</li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="font-semibold">Low-energy wins</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-200">
              <li>1 sip of water</li>
              <li>Open curtain or window</li>
              <li>Text Hema “still here”</li>
              <li>Sit up for 60 seconds</li>
              <li>Whisper anchor phrase once</li>
              <li>Listen to one safe song</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-emerald-300 text-center">
              “I have survived 100% of my worst days.”
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
