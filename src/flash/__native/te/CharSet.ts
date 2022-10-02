import { Rectangle } from "../../geom/Rectangle";
import { UVTexture } from "./UVTexture";
import { Char } from "./Char";
import { RectanglePacker } from "../../../org/villekoskela/utils/RectanglePacker";

export class CharSet 
{
    private dirty:Boolean = false;//脏了，重新渲染
    private newChars:Array<any> = [];
    public image:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private chars:object = {};
    private tsizew:number = 2048;
    private tsizeh:number = 2048;
    private rp:RectanglePacker;
    private helpRect:Rectangle = new Rectangle;
    
    public add(c:Char):void{
        let t:UVTexture = this.getTexture(c)
        if (t==null){//找不到材质，创建新材质
            t = new UVTexture;
            t.font = c.font;
            t.fontSize = c.size;
            t.v = c.v;
            this.newChars.push(t);
            this.dirty = true;
            this.chars[c.v +c.font] = t;
        }
        c.texture = t;
    }
    
    public getTexture(c:Char):UVTexture{
        let t:UVTexture = this.chars[c.v +c.font]
        if (t && t.fontSize >= c.size){
            return t;
        }
        return null;
    }
    
    public rebuild():void{
        //只保留透明通道，其它通道设置值为255
        if (this.dirty){
            if (this.image == null){
                this.image = document.createElement("canvas") as HTMLCanvasElement;
                this.ctx = this.image.getContext("2d") as CanvasRenderingContext2D;
                this.image.width = this.tsizew;
                this.image.height = this.tsizeh;
                this.ctx.fillStyle = "rgba(255, 255, 255, 1)"// "#ffffff"/*fillStyle*/;
                this.ctx.textBaseline = "top";
                
                this.rp = new RectanglePacker(this.tsizew, this.tsizeh,1);
            }
            
            let befnum:number = this.rp.rectangleCount;
            let len:number = this.newChars.length;
            let t:UVTexture;

            for (let i:number = 0; i < len;i++ )
            {
                t = this.newChars[i];
                this.ctx.font = t.fontSize+"px " +t.font;
                let measure:TextMetrics = this.ctx.measureText(t.v);
                t.width = measure.width;
                t.height = t.fontSize;
                t.xadvance = t.width;
                this.rp.insertRectangle(t.width, t.height, befnum+i);//插入字符
            }

            this.rp.packRectangles(false);

            for (let i:number = 0; i < len;i++ ){
                t = this.newChars[i];
                this.rp.getRectangle(befnum + len-i-1, this.helpRect);
                this.ctx.font = t.fontSize +"px " + t.font;
                this.ctx.fillText(t.v, this.helpRect.x, this.helpRect.y);
                t.u0 = this.helpRect.x;
                t.v0 = this.helpRect.y;
                t.u1 = this.helpRect.x + this.helpRect.width;
                t.v1 = this.helpRect.y + this.helpRect.height;
            }
            
            //宽高改变
            /*if (false){
                if (image._texture){
                    image._texture.dirty = true;
                }
            }*/
            
            //this.image.dirty = true;
            this.newChars = [];
            this.dirty = false;
        }
    }
}