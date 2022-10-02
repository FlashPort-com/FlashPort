import { URLRequest } from "./URLRequest";

export function navigateToURL(request:URLRequest, win:string=null):void
{
	window.open(request.url, win);
}