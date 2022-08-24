import { DisplayObject } from "../../flash/display/DisplayObject.js";
import { Sprite } from "../../flash/display/Sprite.js";
import { AEvent } from "../../flash/events/AEvent.js";

export class Resizable extends Sprite
{
    constructor() 
    {
        super();

        this.stage.addEventListener(AEvent.RESIZE, this.handleResize);
    }

    private handleResize = (e:AEvent = null):void =>
    {
        this.graphics.clear();
        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 200, 10, 10, 10, 10);
        let minWidth:number = this.numChildren * 100;
        let padding:number = (this.stage.stageWidth - minWidth) / (this.numChildren + 1);
        let pos:number = padding;
        
        for (let i:number = 0; i < this.numChildren; i++)
        {
            let child:DisplayObject = this.getChildAt(i);
            child.x = pos;
            pos = child.x + 100 + padding;
            
        }
    }

}