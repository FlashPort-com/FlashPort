import { IGraphicsFill } from "./IGraphicsFill.js";
import { IGraphicsData } from "./IGraphicsData.js";
import { BitmapData } from "./BitmapData.js";
import { GLCanvasRenderingContext2D } from "../../flash/__native/GLCanvasRenderingContext2D.js";
import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";
	
export class GraphicsBitmapFill extends Object implements IGraphicsFill, IGraphicsData
{
	
	public bitmapData:BitmapData;
	
	public matrix:Matrix;
	
	public repeat:boolean;
	
	public smooth:boolean;
	
	private pattern:CanvasPattern;
	
	constructor(bitmapData:BitmapData = null, matrix:Matrix = null, repeat:boolean = true, smooth:boolean = false){
		super();
		this.bitmapData = bitmapData;
		this.matrix = matrix;
		this.repeat = repeat;
		this.smooth = smooth;
	}
	
	public draw(ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void
	{
		if (!this.pattern && this.bitmapData) {
			this.pattern = ctx.createPattern(this.bitmapData.image, this.repeat ? "repeat" : "no-repeat");
		}
		
		ctx.fillStyle = this.pattern;
	}
	
	public gldraw(ctx:GLCanvasRenderingContext2D, colorTransform:ColorTransform):void
	{
		if (this.pattern==null && this.bitmapData) {
			this.pattern = ctx.createPattern(this.bitmapData.image, this.repeat ? "repeat" : "no-repeat");
		}
		ctx.fillStyleIsImage = true;
		ctx.fillStyle = this.pattern.toString();
	}
}