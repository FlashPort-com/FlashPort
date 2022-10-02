import { TextureBase } from "./TextureBase";

   import { BitmapData } from "../../display/BitmapData";
   import { ByteArray } from "../../utils/ByteArray";
   
   export class RectangleTexture extends TextureBase
   {
       
      constructor(){
         super();
      }
      
     public uploadFromBitmapData(param1:BitmapData) : void{}
      
     public uploadFromByteArray(param1:ByteArray, param2:number) : void{}
   }

