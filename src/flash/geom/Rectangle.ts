import { Point } from "./Point.js";
import { Matrix } from "./Matrix.js";

export class Rectangle extends Object
{
	
	public x:number;
	
	public y:number;
	
	public width:number;
	
	public height:number;
	
	constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0){
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	public get left():number
	{
		return this.x;
	}
	
	public set left(value:number)
	{
		this.width = this.width + (this.x - value);
		this.x = value;
	}
	
	public get right():number
	{
		return this.x + this.width;
	}
	
	public set right(value:number)
	{
		this.width = value - this.x;
	}
	
	public get top():number
	{
		return this.y;
	}
	
	public set top(value:number)
	{
		this.height = this.height + (this.y - value);
		this.y = value;
	}
	
	public get bottom():number
	{
		return this.y + this.height;
	}
	
	public set bottom(value:number)
	{
		this.height = value - this.y;
	}
	
	public get topLeft():Point
	{
		return new Point(this.x, this.y);
	}
	
	public set topLeft(value:Point)
	{
		this.width = this.width + (this.x - value.x);
		this.height = this.height + (this.y - value.y);
		this.x = value.x;
		this.y = value.y;
	}
	
	public get bottomRight():Point
	{
		return new Point(this.right, this.bottom);
	}
	
	public set bottomRight(value:Point)
	{
		this.width = value.x - this.x;
		this.height = value.y - this.y;
	}
	
	public get size():Point
	{
		return new Point(this.width, this.height);
	}
	
	public set size(value:Point)
	{
		this.width = value.x;
		this.height = value.y;
	}
	
	public clone():Rectangle
	{
		return new Rectangle(this.x, this.y, this.width, this.height);
	}
	
	public isEmpty():boolean
	{
		return this.width <= 0 || this.height <= 0;
	}
	
	public setEmpty():void
	{
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
	}
	
	public inflate(dx:number, dy:number):void
	{
		this.x = this.x - dx;
		this.width = this.width + 2 * dx;
		this.y = this.y - dy;
		this.height = this.height + 2 * dy;
	}
	
	public inflatePoint(point:Point):void
	{
		this.x = this.x - point.x;
		this.width = this.width + 2 * point.x;
		this.y = this.y - point.y;
		this.height = this.height + 2 * point.y;
	}
	
	public offset(dx:number, dy:number):void
	{
		this.x = this.x + dx;
		this.y = this.y + dy;
	}
	
	public offsetPoint(point:Point):void
	{
		this.x = this.x + point.x;
		this.y = this.y + point.y;
	}
	
	public contains(x:number, y:number):boolean
	{
		return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
	}
	
	public containsPoint(point:Point):boolean
	{
		return point.x >= this.x && point.x < this.x + this.width && point.y >= this.y && point.y < this.y + this.height;
	}
	
	public containsRect(rect:Rectangle):boolean
	{
		var r1:number = rect.x + rect.width;
		var b1:number = rect.y + rect.height;
		var r2:number = this.x + this.width;
		var b2:number = this.y + this.height;
		return rect.x >= this.x && rect.x < r2 && rect.y >= this.y && rect.y < b2 && r1 > this.x && r1 <= r2 && b1 > this.y && b1 <= b2;
	}
	
	public intersection(toIntersect:Rectangle):Rectangle
	{
		var result:Rectangle = new Rectangle();
		if (this.isEmpty() || toIntersect.isEmpty())
		{
			result.setEmpty();
			return result;
		}
		result.x = Math.max(this.x, toIntersect.x);
		result.y = Math.max(this.y, toIntersect.y);
		result.width = Math.min(this.x + this.width, toIntersect.x + toIntersect.width) - result.x;
		result.height = Math.min(this.y + this.height, toIntersect.y + toIntersect.height) - result.y;
		if (result.width <= 0 || result.height <= 0)
		{
			result.setEmpty();
		}
		return result;
	}
	
	public intersects(toIntersect:Rectangle):boolean
	{
		if (this.isEmpty() || toIntersect.isEmpty())
		{
			return false;
		}
		var resultx:number = Math.max(this.x, toIntersect.x);
		var resulty:number = Math.max(this.y, toIntersect.y);
		var resultwidth:number = Math.min(this.x + this.width, toIntersect.x + toIntersect.width) - resultx;
		var resultheight:number = Math.min(this.y + this.height, toIntersect.y + toIntersect.height) - resulty;
		if (resultwidth <= 0 || resultheight <= 0)
		{
			return false;
		}
		return true;
	}
	
	public union(toUnion:Rectangle):Rectangle
	{
		var r:Rectangle = null;
		if (this.isEmpty())
		{
			return toUnion.clone();
		}
		if (toUnion.isEmpty())
		{
			return this.clone();
		}
		r = new Rectangle();
		r.x = Math.min(this.x, toUnion.x);
		r.y = Math.min(this.y, toUnion.y);
		r.width = Math.max(this.x + this.width, toUnion.x + toUnion.width) - r.x;
		r.height = Math.max(this.y + this.height, toUnion.y + toUnion.height) - r.y;
		return r;
	}
	
	public equals(toCompare:Rectangle):boolean
	{
		return toCompare.x === this.x && toCompare.y === this.y && toCompare.width === this.width && toCompare.height === this.height;
	}
	
	public toString():string
	{
		return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
	}
	
	public copyFrom(sourceRect:Rectangle):void
	{
		this.x = sourceRect.x;
		this.y = sourceRect.y;
		this.width = sourceRect.width;
		this.height = sourceRect.height;
	}
	
	public setTo(xa:number, ya:number, widtha:number, heighta:number):void
	{
		this.x = xa;
		this.y = ya;
		this.width = widtha;
		this.height = heighta;
	}
	
	public __transform(rect:Rectangle, m:Matrix):void
	{
		var tx0:number = m.a * this.x + m.c * this.y;
		var tx1:number = tx0;
		var ty0:number = m.b * this.x + m.d * this.y;
		var ty1:number = ty0;
		
		var tx:number = m.a * (this.x + this.width) + m.c * this.y;
		var ty:number = m.b * (this.x + this.width) + m.d * this.y;
		
		if (tx < tx0) tx0 = tx;
		if (ty < ty0) ty0 = ty;
		if (tx > tx1) tx1 = tx;
		if (ty > ty1) ty1 = ty;
		
		tx = m.a * (this.x + this.width) + m.c * (this.y + this.height);
		ty = m.b * (this.x + this.width) + m.d * (this.y + this.height);
		
		if (tx < tx0) tx0 = tx;
		if (ty < ty0) ty0 = ty;
		if (tx > tx1) tx1 = tx;
		if (ty > ty1) ty1 = ty;
		
		tx = m.a * this.x + m.c * (this.y + this.height);
		ty = m.b * this.x + m.d * (this.y + this.height);
		
		if (tx < tx0) tx0 = tx;
		if (ty < ty0) ty0 = ty;
		if (tx > tx1) tx1 = tx;
		if (ty > ty1) ty1 = ty;
		
		rect.setTo(tx0 + m.tx, ty0 + m.ty, tx1 - tx0, ty1 - ty0);
	}
	
	public __expand(x:number, y:number, width:number, height:number):void
	{
		if (this.width == 0 && this.height == 0)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return;
		}
		
		var cacheRight:number = this.right;
		var cacheBottom:number = this.bottom;
		
		if (this.x > x)
		{
			this.x = x;
			this.width = cacheRight - x;
		}
		if (this.y > y)
		{
			this.y = y;
			this.height = cacheBottom - y;
		}
		if (cacheRight < x + width) this.width = x + width - this.x;
		if (cacheBottom < y + height) this.height = y + height - this.y;
	}
}