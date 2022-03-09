import { FlashPort } from "../../FlashPort.js";
	
export function getTimer():number
{
	return Date.now() - FlashPort.startTime;
}