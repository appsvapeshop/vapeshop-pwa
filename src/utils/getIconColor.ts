export const getIconColor = (url: string, activeUrl: string) => {
  return url === activeUrl ? 'var(--active-icon-color)' : 'var(--inactive-icon-color)'
}
