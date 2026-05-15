const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────
//  TWEAKS
// ─────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "studentName": "KIM PRINCES R. VILLANUEVA",
  "caseNo": "KPRV-2026",
  "year": "BS Criminology · UB Lipa Campus",
  "paperTint": "cream"
}/*EDITMODE-END*/;

const CASE_SUBJECT_PHOTO = 'imgs/1.png';

// ─────────────────────────────────────────────────────────
//  ICONS (inline SVG)
// ─────────────────────────────────────────────────────────
const Icon = {
  badge: (p) => (
    <svg viewBox="0 0 64 64" {...p}>
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8d59a"/>
          <stop offset="1" stopColor="#8c6b1e"/>
        </linearGradient>
      </defs>
      <path d="M32 4 L54 14 L54 30 C54 44 44 54 32 60 C20 54 10 44 10 30 L10 14 Z"
        fill="url(#bg1)" stroke="#5a4519" strokeWidth="1.5"/>
      <path d="M32 10 L48 17 L48 30 C48 41 40 49 32 53 C24 49 16 41 16 30 L16 17 Z"
        fill="none" stroke="#5a4519" strokeWidth="1"/>
      <path d="M32 20 L34.4 26 L40.8 26.6 L36 30.8 L37.5 37 L32 33.6 L26.5 37 L28 30.8 L23.2 26.6 L29.6 26 Z"
        fill="#14274a"/>
    </svg>
  ),
  gavel: (p) => (
    <svg viewBox="0 0 64 64" {...p}>
      <g stroke="#5a4519" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <rect x="8" y="48" width="48" height="6" rx="1" fill="#b8902f"/>
        <rect x="36" y="22" width="22" height="12" rx="2"
          transform="rotate(-35 47 28)" fill="#b8902f"/>
        <line x1="13" y1="42" x2="32" y2="23" stroke="#5a4519" strokeWidth="3.5"/>
        <line x1="13" y1="42" x2="32" y2="23" stroke="#b8902f" strokeWidth="2"/>
      </g>
    </svg>
  ),
  fingerprint: (p) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...p}>
      <path d="M16 32 C16 22 23 14 32 14 C41 14 48 22 48 32"/>
      <path d="M21 32 C21 25 26 19 32 19 C38 19 43 25 43 32 V40"/>
      <path d="M26 32 C26 28 29 25 32 25 C35 25 38 28 38 32 V44"/>
      <path d="M31 32 V46"/>
      <path d="M16 38 C16 44 19 50 24 52"/>
      <path d="M48 38 C48 44 45 50 40 52"/>
    </svg>
  ),
  scale: (p) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="32" y1="12" x2="32" y2="54"/>
      <line x1="20" y1="54" x2="44" y2="54"/>
      <line x1="14" y1="20" x2="50" y2="20"/>
      <path d="M14 20 L8 32 L20 32 Z"/>
      <path d="M50 20 L44 32 L56 32 Z"/>
      <circle cx="32" cy="14" r="2.5" fill="currentColor"/>
    </svg>
  ),
  magnify: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <circle cx="10.5" cy="10.5" r="6.5"/>
      <line x1="15.5" y1="15.5" x2="20" y2="20"/>
    </svg>
  ),
  book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" {...p}>
      <path d="M4 4h7a3 3 0 013 3v13"/>
      <path d="M20 4h-7a3 3 0 00-3 3v13"/>
      <path d="M4 4v15h7"/>
      <path d="M20 4v15h-7"/>
    </svg>
  ),
  target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2 L14.6 8.8 L22 9.4 L16.3 14.3 L18.2 21.5 L12 17.5 L5.8 21.5 L7.7 14.3 L2 9.4 L9.4 8.8 Z"/>
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1.5"/>
      <path d="M3 6 L12 13 L21 6"/>
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" {...p}>
      <path d="M5 4h4l2 5-3 2c1.5 3 3.5 5 6.5 6.5l2-3 5 2v4c0 1-1 2-2 2C9 22 2 15 2 6c0-1 1-2 2-2z"/>
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z"/>
      <circle cx="12" cy="9" r="3"/>
    </svg>
  ),
  send: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" {...p}>
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22L11 13L2 9L22 2z"/>
    </svg>
  ),
  link: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/>
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>
    </svg>
  ),
  facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────
//  PAPERCLIP
// ─────────────────────────────────────────────────────────
const Paperclip = ({ style, color = '#b8902f' }) => (
  <div className="paperclip" style={style}>
    <svg viewBox="0 0 36 80" fill="none">
      <path
        d="M24 8 C28 8 30 10 30 14 L30 60 C30 68 24 72 18 72 C12 72 6 68 6 60 L6 18 C6 14 8 12 12 12 C16 12 18 14 18 18 L18 56 C18 60 20 62 22 62 C24 62 26 60 26 56 L26 14"
        stroke={color} strokeWidth="3" strokeLinecap="round"
      />
      <path
        d="M24 8 C28 8 30 10 30 14 L30 60 C30 68 24 72 18 72 C12 72 6 68 6 60 L6 18 C6 14 8 12 12 12 C16 12 18 14 18 18 L18 56 C18 60 20 62 22 62 C24 62 26 60 26 56 L26 14"
        stroke="rgba(255,255,255,.45)" strokeWidth="1" strokeLinecap="round"
        transform="translate(-.6 -.6)"
      />
    </svg>
  </div>
);

// ─────────────────────────────────────────────────────────
//  POLAROID & PHOTO PLACEHOLDERS
// ─────────────────────────────────────────────────────────
const photoStyles = [
  { bg: 'linear-gradient(135deg, #2a3550 0%, #1a2540 100%)', pattern: 'evidence' },
  { bg: 'linear-gradient(135deg, #3a2a1d 0%, #1d150c 100%)', pattern: 'archive' },
  { bg: 'linear-gradient(135deg, #2d3a2a 0%, #15201a 100%)', pattern: 'field' },
  { bg: 'linear-gradient(135deg, #4a3a2a 0%, #2a1f15 100%)', pattern: 'mug' },
];

