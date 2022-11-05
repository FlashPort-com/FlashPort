import { DisplayObject } from "../flash/display/DisplayObject.js";
import { GradientType } from "../flash/display/GradientType.js";
import { Sprite } from "../flash/display/Sprite.js";
import { MouseEvent } from "../flash/events/MouseEvent.js";
import { Matrix } from "../flash/geom/Matrix.js";
import { Resizable } from "./utils/Resizable.js";

export class AvailableEvents extends Resizable
{
    constructor()
    {
        super("Mouse Events");

        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 150, 10, 10, 10, 10);

        let sqr:Sprite = new Sprite();
        sqr.graphics.beginFill(0xFF0000);
        sqr.graphics.drawRect(-50, -50, 100, 100);
        sqr.x =90;
        sqr.y = 75;
        sqr.buttonMode = true;
        sqr.addEventListener(MouseEvent.MOUSE_OVER, this.handleMouseOver);
        this.addChild(sqr);

        let mat:Matrix = new Matrix();
        mat.createGradientBox(100, 125, 0, -50, -50);
        let triangle:Sprite = new Sprite();
        triangle.graphics.lineStyle(3, 0x00D9D9);
        triangle.graphics.beginFill(0xA300D9);
        triangle.graphics.beginGradientFill(GradientType.RADIAL, [0xA300D9, 0xFFBFFF], [1, 1], [0, 255], mat);
        triangle.graphics.moveTo(0, -50);
        triangle.graphics.lineTo(50, 50);
        triangle.graphics.lineTo(-50, 50);
        triangle.graphics.lineTo(0, -50);
        triangle.x = sqr.x + sqr.width + 40;
        triangle.y = 75;
        this.addChild(triangle);
    }

    private handleMouseOver = (e:MouseEvent):void =>
    {
        var item:DisplayObject = e.currentTarget as DisplayObject;
        item.rotation += 15;
    }

}