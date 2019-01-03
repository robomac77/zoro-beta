///<reference path="helper.ts"/>
namespace ThinNeo
{
    export enum ZoroTransactionType
    {
        /// <summary>
        /// 用于分配字节费的特殊交易
        /// </summary>
        MinerTransaction = 0x00,
        /// <summary>
        /// 用于分发资产的特殊交易
        /// </summary>
        IssueTransaction = 0x01,
        /// <summary>
        /// 用于分配小蚁币的特殊交易
        /// </summary>
        ClaimTransaction = 0x02,
        /// <summary>
        /// 用于报名成为记账候选人的特殊交易
        /// </summary>
        EnrollmentTransaction = 0x20,
        /// <summary>
        /// 用于资产登记的特殊交易
        /// </summary>
        RegisterTransaction = 0x40,
        /// <summary>
        /// 合约交易，这是最常用的一种交易
        /// </summary>
        ContractTransaction = 0x80,
        /// <summary>
        /// Publish scripts to the blockchain for being invoked later.
        /// </summary>
        PublishTransaction = 0xd0,
        InvocationTransaction = 0xd1
    }
    export enum ZoroTransactionAttributeUsage
    {
        /// <summary>
        /// 外部合同的散列值
        /// </summary>
        ContractHash = 0x00,

        /// <summary>
        /// 用于ECDH密钥交换的公钥，该公钥的第一个字节为0x02
        /// </summary>
        ECDH02 = 0x02,
        /// <summary>
        /// 用于ECDH密钥交换的公钥，该公钥的第一个字节为0x03
        /// </summary>
        ECDH03 = 0x03,

        /// <summary>
        /// 用于对交易进行额外的验证
        /// </summary>
        Script = 0x20,

        Vote = 0x30,

        DescriptionUrl = 0x81,
        Description = 0x90,

        Hash1 = 0xa1,
        Hash2 = 0xa2,
        Hash3 = 0xa3,
        Hash4 = 0xa4,
        Hash5 = 0xa5,
        Hash6 = 0xa6,
        Hash7 = 0xa7,
        Hash8 = 0xa8,
        Hash9 = 0xa9,
        Hash10 = 0xaa,
        Hash11 = 0xab,
        Hash12 = 0xac,
        Hash13 = 0xad,
        Hash14 = 0xae,
        Hash15 = 0xaf,

        /// <summary>
        /// 备注
        /// </summary>
        Remark = 0xf0,
        Remark1 = 0xf1,
        Remark2 = 0xf2,
        Remark3 = 0xf3,
        Remark4 = 0xf4,
        Remark5 = 0xf5,
        Remark6 = 0xf6,
        Remark7 = 0xf7,
        Remark8 = 0xf8,
        Remark9 = 0xf9,
        Remark10 = 0xfa,
        Remark11 = 0xfb,
        Remark12 = 0xfc,
        Remark13 = 0xfd,
        Remark14 = 0xfe,
        Remark15 = 0xff
    }
    export class ZoroAttribute
    {
        public usage: ZoroTransactionAttributeUsage;
        public data: Uint8Array;
    }

    export class ZoroWitness
    {
        public InvocationScript: Uint8Array;//设置参数脚本，通常是吧signdata push进去
        public VerificationScript: Uint8Array;//校验脚本，通常是 push 公钥, CheckSig 两条指令   验证的东西就是未签名的交易
        //这个就是地址的脚本
        public get Address(): string
        {
            var hash = ThinNeo.Helper.GetScriptHashFromScript(this.VerificationScript);
            return ThinNeo.Helper.GetAddressFromScriptHash(hash);
        }
    }

    export interface ZoroIExtData
    {
        Serialize(trans: ZoroTransaction, writer: Neo.IO.BinaryWriter): void;
        Deserialize(trans: ZoroTransaction, reader: Neo.IO.BinaryReader): void;
    }

    export class ZoroInvokeTransData implements ZoroIExtData
    {
        public script: Uint8Array;
        public gasLimit: Neo.Fixed8;
        public gasPrice:Neo.Fixed8;
        public ScriptHash:Neo.Uint160;
        public Serialize(trans: ZoroTransaction, writer: Neo.IO.BinaryWriter): void
        {
            writer.writeVarBytes(this.script.buffer);
            if (trans.version >= 1)
            {
                writer.writeUint64(this.gasLimit.getData());
            }
            if (trans.version >= 2)
            {
                writer.writeUint64(this.gasPrice.getData());
                writer.writeVarBytes(this.ScriptHash.toArray());
            }
        }
        public Deserialize(trans: ZoroTransaction, reader: Neo.IO.BinaryReader): void
        {
            var buf = reader.readVarBytes(10000000);
            this.script = new Uint8Array(buf, 0, buf.byteLength);
            if (trans.version >= 1)
            {
                this.gasLimit = new Neo.Fixed8(reader.readUint64());
            }
            if (trans.version >= 2)
            {
                this.gasPrice = new Neo.Fixed8(reader.readUint64());
                this.ScriptHash = new Neo.Uint160(reader.readVarBytes());
            }
        }

    }    
   
