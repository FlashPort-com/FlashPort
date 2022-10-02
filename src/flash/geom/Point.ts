export class Point extends Object
{
   public x:number;
   public y:number;
   
   constructor(x:number = 0, y:number = 0)
   {
      super();
      this.x = x;
      this.y = y;
   }
   
   public static interpolate = (pt1:Point, pt2:Point, f:number) : Point =>
   {
      return new Point(pt2.x + f * (pt1.x - pt2.x),pt2.y + f * (pt1.y - pt2.y));
   }
   
   public static distance = (pt1:Point, pt2:Point) : number =>
   {
      return pt1.subtract(pt2).length;
   }
   
   public static polar = (len:number, angle:number) : Point =>
   {
      return new Point(len * Math.cos(angle),len * Math.sin(angle));
   }
   
   public get length() : number
   {
      return Math.sqrt(this.x * this.x + this.y * this.y);
   }
   
   public clone = () : Point =>
   {
      return new Point(this.x,this.y);
   }
   
   public offset = (dx:number, dy:number) : void =>
   {
      this.x = this.x + dx;
      this.y = this.y + dy;
   }
   
   public equals = (toCompare:Point) : boolean =>
   {
      return toCompare.x === this.x && toCompare.y === this.y;
   }
   
   public subtract = (v:Point) : Point =>
   {
      return new Point(this.x - v.x,this.y - v.y);
   }
   
   public add = (v:Point) : Point =>
   {
      return new Point(this.x + v.x,this.y + v.y);
   }
   
   public normalize = (thickness:number) : void =>
   {
      var invD:number = this.length;
      if(invD > 0)
      {
         invD = thickness / invD;
         this.x = this.x * invD;
         this.y = this.y * invD;
      }
   }
   
   public toString = ():string =>
   {
      return "(x=" + this.x + ", y=" + this.y + ")";
   }
   
   public copyFrom = (sourcePoint:Point):void =>
   {
      this.x = sourcePoint.x;
      this.y = sourcePoint.y;
   }
   
   public setTo = (xa:number, ya:number):void =>
   {
      this.x = xa;
      this.y = ya;
   }
}