const PhotoBox = ({ label, w = 'PHOTO', kind = 0, style }) => {
  const ps = photoStyles[kind % photoStyles.length];
  return (
    <div style={{
      position: 'relative',
      background: ps.bg,
      overflow: 'hidden',
      ...style,
    }}>
      {/* Crosshatch pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent 0, transparent 8px, rgba(255,255,255,.05) 8px, rgba(255,255,255,.05) 9px),' +
          'repeating-linear-gradient(-45deg, transparent 0, transparent 8px, rgba(255,255,255,.04) 8px, rgba(255,255,255,.04) 9px)',
      }}/>
      {/* Corner marks */}
      {[[0,0,'tl'],[0,1,'tr'],[1,0,'bl'],[1,1,'br']].map(([y,x,k]) => (
        <div key={k} style={{
          position: 'absolute',
          [y === 0 ? 'top' : 'bottom']: 6,
          [x === 0 ? 'left' : 'right']: 6,
          width: 10, height: 10,
          borderTop: y === 0 ? '1.5px solid rgba(255,255,255,.5)' : 'none',
          borderBottom: y === 1 ? '1.5px solid rgba(255,255,255,.5)' : 'none',
          borderLeft: x === 0 ? '1.5px solid rgba(255,255,255,.5)' : 'none',
          borderRight: x === 1 ? '1.5px solid rgba(255,255,255,.5)' : 'none',
        }}/>
      ))}
      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,.55)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: '.3em',
        textAlign: 'center',
        gap: 4, padding: 8,
      }}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="14" rx="1"/>
          <circle cx="12" cy="13" r="3.5"/>
          <path d="M9 6L11 4h2l2 2"/>
        </svg>
        <span>{label || w}</span>
      </div>
    </div>
  );
};

