import { Point } from "./Point.js";
import { Vector3D } from "./Vector3D.js";
	
export class Matrix
{
	public a:number;
	public b:number;
	public c:number;
	public d:number;
	public tx:number;
	public ty:number;
	private t0:number;
	private t1:number;
	private t2:number;
	private t3:number;

	constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0)
	{	
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
	}
	
	public clone():Matrix
	{
		return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}
	
	public concat(m:Matrix):void
	{
		this.t0 = this.a;
		this.a = this.a * m.a + this.b * m.c;
		this.b = this.t0 * m.b + this.b * m.d;
		
		this.t0 = this.c;
		this.c = this.c * m.a + this.d * m.c;
		this.d = this.t0 * m.b + this.d * m.d;

		this.t0 = this.tx;
		this.tx = this.tx * m.a + this.ty * m.c + m.tx;
		this.ty = this.t0 * m.b + this.ty * m.d + m.ty;
	}
	
	public invert():void
	{
		if (this.b === 0 && this.c === 0)
		{
			this.a = 1 / this.a;
			this.d = 1 / this.d;
			this.tx *= -this.a;
			this.ty *= -this.d;
		}
		else
		{
			var det:number = this.a * this.d - this.b * this.c;
			if (det === 0)
			{
				this.a = this.d = 1;
				this.b = this.c = 0;
				this.tx = this.ty = 0;
			}else{
				det = 1 / det;
				this.t0 = this.a;
				this.t1 = this.b;
				this.t2 = this.c;
				this.t3 = this.d;
				this.a = this.t3 * det;
				this.b = -this.t1 * det;
				this.c = -this.t2 * det;
				this.d = this.t0 * det;
				this.t0 = -(this.b * this.tx + this.d * this.ty);
				this.tx = -(this.a * this.tx + this.c * this.ty);
				this.ty = this.t0;
			}
		}
	}
	
	public identity():void 
	{
		this.a = this.d = 1;
		this.b = this.c = 0;
		this.tx = this.ty = 0;
	}
	
	public createBox(scaleX:number, scaleY:number, rotation:number = 0, tx:number = 0, ty:number = 0):void
	{
		var u:number = Math.cos(rotation);
		var v:number = Math.sin(rotation);
		this.a = u * scaleX;
		this.b = v * scaleY;
		this.c = -v * scaleX;
		this.d = u * scaleY;
		this.tx = tx;
		this.ty = ty;
	}
	
	public createGradientBox(width:number, height:number, rotation:number = 0, tx:number = 0, ty:number = 0):void
	{
		this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
	}
	
	public rotate(angle:number):void
	{
		var u:number = Math.cos(angle);
		var v:number = Math.sin(angle);
		this.t0 = this.a;
		this.t1 = this.c;
		this.t2 = this.tx;
		this.a = u * this.a - v * this.b;
		this.b = v * this.t0 + u * this.b;
		this.c = u * this.c - v * this.d;
		this.d = v * this.t1 + u * this.d;
		this.tx = u * this.tx - v * this.ty;
		this.ty = v * this.t2 + u * this.ty;
	}
	
	public translate(dx:number, dy:number):void
	{
		this.tx += dx;
		this.ty += dy;
	}
	
	public scale(sx:number, sy:number):void
	{
		this.a *= sx;
		this.b *= sy;
		this.c *= sx;
		this.d *= sy;
		this.tx *= sx;
		this.ty *= sy;
	}
	
	public deltaTransformPoint(point:Point):Point
	{
		return new Point(this.a * point.x + this.c * point.y, this.d * point.y + this.b * point.x);
	}
	
	public transformPoint(point:Point):Point
	{
		return new Point(this.a * point.x + this.c * point.y + this.tx, this.d * point.y + this.b * point.x + this.ty);
	}
	
	public toString():string
	{
		return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
	}
	
	public copyFrom(sourceMatrix:Matrix):void
	{
		this.a = sourceMatrix.a;
		this.b = sourceMatrix.b;
		this.c = sourceMatrix.c;
		this.d = sourceMatrix.d;
		this.tx = sourceMatrix.tx;
		this.ty = sourceMatrix.ty;
	}
	
	public setTo(aa:number, ba:number, ca:number, da:number, txa:number, tya:number):void
	{
		this.a = aa;
		this.b = ba;
		this.c = ca;
		this.d = da;
		this.tx = txa;
		this.ty = tya;
	}
	
	public copyRowTo(row:number, vector3D:Vector3D):void
	{
		switch (row)
		{
		case 0: 
			break;
		case 1: 
			vector3D.x = this.b;
			vector3D.y = this.d;
			vector3D.z = this.ty;
			break;
		case 2: 
		case 3: 
			vector3D.x = 0;
			vector3D.y = 0;
			vector3D.z = 1;
			break;
		default: 
			vector3D.x = this.a;
			vector3D.y = this.c;
			vector3D.z = this.tx;
		}
	}
	
	public copyColumnTo(column:number, vector3D:Vector3D):void
	{
		switch (column)
		{
		case 0: 
			break;
		case 1: 
			vector3D.x = this.c;
			vector3D.y = this.d;
			vector3D.z = 0;
			break;
		case 2: 
		case 3: 
			vector3D.x = this.tx;
			vector3D.y = this.ty;
			vector3D.z = 1;
			break;
		default: 
			vector3D.x = this.a;
			vector3D.y = this.b;
			vector3D.z = 0;
		}
	}
	
	public copyRowFrom(row:number, vector3D:Vector3D):void
	{
		switch (row)
		{
		case 0: 
			break;
		case 1: 
		case 2: 
			this.b = vector3D.x;
			this.d = vector3D.y;
			this.ty = vector3D.z;
			break;
		default: 
			this.a = vector3D.x;
			this.c = vector3D.y;
			this.tx = vector3D.z;
		}
	}
	
	public copyColumnFrom(column:number, vector3D:Vector3D):void
	{
		switch (column)
		{
		case 0: 
			break;
		case 1: 
		case 2: 
			this.b = vector3D.x;
			this.d = vector3D.y;
			this.ty = vector3D.z;
			break;
		default: 
			this.a = vector3D.x;
			this.c = vector3D.y;
			this.tx = vector3D.z;
		}
	}
}