
export class GLCanvasPattern extends CanvasPattern
{
	public image:HTMLImageElement | HTMLCanvasElement;
	public repetition:string;
	
	constructor(image:HTMLImageElement | HTMLCanvasElement,repetition:string){
		super();
		this.repetition = repetition;
		this.image = image;
	}
	
}