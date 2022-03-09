import { EventDispatcher } from "../events/EventDispatcher.js";
import { Timer } from "../utils/Timer.js";
import { SecurityErrorEvent } from "../events/SecurityErrorEvent.js";
import { TimerEvent } from "../events/TimerEvent.js";
import { ByteArray } from "../utils/ByteArray.js";

export class Socket extends EventDispatcher
{
	private websocket:WebSocket;
	constructor (host:string = null, port:number = 0)
	{
		super();
		this.websocket = new WebSocket("ws://"+host+":"+port);
		//websocket.onclose
	}
	/*
	public function get bytesAvailable () : uint{
		
	}
	
	public function get bytesPending () : uint;
	public function get connected () : Boolean;
	public function get endian () : String;
	public function set endian (type:string) : void;
	public function get objectEncoding () : uint;
	public function set objectEncoding (version:uint) : void;
	public function get timeout () : uint;
	public function set timeout (value:uint) : void;
	public function close () : void;
	public function connect (host:string, port:number) : void;
	public function flush () : void;
	public function readBoolean () : Boolean;
	public function readByte () : int;
	public function readBytes (bytes:ByteArray, offset:uint=0, length:uint=0) : void;
	public function readDouble () : Number;
	public function readFloat () : Number;
	public function readInt () : int;
	public function readMultiByte (length:uint, charSet:string) : String;
	public function readObject () : *;
	public function readShort () : int;
	public function readUnsignedByte () : uint;
	public function readUnsignedInt () : uint;
	public function readUnsignedShort () : uint;
	public function readUTF () : String;
	public function readUTFBytes (length:uint) : String;
	public function writeBoolean (value:Boolean) : void;
	public function writeByte (value:number) : void;
	public function writeBytes (bytes:ByteArray, offset:uint=0, length:uint=0) : void;
	public function writeDouble (value:number) : void;
	public function writeFloat (value:number) : void;
	public function writeInt (value:number) : void;
	public function writeMultiByte (value:string, charSet:string) : void;
	public function writeObject (object:any) : void;
	public function writeShort (value:number) : void;
	public function writeUnsignedInt (value:uint) : void;
	public function writeUTF (value:string) : void;
	public function writeUTFBytes (value:string) : void;*/
}