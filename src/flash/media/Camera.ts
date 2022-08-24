import { BitmapData } from "../display/BitmapData";
import { DisplayObject } from "../display/DisplayObject";
import { ActivityEvent } from "../events/ActivityEvent";
import { AEvent } from "../events/AEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { TimerEvent } from "../events/TimerEvent";
import { Rectangle } from "../geom/Rectangle";
import { ByteArray } from "../utils/ByteArray";
import { Timer } from "../utils/Timer";

/**
 * Dispatched when a camera reports its status.
 * @eventType	flash.events.StatusEvent.STATUS
 */
/*[Event(name="status", type="flash.events.StatusEvent")]*/ 

/**
 * Dispatched when a camera begins or ends a session.
 * @eventType	flash.events.ActivityEvent.ACTIVITY
 */
/*[Event(name="activity", type="flash.events.ActivityEvent")]*/ 

/**
 * Use the Camera class to capture video from the client system's camera. 
 * Use the Video class to monitor the video locally.  
 * Use the NetConnection and NetStream classes to transmit the video to Flash Media Server.
 * Flash Media Server can send the video stream to other servers and broadcast it to other clients running Flash Player.
 * 
 *   <p class="- topic/p ">A Camera instance captures video in landscape aspect ratio. On devices that can change the screen orientation,
 * such as mobile phones, a Video object attached to the camera will only show upright video in a landscape-aspect orientation. 
 * Thus, mobile apps should use a landscape orientation when displaying video and should not auto-rotate.</p><p class="- topic/p ">As of AIR 2.6, autofocus is enabled automatically on mobile devices with an autofocus camera. If the camera does not support continuous autofocus,
 * and many mobile device cameras do not, then the camera is focused when the Camera object is attached to a video stream and whenever 
 * the <codeph class="+ topic/ph pr-d/codeph ">setMode()</codeph> method is called. On desktop computers, autofocus behavior is dependent on the camera driver and settings.</p><p class="- topic/p ">In an AIR application on Android and iOS, the camera does not capture video while an AIR app is not the active, foreground application.
 * In addition, streaming connections can be lost when the application is in the background. On iOS, the camera video cannot be
 * displayed when an application uses the GPU rendering mode. The camera video can still be streamed to a server.</p><p class="- topic/p "><b class="+ topic/ph hi-d/b ">Mobile Browser Support:</b> This class is not supported in mobile browsers.</p><p class="- topic/p "><i class="+ topic/ph hi-d/i ">AIR profile support:</i> This feature is supported 
 * on desktop operating systems, but it is not supported on all mobile devices. It is not
 * supported on AIR for TV devices. See 
 * <xref href="http://help.adobe.com/en_US/air/build/WS144092a96ffef7cc16ddeea2126bb46b82f-8000.html" class="- topic/xref ">
 * AIR Profile Support</xref> for more information regarding API support across multiple profiles.</p><p class="- topic/p ">You can test 
 * for support at run time using the <codeph class="+ topic/ph pr-d/codeph ">Camera.isSupported</codeph> property. 
 * Note that for AIR for TV devices, <codeph class="+ topic/ph pr-d/codeph ">Camera.isSupported</codeph> is <codeph class="+ topic/ph pr-d/codeph ">true</codeph> but
 * <codeph class="+ topic/ph pr-d/codeph ">Camera.getCamera()</codeph> always returns <codeph class="+ topic/ph pr-d/codeph ">null</codeph>.</p><p class="- topic/p ">
 * For information about capturing audio, see the Microphone class.
 * </p><p class="- topic/p "><b class="+ topic/ph hi-d/b ">Important: </b>Flash Player displays a Privacy dialog box that lets the user choose whether 
 * to allow or deny access to the camera. Make sure your application window size is at least 215 x 138 pixels; 
 * this is the minimum size required to display the dialog box.
 * </p><p class="- topic/p ">To create or reference a Camera object, use the <codeph class="+ topic/ph pr-d/codeph ">getCamera()</codeph> method.</p>
 * 
 *   EXAMPLE:
 * 
 *   The following example shows the image from a camera after acknowledging the
 * security warning.  The Stage is set such that it cannot be scaled and is aligned to the
 * top-left of the player window.  The <codeph class="+ topic/ph pr-d/codeph ">activity</codeph> event is dispatched at the
 * start and end (if any) of the session and is captured by the <codeph class="+ topic/ph pr-d/codeph ">activityHandler()</codeph>
 * method, which prints out information about the event.
 * 
 *   <p class="- topic/p "><b class="+ topic/ph hi-d/b ">Note:</b> A camera must be attached to your computer for this example
 * to work correctly.</p><codeblock xml:space="preserve" class="+ topic/pre pr-d/codeblock ">
 * 
 *   package {
 * import flash.display.Sprite;
 * import flash.display.StageAlign;
 * import flash.display.StageScaleMode;
 * import flash.events.*;
 * import flash.media.Camera;
 * import flash.media.Video;
 * 
 *   public class CameraExample extends Sprite {
 * private var video:Video;
 * 
 *   public function CameraExample() {
 * stage.scaleMode = StageScaleMode.NO_SCALE;
 * stage.align = StageAlign.TOP_LEFT;
 * 
 *   var camera:Camera = Camera.getCamera();
 * 
 *   if (camera != null) {
 * camera.addEventListener(ActivityEvent.ACTIVITY, activityHandler);
 * video = new Video(camera.width * 2, camera.height * 2);
 * video.attachCamera(camera);
 * addChild(video);
 * } else {
 * trace("You need a camera.");
 * }
 * }
 * 
 *   private function activityHandler(event:ActivityEvent):void {
 * trace("activityHandler: " + event);
 * }
 * }
 * }
 * </codeblock>
 * @langversion	3.0
 * @playerversion	Flash 9
 */
