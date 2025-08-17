export function formatDate(date: Date): string {
  let locale = 'cs-CZ'
  if (typeof document !== 'undefined') {
    locale = document.documentElement.lang === 'en' ? 'en-US' : 'cs-CZ'
  }
  return new Intl.DateTimeFormat(locale as Intl.LocalesArgument, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'just now' : 'právě teď'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en'
    return isEn ? `${diffInMinutes} min ago` : `před ${diffInMinutes} min`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en'
    return isEn ? `${diffInHours} h ago` : `před ${diffInHours} h`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en'
    return isEn ? `${diffInDays} days ago` : `před ${diffInDays} dny`
  }

  return formatDate(date)
}
