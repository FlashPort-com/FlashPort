import { Sprite } from "../display/Sprite";
import { MouseEvent } from "../events/MouseEvent";
import { Video } from "./Video";
import { NetConnection } from "../net/NetConnection";
import { NetStream } from "../net/NetStream";
import { NetStatusEvent } from "../events/NetStatusEvent";
import { Rectangle } from "../geom/Rectangle";
import { Point } from "../geom/Point";

/**
 * ...
 * @author Kenny Lerma
 */
export class VideoPlayer extends Sprite
{
	
	private _video:Video;
	private _playBtn:Sprite;
	private _netConnection:NetConnection;
	private _netStream:NetStream;
	private _url:String;
	private _isPlaying:Boolean = false;
	private _initialPlay:Boolean = true;
	
	constructor(url:String, videoWidth:number = 360, videoHeight:number = 203)
	{
		super();

		this._url = url;
		
		this._video = new Video(videoWidth, videoHeight);
		this.addChild(this._video);
		
		this._playBtn = new Sprite();
		this._playBtn.name = "playBtn";
		this._playBtn.graphics.beginFill(0xCCCCCC, .75);
		this._playBtn.graphics.lineTo(50, 33);
		this._playBtn.graphics.lineTo(0, 66);
		this._playBtn.graphics.lineTo(0, 0);
		this._playBtn.x = (this._video.width - this._playBtn.width) / 2;
		this._playBtn.y = (this._video.height -this. _playBtn.height) / 2;
		this._playBtn.mouseEnabled = true;
		this._playBtn.buttonMode = true;
		this.addChild(this._playBtn);
		
		this._netConnection = new NetConnection();
		this._netConnection.addEventListener(NetStatusEvent.NET_STATUS, this.netStatusHandler);
		this._netConnection.connect(null);
	}
	
	private connectStream = ():void =>
	{
		this._netStream = new NetStream(this._netConnection);
		this._netStream.addEventListener(NetStatusEvent.NET_STATUS, this.netStatusHandler);
		this._netStream.client = new CustomClient();
		
		this._video.attachNetStream(this._netStream); // must attach stream first
		this._netStream.play(this._url);
		this._netStream.pause();
		
		//console.log("VideoPlay.connectStream");
		//this._playBtn.addEventListener(MouseEvent.CLICK, this.onPlayerClicked);
		//this._playBtn.buttonMode = true;
	}

	public togglePlayPause = () =>
	{
		//console.log("VideoPlayer.onPlayerClicked()");
		this._isPlaying = !this._isPlaying;
		if (this._isPlaying) 
		{
			if (this._initialPlay)
			{
				this._netStream.play(this._url);
				this._initialPlay = false;
			}
			else
			{
				this._netStream.resume();
			}
			this._playBtn.visible = false;
		}
		else
		{
			this._netStream.pause();
			this._playBtn.visible = true;
		}
	}
	
	private onPlayerClicked = (e:MouseEvent):void =>
	{
		//console.log("VideoPlayer.onPlayerClicked()");
		this._isPlaying = !this._isPlaying;
		if (this._isPlaying) 
		{
			if (this._initialPlay)
			{
				this._netStream.play(this._url);
				this._initialPlay = false;
			}
			else
			{
				this._netStream.resume();
			}
			this._playBtn.visible = false;
		}
		else
		{
			this._netStream.pause();
			this._playBtn.visible = true;
		}
	}
	
	private netStatusHandler = (event:NetStatusEvent):void =>
	{
		//console.log("netStatusHandler: " + event.info.code);
		switch (event.info.code) 
		{
			case "NetConnection.Connect.Success":
				if (!this._netStream) this.connectStream();
				break;
			case "NetStream.Play.Start":
				//console.log("NetStream.Play.Start");
				break;
			case "NetStream.Play.StreamNotFound":
				//console.log("NetStream.Play.StreamNotFound: " + this._url);
				break;
		}
	}

	/*override*/ public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
	{
		var rect:Rectangle = new Rectangle(this.x, this.y, this._video.width, this._video.height);
		var gToL:Point  = this.globalToLocal(new Point(x, y));
		return rect.containsPoint(gToL);
	}
}

export class CustomClient 
{
	public onMetaData = (info:any):void => {
		console.log("metadata: duration=" + info.duration + " width=" + info.width + " height=" + info.height);
	}
	public onCuePoint = (info:any):void => {
		console.log("cuepoint: time=" + info.time + " name=" + info.name + " type=" + info.type);
	}
	public onXMPData= (info:any):void => {
		console.log("xmpdata", info);
	}
	public onPlayStatus = (info:any):void => {
		console.log("playstatus", info);
	}
}