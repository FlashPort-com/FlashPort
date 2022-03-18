import { Sprite } from "../src/flash/display/Sprite.js";
import { FlashPort } from "../src/FlashPort.js";
import { StageAlign } from "../src/flash/display/StageAlign.js";
import { StageScaleMode } from "../src/flash/display/StageScaleMode.js";
import { AEvent } from "../src/flash/events/AEvent.js";
import { Matrix } from "../src/flash/geom/Matrix.js";
import { Shape } from "../src/flash/display/Shape.js";
import { GradientType } from "../src/flash/display/GradientType.js";
import { DropShadowFilter } from "../src/flash/filters/DropShadowFilter.js";
import { TextField } from "../src/flash/text/TextField.js";
import { GlowFilter } from "../src/flash/filters/GlowFilter.js";
import { TextFormat } from "../src/flash/text/TextFormat.js";
import { MouseEvent } from "../src/flash/events/MouseEvent.js";
import { AssetLoader } from "../src/flash/__native/AssetLoader.js";
import { Bitmap } from "../src/flash/display/Bitmap.js";
import { Stats } from "../src/flashport/Stats.js";

/**
 * ...
 * @author Kenny Lerma
 */
export class Main extends Sprite
{
    private boxes:Array<Sprite> = [];
	private circle:Sprite;
	private circText:TextField;
    
    constructor()
	{
        super();

        //FlashPort.autoSize = true;
        //FlashPort.debug = true;

        FlashPort.stageWidth = 600;
        FlashPort.stageHeight = 360;

        this.stage.canvas.style.backgroundColor = "#9abdf5";
        this.stage.align = StageAlign.TOP_LEFT;
        this.stage.scaleMode = StageScaleMode.NO_SCALE;

        this.addChild(new Stats());
        
        var mat:Matrix = new Matrix();
        
        for (var i:number = 0; i < 100; i++) 
        {
            var	degrees:number = 0;
            var radians:number = Math.PI / 180 * degrees;
            mat.createGradientBox(300, 300, radians, -100, -100);
            
            var spinBox:Sprite = new Sprite();
            spinBox.graphics.lineStyle(10);
            spinBox.graphics.lineGradientStyle(GradientType.LINEAR, [0xFF8000, 0xFFFF00], [1, 1], [0, 255], mat);
            spinBox.graphics.beginGradientFill(GradientType.LINEAR, [0x00000, 0xFF0000], [1, 1], [0, 255], mat);
            spinBox.graphics.drawRoundRect( -100, -100, 200, 200, 20, 20);
            spinBox.filters = [new DropShadowFilter(25, 45, 0, .55)];
            spinBox.x = Math.random() * this.stage.stageWidth;
            spinBox.y = Math.random() * this.stage.stageHeight;
            //spinBox.scaleX = spinBox.scaleY = .40;
            
            mat.createGradientBox(40*2,40*2,0,-40,-40);
            var circ:Shape = new Shape();
            circ.name = "circ" + i;
            circ.graphics.lineStyle(5, 0xFFFFFF);
            circ.graphics.beginGradientFill(GradientType.RADIAL, [0xFFFFFF, 0x000000], [.90, .90], [0, 255], mat);
            circ.graphics.drawCircle(0, 0, 40);
            circ.filters = [new DropShadowFilter(8, 45, 0, .75)];
            circ.x = 50;
            circ.y = 50;
            //circ.cacheAsBitmap = true;
            spinBox.addChild(circ);
            spinBox.buttonMode = true;
            spinBox.cacheAsBitmap = true;
            this.addChild(spinBox);
            this.boxes.push(spinBox);
            spinBox.addEventListener(MouseEvent.CLICK, this.onBoxClicked);
            
            
        }
        
        mat.createGradientBox(200*2,200*2,0,-200,-200);
        this.circle = new Sprite();
        this.circle.graphics.lineStyle(10, 0xFFFFFF);
        this.circle.graphics.beginGradientFill(GradientType.RADIAL, [0xFF0000, 0x000000], [.75, .75], [0, 255], mat);
        this.circle.graphics.drawCircle(0, 0, 200);
        this.circle.x = this.circle.y = 440;
        this.circle.filters = [new GlowFilter(0xEC7600, 1, 10, 10, 5)];
        //circle.filters = [new DropShadowFilter(15, 45, 0, .75)];
        
        this.circText = new TextField();
        this.circText.defaultTextFormat = new TextFormat("Arial", 60, 0xFFFFFF);
        this.circText.text = "Hello World";
        this.circText.width = this.circText.textWidth;
        this.circText.height = this.circText.textHeight;
        //circText.background = true; 
        //circText.border = true;
        //circText.filters = [new DropShadowFilter(15, 45, 0, 1)];
        //this.circText.filters = [new GlowFilter(0x000000, 1, 5, 5, 4), new DropShadowFilter(10, 45, 0, .25)];
        this.circText.x = -this.circText.textWidth / 2;
        this.circText.y = -this.circText.textHeight / 2;
        //circText.cacheAsBitmap = true;
        this.circle.addChild(this.circText);
        
        this.circle.cacheAsBitmap = true;
        this.addChild(this.circle);

        var ld:AssetLoader = new AssetLoader(["assets/FlashPort-128.png"]);
        ld.addEventListener(AEvent.COMPLETE, this.handleAssetsLoaded);
        ld.load();
        
        this.addEventListener(AEvent.ENTER_FRAME, this.onEnterFrame);
    }

    private handleAssetsLoaded = (e:AEvent) =>
    {
        //console.log("Assets Loaded", FlashPort.images);
        var bm:Bitmap = new Bitmap(FlashPort.images['FlashPort-128']);
        bm.x = bm.y = 25;
        this.addChild(bm);
    }
    
    private onBoxClicked = (e:MouseEvent):void =>
    {
        console.log("Box Clicked: " + e.currentTarget['name']);
    }
    
    private onEnterFrame = (e:AEvent):void =>
    {
        var i:number = 0;
        for(let box of this.boxes) 
        {
            i++;
            (i % 2 == 0) ? box.rotation++ : box.rotation--;
        }
        
        this.circle.rotation++;
    }
}

window['app'] = new Main();  // lets kick this thing off.