const Polaroid = ({ style, caption, tilt = 0, label = 'PHOTO', kind = 0, w = 200 }) => (
  <div className="polaroid" style={{
    ...style,
    width: w,
    transform: `rotate(${tilt}deg)`,
  }}>
    <PhotoBox label={label} kind={kind} style={{ width: '100%', aspectRatio: '4/5' }}/>
    {caption && <div className="caption">{caption}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────
//  BADGE & GAVEL EMBLEM (large, for home cover)
// ─────────────────────────────────────────────────────────
const BadgeGavelEmblem = () => (
  <svg viewBox="0 0 220 220" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="gShield" cx=".5" cy=".4" r=".7">
        <stop offset="0" stopColor="#e8d59a"/>
        <stop offset=".55" stopColor="#b8902f"/>
        <stop offset="1" stopColor="#6b4f15"/>
      </radialGradient>
      <linearGradient id="gNavy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e3a6a"/>
        <stop offset="1" stopColor="#08142b"/>
      </linearGradient>
    </defs>
    {/* outer ring */}
    <circle cx="110" cy="110" r="100" fill="none" stroke="#8c6b1e" strokeWidth="1.5"/>
    <circle cx="110" cy="110" r="95" fill="none" stroke="#8c6b1e" strokeWidth="0.6" strokeDasharray="2 3"/>
    {/* shield */}
    <path d="M110 28 L172 50 L172 110 C172 148 142 174 110 188 C78 174 48 148 48 110 L48 50 Z"
      fill="url(#gShield)" stroke="#5a4519" strokeWidth="2"/>
    <path d="M110 36 L164 56 L164 110 C164 142 140 166 110 178 C80 166 56 142 56 110 L56 56 Z"
      fill="url(#gNavy)" stroke="#5a4519" strokeWidth="1"/>
    {/* gavel crossed with scales (simplified) */}
    <g transform="translate(110 110)">
      {/* gavel */}
      <g transform="rotate(-30)">
        <rect x="-8" y="-44" width="16" height="22" rx="2" fill="#b8902f" stroke="#5a4519" strokeWidth=".8"/>
        <rect x="-2" y="-22" width="4" height="40" fill="#b8902f" stroke="#5a4519" strokeWidth=".8"/>
        <rect x="-10" y="18" width="20" height="6" rx="1" fill="#b8902f" stroke="#5a4519" strokeWidth=".8"/>
      </g>
      {/* scales of justice (small, overlapping) */}
      <g transform="rotate(30) translate(0 -4)" opacity=".55">
        <line x1="0" y1="-40" x2="0" y2="30" stroke="#e8d59a" strokeWidth="1.4"/>
        <line x1="-22" y1="-30" x2="22" y2="-30" stroke="#e8d59a" strokeWidth="1.4"/>
        <circle cx="0" cy="-40" r="2" fill="#e8d59a"/>
        <path d="M-22 -30 L-30 -16 L-14 -16 Z" fill="none" stroke="#e8d59a" strokeWidth="1.2"/>
        <path d="M22 -30 L30 -16 L14 -16 Z" fill="none" stroke="#e8d59a" strokeWidth="1.2"/>
      </g>
      {/* center star */}
      <path d="M0 -8 L2.2 -2 L8 -1.8 L3.6 2.2 L4.8 8 L0 5 L-4.8 8 L-3.6 2.2 L-8 -1.8 L-2.2 -2 Z"
        fill="#e8d59a"/>
    </g>
    {/* arc text */}
    <path id="arcTop" d="M30 110 A80 80 0 0 1 190 110" fill="none"/>
    <text fill="#8c6b1e" fontFamily="Poppins, sans-serif" fontSize="9" letterSpacing="6" fontWeight="700">
      <textPath href="#arcTop" startOffset="50%" textAnchor="middle">
        VERITAS · IUSTITIA · DISCIPLINA
      </textPath>
    </text>
    <path id="arcBot" d="M30 110 A80 80 0 0 0 190 110" fill="none"/>
    <text fill="#8c6b1e" fontFamily="JetBrains Mono, monospace" fontSize="7" letterSpacing="5" fontWeight="600">
      <textPath href="#arcBot" startOffset="50%" textAnchor="middle">
        EST · MMXX1 · CRIMINOLOGY DEPT
      </textPath>
    </text>
  </svg>
);

// ─────────────────────────────────────────────────────────
//  CLASSIFICATION BAR
// ─────────────────────────────────────────────────────────
const ClassificationBar = ({ caseNo, label = 'CONFIDENTIAL // INTERNAL USE ONLY' }) => (
  <div className="classification">
    <span><span className="dot" style={{ display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }}/>{label}</span>
    <span>CASE NO. {caseNo} · CLEARANCE: LV-5</span>
  </div>
);

// ─────────────────────────────────────────────────────────
//  PAGE: HOME (case file cover)
// ─────────────────────────────────────────────────────────
const HomePage = ({ tw, goTo }) => {
  const nameParts = tw.studentName.split(' ');
  return (
  <div className="page-enter" style={{ position: 'relative', minHeight: '100%' }}>
    <ClassificationBar caseNo={tw.caseNo}/>

    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28, marginTop: 8 }}>
      {/* Left: text */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 5, height: 28, background: 'var(--red-stamp)' }}/>
          <span className="label" style={{ fontSize: 10 }}>CASE FILE COVER · 01 / 04</span>
        </div>

        <div className="typewriter" style={{ fontSize: 12, letterSpacing: '.22em', marginBottom: 4, color: 'var(--ink-soft)' }}>
          SUBJECT
        </div>
        <h1 className="h-display" style={{ fontSize: 52, lineHeight: .95, marginBottom: 12 }}>
          {nameParts.slice(0, -1).join(' ')}<br/>{nameParts[nameParts.length - 1]}
        </h1>

        <div style={{
          fontFamily: 'Caveat, cursive', fontSize: 26, color: 'var(--navy-ink)',
          transform: 'rotate(-1.2deg)', marginLeft: 2, marginBottom: 26, fontWeight: 600,
          lineHeight: 1.15,
        }}>
          “Justice begins with the right question.”
        </div>

        <div style={{ display: 'grid', gap: 2, maxWidth: 420, marginBottom: 22 }}>
          <div className="field">
            <span className="k">Programme</span>
            <span className="v">{tw.year}</span>
          </div>
          <div className="field">
            <span className="k">Discipline</span>
            <span className="v">Criminology &amp; Forensics</span>
          </div>
          <div className="field">
            <span className="k">Filed</span>
            <span className="v">May 2026, NYC</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn" onClick={() => goTo('about')}>
            Open Dossier
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
          </button>
          <button className="btn btn-ghost" onClick={() => goTo('contact')}>
            <Icon.send/> Request Contact
          </button>
        </div>
      </div>

      {/* Right: subject photo (same asset as static index hero) */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 }}>
        <div
          style={{
            width: 'min(100%, 310px)',
            aspectRatio: '4 / 5',
            border: '2px solid rgba(20,39,74,.28)',
            borderRadius: 4,
            overflow: 'hidden',
            background: 'var(--paper-aged)',
            boxShadow: 'inset 0 0 0 1px rgba(184,144,47,.25), 0 10px 28px rgba(20,39,74,.12)',
          }}
        >
          <img
            src={CASE_SUBJECT_PHOTO}
            alt=""
            loading="eager"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <span className="label" style={{ fontSize: 9, marginTop: 8, letterSpacing: '.2em' }}>EXHIBIT A · PHOTO ATTACHMENT</span>

        <div style={{
          marginTop: 12, textAlign: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.18em',
          color: 'var(--ink-soft)', lineHeight: 1.7,
        }}>
          KOLEHIYO / UB LIPA<br/>
          BUREAU OF ACADEMIC RECORDS<br/>
          FILE PREPARED · 05·14·26
        </div>
      </div>
    </div>

    {/* Bottom strip — now part of normal flow */}
    <div style={{
      position: 'absolute', bottom: -36, left: -22, right: -42,
      background: 'var(--navy)', color: 'var(--gold-pale)',
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.2em',
      padding: '8px 52px 8px 28px', display: 'flex', justifyContent: 'space-between',
      boxShadow: 'inset 0 2px 0 var(--gold-deep)',
      zIndex: 4,
    }}>
      <span>► HOME · 01</span>
      <span>STATUS: ACTIVE</span>
      <span>NEXT ▸ ABOUT ME</span>
    </div>

  </div>
  );
};

// ─────────────────────────────────────────────────────────
//  PAGE: ABOUT ME — with sub-tabs
// ─────────────────────────────────────────────────────────
const AboutPage = ({ tw, subTab, setSubTab }) => {
  const tabs = [
    { id: 'profile',   label: 'Profile',   icon: Icon.user },
    { id: 'education', label: 'Education', icon: Icon.book },
    { id: 'skills',    label: 'Skills',    icon: Icon.target },
    { id: 'interests', label: 'Interests', icon: Icon.star },
  ];

  return (
    <div className="page-enter" style={{ position: 'relative', height: '100%' }}>
      <ClassificationBar caseNo={tw.caseNo} label="PERSONAL DOSSIER · SECTION 02"/>

      <div className="subtabs">
        {tabs.map(t => {
          const TIcon = t.icon;
          return (
            <button key={t.id}
              className={`subtab ${subTab === t.id ? 'subtab-active' : ''}`}
              onClick={() => setSubTab(t.id)}>
              <TIcon/> {t.label}
            </button>
          );
        })}
      </div>

      <div key={subTab} className="page-enter" style={{ position: 'relative' }}>
        {subTab === 'profile' && <AboutProfile tw={tw}/>}
        {subTab === 'education' && <AboutEducation/>}
        {subTab === 'skills' && <AboutSkills/>}
        {subTab === 'interests' && <AboutInterests/>}
      </div>
    </div>
  );
};

