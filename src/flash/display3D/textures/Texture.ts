import { TextureBase } from "./TextureBase";
import { BitmapData } from "../../display/BitmapData";
import { ByteArray } from "../../utils/ByteArray";

export class Texture extends TextureBase
{
	public gl:WebGLRenderingContext;
	public texture:WebGLTexture;
	public repeat:boolean = true;
	public up:boolean = false;
	
	constructor(){
		super();
	}
	
	public uploadFromBitmapData(bitmapData:BitmapData, maplevel:number = 0):void
	{
		this.uploadFromImg(bitmapData.image, maplevel);
	}
	
	public uploadFromImg(img:HTMLCanvasElement, maplevel:number = 0):void
	{
		this.up = true;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
		if (this.repeat){
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
		}else{
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		}
		if(maplevel>0){
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
		}else {
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		}
		this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}
	
	public uploadFromByteArray(param1:ByteArray, param2:number, param3:number = 0):void
	{
	}
	
	public uploadCompressedTextureFromByteArray(param1:ByteArray, param2:number, param3:boolean = false):void
	{
	}
}