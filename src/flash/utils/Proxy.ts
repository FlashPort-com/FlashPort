import { EventDispatcher } from "../events/EventDispatcher.js";

export class Proxy extends EventDispatcher
{
	
	private valueMap:Object = {};
	
	public getProperty(propName:any):any
	{
		return this.valueMap[propName];
	}
	
	public setProperty(propName:any, value:any):void
	{
		this.valueMap[propName] = value;
	}
	
	public hasProperty(propName:any):boolean
	{
		return this.valueMap.hasOwnProperty(propName);
	}
	
	public deleteProperty(propName:any):void
	{
		delete this.valueMap[propName];
	}
	
	public elementNames():any[]
	{
		var names:any[] = [];
		for (var p in this.valueMap)
			names.push(p);
		return names;
	}
}