const AboutProfile = ({ tw }) => {
  const displayName = tw.studentName.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28, position: 'relative' }}>
      {/* LEFT */}
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'Caveat, cursive', fontSize: 38, fontWeight: 700,
          color: 'var(--navy-ink)', marginBottom: 4, transform: 'rotate(-1deg)',
          lineHeight: 1,
        }}>
          {displayName}
        </div>
        <div style={{ height: 2, background: 'var(--ink-faded)', width: 200, marginBottom: 18 }}/>

        <div style={{ display: 'grid', gap: 0, maxWidth: 380, marginBottom: 22 }}>
          <div className="field">
            <span className="k">Birthday</span>
            <span className="v">March 04, 2003</span>
          </div>
          <div className="field">
            <span className="k">Origin</span>
            <span className="v">Brooklyn, NY</span>
          </div>
          <div className="field">
            <span className="k">Specialty</span>
            <span className="v">Forensic Psychology</span>
          </div>
          <div className="field">
            <span className="k">Status</span>
            <span className="v">Senior · Honors</span>
          </div>
        </div>

        <div className="doc-card tilt-l-sm" style={{ position: 'relative' }}>
          <h3 className="h-section" style={{ fontSize: 14, marginBottom: 10, letterSpacing: '.2em', paddingLeft: 50 }}>
            IN A FEW WORDS
          </h3>
          <p className="typewriter" style={{ fontSize: 12.5, lineHeight: 1.65, textAlign: 'justify' }}>
            Fourth-year criminology student with a working focus on forensic psychology and
            juvenile justice. I read case law the way other people read novels and keep a
            notebook of unusual M.O. patterns I've come across in coursework. Outside the
            library: long runs in Prospect Park, true-crime podcasts (with notes), and
            weekend volunteer shifts at the public defender's clinic.
          </p>
          <Paperclip style={{ top: -30, left: 6, transform: 'rotate(-8deg)' }}/>
        </div>

        <div style={{ marginTop: 18, maxWidth: 420 }}>
          <span className="label" style={{ fontSize: 9, display: 'block', marginBottom: 8, letterSpacing: '.18em' }}>EXHIBIT A-2 · MOTION ATTACHMENT</span>
          <video
            src="imgs/video-2.mp4"
            controls
            playsInline
            style={{
              width: '100%',
              maxHeight: 280,
              borderRadius: 4,
              border: '2px solid rgba(20,39,74,.22)',
              background: '#0d1524',
              boxShadow: '0 8px 22px rgba(20,39,74,.14)',
            }}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ position: 'relative', paddingTop: 4 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="label" style={{ fontSize: 9, display: 'block', marginBottom: 8, letterSpacing: '.18em' }}>EXHIBIT A-1 · MOTION ATTACHMENT</span>
          <video
            src="imgs/video-1.mp4"
            controls
            playsInline
            style={{
              width: '100%',
              maxWidth: 360,
              marginLeft: 'auto',
              display: 'block',
              maxHeight: 320,
              borderRadius: 4,
              border: '2px solid rgba(20,39,74,.22)',
              background: '#0d1524',
              boxShadow: '0 8px 22px rgba(20,39,74,.14)',
            }}
          />
        </div>

        <div className="doc-card tilt-r-sm" style={{ position: 'relative' }}>
          <h3 className="h-section" style={{ fontSize: 14, marginBottom: 10, letterSpacing: '.2em' }}>
            KNOWN ASSOCIATIONS
          </h3>
          <ul className="checklist" style={{ fontSize: 13 }}>
            <li>Forensic Society · Vice President</li>
            <li>Innocence Project · campus chapter</li>
            <li>Mock Trial Team · defense bench</li>
            <li>Volunteer · Brooklyn DA outreach</li>
          </ul>
        </div>

      </div>

      <div className="washi-tape" style={{ top: -12, left: '36%', transform: 'rotate(-3deg)' }}/>
    </div>
  );
};

