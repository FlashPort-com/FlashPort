import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { MouseEvent } from "../events/MouseEvent";
import { Canvas } from "canvaskit-wasm";

export class Shape extends DisplayObject
{
	public graphics:Graphics;
	
	private _cacheImage:BitmapData;
	private _cacheWidth:number = 0;
	private _cacheHeight:number = 0;
	
	constructor()
	{
		super();
		
		this.graphics = new Graphics();
	}
	
	/*override*/
	public __update = (ctx:CanvasRenderingContext2D | Canvas, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void =>
	{
		if (!this._off && this.visible && this.graphics.graphicsData.length)
		{
			//if (this._blurFilter && !this.cacheAsBitmap) this._blurFilter._applyFilter(ctx);
			
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			var colorTrans:ColorTransform = this.transform.concatenatedColorTransform;
			
			this.graphics.draw(ctx, mat, this.blendMode, colorTrans, this.filters);
			//if (this.mask) ctx.restore();
			//this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null);
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
		if (this.visible) 
		{
			if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
				return this;
			}
		}
		return null;
	}
	
	public get cacheImage():BitmapData 
	{
		return this._cacheImage;
	}
	
	public get cacheWidth():number 
	{
		return this._cacheWidth;
	}
	
	public get cacheHeight():number 
	{
		return this._cacheHeight;
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