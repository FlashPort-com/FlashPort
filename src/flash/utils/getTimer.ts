import { FPConfig } from "../../FPConfig";
	
export function getTimer():number
{
	return Date.now() - FPConfig.startTime;
}