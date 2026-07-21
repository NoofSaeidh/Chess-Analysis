export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function formatClockTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}+${remainingSeconds}` : `${minutes}m`
  }
  return `${remainingSeconds}s`
}

export function capitalize(str: string): string {
  if (str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z][\w-]{0,28}[a-zA-Z\d]$/.test(username) || /^[a-zA-Z\d]$/.test(username)
}
