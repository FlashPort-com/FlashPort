import { Bitmap } from "../flash/display/Bitmap.js";
import { Loader } from "../flash/display/Loader.js";
import { Sprite } from "../flash/display/Sprite";
import { AEvent } from "../flash/events";
import { DropShadowFilter } from "../flash/filters";
import { Matrix } from "../flash/geom/Matrix";
import { URLLoader } from "../flash/net/URLLoader.js";
import { URLRequest } from "../flash/net/URLRequest.js";
import { TextField, TextFormat } from "../flash/text";


export class Header extends Sprite
{
    private mat:Matrix;
    private degrees:number = 0;
    
    constructor()
    {
        super();
        
		var radians:number = Math.PI / 180 * this.degrees;
        this.mat = new Matrix();
        this.mat.createGradientBox(this.stage.stageWidth, 240, radians);
        this.graphics.beginGradientFill("linear", [0x00A3D9, 0xFFFFFF, 0x00A3D9], [1,1,1], [0, 127, 255], this.mat);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 240, 0, 0, 20, 20);

        let tf:TextFormat = new TextFormat("Arial", 30, 0xFFFFFF, true);
        let title:TextField = new TextField();
        title.defaultTextFormat = tf;
        title.text = "FlashPort";
        title.x = title.y = 15;
        //title.filters = [new DropShadowFilter()];
        this.addChild(title);

        var flashMan:Bitmap;
        let ld:Loader = new Loader();
        ld.contentLoaderInfo.addEventListener(AEvent.COMPLETE, (e:AEvent):void =>
        {
            flashMan = ld.contentLoaderInfo.content as Bitmap;
            flashMan.x = 30;
            flashMan.y = 60;
            this.addChild(flashMan);
        });
        ld.load(new URLRequest("assets/FlashPortMan-Med.png"));

        this.addEventListener(AEvent.ENTER_FRAME, this.update);
    }

    private update = (e:AEvent):void =>
    {
        let radians:number = Math.PI / 180 * this.degrees;
        this.mat = new Matrix();
        this.mat.createGradientBox(this.stage.stageWidth, 240, radians);
        this.graphics.clear();
        this.graphics.beginGradientFill("linear", [0x00A3D9, 0xFFFFFF, 0x00A3D9], [1,1,1], [0, 127, 255], this.mat);
        this.graphics.drawRoundRectComplex(0, 0, this.stage.stageWidth, 240, 0, 0, 20, 20);

        this.degrees += .5;
        if (this.degrees > 360) this.degrees = 0;
    }

}