    export class ZoroTransaction
    {
        public type: ZoroTransactionType;
        public version: number;
        public attributes: ZoroAttribute[];
        public witnesses: ZoroWitness[];//见证人
        public SerializeUnsigned(writer: Neo.IO.BinaryWriter): void
        {
            if (this.type == ZoroTransactionType.ContractTransaction ||
                this.type == ZoroTransactionType.IssueTransaction)//每个交易类型有一些自己独特的处理
            {
                //ContractTransaction 就是最常见的转账交易
                //他没有自己的独特处理
            }
            else if (this.type == ZoroTransactionType.InvocationTransaction)
            {
                this.extdata.Serialize(this, writer);
            }
            else
            {
                throw new Error("未编写针对这个交易类型的代码");
            }
            //#region write attribute
            var countAttributes = this.attributes.length;
            writer.writeVarInt(countAttributes);
            for (var i = 0; i < countAttributes; i++)
            {
                var attributeData = this.attributes[i].data;
                var Usage = this.attributes[i].usage;
                writer.writeByte(Usage as number);
                if (Usage == ZoroTransactionAttributeUsage.ContractHash || Usage == ZoroTransactionAttributeUsage.Vote || (Usage >= ZoroTransactionAttributeUsage.Hash1 && Usage <= ZoroTransactionAttributeUsage.Hash15))
                {
                    //attributeData =new byte[32];
                    writer.write(attributeData.buffer, 0, 32);
                }
                else if (Usage == ZoroTransactionAttributeUsage.ECDH02 || Usage == ZoroTransactionAttributeUsage.ECDH03)
                {
                    //attributeData = new byte[33];
                    //attributeData[0] = (byte)Usage;
                    writer.write(attributeData.buffer, 1, 32);
                }
                else if (Usage == ZoroTransactionAttributeUsage.Script)
                {
                    //attributeData = new byte[20];

                    writer.write(attributeData.buffer, 0, 20);
                }
                else if (Usage == ZoroTransactionAttributeUsage.DescriptionUrl)
                {
                    //var len = (byte)ms.ReadByte();
                    //attributeData = new byte[len];
                    var len = attributeData.length;
                    writer.writeByte(len);
                    writer.write(attributeData.buffer, 0, len);
                }
                else if (Usage == ZoroTransactionAttributeUsage.Description || Usage >= ZoroTransactionAttributeUsage.Remark)
                {
                    //var len = (int)readVarInt(ms, 65535);
                    //attributeData = new byte[len];
                    var len = attributeData.length;
                    writer.writeVarInt(len);
                    writer.write(attributeData.buffer, 0, len);
                }
                else
                    throw new Error();
            }
            //#endregion           
        }
        public Serialize(writer: Neo.IO.BinaryWriter): void
        {
            this.SerializeUnsigned(writer);

            var witnesscount = this.witnesses.length;
            writer.writeVarInt(witnesscount);
            for (var i = 0; i < witnesscount; i++)
            {
                var _witness = this.witnesses[i];
                writer.writeVarBytes(_witness.InvocationScript.buffer);
                writer.writeVarBytes(_witness.VerificationScript.buffer);
            }
        }
        public extdata: ZoroIExtData;

