import { SetIntervalTimer } from "./SetIntervalTimer.js";

export function clearTimeout(id:number):void
{
	SetIntervalTimer.clearInterval(id);
}