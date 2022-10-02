export class URLRequestHeader extends Object
{
      
   public name:string;
   
   public value:string;
   
   constructor(name:string = "", value:string = ""){
      super();
      this.name = name;
      this.value = value;
   }
}