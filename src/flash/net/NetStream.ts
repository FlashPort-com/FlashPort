import { EventDispatcher } from "../events/EventDispatcher";
import { NetStatusEvent } from "../events/NetStatusEvent";
import { NetStreamInfo } from "./NetStreamInfo";
import { NetConnection } from "./NetConnection";
import { Microphone } from "../media/Microphone";
import { Camera } from "../media/Camera";
import { NetStreamPlayOptions } from "./NetStreamPlayOptions";
import { SoundTransform } from "../media/SoundTransform";
import { ByteArray } from "../utils/ByteArray";
import { VideoStreamSettings } from "../media/VideoStreamSettings";
import { VideoCodec } from "../media/VideoCodec";
import { ActivityEvent } from "../events/ActivityEvent";
import { NetStreamMulticastInfo } from "./NetStreamMulticastInfo";

/**
 * Dispatched when playing video content and certain type of messages are processed.
 * @eventType	flash.events.NetDataEvent
 */
/*[Event(name="mediaTypeData", type="flash.events.NetDataEvent")]*/ 

/**
 * Called synchronously from appendBytes() when the append bytes parser encounters a point that it believes is a seekable
 * point (for example, a video key frame).
 */
/*[Event(name="onSeekPoint", type="")]*/ 

/**
 * Dispatched when the digital rights management (DRM) encrypted content
 * begins playing (when the user is authenticated and authorized to play the content).
 * @eventType	flash.events.DRMStatusEvent.DRM_STATUS
 */
/*[Event(name="drmStatus", type="flash.events.DRMStatusEvent")]*/ 

/**
 * Dispatched when a NetStream object, trying to play a digital rights management (DRM) encrypted
 * file, encounters a DRM-related error.
 * @eventType	flash.events.DRMErrorEvent.DRM_ERROR
 */
/*[Event(name="drmError", type="flash.events.DRMErrorEvent")]*/ 

/**
 * Dispatched when a NetStream object tries to play a digital rights management (DRM) encrypted
 * content that requires a user credential for authentication before playing.
 * @eventType	flash.events.DRMAuthenticateEvent.DRM_AUTHENTICATE
 */
/*[Event(name="drmAuthenticate", type="flash.events.DRMAuthenticateEvent")]*/ 

/// Establishes a listener to respond when AIR extracts DRM content metadata embedded in a media file.
/*[Event(name="onDRMContentData", type="")]*/ 

/// Establishes a listener to respond when a NetStream object has completely played a stream.
/*[Event(name="onPlayStatus", type="")]*/ 

/// Establishes a listener to respond when an embedded cue point is reached while playing a video file.
/*[Event(name="onCuePoint", type="")]*/ 

/// Establishes a listener to respond when Flash Player receives text data embedded in a media file that is playing.
/*[Event(name="onTextData", type="")]*/ 

/**
 * Establishes a listener to respond when Flash Player receives image data as a byte array embedded in a media file that is
 * playing.
 */
/*[Event(name="onImageData", type="")]*/ 

/// Establishes a listener to respond when Flash Player receives descriptive information embedded in the video being played.
/*[Event(name="onMetaData", type="")]*/ 

/**
 * Establishes a listener to respond when Flash Player receives information specific to Adobe
 * Extensible Metadata Platform (XMP) embedded in the video being played.
 */
/*[Event(name="onXMPData", type="")]*/ 

/**
 * Dispatched when a NetStream object is reporting its status or error condition.
 * @eventType	flash.events.NetStatusEvent.NET_STATUS
 */
/*[Event(name="netStatus", type="flash.events.NetStatusEvent")]*/ 

/**
 * Dispatched when an input or output error occurs that causes a network operation to fail.
 * @eventType	flash.events.IOErrorEvent.IO_ERROR
 */
/*[Event(name="ioError", type="flash.events.IOErrorEvent")]*/ 

/**
 * Dispatched when an exception is thrown asynchronously &#x2014; that is,
 * from native asynchronous code.
 * @eventType	flash.events.AsyncErrorEvent.ASYNC_ERROR
 */
/*[Event(name="asyncError", type="flash.events.AsyncErrorEvent")]*/ 

/**
 * Dispatched when the application attempts to play content encrypted with digital rights management (DRM),
 * by invoking the NetStream.play() method.
 * @eventType	flash.events.StatusEvent.STATUS
 */
