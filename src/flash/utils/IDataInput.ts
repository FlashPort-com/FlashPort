import { ByteArray } from "./ByteArray.js";
export interface IDataInput
{
	
	bytesAvailable : number;

	
	endian : string;
	/*function set endian (type:string) : void;*/

	
	objectEncoding : number;
	/*function set objectEncoding (version:uint) : void;*/

	
	readBoolean () : boolean;

	
	readByte () : number;

	
	readBytes (bytes:ByteArray, offset?:number, length?:number) : void;

	
	readDouble () : number;

	
	readFloat () : number;

	
	readInt () : number;

	
	readMultiByte (length:number, charSet:string) : string;

	
	readObject () : any;

	readShort () : number;

	readUnsignedByte () : number;

	
	readUnsignedInt () : number;

	
	readUnsignedShort () : number;

	
	readUTF () : string;

	
	readUTFBytes (length:number) : string;
}