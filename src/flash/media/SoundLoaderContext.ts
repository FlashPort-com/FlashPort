export class SoundLoaderContext extends Object
{
	public bufferTime:number = 1000;
	
	public checkPolicyFile:boolean = false;
	
	constructor(bufferTime:number = 1000, checkPolicyFile:boolean = false)
	{
		super();
		this.checkPolicyFile = checkPolicyFile;
		this.bufferTime = bufferTime;
	}
}