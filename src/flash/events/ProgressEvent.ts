import { AEvent } from "./AEvent.js";
export class ProgressEvent extends AEvent
{
	
	public static PROGRESS:string = "progress";
	
	public static SOCKET_DATA:string = "socketData";
	
	private m_bytesLoaded:number;
	
	private m_bytesTotal:number;
	
	constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, bytesLoaded:number = 0, bytesTotal:number = 0){
		super(type, bubbles, cancelable);
		this.m_bytesLoaded = bytesLoaded;
		this.m_bytesTotal = bytesTotal;
	}
	
	/*override*/ public clone():AEvent
	{
		return new ProgressEvent(this.type, this.bubbles, this.cancelable, this.m_bytesLoaded, this.m_bytesTotal);
	}
	
	/*override*/ public toString():string
	{
		return this.formatToString("ProgressEvent", "type", "bubbles", "cancelable", "eventPhase", "bytesLoaded", "bytesTotal");
	}
	
	public get bytesLoaded():number
	{
		return this.m_bytesLoaded;
	}
	
	public set bytesLoaded(value:number)
	{
		this.m_bytesLoaded = value;
	}
	
	public get bytesTotal():number
	{
		return this.m_bytesTotal;
	}
	
	public set bytesTotal(value:number)
	{
		this.m_bytesTotal = value;
	}
}