export interface IStage 
{
	addEventListener(type:string, listener:Function, useCapture?:boolean, priority?:number, useWeakReference?:boolean):void; 
	removeEventListener(type:string, listener:Function, useCapture?:boolean):void; 
	//function dispatchEvent(event:Event):Boolean; 
	hasEventListener(type:string):boolean; 
	willTrigger(type:string):boolean;
	
	x:number;
	y:number;
	z:number;
	
	mouseX:number;
	mouseY:number;
	stageWidth:number;
	stageHeight:number;
	
	ctx:CanvasRenderingContext2D;
}