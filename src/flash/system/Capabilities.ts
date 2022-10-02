export class Capabilities extends Object
{
	constructor()
	{
		super();
	}
	
	public static get isEmbeddedInAcrobat():boolean  { return false }

	
	public static get hasEmbeddedVideo():boolean  { return false }

	
	public static get hasAudio():boolean  { return false }

	
	public static get avHardwareDisable():boolean  { return false }

	
	public static get hasAccessibility():boolean  { return false }

	
	public static get hasAudioEncoder():boolean  { return false }

	
	public static get hasMP3():boolean  { return false }

	
	public static get hasPrinting():boolean  { return false }

	
	public static get hasScreenBroadcast():boolean  { return false }

	
	public static get hasScreenPlayback():boolean  { return false }

	
	public static get hasStreamingAudio():boolean  { return false }

	
	public static get hasStreamingVideo():boolean  { return false }

	
	public static get hasVideoEncoder():boolean  { return false }

	
	public static get isDebugger():boolean  { return false }

	
	public static get localFileReadDisable():boolean  { return false }

	
	public static get language():string  { return null }

	
	public static get manufacturer():string  { return null }

	
	public static get os():string  { return null }

	
	public static get cpuArchitecture():string  { return null }

	
	public static get playerType():string  { return "spriteflexjs" }

	
	public static get serverString():string  { return null }

	
	public static get version():string  { return null }

	
	public static get screenColor():string  { return null }

	
	public static get pixelAspectRatio():number  { return 0 }

	
	public static get screenDPI():number  { return 0 }

	
	public static get screenResolutionX():number  { return Math.max(window.screen.width, window.innerWidth); }

	
	public static get screenResolutionY():number  { return Math.max(window.screen.height, window.innerHeight); }

	
	public static get touchscreenType():string  { return null }

	
	public static get hasIME():boolean  { return false }

	
	public static get hasTLS():boolean  { return false }

	
	public static get maxLevelIDC():string  { return null }

	
	public static get supports32BitProcesses():boolean  { return false }

	
	public static get supports64BitProcesses():boolean  { return false }

	
	public static hasMultiChannelAudio(param1:string):boolean  { return false }
}