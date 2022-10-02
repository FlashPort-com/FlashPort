import { URLRequest } from "./URLRequest";
import { URLVariables } from "./URLVariables";
import { AEvent } from "../events/AEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { ByteArray } from "../utils/ByteArray";
import { IOErrorEvent } from "../events/IOErrorEvent";
import { ProgressEvent } from "../events/ProgressEvent";

export class URLStream extends EventDispatcher
{
	public xhr:XMLHttpRequest;
	
	constructor()
	{
		super();
	}
	
	public load = (v:URLRequest):void =>
	{
		var url:string = v.url;
		// add URLVariables
		if (v.data && v.data instanceof URLVariables)
		{
			url = url + "?" + JSON.stringify(v.data).replace(/:/g, "=").replace(/,/g, "&&").replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
		}
		
		this.xhr = new XMLHttpRequest;
		this.xhr.open("get", url, true);
		
		this.xhr.responseType = "arraybuffer";
		this.xhr.addEventListener("readystatechange", this.xhr_onreadystatechange, false);
		this.xhr.addEventListener("error", this.xhr_error, false);
		this.xhr.addEventListener("progress", this.xhr_progress, false);
		this.xhr.send(!(v.data instanceof URLVariables) ? v.data as Document: "");
	}
	
	private xhr_error = (e:Event):void =>
	{
		this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR));
	}
	
	private xhr_progress = (e:Object):void =>
	{
		this.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, e['loaded'], e['total']));
	}
	
	private xhr_onreadystatechange = (e:any):void =>
	{
		if (this.xhr.readyState === 4 && this.xhr.status === 200)
		{
			this.dispatchEvent(new AEvent(AEvent.COMPLETE));
		}else if (this.xhr.readyState===4&&this.xhr.status===404){
			this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR));
		}
	}
	
	public readBytes = (b:ByteArray, offset:number = 0, length:number = 0):void =>
	{
		
	}
	
	public readBoolean():boolean  { return false }
	
	public readByte():number  { return 0 }
	
	public readUnsignedByte():number  { return 0 }
	
	public readShort():number  { return 0 }
	
	public readUnsignedShort():number  { return 0 }
	
	public readUnsignedInt():number  { return 0 }
	
	public readInt():number  { return 0 }
	
	public readFloat():number  { return 0 }
	
	public readDouble():number  { return 0 }
	
	public readMultiByte(param1:number, param2:string):string  { return null; }
	
	public readUTF():string  { return null }
	
	public readUTFBytes(param1:number):string  { return null; }
	
	public get connected():boolean  { return false }
	
	public get bytesAvailable():number  { return 0; }
	
	public close():void  {/**/ }
	
	public readObject():any  { return null; }
	
	public get objectEncoding():number  { return 0; }
	
	public set objectEncoding(param1:number)  {/**/ }
	
	public get endian():string  { return null; }
	
	public set endian(param1:string)  {/**/ }
	
	public get diskCacheEnabled():boolean  { return false }
	
	public get position():number  { return 0; }
	
	public set position(param1:number)  {/**/ }
	
	public get length():number  { return 0; }
	
	public stop():void  {/**/ }
}