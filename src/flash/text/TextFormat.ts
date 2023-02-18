export class TextFormat extends Object
{
	private _css:string;
	private dirty:boolean = true;
	private _font:string = "Arial";
	private _bold:boolean;
	private _italic:boolean;
	private _size:any=12;
	private _color:any = 0x000000;
	private _align:string = "left";
	
	constructor(font:string = null, size:any = null, color:any = null, bold:any = null, italic:any = null, underline:any = null, url:string = null, target:string = null, align:string = null, leftMargin:any = null, rightMargin:any = null, indent:any = null, leading:any = null){
		super();
		if (font != null)
		{
			this.font = font;
		}
		if (size != null)
		{
			this.size = size;
		}
		if (color != null)
		{
			this.color = color;
		}
		if (bold != null)
		{
			this.bold = bold;
		}
		if (italic != null)
		{
			this.italic = italic;
		}
		if (underline != null)
		{
			this.underline = underline;
		}
		if (url != null)
		{
			this.url = url;
		}
		if (target != null)
		{
			this.target = target;
		}
		if (align != null)
		{
			this.align = align;
		}
		if (leftMargin != null)
		{
			this.leftMargin = leftMargin;
		}
		if (rightMargin != null)
		{
			this.rightMargin = rightMargin;
		}
		if (indent != null)
		{
			this.indent = indent;
		}
		if (leading != null)
		{
			this.leading = leading;
		}
	}
	
	public get align():string  { return this._align; }
	
	public set align(param1:string)  { this._align = param1; }
	
	public get blockIndent():any  { return null; }
	
	public set blockIndent(param1:any)  {/**/ }
	
	public get bold():any  { return this._bold; }
	
	public set bold(param1:any)  { this._bold = param1 }
	
	public get bullet():any  { return null; }
	
	public set bullet(param1:any)  {/**/ }
	
	public get color():any  { return this._color; }
	
	public set color(param1:any)  { this._color = param1; }
	
	public get display():string  { return null; }
	
	public set display(param1:string)  {/**/ }
	
	public get font():string  { return this._font; }
	
	public set font(param1:string)  { this._font = param1; }
	
	public get indent():any  { return null; }
	
	public set indent(param1:any)  {/**/ }
	
	public get italic():any  { return this._italic; }
	
	public set italic(param1:any)  { this._italic = param1; }
	
	public get kerning():any  { return null; }
	
	public set kerning(param1:any)  {/**/ }
	
	public get leading():any  { return null; }
	
	public set leading(param1:any)  {/**/ }
	
	public get leftMargin():any  { return null; }
	
	public set leftMargin(param1:any)  {/**/ }
	
	public get letterSpacing():any  { return null; }
	
	public set letterSpacing(param1:any)  {/**/ }
	
	public get rightMargin():any  { return null; }
	
	public set rightMargin(param1:any)  {/**/ }
	
	public get size():any  { return this._size; }
	
	public set size(param1:any)  { this._size = param1; }
	
	public get tabStops():any[]  { return null; }
	
	public set tabStops(param1:any[])  {/**/ }
	
	public get target():string  { return null; }
	
	public set target(param1:string)  {/**/ }
	
	public get underline():any  { return null; }
	
	public set underline(param1:any)  {/**/ }
	
	public get url():string  { return null; }
	
	public set url(param1:string)  {/**/ }
	
	public get css():string
	{
		this._css = (this.italic ? "italic " : "") + (this.bold ? "bold " : "") + this.size+"px " +this.font;
		return this._css;
	}
	
	public get csscolor():string {
		return "rgb(" + (Number(this.color) >> 16 & 0xff) + "," + (Number(this.color) >> 8 & 0xff) + "," + (Number(this.color) & 0xff) + ")";
	}
}