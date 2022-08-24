import { SoundTransform } from "./SoundTransform";
import { SoundLoaderContext } from "./SoundLoaderContext";
import { SoundChannel } from "./SoundChannel";
import { FlashPort } from "../../FlashPort";
import { ID3Info } from "./ID3Info";

import { EventDispatcher } from "../events/EventDispatcher";
import { URLRequest } from "../net/URLRequest";
import { ByteArray } from "../utils/ByteArray";
import { AEvent } from "../events/AEvent";

/*[Event(name = "progress", type = "flash.events.ProgressEvent")]*/
/*[Event(name = "open", type = "flash.events.Event")]*/
/*[Event(name = "ioError", type = "flash.events.IOErrorEvent")]*/
/*[Event(name = "id3", type = "flash.events.Event")]*/
/*[Event(name = "complete", type = "flash.events.Event")]*/
/*[Event(name = "sampleData", type = "flash.events.SampleDataEvent")]*/

export class Sound extends EventDispatcher
{
	public static sounds:any[] = [];
	private xhr:XMLHttpRequest;
	private buffer:AudioBuffer;
	private static _ctx:AudioContext;
	public playing:boolean = false;
	private loops:number;
	private _sndTransform:SoundTransform;
	private startTime:number;
	private _stream:URLRequest;
	private _context:SoundLoaderContext;
	public source:AudioBufferSourceNode;
	private panNode:StereoPannerNode;
	private gainNode:GainNode;
	private channel:SoundChannel;
	private _envelops:any[];
	
	constructor(stream:URLRequest = null, context:SoundLoaderContext = null){
		super();
		this._context = context;
		this._stream = stream;
		this._sndTransform = new SoundTransform();
		if(Sound.ctx) Sound.sounds.push(this);
	}
	
	public load(stream:URLRequest, context:SoundLoaderContext = null):void
	{
		if (Sound.ctx)
		{
			this._stream = stream;
			
			var sndContext:SoundLoaderContext = this._buildLoaderContext(this._context);
			
			if (FlashPort.sounds[this._stream.url] != undefined)
			{
				var buf:ArrayBuffer = (FlashPort.sounds[stream.url] as ByteArray).dataView.buffer.slice(0);;
				Sound.ctx.decodeAudioData(buf, this.decodeAudioDataSuccess);
			}
			else
			{
				this._load(this._stream, sndContext.checkPolicyFile, sndContext.bufferTime);
			}
		}
	}
	
	public loadCompressedDataFromByteArray(bytes:ByteArray, bytesLength:number):void
	{
	
	}
	
	public loadPCMFromByteArray(bytes:ByteArray, samples:number, format:string="float", stereo:boolean=true, sampleRate:number=44100):void
	{
	
	}
	
	private _buildLoaderContext(context:SoundLoaderContext):SoundLoaderContext
	{
		if (!context) context = new SoundLoaderContext();
		
		return context;
	}
	
	private _load(req:URLRequest, checkPolicyFile:boolean, bufferTime:number):void
	{
		this.xhr = new XMLHttpRequest;
		this.xhr.open("GET", req.url);
		this.xhr.responseType = "arraybuffer";
		this.xhr.addEventListener("load", this.xhr_load,true);
		this.xhr.send();
	}
	
	private xhr_load(e:Object):void 
	{
		Sound.ctx.decodeAudioData((<ArrayBuffer>this.xhr.response ), this.decodeAudioDataSuccess);
	}
	
	private decodeAudioDataSuccess(buffer:AudioBuffer):void 
	{
		this.buffer = buffer;
		
		this.dispatchEvent(new AEvent(AEvent.COMPLETE));
		
		if (!this.playing) this.play(this.startTime, this.loops, this._sndTransform);
	}
	
	public get url():string
	{
		return null;
	}
	
	public get isURLInaccessible():boolean
	{
		return false;
	}
	
	public play(startTime:number=0, loops:number=0, sndTransform:SoundTransform=null):SoundChannel
	{
		if (Sound.ctx)
		{
			if (this.buffer == null) this.load(this._stream, this._context);
			
			this.startTime = startTime;
			this.loops = loops;
			if (sndTransform) this._sndTransform = sndTransform;
			
			if (this.buffer)
			{
				if (this.channel)
				{
					this.channel.stop();
				}
				else
				{
					this.channel = new SoundChannel();
				}
				
				this.source = Sound.ctx.createBufferSource();
				this.gainNode = Sound.ctx.createGain();
				this.panNode = Sound.ctx.createStereoPanner();
				
				this.gainNode.gain.value = sndTransform ? sndTransform.volume : 1;
				this.panNode.pan.value = sndTransform ? sndTransform.pan : 0;
				this.source.loop = loops > 0;
				this.source.buffer = this.buffer;
				this.source.connect(this.panNode);
				this.panNode.connect(this.gainNode);
				this.gainNode.connect(Sound.ctx.destination);
				
				this.channel.__source = this.source;
				this.channel.__panner = this.panNode;
				this.channel.__gainNode = this.gainNode;
				this.channel.__envelops = this._envelops;
				this.channel.soundTransform = sndTransform ? sndTransform : new SoundTransform();
				
				this.channel.__source = this.source;
				this.source.start(0, startTime);
				this.channel.__startTime = Sound.ctx.currentTime;
				
				this.playing = true;
				
				return this.channel;
			}
		}
		
		return null;
	}
	
	public get length():number
	{
		return 0;
	}
	
	public get isBuffering():boolean
	{
		return false;
	}
	
	public get bytesLoaded():number
	{
		return 0;
	}
	
	public get bytesTotal():number
	{
		return 0;
	}
	
	public get id3():ID3Info
	{
		return null;
	}
	
	public static get ctx():AudioContext 
	{
		if (Sound._ctx == null) 
		{
			Sound._ctx = new AudioContext();
		}
		return Sound._ctx;
	}
	
	public close():void
	{
	
	}
	
	public extract(target:ByteArray, length:number, startPosition:number=-1):number
	{
		return 0;
	}
	
	/**
	 * Animate only
	 */
	public get __envelops():any[] 
	{
		return this._envelops;
	}
	/**
	 * Animate only
	 */
	public set __envelops(value:any[]) 
	{
		this._envelops = value;
	}
}