import { IGraphicsPath } from "./IGraphicsPath";
import { IGraphicsData } from "./IGraphicsData";
import { ColorTransform } from "../geom/ColorTransform";
import { Canvas, Paint, Path } from "canvaskit-wasm";
import { Matrix } from "../geom";

export class GraphicsTrianglePath extends Object implements IGraphicsPath, IGraphicsData
{
	public paint:Paint;
	public graphicType:string = "PATH";
	public path:Path;

	public indices:number[];
	public vertices:number[];
	public uvtData:number[];
	private _culling:string;
	
	constructor(vertices:number[] = null, indices:number[] = null, uvtData:number[] = null, culling:string = "none"){
		super();
		this.vertices = vertices;
		this.indices = indices;
		this.uvtData = uvtData;
		this._culling = culling;
	}
	
	public get culling():string
	{
		return this._culling;
	}
	
	public set culling(value:string)
	{
		this._culling = value;
	}
	
	public draw(ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void
	{
		console.log("tripath");
	}
	
	public skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void
	{
		
	}
}