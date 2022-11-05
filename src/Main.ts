import { Sprite } from "./flash/display/Sprite"
import { StageAlign } from "./flash/display/StageAlign";
import { StageScaleMode } from "./flash/display/StageScaleMode";
import { AEvent } from "./flash/events";
import { Matrix } from "./flash/geom";
import { FlashPort } from "./FlashPort";
import { Filtered } from "./web/Filtered.js";
import { Header } from "./web/Header";
import { AvailableEvents } from "./web/AvailableEvents";
import { Primitives } from "./web/Primitives";

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

        
        let header:Header = new Header();
        this.addChild(header);

        let primitives:Primitives = new Primitives();
        primitives.y = header.y + header.height + 15;
        this.addChild(primitives);

        let filtered:Filtered = new Filtered();
        filtered.y = primitives.y + primitives.height + 15;
        this.addChild(filtered);

        let availableEvents:AvailableEvents = new AvailableEvents();
        //availableEvents.y = filtered.y + filtered.height + 15;
        this.addChild(availableEvents);

        this.addEventListener(AEvent.ENTER_FRAME, this.onUpdate);
    }

    private onUpdate = (e:AEvent):void =>
    {
        
    }
}

new Main();