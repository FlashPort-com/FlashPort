import { SetIntervalTimer } from "./SetIntervalTimer";

export function clearTimeout(id:number):void
{
	SetIntervalTimer.clearInterval(id);
}