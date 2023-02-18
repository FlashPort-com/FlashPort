import { Sprite } from "../flash/display/Sprite";
import { AEvent } from "../flash/events/AEvent";
import { TextField } from "../flash/text/TextField";
import { TextFieldAutoSize } from "../flash/text/TextFieldAutoSize";
import { TextFormat } from "../flash/text/TextFormat";
import { getTimer } from "../flash/utils/getTimer";
import { FPConfig } from "../FPConfig";

export class Stats extends Sprite
{
    public tf:TextField;
    public fpsCounter:number = 0;
    public fps:number = 0;
    public lastTime:number = -10000;
    constructor() 
    {
        super();

        this.addEventListener(AEvent.ENTER_FRAME, this.enterFrame);
        this.tf = new TextField();
        this.tf.mouseEnabled = this.tf.selectable = false;
        this.tf.defaultTextFormat = new TextFormat("Arial",20);
        this.addChild(this.tf);
        this.tf.autoSize = TextFieldAutoSize.LEFT;
        this.tf.height = 25;
    }

    private enterFrame = (e:Event):void =>
    {
        let time:number = getTimer();
        if (time-1000 > this.lastTime) {
            this.fps = this.fpsCounter;
            if (this.fps > 0) this.fps--;
            this.fpsCounter = 0;
            this.lastTime = time;
        }

        this.fpsCounter++;
        
        var text:string = "";
        text += "fps: " + this.fps + " / " ;
        if (this.stage != null) {
            text += this.stage.frameRate;
        }
        
        
        text += "\ndraws: " + FPConfig.drawCounter;
        if (FPConfig.batDrawCounter>0){
            text += "\nb-draws: " + FPConfig.batDrawCounter;
        }
        
        if(this.tf.text != text)
        {
            this.tf.text = text;
        
            this.graphics.clear();
            this.graphics.beginFill(0xffffff, .5);
            this.graphics.drawRect(0, 0, this.tf.textWidth + 2, this.tf.textHeight + 2);
        }
    }
    
}
