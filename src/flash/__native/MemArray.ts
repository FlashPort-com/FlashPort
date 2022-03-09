export class MemArray 
{
    public array:Array<any> = [];
    public length:number = 0;

    constructor() 
    {
        
    }
    
    public push = (v:any):void =>
    {
        this.array[this.length++] = v;
    }
}