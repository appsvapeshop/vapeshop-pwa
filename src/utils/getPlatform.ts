import { Platform } from '../enums/Platform'
import { isAndroid, isIOS } from 'mobile-device-detect'

export const getPlatform = (): Platform => {
  if (isAndroid) {
    return Platform.Android
  } else if (isIOS) {
    return Platform.IOS
  }

  return Platform.Other
}
