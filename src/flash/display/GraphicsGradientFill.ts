import { IGraphicsFill } from "./IGraphicsFill";
import { IGraphicsData } from "./IGraphicsData";
import { FlashPort } from "../../FlashPort";
import { GradientType } from "./GradientType";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { Canvas, Color, Paint, Path, Shader, TileMode } from "canvaskit-wasm";
import { IRenderer } from "../__native/IRenderer";

export class GraphicsGradientFill extends Object implements IGraphicsFill, IGraphicsData
{
	public paint: Paint;
	public graphicType:string = "FILL";
	public path: Path;

	public colors:any[];
	public alphas:any[];
	public ratios:any[];
	public matrix:Matrix;
	public focalPointRatio:number;
	
	private _shader:Shader;
	private _type:string;
	private _bounds:Rectangle;
	private _spreadMethod:string;
	private _tileMode:TileMode;
	private _interpolationMethod:string;
	private _gradient:CanvasGradient;
	private _startPoint:Point;
	private _endPoint:Point;
	private _radius1:number = 0;
	private _radius2:number = 0;
	private _convertedColors:any[];
	private _convertedRatios:any[];
	private _colorTransform:ColorTransform;
	
	constructor(type:string = "linear", colors:any[] = null, alphas:any[] = null, ratios:any[] = null, bounds:Rectangle = null, matrix:Matrix = null, spreadMethod:any = "pad", interpolationMethod:string = "rgb", focalPointRatio:number = 0.0){
		super();
		this._type = type;
		this.colors = colors;
		this.alphas = alphas;
		this.ratios = ratios;
		this._bounds = (bounds) ? bounds : new Rectangle();
		this.matrix = matrix;
		this._spreadMethod = spreadMethod;
		this._interpolationMethod = interpolationMethod;
		this.focalPointRatio = focalPointRatio;

		this.paint = new FlashPort.canvasKit.Paint();
		this.paint.setAntiAlias(true);
		this._tileMode = spreadMethod == "pad" ? FlashPort.canvasKit.TileMode.Clamp : (spreadMethod == "repeat" ? FlashPort.canvasKit.TileMode.Repeat : FlashPort.canvasKit.TileMode.Mirror);
		
		// convert ratios
		this._convertedRatios = [];
		for (var i:number = 0; i < ratios.length; i++) 
		{
			this._convertedRatios.push(ratios[i] / 255);
		}
		
		this.transformGradient();
	}

	private getShaderColors():Color[]
	{
		let shaderColors:Color[] = [];
		for (var i:number = 0; i < this.colors.length; i++) 
		{
			var shadColor:Color = (FlashPort.renderer as IRenderer).getRGBAColor(this.colors[i], this.alphas[i], this._colorTransform);
			shaderColors.push(shadColor);
		}
		return shaderColors;
	}
	
	private transformGradient():void 
	{
		if (this.matrix)
		{
			// apply matrix to left and right points and rotate around center.
			var decomp:Object = this.decompose_2d_matrix(this.matrix);
			var scX:number = decomp['scale'].x;
			var scY:number = decomp['scale'].y;
			var rot:number = decomp['rotation'];
			var w:number = scX * 1638.4;
			var h:number = scY * 1638.4;
			var box:Rectangle = new Rectangle(decomp['translation'][0] - (w/2), decomp['translation'][1] - (h/2), w, h);
			var rotationPoint:Point = new Point((box.topLeft.x  + box.bottomRight.x) / 2, (box.topLeft.y + box.bottomRight.y) / 2);
				
			if (this.type == GradientType.LINEAR)
			{
				// get left and right points
				this._startPoint = new Point(box.topLeft.x, (box.topLeft.y + box.bottomRight.y) / 2);
				this._endPoint = new Point(box.bottomRight.x, (box.topLeft.y + box.bottomRight.y) / 2);
				// rotate points
				this._startPoint = this.getRotatedRectPoint(rot, this._startPoint, rotationPoint);
				this._endPoint = this.getRotatedRectPoint(rot, this._endPoint, rotationPoint);
			}
			else // radial
			{
				this._startPoint = rotationPoint;
				this._endPoint = rotationPoint;
				this._radius1 = Math.abs(w);
				this._radius2 = Math.abs(h);
				var rotPoint:Point = this.getRotatedRectPoint(rot, new Point(this._radius1, this._radius2), rotationPoint);
			}
		}
		else
		{
			if (this.type == GradientType.LINEAR)
			{
				this._startPoint = new Point(this._bounds.topLeft.x, this._bounds.bottomRight.y / 2);
				this._endPoint = new Point(this._bounds.bottomRight.x, this._bounds.bottomRight.y / 2);
			}
			else
			{
				this._startPoint = this._endPoint = new Point(this.bounds.x + (this.bounds.width / 2), this.bounds.y + (this.bounds.height / 2));
				this._radius2 = this.bounds.width;
			}
		}
		
	}
	