export class Camera extends EventDispatcher
{
	private static _mediaDevices:any[];
	private _stream:MediaStream;
	private _videoElement:HTMLVideoElement;
	private _cameraStream:Object;
	private _cameraId:string;
	private _diffCanvas:HTMLCanvasElement;
	private _diffContext:CanvasRenderingContext2D;
	private _motionCanvas:HTMLCanvasElement;
	private _motionContext:CanvasRenderingContext2D;
	private _motionTimer:Timer = new Timer(100);/*;*/
	private _motionLevel:number = 50;
	private _pixelDiffThreshold:number = 32;
	private _diffWidth:number = 64;
	private _diffHeight:number = 64;
	private _diffdata:ImageData;
	private _activityLevel:number;
	private _motionTimeout:Timer = new Timer(2000);
	private _motionDetected:boolean = false;
	private _showMotionCanvas:boolean = false;
	private static _name:string;
	private static _names:any[] = [];
	private static _devices:any[] = [];
	public static dispatchObject:DisplayObject = new DisplayObject();
	
	/**
	 * The amount of motion the camera is detecting. Values range from 0 (no motion is being detected) to 
	 * 100 (a large amount of motion is being detected). The value of this property can help you determine if you need to pass a setting 
	 * to the setMotionLevel() method.
	 * If the camera is available but is not yet being used because the
	 * Video.attachCamera() method has not been called, this property
	 * is set to -1.If you are streaming only uncompressed local video, this property is set only if you have assigned a function to the  event 
	 * handler. Otherwise, it is undefined.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get activityLevel () : number
	{ 
		return this._activityLevel;
	}

	/**
	 * The maximum amount of bandwidth the current outgoing video feed can use, in bytes. 
	 * A value of 0 means the feed can use as much bandwidth as needed to maintain the desired frame quality.
	 * To set this property, use the setQuality() method.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get bandwidth () : number { return null }

	/**
	 * The rate at which the camera is capturing data, in frames per second. 
	 * This property cannot be set; however, you can use the setMode() method
	 * to set a related property—fps—which specifies the maximum
	 * frame rate at which you would like the camera to capture data.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get currentFPS () : number { return null }

	/**
	 * The maximum rate at which the camera can capture data, in frames per second. 
	 * The maximum rate possible depends on the capabilities of the camera; this frame rate may not be achieved.
	 * To set a desired value for this property, use the setMode() method.To determine the rate at which the camera is currently capturing data, use the currentFPS property.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get fps () : number { return null }

	/**
	 * The current capture height, in pixels. To set a value for this property, 
	 * use the setMode() method.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get height () : number { return null }

	/**
	 * A zero-based integer that specifies the index of the camera, as reflected in
	 * the array returned by the names property.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get index () : number { return null }

	/**
	 * The isSupported property is set to true if the 
	 * Camera class is supported on the current platform, otherwise it is
	 * set to false.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public static get isSupported () : boolean
	{ 
		if (navigator.mediaDevices) return true;
		return false;
	}

	/**
	 * The number of video frames transmitted in full (called keyframes) 
	 * instead of being interpolated by the video compression algorithm. 
	 * The default value is 15, which means that every 15th frame is a keyframe.
	 * A value of 1 means that every frame is a keyframe. The allowed values are
	 * 1 through 48.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get keyFrameInterval () : number { return null }

	/**
	 * Indicates whether a local view of what the camera is capturing is compressed
	 * and decompressed (true), as it would be for live transmission using
	 * Flash Media Server, or uncompressed (false). The default value is
	 * false.
	 * 
	 *   Although a compressed stream is useful for testing, such as when previewing
	 * video quality settings, it has a significant processing cost. The local view
	 * is compressed, edited for transmission as it would be over a live connection,
	 * and then decompressed for local viewing.
	 * To set this value, use Camera.setLoopback(). To set the amount of 
	 * compression used when this property is true, use Camera.setQuality().
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get loopback () : boolean { return null }

	/**
	 * The amount of motion required to invoke the activity event. Acceptable values range from 0 to 100. 
	 * The default value is 50.
	 * Video can be displayed regardless of the value of the motionLevel property. For more information, see 
	 * setMotionLevel().
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get motionLevel () : number 
	{ 
		return this._motionLevel;
	}

	/**
	 * The number of milliseconds between the time the camera stops detecting motion and the time the activity event is invoked. The 
	 * default value is 2000 (2 seconds). 
	 * To set this value, use setMotionLevel().
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get motionTimeout () : number { return null }

	/**
	 * A Boolean value indicating whether the user has denied access to the camera
	 * (true) or allowed access (false) in the Flash Player Privacy dialog box.
	 * 
	 *   When this value changes, the statusevent is dispatched.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get muted () : boolean { return null }

	/**
	 * The name of the current camera, as returned by the camera hardware.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get name () : string 
	{
		return this._cameraId;
	}

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public static get names () : any[] 
	{ 
		return Camera._names;
	}

	public get position () : string { return null }

	/**
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get quality () : number { return null }

	/**
	 * The current capture width, in pixels. To set a desired value for this property, 
	 * use the setMode() method.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get width () : number { return null }
	
	/**
	 * retrieves the available camera stream.
	 */
	public get cameraStream():MediaStream 
	{
		return this._stream;
	}
	
