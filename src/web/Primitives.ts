import { GradientType } from "../flash/display/GradientType.js";
import { Sprite } from "../flash/display/Sprite";
import { AEvent } from "../flash/events/AEvent.js";
import { DropShadowFilter } from "../flash/filters/DropShadowFilter.js";
import { GlowFilter } from "../flash/filters/GlowFilter.js";
import { Matrix } from "../flash/geom/Matrix.js";
import { TextField } from "../flash/text/TextField.js";
import { TextFormat } from "../flash/text/TextFormat.js";
import { Resizable } from "./utils/Resizable.js";


export class Primitives extends Resizable
{

    constructor()
    {
        super("Fill, Strokes, and Gradients");

        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 150, 10, 10, 10, 10);

        let sqr:Sprite = new Sprite();
        sqr.graphics.beginFill(0xFF0000);
        sqr.graphics.drawRect(0, 0, 100, 100);
        sqr.x = 40;
        sqr.y = (this.height - sqr.height) / 2;
        sqr.filters = [new DropShadowFilter()];
        this.addChild(sqr);

        let circle:Sprite = new Sprite();
        circle.graphics.beginFill(0x38A4DB);
        circle.graphics.drawCircle(50, 50, 50);
        circle.x = sqr.x + sqr.width + 40;
        circle.y = (this.height - circle.height) / 2;
        this.addChild(circle);

        let roundRect:Sprite = new Sprite();
        roundRect.graphics.beginFill(0x00FF00);
        roundRect.graphics.drawRoundRect(0, 0, 100, 100, 10, 10);
        roundRect.x = circle.x + circle.width + 40;
        roundRect.y = (this.height - roundRect.height) / 2;
        this.addChild(roundRect);

        
        let roundRectComplex:Sprite = new Sprite();
        roundRectComplex.graphics.beginFill(0x0000FF);
        roundRectComplex.graphics.drawRoundRectComplex(0, 0, 100, 100, 25, 25, 0, 0);
        roundRectComplex.x = roundRect.x + roundRect.width + 40;
        roundRectComplex.y = (this.height - roundRectComplex.height) / 2;
        this.addChild(roundRectComplex);

        let elipse:Sprite = new Sprite();
        elipse.graphics.beginFill(0x464646);
        elipse.graphics.drawEllipse(10, 0, 80, 100);
        elipse.x = roundRectComplex.x + roundRectComplex.width + 40;
        elipse.y = (this.height - elipse.height) / 2;
        this.addChild(elipse);
        
        let star:Sprite = new Sprite();
        star.graphics.lineStyle(2, 0x000000);
        star.graphics.beginFill(0xFFFF4D);
        star.graphics.lineTo(50, 20);
        star.graphics.lineTo(100, 0);
        star.graphics.lineTo(80, 50);
        star.graphics.lineTo(100, 100);
        star.graphics.lineTo(50, 80);
        star.graphics.lineTo(0, 100);
        star.graphics.lineTo(20, 50);
        star.graphics.lineTo(0, 0);
        star.x = elipse.x + elipse.width + 40;
        star.y = (this.height - star.height) / 2;
        star.filters = [new GlowFilter()];
        this.addChild(star);

        let mat:Matrix = new Matrix();
        mat.createGradientBox(100, 125);
        let cylinder:Sprite = new Sprite();
        cylinder.graphics.lineStyle(2, 0x000000);
        cylinder.graphics.beginGradientFill(GradientType.LINEAR, [0xFF7F00, 0xFF0000], [1, 1], [0, 255], mat);
        cylinder.graphics.drawRoundRect(0, 0, 100, 100, 45);
        cylinder.x = star.x + star.width + 40;
        cylinder.y = (this.height - cylinder.height) / 2;
        this.addChild(cylinder);

        let triangle:Sprite = new Sprite();
        triangle.graphics.lineStyle(3, 0x00D9D9);
        triangle.graphics.beginFill(0xA300D9);
        triangle.graphics.beginGradientFill(GradientType.RADIAL, [0xA300D9, 0xFFBFFF], [1, 1], [0, 255], mat);
        triangle.graphics.moveTo(50, 0);
        triangle.graphics.lineTo(100, 100);
        triangle.graphics.lineTo(0, 100);
        triangle.graphics.lineTo(50, 0);
        triangle.x = cylinder.x + cylinder.width + 40;
        triangle.y = (this.height - triangle.height) / 2;
        this.addChild(triangle);
    }
}