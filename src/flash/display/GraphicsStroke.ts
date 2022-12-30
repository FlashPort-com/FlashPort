import { IGraphicsStroke } from "./IGraphicsStroke";
import { IGraphicsData } from "./IGraphicsData";
import { IGraphicsFill } from "./IGraphicsFill";
import { GraphicsSolidFill } from "./GraphicsSolidFill";
import { FlashPort } from "../../FlashPort";
import { GraphicsGradientFill } from "./GraphicsGradientFill";
import { ColorTransform } from "../geom/ColorTransform";
import { JointStyle } from "./JointStyle";
import { Canvas, Color, Paint, Path } from "canvaskit-wasm";
import { Matrix } from "../geom";
import { IRenderer } from "../__native/IRenderer";

export class GraphicsStroke extends Object implements IGraphicsStroke, IGraphicsData
{
	public fill:IGraphicsFill;
	public graphicType:string = "STROKE";
	public paint: Paint;
	public path: Path;
	public thickness:number;
	public pixelHinting:boolean;
	public miterLimit:number;
	private _caps:string;
	private _joints:string;
	private _scaleMode:string;
	
	constructor(thickness:number = NaN, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = "none", joints:string = "round", miterLimit:number = 3.0, fill:IGraphicsFill = null){
		super();
		this.thickness = thickness;
		this.pixelHinting = pixelHinting;
		this._caps = (caps == "none") ? "butt" : caps;
		this._joints = joints;
		this.miterLimit = miterLimit;
		this._scaleMode = scaleMode;  // TODO implement scaleMode
		this.fill = fill;
		
		this.paint = new FlashPort.canvasKit.Paint();
		this.paint.setColor(FlashPort.canvasKit.Color(0, 0, 0, 0));
		this.paint.setStyle(FlashPort.canvasKit.PaintStyle.Stroke);
		this.paint.setStrokeWidth(thickness);
		this.paint.setStrokeCap(FlashPort.canvasKit.StrokeCap.Square);
		this.paint.setAntiAlias(true);
	}
	
	public get caps():string
	{
		return this._caps;
	}
	
	public set caps(value:string)
	{
		this._caps = value;
	}
	
	public get joints():string
	{
		return this._joints;
	}
	
	public set joints(value:string)
	{
		this._joints = value;
	}
	
	public get scaleMode():string
	{
		return this._scaleMode;
	}
	
	public set scaleMode(value:string)
	{
		this._scaleMode = value;
	}
	
	public draw(ctx:CanvasRenderingContext2D,colorTransform:ColorTransform):void
	{
		if (isNaN(this.thickness))
		{
			ctx.lineJoin = this._joints as CanvasLineJoin;
			ctx.stroke();
		}
		else
		{
			ctx.lineWidth = this.thickness;
			if (this.fill instanceof GraphicsSolidFill)
			{
				var sf:GraphicsSolidFill = (<GraphicsSolidFill>this.fill );
				ctx.lineCap = this._caps as CanvasLineCap;
				ctx.lineJoin = this._joints as CanvasLineJoin;
				ctx.miterLimit = this.miterLimit;
				ctx.strokeStyle = (FlashPort.renderer as IRenderer).getCssColor(sf.color, sf.alpha,colorTransform,null).toString();//sf.getCssColor(colorTransform);
			}
			else if (this.fill instanceof GraphicsGradientFill)
			{
				var gf:GraphicsGradientFill = (<GraphicsGradientFill>this.fill );
				gf.draw(ctx, colorTransform);
				ctx.lineCap = this._caps as CanvasLineCap;
				ctx.lineJoin = this._joints as CanvasLineJoin;
				ctx.miterLimit = this.miterLimit;
				ctx.strokeStyle = gf.gradient;
			}
		}
	}

	public skiaDraw(ctx:Canvas, colorTransform:ColorTransform, mat?:Matrix):void
	{
		var sf:GraphicsSolidFill = this.fill as GraphicsSolidFill;
		var rgba:Color = (FlashPort.renderer as IRenderer).getRGBAColor(sf.color, sf.alpha, colorTransform);
		this.paint.setColor(rgba);
	}
}