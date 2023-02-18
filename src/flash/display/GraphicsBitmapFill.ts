import { IGraphicsFill } from "./IGraphicsFill";
import { IGraphicsData } from "./IGraphicsData";
import { BitmapData } from "./BitmapData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Canvas, Paint, Path } from "canvaskit-wasm";
	
export class GraphicsBitmapFill extends Object implements IGraphicsFill, IGraphicsData
{
	public paint: Paint;
	public graphicType:string = "FILL";
	public path:Path;
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
			this.pattern = ctx.createPattern(this.bitmapData.imageSource as HTMLCanvasElement, this.repeat ? "repeat" : "no-repeat");
		}
		
		ctx.fillStyle = this.pattern;
	}

	public skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void
	{

	}
}