/*[Event(name="status", type="flash.events.StatusEvent")]*/ 

/**
 * @langversion	3.0
 * @playerversion	Flash 9
 * @playerversion	Lite 4
 */
export class NetStream extends EventDispatcher
{
	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public static CONNECT_TO_FMS:string = "connectToFMS";

	/**
	 * Creates a peer-to-peer publisher connection. Pass this string for the second (optional) parameter to
	 * the constructor for a NetStream instance. With this string, an application can create
	 * a NetStream connection for the purposes of publishing audio and video to clients.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public static DIRECT_CONNECTIONS:string = "directConnections";
	
	private _netConnection:NetConnection;
	private _url:string;
	private _bytes:ArrayBuffer;
	private _sourceBuffer:SourceBuffer;
	private _mimeCodec:string;
	private _mediaSource:MediaSource;
	private _duration:number = 0;
	private _currentFPS:number = 0;
	private _inBufferSeek:boolean = false;
	private _time:number = 0;
	private _videoCodec:number;
	private _loop:boolean = false;
	private _looped:boolean = false;
	private _playing:boolean = false;
	private _paused:boolean = true;
	private _seeking:boolean = false;
	private _playbackTarget:any;
	private _clientObject:any;
	private _bytesQueue:any[] = [];
	private _isNewBytes:boolean = false;
	private _camera:Camera;

	public get audioCodec():number
	{
		console.log("Netstream.audioCodec property not implemented.");
		return null;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get audioReliable():boolean
	{
		console.log("Netstream.audioReliable property not implemented.");
		return null;
	}
	
	public set audioReliable(reliable:boolean)
	{
		console.log("Netstream.audioReliable property not implemented.");
	}

	/**
	 * For RTMFP connections, specifies whether peer-to-peer subscribers on this NetStream are allowed to capture the audio stream.
	 * When FALSE, subscriber attempts to capture the audio stream show permission errors.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get audioSampleAccess():boolean
	{
		console.log("Netstream.audioSampleAccess property not implemented.");
		return null;
	}
	public set audioSampleAccess(reliable:boolean)
	{
		console.log("Netstream.audioSampleAccess property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get backBufferLength():number
	{
		console.log("Netstream.backBufferLength property not implemented.");
		return null;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get backBufferTime():number
	{
		console.log("Netstream.backBufferTimer property not implemented.");
		return null;
	}
	public set backBufferTime (backBufferTime:number)
	{
		console.log("Netstream.backBufferTime property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get bufferLength():number
	{
		if (this._bytes)
		{
			return this._bytes.byteLength;
		}
		
		return 0;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get bufferTime():number
	{
		console.log("Netstream.bufferTimer property not implemented.");
		return null;
	}
	public set bufferTime (bufferTime:number)
	{
		console.log("Netstream.bufferTime property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get bufferTimeMax():number
	{
		console.log("Netstream.bufferTimeMax property not implemented.");
		return null;
	}
	public set bufferTimeMax (bufferTimeMax:number)
	{
		console.log("Netstream.bufferTimeMax property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get bytesLoaded():number
	{
		if (this._bytes)
		{
			return this._bytes.byteLength;
		}
		
		return 0;
	}

	/**
	 * The total size in bytes of the file being loaded into the application.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get bytesTotal():number
	{
		if (this._bytes)
		{
			return this._bytes.byteLength;
		}
		
		return 0;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get checkPolicyFile():boolean
	{
		console.log("Netstream.checkPolicyFile property not implemented.");
		return null;
	}
	public set checkPolicyFile (state:boolean)
	{
		console.log("Netstream.checkPolicyFile property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @throws	TypeError The client property must be set to a non-null object.
	 */
	public get client():Object
	{
		return this._clientObject;
	}
	public set client (object:Object)
	{
		this._clientObject = object;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get currentFPS():number
	{
		return this._currentFPS;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get dataReliable():boolean
	{
		console.log("Netstream.dataReliable property not implemented.");
		return null
	}
	public set dataReliable (reliable:boolean)
	{
		console.log("Netstream.dataReliable property not implemented.");
	}

	public get decodedFrames():number
	{
		console.log("Netstream.decodedFrames property not implemented.");
		return null;
	}

	/**
	 * For RTMFP connections, the identifier of the far end that is connected to this NetStream instance.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get farID():string
	{
		console.log("Netstream.farID property not implemented.");
		return null;
	}

	/**
	 * For RTMFP and RTMPE connections, a value chosen substantially by the other end of this stream, unique to this connection.
	 * This value appears to the other end of the stream as its nearNonce value.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get farNonce():string
	{
		console.log("Netstream.farNonce property not implemented.");
		return null;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get inBufferSeek():boolean
	{
		return this._inBufferSeek;
	}
	public set inBufferSeek (value:boolean)
	{
		this._inBufferSeek = value;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public get info():NetStreamInfo
	{
		console.log("Netstream.info property not implemented.");
		return null;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @category	Property
	 */
	public get liveDelay():number
	{
		console.log("Netstream.liveDelay property not implemented.");
		return null;
	}

	/**
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public get maxPauseBufferTime():number
	{
		console.log("Netstream.maxPauseBufferTime property not implemented.");
		return null;
	}
	public set maxPauseBufferTime (pauseBufferTime:number)
	{
		console.log("Netstream.maxPauseBufferTimer property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastAvailabilitySendToAll():boolean
	{
		console.log("Netstream.multicastAvailabilitySendToAll property not implemented.");
		return null;
	}
	public set multicastAvailabilitySendToAll (value:boolean)
	{
		console.log("Netstream.multicastAvailabilitySendToAll property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastAvailabilityUpdatePeriod():number
	{
		console.log("Netstream.multicastAvailabilityUpdatePeriod property not implemented.");
		return null;
	}
	public set multicastAvailabilityUpdatePeriod (seconds:number)
	{
		console.log("Netstream.multicastAvailabilityUpdatePeriod property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastFetchPeriod():number
	{
		console.log("Netstream.multicastFetchPeriod property not implemented.");
		return null;
	}
	public set multicastFetchPeriod (seconds:number)
	{
		console.log("Netstream.multicastAvailabilityUpdatePeriod property not implemented.");
	}

	/**
	 * For RTMFP connections, returns a NetStreamMulticastInfo object whose properties contain statistics about the quality of service.
	 * The object is a snapshot of the current state.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastInfo():NetStreamMulticastInfo
	{
		console.log("Netstream.multicastInfo property not implemented.");
		return null;
	}

	/**
	 * For RTMFP connections, specifies the maximum number of peers to which to proactively push
	 * multicast media.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastPushNeighborLimit():number
	{
		console.log("Netstream.multicastPushNeighborLimit property not implemented.");
		return null;
	}
	public set multicastPushNeighborLimit (neighbors:number)
	{
		console.log("Netstream.multicastPushNeighborLimit property not implemented.");
	}

	/**
	 * For RTMFP connections, specifies the duration in seconds that peer-to-peer multicast data remains
	 * available to send to peers that request it beyond a specified duration. The duration is specified
	 * by the multicastWindowDuration property.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastRelayMarginDuration():number
	{
		console.log("Netstream.multicastRelayMarginDuration property not implemented.");
		return null;
	}
	public set multicastRelayMarginDuration (seconds:number)
	{
		console.log("Netstream.multicastRelayMarginDuration property not implemented.");
	}

	/**
	 * For RTMFP connections, specifies the duration in seconds of the peer-to-peer multicast reassembly
	 * window. Shorter values reduce latency but may reduce quality by not
	 * allowing enough time to obtain all of the fragments. Conversely, larger values may increase
	 * quality by providing more time to obtain all of the fragments, with a corresponding
	 * increase in latency.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get multicastWindowDuration():number
	{
		console.log("Netstream.multicastWindowDuration property not implemented.");
		return null;
	}
	public set multicastWindowDuration (seconds:number)
	{
		console.log("Netstream.multicastWindowDuration property not implemented.");
	}

	/**
	 * For RTMFP and RTMPE connections, a value chosen substantially by this end of the stream, unique to this connection.
	 * This value appears to the other end of the stream as its farNonce value.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public get nearNonce():string
	{
		console.log("Netstream.nearNonce property not implemented.");
		return null;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get objectEncoding():number
	{
		console.log("Netstream.objectEncoding property not implemented.");
		return null;
	}

	/**
	 * An object that holds all of the subscribing NetStream instances that are listening to this publishing NetStream instance.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get peerStreams():any[]
	{
		console.log("Netstream.peerStreams property not implemented.");
		return null;
	}

	/**
	 * Controls sound in this NetStream object. For more information, see the SoundTransform class.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get soundTransform():SoundTransform
	{
		console.log("Netstream.soundTransform property not implemented.");
		return null;
	}
	public set soundTransform (sndTransform:SoundTransform)
	{
		console.log("Netstream.soundTransform property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get time():number
	{
		return this._time;
	}

	public get useHardwareDecoder():boolean
	{
		console.log("Netstream.useHardwareDecoder property not implemented.");
		return null;
	}
	public set useHardwareDecoder (v:boolean)
	{
		console.log("Netstream.useHardwareDecoder property not implemented.");
	}

	public get useJitterBuffer():boolean
	{
		console.log("Netstream.useJitterBuffer property not implemented.");
		return null;
	}
	public set useJitterBuffer (value:boolean)
	{
		console.log("Netstream.useJitterBuffer property not implemented.");
	}

	public get videoCodec():number
	{
		return this._videoCodec;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get videoReliable():boolean
	{
		console.log("Netstream.videoReliable property not implemented.");
		return null;
	}
	public set videoReliable (reliable:boolean)
	{
		console.log("Netstream.videoReliable property not implemented.");
	}

	/**
	 * For RTMFP connections, specifies whether peer-to-peer subscribers on this NetStream are allowed to capture the video stream.
	 * When FALSE, subscriber attempts to capture the video stream show permission errors.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get videoSampleAccess():boolean
	{
		console.log("Netstream.videoSampleAccess property not implemented.");
		return null;
	}
	public set videoSampleAccess (reliable:boolean)
	{
		console.log("Netstream.videoSampleAccess property not implemented.");
	}

	public get videoStreamSettings():VideoStreamSettings
	{
		console.log("Netstream.videoStreamSettings property not implemented.");
		return null;
	}
	public set videoStreamSettings (settings:VideoStreamSettings)
	{
		console.log("Netstream.videoStreamSettings property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public appendBytes  = (bytes:ByteArray):void =>
	{
		if (bytes.length == 0) throw Error("NetStream.play() No Bytes Available. bytes.length is 0.");
		
		this._playbackTarget.loop = false;
		this._bytes = bytes.dataView.buffer;
		
		if (this._mediaSource.readyState == "open" || this._mediaSource.readyState == "ended")
		{
			this._isNewBytes = true;
			
			if (!this._sourceBuffer || this._mediaSource.sourceBuffers.length == 0) 
			{
				//console.log("NetStream.play() Setup Buffer");
				this.setupBuffer();
			}
			else
			{
				//console.log("NestStream.appendBytes() AppendBytes");
				if (this._sourceBuffer.updating)
				{
					this._bytesQueue.push(this._bytes);
				}
				else
				{
					this._sourceBuffer.appendBuffer(this._bytes);
				}
			}
		}
		else
		{
			//console.log("NestStream.appendBytes Open MediaSource");
			(this._playbackTarget as HTMLMediaElement).src = URL.createObjectURL(this._mediaSource);
			
		}
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public appendBytesAction = (netStreamAppendBytesAction:string):void =>
	{
		console.log("Netstream.appendBytesAction method not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public attach = (connection:NetConnection):void =>
	{
		this._netConnection = connection;
	}

	/**
	 * @param	microphone	The source of the audio stream to be transmitted.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public attachAudio = (microphone:Microphone):void =>
	{
		
	}

	/**
	 * @param	theCamera	The source of the video transmission. Valid values are a Camera object
	 *   (which starts capturing video) and null. If you pass null,
	 *   the application stops capturing video, and any additional parameters you send are ignored.
	 * @param	snapshotMilliseconds	Specifies whether the video stream is continuous,
	 *   a single frame, or a series of single frames used to create time-lapse photography.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public attachCamera = (theCamera:Camera, snapshotMilliseconds:number =-1):void =>
	{
		let _this = this;
		
		if (snapshotMilliseconds != -1) console.log("WARNING Netstream.attachCamera() snapshotMilliseconds not implemented."); 
		
		if (theCamera.cameraStream)
		{
			this._playbackTarget.srcObject = theCamera.cameraStream;
			theCamera.videoElement = (<HTMLVideoElement>this._playbackTarget );
		}
		else
		{
			theCamera.addEventListener(ActivityEvent.ACTIVITY, function(e:ActivityEvent):void {
				if (e.activating)
				{
					_this._playbackTarget.srcObject = theCamera.cameraStream;
					theCamera.videoElement = _this._playbackTarget;
				}
			});
		}
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public close = ():void =>
	{
		// TODO implement close() method
	}

	public dispose = ():void =>
	{
		// TODO implement dispose() method
	}

	/**
	 * Creates a stream that you can use to play media files and send data over a NetConnection object.
	 * @param	connection	A NetConnection object.
	 * @param	peerID	This optional parameter is available in Flash Player 10 and later, for use with RTMFP connections.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @throws	ArgumentError The NetConnection instance is not connected.
	 */
	constructor (connection:NetConnection, peerID:string = "connectToFMS")
	{
		super();
		this._netConnection = connection;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public onPeerConnect = (subscriber:NetStream):boolean =>
	{
		console.log("WARNING Netstream.onPeerConnect property not implemented.");
		return null;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public pause = ():void =>
	{
		this._playbackTarget.pause();
		this._paused = true;
	}

	/**
	 * @param	arguments	Play a local file
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @throws	SecurityError Local untrusted SWF files cannot communicate with
	 *   the Internet. You can work around this restriction by reclassifying this SWF file
	 *   as local-with-networking or trusted.
	 * @throws	ArgumentError At least one parameter must be specified.
	 * @throws	Error The NetStream Object is invalid.  This may be due to a failed NetConnection.
	 */
	public play = (...rest):void =>
	{
		
		if (rest && rest[0] != null)
		{
			this._url = rest[0];
			if (this._playbackTarget)
			{
				this._playbackTarget.src = this._url;
				
				(this._playbackTarget).play().catch(function(e:Error):void
				{
					console.log("NetStream.play() Playback Error: " + e.message);
				});
				
				this._playbackTarget.loop = this._loop;
			}
		}
		else if (rest && rest[0] == null)
		{
			if (this._mimeCodec == "undefined")
			{
				throw Error("NetStream.play mimeCodec must be set before playback.");
			}
			else if (MediaSource.isTypeSupported(this._mimeCodec))
			{
				this._mediaSource = new MediaSource();
				this._mediaSource.addEventListener('sourceopen', this.handleSourceOpened, false);
				this._mediaSource.addEventListener('error', this.handleMediaSourceError, false);
			}
			else
			{
				alert('Unsupported MIME type or codec: ' + this._mimeCodec);
			}
		}
	}

	/**
	 * Switches seamlessly between files with multiple bit rates and allows a NetStream to resume when a connection is dropped and reconnected.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public play2 = (param:NetStreamPlayOptions):void =>
	{
		console.log("Netstream.play2 property not implemented.");
	}

	/**
	 * @param	name	A string that identifies the stream. Clients that subscribe to this stream pass
	 *   this name when they call NetStream.play(). Don't follow the stream name with a "/". For example, don't use
	 *   the stream name "bolero/".
	 * @param	type	A string that specifies how to publish the stream.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public publish = (name:string = null, type:string = null):void =>
	{
		console.log("Netstream.publish property not implemented.");
	}

	/**
	 * @param	flag	Specifies whether incoming audio plays on the stream (true) or not (false). The default value is true. 
	 *   If the specified stream contains only audio data, NetStream.time stops incrementing when you pass false.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public receiveAudio = (flag:boolean):void =>
	{
		console.log("Netstream.receiveAudio property not implemented.");
	}

	/**
	 * @param	flag	Specifies whether incoming video plays on this stream (true) or not (false). The default value is true.
	 *   If the specified stream contains only video data, NetStream.time stops incrementing when you pass false.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public receiveVideo = (flag:boolean):void =>
	{
		console.log("Netstream.receiveVideo property not implemented.");
	}

	/**
	 * @param	FPS	Specifies the frame rate per second at which the incoming video plays.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public receiveVideoFPS = (FPS:number):void =>
	{
		console.log("Netstream.receiveVideoFPS property not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	AIR 1.0
	 * @playerversion	Lite 4
	 * @throws	IOError The voucher data cannot be deleted.
	 */
	public static resetDRMVouchers = ():void =>
	{
		console.log("Netstream.resetDRMVouchers property not implemented.");
	}

	/**
	 * Resumes playback of a video stream that is paused. If the video is already playing, calling this method
	 * does nothing.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public resume = ():void =>
	{
		this._playbackTarget.play();
		this._paused = false;
	}

	/**
	 * @param	offset	The approximate time value, in seconds, to move to in a video file.
	 * @param	fastSeek	if true, seeking is faster, but less accurate.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public seek = (offset:number):void =>
	{
		this._playbackTarget.currentTime = offset;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public send = (handlerName:string, ...rest):void =>
	{
		console.log("Netstream.send method not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public step = (frames:number):void =>
	{
		console.log("Netstream.step method not implemented.");
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public togglePause = ():void =>
	{
		this._paused = !this._paused;
		if (this._playbackTarget)
		{
			(this._paused) ? this._playbackTarget.play() : this._playbackTarget.pause();
		}
	}
	
	/**
	 * Path to local file for playback.
	 */
	public get url():string
	{
		return this._url;
	}
	
	/**
	 * Object such as Video to set source for playback.
	 */
	public set playbackTarget(value:Object) 
	{
		this._playbackTarget = value;
		this._playbackTarget.onabort = this.netStatusEvents;
		this._playbackTarget.oncanplay = this.netStatusEvents;
		this._playbackTarget.oncanplaythrough = this.netStatusEvents;
		this._playbackTarget.ondurationchange = this.netStatusEvents;
		this._playbackTarget.onemptied = this.netStatusEvents;
		this._playbackTarget.onended = this.netStatusEvents;
		this._playbackTarget.onerror = this.netStatusEvents;
		this._playbackTarget.onloadeddata = this.netStatusEvents;
		this._playbackTarget.onloadedmetadata = this.netStatusEvents;
		this._playbackTarget.onloadstart = this.netStatusEvents;
		this._playbackTarget.onpause = this.netStatusEvents;
		this._playbackTarget.onplay = this.netStatusEvents;
		this._playbackTarget.onplaying = this.netStatusEvents;
		this._playbackTarget.onprogress = this.netStatusEvents;
		this._playbackTarget.onratechange = this.netStatusEvents;
		this._playbackTarget.onseeked = this.netStatusEvents;
		this._playbackTarget.onseeking = this.netStatusEvents;
		this._playbackTarget.onstalled = this.netStatusEvents;
		this._playbackTarget.onsuspend = this.netStatusEvents;
		this._playbackTarget.ontimeupdate = this.netStatusEvents;
		this._playbackTarget.addEventListener('timeupdate', this.handleTime, false);
		this._playbackTarget.onvolumechange = this.netStatusEvents;
		this._playbackTarget.onwaiting = this.netStatusEvents;
	}
	
	/**
	 * The codec used in the supplied file.  VideoCodec.H264AVC (.mp4) and VideoCodec.VP8 (.webm) accepted only.
	 */
	public get mimeCodec():string 
	{
		return this._mimeCodec;
	}
	
	public set mimeCodec(value:string) 
	{
		this._mimeCodec = value;
	}
	
	/**
	 * loops the playback continuously.  not supported in flash player or AIR.
	 */
	public get loop():boolean 
	{
		return this._loop;
	}
	
	public set loop(value:boolean) 
	{
		this._loop = value;
		if (this._playbackTarget && this._url) this._playbackTarget.loop = value;
	}
	
	private netStatusEvents = (e:Event):void =>
	{
		switch (e.type) 
		{
			case 'abort':
				Object(e).code = "NetStream.Abort";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'canplay':
				Object(e).code = "NetStream.CanPlay";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'canplaythrough':
				Object(e).code = "NetStream.CanPlayThrough";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'durationchange':
				Object(e).code = "NetStream.DurationChange";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'emptied':
				Object(e).code = "NetStream.Emptied";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'ended':
				Object(e).code = "NetStream.ended";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'error':
				Object(e).code = "NetStream.Play.Stop";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'loadeddata':
				Object(e).code = "NetStream.LoadedData";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'loadedmetadata':
				Object(e).code = "NetStream.LoadedMetaData";
				if (this._clientObject)
				{
					if (this._playbackTarget instanceof HTMLVideoElement)
					{
						if (this._clientObject.onMetaData) this._clientObject.onMetaData({duration:this._playbackTarget.duration, width:this._playbackTarget.videoWidth, height:this._playbackTarget.videoHeight});
					}
					else if (this._playbackTarget instanceof HTMLAudioElement)
					{
						if (this._clientObject.onMetaData) this._clientObject.onMetaData({duration:this._playbackTarget.duration, samplerate:this._playbackTarget.playbackRate});
					}
				}
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'loadstart':
				Object(e).code = "NetStream.LoadStart";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'pause':
				Object(e).code = "NetStream.Play.Stop";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				Object(e).code = "NetStream.Pause.Notify";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'play':
				Object(e).code = "NetStream.Play.Start";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'playing':
				Object(e).code = "NetStream.Playing";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'progress':
				Object(e).code = "NetStream.Progress";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'ratechange':
				Object(e).code = "NetStream.RateChange";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'seeked':
				Object(e).code = "NetStream.Seek.Notify";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'seeking':
				Object(e).code = "NetStream.Seeking";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'stalled':
				Object(e).code = "NetStream.Stalled";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'suspend':
				Object(e).code = "NetStream.Suspend";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'timeupdate':
				Object(e).code = "NetStream.TimeUpdate";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'volumechange':
				Object(e).code = "NetStream.VolumeChange";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
			case 'waiting':
				Object(e).code = "NetStream.Waiting";
				this.dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, e));
				break;
		}
	}
	
	private setupBuffer = ():void =>
	{
		this._sourceBuffer = this._mediaSource.addSourceBuffer(this._mimeCodec);
		this._sourceBuffer.addEventListener('updateend', this.handleUpdateEnd, false);
		this._sourceBuffer.addEventListener("error", this.netStatusEvents, false);
		this._sourceBuffer.addEventListener("abort", this.netStatusEvents, false);
		this._sourceBuffer.appendBuffer(this._bytes);
	}
	
	private handleMediaSourceError = (e:Event):void =>
	{
		console.log("Error: NetStream.handleMediaSourceError()", e);
	}
	
	private handleSourceOpened = (e:Event):void =>
	{
		//console.log("Source Opened? " + _mediaSource.readyState);
		if (!this._sourceBuffer) this.setupBuffer();
	}
	
	private handleUpdateEnd = (e:Event):void =>
	{
		console.log("NetStream.handleUpdateEnd() readyState: " + this._mediaSource.readyState + ", duration: " + this._mediaSource.duration);
		if (this._mimeCodec == VideoCodec.VP8) this._mediaSource.endOfStream(); // throws error on IE using MP4
		if (this._isNewBytes)
		{
			//console.log("NetStream.handleUpdateEnd() Seek to New Bytes!");
			this._playbackTarget.removeEventListener('timeupdate', this.handleTime, false);
			var currentDuration:number = this._duration;
			this._duration = this._mediaSource.duration;
			this._isNewBytes = false;
			this._playbackTarget.currentTime = this._duration - .0005;
		}
		else
		{
			this._duration = this._mediaSource.duration;
			if (this._playbackTarget.paused)
			{
				(this._playbackTarget as HTMLMediaElement).play().catch(function(e:Error):void
				{
					console.log("NetStream.handleUpdateEnd() Playback Error: " + e.message);
				});
			}
		}
		
		if (this._bytesQueue.length > 0)
		{
			this._sourceBuffer.appendBuffer(this._bytesQueue[0]);
			this._bytesQueue.shift();
		}
		
		this._looped = false;
		
		(this._playbackTarget as HTMLMediaElement).play().catch(function(e:Error):void
		{
			console.log("NetStream.handleUpdateEnd() Playback Error: " + e.message);
		});
	}
	
	
	private handleSeeked = (e:Event):void =>
	{
		//console.log("NetStream.handleSeeked()");
		this._playbackTarget.addEventListener('timeupdate', this.handleTime, false);
	}
	
	private handleTime = (e:Event):void =>
	{
		//console.log("NetStream.handleTime() time: " + _playbackTarget.currentTime);
		if (this._bytes && this._playbackTarget.currentTime != 0 && this._playbackTarget.currentTime >= this._duration - 1 && !this._looped)
		{
			this._looped = true;
			this._sourceBuffer.timestampOffset = this._duration - .0005;
			this._sourceBuffer.appendBuffer(this._bytes.slice(0));
			//console.log("NetStream.handleTime() APPEND LOOP!");
		}
	}
}