import { TextureBase } from "./TextureBase";

	import { Camera } from "../../media/Camera";
   
	export class VideoTexture extends TextureBase
	{
       
		constructor(){
			super();
		}
      
     //public function attachNetStream(param1:NetStream) : void;
      
     public attachCamera(param1:Camera) : void{}
      
     public get videoWidth() : number{return 0}
      
     public get videoHeight() : number{return 0}
   }

