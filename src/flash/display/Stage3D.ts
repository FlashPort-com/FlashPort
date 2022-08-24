import { EventDispatcher } from "../events/EventDispatcher";
import { AEvent } from "../events/AEvent";
import { Context3D } from "../display3D/Context3D";
import { Stage } from "./Stage";

export class Stage3D extends EventDispatcher
{
	public __stage:Stage;
	public canvas:HTMLCanvasElement;
	private _context3D:Context3D;
	private static ID:number = 0;
	private id:number;

	constructor(){
		super();

		this.id = Stage3D.ID++;

		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.style.left = "0px";
		this.canvas.style.top = "0px";
		this.canvas.style.zIndex = (this.id - 20).toString();
	}
	
	public get context3D():Context3D  { return this._context3D }
	
	public requestContext3D(param1:string = "auto", param2:string = "baseline"):void
	{
		if (!this._context3D)
		{
			this.__stage.__rootHtmlElement.appendChild(this.canvas);
			this._context3D = new Context3D();
			this._context3D.canvas = this.canvas;
			this._context3D.gl = (<WebGLRenderingContext>(this.canvas.getContext("webgl",{alpha:false,antialias:false}) || this.canvas.getContext("experimental-webgl",{alpha:false,antialias:false})) );
		}
		this.dispatchEvent(new AEvent(AEvent.CONTEXT3D_CREATE));
	}
	
	public requestContext3DMatchingProfiles(param1:string[]):void
	{
		this.requestContext3D();
	}
	
	public get x():number  { return 0 }
	
	public set x(param1:number)
	{
	}
	
	public get y():number  { return 0 }
	
	public set y(param1:number)
	{
	}
	
	public get visible():boolean  { return false }
	
	public set visible(param1:boolean)
	{
	}
}