const AboutEducation = () => {
  const rows = [
    { y: '2023–PRESENT', t: 'Columbia University · School of General Studies',
      d: 'B.A. Criminology, GPA 3.91 · Dean\'s List 4 semesters', tag: 'CURRENT' },
    { y: '2024 SUMMER',  t: 'John Jay College of Criminal Justice',
      d: 'Cert. in Forensic Behavioral Analysis (intensive)', tag: 'AWARDED' },
    { y: '2023',         t: 'Stuyvesant High School, NY',
      d: 'Valedictorian · NYC Mayor\'s Scholar', tag: 'GRADUATED' },
    { y: '2022',         t: 'NYPD Youth Police Academy',
      d: '6-week program · perfect attendance, top of cohort', tag: 'COMMENDED' },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
        <h2 className="h-display" style={{ fontSize: 28 }}>Academic Record</h2>
        <span className="label" style={{ fontSize: 10 }}>EXHIBIT B · CHRONOLOGICAL</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 18, alignItems: 'flex-start' }}>
        <div>
          {rows.map((r, i) => (
            <div key={i} className="ach-row">
              <div>
                <div className="year">{r.y}</div>
              </div>
              <div>
                <div className="title" style={{ fontSize: 14 }}>{r.t}</div>
                <div className="org" style={{ fontSize: 12 }}>{r.d}</div>
              </div>
              <span className={`tag tag-${i === 0 ? 'red' : i === 3 ? 'navy' : 'gold'}`}>{r.tag}</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', paddingTop: 10 }}>
          <Polaroid
            label="TRANSCRIPT"
            kind={1}
            caption="official copy"
            tilt={3}
            w={150}
            style={{ position: 'relative' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
        <div className="doc-card">
          <div className="label" style={{ marginBottom: 8 }}>FOCUS AREAS</div>
          <ul className="checklist" style={{ fontSize: 12.5 }}>
            <li>Forensic Psychology &amp; Criminal Profiling</li>
            <li>Juvenile Justice &amp; Restorative Practice</li>
            <li>Cybercrime Investigation</li>
            <li>Quantitative Methods in Criminology</li>
          </ul>
        </div>
        <div className="doc-card">
          <div className="label" style={{ marginBottom: 8 }}>NOTABLE COURSES</div>
          <ul className="checklist" style={{ fontSize: 12.5 }}>
            <li>Theories of Crime &amp; Deviance — A+</li>
            <li>Forensic Interviewing Techniques — A</li>
            <li>Constitutional Law &amp; Due Process — A</li>
            <li>Statistics for Criminal Justice — A</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AboutSkills = () => {
  const skills = [
    { n: 'Forensic Interviewing', v: 92 },
    { n: 'Case File Analysis', v: 95 },
    { n: 'Statistical Analysis (R, SPSS)', v: 84 },
    { n: 'Crime Scene Documentation', v: 88 },
    { n: 'Legal Research (Westlaw, LexisNexis)', v: 90 },
    { n: 'Behavioral Profiling', v: 78 },
    { n: 'Report &amp; Affidavit Writing', v: 93 },
    { n: 'Public Speaking · Mock Trial', v: 86 },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
        <h2 className="h-display" style={{ fontSize: 32 }}>Skill Audit</h2>
        <span className="label" style={{ fontSize: 10 }}>EXHIBIT C · SELF-ASSESSED · BENCHMARKED</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        <div>
          {skills.slice(0, 4).map((s, i) => (
            <div className="skill" key={i}>
              <div className="skill-head">
                <span className="skill-name" dangerouslySetInnerHTML={{ __html: s.n }}/>
                <span className="skill-val">{s.v}%</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: `${s.v}%`, animationDelay: `${i * 80}ms` }}/>
              </div>
            </div>
          ))}
        </div>
        <div>
          {skills.slice(4).map((s, i) => (
            <div className="skill" key={i}>
              <div className="skill-head">
                <span className="skill-name" dangerouslySetInnerHTML={{ __html: s.n }}/>
                <span className="skill-val">{s.v}%</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: `${s.v}%`, animationDelay: `${(i+4) * 80}ms` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 24 }}>
        {[
          { l: 'LANGUAGES', items: ['English (native)', 'Spanish (B2)', 'ASL (A2)'] },
          { l: 'CERTIFICATIONS', items: ['NIMS / IS-100', 'CITI Human Subjects', 'NRA Range Safety'] },
          { l: 'TOOLS', items: ['Westlaw, LexisNexis', 'R, SPSS, Excel', 'Adobe + Affinity suite'] },
        ].map((c, i) => (
          <div key={i} className="doc-card">
            <div className="label" style={{ marginBottom: 8 }}>{c.l}</div>
            <ul className="checklist" style={{ fontSize: 13 }}>
              {c.items.map((x, j) => <li key={j}>{x}</li>)}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};

const AboutInterests = () => (
  <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
    <div>
      <h2 className="h-display" style={{ fontSize: 28, marginBottom: 12 }}>Off the Record</h2>
      <p className="typewriter" style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 18 }}>
        When I'm not in the stacks or running a mock cross-examination, you'll find me
        somewhere between Prospect Park and the back of an indie bookstore. Coffee
        helps. Cold cases help more.
      </p>

      <div className="doc-card">
        <h3 className="h-section" style={{ fontSize: 14, marginBottom: 10, letterSpacing: '.2em' }}>THINGS I CARE ABOUT</h3>
        <ul className="checklist" style={{ fontSize: 13 }}>
          <li>Indigent defense &amp; access to counsel</li>
          <li>Reform of juvenile sentencing</li>
          <li>Cold-case reinvestigation methodology</li>
          <li>Mental-health response in policing</li>
          <li>Eyewitness reliability &amp; lineup reform</li>
        </ul>
      </div>

      <div className="doc-card tilt-l-sm" style={{ marginTop: 16 }}>
        <h3 className="h-section" style={{ fontSize: 14, marginBottom: 8, letterSpacing: '.2em' }}>FAVORITES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 6, fontSize: 12.5 }}>
          <span className="label">BOOK</span> <span className="typewriter">Just Mercy — B. Stevenson</span>
          <span className="label">CASE</span> <span className="typewriter">People v. Bierenbaum (1999)</span>
          <span className="label">FILM</span> <span className="typewriter">12 Angry Men (1957)</span>
          <span className="label">THEORY</span> <span className="typewriter">Routine Activities (C&amp;F)</span>
          <span className="label">PODCAST</span> <span className="typewriter">Criminal · Phoebe Judge</span>
        </div>
      </div>
    </div>

    <div style={{ position: 'relative', paddingTop: 4 }}>
      {/* Polaroid cluster */}
      <div style={{ position: 'relative', height: 220, marginBottom: 12 }}>
        <Polaroid
          style={{ top: 0, left: 0, zIndex: 1 }}
          label="STACK · BOOKS"
          kind={2}
          caption="reading list, mar."
          tilt={-4}
          w={150}
        />
        <Polaroid
          style={{ top: 18, right: 0, zIndex: 2 }}
          label="COFFEE · 06:14"
          kind={3}
          caption="study fuel"
          tilt={5}
          w={150}
        />
      </div>

      <div className="doc-card tilt-r-sm" style={{ position: 'relative' }}>
        <h3 className="h-section" style={{ fontSize: 14, marginBottom: 8, letterSpacing: '.2em' }}>FIELD KIT</h3>
        <ul className="checklist" style={{ fontSize: 12.5 }}>
          <li>Field notebook (Field Notes, graph)</li>
          <li>Black Uni-ball pens, three of them</li>
          <li>Headphones · brown noise · always</li>
        </ul>
        <Paperclip style={{ top: -28, right: 24, transform: 'rotate(12deg)' }}/>
      </div>

      <div className="washi-tape" style={{ top: -10, right: '20%', transform: 'rotate(4deg)' }}/>
    </div>

  </div>
);

// ─────────────────────────────────────────────────────────
//  PAGE: ACHIEVEMENTS
// ─────────────────────────────────────────────────────────
const AchievementsPage = ({ tw }) => {
  const items = [
    { n: '001', y: '2025', t: 'National Criminology Undergraduate Paper Prize', o: 'American Society of Criminology · top 3 nationally', tag: 'AWARDED', c: 'gold' },
    { n: '002', y: '2025', t: 'Dean\'s List · 4 consecutive semesters', o: 'Columbia University, School of General Studies', tag: 'HONORS', c: 'gold' },
    { n: '003', y: '2025', t: 'Research Asst. — Wrongful Conviction Project', o: 'Reviewed 38 case files, co-authored white paper', tag: 'PUBLISHED', c: 'navy' },
    { n: '004', y: '2024', t: 'Brooklyn DA Office · Summer Internship', o: 'Misdemeanor Unit · assisted on 12 trial preps', tag: 'COMMENDED', c: 'navy' },
    { n: '005', y: '2024', t: 'Best Advocate · NY Inter-Collegiate Mock Trial', o: 'Defense bench · 7-1 individual record', tag: 'FIRST PLACE', c: 'red' },
    { n: '006', y: '2024', t: 'NIJ Graduate Research Fellow (semifinalist)', o: 'Proposal: Eyewitness ID under cognitive load', tag: 'SHORTLIST', c: 'gold' },
    { n: '007', y: '2023', t: 'Phi Beta Kappa · Junior induction', o: 'Top 5% of class, by faculty vote', tag: 'INDUCTED', c: 'navy' },
    { n: '008', y: '2023', t: '“Profiles in Justice” podcast · guest interview', o: 'Episode 47 · on juvenile sentencing reform', tag: 'AIRED', c: 'navy' },
  ];

  return (
    <div className="page-enter" style={{ position: 'relative', height: '100%' }}>
      <ClassificationBar caseNo={tw.caseNo} label="EVIDENCE LOG · SECTION 03 · COMMENDATIONS"/>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 className="h-display" style={{ fontSize: 36, marginBottom: 4 }}>Commendations &amp; Findings</h2>
          <p className="typewriter" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
            Items logged into the academic record. Sorted in reverse chronological order.
          </p>
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.18em',
          color: 'var(--ink-soft)', textAlign: 'right', lineHeight: 1.6,
        }}>
          ENTRIES · {items.length}<br/>
          PERIOD · 2023–2025<br/>
          AUTHENTICATED ✓
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {items.map((it, i) => (
          <div key={i} className="ach-row" style={{ animationDelay: `${i * 60}ms` }}>
            <div>
              <div className="num">№ {it.n}</div>
              <div className="year" style={{ marginTop: 4 }}>{it.y}</div>
            </div>
            <div>
              <div className="title">{it.t}</div>
              <div className="org">{it.o}</div>
            </div>
            <span className={`tag tag-${it.c}`}>{it.tag}</span>
          </div>
        ))}
      </div>

      <div className="sig-line" style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between' }}>
        <span>CHAIN OF CUSTODY · M. REYES · 05·14·26</span>
        <span>NEXT REVIEW · 09·01·26</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
//  PAGE: CONTACT
// ─────────────────────────────────────────────────────────
const CONTACT_CLASS_SCHEDULE = [
  { subj: 'CDI6', desc: 'Fire Protection and Arson Investigation', sec: 'CRIM3B', day: 'TTH', times: ['10:00AM–11:30AM'], rooms: ['A-315'], inst: 'ROXAS, JENEL GUTIERREZ' },
  { subj: 'CDI8', desc: 'Technical English 2 (Legal Forms)', sec: 'CRIM3B', day: 'W', times: ['09:00AM–12:00PM'], rooms: ['CRIM LAB 1'], inst: 'ROXAS, JENEL GUTIERREZ' },
  { subj: 'CLJ4', desc: 'Criminal Law (Book 2)', sec: 'CRIM3B', day: 'F', times: ['08:00AM–12:00PM'], rooms: ['A-304'], inst: 'MOSTIERO, EZEKIEL TRAQUENA' },
  { subj: 'CLJ5', desc: 'Evidence', sec: 'CRIM3B', day: 'S', times: ['01:00PM–04:00PM'], rooms: ['A-304'], inst: 'MOSTIERO, EZEKIEL TRAQUENA' },
  { subj: 'CRIM5', desc: 'Juvenile Delinquency and Juvenile Justice System', sec: 'CRIM3B', day: 'S', times: ['08:00AM–11:00AM'], rooms: ['A-306'], inst: 'DELFIN, MARIA LEA SANCHEZ' },
  { subj: 'EPR', desc: 'English Proficiency for Empowered Professionals', sec: 'CRIM2B', day: 'MW', times: ['02:30PM–04:00PM'], rooms: ['A-221'], inst: 'GOMEZ, DAN REY VILLOTA' },
  { subj: 'FRC4', desc: 'Questioned Documents Examination', sec: 'CRIM3B', day: 'M', times: ['01:00PM–03:00PM', '03:00PM–04:00PM (LAB)'], rooms: ['A-302', 'A-302 (LAB)'], inst: 'ROXAS, JENEL GUTIERREZ' },
  { subj: 'FRC5', desc: 'Lie Detection Techniques', sec: 'CRIM3B', day: 'W', times: ['08:00AM–10:00AM', '10:00AM–11:00AM (LAB)'], rooms: ['A-317', 'A-317 (LAB)'], inst: 'CASTILLO, ANGELICA ARIANNE CARE' },
  { subj: 'LEA4', desc: 'Law Enforcement Operations and Planning with Crime Mapping', sec: 'CRIM2B', day: 'MW', times: ['10:00AM–11:30AM'], rooms: ['A-304'], inst: 'DELFIN, MARIA LEA SANCHEZ' },
  { subj: 'LITERA', desc: 'Living in IT Era', sec: 'CRIM3B', day: 'F', times: ['02:00PM–05:00PM'], rooms: ['B-314'], inst: 'REYES, RUSSEL GARCIA' },
];

const ContactPage = ({ tw }) => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subj: '', msg: '' });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4200);
  };

  return (
    <div className="page-enter" style={{ position: 'relative', height: '100%' }}>
      <ClassificationBar caseNo={tw.caseNo} label="OFFICIAL INQUIRY · SECTION 04 · INTAKE FORM"/>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 32 }}>
        {/* Left: contact card */}
        <div>
          <h2 className="h-display" style={{ fontSize: 36, marginBottom: 8 }}>Open A Line</h2>
          <p className="typewriter" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-soft)', marginBottom: 22 }}>
            All inquiries are read personally. Allow 24–72 hours for response.
            Marked URGENT for time-sensitive matters.
          </p>

          <div className="doc-card" style={{ marginBottom: 16, position: 'relative' }}>
            <h3 className="h-section" style={{ fontSize: 14, marginBottom: 12, letterSpacing: '.2em' }}>DIRECT CHANNELS</h3>

            <div style={{ display: 'grid', gap: 12 }}>
              <ContactRow icon={<Icon.mail/>}  label="EMAIL"   value="m.reyes@criminology.school"/>
              <ContactRow icon={<Icon.phone/>} label="OFFICE"  value="+1 (212) 555-0184"/>
              <ContactRow icon={<Icon.pin/>}   label="MAILBOX" value="Box 4017 · Hamilton Hall · 1130 Amsterdam"/>
              <ContactRow
                icon={<Icon.facebook/>}
                label="FACEBOOK"
                value={(
                  <a
                    href="https://www.facebook.com/kimprinces.villanueva"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--navy-mid)', textDecoration: 'underline', textUnderlineOffset: 3 }}
                  >
                    facebook.com/kimprinces.villanueva
                  </a>
                )}
              />
            </div>

            <Paperclip style={{ top: -28, right: 22 }} color="#14274a"/>
          </div>

          <div className="schedule-panel tilt-l-sm">
            <h3 className="h-section" style={{ fontSize: 14, marginBottom: 12, letterSpacing: '.2em' }}>CLASS SCHEDULE</h3>
            <div className="schedule-table-wrap">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Description</th>
                    <th scope="col">Section</th>
                    <th scope="col">Day</th>
                    <th scope="col">Time</th>
                    <th scope="col">Room</th>
                    <th scope="col">Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTACT_CLASS_SCHEDULE.map((r, idx) => (
                    <tr key={`${r.subj}-${idx}`}>
                      <td>{r.subj}</td>
                      <td>{r.desc}</td>
                      <td>{r.sec}</td>
                      <td>{r.day}</td>
                      <td>
                        {r.times.map((t, i) => (
                          <span key={i} style={{ display: 'block' }}>{t}</span>
                        ))}
                      </td>
                      <td>
                        {r.rooms.map((x, i) => (
                          <span key={i} style={{ display: 'block' }}>{x}</span>
                        ))}
                      </td>
                      <td>{r.inst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right: form */}
        <div style={{ position: 'relative' }}>
          <form onSubmit={submit} className="doc-card" style={{ padding: '24px 26px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <h3 className="h-section" style={{ fontSize: 16, letterSpacing: '.2em' }}>FILE AN INQUIRY</h3>
              <span className="label" style={{ fontSize: 9 }}>FORM CR-204 · REV 12</span>
            </div>

            <FormField label="Filed By"   k="01">
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="full name"/>
            </FormField>
            <FormField label="Return Address" k="02">
              <input className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@domain"/>
            </FormField>
            <FormField label="Re:" k="03">
              <input className="input" value={form.subj} onChange={e => setForm({...form, subj: e.target.value})} placeholder="subject line"/>
            </FormField>
            <FormField label="Statement" k="04">
              <textarea className="textarea" value={form.msg} onChange={e => setForm({...form, msg: e.target.value})} rows={4} placeholder="describe the matter..."/>
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <div className="label" style={{ fontSize: 10 }}>SIGNED · UNDER OATH ✗</div>
              <button type="submit" className="btn">
                <Icon.send/> Submit Inquiry
              </button>
            </div>

            {sent && (
              <div style={{
                position: 'absolute', top: 50, right: 20,
                fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                color: 'var(--navy)', border: '1px solid rgba(20,39,74,.35)',
                padding: '12px 18px', letterSpacing: '.12em',
                textTransform: 'uppercase', fontSize: 18,
                transform: 'rotate(-2deg)',
                background: 'rgba(245,238,215,.96)',
                borderRadius: 4,
                boxShadow: '0 8px 24px rgba(0,0,0,.12)',
              }}>
                RECEIVED ✓<br/>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.2em', fontWeight: 500 }}>
                  TIME · {new Date().toTimeString().slice(0,5)} EST
                </span>
              </div>
            )}
          </form>

          <div className="washi-tape" style={{ top: -10, right: '20%', transform: 'rotate(4deg)' }}/>
        </div>
      </div>
    </div>
  );
};

const ContactRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{
      width: 36, height: 36,
      background: 'var(--navy)',
      color: 'var(--gold-pale)',
      borderRadius: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: 'inset 0 -2px 0 var(--gold-deep)',
    }}>
      {React.cloneElement(icon, { width: 16, height: 16 })}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="label" style={{ fontSize: 9, marginBottom: 2 }}>{label}</div>
      <div className="typewriter" style={{ fontSize: 13, color: 'var(--ink-faded)' }}>{value}</div>
    </div>
  </div>
);

