export type SettingsContext = {
  settingsId: string | undefined
  pointsPerAmount: number | undefined
  conversionFactor: number | undefined
  categoriesForCoupons: boolean | undefined
  categoriesForNewspaper: boolean | undefined
  settingsStatus: SettingStatus
  updateSettings: (settings: SettingsContext) => Promise<void>
}

export enum SettingStatus {
  NotStarted,
  InProgress,
  Completed
}
