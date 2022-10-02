import { IEventDispatcher } from "./IEventDispatcher";
import { AEvent } from "./AEvent";
	
export class EventDispatcher extends Object implements IEventDispatcher
{
	protected listeners:any = {};
	
	constructor(target:IEventDispatcher = null)
	{
		super();
		if (target) this.ctor(target);
	}
	
	private static trimHeaderValue(headerValue:string):string
	{
		var currChar:string = null;
		var indexOfFirstValueChar:number = 0;
		var headerValueLen:number = headerValue.length;
		var done:boolean = false;
		while (indexOfFirstValueChar < headerValueLen && !done)
		{
			currChar = headerValue.charAt(indexOfFirstValueChar);
			done = currChar != " " && currChar != "\t";
			if (!done)
			{
				indexOfFirstValueChar++;
			}
		}
		var indexOfLastValueChar:number = headerValueLen;
		done = false;
		while (indexOfLastValueChar > indexOfFirstValueChar && !done)
		{
			currChar = headerValue.charAt(indexOfLastValueChar - 1);
			done = currChar != " " && currChar != "\t";
			if (!done)
			{
				indexOfLastValueChar--;
			}
		}
		return headerValue.substring(indexOfFirstValueChar, indexOfLastValueChar);
	}
	
	private ctor(param1:IEventDispatcher):void
	{
		// TODO
	}
	
	public addEventListener = (type:string, listener:Function, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false):void =>
	{
		if (this.listeners[type] == undefined) this.listeners[type] = [];
		
		var funcs:Function[] = this.listeners[type];
		var i:number = funcs.indexOf(listener);
		if (i != -1) funcs.splice(i, 1);
		funcs.push(listener);
	}
	
	public removeEventListener = (type:string, listener:Function, useCapture:boolean = false):void =>
	{
		var funcs:Function[] = this.listeners[type];
		if (funcs)
		{
			var i:number = funcs.indexOf(listener);
			if (i != -1) funcs.splice(i, 1);
			if (funcs.length === 0)
			{
				this.listeners[type] = null;
				delete this.listeners[type];
			}
		}
	}
	
	public dispatchEvent(event:AEvent):boolean
	{
		if (event.target)
		{
			return this.dispatchEventFunction(event.clone());
		}
		return this.dispatchEventFunction(event);
	}
	
	public hasEventListener = (type:string):boolean =>
	{
		return this.listeners[type] != null;
	}
	
	public willTrigger(param1:string):boolean  { return false }
	
	protected dispatchEventFunction = (event:AEvent):boolean =>
	{
		event.target = this;
		event.currentTarget = this;
		var foundFunc:boolean = false;
		var funcs:Function[] = this.listeners[event.type];

		if (funcs)
		{
			var len:number = funcs.length;
			for (var i:number = 0; i < len; i++)
			{
				var func:Function = funcs[i];
				if (func)
				{
					func(event);
					foundFunc = true;
				} 
			}
		}
		return foundFunc;
	}
}