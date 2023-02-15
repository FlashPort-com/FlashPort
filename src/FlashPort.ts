import { CanvasKit } from "canvaskit-wasm";

export class FlashPort 
{
	public static stageWidth:number = 800;
	public static stageHeight:number = 600;
	public static autoSize:boolean = false;
	public static startTime:number = 0;
	public static drawCounter:number;
	public static batDrawCounter:number;
	public static debug:boolean = false;
	public static rootHTMLElement:HTMLElement;
	public static renderer:any;
	public static canvasKit:CanvasKit;
	public static dirtyGraphics:Boolean = true;
	
	// assets
	public static images:object = {};
	public static sounds:object = {};
	public static videos:object = {};
	public static fonts:object = {};
	
	public static requestAnimationFrame:Function =
		window["requestAnimationFrame"]       ||
		window["webkitRequestAnimationFrame"] ||
		window["mozRequestAnimationFrame"]    ||
		window["oRequestAnimationFrame"] ||
		window["msRequestAnimationFrame"] ||
		function(callback:Function):void {
			window["setTimeout"](callback, 1000 / 60);
		};
}