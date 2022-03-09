export class Error extends Object
{
   public static len:number = 1;
   
   public message:Object;  
   public name:string;
   
   private _errorID:number;
   
   constructor(message:any = "", id:any = 0)
   {
      super();
      this.message = message;
      this._errorID = id;
      this.name = "";
   }
   
   public static getErrorMessage(param1:number) : string{return null}
   
   public static throwError(type:Object, index:number, ... rest) : any
   {
      var i:any = 0;
      var f:any = function(match:any, pos:any, string:any):any
      {
         var arg_num:any = -1;
         switch(match.charAt(1))
         {
            case "1":
               break;
            case "2":
               arg_num = 1;
               break;
            case "3":
               arg_num = 2;
               break;
            case "4":
               arg_num = 3;
               break;
            case "5":
               arg_num = 4;
               break;
            case "6":
            case 6:
               arg_num = 5;
               break;
            default:
               arg_num = 0;
         }
         if(arg_num > -1 && rest.length > arg_num)
         {
            return rest[arg_num];
         }
         return "";
      };
      throw new Error(Error.getErrorMessage(index).replace(new RegExp("%[0-9]","g"),f),index);
   }
   
   public getStackTrace() : string{return null}
   
   public get errorID() : number
   {
      return this._errorID;
   }
}