import { Point } from "./Point";
import { Matrix3D } from "./Matrix3D";

export class PerspectiveProjection extends Object
{
   constructor()
   {
      super();
      this.ctor();
   }
   
   private ctor() : void{}
   
   public get fieldOfView() : number{return 0}
   
   public set fieldOfView(param1:number){}
   
   public get projectionCenter() : Point{return null}
   
   public set projectionCenter(param1:Point){}
   
   public get focalLength() : number{return 0}
   
   public set focalLength(param1:number){}
   
   public toMatrix3D() : Matrix3D{return null}
}