import { IGraphicsFill } from "./IGraphicsFill";
import { IGraphicsData } from "./IGraphicsData";
import { GraphicsBitmapFill } from "./GraphicsBitmapFill";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Canvas, Paint, Path } from "canvaskit-wasm";

export class GraphicsEndFill extends Object implements IGraphicsFill, IGraphicsData
{
	public paint: Paint;
	public path:Path;
	public fill:IGraphicsFill;
	public graphicType:string = "FILL";
	public _worldMatrix:Matrix = new Matrix;

	constructor(){
		super();
	}
	
	public draw(ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void
	{
		if (this.fill) {
			if(this.fill instanceof GraphicsBitmapFill){
				var bfill:GraphicsBitmapFill = (<GraphicsBitmapFill>this.fill );
				if (bfill.matrix) {
					var m:Matrix = bfill.matrix;
				}
				ctx.globalAlpha = colorTransform.alphaMultiplier;
			}else{
				ctx.globalAlpha = 1;
			}
			if(m){
				ctx.save();
				ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
			}
			ctx.fill();
			if (m) {
				ctx.restore();
			}
		}
	}

	public skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void
	{
		
	}
}