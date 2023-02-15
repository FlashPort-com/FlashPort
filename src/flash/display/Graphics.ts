import { IGraphicsData } from "./IGraphicsData";
import { GraphicsGradientFill } from "./GraphicsGradientFill";
import { GraphicsStroke } from "./GraphicsStroke";
import { IGraphicsFill } from "./IGraphicsFill";
import { GraphicsPath } from "./GraphicsPath";
import { FlashPort } from "../../FlashPort";
import { GraphicsSolidFill } from "./GraphicsSolidFill";
import { BitmapData } from "./BitmapData";
import { GraphicsBitmapFill } from "./GraphicsBitmapFill";
import { GraphicsEndFill } from "./GraphicsEndFill";
import { IGraphicsPath } from "./IGraphicsPath";
import { GraphicsTrianglePath } from "./GraphicsTrianglePath";
import { IGraphicsStroke } from "./IGraphicsStroke";

import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Rectangle } from "../geom/Rectangle";
import { Vector3D } from "../geom/Vector3D";
import { Canvas } from "canvaskit-wasm";
import { IRenderer } from "../__native/IRenderer";
import { BitmapFilter } from "../filters";

export class Graphics extends Object
{
	public static debug:boolean = false;
	
	public graphicsData:IGraphicsData[] = [];
	public gradientFills:Array<GraphicsGradientFill> = new Array<GraphicsGradientFill>();
	public lastStroke:GraphicsStroke;
	public lastFill:IGraphicsFill;
	private pathPool:any[] = [];
	private pathPoolPos:number = 0;
	private lastPath:GraphicsPath;
	private lastHalfThickness:number = 0;
	private _bound:Rectangle;
	private _rect:Rectangle;
	private lockBound:boolean = false;
	public _worldMatrix:Matrix = new Matrix;
	
	constructor(){
		super();
	}
	
	public clear = ():void =>
	{
		this.lastStroke = null;
		this.lastPath = null;
		this.pathPoolPos = 0;
		this.graphicsData = [];
		this._bound = null;
		FlashPort.dirtyGraphics = true;
	}
	
	public beginFill = (color:number, alpha:number = 1.0):void =>
	{
		this.endStrokAndFill();
		this.lastFill = new GraphicsSolidFill(color, alpha);
		this.graphicsData.push(this.lastFill as GraphicsSolidFill);
		
	}
	
	public beginGradientFill = (type:string, colors:any[], alphas:any[], ratios:any[], matrix:Matrix = null, spreadMethod:string = "pad", interpolationMethod:string = "rgb", focalPointRatio:number = 0):void =>
	{
		this.endStrokAndFill();
		this.lastFill = new GraphicsGradientFill(type, colors, alphas, ratios, this._bound, matrix, spreadMethod, interpolationMethod, focalPointRatio);
		this.graphicsData.push(this.lastFill as GraphicsGradientFill);
	}
	
	public beginBitmapFill = (bitmap:BitmapData, matrix:Matrix = null, repeat:boolean = true, smooth:boolean = false):void =>
	{
		this.endStrokAndFill();
		this.lastFill = new GraphicsBitmapFill(bitmap, matrix, repeat, smooth);
		this.graphicsData.push(this.lastFill as GraphicsBitmapFill);
	}
	
	public endStrokAndFill = ():void =>
	{
		if (this.lastPath)
		{
			if (this.lastFill)
			{
				var efill:GraphicsEndFill = new GraphicsEndFill();
				efill.fill = this.lastFill;
				this.graphicsData.push(efill);
				this.lastFill = null;
			}
			if (this.lastStroke && !isNaN(this.lastStroke.thickness))
			{
				this.lastStroke = new GraphicsStroke(NaN);
				this.lastHalfThickness = Math.ceil(this.lastStroke.thickness / 2);
				this.graphicsData.push(this.lastStroke);
			}
			this.lastPath = null;
		}
	}
	
	// public function beginShaderFill(param1:Shader, param2:Matrix = null) : void;
	
	public lineGradientStyle = (type:string, colors:any[], alphas:any[], ratios:any[], matrix:any = null, spreadMethod:string = "pad", interpolationMethod:string = "rgb", focalPointRatio:number = 0):void =>
	{
		if (this.lastStroke)
		{
			this.endFill();
			this.lastStroke.fill = new GraphicsGradientFill(type, colors, alphas, ratios, this._bound, matrix, spreadMethod, interpolationMethod, focalPointRatio);
		}
	}
	
