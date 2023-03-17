import { BlurFilter, DropShadowFilter } from "./flash";
import { Sprite } from "./flash/display/Sprite";
import { AEvent } from "./flash/events/AEvent";
import { Matrix } from "./flash/geom/Matrix";
import { TextField } from "./flash/text/TextField";
import { TextFormat } from "./flash/text/TextFormat";


export class Header extends Sprite
{
    private mat:Matrix;
    private degrees:number = 0;
   
    
    constructor()
    {
        super();

        let tf:TextFormat = new TextFormat("Arial", 30, 0xFFFFFF, true);
        let title:TextField = new TextField();
        title.defaultTextFormat = tf;
        title.text = "FlashPort";
        title.x = 75;
        title.y = 15;
        title.filters = [new DropShadowFilter()];

        this.addChild(title);

        tf = new TextFormat("Arial", 13, 0x464646, true);
        let desc:TextField = new TextField();
        desc.defaultTextFormat = tf;
        desc.text = "2D graphics engine for the web.";
        desc.x = 75;
        desc.y = 60;
        this.addChild(desc);


        

        this.update();

        this.addEventListener(AEvent.ENTER_FRAME, this.update);
    }

    private update = (e:AEvent = null):void =>
    {
        let radians:number = Math.PI / 180 * this.degrees;
        let lineMat:Matrix = new Matrix();
        lineMat.createGradientBox(this.stage.stageWidth, 100, Math.PI / 180 * 90)
        this.mat = new Matrix();
        this.mat.createGradientBox(this.stage.stageWidth, 100, radians);
        this.graphics.clear();
        this.graphics.lineStyle(5);
        this.graphics.lineGradientStyle("linear", [0x464646, 0xFFFFFF], [1,1], [0, 255], lineMat);
        this.graphics.beginGradientFill("linear", [0x00A3D9, 0xFFFFFF, 0x00A3D9], [1,1,1], [0, 127, 255], this.mat);
        this.graphics.drawRoundRectComplex(1, 0, this.stage.stageWidth - 2, 100, 0, 0, 10, 10);

        this.degrees += .3;
        if (this.degrees > 360) this.degrees = 0;
    }

}