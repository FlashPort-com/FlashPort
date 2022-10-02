import { BitmapData } from "../display/BitmapData";
import { Texture } from "../display3D/textures/Texture";

export class BitmapTexture 
{
	public texture:Texture;
	public bmd:BitmapData;
	public img:Object;
	public width:number;
	public height:number;
	public dirty:boolean = true;
	
	constructor(){
		
	}
}