import { FPConfig } from "../../FPConfig";
import { Bitmap } from "../display/Bitmap";
import { Loader } from "../display/Loader";
import { LoaderInfo } from "../display/LoaderInfo";
import { AEvent } from "../events/AEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { URLLoader } from "../net/URLLoader";
import { URLRequest } from "../net/URLRequest";
import { URLLoaderDataFormat } from "../net/URLLoaderDataFormat";
	
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
			this.queueItem = this.queue.shift() || '';
			var ext:string = this.queueItem.substr(this.queueItem.lastIndexOf(".")).toLowerCase();
			
			if (ext == ".ttf" || ext == ".woff" || ext == ".woff2")
			{
				var fontName:string = this.queueItem.replace(/_/g, " ");
				var startIndex = fontName.lastIndexOf('/');
				if (startIndex != 0 ) startIndex += 1;
				fontName = fontName.substring(startIndex, fontName.lastIndexOf("."));
				fetch(this.queueItem).then((resp) => {
					resp.arrayBuffer().then((buffer:ArrayBuffer) => {
						this.fontLoaded(buffer, fontName);
					});
				});
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
		
		if (extLC == ".png" || extLC == ".jpg" || extLC == ".webp")
		{
			var bm:Bitmap = (loaderInfo.content as Bitmap);
			FPConfig.images[name] = bm.bitmapData;
		}
		else if (extLC == ".mp3" || extLC == ".wav")
		{
			FPConfig.sounds[name] = this.urlLD.data;
		}
		
		this.load();
	}
	
	private fontError = (e:Error):void =>
	{
		if (e) console.log("Failed to load font: " + e.message);
	}

	private fontLoaded = (buffer:ArrayBuffer, fontName:string):void =>
	{
		if (buffer)
		{		
			FPConfig.fonts[fontName] = buffer;
		}
		this.load();
	}
	
}