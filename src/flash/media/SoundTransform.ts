export class SoundTransform extends Object
{
	private _volume:number = 1;
	private _pan:number = 0;
	private _leftToLeft:number = 1;
	private _rightToRight:number = 1;
	private _leftToRight:number = 0;
	private _rightToLeft:number = 0;
	
	constructor(vol:number = 1, panning:number = 0){
		super();
		this._volume = vol;
		this.pan = panning;
	}
	
	public get volume():number
	{
		return this._volume;
	}
	
	public set volume(v:number)
	{
		this._volume = v;
	}
	
	public get leftToLeft():number
	{
		return this._leftToLeft;
	}
	
	public set leftToLeft(v:number)
	{
		this._leftToLeft = v > 1 ? 1 : v;
		this.pan = this._rightToRight - this._leftToLeft;
		this._volume = Math.max(this._leftToLeft, this._rightToRight);
	}
	
	public get leftToRight():number
	{
		return this._leftToRight;
	}
	
	public set leftToRight(v:number)
	{
		this._leftToRight = v;
	}
	
	public get rightToRight():number
	{
		return this._rightToRight;
	}
	
	public set rightToRight(v:number)
	{
		this._rightToRight = v > 1 ? 1 : v;
		this.pan = this._rightToRight - this._leftToLeft;
		this._volume = Math.max(this._leftToLeft, this._rightToRight);
	}
	
	public get rightToLeft():number
	{
		return this._rightToLeft;
	}
	
	public set rightToLeft(v:number)
	{
		this._rightToLeft = v;
	}
	
	public get pan():number
	{
		return this._pan;
	}
	
	public set pan(panning:number)
	{
		if (panning < -1) panning = -1;
		if (panning > 1) panning = 1;
		this._pan = panning;
		this._leftToLeft = 1 - panning; 
		this._leftToRight = 0;
		this._rightToRight = 1 + panning;
		this._rightToLeft = 0;
		this._volume = Math.max(this._leftToLeft, this._rightToRight);
	}
}