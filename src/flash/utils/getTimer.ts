import { FlashPort } from "../../FlashPort";
	
export function getTimer():number
{
	return Date.now() - FlashPort.startTime;
}