	public set cameraStream(value:MediaStream) 
	{
		let _this = this;
		this._cameraId = Camera._name;
		this._stream = value;
		this._stream.addEventListener('active', function (e:Event):void 
		{
			_this.dispatchEvent(new ActivityEvent(ActivityEvent.ACTIVITY, false, false, true));
		});
		
		this._stream.addEventListener('inactive', function (e:Event):void 
		{
			_this.dispatchEvent(new ActivityEvent(ActivityEvent.ACTIVITY, false, false, false)); 
		});
	}
	
	/**
	 * video element used for camera.
	 */
	public get videoElement():HTMLVideoElement 
	{
		return this._videoElement;
	}
	
	public set videoElement(value:HTMLVideoElement) 
	{
		this._videoElement = value;
	}
	
	public get showMotionCanvas():boolean 
	{
		return this._showMotionCanvas;
	}
	
	public set showMotionCanvas(value:boolean) 
	{
		this._showMotionCanvas = value;
	}

	private static _scanHardware () : void { }

	constructor (){
		super();
		this._cameraId = Camera._name;
	}

	public copyToByteArray (rect:Rectangle, destination:ByteArray) : void
	{
		console.log("WARNING Camera.copyToByteArray method not implemented.");
	}

	public copyToVector (rect:Rectangle, destination:number[]) : void
	{
		console.log("WARNING Camera.copyToVector method not implemented.");
	}
	
	/**
	 * Draws the current camera frame to the destination bitmapdata.
	 * @param	destination		the BitmapData object to use for drawing.
	 */
	public drawToBitmapData (destination:BitmapData) : void
	{
		destination.fromImage(this._videoElement, 0, 0, this._videoElement.width, this._videoElement.height);
	}

