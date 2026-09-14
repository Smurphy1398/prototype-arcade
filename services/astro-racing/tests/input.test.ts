import test from 'node:test';
import assert from 'node:assert/strict';
import { Input,neutralInput } from '../src/core/Input';
test('pause/focus input clearing consumes one-shot items and updates hints only on device activity',()=>{
 const previous={window:globalThis.window,document:globalThis.document,input:globalThis.HTMLInputElement,select:globalThis.HTMLSelectElement,button:globalThis.HTMLButtonElement,pad:Object.getOwnPropertyDescriptor(navigator,'getGamepads')};
 const w=new EventTarget(),d=new EventTarget(),actions:string[]=[];let pad:any=null;
 globalThis.window=w as unknown as Window&typeof globalThis;globalThis.document=d as unknown as Document;globalThis.HTMLInputElement=class{} as any;globalThis.HTMLSelectElement=class{} as any;globalThis.HTMLButtonElement=class{} as any;
 Object.defineProperty(navigator,'getGamepads',{value:()=>pad?[pad]:[],configurable:true});
 try{const input=new Input(a=>actions.push(a));input.enabled=true;
  const key=(code:string)=>{const e=new Event('keydown');Object.assign(e,{code,repeat:false});w.dispatchEvent(e);};
  key('KeyW');key('KeyQ');key('KeyC');assert.equal(input.read().item,true);assert.equal(input.read().item,false);assert.equal(input.read().throttle,1);assert.equal(input.read().lookBehind,true);
  w.dispatchEvent(new Event('blur'));assert.deepEqual(input.read(),{...neutralInput(),item:false,trick:false,lookBehind:false});assert.ok(actions.includes('blur'));
  pad={connected:true,axes:[0],buttons:Array.from({length:10},()=>({pressed:false,value:0}))};input.read();assert.equal(input.device,'keyboard');pad.buttons[4].pressed=true;assert.equal(input.read().item,true);assert.equal(input.device,'gamepad');
  input.enabled=false;input.clear();assert.deepEqual(input.read(),neutralInput());input.enabled=true;assert.equal(input.read().item,false,'held gamepad item cannot fire again across a pause');
  pad=null;key('KeyE');assert.equal(input.device,'keyboard');assert.equal(input.read().trick,true);
 }finally{globalThis.window=previous.window;globalThis.document=previous.document;globalThis.HTMLInputElement=previous.input;globalThis.HTMLSelectElement=previous.select;globalThis.HTMLButtonElement=previous.button;if(previous.pad)Object.defineProperty(navigator,'getGamepads',previous.pad);else delete (navigator as any).getGamepads;}
});
