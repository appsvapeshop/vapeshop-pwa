/**
 * Method return navigation icon color. If active (current) url is equal to icon url.
 *
 * @param iconUrl URL under which the icon should be active. Must not be null.
 * @param activeUrl Current URL. Must not be null.
 *
 * @return CSS variable for active/inactive icon color.
 */
export const getIconColor = (iconUrl: string, activeUrl: string) => {
  return iconUrl === activeUrl ? 'var(--active-icon-color)' : 'var(--inactive-icon-color)'
}
