import { IGraphicsStroke } from "./IGraphicsStroke";
import { IGraphicsData } from "./IGraphicsData";
import { IGraphicsFill } from "./IGraphicsFill";
import { GraphicsSolidFill } from "./GraphicsSolidFill";
import { FlashPort } from "../../FlashPort";
import { GraphicsGradientFill } from "./GraphicsGradientFill";

import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D";
import { ColorTransform } from "../geom/ColorTransform";
import { JointStyle } from "./JointStyle";

export class GraphicsStroke extends Object implements IGraphicsStroke, IGraphicsData
{
	
	public thickness:number;
	
	public pixelHinting:boolean;
	
	private _caps:string;
	
	private _joints:string;
	
	public miterLimit:number;
	
	private _scaleMode:string;
	
	public fill:IGraphicsFill;
	
	constructor(thickness:number = NaN, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = "none", joints:string = "round", miterLimit:number = 3.0, fill:IGraphicsFill = null){
		super();
		this.thickness = thickness;
		this.pixelHinting = pixelHinting;
		this._caps = (caps == "none") ? "butt" : caps;
		this._joints = joints;
		this.miterLimit = miterLimit;
		this._scaleMode = scaleMode;  // TODO implement scaleMode
		this.fill = fill;
		
	/*if(this._scaleMode != LineScaleMode.NORMAL && this._scaleMode != LineScaleMode.NONE && this._scaleMode != LineScaleMode.VERTICAL && this._scaleMode != LineScaleMode.HORIZONTAL)
		{
		Error.throwError(null,2008,"scaleMode");
		}
		if(this._caps != CapsStyle.NONE && this._caps != CapsStyle.ROUND && this._caps != CapsStyle.SQUARE)
		{
		Error.throwError(null,2008,"caps");
		}
		if(this._joints != JointStyle.BEVEL && this._joints != JointStyle.MITER && this._joints != JointStyle.ROUND)
		{
		Error.throwError(null,2008,"joints");
		}*/
	}
	
	public get caps():string
	{
		return this._caps;
	}
	
	public set caps(value:string)
	{
		/*if(value != CapsStyle.NONE && value != CapsStyle.ROUND && value != CapsStyle.SQUARE)
			{
			Error.throwError(null,2008,"caps");
			}*/
		this._caps = value;
	}
	
	public get joints():string
	{
		return this._joints;
	}
	
	public set joints(value:string)
	{
		/*if(value != JointStyle.BEVEL && value != JointStyle.MITER && value != JointStyle.ROUND)
			{
			Error.throwError(null,2008,"joints");
			}*/
		this._joints = value;
	}
	
	public get scaleMode():string
	{
		return this._scaleMode;
	}
	
	public set scaleMode(value:string)
	{
		/*if(value != LineScaleMode.NORMAL && value != LineScaleMode.NONE && value != LineScaleMode.VERTICAL && value != LineScaleMode.HORIZONTAL)
			{
			Error.throwError(null,2008,"scaleMode");
			}*/
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
				ctx.strokeStyle = FlashPort.renderer.getCssColor(sf.color, sf.alpha,colorTransform,null).toString();//sf.getCssColor(colorTransform);
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
	
	public gldraw(ctx:GLCanvasRenderingContext2D, colorTransform:ColorTransform):void{
		if (isNaN(this.thickness))
		{
			ctx.stroke();
		}
		else
		{
			ctx.lineWidth = this.thickness;
			if (this.fill instanceof GraphicsSolidFill)
			{
				var sf:GraphicsSolidFill = (<GraphicsSolidFill>this.fill );
				FlashPort.renderer.getCssColor(sf.color, sf.alpha,colorTransform,sf._glcolor);
				ctx.strokeStyle = sf._glcolor.toString(); //sf.getCssColor(colorTransform);
			}
		}
	}
}