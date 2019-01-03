/// <reference path="../../lib/neo-ts.d.ts"/>
namespace WebBrowser
{
    export class WebHelper
    {        
        public static getScriptBuilderCreate(type:Nep5Type, ..._params:any[]):ThinNeo.ScriptBuilder{
            var sb = new ThinNeo.ScriptBuilder();
            switch(type){
                case Nep5Type.Neo:
                    sb.EmitPushString(_params[0]); 
                    sb.EmitPushString(_params[1]); 
                    sb.EmitPushString(_params[2]);
                    sb.EmitPushString(_params[3]); 
                    sb.EmitPushString(_params[4]);   
                    sb.EmitPushNumber(new Neo.BigInteger(_params[5]));
                    sb.EmitPushBytes(_params[6]);
                    sb.EmitPushBytes(_params[7]);
                    var contract = new Uint8Array(_params[8]);
                    sb.EmitPushBytes(contract);
                    sb.EmitSysCall("Neo.Contract.Create");
                break;
                case Nep5Type.Zoro:
                    sb.EmitPushString(_params[0]); 
                    sb.EmitPushString(_params[1]); 
                    sb.EmitPushString(_params[2]);
                    sb.EmitPushString(_params[3]); 
                    sb.EmitPushString(_params[4]);   
                    sb.EmitPushNumber(new Neo.BigInteger(_params[5]));
                    sb.EmitPushBytes(_params[6]);
                    sb.EmitPushBytes(_params[7]);
                    var contract = new Uint8Array(_params[8]);
                    sb.EmitPushBytes(contract);
                    sb.EmitSysCall("Zoro.Contract.Create");
                break;
                case Nep5Type.NativeNep5:               
                    var amount = _params[2] * Math.pow(10, _params[1]);                        
                    var script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(_params[0]);
                    var scripthash = Neo.Cryptography.Sha256.computeHash(script);
                    scripthash = Neo.Cryptography.RIPEMD160.computeHash(scripthash);
                    var ss = new Neo.Uint160(scripthash).toString();
                    sb.EmitPushString(ss);
                    sb.EmitPushBytes(_params[0]);                   
                    sb.EmitPushNumber(new Neo.BigInteger(_params[1]));                   
                    sb.EmitPushNumber(new Neo.BigInteger(amount));
                    sb.EmitPushString(_params[3]);
                    sb.EmitPushString(_params[4]);
                    sb.EmitSysCall("Zoro.NativeNEP5.Create");
                break;
            }
            return sb;
        }       
    }

    export enum Nep5Type{
        Neo,Zoro,NativeNep5
    }
}