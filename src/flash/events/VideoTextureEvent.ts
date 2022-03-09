import { AEvent } from "./AEvent.js";
export class VideoTextureEvent extends AEvent
{
   public static RENDER_STATE:string = "renderState";
      
   private m_status:string;
   
   private m_colorSpace:string;
   
   public codecInfo:string;
   
   constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, status:string = null, colorSpace:string = null)
   {
      super(type,bubbles,cancelable);
      this.m_status = status;
      this.m_colorSpace = colorSpace;
   }
   public get status() : string
   {
      return this.m_status;
   }
   
   public get colorSpace() : string
   {
      return this.m_colorSpace;
   }
}