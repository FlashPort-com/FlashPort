import { Color } from "canvaskit-wasm";
import { FPConfig } from "../../FPConfig";

export class ColorTransform extends Object
{
	private _hexColor:number;
	private _redMultiplier:number;
	private _greenMultiplier:number;
	private _blueMultiplier:number;
	private _alphaMultiplier:number;
	private _rgba:Color;
	public redOffset:number;
	public greenOffset:number;
	public blueOffset:number;
	public alphaOffset:number;
	public tint:number = 0xffffffff;
	
	constructor(redMultiplier:number = 1.0, greenMultiplier:number = 1.0, blueMultiplier:number = 1.0, alphaMultiplier:number = 1.0, redOffset:number = 0, greenOffset:number = 0, blueOffset:number = 0, alphaOffset:number = 0)
	{
		super();
		this.redMultiplier = redMultiplier;
		this.greenMultiplier = greenMultiplier;
		this.blueMultiplier = blueMultiplier;
		this.alphaMultiplier = alphaMultiplier;
		this.redOffset = redOffset;
		this.greenOffset = greenOffset;
		this.blueOffset = blueOffset;
		this.alphaOffset = alphaOffset;

		this.updateRGBA();
	}
	
	public get color():number
	{
		return this.redOffset << 16 | this.greenOffset << 8 | this.blueOffset;  // use toString(16) for input format. Ex 0xFFFFFF
	}
	
	public set color(newColor:number)
	{
		this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 0;
		this.redOffset = newColor >> 16 & 255;
		this.greenOffset = newColor >> 8 & 255;
		this.blueOffset = newColor & 255;
		this.updateRGBA();
	}

	public get rgba():Color
	{
		return this._rgba;
	}
	
	public get redMultiplier():number 
	{
		return this._redMultiplier;
	}
	
	public set redMultiplier(value:number) 
	{
		this._redMultiplier = value;
		this.tint = ((this._redMultiplier*0xff) << 0)|((this._greenMultiplier*0xff) << 8)|((this._blueMultiplier*0xff) << 16) | ((this._alphaMultiplier*0xff) << 24);
		this.updateRGBA();
	}
	
	public get greenMultiplier():number 
	{
		return this._greenMultiplier;
	}
	
	public set greenMultiplier(value:number) 
	{
		this._greenMultiplier = value;
		this.tint = ((this._redMultiplier*0xff) << 0)|((this._greenMultiplier*0xff) << 8)|((this._blueMultiplier*0xff) << 16) | ((this._alphaMultiplier*0xff) << 24);
		this.updateRGBA();
	}
	
	public get blueMultiplier():number 
	{
		return this._blueMultiplier;
	}
	
	public set blueMultiplier(value:number) 
	{
		this._blueMultiplier = value;
		this.tint = ((this._redMultiplier*0xff) << 0)|((this._greenMultiplier*0xff) << 8)|((this._blueMultiplier*0xff) << 16) | ((this._alphaMultiplier*0xff) << 24);
		this.updateRGBA();
	}
	
	public get alphaMultiplier():number 
	{
		return this._alphaMultiplier;
	}
	
	public set alphaMultiplier(value:number) 
	{
		this._alphaMultiplier = value;
		this.tint = ((this._redMultiplier*0xff) << 0)|((this._greenMultiplier*0xff) << 8)|((this._blueMultiplier*0xff) << 16) | ((this._alphaMultiplier*0xff) << 24);
		this.updateRGBA();
	}
	
	public concat(second:ColorTransform):void
	{
		this.alphaOffset = this.alphaOffset + this.alphaMultiplier * second.alphaOffset;
		this.alphaMultiplier = this.alphaMultiplier * second.alphaMultiplier;
		this.redOffset = this.redOffset + this.redMultiplier * second.redOffset;
		this.redMultiplier = this.redMultiplier * second.redMultiplier;
		this.greenOffset = this.greenOffset + this.greenMultiplier * second.greenOffset;
		this.greenMultiplier = this.greenMultiplier * second.greenMultiplier;
		this.blueOffset = this.blueOffset + this.blueMultiplier * second.blueOffset;
		this.blueMultiplier = this.blueMultiplier * second.blueMultiplier;

		this.updateRGBA();
	}
	
	public toString():string
	{
		return "(redMultiplier=" + this.redMultiplier + ", greenMultiplier=" + this.greenMultiplier + ", blueMultiplier=" + this.blueMultiplier + ", alphaMultiplier=" + this.alphaMultiplier + ", redOffset=" + this.redOffset + ", greenOffset=" + this.greenOffset + ", blueOffset=" + this.blueOffset + ", alphaOffset=" + this.alphaOffset + ")";
	}

	private updateRGBA = ():void =>
	{
		this._rgba  = FPConfig.canvasKit.Color(
            (this.color >> 16 & 0xff), 
            (this.color >> 8 & 0xff), 
            (this.color & 0xff), 
            (this.alphaOffset)
        ); 
	}
}