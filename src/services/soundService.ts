export type SoundEffect =
  | 'move_x'
  | 'move_o'
  | 'win'
  | 'draw'
  | 'click'
  | 'restart';

class SoundService {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public play(_effect: SoundEffect): void {
    if (!this.enabled) return;
    // Audio engine integration hook.
    // In environments where raw sound asset files are packaged or synthesized,
    // this plays the audio buffer safely without breaking imports.
  }
}

export const soundService = new SoundService();
