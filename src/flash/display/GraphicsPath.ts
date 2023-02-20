import { IGraphicsPath } from "./IGraphicsPath";
import { IGraphicsData } from "./IGraphicsData";
import { GraphicsPathCommand } from "./GraphicsPathCommand";
import { ColorTransform } from "../geom/ColorTransform";
import { Canvas, Paint, Path } from "canvaskit-wasm";
import { FPConfig } from "../../FPConfig";
import { Matrix } from "../geom";
	
export class GraphicsPath extends Object implements IGraphicsPath, IGraphicsData
{
	public paint: Paint;
	public path: Path;
	public isMask:Boolean = false;
	public graphicType:string = "PATH";
	public pathDirty:boolean = false;
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
		
		this._winding = winding;
		this.path = new FPConfig.canvasKit.Path();
	}
	
	public clear = ():void => {
		this.commands.length = 0;
		this.data.length = 0;
		this.tris.length = 0;
		this.pathDirty = true;
	}
	
	public get winding():string
	{
		return this._winding;
	}
	
	public set winding(value:string)
	{
		this._winding = value;
	}
	
	public moveTo = (x:number, y:number):void =>
	{
		this.commands.push(GraphicsPathCommand.MOVE_TO);
		this.data.push(x, y);
		this.pathDirty = true;
	}
	
	public lineTo = (x:number, y:number):void =>
	{
		this.commands.push(GraphicsPathCommand.LINE_TO);
		this.data.push(x, y);
		this.pathDirty = true;
	}
	
	public curveTo = (controlX:number, controlY:number, anchorX:number, anchorY:number):void =>
	{
		this.commands.push(GraphicsPathCommand.CURVE_TO);
		this.data.push(controlX, controlY, anchorX, anchorY);
		this.pathDirty = true;
	}
	
	public cubicCurveTo = (controlX1:number, controlY1:number, controlX2:number, controlY2:number, anchorX:number, anchorY:number):void =>
	{
		this.commands.push(GraphicsPathCommand.CUBIC_CURVE_TO);
		this.data.push(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
		this.pathDirty = true;
	}
	
	public wideLineTo = (x:number, y:number):void =>
	{
		this.commands.push(GraphicsPathCommand.WIDE_LINE_TO);
		this.data.push(0.0, 0.0, x, y);
		this.pathDirty = true;
	}
	
	public wideMoveTo = (x:number, y:number):void =>
	{
		this.commands.push(GraphicsPathCommand.WIDE_MOVE_TO);
		this.data.push(0.0, 0.0, x, y);
		this.pathDirty = true;
	}
	
	public arc = (x:number, y:number,r:number,a0:number,a1:number):void =>
	{
		this.commands.push(GraphicsPathCommand.ARC);
		this.data.push(x,y,r,a0,a1);
		this.pathDirty = true;
	}
	
	public draw = (ctx:CanvasRenderingContext2D, colorTransform:ColorTransform):void =>
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
	
	public skiaDraw = (ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void =>
	{
		if (this.pathDirty && this.commands.length) 
		{
			this.path.reset();
			this.pathDirty = false;
			
			var p:number = 0;
			var trip:number = 0;
			var len:number = this.commands.length;
			for (var i:number = 0; i < len;i++ ){
				var cmd:number = this.commands[i];
				switch (cmd)
				{
				case GraphicsPathCommand.MOVE_TO: 
					this.path.moveTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.LINE_TO: 
					this.path.lineTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.CURVE_TO: 
					this.path.quadTo(this.data[p++], this.data[p++], this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.CUBIC_CURVE_TO: 
					this.path.cubicTo(this.data[p++], this.data[p++], this.data[p++], this.data[p++], this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.WIDE_MOVE_TO:
					p += 2;
					this.path.moveTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.WIDE_LINE_TO: 
					p += 2;
					this.path.lineTo(this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.ARC: 
					this.path.arc(this.data[p++], this.data[p++], this.data[p++], this.data[p++], this.data[p++]);
					break;
				case GraphicsPathCommand.CLOSE_PATH: 
					this.path.close();
					break;
				}
			}
		}
	}
	
	public closePath = ():void =>
	{
		this.commands.push(GraphicsPathCommand.CLOSE_PATH);
		this.pathDirty = true;
	}
	
	public drawTriangles = (vertices:number[], indices:number[], uvtData:number[]):void =>
	{
		this.tris.push([vertices, indices, uvtData]);
		this.commands.push(GraphicsPathCommand.DRAW_TRIANGLES);
		this.pathDirty = true;
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