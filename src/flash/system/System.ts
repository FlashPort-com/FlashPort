export class System extends Object
{
	//private static var theIME:IME = null;
	
	constructor()
	{
		super();
	}
	
	//public static function get ime() : IME;
	
	public static setClipboard(text:string):void
	{
				var textArea:HTMLTextAreaElement = document.createElement("textarea");
				textArea.style.position = 'fixed';
				textArea.style.top = "0";
				textArea.style.left = "0";
				textArea.style.width = '2em';
				textArea.style.height = '2em';
				textArea.style.padding = "0";
				textArea.style.border = 'none';
				textArea.style.outline = 'none';
				textArea.style.boxShadow = 'none';
				textArea.style.background = 'transparent';
				textArea.value = text;
				document.body.appendChild((<HTMLElement>textArea ));
				textArea.select();
				try {
					var successful:boolean = document.execCommand('copy');
					var msg:string = successful ? 'successful' : 'unsuccessful';
					console.log('Copying text command was ' + msg);
				} catch (err) {
					console.log('Oops, unable to copy');
				}
				document.body.removeChild((<HTMLElement>textArea ));		
	}
	
	public static get totalMemory():number
	{
		return System.totalMemoryNumber;
	}
	
	public static get totalMemoryNumber():number
	{
		return 0;
	}
	
	public static get freeMemory():number
	{
		return 0;
	}
	
	public static get privateMemory():number
	{
		return 0;
	}
	
	public static get processCPUUsage():number
	{
		return 0;
	}
	
	public static get useCodePage():boolean
	{
		return false;
	}
	
	public static set useCodePage(param1:boolean)
	{
	
	}
	
	public static get vmVersion():string
	{
		return null;
	}
	
	public static pause():void
	{
	
	}
	
	public static resume():void
	{
	
	}
	
	public static exit(param1:number):void
	{
	
	}
	
	public static gc():void
	{
	
	}
	
	public static pauseForGCIfCollectionImminent(param1:number = 0.75):void
	{
	
	}

	//public static function disposeXML(param1:XML) : void;
}