	/**
	 * @param	name	Specifies which camera to get, as determined from the array
	 *   returned by the names property. For most applications, get the default camera 
	 *   by omitting this parameter. To specify a value for this parameter, use the string representation
	 *   of the zero-based index position within the Camera.names array. For example, to specify the third
	 *   camera in the array, use Camera.getCamera("2").
	 * @param facingMode	Used to specify on mobile devices to use front facing camera "user" or the back camera "environment".
	 * @return	If the name parameter is not specified, this method returns a reference
	 *   to the default camera or, if it is in use by another application, to the first
	 *   available camera. (If there is more than one camera installed, the user may specify
	 *   the default camera in the Flash Player Camera Settings panel.) If no cameras are available
	 *   or installed, the method returns null.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public static getCamera (name:string = null, minWidth:number = 320, minHeight:number = 240, facingMode:string = "user") :Camera
	{
		var newCamera:Camera = new Camera();
		
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		{
			//https://w3c.github.io/mediacapture-main/getusermedia.html#dom-mediatracksupportedconstraints
			//var constraint:Object = { audio: false, video: true };
			//var constraint:Object = { audio: true, video: { facingMode: "user" } };
			//var constraint:Object = { audio: true, video: { facingMode: "environment" } };
			//var constraint:Object = { audio: true, video: { facingMode: { exact: "environment" } } };
			
			// get all devices
			navigator.mediaDevices.enumerateDevices()
			.then(function(devices:any[]):void {
				var foundVideoDevice:boolean = false;
				
				//trace("What...No Devices? 0 Total: " + devices.length);
				
				for (var i:number = 0; i < devices.length; i++)
				{
					var device:MediaDeviceInfo = devices[i];
					
					if ((name && (device.deviceId == name || device.label == name)) || (!name && Object(device).kind == "videoinput"))
					{
						foundVideoDevice = true;
						
						//trace("Found Device: ", device);
						
						var videoConstraint:Object = {
							facingMode:facingMode,
							width: { min: minWidth, ideal: minWidth },
							height: { min: minHeight, ideal: minHeight }
						};
						
						if (device.deviceId != "") videoConstraint['deviceId'] = {exact: device.deviceId};
						
						navigator.mediaDevices.getUserMedia((<MediaStreamConstraints>{video: videoConstraint, audio: false} ))
						.then(function(stream:MediaStream):void {
							//trace("Camera.getCamera() Found Stream for device: " + device.label, stream);
							Camera._name = (device.label != "") ? device.label : device.deviceId;
							newCamera.cameraStream = stream;
							if (newCamera.motionLevel == 50) newCamera.setMotionLevel(50);
							newCamera.dispatchEvent(new ActivityEvent(ActivityEvent.ACTIVITY, false, false, true));
						});
						
						break;
					}
				}
				
				if (!foundVideoDevice) newCamera.dispatchEvent(new ActivityEvent(ActivityEvent.ACTIVITY, false, false, false));
				
			});
		}
		else
		{
			newCamera.dispatchEvent(new ActivityEvent(ActivityEvent.ACTIVITY, false, false, false));
		}
		
		return newCamera;
	}
	
	public setCursor (value:boolean) : void 
	{
		console.log("WARNING Camera.setCursor method not implemented.");
	}
	
	/**
	 * @param	keyFrameInterval	A value that specifies which video frames are transmitted in full
	 *   (as keyframes) instead of being interpolated by the video compression algorithm. 
	 *   A value of 1 means that every frame is a keyframe, a value of 3 means that every third frame
	 *   is a keyframe, and so on. Acceptable values are 1 through 48.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setKeyFrameInterval (keyFrameInterval:number) : void
	{
		console.log("WARNING Camera.setKeyFrameInterval method not implemented.");
	}

	/**
	 * @param	compress	Specifies whether to use a compressed video stream (true) 
	 *   or an uncompressed stream (false) for a local view of what the camera
	 *   is receiving.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setLoopback (compress:boolean = false) : void
	{
		console.log("WARNING Camera.setLoopback method not implemented.");
	}

	/**
	 * @param	width	The requested capture width, in pixels. The default value is 160.
	 * @param	height	The requested capture height, in pixels. The default value is 120.
	 * @param	fps	The requested rate at which the camera should capture data, in frames per second.
	 *   The default value is 15.
	 * @param	favorArea	Specifies whether to manipulate the width, height, and frame rate if 
	 *   the camera does not have a native mode that meets the specified requirements. 
	 *   The default value is true, which means that maintaining capture size
	 *   is favored; using this parameter selects the mode that most closely matches 
	 *   width and height values, even if doing so adversely affects 
	 *   performance by reducing the frame rate. To maximize frame rate at the expense 
	 *   of camera height and width, pass false for the favorArea parameter.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setMode (width:number, height:number, fps:number, favorArea:boolean = true) : void
	{
		console.log("WARNING Camera.setMode method not implemented.");
	}

	/**
	 * @param	motionLevel	Specifies the amount of motion required to dispatch the
	 *   activity event. Acceptable values range from 0 to 100. The default value is 50.
	 * @param	timeout	Specifies how many milliseconds must elapse without activity 
	 *   before Flash Player considers activity to have stopped and dispatches the activity event.
	 *   The default value is 2000 milliseconds (2 seconds).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setMotionLevel (motionLevel:number, timeout:number = 2000) : void
	{
		if (!this._diffCanvas)
		{
			this._diffCanvas = (<HTMLCanvasElement>document.createElement("canvas") );
			this._diffCanvas.width = this._diffWidth;
			this._diffCanvas.height = this._diffHeight;
			this._diffContext = (<CanvasRenderingContext2D>this._diffCanvas.getContext("2d") );
			
			this._motionCanvas = (<HTMLCanvasElement>document.createElement("canvas") );
			this._motionCanvas.style.position = "absolute";
			this._motionCanvas.style.zIndex = "999";
			this._motionCanvas.width = this._diffWidth;
			this._motionCanvas.height = this._diffHeight;
			this._motionContext = (<CanvasRenderingContext2D>this._motionCanvas.getContext("2d") );
			if (this._showMotionCanvas) document.body.appendChild(this._motionCanvas);
		}
		
		this._motionLevel = motionLevel;
		
		this._motionTimeout.delay = timeout;
		this._motionTimeout.addEventListener(TimerEvent.TIMER, this.onMotionTimeout);
		
		this._motionTimer.addEventListener(TimerEvent.TIMER, this.onMotionTimer);
		this._motionTimer.start();
		
	}
	
	private onMotionTimeout(e:TimerEvent):void 
	{
		//trace("Camera.onMotionTimeout()");
		if (this._motionDetected) this.dispatchEvent(new ActivityEvent(ActivityEvent.MOTION_ENDED));
		this._motionTimeout.reset();
		this._motionDetected = false;
	}
	
	private onMotionTimer(e:TimerEvent):void 
	{
		if (this._videoElement) 
		{
			this._diffContext.globalCompositeOperation = "difference";
			this._diffContext.drawImage(this._videoElement, 0, 0, this._diffWidth, this._diffHeight);
			this._diffdata = this._diffContext.getImageData(0, 0, this._diffWidth, this._diffHeight);
			this.processDiff(this._diffdata);
			
			this._motionContext.putImageData(this._diffdata, 0, 0);
			
			this._diffContext.globalCompositeOperation = "source-over";
			this._diffContext.drawImage(this._videoElement, 0, 0, this._diffWidth, this._diffHeight);
		}
	}
	
	private processDiff(diffdata:ImageData):void 
	{
		var rgba:Uint8ClampedArray = diffdata.data;
		var len:number = rgba.length;
		var score:number = 0;
		
		for (var i:number = 0; i < len; i += 4) {
			var pixelDiff:number = rgba[i] * 0.3 + rgba[i + 1] * 0.6 + rgba[i + 2] * 0.1;
			
			// normalize to shade of green
			var normalized:number = Math.min(255, pixelDiff * (255 / this._pixelDiffThreshold));
			rgba[i] = 0;
			rgba[i + 1] = normalized;
			rgba[i + 2] = 0;

			if (pixelDiff >= this._pixelDiffThreshold) score++;
		}
		
		this._activityLevel = score;
		
		//trace("score: " + score + "pixels: " + (_motionLevel / 100) * (len / 8) + ", total pixels: " + (len/8));
		
		if (score > (this._motionLevel/100) * (len/128))
		{
			this._motionTimeout.reset();
			
			if (!this._motionDetected)
			{
				this._motionDetected = true;
				this.dispatchEvent(new ActivityEvent(ActivityEvent.MOTION_DETECTED));
				//trace("Motion Detected: " + score + " of " + (_motionLevel/100) * (len/128) + ", motionLevel: " + _motionLevel);
			}
		}
		else if (this._motionDetected)
		{
			if (!this._motionTimeout.running) this._motionTimeout.start();
		}
	}

	/**
	 * @param	bandwidth	Specifies the maximum amount of bandwidth that the current outgoing video
	 *   feed can use, in bytes per second. To specify that Flash Player video can use as much bandwidth
	 *   as needed to maintain the value of quality, pass 0 for 
	 *   bandwidth. The default value is 16384.
	 * @param	quality	An integer that specifies the required level of picture quality,
	 *   as determined by the amount of compression being applied to each video frame. 
	 *   Acceptable values range from 1 (lowest quality, maximum compression) to 100 (highest 
	 *   quality, no compression). To specify that picture quality can vary as needed to avoid 
	 *   exceeding bandwidth, pass 0 for quality.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setQuality (bandwidth:number, quality:number) : void
	{
		console.log("WARNING Camera.setQuality method not implemented.");
	}
}