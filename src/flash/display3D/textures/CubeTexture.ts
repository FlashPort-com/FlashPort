import { TextureBase } from "./TextureBase.js";

   import { BitmapData } from "../../display/BitmapData.js";
   import { ByteArray } from "../../utils/ByteArray.js";
   
   export class CubeTexture extends TextureBase
   {
       
      constructor(){
         super();
      }
      
     public uploadFromBitmapData(param1:BitmapData, param2:number, param3:number = 0) : void{}
      
     public uploadFromByteArray(param1:ByteArray, param2:number, param3:number, param4:number = 0) : void{}
      
     public uploadCompressedTextureFromByteArray(param1:ByteArray, param2:number, param3:boolean = false) : void{}
   }

