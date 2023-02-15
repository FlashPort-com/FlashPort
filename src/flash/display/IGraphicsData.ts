import { ColorTransform } from "../geom/ColorTransform";
import { Canvas, Paint, Path } from "canvaskit-wasm";
import { Matrix } from "../geom";
	
export interface IGraphicsData
{
	graphicType:string;
	paint:Paint;
	path:Path;
	draw (ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void;
	skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void;
}