import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { LoaderInfo } from "./LoaderInfo";
import { BitmapData } from "./BitmapData";
import { Bitmap } from "./Bitmap";
import { DisplayObject } from "./DisplayObject";

import { URLRequest } from "../net/URLRequest";
import { LoaderContext } from "../system/LoaderContext";
import { ByteArray } from "../utils/ByteArray";
	
import { AEvent } from "../events/AEvent";
	
export class Loader extends DisplayObjectContainer
{
	private _ldInfo:LoaderInfo;
	private _ctx:AudioContext;
	private image:HTMLImageElement;
	private xhr:XMLHttpRequest;
	
	constructor()
	{
		super();
		this._ldInfo = new LoaderInfo;
	}
	
	public load(request:URLRequest, context:LoaderContext = null):void
	{
		var ext:string = request.url.substring(request.url.lastIndexOf(".")).toLowerCase();
		
		if (ext == ".png" || ext == ".jpg")
		{
			if (this.image){
				this.image.removeEventListener("load", this.onImageLoad, false);
			}
			this.image = new Image();
			this.image.addEventListener("load", this.onImageLoad, false);
			this.image.src = request.url;
		}
	}
	
	private onImageLoad = (e:Object):void =>
	{
		var bmd:BitmapData = new BitmapData(this.image.width, this.image.height, true, 0);
		bmd.fromImage(this.image);
		if (this._ldInfo.content&&this._ldInfo.content.parent){
			this._ldInfo.content.parent.removeChild(this._ldInfo.content);
		}
		this._ldInfo.content = new Bitmap(bmd);
		this.addChild(this._ldInfo.content);
		this._ldInfo.dispatchEvent(new AEvent(AEvent.COMPLETE));
	}
	
	private _getJPEGLoaderContextdeblockingfilter(param1:Object):number  { return 0; }
	
	public loadBytes(bytes:ByteArray, context:LoaderContext = null) : void
	{
	
	}
	
	public close():void
	{
		this._close();
	}
	
	public unload():void
	{
		this._unload(false, false);
	}
	
	public unloadAndStop(gc:boolean = true):void
	{
		this._unload(true, gc);
	}
	
	private _unload(param1:boolean, param2:boolean):void
	{
	
	}
	
	private _close():void
	{
	
	}
	
	public get content():DisplayObject  { return this._ldInfo.content; }
	
	public get contentLoaderInfo():LoaderInfo  { return this._ldInfo; }
}