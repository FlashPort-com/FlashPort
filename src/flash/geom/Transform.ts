import { Matrix } from "./Matrix";
import { ColorTransform } from "./ColorTransform";
import { Rectangle } from "./Rectangle";
import { Matrix3D } from "./Matrix3D";
import { PerspectiveProjection } from "./PerspectiveProjection";
import { DisplayObject } from "../display/DisplayObject";
export class Transform extends Object
{
	private _matrix:Matrix = new Matrix();
	private _colorTransform:ColorTransform = new ColorTransform();
	private _concatenatedColorTransform:ColorTransform = new ColorTransform();
	private colorDirty:boolean = true;
	private dirty:boolean = true;
	private _concatenatedMatrix:Matrix = new Matrix();
	private invDirty:boolean = true;
	private _invMatrix:Matrix = new Matrix();
	private _displayObject:DisplayObject;

	constructor(displayObject?:DisplayObject)
	{
		super();
		if (displayObject) this.ctor(displayObject);
	}
	
	public get matrix():Matrix  { 
		return this._matrix;
	}
	
	public set matrix(v:Matrix)  {
		this._matrix = v;
		this.updateTransforms();
	}
	
	public get colorTransform():ColorTransform  {
		return this._colorTransform;
	}
	
	public set colorTransform(v:ColorTransform)  {
		this._colorTransform = v;
		this.updateColorTransforms();
	}
	
	public get concatenatedMatrix():Matrix  { 
		if (this.dirty)
		{
			this._concatenatedMatrix.copyFrom(this.matrix);
			
			if (this._displayObject.parent)
			{
				this._concatenatedMatrix.concat(this._displayObject.parent.transform.concatenatedMatrix);
			}
			this.dirty = false;
		}
		return this._concatenatedMatrix;
	}
	
	public get concatenatedColorTransform():ColorTransform  { 
		if (this.colorDirty)
		{
			this._concatenatedColorTransform = this.cloneColorTransform(this._colorTransform);
			
			if (this._displayObject.parent)
			{
				this._concatenatedColorTransform.concat(this._displayObject.parent.transform.concatenatedColorTransform);
			}
			this.colorDirty = false;
		}
		return this._concatenatedColorTransform;
	}
	
	private cloneColorTransform(ct:ColorTransform):ColorTransform
	{
		return new ColorTransform(ct.redMultiplier, ct.greenMultiplier, ct.blueMultiplier, ct.alphaMultiplier, ct.redOffset, ct.greenOffset, ct.blueOffset, ct.alphaOffset);
	}
	
	public get pixelBounds():Rectangle  { return null }
	
	private ctor = (transformObject:DisplayObject):void =>  
	{
		this._displayObject = transformObject;
	}
	
	public get matrix3D():Matrix3D  { return null }
	
	public set matrix3D(param1:Matrix3D)  {/**/ }
	
	public getRelativeMatrix3D(param1:DisplayObject):Matrix3D  { return null }
	
	public get perspectiveProjection():PerspectiveProjection  { return null }
	
	public set perspectiveProjection(param1:PerspectiveProjection)  {/**/ }
	public get invMatrix():Matrix
	{
		if (this.invDirty)
		{
			this._invMatrix.copyFrom(this.concatenatedMatrix);
			this._invMatrix.invert();
			this.invDirty = false;
		}
		return this._invMatrix;
	}
	
	public updateTransforms = ():void =>
	{
		this.dirty = true;
		this.invDirty = true;
	}
	
	public updateColorTransforms = ():void =>
	{
		this.colorDirty = true;
	}
}