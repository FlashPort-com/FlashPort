import { Sprite } from "../flash/display/Sprite.js";
import { AEvent } from "../flash/events/AEvent.js";
import { DropShadowFilter } from "../flash/filters/DropShadowFilter.js";
import { GlowFilter } from "../flash/filters/GlowFilter.js";
import { Resizable } from "./utils/Resizable.js";


export class Filtered extends Resizable
{
    constructor()
    {
        super();

        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 200, 10, 10, 10, 10);

        let circ:Sprite = new Sprite();
        circ.graphics.lineStyle(5, 0xCCCCCC);
        circ.graphics.beginFill(0xFF7F00);
        circ.graphics.drawCircle(50, 50, 50);
        circ.x = 40;
        circ.y = 50;
        circ.filters = [new DropShadowFilter(10, 45, 0x000000, 1, 10, 10, 100, 100)];
        this.addChild(circ);

        let sqr:Sprite = new Sprite();
        sqr.graphics.lineStyle(5, 0x000000);
        sqr.graphics.beginFill(0xFFFF00);
        sqr.graphics.drawRect(0, 0, 100, 100);
        sqr.filters = [new GlowFilter(0x0000FF, 1, 20, 20, 2, 100, false, false)];
        sqr.x = circ.x + circ.width + 40;
        sqr.y = 50;
        this.addChild(sqr);

        let sqr2:Sprite = new Sprite();
        sqr2.graphics.lineStyle(5, 0x000000);
        sqr2.graphics.beginFill(0xFFFF00);
        sqr2.graphics.drawRect(0, 0, 100, 100);
        sqr2.filters = [new GlowFilter(0x0000FF, 1, 20, 20, 2, 100, false, true)];
        sqr2.x = sqr.x + sqr.width + 40;
        sqr2.y = 50;
        this.addChild(sqr2);
    }
}