import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, Quote, CheckCircle2, ExternalLink } from 'lucide-react';
import { playTempleGong } from '../utils/audio';

interface TeachingItem {
  topic: string;
  sourceContext: string;
  title: string;
  quote: string;
  practicalRule: string;
  bhajanMargInsight: string;
}

const BHAJAN_MARG_TEACHINGS: TeachingItem[] = [
  {
    topic: 'Akhand Brahmacharya & Ojas',
    sourceContext: 'Bhajan Marg · Ekantik Vartalap on Veerya Raksha',
    title: 'Conserving Vital Prana & Transmuting into Ojas',
    quote:
      'Veerya (vital creative force) is the condensed essence of our entire body. If wasted for a few seconds of illusory sensory madness, your memory, courage, radiance (Tejas), and divine connection will be shattered. When you preserve it, that same energy rises up the Sushumna, becoming luminous spiritual Ojas. It gives you the power to conquer the world and realise God.',
    practicalRule: 'Never let the eyes linger on sensual pictures, videos, or persons. The second a lustful thought knocks, strike it down with Naam Jap.',
    bhajanMargInsight: 'Maharaj Ji constantly reminds youth on Bhajan Marg: "Do not sell diamonds for glass beads. Preserve your youth for the Supreme."',
  },
  {
    topic: 'Indriyavijay & Eye Gate Control',
    sourceContext: 'Bhajan Marg · Discourse on Kaam (Lust) Destruction',
    title: 'Guarding the Gates of Netra, Vaani, and Kaan',
    quote:
      'Kaam does not enter with drums; it enters stealthily through the eyes and ears. If you allow your eyes to gaze upon impure objects or sensual scenes on your phone, the impressions will sink into your Chitta and torment you for days. Keep your eyes lowered, speak truth soaked in divine love, and do not listen to worldly vulgarities.',
    practicalRule: 'Keep eyes downcast when walking in crowded places; instantly shut down toxic YouTube/shows/social media feeds.',
    bhajanMargInsight: 'On Bhajan Marg, Maharaj Ji calls mobile phones the biggest snare if used without self-control. Break the screen trap!',
  },
  {
    topic: 'Mann Prasanna & Bhagwan ke Ansh',
    sourceContext: 'Bhajan Marg · Discourse on Joy & Spiritual Dignity',
    title: 'Maintaining an Ever-Cheerful, Noble Consciousness',
    quote:
      'Always remember: You are Bhagwan ke Ansh (part and parcel of the Supreme Lord). Why should a prince of the Lord of the Universe be depressed, brooding, or begging for cheap bodily pleasures? A sad, overthinking, brooding mind is the breeding ground of lust and inertia. Keep your Mann Prasanna in all circumstances!',
    practicalRule: 'Whenever overthinking strikes, stand up, chant the Holy Name with enthusiasm, and immediately engage in physical action.',
    bhajanMargInsight: 'Maharaj Ji always smiles radiating divine bliss, teaching: "Lust cannot touch a devotee whose heart is overflowing with divine joy."',
  },
  {
    topic: 'Detachment from Results (Karma > Phala)',
    sourceContext: 'Bhajan Marg · Guidance on Duty & Surrender',
    title: 'Shattering the Trap of Anxiety and Overthinking',
    quote:
      'The reason people fail and overthink is because they want the fruit (Phala) without doing the rigorous daily work (Karma). The more Moha (attachment) you have to the outcome, the more anxious and paralysed you become. Do your daily Dincharya with total devotion and sincerity, and leave the results entirely at the lotus feet of the Lord.',
    practicalRule: 'Restrain endless future planning. Focus 100% of your energy on executing today’s spiritual and physical disciplines.',
    bhajanMargInsight: 'Bhajan Marg teachings emphasize Nishkama Karma: "Do your duty with pure intent, free from pride and anxiety."',
  },
  {
    topic: 'The Power of Naam Jap',
    sourceContext: 'Bhajan Marg · Mahima of the Holy Name',
    title: 'The Infallible Shield of Naam',
    quote:
      'In this Kaliyuga, there is no greater power than the Holy Name. Whether it is Lord Ganapati’s auspicious name or Priya-Priyatam’s name, holding firmly to Naam cleanses all past sanskaras, burns away lustful tendencies, and grants steady intellect (Buddhi). Let not a single breath go in vain without divine remembrance.',
    practicalRule: 'Keep a physical Mala or chant continuously whenever your mind is idle, turning every free moment into Sadhana.',
    bhajanMargInsight: 'Maharaj Ji’s entire life at Shri Hit Radha Keli Kunj in Vrindavan revolves around unbroken Naam Kirtan and devotion.',
  },
];

export const TeachingsSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeTeaching = BHAJAN_MARG_TEACHINGS[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    playTempleGong(432, 1.8);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Verified Master Profile Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-80 h-72 md:h-88 shrink-0 bg-stone-950 relative overflow-hidden">
            <img
              src="/images/premanand_ji_wisdom_1790517214649.jpg"
              alt="Pujya Shri Hit Premanand Govind Sharan Ji Maharaj"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900 via-transparent to-transparent" />
          </div>

          <div className="p-6 md:p-8 space-y-3.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold font-mono">
                Verified Reference &amp; Spiritual Guide
              </span>
              <span className="text-[11px] bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bhajan Marg · Vrindavan</span>
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-100">
              Pujya Shri Hit Premanand Govind Sharan Ji Maharaj
            </h2>

            <p className="text-xs text-amber-300 font-mono">
              Shri Hit Radha Keli Kunj, Varaha Ghat, Vrindavan Dham
            </p>

            <p className="font-serif-prose text-xs md:text-sm text-stone-300 leading-relaxed italic">
              "Brahmacharya is the life-breath of spiritual power and character. Guard your senses, protect your vital energy, live in joyous execution of your Dincharya, and never surrender your soul to the illusions of sensory distractions."
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400">Official Channel:</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 font-medium">
                Bhajan Marg (भजन मार्ग)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-400">
                Ekantik Vartalap on Brahmacharya
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discourses List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Navigation list */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold px-1 block font-mono">
            Bhajan Marg Discourses &amp; Principles:
          </span>
          <div className="space-y-1.5">
            {BHAJAN_MARG_TEACHINGS.map((item, idx) => (
              <button
                key={item.topic}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                  selectedIdx === idx
                    ? 'bg-amber-950/70 border-amber-600/70 text-amber-200 shadow-md'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <span className="text-[10px] text-amber-500/90 font-mono uppercase block">
                  {item.topic}
                </span>
                <span className="font-semibold text-stone-100 block mt-0.5">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Teaching Detail */}
        <div className="lg:col-span-2 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-500 font-mono font-semibold block">
                {activeTeaching.sourceContext}
              </span>
              <h3 className="font-display text-xl font-bold text-stone-100 mt-1">
                {activeTeaching.title}
              </h3>
            </div>
            <Quote className="w-8 h-8 text-amber-500/20 shrink-0" />
          </div>

          <div className="relative pl-4 border-l-2 border-amber-500/60">
            <p className="font-serif-prose text-sm md:text-base text-stone-200 leading-relaxed italic">
              "{activeTeaching.quote}"
            </p>
          </div>

          {/* Actionable Rule */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
              Direct Action Rule for Your Dincharya:
            </span>
            <p className="text-xs md:text-sm text-stone-300">
              {activeTeaching.practicalRule}
            </p>
          </div>

          {/* Bhajan Marg Context */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200/90 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300">From Bhajan Marg Satsang:</strong>
              <span>{activeTeaching.bhajanMargInsight}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
