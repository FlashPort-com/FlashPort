import { SetIntervalTimer } from "./SetIntervalTimer";

export function setTimeout(closure:Function, delay:number, ... args):number
{
	return new SetIntervalTimer(closure, delay, false, args).id;
}

