import { Sprite } from "../flash";
import { Shape } from "../flash";
import { BlurFilter } from "../flash";


export class Particle extends Shape
{
    public endPos:number = 0;
    public speed:number = 1;
    public activeIndex:number = 0;
    public sineSpeed:number = 1;
    public sineAmplitude:number = 1;
    private _color:number = 0xFF7700;

    constructor()
    {
        super();
        
        this.graphics.beginFill(this._color);
        this.graphics.drawCircle(0, 0, 10);

        //this.filters = [new BlurFilter(7,7)];
    }

    public set color(value) {
        this.cacheAsBitmap = false;
        this._color = value;
        this.graphics.clear();
        this.graphics.beginFill(this._color);
        this.graphics.drawCircle(0, 0, 10);
    }

    public get color():number {
        return this._color;
    }
}