import { Vibration, Platform } from 'react-native';

export type HapticFeedbackType = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

class HapticsService {
  private enabled: boolean = true;
  private hasFailed: boolean = false;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled && !this.hasFailed;
  }

  public trigger(type: HapticFeedbackType = 'light'): void {
    if (!this.enabled || this.hasFailed) return;

    try {
      if (Platform.OS === 'android') {
        switch (type) {
          case 'light':
            Vibration.vibrate(15);
            break;
          case 'medium':
            Vibration.vibrate(30);
            break;
          case 'heavy':
            Vibration.vibrate(50);
            break;
          case 'success':
            Vibration.vibrate([0, 30, 60, 45]);
            break;
          case 'warning':
            Vibration.vibrate([0, 40, 50, 40]);
            break;
          case 'error':
            Vibration.vibrate([0, 50, 60, 50]);
            break;
        }
      } else {
        Vibration.vibrate();
      }
    } catch {
      // If permission is missing or unsupported, disable to prevent further errors
      this.hasFailed = true;
    }
  }
}

export const hapticsService = new HapticsService();
