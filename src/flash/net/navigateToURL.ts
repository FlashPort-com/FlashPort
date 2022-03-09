import { URLRequest } from "./URLRequest.js";

export function navigateToURL(request:URLRequest, win:string=null):void
{
	window.open(request.url, win);
}