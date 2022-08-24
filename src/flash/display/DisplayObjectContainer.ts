import { InteractiveObject } from "./InteractiveObject";
import { DisplayObject } from "./DisplayObject";
import { MouseEvent } from "../events/MouseEvent";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";

export class DisplayObjectContainer extends InteractiveObject
{
	private children:Array<any> = [];
	private _mouseChildren:boolean = true;
	protected _childrenCached:boolean = false;
	
	constructor()
	{
		super();
	}
	
	public addChild = (child:DisplayObject):DisplayObject =>
	{
		return this.addChildAt(child,this.children.length);
	}
	
	public addChildAt = (child:DisplayObject, index:number):DisplayObject =>
	{
		var i:number = this.children.indexOf(child);
		if (i != -1) this.children.splice(i, 1);
		this.children.splice(index,0,child);
		//child.stage = this._stage;
		child._parent = this;
		this.updateTransforms();
		return child;
	}
	
	public removeChild = (child:DisplayObject):DisplayObject =>
	{ 
		var i:number = this.children.indexOf(child);
		if (i !=-1 ) return this.removeChildAt(i);
		return child;
	}
	
	public removeChildAt = (i:number):DisplayObject =>
	{ 
		var child:DisplayObject = this.children[i];
		if(child){
			child._parent = null;
			child.stage = null;
		}
		this.children.splice(i, 1);
		this.updateTransforms();
		return child;
	}
	
	public getChildIndex = (child:DisplayObject):number =>
	{ 
		return this.children.indexOf(child);
	}
	
	public setChildIndex = (child:DisplayObject, index:number):void =>
	{
		this.removeChild(child);
		this.addChildAt(child, index);
	}
	
	public getChildAt = (index:number):DisplayObject =>
	{ 
		return this.children[index]; 
	}
	
	public getChildByName = (name:string):DisplayObject =>
	{
		var len:number = this.children.length;
		for (var i:number = 0; i < len;i++ ) {
			var c:DisplayObject = this.children[i];
			if (c.name===name) {
				return c;
			}
		}
		return null;
	}
	
	public get numChildren():number  { return this.children.length; }
	
	// public function get textSnapshot() : TextSnapshot;
	
	public getObjectsUnderPoint = (p:Point):any[] =>  { return null }
	
	public areInaccessibleObjectsUnderPoint = (p:Point):boolean =>  { return false }
	
	public get tabChildren():boolean  { return false }
	
	public set tabChildren(v:boolean)  {/**/ }
	
	public get mouseChildren():boolean  { return this._mouseChildren; }
	
	public set mouseChildren(v:boolean)  { this._mouseChildren = v; }
	
	public contains = (child:DisplayObject):boolean =>
	{ 
		return this.children.indexOf(child) != -1;
	}
	
	public swapChildrenAt = (i1:number, i2:number):void =>
	{
		var temp:DisplayObject = this.children[i1];
		this.children[i1] = this.children[i2];
		this.children[i2] = temp;
	}
	
	public swapChildren = (c1:DisplayObject, c2:DisplayObject):void =>
	{
		this.swapChildrenAt(this.getChildIndex(c1), this.getChildIndex(c2));
	}
	
	public removeChildren = (start:number = 0, len:number = 2147483647):void =>
	{
		for (var i:number = Math.min(this.numChildren - 1, start + len - 1); i >= start;i-- ) {
			this.removeChildAt(i);
		}
	}
	// TODO stopAllMovieClips
	public stopAllMovieClips = ():void =>
	{
	
	}
	
	public __update(ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void
	{
		if (!this._off && this.visible && !this._childrenCached)
		{
			var len:number = this.children.length;
			for (var i:number = 0; i < len; i++)
			{
				var c:DisplayObject = this.children[i];
				if (!c.parentCached)
				{
					c.__update(ctx, offsetX, offsetY, parentIsCached);
				}
			}
		}
	}
	
	public updateTransforms = ():void =>
	{
		super.updateTransforms();
		var len:number = this.children.length
		for (var i:number = 0; i < len; i++){
			var c:DisplayObject = this.children[i];
			c.updateTransforms();
		}
	}
	
	/*override*/ protected __doMouse(e:MouseEvent):DisplayObject
	{
		if (this.mouseEnabled && this.visible)
		{
			for (var i:number = this.children.length - 1; i >= 0; i--)
			{
				var obj:DisplayObject = this.children[i].__doMouse(e);
				if (obj) return obj;
			}
		}
		return null;
	}
	
	/*override*/ public getBounds = (v:DisplayObject):Rectangle =>
	{
		var rect:Rectangle = super.getBounds(v);
		
		var len:number = this.children.length;
		for (var i:number = 0; i < len; i++ )
		{
			var c:DisplayObject = this.children[i];
			var cRect:Rectangle = c.getBounds(c);
			cRect.left += c.x;
			cRect.right += c.x;
			cRect.top += c.y;
			cRect.bottom += c.y;
			rect = rect.union(cRect);
		}
		
		return rect;
	}
	
	/*override*/ public getRect = (v:DisplayObject):Rectangle  =>
	{
		var rect:Rectangle = super.getRect(v);
		
		var len:number = this.children.length;
		for (var i:number = 0; i < len; i++ )
		{
			var c:DisplayObject = this.children[i];
			var cRect:Rectangle = c.getRect(c);
			cRect.left += c.x;
			cRect.right += c.x;
			cRect.top += c.y;
			cRect.bottom += c.y;
			rect = rect.union(cRect);
		}
		
		return rect;
	}
	
	/*override*/ public getFullBounds = (v:DisplayObject):Rectangle =>
	{
		var rect:Rectangle = super.getBounds(v);
		rect.width *= this.scaleX;
		rect.height *= this.scaleY;
		rect.x *= this.scaleX;
		rect.y *= this.scaleY;
		
		var len:number = this.children.length;
		for (var i:number = 0; i < len; i++ )
		{
			var c:DisplayObject = this.children[i];
			var cRect:Rectangle = c.getFullBounds(c);
			cRect.left += c.x;
			cRect.right += c.x;
			cRect.top += c.y;
			cRect.bottom += c.y;
			rect = rect.union(cRect);
		}
		
		rect.inflate(this.filterOffsetX, this.filterOffsetY); // add space for filter effects
		
		return rect;
	}
	
	/*override*/ public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
	{
		var rect:Rectangle = this.getBounds(this);
		if (rect) return rect.containsPoint(this.globalToLocal(new Point(x,y)));
		return false;
	}
	
	/*override*/ public hitTestObject = (obj:DisplayObject):boolean =>
	{
		return this.getRect(this.parent).containsRect(obj.getRect(obj.parent));
	}
	
	// TODO keep array of nested children to increase performance
	public __containsNestedChild = (child:DisplayObject):boolean  =>
	{
		for  (let c of this.children) 
		{
			if (c == child)
			{
				return true;
			}
			else if (c instanceof DisplayObjectContainer)
			{
				if ((c as DisplayObjectContainer).__containsNestedChild(child))
				{
					return true;
				}
			}
		}
		
		return false;
	}
}