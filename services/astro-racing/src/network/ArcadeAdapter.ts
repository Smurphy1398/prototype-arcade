/** This is an internal adapter contract, not an invented remote API. The default
 * guest provider makes no requests. Supply the actual Arcade contract later. */
export interface ArcadeIdentity {subject:string;displayName:string;verified:boolean;cosmetics:string[]}
export interface ValidatedRaceResult {raceId:string;contentVersion:string;physicsVersion:string;course:string;mode:'guest';rules:{laps:3;difficulty:string;assists:string[]};serverTime:string;entrants:{subject?:string;guestId:string;finishTime:number;lapTimes:number[];body:string;tires:string}[]}
export interface ArcadeAdapter {
 identity():Promise<ArcadeIdentity|null>;
 // Implement only on the trusted server with idempotency by raceId.
 submitValidatedResult?(result:ValidatedRaceResult):Promise<void>;
}
export const guestArcade:ArcadeAdapter={async identity(){return null;}};
