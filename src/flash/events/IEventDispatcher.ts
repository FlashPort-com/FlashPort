import { AEvent } from "./AEvent";

export interface IEventDispatcher
{
	addEventListener(type:string, listener:Function, useCapture?:boolean, priority?:number, useWeakReference?:boolean):void;
	dispatchEvent(event:AEvent):boolean;
	hasEventListener(type:string):boolean;
	removeEventListener(type:string, listener:Function, useCapture?:boolean):void;
	willTrigger(type:string):boolean;
}