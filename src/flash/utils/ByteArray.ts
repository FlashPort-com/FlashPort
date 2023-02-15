import { IDataInput } from "./IDataInput";
import { IDataOutput } from "./IDataOutput";
import { Endian } from "./Endian";

export class ByteArray implements IDataInput, IDataOutput
{
	private static _defaultObjectEncoding:number;
	public dataView:DataView;
	private _endian:string = Endian.BIG_ENDIAN;
	private isLittleEndian:boolean = false;
	private _position:number = 0;
	private _length:number = 0;
	constructor(){
		this.dataView = new DataView(new ArrayBuffer(0));
	}
	
	public static get defaultObjectEncoding():number  { return 0 }
	
	public static set defaultObjectEncoding(param1:number)  {/**/ }
	
	public readBytes(b:IDataInput & IDataOutput, offset:number = 0, length:number = 0):void  {
		b.position = offset;
		b.writeBytes(this, this.position, length);
	}
	
	public writeBytes(b:IDataInput, offset:number = 0, length:number = 0):void  {
		if (length===0) {
			length = b.length - offset;
		}
		this.beforWrite(length);
		b.position = offset;
		for (var i:number = 0; i < length;i++ ) {
			this.writeByte(b.readByte());
		}
	}
	
	public writeBoolean(v:boolean):void  {
		this.beforWrite(1);
		this.dataView.setInt8(this._position, v?1:0);
		this._position++;
	}
	
	public writeByte(v:number):void  {
		this.beforWrite(1);
		this.dataView.setInt8(this._position, v);
		this._position++;
	}
	
	public writeShort(v:number):void  {
		this.beforWrite(2);
		this.dataView.setInt16(this._position, v, this.isLittleEndian);
		this._position += 2;
	}
	
	public writeInt(v:number):void  {
		this.beforWrite(4);
		this.dataView.setInt32(this._position, v, this.isLittleEndian);
		this._position += 4;
	}
	
	public writeUnsignedInt(v:number):void  {
		this.beforWrite(4);
		this.dataView.setUint32(this._position, v, this.isLittleEndian);
		this._position += 4;
	}
	
	public writeFloat(v:number):void  {
		this.beforWrite(4);
		this.dataView.setFloat32(this._position, v, this.isLittleEndian);
		this._position += 4;
	}
	
	public writeDouble(v:number):void  {
		this.beforWrite(8);
		this.dataView.setFloat64(this._position, v, this.isLittleEndian);
		this._position += 8;
	}
	
	public writeMultiByte(str:string, charSet:string):void  {
		try{
			var encoder:TextEncoder = new TextEncoder();
			var u8:Uint8Array = encoder.encode(str);
		}catch(err){
			u8 = new Uint8Array(str.split('').map(function(c:string):number { return c.charCodeAt(0); } ));
		}
		for (var i:number = 0; i < u8.length;i++ ) {
			this.writeByte(u8[i]);
		}
	}
	
	public writeUTF(v:string):void  {
		this._position += 2;
		var start:number = this._position;
		this.writeUTFBytes(v);
		var end:number = this._position;
		this._position = start - 2;
		this.writeShort(start - end);
		this._position = end;
	}
	
	public writeUTFBytes(v:string):void
	{
		this.writeMultiByte(v, "utf-8");
	}
	
	public readBoolean():boolean  {
		var v:boolean = this.dataView.getInt8(this._position) != 0;
		this._position++;
		return v;
	}
	
	public readByte():number  { 
		var v:number = this.dataView.getInt8(this._position);
		this._position++;
		return v;
	}
	
	public readUnsignedByte():number  { 
		var v:number = this.dataView.getUint8(this._position);
		this._position++;
		return v;
	}
	
	public readShort():number  { 
		var v:number = this.dataView.getInt16(this._position,this.isLittleEndian);
		this._position+=2;
		return v;
	}
	
	public readUnsignedShort():number  { 
		var v:number = this.dataView.getUint16(this._position,this.isLittleEndian);
		this._position+=2;
		return v;
	}
	
	public readInt():number  { 
		var v:number = this.dataView.getInt32(this._position,this.isLittleEndian);
		this._position+=4;
		return v;
	}
	
