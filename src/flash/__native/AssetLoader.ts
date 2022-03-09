import { FlashPort } from "../../FlashPort.js";
import { Bitmap } from "../display/Bitmap.js";
import { Loader } from "../display/Loader.js";
import { LoaderInfo } from "../display/LoaderInfo.js";
import { AEvent } from "../events/AEvent.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { URLLoader } from "../net/URLLoader.js";
import { URLRequest } from "../net/URLRequest.js";
import { URLLoaderDataFormat } from "../net/URLLoaderDataFormat.js";
	
/**
 * ...
 * @author Kenny Lerma
 */
export class AssetLoader extends EventDispatcher
{
	private queue:Array<string> = [];
	private ld:Loader;
	private urlLD:URLLoader;
	private queueItem:string;
	
	constructor(assets:Array<string>)
	{
		super();
		
		this.queue = assets;
		
		this.ld = new Loader();
		this.ld.contentLoaderInfo.addEventListener(AEvent.COMPLETE, this.loadComplete);
		
		this.urlLD = new URLLoader();
		this.urlLD.addEventListener(AEvent.COMPLETE, this.loadComplete);
	}
	
	public load = ():void =>
	{
		if (this.queue.length > 0)
		{
			this.queueItem = this.queue.shift();
			var ext:string = this.queueItem.substr(this.queueItem.lastIndexOf(".")).toLowerCase();
			
			if (ext == ".ttf" || ext == ".woff" || ext == ".woff2")
			{
				var fontName:string = this.queueItem.replace(/_/g, " ");
				fontName = fontName.substring(0, fontName.lastIndexOf("."));
				//trace("fontName: " + fontName);
				let fontFace:any = new FontFace(fontName, "url('" + this.queueItem + "')");
				fontFace.load().catch(this.fontError).then(this.fontLoaded);
			}
			else if (ext == ".mp3" || ext == ".wav" || ext == ".mp4" || ext == ".webm")
			{
				var req:URLRequest = new URLRequest(this.queueItem);
				this.urlLD.dataFormat = URLLoaderDataFormat.BINARY;
				this.urlLD.load(req);
			}
			else
			{
				req = new URLRequest(this.queueItem);
				this.ld.load(req);
			}
		}
		else
		{
			this.dispatchEvent(new AEvent(AEvent.COMPLETE));
		}
	}
	
	private loadComplete = (e:AEvent):void =>
	{
		var loaderInfo:LoaderInfo = e.currentTarget as LoaderInfo;
		var name:string = this.queueItem;
		name = name.substring(name.lastIndexOf("/") + 1);
		var ext:string = name.substring(name.lastIndexOf("."));
		var extLC:string = name.substring(name.lastIndexOf(".")).toLowerCase();
		
		name = name.replace(ext, "")
		
		if (extLC == ".png" || extLC == ".jpg")
		{
			var bm:Bitmap = (<Bitmap>loaderInfo.content );
			FlashPort.images[name] = bm.bitmapData;
		}
		else if (extLC == ".mp3" || extLC == ".wav")
		{
			FlashPort.sounds[name] = this.urlLD.data;
		}
		
		this.load();
	}
	
	private fontError = (e:Error):void =>
	{
		if (e) console.log("Failed to load font: " + e.message);
	}

	private fontLoaded = (e:any):void =>
	{
		if (e)
		{
			document.fonts.add(e); // adds the FontFace to the FontFaceSet to be usable in the current document.
			//trace("font loaded: " + e.family);
		}
		this.load();
	}
	
}