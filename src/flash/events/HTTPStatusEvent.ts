import { AEvent } from "./AEvent";

export class HTTPStatusEvent extends AEvent
{
   
   public static HTTP_STATUS:string = "httpStatus";
   
   public static HTTP_RESPONSE_STATUS:string = "httpResponseStatus";
      
   private m_status:number;
   
   private m_responseHeaders:any[];
   
   private m_responseUrl:string;
   
   private m_redirected:boolean;
   
   constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, status:number = 0, redirected:boolean = false){
      super(type,bubbles,cancelable);
      this.m_status = status;
      this.m_redirected = redirected;
      this.m_responseHeaders = [];
   }
   
   /*override*/ public clone() : AEvent
   {
      var result:HTTPStatusEvent = new HTTPStatusEvent(this.type,this.bubbles,this.cancelable,this.status,this.redirected);
      result.responseURL = this.responseURL;
      result.responseHeaders = this.responseHeaders;
      return result;
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("HTTPStatusEvent","type","bubbles","cancelable","eventPhase","status","redirected","responseURL");
   }
   
   public get status() : number
   {
      return this.m_status;
   }
   
   public get responseURL() : string
   {
      return this.m_responseUrl;
   }
   
   public set responseURL(value:string)
   {
      this.m_responseUrl = value;
   }
   
   public get responseHeaders() : any[]
   {
      return this.m_responseHeaders;
   }
   
   public set responseHeaders(value:any[])
   {
      this.m_responseHeaders = value;
   }
   
   public get redirected() : boolean
   {
      return this.m_redirected;
   }
   
   public set redirected(value:boolean)
   {
      this.m_redirected = value;
   }
}