	public readUnsignedInt():number  { 
		var v:number = this.dataView.getUint32(this._position,this.isLittleEndian);
		this._position+=4;
		return v;
	}
	
	public readFloat():number  { 
		var v:number = this.dataView.getFloat32(this._position,this.isLittleEndian);
		this._position+=4;
		return v;
	}
	
	public readDouble():number  { 
		var v:number = this.dataView.getFloat64(this._position,this.isLittleEndian);
		this._position+=8;
		return v;
	}
	
	public readMultiByte(length:number, charSet:string):string  {
		try{
			var u8:Uint8Array = new Uint8Array(length);
			u8.set(new Uint8Array(ByteArray._slice(this.dataView.buffer,this._position, this._position + length)));
			var decoder:TextDecoder = new TextDecoder(charSet);
			var str:string = decoder.decode(u8);
		}catch (err){
			//str = String.fromCharCode.apply(null, u8);
			str = "";
			for (var i:number = 0; i < length;i++ ){
				str += String.fromCharCode(this.dataView.getUint8(this._position + i));
			}
		}
		this._position += length;
		return str;
	}
	
	public readUTF():string  { 
		return this.readUTFBytes(this.readUnsignedShort());
	}
	
	public readUTFBytes(length:number):string  { 
		return this.readMultiByte(length, "utf-8");
	}
	
	public get length():number  { 
		return this._length;//dataView.byteLength;
	}
	
	public set length(v:number)  {
		this._length = v;
		var u8:Uint8Array = new Uint8Array(v);
		u8.set(new Uint8Array(this.dataView.buffer.byteLength > v?ByteArray._slice(this.dataView.buffer,0, v):this.dataView.buffer));
		this.dataView = new DataView(u8.buffer);
	}
	
	private beforWrite(len:number):void {
		if ((this._position+len) > this.length) {
			this.length = this._position + len;
		}
	}
	
	public writeObject(param1:any):void  {/**/ }
	
	public readObject():any  { return null }
	
	public deflate():void
	{
		this._compress("deflate");
	}
	
	private _compress(param1:string):void  {/**/ }
	
	public compress(algorithm:string = "zlib"):void
	{
		this._compress(algorithm);
	}
	
	public inflate():void
	{
		this._uncompress("deflate");
	}
	
	private _uncompress(param1:string):void  {/**/ }
	
	public uncompress(algorithm:string = "zlib"):void
	{
		this._uncompress(algorithm);
	}
	
	public toString():string
	{
		return this._toString();
	}
	
	private _toString():string  { 
		this.position = 0;
		return this.readUTFBytes(this.length);
	}
	
	public get bytesAvailable():number  { 
		return this.length - this.position; 
	}
	
	public get position():number  { return this._position }
	
	public set position(p:number)  {
		this._position = p;
	}
	
	public get objectEncoding():number  { return 0 }
	
	public set objectEncoding(param1:number)  {/**/ }
	
	public get endian():string  { return this._endian; }
	
	public set endian(v:string)  {
		this._endian = v;
		this.isLittleEndian = v === Endian.LITTLE_ENDIAN;
	}
	
	public clear():void  {
		this.position = 0;
		this.length = 0;
	}
	
	public atomicCompareAndSwapIntAt(param1:number, param2:number, param3:number):number  { return 0 }
	
	public atomicCompareAndSwapLength(param1:number, param2:number):number  { return 0 }
	
	public get shareable():boolean  { return false }
	
	public set shareable(param1:boolean)  {/**/ }
	
	//http://stackoverflow.com/questions/21440050/arraybuffer-prototype-slice-shim-for-ie
	private static _slice(buff:ArrayBuffer, begin:number, end:number):ArrayBuffer{
		try{
			var newbuffer:ArrayBuffer = buff.slice(begin, end);
		}catch (err){
			if (end===0){
				end = buff.byteLength;
			}
			newbuffer = new ArrayBuffer(end - begin);
			var rb:Uint8Array = new Uint8Array(newbuffer);
			var sb:Uint8Array = new Uint8Array(buff, begin, end - begin);
			rb.set(sb);
		}
		return newbuffer;
	}
}