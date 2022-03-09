import { IGraphicsPath } from "./IGraphicsPath.js";
import { IGraphicsData } from "./IGraphicsData.js";

import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D.js";
import { ColorTransform } from "../geom/ColorTransform.js";

export class GraphicsTrianglePath extends Object implements IGraphicsPath, IGraphicsData
{
	
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
	/*if(culling != TriangleCulling.NONE && culling != TriangleCulling.POSITIVE && culling != TriangleCulling.NEGATIVE)
		{
		Error.throwError(null,2008,"culling");
		}*/
	}
	
	public get culling():string
	{
		return this._culling;
	}
	
	public set culling(value:string)
	{
		/* if(value != TriangleCulling.NONE && value != TriangleCulling.POSITIVE && value != TriangleCulling.NEGATIVE)
			{
			Error.throwError(null,2008,"culling");
			}*/
		this._culling = value;
	}
	
	public draw(ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void
	{
		console.log("tripath");
	}
	public gldraw(ctx:GLCanvasRenderingContext2D, colorTransform:ColorTransform):void{
		
	}
}