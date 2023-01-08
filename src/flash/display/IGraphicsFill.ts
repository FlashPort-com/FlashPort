import { Canvas, Paint } from "canvaskit-wasm";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";

export interface IGraphicsFill
{
	paint:Paint
    skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void
}