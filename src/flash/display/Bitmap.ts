import { DisplayObject } from "./DisplayObject";
import { BitmapData } from "./BitmapData";
import { FlashPort } from "../../FlashPort";
import { BlendMode } from "./BlendMode";

import { MouseEvent } from "../events/MouseEvent";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { IRenderer } from "../__native/IRenderer";
	
	export class Bitmap extends DisplayObject
	{
		private _bitmapData:BitmapData;
		
		constructor(bitmapData:BitmapData = null, pixelSnapping:string = "auto", smoothing:boolean = false)
		{
			super();
			
			this._bitmapData = bitmapData;
		}
		
		public get pixelSnapping():string  { return null }
		
		public set pixelSnapping(param1:string)
		{
		
		}
		
		public get smoothing():boolean  { return false }
		
		public set smoothing(param1:boolean)
		{
		
		}
		
		public get bitmapData():BitmapData  { return this._bitmapData }
		
		public set bitmapData(param1:BitmapData)
		{
			this._bitmapData = param1;
			FlashPort.dirtyGraphics = true;
		}
		
		public get cacheImage():BitmapData 
		{
			return this._bitmapData;
		}
		
		/*override*/ public getFullBounds = (v:DisplayObject):Rectangle =>
		{
			if (this._bitmapData) return this._bitmapData.rect;
			return new Rectangle();
		}
		
		/*override*/ public __update(ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void
		{
			if (!this._off && this.visible && (!parentIsCached || (parentIsCached && !this._parentCached)))
			{
				//if (this.name.indexOf("https") != -1) trace("Bitmap Update: " + this.name);
				if (this._bitmapData && this._bitmapData.image)
				{
					if (this.mask)
					{
						var mat:Matrix = this.mask.transform.concatenatedMatrix.clone();
						if (parentIsCached)
						{
							mat.tx += offsetX;
							mat.ty += offsetY;
							mat.scale((!this.parent ? 1 : this.scaleX) / mat.a, (!this.parent ? 1 : this.scaleY) / mat.d);
						}
						
						ctx.save();
						this.mask['graphics'].draw(ctx, mat, BlendMode.NORMAL, new ColorTransform());
						ctx.clip();
					}
					
					var m:Matrix = this.transform.concatenatedMatrix;
					if (parentIsCached)
					{
						m.tx += offsetX;
						m.ty += offsetY;
					}
					
					(FlashPort.renderer as IRenderer).renderImage(ctx, this._bitmapData, m, this.blendMode, this.transform.concatenatedColorTransform);
					FlashPort.drawCounter++;
					if (this.mask) ctx.restore();
					
				}
			}
			
			this._parentCached = parentIsCached;
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
		
		/*override*/
		public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
		{
			var rect:Rectangle = new Rectangle(0, 0, this.width * this.scaleX, this.height * this.scaleY);
			var gToL:Point  = this.globalToLocal(new Point(x, y));
			return rect.containsPoint(gToL);
		}
	}

