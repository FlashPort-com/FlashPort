import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D.js";
import { ColorTransform } from "../geom/ColorTransform.js";
	
export interface IGraphicsData
{
	draw (ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void;
	gldraw (glctx:GLCanvasRenderingContext2D,colorTransform:ColorTransform):void;
}