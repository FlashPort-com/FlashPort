import { URLStream } from "./URLStream";
import { URLRequest } from "./URLRequest";
import { URLLoaderDataFormat } from "./URLLoaderDataFormat";
import { URLVariables } from "./URLVariables";
import { AEvent } from "../events/AEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { HTTPStatusEvent } from "../events/HTTPStatusEvent";
import { IOErrorEvent } from "../events/IOErrorEvent";
import { ProgressEvent } from "../events/ProgressEvent";
import { SecurityErrorEvent } from "../events/SecurityErrorEvent";
import { ByteArray } from "../utils/ByteArray";

export class URLLoader extends EventDispatcher
{
	private _data:any;		
	private _dataFormat:string = "text";
	private _bytesLoaded:number = 0;
	private _bytesTotal:number = 0;
	private stream:URLStream;
	
	constructor(request:URLRequest = null)
	{
		super();
		this.stream = new URLStream();
		this.stream.addEventListener(AEvent.OPEN, this.redirectEvent);
		this.stream.addEventListener(IOErrorEvent.IO_ERROR, this.stream_ioError);
		this.stream.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.redirectEvent);
		this.stream.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.redirectEvent);
		this.stream.addEventListener(ProgressEvent.PROGRESS, this.onProgress);
		this.stream.addEventListener(AEvent.COMPLETE, this.onComplete);
		if (request != null)
		{
			this.load(request);
		}
	}
	
	private stream_ioError = (e:IOErrorEvent):void =>
	{
		this.dispatchEvent(e);
	}
	
	/*override public function addEventListener(type:string, listener:Function, useCapture:Boolean = false, priority:number = 0, useWeakReference:Boolean = false):void
	{
		super.addEventListener(type, listener, useCapture, priority, useWeakReference);
		if (type == HTTPStatusEvent.HTTP_RESPONSE_STATUS)
		{
			this.stream.addEventListener(HTTPStatusEvent.HTTP_RESPONSE_STATUS, this.redirectEvent);
		}
	}*/
	
	public load = (request:URLRequest):void =>
	{
		this.stream.load(request);
	}
	
	public close = ():void =>
	{
		this.stream.close();
	}
	
	private redirectEvent = (event:AEvent):void =>
	{
		this.dispatchEvent(event);
	}
	
	private onComplete = (event:AEvent):void =>
	{
		var buff:ArrayBuffer = (<ArrayBuffer>this.stream.xhr.response );
		var bytes:ByteArray = new ByteArray();
		bytes.length = buff.byteLength;
		bytes.dataView = new DataView(buff);
		switch (this._dataFormat)
		{
			case URLLoaderDataFormat.TEXT: 
				this._data = bytes.toString();
				break;
			case URLLoaderDataFormat.VARIABLES: 
				if (bytes.length > 0) this._data = new URLVariables(bytes.toString());
				break;
			default: 
				this._data = bytes;
		}
		this.dispatchEvent(event);
	}
	
	private onProgress = (event:ProgressEvent):void =>
	{
		this._bytesLoaded = event.bytesLoaded;
		this._bytesTotal = event.bytesTotal;
		this.dispatchEvent(event);
	}
	
	public get data():any { return this._data; }
	public set data(value:any) { this._data = value; }
	
	public get dataFormat():string { return this._dataFormat; }
	public set dataFormat(value:string) { this._dataFormat = value; }
	
	public get bytesLoaded():number { return this._bytesLoaded; }
	public set bytesLoaded(value:number) { this._bytesLoaded = value; }
	
	public get bytesTotal():number { return this._bytesTotal; }
	public set bytesTotal(value:number) { this._bytesTotal = value; }
}