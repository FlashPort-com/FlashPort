import { setIntervalJS } from "./__js/setIntervalJS";
export function setInterval(closure:Function, delay:number):number
{
	return setIntervalJS(closure,delay);
}