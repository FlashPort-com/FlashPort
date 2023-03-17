import { Sprite } from "./flash/display/Sprite"
import { StageAlign } from "./flash/display/StageAlign";
import { StageScaleMode } from "./flash/display/StageScaleMode";
import { AEvent, MouseEvent } from "./flash/events";
import { Matrix } from "./flash/geom";
import { FPConfig } from "./FPConfig";
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import { CanvasKit } from "canvaskit-wasm";
import { Shape } from "./flash/display/Shape";
import { BlurFilter, DropShadowFilter, GlowFilter } from "./flash/filters";
import { TextField, TextFieldType } from "./flash/text";
import { AssetLoader } from "./flash/__native/AssetLoader";
import { Header } from "./Header";
import { TouchEvent } from "./flash/events";
import { Fire } from "./particles/Fire";
import { Bitmap } from "./flash";

export class Main extends Sprite
{
    private mat:Matrix;
    private box:Sprite;
    private circle:Sprite;
    private inc:number = 0;

    constructor()
    {
        FPConfig.autoSize = true;
        FPConfig.highDPI = false;
        
        super();

        this.stage.scaleMode = StageScaleMode.NO_SCALE;
        this.stage.align = StageAlign.TOP_LEFT;

        let assets:string[] = [
			"assets/fonts/Arial.ttf",
            "assets/FlashPortMan.png"
		];

		let ld:AssetLoader = new AssetLoader(assets);
		ld.addEventListener(AEvent.COMPLETE, this.onAssetsLoaded);
		ld.load();
		
		
	}

	private onAssetsLoaded = (e:AEvent):void =>
	{
		let deg:number = 0;
        let m:Matrix = new Matrix();
        m.createGradientBox(100, 100, Math.PI / 180 * deg, 0, 0);

        let test:Shape = new Shape();
        test.graphics.lineStyle(6, 0xFFFFFF);
        test.graphics.beginGradientFill("radial", [0x80BDE3, 0x000000], [1, 1], [1, 255], m);
        test.graphics.drawRoundRect(0, 0, 100, 100, 15);
        test.filters = [new GlowFilter(0xFF0000, 1, 20, 20, 20)];
        test.x = 400;
        test.y = 40;
        this.addChild(test);

        this.stage.align = StageAlign.TOP_LEFT;
        this.stage.scaleMode = StageScaleMode.NO_SCALE;
        this.stage.opaqueBackground = 0xD8ECF3;

        let degrees:number = 0;
        let sqrMat:Matrix = new Matrix();
        sqrMat.createGradientBox(200, 200, Math.PI / 180 * degrees, -100, -100);

        this.box = new Sprite();
        this.box.graphics.lineStyle(4, 0x80BDE3);
        this.box.graphics.beginGradientFill("linear", [0xFF7700, 0x000000], [1, 1], [1, 255], sqrMat);
        this.box.graphics.drawRect(-100, -100, 200, 200);
        this.box.x = this.box.y = 200;
        this.box.filters = [new DropShadowFilter(10, 45, 0x000000, 1, 6, 6)];
        //this.box.addEventListener(TouchEvent.TOUCH_END, this.handleTouch);
        this.box.addEventListener(MouseEvent.CLICK, this.handleTouch);
        this.addChild(this.box);

        this.circle = new Sprite();
        this.circle.graphics.lineStyle(6, 0x000000);
        this.circle.graphics.beginFill(0xFF0000);
        this.circle.graphics.drawCircle(0, 0, 100);
        this.circle.x  = this.circle.y = 600;
        this.circle.filters = [new BlurFilter(10, 10)];
        this.addChild(this.circle);


        let txt:TextField = new TextField();
        txt.text = "Hey there I'm a TextField!";
        txt.x = txt.y = 350;
        this.addChild(txt);

        let header:Header = new Header();
        this.addChild(header);

        /* let fire:Fire = new Fire();
        fire.x = this.stage.stageWidth / 2;
        fire.y = this.stage.stageHeight;
        this.addChild(fire); */

        let msk:Shape = new Shape();
        msk.graphics.beginFill(0xffffff, 0);
        msk.graphics.drawRect(0, 0, 500, 500);
        msk.x = msk.y = 500;
        //this.addChild(msk);
        //fire.mask = msk;

        let fpMan:Bitmap = new Bitmap(FPConfig.images['FlashPortMan']);
        fpMan.filters = [new DropShadowFilter(5, 45, 0x000000), new BlurFilter(5, 5)];
        fpMan.x = fpMan.y = 600;
        this.addChild(fpMan);


        let txtInput:TextField = new TextField();
        txtInput.type = TextFieldType.INPUT;
        txtInput.text = "HELLO THIS MY SUPER AWESOME SENTENCE";
        txtInput.width = txtInput.textWidth;
        txtInput.x = txtInput.y = 400;
        txtInput.scaleX = txtInput.scaleY = 1;
        this.addChild(txtInput);
        
        this.addEventListener(AEvent.ENTER_FRAME, this.onUpdate);
	}

    private handleTouch = (e:AEvent) =>
    {
        console.log("I've been touched!");
    }

    private onUpdate = (e:AEvent):void =>
    {
        //this.box.rotation += 3;
        //this.box.scaleX = this.box.scaleY = Math.sin(1 + this.inc);
        //this.inc += .05;
        //this.box.x += 1;
    }
}

CanvasKitInit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/'+file,
}).then((canvasKit:CanvasKit) => {
    FPConfig.canvasKit = canvasKit;
    new Main();
});
