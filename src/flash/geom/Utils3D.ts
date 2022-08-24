import { Matrix3D } from "./Matrix3D";
import { Vector3D } from "./Vector3D";

export class Utils3D extends Object
{  
   constructor()
   {
      super();
   }
   
   public static projectVector(param1:Matrix3D, param2:Vector3D) : Vector3D{return null}
   
   public static projectVectors(param1:Matrix3D, param2:number[], param3:number[], param4:number[]) : void{}
   
   public static pointTowards(param1:number, param2:Matrix3D, param3:Vector3D, param4:Vector3D = null, param5:Vector3D = null) : Matrix3D{return null}
}