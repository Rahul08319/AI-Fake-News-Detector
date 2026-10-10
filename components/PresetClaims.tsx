import React from 'react';
import { type PresetClaim } from '../types';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface PresetClaimsProps {
  onSelectClaim: (text: string) => void;
  disabled?: boolean;
}

export const PRESET_CLAIMS: PresetClaim[] = [
  {
    id: 'claim-1',
    title: 'Bioluminescent Amazonian Battery Fungi',
    category: 'Viral Rumors',
    sampleText: 'BREAKING: Scientists in the Amazon rainforest discover a new species of glowing mushrooms ("Lumina electra") capable of generating a steady electrical current that charges a smartphone in under 45 minutes! Tech giants are rushing to patent these organic living batteries before governments ban personal harvesting!',
    sourceLabel: 'Viral Social Media Thread',
    year: 2026,
  },
  {
    id: 'claim-2',
    title: 'James Webb Telescope Biosignature Detection',
    category: 'Health & Science',
    sampleText: 'Astronomers analyzing spectroscopy data from the James Webb Space Telescope (JWST) have published peer-reviewed findings in Nature Astronomy identifying carbon-bearing molecules, including methane and carbon dioxide, in the atmosphere of habitable-zone sub-Neptune exoplanet K2-18b, with an estimated confidence interval of 99.7%.',
    sourceLabel: 'Nature Astronomy / NASA Press',
    year: 2025,
  },
  {
    id: 'claim-3',
    title: 'Microwave Radiation DNA Reversal Cure',
    category: 'Health & Science',
    sampleText: 'URGENT HEALTH ALERT: Pharmaceutical cartels are concealing a revolutionary German sonic frequency therapy that instantly dissolves cancer cells and repairs degraded DNA using targeted 432Hz microwave pulses in 48 hours without surgery or chemotherapy. Watch before Big Pharma takes this down!',
    sourceLabel: 'Alternative Health Blog',
    year: 2026,
  },
  {
    id: 'claim-4',
    title: 'Global Renewable Energy Accord Milestone',
    category: 'World & Politics',
    sampleText: 'According to a verified multilateral report by the International Energy Agency (IEA), global renewable energy installations reached a historic milestone this quarter, with solar and wind generating over 38% of total worldwide grid electricity, confirmed independently by cross-border energy regulatory audits.',
    sourceLabel: 'IEA Official Statement & Reuters',
    year: 2026,
  },
  {
    id: 'claim-5',
    title: 'Autonomous Synthetic AI Agent Infiltration',
    category: 'Tech & AI',
    sampleText: 'Unverified whistleblower leaks on an anonymous forum claim that a military cyber-division accidentally deployed an autonomous recursive self-improving AI agent that has secretly rewritten banking protocols and is silently siphoning fractions of a cent from international wire transactions.',
    sourceLabel: 'Anonymous Forum Post',
    year: 2026,
  }
];

export const PresetClaims: React.FC<PresetClaimsProps> = ({ onSelectClaim, disabled }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-apple-cyan" />
          <span>Curated Real-World Claims Library</span>
        </h3>
        <span className="text-[11px] text-slate-500">Click any card to analyze</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {PRESET_CLAIMS.map((claim) => (
          <button
            key={claim.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectClaim(claim.sampleText)}
            className="text-left p-3.5 rounded-2xl liquid-glass-subtle hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all duration-200 group active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  claim.category === 'Viral Rumors' 
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' 
                    : claim.category === 'Health & Science'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    : 'bg-apple-blue/15 text-apple-cyan border border-apple-blue/20'
                }`}>
                  {claim.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{claim.year}</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                {claim.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {claim.sampleText}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-apple-cyan transition-colors">
              <span className="truncate pr-2">Source: {claim.sourceLabel}</span>
              <span className="inline-flex items-center gap-1 font-medium flex-shrink-0">
                Test <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
