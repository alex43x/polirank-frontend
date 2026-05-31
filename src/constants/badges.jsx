export const BADGES = [
  {
    id: "habitante_cep",
    name: "Habitante del CEP",
    min: 0,
    color: "slate",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
  },
  {
    id: "padrino",
    name: "Padrino",
    min: 10,
    color: "amber",
    icon: (className) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.961 0 1.36 1.243.58 1.8l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    id: "abuedrino",
    name: "Abuedrino",
    min: 15,
    color: "purple",
    icon: (className) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011.1-.1l3.9 2.22 3.9-2.22a1 1 0 011.1.1l3.9 2.22c.4.2.6.6.6 1.1v9c0 .5-.2.9-.6 1.1l-3.9 2.22a1 1 0 01-1.1-.1l-3.9-2.22-3.9 2.22a1 1 0 01-1.1-.1L1.1 14.3c-.4-.2-.6-.6-.6-1.1v-9c0-.5.2-.9.6-1.1L5 2zm2.5 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "polisaurio",
    name: "Polisaurio",
    min: 20,
    color: "orange",
    icon: (className) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "inge_licen",
    name: "Inge/Licen",
    min: 30,
    color: "navy",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
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

export function getBadgeLabel(badge, contributions) {
  if (badge.min === 0) return "0 aportes";
  if (badge.id === "inge_licen") return "30+ aportes";
  return `${badge.min} aportes`;
}
