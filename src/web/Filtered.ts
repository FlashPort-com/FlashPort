import { GradientType } from "../flash/display/GradientType.js";
import { Sprite } from "../flash/display/Sprite.js";
import { BlurFilter } from "../flash/filters/BlurFilter.js";
import { DropShadowFilter } from "../flash/filters/DropShadowFilter.js";
import { GlowFilter } from "../flash/filters/GlowFilter.js";
import { Matrix } from "../flash/geom/Matrix.js";
import { Resizable } from "./utils/Resizable.js";


export class Filtered extends Resizable
{
    constructor()
    {
        super("Drop Shadow, Glow and Blur filters");

        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 150, 10, 10, 10, 10);

        let circ:Sprite = new Sprite();
        circ.graphics.lineStyle(5, 0xCCCCCC);
        circ.graphics.beginFill(0xFF7F00);
        circ.graphics.drawCircle(50, 50, 50);
        circ.x = 40;
        circ.y = (this.height - circ.height) / 2;
        circ.filters = [new DropShadowFilter(10, 45, 0x000000, 1, 10, 10, 100, 100)];
        this.addChild(circ);

        let sqr:Sprite = new Sprite();
        sqr.graphics.lineStyle(5, 0x000000);
        sqr.graphics.beginFill(0xFFFF00);
        sqr.graphics.drawRect(0, 0, 100, 100);
        sqr.filters = [new GlowFilter(0x0000FF, 1, 20, 20, 2, 100, false, false)];
        sqr.x = circ.x + circ.width + 40;
        sqr.y = (this.height - sqr.height) / 2;
        this.addChild(sqr);

        let sqr2:Sprite = new Sprite();
        sqr2.graphics.lineStyle(5, 0x000000);
        sqr2.graphics.beginFill(0xFFFF00);
        sqr2.graphics.drawRect(0, 0, 100, 100);
        sqr2.filters = [new GlowFilter(0x0000FF, 1, 20, 20, 2, 100, false, true)];
        sqr2.x = sqr.x + sqr.width + 40;
        sqr2.y = (this.height - sqr2.height) / 2;
        this.addChild(sqr2);

        let mat:Matrix = new Matrix();
        mat.createGradientBox(100, 125);
        
        let triangle:Sprite = new Sprite();
        triangle.graphics.lineStyle(3, 0x00D9D9);
        triangle.graphics.beginFill(0xA300D9);
        triangle.graphics.beginGradientFill(GradientType.RADIAL, [0xA300D9, 0xFFBFFF], [1, 1], [0, 255], mat);
        triangle.graphics.moveTo(50, 0);
        triangle.graphics.lineTo(100, 100);
        triangle.graphics.lineTo(0, 100);
        triangle.graphics.lineTo(50, 0);
        triangle.filters = [new BlurFilter(5, 5)];
        triangle.x = sqr2.x + sqr2.width + 40;
        triangle.y = (this.height - triangle.height) / 2;
        this.addChild(triangle);
    }
}