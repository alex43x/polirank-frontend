export const BADGES = [
  {
    id: "habitante_cep",
    name: "Habitante del CEP",
    min: 0,
    color: "slate",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        <text x="14" y="14" fontSize="8" fontWeight="bold" strokeWidth="1.5">Z</text>
        <text x="16.5" y="11" fontSize="6" fontWeight="bold" strokeWidth="1.5">Z</text>
        <text x="18.5" y="8.5" fontSize="4" fontWeight="bold" strokeWidth="1" className="opacity-70">Z</text>
      </svg>
    ),
  },
  {
    id: "bicho",
    name: "Bicho",
    min: 5,
    color: "emerald",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 00-4 4v1a4 4 0 008 0v-1a4 4 0 00-4-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12H6a3 3 0 00-3 3v1a2 2 0 002 2h1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h2a3 3 0 013 3v1a2 2 0 01-2 2h-1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4l2 2 2-2" />
      </svg>
    ),
  },
  {
    id: "padrino",
    name: "Padrino",
    min: 10,
    color: "amber",
    icon: (className) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: "abuedrino",
    name: "Abuedrino",
    min: 15,
    color: "purple",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18h6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v2" />
      </svg>
    ),
  },
  {
    id: "polisaurio",
    name: "Polisaurio",
    min: 25,
    color: "orange",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11a5 5 0 1110 0v2a5 5 0 11-10 0v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13a7 7 0 0014 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 18l-1 3" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l1 3" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v3" />
      </svg>
    ),
  },
  {
    id: "inge_licen",
    name: "Inge/Licen",
    min: 40,
    color: "navy",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

export function getBadge(contributions) {
  let badge = BADGES[0];
  for (const b of BADGES) {
    if (contributions >= b.min) {
      badge = b;
    }
  }
  return badge;
}

const COLOR_STYLES = {
  slate: {
    container: "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700",
    icon: "text-slate-500 dark:text-slate-400",
    card: "bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700",
    cardIcon: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
    name: "text-slate-600 dark:text-slate-400",
    desc: "text-slate-400 dark:text-slate-500",
  },
  emerald: {
    container: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50 shadow-sm shadow-emerald-100/50 dark:shadow-emerald-900/20",
    icon: "text-emerald-500 dark:text-emerald-400",
    card: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/50",
    cardIcon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
    name: "text-emerald-600 dark:text-emerald-400",
    desc: "text-emerald-400 dark:text-emerald-500",
  },
  amber: {
    container: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50 shadow-sm shadow-amber-100/50 dark:shadow-amber-900/20",
    icon: "text-amber-500 dark:text-amber-400",
    card: "bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/50",
    cardIcon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
    name: "text-amber-600 dark:text-amber-400",
    desc: "text-amber-400 dark:text-amber-500",
  },
  purple: {
    container: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/50 shadow-sm shadow-purple-100/50 dark:shadow-purple-900/20",
    icon: "text-purple-500 dark:text-purple-400",
    card: "bg-purple-50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-900/50",
    cardIcon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    name: "text-purple-600 dark:text-purple-400",
    desc: "text-purple-400 dark:text-purple-500",
  },
  orange: {
    container: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 text-orange-600 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/50 shadow-md shadow-orange-100/50 dark:shadow-orange-900/20",
    icon: "text-orange-500 dark:text-orange-400",
    card: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200/50 dark:border-orange-900/50",
    cardIcon: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
    name: "text-orange-600 dark:text-orange-400",
    desc: "text-orange-400 dark:text-orange-500",
  },
  navy: {
    container: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20",
    icon: "text-blue-500 dark:text-blue-400",
    card: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200/50 dark:border-blue-900/50",
    cardIcon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    name: "text-blue-600 dark:text-blue-400",
    desc: "text-blue-400 dark:text-blue-500",
  },
};

export function getBadgeStyles(color) {
  return COLOR_STYLES[color] || COLOR_STYLES.slate;
}

export function getBadgeLabel(badge) {
  const idx = BADGES.findIndex(b => b.id === badge.id);
  const next = BADGES[idx + 1];
  if (!next) return `${badge.min}+ aportes`;
  return `${badge.min} - ${next.min - 1} aportes`;
}
