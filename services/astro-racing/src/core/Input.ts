import type {MobileControls} from './MobileControls';
export interface DriveInput { throttle: number; brake: number; steer: number; drift: boolean; trick?:boolean; item?:boolean; lookBehind?:boolean }
export const neutralInput = (): DriveInput => ({ throttle: 0, brake: 0, steer: 0, drift: false });
export class Input {
  private keys = new Set<string>();
  private pressed = new Set<string>();
  private padButtons = new Set<number>();
  enabled = false;
  device:'keyboard'|'gamepad'|'touch'='keyboard';
  mobile?:MobileControls;
  trigger(action:'item'|'trick'){if(this.enabled)this.pressed.add(action);}
  constructor(private onAction: (action: string) => void) {
    window.addEventListener('keydown', e => {
      this.device='keyboard';
      if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement){if(e.code==='Escape')this.onAction('pause');return;}
      if (this.enabled&&['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (!e.repeat) {
        if(e.code==='KeyE')this.pressed.add('trick');
        if(e.code==='KeyQ')this.pressed.add('item');
        if (e.code === 'Escape' || e.code === 'KeyP') this.onAction('pause');
        if (e.code === 'KeyR') this.onAction('recover');
        if (e.code === 'KeyM') this.onAction('mute');
        if (e.code === 'Enter' && !(e.target instanceof HTMLButtonElement)) this.onAction('enter');
      }
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.clear(); this.onAction('blur'); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { this.clear(); this.onAction('blur'); } });
  }
  clear() { this.keys.clear(); this.pressed.clear();this.mobile?.clear(); }
  acknowledge(){this.pressed.clear();}
  read(consume=true): DriveInput {
    const pads = navigator.getGamepads?.() ?? [];
    const pad = Array.from(pads).find(p => p?.connected);
    const padTrick=!!pad?.buttons[2]?.pressed&&!this.padButtons.has(2),padItem=!!pad?.buttons[4]?.pressed&&!this.padButtons.has(4);
    if (pad) {
      if(pad.buttons.some(b=>b.pressed)||pad.axes.some(a=>Math.abs(a)>.2))this.device='gamepad';
      for (const [button, action] of [[9, 'gamepad-menu'], [3, 'recover']] as const) {
        if (pad.buttons[button]?.pressed && !this.padButtons.has(button)) this.onAction(action);
      }
      this.padButtons = new Set(pad.buttons.flatMap((b, i) => b.pressed ? [i] : []));
    }
    if(!pad)this.padButtons.clear();
    if (!this.enabled) {this.pressed.clear();return neutralInput();}
    if(padTrick)this.pressed.add('trick');if(padItem)this.pressed.add('item');
    const has = (...codes: string[]) => codes.some(c => this.keys.has(c));
    const axis = pad ? pad.axes[0] : 0,touch=this.mobile?.read()??neutralInput();
    return {
      throttle: Math.max(touch.throttle,has('KeyW', 'ArrowUp') ? 1 : 0, pad?.buttons[7]?.value ?? 0, pad?.buttons[0]?.pressed ? 1 : 0),
      brake: Math.max(touch.brake,has('KeyS', 'ArrowDown') ? 1 : 0, pad?.buttons[6]?.value ?? 0),
      steer: has('KeyA', 'ArrowLeft') ? -1 : has('KeyD', 'ArrowRight') ? 1 : Math.abs(axis) > 0.15 ? axis : touch.steer,
      drift: touch.drift||has('Space', 'ShiftLeft', 'ShiftRight') || !!pad?.buttons[5]?.pressed,
      lookBehind:touch.lookBehind||has('KeyC')||!!pad?.buttons[10]?.pressed,
      trick:consume?this.pressed.delete('trick'):this.pressed.has('trick'),item:consume?this.pressed.delete('item'):this.pressed.has('item'),
    };
  }
}
