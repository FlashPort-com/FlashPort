import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { MouseEvent } from "../events/MouseEvent";
import { Canvas, Path } from "canvaskit-wasm";
import { BlendMode } from "./BlendMode";
import { GraphicsPath } from "./GraphicsPath";
import { FlashPort } from "../../FlashPort";
import { BitmapFilter } from "../filters/BitmapFilter";

export class Shape extends DisplayObject
{
	public graphics:Graphics;
	
	constructor()
	{
		super();
		
		this.graphics = new Graphics();
	}
	
	/*override*/
	public __update = (ctx:Canvas, offsetX:number = 0, offsetY:number = 0, filters: BitmapFilter[] = []):void =>
	{
		if (!this._off && this.visible && this.graphics.graphicsData.length)
		{	
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			var colorTrans:ColorTransform = this.transform.concatenatedColorTransform;
			let path:Path;
			if (this.mask)
			{
				var maskMat:Matrix = this.mask.transform.concatenatedMatrix;
				
				ctx.save();
				this.mask['graphics'].draw(ctx, maskMat, BlendMode.NORMAL, new ColorTransform(), []);
				path = (this.mask['graphics'].lastPath as GraphicsPath).path;
				let pathMat:number[] = [maskMat.a, maskMat.c, maskMat.tx, maskMat.b, maskMat.d, maskMat.ty, 0, 0, 1];
				path.transform(pathMat)
				path.setFillType(FlashPort.canvasKit.FillType.Winding);
				ctx.clipPath(path, FlashPort.canvasKit.ClipOp.Intersect, true);
			}

			this.graphics.draw(ctx, mat, this.blendMode, colorTrans, this.filters.concat(filters));
			
			if (this.mask)
			{
				ctx.restore();
				path.delete();
			} 
		}
	}
	
	/*override*/
	public set cacheAsBitmap(value:boolean) 
	{
		this._cacheAsBitmap = value;
	}

	/*override*/
	public get cacheAsBitmap():boolean
	{
		return this._cacheAsBitmap;
	}
	
	/*override*/
	protected __doMouse = (e:MouseEvent):DisplayObject =>
	{
		if (this.visible && this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
			return this;
		}
		
		return null;
	}
	
	/*override*/
	public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
	{
		var rect:Rectangle = this.getFullBounds(this);
		var gToL:Point  = this.globalToLocal(new Point(x, y));
		return rect.containsPoint(gToL);
	}
	
	/*override*/
	public __getRect = ():Rectangle =>
	{
		return this.graphics.bound;
	}
}