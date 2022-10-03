import { DisplayObject } from "./DisplayObject";
import { BitmapData } from "./BitmapData";
import { FlashPort } from "../../FlashPort";
import { BlendMode } from "./BlendMode";

import { MouseEvent } from "../events/MouseEvent";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
	
	export class Bitmap extends DisplayObject
	{
		private _bitmapData:BitmapData;
		private _imageWidth:number = 0;
		private _imageHeight:number = 0;
		
		constructor(bitmapData:BitmapData = null, pixelSnapping:string = "auto", smoothing:boolean = false){
			super();
			this.ctorbmp(bitmapData, pixelSnapping, smoothing);
			
		}
		
		private ctorbmp = (bitmapData:BitmapData, pixelSnapping:string, smoothing:boolean):void =>
		{
			this._bitmapData = bitmapData;
			this._imageWidth = bitmapData.width;
			this._imageHeight = bitmapData.height;
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
			if (this.bitmapData) return this.bitmapData.rect;
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
					
					FlashPort.renderer.renderImage(ctx, this._bitmapData, m, this.blendMode, this.transform.concatenatedColorTransform);
					FlashPort.drawCounter++;
					if (this.mask) ctx.restore();
					
				}
			}
			
			this._parentCached = parentIsCached;
		}
		
		/*override*/ protected __doMouse = (e:MouseEvent):DisplayObject =>
		{
			if (this.visible) 
			{
				if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
					return this;
				}
			}
			return null;
		}
		
		/*override*/ public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
		{
			var rect:Rectangle = new Rectangle(0, 0, this.width * this.scaleX, this.height * this.scaleY);
			var gToL:Point  = this.globalToLocal(new Point(x, y));
			return rect.containsPoint(gToL);
		}
	}