	private getRotatedRectPoint( angle:number, point:Point, rotationPoint:Point = null, scX:number = 1, scY:number = 1):Point
	{
		var ix:number = (rotationPoint) ? rotationPoint.x : 0;
		var iy:number = (rotationPoint) ? rotationPoint.y : 0;
		
		var m:Matrix = new Matrix( 1,0,0,1, point.x - ix, point.y - iy);
		m.scale(scX, scY);
		m.rotate(angle);
		return new Point( m.tx + ix, m.ty + iy);
	}
	
	private decompose_2d_matrix(mat:Matrix):Object {
		var a:number = mat.a;
		var b:number = mat.b;
		var c:number = mat.c;
		var d:number = mat.d;
		var e:number = mat.tx;
		var f:number = mat.ty;

		var delta:number = a * d - b * c;

		var result:Object = {
			translation: new Array(e, f),
			rotation: 0,
			scale: {x:0, y:0},
			skew: new Array(0,0)
		};

		// Apply the QR-like decomposition.
		if (a != 0 || b != 0) {
		var r:number = Math.sqrt(a * a + b * b);
		result['rotation'] = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
		result['scale'].x = r;
		result['scale'].y = delta / r;
		result['skew'] = [Math.atan((a * c + b * d) / (r * r)), 0];
		} else if (c != 0 || d != 0) {
		var s:number = Math.sqrt(c * c + d * d);
		result['rotation'] = Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
		result['scale'].x = delta / s;
		result['scale'].y = s;
		result['skew'] = [0, Math.atan((a * c + b * d) / (s * s))];
		} 

		return result;
	}
	
	private colorsChanged(ct:ColorTransform):boolean 
	{
		if (!this._colorTransform) return false;
		
		if (this._colorTransform.alphaMultiplier === ct.alphaMultiplier &&
			this._colorTransform.alphaOffset === ct.alphaOffset &&
			this._colorTransform.blueMultiplier === ct.blueMultiplier &&
			this._colorTransform.blueOffset === ct.blueOffset &&
			this._colorTransform.greenMultiplier === ct.greenMultiplier &&
			this._colorTransform.greenOffset === ct.greenOffset &&
			this._colorTransform.redMultiplier === ct.redMultiplier &&
			this._colorTransform.redOffset === ct.redOffset &&
			this._colorTransform.tint === ct.tint)
		{
			return false;
		}
		
		return true;
	}
	
	public get type():string
	{
		return this._type;
	}
	
	public set type(value:string)
	{
		this._type = value;
	}
	
	public get spreadMethod():string
	{
		return this._spreadMethod;
	}
	
	public set spreadMethod(value:string)
	{
		this._spreadMethod = value;
	}
	
	public get interpolationMethod():string
	{
		return this._interpolationMethod;
	}
	
	public set interpolationMethod(value:string)
	{
		this._interpolationMethod = value;
	}
	
	public get bounds():Rectangle 
	{
		return this._bounds;
	}
	
	public set bounds(value:Rectangle) 
	{
		this._bounds = value;
		
		this.transformGradient();
	}
	
	public get gradient():CanvasGradient 
	{
		return this._gradient;
	}
	
	public get startPoint():Point 
	{
		return this._startPoint;
	}
	
	public get endPoint():Point 
	{
		return this._endPoint;
	}
	
	public draw(ctx:CanvasRenderingContext2D, colorTransform:ColorTransform):void
	{
		
	}

	public skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void
	{
		this._colorTransform = colorTransform;
		let m:number[] = [mat.a, mat.c, mat.tx, mat.b, mat.d, mat.ty, 0, 0, 1];
		//console.log(this.getShaderColorPoints());
		if (this._gradient == null || !this._colorTransform || this.colorsChanged(colorTransform))
		{	
			if (this.type === GradientType.LINEAR) {
				this._shader = FlashPort.canvasKit.Shader.MakeLinearGradient(
					[this._startPoint.x, this._startPoint.y],
					[this._endPoint.x, this._endPoint.y],
					this.getShaderColors(),
					this._convertedRatios,
					this._tileMode,
					m
				);
			}else {
				this._shader = FlashPort.canvasKit.Shader.MakeRadialGradient(
					[this._startPoint.x, this._startPoint.y],
					this._radius2 >= this._radius1 ? (this._radius2 / 2) : (this._radius1 / 2),
					this.getShaderColors(),
					this._convertedRatios,
					this._tileMode,
					m
				);
			}
		}

		this.paint.setShader(this._shader);
	}
}