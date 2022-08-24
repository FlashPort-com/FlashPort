import { SoundTransform } from "./SoundTransform";
import { Sound } from "./Sound";
import { ByteArray } from "../utils/ByteArray";

export class SoundMixer extends Object
{
	constructor()
	{
		super();
	}
	
	public static stopAll():void
	{
		var len:number = Sound.sounds.length;
		for (var i:number = 0; i < len;i++ ) {
			var sound:Sound = Sound.sounds[i];
			sound.playing = false;
			try{
				sound.source.stop(0);
			}catch(err){}
		}
	}
	
	public static computeSpectrum(outputArray:ByteArray, FFTMode:boolean=false, stretchFactor:number=0):void
	{
	
	}
	
	public static get bufferTime():number
	{
		return 0;
	}
	
	public static set bufferTime(param1:number)
	{
	
	}
	
	public static get soundTransform():SoundTransform
	{
		return null;
	}
	
	public static set soundTransform(param1:SoundTransform)
	{
	
	}
	
	public static areSoundsInaccessible():boolean
	{
		return false;
	}
	
	public static get audioPlaybackMode():string
	{
		return null;
	}
	
	public static set audioPlaybackMode(mode:string)
	{
	
	}
	
	public static get useSpeakerphoneForVoice():boolean
	{
		return false;
	}
	
	public static set useSpeakerphoneForVoice(b:boolean)
	{
	
	}
}