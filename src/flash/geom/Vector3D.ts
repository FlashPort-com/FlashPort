
 export class Vector3D extends Object
{
   
   public static X_AXIS:Vector3D = new Vector3D(1,0,0);
   
   public static Y_AXIS:Vector3D = new Vector3D(0,1,0);
   
   public static Z_AXIS:Vector3D = new Vector3D(0,0,1);
      
   public x:number;
   
   public y:number;
   
   public z:number;
   
   public w:number;
   
   constructor(x:number = 0.0, y:number = 0.0, z:number = 0.0, w:number = 0.0){
      super();
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
   }
   
   public static angleBetween(a:Vector3D, b:Vector3D) : number
   {
      var dot:number = a.x * b.x + a.y * b.y + a.z * b.z;
      var al:number = a.length;
      var bl:number = b.length;
      dot = dot / (al * bl);
      
      return Math.acos(dot);
   }
   
   public static distance(pt1:Vector3D, pt2:Vector3D) : number
   {
      return pt1.subtract(pt2).length;
   }
   
   public clone() : Vector3D
   {
      return new Vector3D(this.x,this.y,this.z,this.w);
   }
   
   public dotProduct(a:Vector3D) : number
   {
      return this.x * a.x + this.y * a.y + this.z * a.z;
   }
   
   public crossProduct(a:Vector3D) : Vector3D
   {
      return new Vector3D(this.y * a.z - this.z * a.y,this.z * a.x - this.x * a.z,this.x * a.y - this.y * a.x,1);
   }
   
   public get length() : number
   {
      var r:number = this.x * this.x + this.y * this.y + this.z * this.z;
      if(r <= 0)
      {
         return 0;
      }
      return Math.sqrt(r);
   }
   
   public get lengthSquared() : number
   {
      return this.x * this.x + this.y * this.y + this.z * this.z;
   }
   
   public normalize() : number
   {
      var len:number = this.length;
      var lenInv:number = len != 0?1 / len:0;
      this.x = this.x * lenInv;
      this.y = this.y * lenInv;
      this.z = this.z * lenInv;
      return len;
   }
   
   public scaleBy(s:number) : void
   {
      this.x = this.x * s;
      this.y = this.y * s;
      this.z = this.z * s;
   }
   
   public incrementBy(a:Vector3D) : void
   {
      this.x = this.x + a.x;
      this.y = this.y + a.y;
      this.z = this.z + a.z;
   }
   
   public decrementBy(a:Vector3D) : void
   {
      this.x = this.x - a.x;
      this.y = this.y - a.y;
      this.z = this.z - a.z;
   }
   
   public add(a:Vector3D) : Vector3D
   {
      return new Vector3D(this.x + a.x,this.y + a.y,this.z + a.z);
   }
   
   public subtract(a:Vector3D) : Vector3D
   {
      return new Vector3D(this.x - a.x,this.y - a.y,this.z - a.z);
   }
   
   public negate() : void
   {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
   }
   
   public equals(toCompare:Vector3D, allFour:boolean = false) : boolean
   {
      return this.x === toCompare.x && this.y === toCompare.y && this.z === toCompare.z && (allFour?this.w === toCompare.w:true);
   }
   
   public nearEquals(toCompare:Vector3D, tolerance:number, allFour:boolean = false) : boolean
   {
      var diff:number = this.x - toCompare.x;
      diff = diff < 0?0 - diff:diff;
      var goodEnough:boolean = diff < tolerance;
      if(goodEnough)
      {
         diff = this.y - toCompare.y;
         diff = diff < 0?0 - diff:diff;
         goodEnough = diff < tolerance;
         if(goodEnough)
         {
            diff = this.z - toCompare.z;
            diff = diff < 0?0 - diff:diff;
            goodEnough = diff < tolerance;
            if(goodEnough && allFour)
            {
               diff = this.w = toCompare.w;
               diff = diff < 0?0 - diff:diff;
               goodEnough = diff < tolerance;
            }
         }
      }
      return goodEnough;
   }
   
   public project() : void
   {
      var tRecip:number = 1 / this.w;
      this.x = this.x * tRecip;
      this.y = this.y * tRecip;
      this.z = this.z * tRecip;
   }
   
   public toString() : string
   {
      var s:string = "Vector3D(" + this.x + ", " + this.y + ", " + this.z;
      s = s + ")";
      return s;
   }
   
   public copyFrom(sourceVector3D:Vector3D) : void
   {
      this.x = sourceVector3D.x;
      this.y = sourceVector3D.y;
      this.z = sourceVector3D.z;
   }
   
   public setTo(xa:number, ya:number, za:number) : void
   {
      this.x = xa;
      this.y = ya;
      this.z = za;
   }
}