import { IGraphicsPath } from "./IGraphicsPath";
import { IGraphicsData } from "./IGraphicsData";
import { GraphicsPathCommand } from "./GraphicsPathCommand";

import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D";
import { GLPath2D } from "../__native/GLPath2D";
import { ColorTransform } from "../geom/ColorTransform";
	
export class GraphicsPath extends Object implements IGraphicsPath, IGraphicsData
{
	public gpuPath2DDirty:boolean = true;
	
	public commands:any[] = [];
	
	public data:any[] = [];
	
	public tris:any[] = [];
	
	private _winding:string;
	
	constructor(commands:any[] = null, data:any[] = null, winding:string = "evenOdd"){
		super();
		this.commands = commands;
		this.data = data;
		if (this.commands == null){
			this.commands = [];
		}
		if (this.data==null){
			this.data = [];
		}
		/*if(winding != GraphicsPathWinding.EVEN_ODD && winding != GraphicsPathWinding.NON_ZERO)
			{
			Error.throwError(null,2008,"winding");
			}*/
		this._winding = winding;
	}
	
	public clear = ():void => {
		this.commands.length = 0;
		this.data.length = 0;
		this.tris.length = 0;
	}
	
	public get winding():string
	{
		return this._winding;
	}
	
	public set winding(value:string)
	{
		/*if(value != GraphicsPathWinding.EVEN_ODD && value != GraphicsPathWinding.NON_ZERO)
			{
			Error.throwError(null,2008,"winding");
			}*/
		this._winding = value;
	}
	
	public moveTo = (x:number, y:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.MOVE_TO);
		this.data.push(x, y);
	}
	
	public lineTo = (x:number, y:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.LINE_TO);
		this.data.push(x, y);
	}
	
	public curveTo = (controlX:number, controlY:number, anchorX:number, anchorY:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.CURVE_TO);
		this.data.push(controlX, controlY, anchorX, anchorY);
	}
	
	public cubicCurveTo = (controlX1:number, controlY1:number, controlX2:number, controlY2:number, anchorX:number, anchorY:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.CUBIC_CURVE_TO);
		this.data.push(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
	}
	
	public wideLineTo = (x:number, y:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.WIDE_LINE_TO);
		this.data.push(0.0, 0.0, x, y);
	}
	
	public wideMoveTo = (x:number, y:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.WIDE_MOVE_TO);
		this.data.push(0.0, 0.0, x, y);
	}
	
	public arc = (x:number, y:number,r:number,a0:number,a1:number):void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.ARC);
		this.data.push(x,y,r,a0,a1);
	}
	
	/*private function initData():void {
		if (this.commands == null)
		{
			this.commands = new Vector.<int>();
		}
		if (this.data == null)
		{
			this.data = new Vector.<Number>();
		}
	}*/
	
	public draw = (ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void =>
	{
		if (this.commands.length) {
			ctx.beginPath();
			var p:number = 0;
			var trip:number = 0;
			var len:number = this.commands.length;
			for (var i:number = 0; i < len;i++ ){
				var cmd:number = this.commands[i];
				switch (cmd)
				{
				case GraphicsPathCommand.MOVE_TO: 
					ctx.moveTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.LINE_TO: 
					ctx.lineTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.CURVE_TO: 
					ctx.quadraticCurveTo(this.data[p++], this.data[p++], this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.CUBIC_CURVE_TO: 
					ctx.bezierCurveTo(this.data[p++], this.data[p++], this.data[p++], this.data[p++], this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.WIDE_MOVE_TO:
					p += 2;
					ctx.moveTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.WIDE_LINE_TO: 
					p += 2;
					ctx.lineTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.ARC: 
					ctx.arc(this.data[p++], this.data[p++], this.data[p++], this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.DRAW_TRIANGLES: 
					this.doDrawTriangles( this.tris[trip++],ctx);
					break;
				case GraphicsPathCommand.CLOSE_PATH: 
					ctx.closePath();
					break;
				}
			}
		}
	}
	
	public gldraw = (ctx:GLCanvasRenderingContext2D, colorTransform:ColorTransform):void =>
	{
		ctx.drawPath(this, colorTransform);
	}
	
	public closePath = ():void =>
	{
		//initData();
		this.commands.push(GraphicsPathCommand.CLOSE_PATH);
	}
	
	public drawTriangles = (vertices:number[], indices:number[], uvtData:number[]):void =>
	{
		this.tris.push([vertices, indices, uvtData]);
		this.commands.push(GraphicsPathCommand.DRAW_TRIANGLES);
	}
	
	private doDrawTriangles = (tri:any[],ctx:CanvasRenderingContext2D):void =>
	{
		var vertices:number[] = tri[0]
		var indices:number[] = tri[1];
		//, uvtData
		var len:number = (<number>indices.length );
		for (var i:number = 0; i < len; ){
			var i0:number = indices[i++];
			var i1:number = indices[i++];
			var i2:number = indices[i++];
			var x0:number = vertices[2*i0];
			var y0:number = vertices[2*i0+1];
			var x1:number = vertices[2*i1];
			var y1:number = vertices[2*i1+1];
			var x2:number = vertices[2*i2];
			var y2:number = vertices[2 * i2 + 1];
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x0, y0);
		}
	}
}