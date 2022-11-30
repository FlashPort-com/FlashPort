import { Sprite } from "./flash/display/Sprite"
import { StageAlign } from "./flash/display/StageAlign";
import { StageScaleMode } from "./flash/display/StageScaleMode";
import { AEvent } from "./flash/events";
import { Matrix } from "./flash/geom";
import { FlashPort } from "./FlashPort";

export class Main extends Sprite
{
    private mat:Matrix;

    constructor()
    {
        super();

        FlashPort.autoSize = true;
        this.stage.align = StageAlign.TOP_LEFT;
        this.stage.scaleMode = StageScaleMode.NO_SCALE;
        this.stage.canvas.style.backgroundColor = "#000000";

        

        this.addEventListener(AEvent.ENTER_FRAME, this.onUpdate);
    }

    private onUpdate = (e:AEvent):void =>
    {
        
    }
}

new Main();