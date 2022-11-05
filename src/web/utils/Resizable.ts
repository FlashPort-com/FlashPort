import { DisplayObject } from "../../flash/display/DisplayObject.js";
import { Sprite } from "../../flash/display/Sprite.js";
import { AEvent } from "../../flash/events/AEvent.js";
import { TextField } from "../../flash/text/TextField.js";
import { TextFormat } from "../../flash/text/TextFormat.js";

export class Resizable extends Sprite
{
    private title:TextField;
    
    constructor(titleTxt:string = '') 
    {
        super();

        this.title = new TextField();
        this.title.defaultTextFormat = new TextFormat('Arial', 16, 0x464646);
        this.title.text = titleTxt;
        this.title.x = 5
        this.title.y = 1;
        this.addChild(this.title);

        this.stage.addEventListener(AEvent.RESIZE, this.handleResize);
    }

    private handleResize = (e:AEvent = null):void =>
    {
        this.graphics.clear();
        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 150, 10, 10, 10, 10);
        let minWidth:number = this.numChildren * 100;
        let padding:number = (this.stage.stageWidth) / this.numChildren;
        let pos:number = padding;
        
        for (let i:number = 0; i < this.numChildren; i++)
        {
            let child:DisplayObject = this.getChildAt(i);
            if (child != this.title)
            {
                let diff = child.getBounds(child).top;
                let left = child.getBounds(child).left;
                let w = child.getBounds(child).width;
                child.y = ((this.height - child.height) / 2) - diff;
                child.x = pos - ((w/2) + left);
                pos = child.x + (child.width -left) + padding;
            }
        }
    }

}