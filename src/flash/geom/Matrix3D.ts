import { Orientation3D } from "./Orientation3D";
import { Vector3D } from "./Vector3D";
export class Matrix3D 
{
	private static TEMP:Matrix3D = new Matrix3D;

	constructor(v : number[] = null) 
	{ 
		if(v != null && v.length === 16) this.rawData = v;
		else this.rawData = new Array<number>(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0);
	}
	
	public get determinant():number 
	{ 
		return (this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]); 
	}
	public get position() : Vector3D {return new Vector3D(this.rawData[12],this.rawData[13],this.rawData[14])}
	public set position( val : Vector3D ) {	
		this.rawData[12] = val.x;
		this.rawData[13] = val.y;
		this.rawData[14] = val.z;
	}

	public rawData : Array<number>;
	public append(lhs : Matrix3D) : void {
		var m111 : number = this.rawData[0];
		var m121 : number = this.rawData[4];
		var m131 : number = this.rawData[8];
		var m141 : number = this.rawData[12];
		var m112 : number = this.rawData[1];
		var m122 : number = this.rawData[5];
		var m132 : number = this.rawData[9];
		var m142 : number = this.rawData[13];
		var m113 : number = this.rawData[2];
		var m123 : number = this.rawData[6];
		var m133 : number = this.rawData[10];
		var m143 : number = this.rawData[14];
		var m114 : number = this.rawData[3];
		var m124 : number = this.rawData[7];
		var m134 : number = this.rawData[11];
		var m144 : number = this.rawData[15];
		var m211 : number = lhs.rawData[0];
		var m221 : number = lhs.rawData[4];
		var m231 : number = lhs.rawData[8];
		var m241 : number = lhs.rawData[12];
		var m212 : number = lhs.rawData[1];
		var m222 : number = lhs.rawData[5];
		var m232 : number = lhs.rawData[9];
		var m242 : number = lhs.rawData[13];
		var m213 : number = lhs.rawData[2];
		var m223 : number = lhs.rawData[6];
		var m233 : number = lhs.rawData[10];
		var m243 : number = lhs.rawData[14];
		var m214 : number = lhs.rawData[3];
		var m224 : number = lhs.rawData[7];
		var m234 : number = lhs.rawData[11];
		var m244 : number = lhs.rawData[15];
		this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
		this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
		this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
		this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
		this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
		this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
		this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
		this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
		this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
		this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
		this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
		this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
		this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
		this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
		this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
		this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
	}
	
	public appendRotation(degrees : number,axis : Vector3D,pivotPoint : Vector3D = null):void
	{
		var m : Matrix3D = Matrix3D.getAxisRotation(axis.x,axis.y,axis.z,degrees);
		if(pivotPoint != null) {
			var p : Vector3D = pivotPoint;
			m.appendTranslation(p.x,p.y,p.z);
		};
		this.append(m);
	}
	
	public appendScale(xScale : number, yScale : number, zScale : number):void 
	{
		this.rawData[0] *= xScale; this.rawData[1] *= xScale; this.rawData[2] *= xScale; this.rawData[3] *= xScale;
		this.rawData[4] *= yScale; this.rawData[5] *= yScale; this.rawData[6] *= yScale; this.rawData[7] *= yScale;
		this.rawData[8] *= zScale; this.rawData[9] *= zScale; this.rawData[10] *= zScale; this.rawData[11] *= zScale;
		//this.append(new Matrix3D(Vector.<Number>([xScale,0.0,0.0,0.0,0.0,yScale,0.0,0.0,0.0,0.0,zScale,0.0,0.0,0.0,0.0,1.0])));
	}
	
	public appendTranslation(x : number,y : number,z : number):void 
	{
		this.rawData[12] += x;
		this.rawData[13] += y;
		this.rawData[14] += z;
	}
	
	public clone() : Matrix3D 
	{
		return new Matrix3D(this.rawData.concat());
	}
	
	public copyColumnFrom(column : number,vector3D : Vector3D):void
	{
		switch(column) {
		case 0:
		{
			this.rawData[0] = vector3D.x;
			this.rawData[1] = vector3D.y;
			this.rawData[2] = vector3D.z;
			this.rawData[3] = vector3D.w;
		}
		break;
		case 1:
		{
			this.rawData[4] = vector3D.x;
			this.rawData[5] = vector3D.y;
			this.rawData[6] = vector3D.z;
			this.rawData[7] = vector3D.w;
		}
		break;
		case 2:
		{
			this.rawData[8] = vector3D.x;
			this.rawData[9] = vector3D.y;
			this.rawData[10] = vector3D.z;
			this.rawData[11] = vector3D.w;
		}
		break;
		case 3:
		{
			this.rawData[12] = vector3D.x;
			this.rawData[13] = vector3D.y;
			this.rawData[14] = vector3D.z;
			this.rawData[15] = vector3D.w;
		}
		break;
		default:
		throw new Error("Error, Column " + column + " out of bounds [0, ..., 3]");
		break;
		}
	}
	
	public copyColumnTo(column : number,vector3D : Vector3D):void 
	{
		var c4:number = column * 4;
		vector3D.x = this.rawData[c4];
		vector3D.y = this.rawData[1+c4];
		vector3D.z = this.rawData[2+c4];
		vector3D.w = this.rawData[3+c4];		
	}
	
	public copyFrom(other : Matrix3D) : void {
		this.rawData = other.rawData.concat();
	}
	
	public copyRawDataFrom(vector : number[],index : number = 0,transpose : boolean = false) : void {
		if(transpose) this.transpose();
		var l : number = vector.length - index;
		{
			var _g : number = 0;
			while(_g < Number(l)) {
				var c : number = _g++;
				this.rawData[c] = vector[c + index];
			}
		};
		if(transpose) this.transpose();
	}
	
	public copyRawDataTo(vector : number[],index : number = 0,transpose : boolean = false) : void {
		if(transpose) this.transpose();
		var l : number = this.rawData.length;
		{
			var _g : number = 0;
			while(_g < l) {
				var c : number = _g++;
				vector[c + index] = this.rawData[c];
			}
		};
		if(transpose) this.transpose();
	}
	
	public copyRowFrom(row : number,vector3D : Vector3D) : void {
		switch(row) {
		case 0:
		{
			this.rawData[0] = vector3D.x;
			this.rawData[4] = vector3D.y;
			this.rawData[8] = vector3D.z;
			this.rawData[12] = vector3D.w;
		}
		break;
		case 1:
		{
			this.rawData[1] = vector3D.x;
			this.rawData[5] = vector3D.y;
			this.rawData[9] = vector3D.z;
			this.rawData[13] = vector3D.w;
		}
		break;
		case 2:
		{
			this.rawData[2] = vector3D.x;
			this.rawData[6] = vector3D.y;
			this.rawData[10] = vector3D.z;
			this.rawData[14] = vector3D.w;
		}
		break;
		case 3:
		{
			this.rawData[3] = vector3D.x;
			this.rawData[7] = vector3D.y;
			this.rawData[11] = vector3D.z;
			this.rawData[15] = vector3D.w;
		}
		break;
		default:
		throw new Error("Error, Row " + ("" + row) + " out of bounds [0, ..., 3]");
		break;
		}
	}
	
	public copyRowTo(row : number,vector3D : Vector3D) : void {
		vector3D.x = this.rawData[row];
		vector3D.y = this.rawData[4+row];
		vector3D.z = this.rawData[8+row];
		vector3D.w = this.rawData[12+row];
	}
	
	public copyToMatrix3D(other : Matrix3D) : void {
		other.rawData = this.rawData.concat();
	}
	
	public decompose(orientationStyle : string = null) : Vector3D[] {
		if(orientationStyle == null) orientationStyle = Orientation3D.EULER_ANGLES;
		var vec : Vector3D[] = [];
		var m : Matrix3D = this.clone();
		var mr : number[] = m.rawData.concat();
		var pos : Vector3D = new Vector3D(mr[12],mr[13],mr[14]);
		var scale : Vector3D = new Vector3D();
		scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
		scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
		scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
		if(mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0) scale.z = -scale.z;
		mr[0] /= scale.x;
		mr[1] /= scale.x;
		mr[2] /= scale.x;
		mr[4] /= scale.y;
		mr[5] /= scale.y;
		mr[6] /= scale.y;
		mr[8] /= scale.z;
		mr[9] /= scale.z;
		mr[10] /= scale.z;
		var rot : Vector3D = new Vector3D();
		switch(orientationStyle) {
		case Orientation3D.AXIS_ANGLE:
		{
			rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);
			var len : number = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
			if(len != 0) {
				rot.x = (mr[6] - mr[9]) / len;
				rot.y = (mr[8] - mr[2]) / len;
				rot.z = (mr[1] - mr[4]) / len;
			}
			else rot.x = rot.y = rot.z = 0;
		}
		break;
		case Orientation3D.QUATERNION:
		{
			var tr : number = (mr[0] + mr[5] + mr[10]);
			if(tr > 0) {
				rot.w = Math.sqrt(1 + tr) / 2;
				rot.x = (mr[6] - mr[9]) / (4 * rot.w);
				rot.y = (mr[8] - mr[2]) / (4 * rot.w);
				rot.z = (mr[1] - mr[4]) / (4 * rot.w);
			}
			else if(mr[0] > mr[5] && mr[0] > mr[10]) {
				rot.x = Math.sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;
				rot.w = (mr[6] - mr[9]) / (4 * rot.x);
				rot.y = (mr[1] + mr[4]) / (4 * rot.x);
				rot.z = (mr[8] + mr[2]) / (4 * rot.x);
			}
			else if(mr[5] > mr[10]) {
				rot.y = Math.sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;
				rot.x = (mr[1] + mr[4]) / (4 * rot.y);
				rot.w = (mr[8] - mr[2]) / (4 * rot.y);
				rot.z = (mr[6] + mr[9]) / (4 * rot.y);
			}
			else {
				rot.z = Math.sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;
				rot.x = (mr[8] + mr[2]) / (4 * rot.z);
				rot.y = (mr[6] + mr[9]) / (4 * rot.z);
				rot.w = (mr[1] - mr[4]) / (4 * rot.z);
			}
		}
		break;
		case Orientation3D.EULER_ANGLES:
		{
			rot.y = Math.asin(-mr[2]);
			if(mr[2] != 1 && mr[2] != -1) {
				rot.x = Math.atan2(mr[6],mr[10]);
				rot.z = Math.atan2(mr[1],mr[0]);
			}
			else {
				rot.z = 0;
				rot.x = Math.atan2(mr[4],mr[5]);
			}
		}
		break;
		};
		vec.push(pos);
		vec.push(rot);
		vec.push(scale);
		return vec;
	}
	
	public deltaTransformVector(v : Vector3D) : Vector3D {
		var x : number = v.x;
		var y : number = v.y;
		var z : number = v.z;
		return new Vector3D(x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[3],x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[7],x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[11],0);
	}
	
	public identity() : void {
		this.rawData[0] = 1;this.rawData[1] = 0;this.rawData[2] = 0;this.rawData[3] = 0;
		this.rawData[4] = 0;this.rawData[5] = 1;this.rawData[6] = 0;this.rawData[7] = 0;
		this.rawData[8] = 0;this.rawData[9] = 0;this.rawData[10] = 1;this.rawData[11] = 0;
		this.rawData[12] = 0;this.rawData[13] = 0;this.rawData[14] = 0;this.rawData[15] = 1;
	}
	
	public interpolateTo(toMat : Matrix3D,percent : number) : void {
		var _g : number = 0;
		while(_g < 16) {
			var i : number = _g++;
			this.rawData[i] = this.rawData[i] + (toMat.rawData[i] - this.rawData[i]) * percent;
		}
	}
	
	public invert() : boolean {
		var d : number = this.determinant;
		var invertable : boolean = Math.abs(d) > 0.00000000001;
		if(invertable) {
			d = 1 / d;
			var m11 : number = this.rawData[0];
			var m21 : number = this.rawData[4];
			var m31 : number = this.rawData[8];
			var m41 : number = this.rawData[12];
			var m12 : number = this.rawData[1];
			var m22 : number = this.rawData[5];
			var m32 : number = this.rawData[9];
			var m42 : number = this.rawData[13];
			var m13 : number = this.rawData[2];
			var m23 : number = this.rawData[6];
			var m33 : number = this.rawData[10];
			var m43 : number = this.rawData[14];
			var m14 : number = this.rawData[3];
			var m24 : number = this.rawData[7];
			var m34 : number = this.rawData[11];
			var m44 : number = this.rawData[15];
			this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
			this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
			this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
			this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
			this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
			this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
			this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
			this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
			this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
			this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
			this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
			this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
			this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
			this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
			this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
			this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
		};
		return invertable;
	}
	
	public pointAt(pos : Vector3D,at : Vector3D = null,up : Vector3D = null) : void {
		if(at == null) at = new Vector3D(0,0,-1);
		if(up == null) up = new Vector3D(0,-1,0);
		var dir : Vector3D = at.subtract(pos);
		var vup : Vector3D = up.clone();
		var right : Vector3D;
		dir.normalize();
		vup.normalize();
		var dir2 : Vector3D = dir.clone();
		dir2.scaleBy(vup.dotProduct(dir));
		vup = vup.subtract(dir2);
		if(vup.length > 0) vup.normalize();
		else if(dir.x != 0) vup = new Vector3D(-dir.y,dir.x,0);
		else vup = new Vector3D(1,0,0);
		right = vup.crossProduct(dir);
		right.normalize();
		this.rawData[0] = right.x;
		this.rawData[4] = right.y;
		this.rawData[8] = right.z;
		this.rawData[12] = 0.0;
		this.rawData[1] = vup.x;
		this.rawData[5] = vup.y;
		this.rawData[9] = vup.z;
		this.rawData[13] = 0.0;
		this.rawData[2] = dir.x;
		this.rawData[6] = dir.y;
		this.rawData[10] = dir.z;
		this.rawData[14] = 0.0;
		this.rawData[3] = pos.x;
		this.rawData[7] = pos.y;
		this.rawData[11] = pos.z;
		this.rawData[15] = 1.0;
	}
	
	public prepend(rhs : Matrix3D) : void {
		var m111 : number = rhs.rawData[0];
		var m121 : number = rhs.rawData[4];
		var m131 : number = rhs.rawData[8];
		var m141 : number = rhs.rawData[12];
		var m112 : number = rhs.rawData[1];
		var m122 : number = rhs.rawData[5];
		var m132 : number = rhs.rawData[9];
		var m142 : number = rhs.rawData[13];
		var m113 : number = rhs.rawData[2];
		var m123 : number = rhs.rawData[6];
		var m133 : number = rhs.rawData[10];
		var m143 : number = rhs.rawData[14];
		var m114 : number = rhs.rawData[3];
		var m124 : number = rhs.rawData[7];
		var m134 : number = rhs.rawData[11];
		var m144 : number = rhs.rawData[15];
		var m211 : number = this.rawData[0];
		var m221 : number = this.rawData[4];
		var m231 : number = this.rawData[8];
		var m241 : number = this.rawData[12];
		var m212 : number = this.rawData[1];
		var m222 : number = this.rawData[5];
		var m232 : number = this.rawData[9];
		var m242 : number = this.rawData[13];
		var m213 : number = this.rawData[2];
		var m223 : number = this.rawData[6];
		var m233 : number = this.rawData[10];
		var m243 : number = this.rawData[14];
		var m214 : number = this.rawData[3];
		var m224 : number = this.rawData[7];
		var m234 : number = this.rawData[11];
		var m244 : number = this.rawData[15];
		this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
		this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
		this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
		this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
		this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
		this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
		this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
		this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
		this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
		this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
		this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
		this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
		this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
		this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
		this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
		this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
	}
	
	public prependRotation(degrees : number,axis:Vector3D, pivotPoint:Vector3D = null) : void {
		var m : Matrix3D = Matrix3D.getAxisRotation(axis.x,axis.y,axis.z,degrees);
		if(pivotPoint != null) {
			var p:Vector3D = pivotPoint;
			m.appendTranslation(p.x,p.y,p.z);
		};
		this.prepend(m);
	}
	
	public prependScale(xScale : number,yScale : number,zScale : number) : void {
		//this.prepend(new Matrix3D(Vector.<Number>([xScale,0.0,0.0,0.0,0.0,yScale,0.0,0.0,0.0,0.0,zScale,0.0,0.0,0.0,0.0,1.0])));
		this.rawData[0] *= xScale; this.rawData[1] *= yScale; this.rawData[2] *= zScale;
		this.rawData[4] *= xScale; this.rawData[5] *= yScale; this.rawData[6] *= zScale;
		this.rawData[8] *= xScale; this.rawData[9] *= yScale; this.rawData[10] *= zScale;
		this.rawData[12] *= xScale; this.rawData[13] *= yScale; this.rawData[14] *= zScale;
	}
	
	public prependTranslation(x : number,y : number,z : number) : void {
		var m : Matrix3D = Matrix3D.TEMP;
		m.identity();
		m.position=(new Vector3D(x,y,z));
		this.prepend(m);
	}
	
	public recompose(components : Vector3D[],orientationStyle : string = null) : boolean {
		if(components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
		if(orientationStyle == null) orientationStyle = Orientation3D.EULER_ANGLES;
		this.identity();
		var scale : any[] = [];
		scale[0] = scale[1] = scale[2] = components[2].x;
		scale[4] = scale[5] = scale[6] = components[2].y;
		scale[8] = scale[9] = scale[10] = components[2].z;
		switch(orientationStyle) {
		case Orientation3D.EULER_ANGLES:
		{
			var cx : number = Math.cos(components[1].x);
			var cy : number = Math.cos(components[1].y);
			var cz : number = Math.cos(components[1].z);
			var sx : number = Math.sin(components[1].x);
			var sy : number = Math.sin(components[1].y);
			var sz : number = Math.sin(components[1].z);
			this.rawData[0] = cy * cz * scale[0];
			this.rawData[1] = cy * sz * scale[1];
			this.rawData[2] = -sy * scale[2];
			this.rawData[3] = 0;
			this.rawData[4] = (sx * sy * cz - cx * sz) * scale[4];
			this.rawData[5] = (sx * sy * sz + cx * cz) * scale[5];
			this.rawData[6] = sx * cy * scale[6];
			this.rawData[7] = 0;
			this.rawData[8] = (cx * sy * cz + sx * sz) * scale[8];
			this.rawData[9] = (cx * sy * sz - sx * cz) * scale[9];
			this.rawData[10] = cx * cy * scale[10];
			this.rawData[11] = 0;
			this.rawData[12] = components[0].x;
			this.rawData[13] = components[0].y;
			this.rawData[14] = components[0].z;
			this.rawData[15] = 1;
		}
		break;
		default:
		{
			var x : number = components[1].x;
			var y : number = components[1].y;
			var z : number = components[1].z;
			var w : number = components[1].w;
			if(orientationStyle == Orientation3D.AXIS_ANGLE) {
				x *= Math.sin(w / 2);
				y *= Math.sin(w / 2);
				z *= Math.sin(w / 2);
				w = Math.cos(w / 2);
			};
			this.rawData[0] = (1 - 2 * y * y - 2 * z * z) * scale[0];
			this.rawData[1] = (2 * x * y + 2 * w * z) * scale[1];
			this.rawData[2] = (2 * x * z - 2 * w * y) * scale[2];
			this.rawData[3] = 0;
			this.rawData[4] = (2 * x * y - 2 * w * z) * scale[4];
			this.rawData[5] = (1 - 2 * x * x - 2 * z * z) * scale[5];
			this.rawData[6] = (2 * y * z + 2 * w * x) * scale[6];
			this.rawData[7] = 0;
			this.rawData[8] = (2 * x * z + 2 * w * y) * scale[8];
			this.rawData[9] = (2 * y * z - 2 * w * x) * scale[9];
			this.rawData[10] = (1 - 2 * x * x - 2 * y * y) * scale[10];
			this.rawData[11] = 0;
			this.rawData[12] = components[0].x;
			this.rawData[13] = components[0].y;
			this.rawData[14] = components[0].z;
			this.rawData[15] = 1;
		}
		break;
		};
		if(components[2].x === 0) this.rawData[0] = 1e-15;
		if(components[2].y === 0) this.rawData[5] = 1e-15;
		if(components[2].z === 0) this.rawData[10] = 1e-15;
		return !(components[2].x === 0 || components[2].y === 0 || components[2].y === 0);
	}
	
	public transformVector(v :Vector3D):Vector3D {
		var x : number = v.x;
		var y : number = v.y;
		var z : number = v.z;
		return new Vector3D(x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12],x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13],x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14],x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11] + this.rawData[15]);
	}
	
	public transformVectors(vin : number[],vout : number[]) : void {
		var i : number = 0;
		while(i + 3 <= vin.length) {
			var x : number = vin[i];
			var y : number = vin[i + 1];
			var z : number = vin[i + 2];
			vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
			vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
			vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
			i += 3;
		}
	}
	
	public transpose() : void {
		var oRawData : number[] = this.rawData.concat();
		this.rawData[1] = oRawData[4];
		this.rawData[2] = oRawData[8];
		this.rawData[3] = oRawData[12];
		this.rawData[4] = oRawData[1];
		this.rawData[6] = oRawData[9];
		this.rawData[7] = oRawData[13];
		this.rawData[8] = oRawData[2];
		this.rawData[9] = oRawData[6];
		this.rawData[11] = oRawData[14];
		this.rawData[12] = oRawData[3];
		this.rawData[13] = oRawData[7];
		this.rawData[14] = oRawData[11];
	}
	
	public static interpolate(thisMat : Matrix3D,toMat : Matrix3D,percent : number) : Matrix3D {
		var m : Matrix3D = new Matrix3D();
		{
			var _g : number = 0;
			while(_g < 16) {
				var i : number = _g++;
				m.rawData[i] = thisMat.rawData[i] + (toMat.rawData[i] - thisMat.rawData[i]) * percent;
			}
		};
		return m;
	}
	
	protected static getAxisRotation(x : number,y : number,z : number,degrees : number,target:Matrix3D=null) : Matrix3D {
		var m : Matrix3D =target|| new Matrix3D();
		var rad : number = -degrees * (Math.PI / 180);
		var c : number = Math.cos(rad);
		var s : number = Math.sin(rad);
		var t : number = 1.0 - c;
		m.rawData[0] = c + x * x * t;
		m.rawData[5] = c + y * y * t;
		m.rawData[10] = c + z * z * t;
		var tmp1 : number = x * y * t;
		var tmp2 : number = z * s;
		m.rawData[4] = tmp1 + tmp2;
		m.rawData[1] = tmp1 - tmp2;
		tmp1 = x * z * t;
		tmp2 = y * s;
		m.rawData[8] = tmp1 - tmp2;
		m.rawData[2] = tmp1 + tmp2;
		tmp1 = y * z * t;
		tmp2 = x * s;
		m.rawData[9] = tmp1 + tmp2;
		m.rawData[6] = tmp1 - tmp2;
		return m;
	}
	
}