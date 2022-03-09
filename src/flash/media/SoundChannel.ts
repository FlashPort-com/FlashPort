import { SoundTransform } from "./SoundTransform.js";
import { AEvent } from "../events/AEvent.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { Stage } from "../display/Stage.js";

export class SoundChannel extends EventDispatcher
{
	private _envelops:any[];
	private _source:AudioBufferSourceNode;
	private _panNode:StereoPannerNode;
	private _gainNode:GainNode;
	private _startTime:number;
	private _sndTransform:SoundTransform;
	private _position:number;
	private _curEnvelopPoint:number = -1;
	private _origVolume:number = 1;
	
	constructor()
	{
		super();
	}
	
	private onUpdate(e:Event):void 
	{
		this._position =  (this._source.context.currentTime - this._startTime) * 1000;
		var len:number = this.__envelops ? this._envelops.length : 0;
		for (var i:number = 0; i < len; i++) 
		{
			var env:any = this._envelops[i];
			var envNext:any = len > 1 && i != len -1 ? this._envelops[i + 1] : null;
			var pos:number = env.p * 1000;
			if (pos != this._curEnvelopPoint && this._position >= pos && (!envNext || (envNext && this._position < envNext.p * 1000)))
			{
				this._curEnvelopPoint = pos;
			}
			
			if (pos == this._curEnvelopPoint && envNext)
			{
				var percent:number = (this._position / 1000) / (env.p + envNext.p);
				
				var changeAmount_L:number = (envNext.l - env.l);
				this._sndTransform.leftToLeft = env.l + (changeAmount_L * percent);
				
				var changeAmount_R:number = (envNext.r - env.r);
				this._sndTransform.rightToRight = env.r + (changeAmount_R * percent);
				
				this.soundTransform = this._sndTransform;
			}
		}
	}
	
	public get position():number
	{
		return (this._source.context.currentTime - this._startTime) * 1000;
	}
	
	public get soundTransform():SoundTransform
	{
		return this._sndTransform;
	}
	
	public set soundTransform(v:SoundTransform)
	{
		this._sndTransform = v;
		this._panNode.pan.setValueAtTime(v.pan, this._source.context.currentTime);
		this._gainNode.gain.setValueAtTime(v.volume, this._source.context.currentTime);
	}
	
	public stop():void
	{
		Stage.instance.removeEventListener(AEvent.ENTER_FRAME, this.onUpdate);
		this._source.removeEventListener("ended", this.playbackComplete);
		
		this._source.stop(0);
		this._source.disconnect(0);
		this._curEnvelopPoint = -1;
	}
	
	public get leftPeak():number
	{
		return 0;
	}
	
	public get rightPeak():number
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
	
	/**
	 * JS only
	 */
	public set __source(value:AudioBufferSourceNode)
	{
		this._source = value;
		this._source.addEventListener("ended", this.playbackComplete);
		Stage.instance.addEventListener(AEvent.ENTER_FRAME, this.onUpdate);
	}
	
	/**
	 * JS only
	 */
	public get __source():AudioBufferSourceNode
	{
		return this._source;
	}
	
	/**
	 * JS only
	 */
	public set __panner(value:StereoPannerNode)
	{
		this._panNode = value;
	}
	
	public get __panner():StereoPannerNode
	{
		return this._panNode;
	}
	
	/**
	 * JS only
	 */
	public get __gainNode():GainNode 
	{
		return this._gainNode;
	}
	
	/**
	 * JS only
	 */
	public set __gainNode(value:GainNode) 
	{
		this._gainNode = value;
	}
	
	public set __startTime(value:number) 
	{
		this._startTime = value;
	}
	
	/**
	 * JS Only
	 */
	private dispose():void 
	{
		this.stop();
		this._source.disconnect(this._panNode);
		this._panNode.disconnect(this._gainNode);
		this._gainNode.disconnect(this._source.context.destination);
		this._panNode = null;
		this._gainNode = null;
		this._source = null;
	}
	
	private playbackComplete(e:Event):void 
	{
		Stage.instance.removeEventListener(AEvent.ENTER_FRAME, this.onUpdate);
		this._source.removeEventListener("ended", this.playbackComplete);
		this.dispatchEvent(new AEvent(AEvent.SOUND_COMPLETE));
	}
}