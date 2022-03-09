export class FrameLabel 
{
	private _frame:number;
	private _name:string;
	
	public get name():string 
	{
		return this._name;
	}
	
	public get frame():number 
	{
		return this._frame;
	}
	
	constructor(name:string, frame:number){
		this._name = name;
		this._frame = frame;
	}
	
}