	public lineStyle = (thickness:number = NaN, color:number = 0x000000, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void =>
	{
		this.endStrokAndFill();
		if (!isNaN(thickness))
		{
			thickness = (thickness === 0) ? 1 : (thickness < .5 ? .5 : thickness);
			alpha = alpha < .2 ? .2 : alpha;
			this.lastStroke = new GraphicsStroke(thickness, pixelHinting, scaleMode, (caps) ? caps : "round", (joints) ? joints : "round", miterLimit, new GraphicsSolidFill(color, alpha));
			this.lastHalfThickness = Math.ceil(this.lastStroke.thickness / 2);
			this.graphicsData.push(this.lastStroke);
		}
	}
	
	public drawRect = (x:number, y:number, width:number, height:number):void =>
	{
		this.lockBound = true;
		this.moveTo(x, y);
		this.lineTo(x + width, y);
		this.lineTo(x + width, y + height);
		this.lineTo(x, y + height);
		this.lastPath.closePath();
		this.lockBound = false;
		this.inflateBound(x, y);
		this.inflateBound(x + width, y + height);
	}
	
	public drawRoundRect = (x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight:number = NaN):void =>
	{
		this.lockBound = true;
		if (isNaN(ellipseHeight))
			ellipseHeight = ellipseWidth;
		this.moveTo(x + ellipseWidth, y);
		this.lineTo(x + width - ellipseWidth, y);
		this.curveTo(x + width, y, x + width, y + ellipseHeight);
		this.lineTo(x + width, y + height - ellipseHeight);
		this.curveTo(x + width, y + height, x + width - ellipseWidth, y + height);
		this.lineTo(x + ellipseWidth, y + height);
		this.curveTo(x, y + height, x, y + height - ellipseHeight);
		this.lineTo(x, y + ellipseHeight);
		this.curveTo(x, y, x + ellipseWidth, y);
		this.lockBound = false;
		this.inflateBound(x, y);
		this.inflateBound(x + width, y + height);
	}
	
	public drawRoundRectComplex = (x:number, y:number, width:number, height:number, topLeftRadius:number, topRightRadius:number, bottomLeftRadius:number, bottomRightRadius:number):void =>
	{
		this.lockBound = true;
		this.moveTo(x + topLeftRadius, y);
		this.lineTo(x + width - topRightRadius, y);
		this.curveTo(x + width, y, x + width, y + topRightRadius);
		this.lineTo(x + width, y + height - bottomRightRadius);
		this.curveTo(x + width, y + height, x + width - bottomRightRadius, y + height);
		this.lineTo(x + bottomLeftRadius, y + height);
		this.curveTo(x, y + height, x, y + height - bottomLeftRadius);
		this.lineTo(x, y + topLeftRadius);
		this.curveTo(x, y, x + topLeftRadius, y);
		this.lockBound = false;
		this.inflateBound(x, y);
		this.inflateBound(x + width, y + height);
	}
	
	public drawCircle = (x:number, y:number, radius:number):void =>
	{
		this.makePath();
		this.lastPath.moveTo(x+radius, y);
		this.lastPath.arc(x, y, radius, 0, Math.PI * 2);
		//this.drawRoundRect(x - radius, y - radius, radius * 2, radius * 2, radius, radius);
		this.inflateBound(x-radius, y-radius);
		this.inflateBound(x+radius, y+radius);
	}
	
	public drawEllipse = (x:number, y:number, w:number, h:number):void =>
	{
		this.lockBound = true;
		var kappa:number = .5522848,
		ox:number = (w / 2) * kappa, // control point offset horizontal
		oy:number = (h / 2) * kappa, // control point offset vertical
		xe:number = x + w,           // x-end
		ye:number = y + h,           // y-end
		xm:number = x + w / 2,       // x-middle
		ym:number = y + h / 2;       // y-middle

		this.moveTo(x, ym);
		this.cubicCurveTo(x, ym - oy, xm - ox, y, xm, y);
		this.cubicCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		this.cubicCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		this.cubicCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		//ctx.closePath(); // not used correctly, see comments (use to close off open path)
		this.lockBound = false;
		this.inflateBound(x, y);
		this.inflateBound(x+w, y+h);
	}
	
	public moveTo = (x:number, y:number):void =>
	{
		var origX:number = this._bound ? this._bound.x : 0;
		var origY:number = this._bound ? this._bound.y : 0;
		this.makePath();
		this.lastPath.moveTo(x, y);
		this.inflateBound(Math.ceil(x - this.lastHalfThickness), Math.ceil(y - this.lastHalfThickness));
		if (x - this.lastHalfThickness < origX) this._bound.width += Math.ceil(this.lastHalfThickness * 2);
		if (y - this.lastHalfThickness < origY) this._bound.height += Math.ceil(this.lastHalfThickness * 2);
	}
	
	public lineTo = (x:number, y:number):void =>
	{
		var origX:number = this._bound ? this._bound.x : 0;
		var origY:number = this._bound ? this._bound.y : 0;
		this.makePath();
		this.lastPath.lineTo(x, y);
		this.inflateBound(Math.ceil(x - this.lastHalfThickness), Math.ceil(y - this.lastHalfThickness));
		if (x - this.lastHalfThickness < origX) this._bound.width += Math.ceil(this.lastHalfThickness * 2);
		if (y - this.lastHalfThickness < origY) this._bound.height += Math.ceil(this.lastHalfThickness * 2);
	}
	
	public curveTo = (controlX:number, controlY:number, anchorX:number, anchorY:number):void =>
	{
		var origX:number = this._bound ? this._bound.x : 0;
		var origY:number = this._bound ? this._bound.y : 0;
		this.makePath();
		this.lastPath.curveTo(controlX, controlY, anchorX, anchorY);
		this.inflateBound(controlX - this.lastHalfThickness, controlY - this.lastHalfThickness);
		this.inflateBound(anchorX - this.lastHalfThickness, anchorY - this.lastHalfThickness);
		if (controlX - this.lastHalfThickness < origX) this._bound.width += (this.lastHalfThickness * 2);
		if (controlY - this.lastHalfThickness < origY) this._bound.height += (this.lastHalfThickness * 2);
		if (anchorX - this.lastHalfThickness < this._bound.x) this._bound.width += (this.lastHalfThickness * 2);
		if (anchorY - this.lastHalfThickness < this._bound.y) this._bound.height += (this.lastHalfThickness * 2);
	}
	
	public cubicCurveTo = (controlX1:number, controlY1:number, controlX2:number, controlY2:number, anchorX:number, anchorY:number):void =>
	{
		var origX:number = this._bound ? this._bound.x : 0;
		var origY:number = this._bound ? this._bound.y : 0;
		this.makePath();
		this.lastPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
		
		this.inflateBound(controlX1 - this.lastHalfThickness, controlY1 - this.lastHalfThickness);
		this.inflateBound(controlX2 - this.lastHalfThickness, controlY2 - this.lastHalfThickness);
		this.inflateBound(anchorX - this.lastHalfThickness, anchorY - this.lastHalfThickness);
		if (controlX1 - this.lastHalfThickness < origX) this._bound.width += (this.lastHalfThickness * 2);
		if (controlY1 - this.lastHalfThickness < origY) this._bound.height += (this.lastHalfThickness * 2);
		if (controlX2 - this.lastHalfThickness < this._bound.x) this._bound.width += (this.lastHalfThickness * 2);
		if (controlY2 - this.lastHalfThickness < this._bound.y) this._bound.height += (this.lastHalfThickness * 2);
		if (anchorX - this.lastHalfThickness < this._bound.x) this._bound.width += (this.lastHalfThickness * 2);
		if (anchorY - this.lastHalfThickness < this._bound.y) this._bound.height += (this.lastHalfThickness * 2);
	}
	
	private inflateBound = (x:number, y:number):void => 
	{	
		//trace("inflateBound: x: " + x + ", y: " + y);
		
		if (this._bound == null)
		{
			this._bound = new Rectangle(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
			this._rect = new Rectangle(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
		}
		if (this.lockBound) return;
		
		if (this._bound.left>x) {
			this._bound.left = x;
			this._rect.left = x;
		}
		if (this._bound.right<x) {
			this._bound.right = x;
			this._rect.right = x;
		}
		if (this._bound.top>y) {
			this._bound.top = y;
			this._rect.top = y;
		}
		if (this._bound.bottom<y) {
			this._bound.bottom = y;
			this._rect.bottom = y;
		}
		
		// update the bounds for gradient fills.
		if (this.lastFill && this.lastFill instanceof GraphicsGradientFill) (this.lastFill as GraphicsGradientFill).bounds = this._bound;
		if (this.lastStroke && this.lastStroke.fill instanceof GraphicsGradientFill) (this.lastStroke.fill as GraphicsGradientFill).bounds = this._bound;
	}
	
	private makePath = ():void =>
	{
		if (this.lastPath == null)
		{
			var isInitial:boolean = false;
			this.lastPath = this.pathPool[this.pathPoolPos];
			if (this.lastPath==null){
				this.lastPath = this.pathPool[this.pathPoolPos] = new GraphicsPath();
				isInitial = true;
			}
			
			this.lastPath.clear();
			this.lastPath.gpuPath2DDirty = true;
			if (isInitial) this.lastPath.moveTo(0, 0);
			
			this.pathPoolPos++;
			this.graphicsData.push(this.lastPath);
		}
		
		FlashPort.dirtyGraphics = true;
	}
	
	public endFill = ():void =>
	{
		this.endStrokAndFill();
	}
	
	public copyFrom = (g:Graphics):void =>
	{
		this.graphicsData = g.graphicsData.slice();
	}
	
	public lineBitmapStyle = (bitmap:BitmapData, matrix:Matrix = null, repeat:boolean = true, smooth:boolean = false):void =>
	{
		if (this.lastStroke && this.lastStroke instanceof GraphicsStroke)
		{
			var gs:GraphicsStroke = (<GraphicsStroke>this.lastStroke );
			gs.fill = new GraphicsBitmapFill(bitmap, matrix, repeat, smooth);
		}
	}
	
	// public function lineShaderStyle(param1:Shader, param2:Matrix = null) : void;
	
	public drawPath = (commands:any[], data:any[], winding:string="evenOdd"):void =>
	{
		this.makePath();
		this.lastPath.commands.push.apply(null, commands);
		this.lastPath.data.push.apply(null, data);
	}
	
	public drawTriangles(vertices:number[], indices:number[]=null, uvtData:number[]=null, culling:string="none"):void
	{
		this.makePath();
		this.lastPath.drawTriangles(vertices, indices, uvtData);
	}
	
	private drawPathObject = (path:IGraphicsPath):void =>
	{
		var graphicsPath:GraphicsPath = null;
		var graphicsTrianglePath:GraphicsTrianglePath = null;
		if (path instanceof GraphicsPath)
		{
			graphicsPath = path as GraphicsPath;
			this.drawPath(graphicsPath.commands, graphicsPath.data, graphicsPath.winding);
		}
		else if (path instanceof GraphicsTrianglePath)
		{
			graphicsTrianglePath = path as GraphicsTrianglePath;
			this.drawTriangles(graphicsTrianglePath.vertices, graphicsTrianglePath.indices, graphicsTrianglePath.uvtData, graphicsTrianglePath.culling);
		}
	}
	
	private beginFillObject = (fill:IGraphicsFill):void =>
	{
		var solidFill:GraphicsSolidFill = null;
		var gradientFill:GraphicsGradientFill = null;
		var bitmapFill:GraphicsBitmapFill = null;
		// var shaderFill:GraphicsShaderFill = null;
		if (fill == null)
		{
			this.endFill();
		}
		else if (fill instanceof GraphicsEndFill)
		{
			this.endFill();
		}
		else if (fill instanceof GraphicsSolidFill)
		{
			solidFill = fill as GraphicsSolidFill;
			this.beginFill(solidFill.color, solidFill.alpha);
		}
		else if (fill instanceof GraphicsGradientFill)
		{
			gradientFill = fill as GraphicsGradientFill;
			this.beginGradientFill(gradientFill.type, gradientFill.colors, gradientFill.alphas, gradientFill.ratios, gradientFill.matrix, gradientFill.spreadMethod, gradientFill.interpolationMethod, gradientFill.focalPointRatio);
		}
		else if (fill instanceof GraphicsBitmapFill)
		{
			bitmapFill = fill as GraphicsBitmapFill;
			this.beginBitmapFill(bitmapFill.bitmapData, bitmapFill.matrix, bitmapFill.repeat, bitmapFill.smooth);
		}
		/*else if(fill is GraphicsShaderFill)
		{
			shaderFill = GraphicsShaderFill(fill);
			this.beginShaderFill(shaderFill.shader,shaderFill.matrix);
		}*/
	}
	
	private beginStrokeObject = (istroke:IGraphicsStroke):void =>
	{
		var solidFill:GraphicsSolidFill = null;
		var gradientFill:GraphicsGradientFill = null;
		var bitmapFill:GraphicsBitmapFill = null;
		// var shaderFill:GraphicsShaderFill = null;
		var stroke:GraphicsStroke = null;
		var fill:IGraphicsFill = null;
		if (istroke != null && istroke instanceof GraphicsStroke)
		{
			stroke = (<GraphicsStroke>istroke );
		}
		if (stroke && stroke.fill && stroke.fill instanceof (GraphicsSolidFill || GraphicsGradientFill || GraphicsBitmapFill))
		{
			fill = stroke.fill;
		}
		if (stroke == null || fill == null)
		{
			this.lineStyle();
		}
		else if (fill instanceof GraphicsSolidFill)
		{
			solidFill = fill as GraphicsSolidFill;
			this.lineStyle(stroke.thickness, solidFill.color, solidFill.alpha, stroke.pixelHinting, stroke.scaleMode, stroke.caps, stroke.joints, stroke.miterLimit);
		}
		else if (fill instanceof GraphicsGradientFill)
		{
			gradientFill = fill as GraphicsGradientFill;
			this.lineStyle(stroke.thickness, 0, 1, stroke.pixelHinting, stroke.scaleMode, stroke.caps, stroke.joints, stroke.miterLimit);
			this.lineGradientStyle(gradientFill.type, gradientFill.colors, gradientFill.alphas, gradientFill.ratios, gradientFill.matrix, gradientFill.spreadMethod, gradientFill.interpolationMethod, gradientFill.focalPointRatio);
		}
		else if (fill instanceof GraphicsBitmapFill)
		{
			bitmapFill = fill as GraphicsBitmapFill;
			this.lineStyle(stroke.thickness, 0, 1, stroke.pixelHinting, stroke.scaleMode, stroke.caps, stroke.joints, stroke.miterLimit);
			this.lineBitmapStyle(bitmapFill.bitmapData, bitmapFill.matrix, bitmapFill.repeat, bitmapFill.smooth);
		}
	/*else if(fill is GraphicsShaderFill)
		{
		shaderFill = GraphicsShaderFill(fill);
		this.lineStyle(stroke.thickness,0,1,stroke.pixelHinting,stroke.scaleMode,stroke.caps,stroke.joints,stroke.miterLimit);
		this.lineShaderStyle(shaderFill.shader,shaderFill.matrix);
		}*/
	}
	
	public drawGraphicsData = (graphicsData:IGraphicsData[]):void =>
	{
		var item:IGraphicsData = null;
		var path:IGraphicsPath = null;
		var fill:IGraphicsFill = null;
		var stroke:IGraphicsStroke = null;
		
		if (graphicsData == null) return;
		
		for (var i:number = 0; i < graphicsData.length; i++)
		{
			item = graphicsData[i];
			if (item instanceof (GraphicsPath || GraphicsTrianglePath))
			{
				path = item as IGraphicsPath;
				this.drawPathObject(path);
			}
			else if (item instanceof (GraphicsSolidFill || GraphicsGradientFill || GraphicsBitmapFill))
			{
				fill = item as IGraphicsFill;
				this.beginFillObject(fill);
			}
			else if (item instanceof GraphicsStroke)
			{
				stroke = item as IGraphicsStroke;
				this.beginStrokeObject(stroke);
			}
		}
	}
	
	public readGraphicsData = (recurse:boolean = true):IGraphicsData[] =>
	{
		return this.graphicsData.slice();
	}
	
	/**
	 * returns rectangle of drawn graphics not including strokes
	 */
	public get rect():Rectangle 
	{
		return this._rect;
	}
	
	/**
	 * returns rectangle of drawn graphics including strokes
	 */
	public get bound():Rectangle 
	{
		return this._bound;
	}
	
	public draw = (ctx:CanvasRenderingContext2D | Canvas, m:Matrix, blendMode:string, colorTransform:ColorTransform, filters:BitmapFilter[]):void =>
	{
		if (this.graphicsData.length)
		{
			(FlashPort.renderer as IRenderer).renderGraphics(ctx, this.graphicsData, m, blendMode, colorTransform, filters);
			
			FlashPort.drawCounter++;
		}
	}
}