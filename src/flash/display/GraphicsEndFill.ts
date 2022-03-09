import { IGraphicsFill } from "./IGraphicsFill.js";
import { IGraphicsData } from "./IGraphicsData.js";
import { GraphicsBitmapFill } from "./GraphicsBitmapFill.js";

import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D.js";
import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";

export class GraphicsEndFill extends Object implements IGraphicsFill, IGraphicsData
{
	public fill:IGraphicsFill;
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
	
	public gldraw(ctx:GLCanvasRenderingContext2D, colorTransform:ColorTransform):void{
		if (this.fill) {
			/*if(fill is GraphicsBitmapFill){
				var bfill:GraphicsBitmapFill = fill as GraphicsBitmapFill;
				if (bfill.matrix) {
					var m:Matrix = bfill.matrix;
				}
				ctx.globalAlpha = colorTransform.alphaMultiplier;
			}else{
				ctx.globalAlpha = 1;
			}*/
			var m:Matrix = this.fill["matrix"];
			if(m){
				//ctx.save();
				this._worldMatrix.copyFrom(m);
			}else{
				this._worldMatrix.identity();
			}
			var temp:Matrix = ctx.matr;
			ctx.transform2(this._worldMatrix);
			ctx.fill();
			ctx.matr = temp;
			//if (m) {
				//ctx.restore();
			//}
		}
	}
}