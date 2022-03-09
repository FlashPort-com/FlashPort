import { ByteArray } from "../utils/ByteArray.js";
export class IndexBuffer3D extends Object
{
   public count:number;
   public buff:WebGLBuffer;
   public gl:WebGLRenderingContext;

   constructor()
   {
      super();
   }
   
   public uploadFromVector(data:number[], startOffset:number, count:number) : void
   {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buff);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.gl.STATIC_DRAW);	
   }
   
   public uploadFromByteArray(data:ByteArray, byteArrayOffset:number, startOffset:number, count:number) : void{}
   
   public dispose():void
   {
      this.gl.deleteBuffer(this.buff);
      this.buff=null
   }
}