import { EventDispatcher } from "../events/EventDispatcher";
import { SoundTransform } from "./SoundTransform";
import { MicrophoneEnhancedOptions } from "./MicrophoneEnhancedOptions";

/**
 * Dispatched when a microphone reports its status.
 * @eventType	flash.events.StatusEvent.STATUS
 */
/*[Event(name="status", type="flash.events.StatusEvent")]*/ 

/**
 * Dispatched when the microphone has sound data in the buffer.
 * @eventType	flash.events.SampleDataEvent.SAMPLE_DATA
 */
/*[Event(name="sampleData", type="flash.events.SampleDataEvent")]*/ 

/**
 * Dispatched when a microphone starts or stops recording due to detected silence.
 * @eventType	flash.events.ActivityEvent.ACTIVITY
 */
/*[Event(name="activity", type="flash.events.ActivityEvent")]*/ 

/**
 * @langversion	3.0
 * @playerversion	Flash 9
 */
export class Microphone extends EventDispatcher
{
	private _activityLevel:number = 0;
	private _codec:string = "";
	private _enableVAD:boolean = false;
	private _encodeQuality:number = 6;
	private _enhancedOptions:MicrophoneEnhancedOptions;
	private _gain:number = 50;
	private _index:number = 0;
	private static _isSupported:boolean = false;
	private _muted:boolean = false;
	private _name:string;
	private static _names:any[] = [];
	private _rate:number = 8;
	private _silenceLevel:number = 10;
	private _silenceTimeout:number = 2000; // 2 seconds
	private _soundTransform:SoundTransform;
	private _setLoopBack:boolean = false;
	
	/**
	 * The amount of sound the microphone is detecting. Values range from 
	 * 0 (no sound is detected) to 100 (very loud sound is detected). The value of this property can 
	 * help you determine a good value to pass to the Microphone.setSilenceLevel() method.
	 * 
	 *   If the microphone muted property is true, the value of this property is always -1.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get activityLevel () : number
	{
		return this._activityLevel;
	}

	/**
	 * The codec to use for compressing audio. Available codecs are Nellymoser (the default) and Speex. The enumeration class SoundCodec contains
	 * the various values that are valid for the codec property.
	 * 
	 *   If you use the Nellymoser codec, you can set the sample rate using Microphone.rate(). 
	 * If you use the Speex codec, the sample rate is set to 16 kHz.Speex includes voice activity detection (VAD) and automatically reduces bandwidth when no voice is detected. 
	 * When using the Speex codec, Adobe recommends that you set the silence level to 0. To set the silence level, use the
	 * Microphone.setSilenceLevel() method.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get codec () : string
	{
		return this._codec;
	}
	public set codec (codec:string)
	{
		this._codec = codec;
	}

	/**
	 * Enable Speex voice activity detection.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get enableVAD () : boolean
	{
		console.log("WARNING Microphone.enableVAD property not implemented.");
		return false;
	}
	public set enableVAD (enable:boolean)
	{
		console.log("WARNING Microphone.enableVAD property not implemented.");
	}

	/**
	 * The encoded speech quality when using the Speex codec. Possible values are from 0 to 10. The default value is 6. 
	 * Higher numbers represent higher quality but require more bandwidth, as shown in the following table. The bit rate values that are listed 
	 * represent net bit rates and do not include packetization overhead.
	 * Quality valueRequired bit rate (kilobits per second)0 3.9515.7527.7539.80412.8516.8620.6723.8827.8934.21042.2
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get encodeQuality () : number
	{
		console.log("WARNING Microphone.encodeQuality property not implemented.");
		return null;
	}
	public set encodeQuality (quality:number)
	{
		console.log("WARNING Microphone.encodeQuality property not implemented.");
	}

	/**
	 * Controls enhanced microphone options. For more information, see	
	 * MicrophoneEnhancedOptions class. This property is ignored for non-enhanced Microphone instances.
	 * @langversion	3.0
	 * @playerversion	Flash 10.3
	 * @playerversion	AIR 2.7
	 */
	public get enhancedOptions () : MicrophoneEnhancedOptions
	{
		return this._enhancedOptions;
	}
	public set enhancedOptions (options:MicrophoneEnhancedOptions)
	{
		this._enhancedOptions = options;
	}

