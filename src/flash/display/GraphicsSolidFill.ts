import { IGraphicsFill } from "./IGraphicsFill";
import { IGraphicsData } from "./IGraphicsData";
import { FlashPort } from "../../FlashPort";

import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D";
import { ColorTransform } from "../geom/ColorTransform";
	
export class GraphicsSolidFill extends Object implements IGraphicsFill, IGraphicsData
{
	public color:number = 0x000000;
	
	public alpha:number = 1.0;
	private cssColor:string;
	public _glcolor:any[] = [];
	constructor(color:number = 0x000000, alpha:number = 1.0){
		super();
		this.color = color;
		this.alpha = alpha;
		this.cssColor = "rgba(" + (color >> 16 & 0xff) + "," + (color >> 8 & 0xff) + "," + (color & 0xff) + "," + this.alpha + ")";
	}
	
	public draw(ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void
	{
		ctx.fillStyle = FlashPort.renderer.getCssColor(this.color,this.alpha, colorTransform,null).toString();
	}
	
	public gldraw(ctx:GLCanvasRenderingContext2D, colorTransform:ColorTransform):void
	{
		ctx.fillStyle = FlashPort.renderer.getCssColor(this.color, this.alpha, colorTransform, this._glcolor)//_glcolor as String; 
		ctx.fillStyleIsImage = false;
	}
}