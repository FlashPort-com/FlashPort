export class URLRequest extends Object
{
	
	private static kInvalidParamError:number = 2004;
	private _url:string;
	private _data:Object = {};
	
	constructor(url:string = null){
		super();

		if(url != null)
		{
			this.url = url;
		}
		
		this.requestHeaders = [];
	}
	
	public get url() : string{
		return this._url;
	}
	
	public set url(param1:string){
		this._url = param1;
	}
	
	public get data() : Object { return this._data; }
	
	public set data(value:Object)
	{
		this._data = value;
	}
	
	public get method() : string { return null; }
	
	public set method(value:string)
	{
		/*var re:RegExp = new RegExp("^(\\x21|[\\x23-\\x26]|\\x2A|\\x2B|\\x2D|\\x2E|[\\x30-\\x39]|[\\x41-\\x5A]|[\\x5E-\\x7A])+$");
		if(!re.test(value))
		{
			Error.throwError(null,kInvalidParamError);
		}
		this.setMethod(value);*/
	}
	
	private setMethod(param1:string) : void{}
	
	public get contentType() : string { return null; }
	
	public set contentType(param1:string){}
	
	public get requestHeaders() : any[] { return null; }/*;*/
	
	public set requestHeaders(value:any[])
	{
		//if(value != null)
		//{
			//this.setRequestHeaders(value.filter(this.filterRequestHeaders));
		//}
		//else
		//{
			//this.setRequestHeaders(value);
		//}
	}
	
	private setRequestHeaders(param1:any[]) : void{}
	
	private filterRequestHeaders(item:any, index:number, array:any[]) : boolean
	{
		return true;
	}
	
	public get digest() : string { return null; }
	
	public set digest(param1:string){}
	
	public useRedirectedURL(param1:URLRequest, param2:boolean = false, param3:any = null, param4:string = null) : void{}
	
	private shouldFilterHTTPHeader(header:string) : boolean
	{
		return false;
	}
}