        public DeserializeUnsigned(ms: Neo.IO.BinaryReader): void
        {
            if (this.type == ZoroTransactionType.ContractTransaction
                || this.type == ZoroTransactionType.IssueTransaction)//每个交易类型有一些自己独特的处理
            {
                //ContractTransaction 就是最常见的合约交易，
                //他没有自己的独特处理
                this.extdata = null;
            }
            else if (this.type == ZoroTransactionType.InvocationTransaction)
            {
                this.extdata = new ZoroInvokeTransData();
            }
            else
            {
                throw new Error("未编写针对这个交易类型的代码");
            }
            if (this.extdata != null)
            {
                this.extdata.Deserialize(this, ms);
            }
            //attributes
            var countAttributes = ms.readVarInt();
            this.attributes = [];//new Attribute[countAttributes];
            // Console.WriteLine("countAttributes:" + countAttributes);
            for (var i = 0; i < countAttributes; i++)
            {


                //读取attributes
                var attributeData: Uint8Array = null;
                var Usage = ms.readByte() as ZoroTransactionAttributeUsage;
                if (Usage == ZoroTransactionAttributeUsage.ContractHash || Usage == ZoroTransactionAttributeUsage.Vote || (Usage >= ZoroTransactionAttributeUsage.Hash1 && Usage <= ZoroTransactionAttributeUsage.Hash15))
                {
                    var arr = ms.readBytes(32);
                    attributeData = new Uint8Array(arr, 0, arr.byteLength);
                }
                else if (Usage == ZoroTransactionAttributeUsage.ECDH02 || Usage == ZoroTransactionAttributeUsage.ECDH03)
                {
                    var arr = ms.readBytes(32);
                    var data = new Uint8Array(arr, 0, arr.byteLength);
                    attributeData = new Uint8Array(33);
                    attributeData[0] = Usage as number;
                    for (var i = 0; i < 32; i++)
                    {
                        attributeData[i + 1] = data[i];
                    }
                }
                else if (Usage == ZoroTransactionAttributeUsage.Script)
                {
                    var arr = ms.readBytes(20);
                    attributeData = new Uint8Array(arr, 0, arr.byteLength);
                }
                else if (Usage == ZoroTransactionAttributeUsage.DescriptionUrl)
                {
                    var len = ms.readByte();
                    var arr = ms.readBytes(len);
                    attributeData = new Uint8Array(arr, 0, arr.byteLength);
                }
                else if (Usage == ZoroTransactionAttributeUsage.Description || Usage >= ZoroTransactionAttributeUsage.Remark)
                {
                    var len = ms.readVarInt(65535);
                    var arr = ms.readBytes(len);
                    attributeData = new Uint8Array(arr, 0, arr.byteLength);
                }
                else
                    throw new Error();

                var attr = new ZoroAttribute();
                attr.usage = Usage;
                attr.data = attributeData;
                this.attributes.push(attr);
            }           
        }
        public Deserialize(ms: Neo.IO.BinaryReader): void
        {
            this.DeserializeUnsigned(ms);
            if (ms.canRead()>0)
            {
                var witnesscount = ms.readVarInt();
                this.witnesses = [];
                for (var i = 0; i < witnesscount; i++)
                {
                    this.witnesses.push(new Witness());
                    this.witnesses[i].InvocationScript = new Uint8Array(ms.readVarBytes()).clone();
                    this.witnesses[i].VerificationScript = new Uint8Array(ms.readVarBytes()).clone();
                }
            }
        }
         

        public GetMessage(): Uint8Array
        {

            var ms = new Neo.IO.MemoryStream();
            var writer = new Neo.IO.BinaryWriter(ms);
            this.SerializeUnsigned(writer);
            var arr = ms.toArray();
            var msg = new Uint8Array(arr, 0, arr.byteLength);
            return msg;
        }
        public GetRawData(): Uint8Array
        {
            var ms = new Neo.IO.MemoryStream();
            var writer = new Neo.IO.BinaryWriter(ms);
            this.Serialize(writer);
            var arr = ms.toArray();
            var msg = new Uint8Array(arr, 0, arr.byteLength);
            return msg;
        }
        //增加个人账户见证人（就是用这个人的私钥对交易签个名，signdata传进来）
        public AddWitness(signdata: Uint8Array, pubkey: Uint8Array, addrs: string): void
        {
            var vscript = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey);
            var sb = new ThinNeo.ScriptBuilder();
            sb.EmitPushBytes(signdata);

            var iscript = sb.ToArray();

            this.AddWitnessScript(vscript, iscript);
        }

        //增加智能合约见证人
        public AddWitnessScript(vscript: Uint8Array, iscript: Uint8Array): void
        {
            var scripthash = ThinNeo.Helper.GetScriptHashFromScript(vscript);
            if (this.witnesses == null)
                this.witnesses = [];
            var newwit = new Witness();
            newwit.VerificationScript = vscript;
            newwit.InvocationScript = iscript;

            for (var i = 0; i < this.witnesses.length; i++)
            {
                if (this.witnesses[i].Address == newwit.Address)
                    throw new Error("alread have this witness");
            }

            var _witnesses;
            if (this.witnesses)
                _witnesses = this.witnesses;
            else
                _witnesses = [];
            _witnesses.push(newwit);
            _witnesses.sort((a, b) => {
                var hash_a = ThinNeo.Helper.GetScriptHashFromScript(a.VerificationScript);
                var hash_b = ThinNeo.Helper.GetScriptHashFromScript(b.VerificationScript);
                for (let i = (hash_a.length - 1); i >= 0; i--) {
                    if (hash_a[i] > hash_b[i])
                        return 1;
                    if (hash_a[i] < hash_b[i])
                        return -1;
                }
                return 0;
            });
            this.witnesses = _witnesses;
        }

        //TXID
        public GetHash(): Uint8Array
        {
            var msg = this.GetMessage();
            var data = Neo.Cryptography.Sha256.computeHash(msg);
            data = Neo.Cryptography.Sha256.computeHash(data);
            return new Uint8Array(data, 0, data.byteLength);

        }
    }
}