	/**
	 * Number of Speex speech frames transmitted in a packet (message). 
	 * Each frame is 20 ms long. The default value is two frames per packet.
	 * 
	 *   The more Speex frames in a message, the lower the bandwidth required but the longer the delay in sending the
	 * message. Fewer Speex frames increases bandwidth required but reduces delay.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get framesPerPacket () : number
	{
		console.log("WARNING Microphone.framesPerPacket property not implemented.");
		return null;
	}
	public set framesPerPacket (frames:number)
	{
		console.log("WARNING Microphone.framesPerPacket property not implemented.");
	}

	/**
	 * The amount by which the microphone boosts the signal. Valid values are 0 to 100. The default value is 50.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get gain () : number
	{
		return this._gain;
	}
	public set gain (gain:number)
	{
		this._gain = gain;
	}

	/**
	 * The index of the microphone, as reflected in the array returned by 
	 * Microphone.names.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get index () : number
	{
		return this._index;
	}

	/**
	 * The isSupported property is set to true if the 
	 * Microphone class is supported on the current platform, otherwise it is
	 * set to false.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public static get isSupported () : boolean
	{
		return Microphone._isSupported;
	}

	/**
	 * Specifies whether the user has denied access to the microphone (true) 
	 * or allowed access (false). When this value changes, 
	 * a status event is dispatched.
	 * For more information, see Microphone.getMicrophone().
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get muted () : boolean
	{
		return this._muted;
	}

	/**
	 * The name of the current sound capture device, as returned by the sound capture hardware.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get name () : string
	{
		return this._name;
	}

	/**
	 * An array of strings containing the names of all available sound capture devices. 
	 * The names are returned without 
	 * having to display the Flash Player Privacy Settings panel to the user. This array 
	 * provides the zero-based index of each sound capture device and the 
	 * number of sound capture devices on the system, through the Microphone.names.length property. 
	 * For more information, see the Array class entry.
	 * 
	 *   Calling Microphone.names requires an extensive examination of the hardware, and it
	 * may take several seconds to build the array. In most cases, you can just use the default microphone.Note: To determine the name of the current microphone, 
	 * use the name property.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public static get names () : any[]
	{
		return Microphone._names;
	}

	/**
	 * Maximum attenuation of the noise in dB (negative number) used for Speex encoder. If enabled, noise suppression is applied to sound captured from Microphone before
	 * Speex compression. Set to 0 to disable noise suppression. Noise suppression is enabled by default with maximum attenuation of -30 dB. Ignored when Nellymoser
	 * codec is selected.
	 * @langversion	3.0
	 * @playerversion	Flash 10.1
	 * @playerversion	AIR 2
	 */
	public get noiseSuppressionLevel () : number
	{
		console.log("WARNING Microphone.noiseSuppressionLevel property not implemented.");
		return null;
	}
	public set noiseSuppressionLevel (level:number)
	{
		console.log("WARNING Microphone.noiseSuppressionLevel property not implemented.");
	}

	/**
	 * The rate at which the microphone is capturing sound, in kHz. Acceptable values are 5, 8, 11, 22, and 44. The default value is 8 
	 * kHz if your sound capture device supports this value. Otherwise, the default value is the next available capture level above 8 kHz
	 * that your sound capture device supports, usually 11 kHz.
	 * 
	 *   Note: The actual rate differs slightly from the rate value, as noted
	 * in the following table:rate valueActual frequency4444,100 Hz2222,050 Hz1111,025 Hz88,000 Hz55,512 Hz
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get rate () : number
	{
		return this._rate;
	}
	public set rate (rate:number)
	{
		this._rate = rate;
	}

	/**
	 * The amount of sound required to activate the microphone and dispatch 
	 * the activity event. The default value is 10.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get silenceLevel () : number
	{
		return this._silenceLevel;
	}

	/**
	 * The number of milliseconds between the time the microphone stops 
	 * detecting sound and the time the activity event is dispatched. The default 
	 * value is 2000 (2 seconds).
	 * 
	 *   To set this value, use the Microphone.setSilenceLevel() method.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get silenceTimeout () : number
	{
		return this._silenceTimeout;
	}

	/**
	 * Controls the sound of this microphone object when it is in loopback mode.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get soundTransform () : SoundTransform
	{
		return this._soundTransform;
	}
	public set soundTransform (sndTransform:SoundTransform)
	{
		this._soundTransform = sndTransform;
	}

	/**
	 * Set to true if echo suppression is enabled; false otherwise. The default value is 
	 * false unless the user has selected Reduce Echo in the Flash Player Microphone Settings panel.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get useEchoSuppression () : boolean
	{
		console.log("WARNING Microphone.useEchoSuppression property not implemented.");
		return false;
	}

	/**
	 * @param	index	The index value of the microphone.
	 * @return	A reference to a Microphone object for capturing audio. If enhanced audio fails to initialize, returns null.
	 * @langversion	3.0
	 * @playerversion	Flash 10.3
	 * @playerversion	AIR 2.7
	 */
	public static getEnhancedMicrophone (index:number =-1) : Microphone
	{
		console.log("WARNING Microphone.getEnhancedMicrophone property not implemented.");
		return null;
	}

	/**
	 * @param	index	The index value of the microphone.
	 * @return	A reference to a Microphone object for capturing audio.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public static getMicrophone (index:number =-1) : Microphone
	{
		return new Microphone();
	}

	constructor (){
		super();
	}

	/**
	 * Routes audio captured by a microphone to the local speakers.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setLoopBack (state:boolean = true) : void
	{
		this._setLoopBack = state;
	}

	/**
	 * @param	silenceLevel	The amount of sound required to activate the microphone
	 *   and dispatch the activity event. Acceptable values range from 0 to 100.
	 * @param	timeout	The number of milliseconds that must elapse without
	 *   activity before Flash Player or Adobe AIR considers sound to have stopped and dispatches the 
	 *   dispatch event. The default value is 2000 (2 seconds). 
	 *   (Note: The default value shown 
	 *   in the signature, -1, is an internal value that indicates to Flash Player or Adobe AIR to use 2000.)
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setSilenceLevel (silenceLevel:number, timeout:number =-1) : void
	{
		this._silenceLevel = silenceLevel;
		this._silenceTimeout = timeout;
	}

	/**
	 * @param	useEchoSuppression	A Boolean value indicating whether to use echo suppression 
	 *   (true) or not (false).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public setUseEchoSuppression (useEchoSuppression:boolean) : void
	{
		console.log("WARNING Microphone.setUseEchoSuppression property not implemented.");
	}
}