const FormField = ({ label, k, children }) => (
  <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '40px 90px 1fr', alignItems: 'center', gap: 12 }}>
    <div className="label" style={{ fontSize: 10 }}>{k}</div>
    <div className="label" style={{ fontSize: 10 }}>{label}</div>
    <div>{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────
//  TABS
// ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',         label: 'HOME',         no: '01' },
  { id: 'about',        label: 'ABOUT ME',     no: '02' },
  { id: 'achievements', label: 'ACHIEVEMENTS', no: '03' },
  { id: 'contact',      label: 'CONTACT',      no: '04' },
];

// ─────────────────────────────────────────────────────────
//  LOADERS
// ─────────────────────────────────────────────────────────
const PageLoader = ({ show }) => {
  if (!show) return null;
  return (
    <div className="casefile-page-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="casefile-spinner" aria-hidden="true"/>
      <div className="casefile-page-loader__label">Retrieving case file</div>
      <div className="casefile-page-loader__sub">SECTION CLEARANCE PENDING</div>
    </div>
  );
};

const LoadableMedia = ({ as: Tag = 'img', className, style, onLoad, ...props }) => {
  const [state, setState] = useState('loading');
  const done = (ok) => setState(ok ? 'loaded' : 'error');
  return (
    <div className={`casefile-loadable ${state === 'loading' ? 'is-loading' : ''} ${state === 'loaded' ? 'is-loaded' : ''} ${state === 'error' ? 'is-error' : ''}`}>
      <Tag
        {...props}
        className={className}
        style={style}
        onLoad={(e) => { done(true); onLoad?.(e); }}
        onError={(e) => { done(false); props.onError?.(e); }}
        onLoadedData={(e) => { if (Tag === 'video') { done(true); props.onLoadedData?.(e); } }}
      />
      <span className="casefile-loadable__overlay" aria-hidden="true">
        <span className="casefile-spinner"/>
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────────────────
function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useState('home');
  const [subTab, setSubTab] = useState('profile');
  const [scale, setScale] = useState(1);
  const [entered, setEntered] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('casefile-boot');
    const hide = () => window.setTimeout(() => {
      setPageLoading(false);
      document.documentElement.classList.remove('casefile-boot');
      document.documentElement.classList.add('casefile-ready');
    }, 420);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide, { once: true });
    return () => window.removeEventListener('load', hide);
  }, []);

  useEffect(() => {
    setPageLoading(true);
    const t = window.setTimeout(() => setPageLoading(false), 360);
    return () => window.clearTimeout(t);
  }, [page]);

  // Trigger entrance once mounted
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Responsive scale
  useEffect(() => {
    const compute = () => {
      const W = 1280, H = 860;
      const sx = window.innerWidth  / (W + 40);
      const sy = window.innerHeight / (H + 40);
      setScale(Math.min(1, sx, sy));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const goTo = (id) => {
    if (id === page) return;
    setPage(id);
  };

  return (
    <>
      <PageLoader show={pageLoading} />
      <div className={`stage ${entered ? 'entered' : ''}`} style={{ '--s': scale }}>
      <div className="folder-wrap">
        <div className="folder">
          {/* Background sheets */}
          <div className="bg-sheets">
            <div className="bg-sheet"/>
            <div className="bg-sheet"/>
            <div className="bg-sheet"/>
          </div>

          {/* Folder back */}
          <div className="folder-back">
            {/* Subtle watermark on folder */}
            <div style={{
              position: 'absolute',
              right: 28, bottom: 14,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, letterSpacing: '.3em',
              color: 'rgba(0,0,0,.25)',
            }}>
              CR · BUREAU OF ACADEMIC RECORDS · 2026
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {TABS.map((t, i) => (
              <button key={t.id}
                className={`tab ${page === t.id ? 'tab-active' : ''}`}
                onClick={() => goTo(t.id)}
                style={{ transitionDelay: `${i * 30}ms` }}>
                <span className="tab-no">FILE {t.no}</span>
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Papers */}
          <div className="papers">
            <div className="paper" key={page}>
              {/* hole punches */}
              <div className="hole-punch">
                <div className="hole"/><div className="hole"/><div className="hole"/>
                <div className="hole"/><div className="hole"/><div className="hole"/>
              </div>

              <div className="paper-content" style={{ paddingLeft: 64 }}>
                {page === 'home' && <HomePage tw={tw} goTo={goTo}/>}
                {page === 'about' && <AboutPage tw={tw} subTab={subTab} setSubTab={setSubTab}/>}
                {page === 'achievements' && <AchievementsPage tw={tw}/>}
                {page === 'contact' && <ContactPage tw={tw}/>}
              </div>
            </div>
          </div>

          {/* Folder front trim (right corner) */}
          <div className="folder-front-trim"/>
        </div>

        {/* Bottom screen-wide label */}
        <div style={{
          marginTop: 14,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11, letterSpacing: '.35em',
          color: 'rgba(232,213,154,.55)',
        }}>
          ▸ CASE FILE · {TWEAK_DEFAULTS.studentName} · INTERACTIVE DOSSIER ◂
        </div>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Subject"/>
        <TweakText label="Student Name" value={tw.studentName}
          onChange={v => setTweak('studentName', v)}/>
        <TweakText label="Case No." value={tw.caseNo}
          onChange={v => setTweak('caseNo', v)}/>
        <TweakText label="Programme" value={tw.year}
          onChange={v => setTweak('year', v)}/>

        <TweakSection label="Visual"/>
        <TweakRadio label="Paper tint" value={tw.paperTint}
          options={['cream','aged']}
          onChange={v => setTweak('paperTint', v)}/>

        <TweakSection label="Navigate"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '4px 12px 10px' }}>
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => goTo(t.id)}
              style={{
                padding: '6px 8px', fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '.15em',
                border: 'none',
                background: page === t.id ? '#14274a' : '#e8d59a',
                color: page === t.id ? '#e8d59a' : '#14274a',
                cursor: 'pointer',
                borderRadius: 2,
              }}>
              {t.no} · {t.label}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>
    </>
  );
}

// Apply paper tint via CSS var when changed
const applyPaperTint = (tint) => {
  document.documentElement.style.setProperty('--paper',
    tint === 'aged' ? '#ece2bd' : '#f5eed7');
};

// Watch for tint change
function AppWithEffects() {
  return <App/>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppWithEffects/>);
