import { AEvent } from "./AEvent";
export class TimerEvent extends AEvent
{
	
	public static TIMER:string = "timer";
	
	public static TIMER_COMPLETE:string = "timerComplete";
	
	constructor(type:string, bubbles:boolean = false, cancelable:boolean = false){
		super(type, bubbles, cancelable);
	}
	
	/*override*/ public clone():AEvent
	{
		return new TimerEvent(this.type, this.bubbles, this.cancelable);
	}
	
	/*override*/ public toString():string
	{
		return this.formatToString("TimerEvent", "type", "bubbles", "cancelable", "eventPhase");
	}
	
	public updateAfterEvent():void
	{
	
	}
}