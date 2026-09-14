/** Local profile only. Future account linking belongs to Prototype Arcade. */
export interface LocalProfile {id:'local-player';displayName:string;difficulty:'easy'|'normal'|'hard'}
export const cleanName=(name:unknown)=>typeof name==='string'?Array.from(name.replace(/[<>\u0000-\u001f\u007f]/g,'').trim()).slice(0,20).join(''):'';
export const escapeText=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function loadProfile(storage?:Pick<Storage,'getItem'>):LocalProfile {let raw:any;try{raw=JSON.parse((storage??localStorage).getItem('astro-profile-v4')??'null');}catch{}return {id:'local-player',displayName:cleanName(raw?.displayName),difficulty:['easy','normal','hard'].includes(raw?.difficulty)?raw.difficulty:'normal'};}
export function saveProfile(profile:LocalProfile,storage?:Pick<Storage,'setItem'>){try{(storage??localStorage).setItem('astro-profile-v4',JSON.stringify({...profile,id:'local-player',displayName:cleanName(profile.displayName)}));return true;}catch{return false;}}
