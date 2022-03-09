import { Timer } from "./Timer";
import { TimerEvent } from "../events/TimerEvent.js";

export class SetIntervalTimer extends Timer
{
	
	private static intervals:any[] = [];
	
	public id:number;
	
	private closure:Function;
	
	private rest:any[];
	
	constructor(closure:Function, delay:number, repeats:boolean, rest:any[]){
		super(delay, repeats ? 0 : 1);
		this.closure = closure;
		this.rest = rest;
		this.addEventListener(TimerEvent.TIMER, this.onTimer);
		this.start();
		this.id = SetIntervalTimer.intervals.length + 1;
		SetIntervalTimer.intervals.push(this);
	}
	
	public static clearInterval(id_to_clear:number):void
	{
		id_to_clear--;
		if (SetIntervalTimer.intervals[id_to_clear] instanceof SetIntervalTimer)
		{
			SetIntervalTimer.intervals[id_to_clear].stop();
			delete SetIntervalTimer.intervals[id_to_clear];
		}
	}
	
	private onTimer(event:Event):void
	{
		this.closure.apply(null, this.rest);
		if (this.repeatCount === 1)
		{
			if (SetIntervalTimer.intervals[this.id - 1] == this)
			{
				delete SetIntervalTimer.intervals[this.id - 1];
			}
		}
	}
}