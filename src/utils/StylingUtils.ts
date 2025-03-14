/**
 * Method return navigation icon color. If active (current) url is equal to icon url
 *
 * @return CSS variable for active/inactive icon color
 */
export const getIconColor = (iconUrl: string, activeUrl: string) => {
  return iconUrl === activeUrl ? 'var(--active-icon-color)' : 'var(--inactive-icon-color)'
}
