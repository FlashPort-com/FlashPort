import { TextureBase } from "./TextureBase.js";

   import { BitmapData } from "../../display/BitmapData.js";
   import { ByteArray } from "../../utils/ByteArray.js";
   
   export class RectangleTexture extends TextureBase
   {
       
      constructor(){
         super();
      }
      
     public uploadFromBitmapData(param1:BitmapData) : void{}
      
     public uploadFromByteArray(param1:ByteArray, param2:number) : void{}
   }

