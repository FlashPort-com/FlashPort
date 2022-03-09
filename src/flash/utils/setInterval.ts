import { setIntervalJS } from "./__js/setIntervalJS.js";
export function setInterval(closure:Function, delay:number):number
{
	return setIntervalJS(closure,delay);
}