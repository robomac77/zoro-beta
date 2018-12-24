
namespace WebBrowser {
	export class WWW {

		static api: string = "http://115.159.53.39:59908/api/testnet/";
		static apiaggr: string = "http://115.159.53.39:59999/api/testnet/";

		static rpc: string = "http://115.159.53.39:20333/";
		static neoRpc:string = "http://47.52.192.77:20332";
		static neoGetUTXO:string = "https://api.nel.group/api/testnet/";
        static rpcName: string = "";

        static blockHeight:number = 0;
		static chainHashLength:number = 1;

		static makeRpcUrl(method: string, ..._params: any[]) {
			var url = WWW.api;
			var urlout = WWW.makeUrl(method, url, ..._params);
			return urlout;
		}
		static makeUrl(method: string, url: string, ..._params: any[]) {
			var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
			for (var i = 0; i < _params.length; i++) {
				urlout += JSON.stringify(_params[i]);
				if (i != _params.length - 1)
					urlout += ",";
			}
			urlout += "]";
			return urlout;
		}
		static makeRpcPostBody(method: string, ..._params: any[]): {} {
			var body = {};
			body["jsonrpc"] = "2.0";
			body["id"] = 1;
			body["method"] = method;
			var params = [];
			for (var i = 0; i < _params.length; i++) {
				params.push(_params[i]);
			}
			body["params"] = params;
			return body;
		}
		static makeZoroRpcPostBody(method: string, ..._params: any[]): {} {
			var body = {};
			body["jsonrpc"] = "2.0";
			body["id"] = 1;
			body["method"] = method;
			var params = [];
			for (var i = 0; i < _params[0].length; i++) {
				params.push(_params[0][i]);
			}
			body["params"] = params;
			return body;
		}
		//获得高度
		static async  api_getHeight()    // covered ; gets the id of lastblockheight
		{
			var str = WWW.makeRpcUrl("getblockcount");
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			var height = parseInt(r[0]["indexx"] as string) - 1;
			return height;
		}

		static async  api_getappchainHeight(ac:string)    // covered ; gets the id of lastblockheight
		{
			var str = WWW.makeRpcUrl("getappchainblockcount", ac);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			var height = parseInt(r[0]["blockcount"] as string) - 1;
			return height;
		}
		//获得交易总数
		static async gettxcount(type: string) // covered ; gets the total number of txs in address_tx
		{
			var str = WWW.makeRpcUrl("gettxcount", type);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0]['txcount'] as number;
		}

		static async getappchaintxcount(appchain: string) // covered ; gets the total number of txs in address_tx
		{
			var str = WWW.makeRpcUrl("getappchaintxcount", appchain);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0]['txcount'] as number;
		}
		//地址总数
		static async getaddrcount()     // covered ; gets the total number of address in address
		{
			var str = WWW.makeRpcUrl("getaddrcount");
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0]['addrcount'] as number;
		}
		static async getappchainaddrcount(ac:string)     // covered ; gets the total number of address in address
		{
			var str = WWW.makeRpcUrl("getaddrcount", ac);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0]['addrcount'] as number;
		}
        /**
         * 获取区块列表
         * @param size 记录条数
         * @param page 页码
         */
		static async getblocks(size: number, page: number)      
		{
			var str = WWW.makeRpcUrl("getblocks", size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		static async getappchainblocks(appchain:string ,size: number, page: number)      
		{
			var str = WWW.makeRpcUrl("getappchainblocks", appchain ,size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		/**
         * 获取区块列表
         * @param size 记录条数
         * @param page 页码
         */
		static async getblocksdesc(size: number, page: number)      
		{
			var str = WWW.makeRpcUrl("getblocksdesc", size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		static async getappchainblocksdesc(appchain:string ,size: number, page: number)      
		{
			var str = WWW.makeRpcUrl("getappchainblocksdesc", appchain ,size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		static async getblock(index: number)      
		{
			var str = WWW.makeRpcUrl("getblock", index);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}
		static async getblockFromHash(hash: string)      
		{
			var str = WWW.makeRpcUrl("getblockfromhash", hash);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		static async getappchainblockFromHash(ac:string, hash: string)      
		{
			var str = WWW.makeRpcUrl("getappchainblockfromhash", ac, hash);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		static async getacblock(ac :string ,index: number)      
		{
			var str = WWW.makeRpcUrl("getacblock", ac ,index);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Block[];
		}

		//查询交易列表
		static async getrawtransactions(size: number, page: number, txtype: string) {

			var str = WWW.makeRpcUrl("getrawtransactions", size, page, txtype);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Tx[]; // needs most recent 10 txs returned, needs a sorting by txtype
		}

		static async getappchainrawtransactions(appchain:string , size: number, page: number) {

			var str = WWW.makeRpcUrl("getappchainrawtransactions", appchain,size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Tx[]; // needs most recent 10 txs returned, needs a sorting by txtype
		}

		//查询交易列表
		static async getrawtransactionsdesc(size: number, page: number, txtype: string) {

			var str = WWW.makeRpcUrl("getrawtransactionsdesc", size, page, txtype);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Tx[]; // needs most recent 10 txs returned, needs a sorting by txtype
		}

		static async getappchainrawtransactionsdesc(appchain:string , size: number, page: number) {

			var str = WWW.makeRpcUrl("getappchainrawtransactionsdesc", appchain,size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Tx[]; // needs most recent 10 txs returned, needs a sorting by txtype
		}

		static async getaddrs(size: number, page: number) {
			var str = WWW.makeRpcUrl("getaddrs", size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Addr[]; 
		}
		static async getappchainaddrs(ac:string, size: number, page: number) {
			var str = WWW.makeRpcUrl("getappchainaddrs", ac, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as Addr[]; 
		}

		static async getrawtransaction(txid: string) 
		{
			var str = WWW.makeRpcUrl("getrawtransaction", txid);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0] as Tx;
		}

		static async getappchainrawtransaction(ac: string ,txid: string) 
		{
			var str = WWW.makeRpcUrl("getacrawtransaction", ac,txid);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0] as Tx;
		}

		static async getallnep5asset() {         
			var str = WWW.makeRpcUrl("getallnep5asset");
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r: nep5Asset[] = json["result"];
			return r;
		}

		static async getappchainallnep5asset(ac:string) {         
			var str = WWW.makeRpcUrl("getappchainallnep5asset",ac);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r: nep5Asset[] = json["result"];
			return r;
		}

		static async api_getAllAssets()        
		{
			var str = WWW.makeRpcUrl("getallassets");
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getAllAppchains()        
		{
			var str = WWW.makeRpcUrl("getallappchains");
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		static async api_getAppchain(hash: string)        
		{
			var str = WWW.makeRpcUrl("getappchain" , hash);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getAppchainBlockcount(hash: string) {
			var str = WWW.makeRpcUrl("getappchainblockcount", hash);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0]["blockcount"] as number;
			
		}

		static async api_getAppchainAddrcount(hash: string) {
			var str = WWW.makeRpcUrl("getappchainaddrcount", hash);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0]["addrcount"] as number;

		}
		static async api_getUTXOCount(address: string) {
			var str = WWW.makeRpcUrl("getutxo", address);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getappchainUTXOCount(ac:string, address: string) {
			var str = WWW.makeRpcUrl("getappchainutxo", ac, address);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getUTXO(address: string, size: number, page: number) {
			var str = WWW.makeRpcUrl("getutxo", address, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getappchainUTXO(ac:string, address: string, size: number, page: number) {
			var str = WWW.makeRpcUrl("getappchainutxo", ac, address, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getbalances(address: string)   
		{
			var str = WWW.makeRpcUrl("getbalance", address);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getappchainbalances(ac:string, address: string)   
		{
			var str = WWW.makeRpcUrl("getappchainbalance", ac, address);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		static async api_getasset(asset: string) {   
			var str = WWW.makeRpcUrl("getasset", asset);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getnep5(nep5: string) { 
			var str = WWW.makeRpcUrl("getnep5asset", nep5);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		static async api_getappchainnep5(ac:string, nep5: string) { 
			var str = WWW.makeRpcUrl("getappchainnep5asset", ac, nep5);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r[0];
		}

		static async api_getallnep5assetofaddress(nep5: string) {  
			var str = WWW.makeRpcUrl("getallnep5assetofaddress", nep5, 1);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		static async getaddresstxs(addr: string, size: number, page: number) { 
			var str = WWW.makeRpcUrl("getaddresstxs", addr, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as TransOfAddress[];
		}

		static async getappchainaddresstxs(ac:string, addr: string, size: number, page: number) { 
			var str = WWW.makeRpcUrl("getappchainaddresstxs", ac, addr, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as TransOfAddress[];
		}

		static async api_getaddrMsg(addr: string) {    
			var str = WWW.makeRpcUrl("getaddr", addr);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as AddressMsg[];
		}
		static async api_getappchainaddrMsg(ac:string, addr: string) {    
			var str = WWW.makeRpcUrl("getappchainaddr", ac, addr);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as AddressMsg[];
		}
		//资产排行
		static async getrankbyasset(nep5id: string, size: number, page: number) {
			var str = WWW.makeRpcUrl("getrankbyasset", nep5id, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async getappchainrankbyasset(ac:string, nep5id: string, size: number, page: number) {
			var str = WWW.makeRpcUrl("getappchainrankbyasset", ac, nep5id, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		//资产排行总数
		static async api_getrankbyassetcount(id: string) {
			var str = WWW.makeRpcUrl("getrankbyassetcount", id);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getappchainrankbyassetcount(ac:string, id: string) {
			var str = WWW.makeRpcUrl("getappchainrankbyassetcount", ac, id);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		static async api_getnep5transfersbyasset(nep5id: string, size: number, page: number) { 
			var str = WWW.makeRpcUrl("getnep5transfersbyasset", nep5id, size, page);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r as TransOfAsset[];
		}

		static async api_getnep5count(type: string, nep5id: string) {
			var str = WWW.makeRpcUrl("getnep5count", type, nep5id);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		//根据txid获取nep5
		static async api_getnep5transferbytxid(txid: string) { 
			var str = WWW.makeRpcUrl("getnep5transferbytxid", txid);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		static async api_getappchainnep5transferbytxid(ac:string, txid: string) { 
			var str = WWW.makeRpcUrl("getappchainnep5transferbytxid", ac, txid);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}
		//search asset list
		static async apiaggr_searchAsset(str: string) {
			var str = WWW.makeUrl("fuzzysearchasset", WWW.apiaggr, str);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			return r;
		}

		//new
		static makeZoroRpcUrl(url: string, method: string, ..._params: any[])
        {
            if (url[url.length - 1] != '/')
                url = url + "/";
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++)
            {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
		}

		// neo gas 
		static async rpc_getUTXO(address:string){
			var str = WWW.makeUrl("getutxo", WWW.neoGetUTXO, address);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			AppChainTool.GAS = 0; 
			AppChainTool.NEO = 0;
			if (r)
			r.forEach(element => {
				if (element["asset"] == AppChainTool.id_GAS){
					AppChainTool.GAS += parseFloat(element["value"]);
				}	
				if (element["asset"] == AppChainTool.id_NEO){
					AppChainTool.NEO += parseFloat(element["value"]);
				}
				
			});
			return r;
		}
		
		static async rpc_getBalanceOf(contractHash:string, address:string, chainHash:any = null){
            var sb = new ThinNeo.ScriptBuilder();
            var array = [];
            array.push("(addr)" + address);             
            sb.EmitParamJson(array);
            sb.EmitPushString("balanceOf");
            sb.EmitAppCall(contractHash.hexToBytes().reverse());
            
			var scripthash = sb.ToArray().toHexString();
			if (chainHash == "gold")
			{
				return 0;
			}
			if (chainHash == null) {
				var str = this.makeUrl("invokescript", WWW.neoRpc, scripthash);
			}else{
				var str = this.makeZoroRpcUrl(WWW.rpc, "invokescript", chainHash, scripthash);
			}           
            var result = await fetch(str, {"method":"get"});
			var json = await result.json();
			var r;
			if (chainHash == null) {
				r = json["result"]["stack"][0]["value"];
			}else{
				if (json["result"]["stack"].length == 0){
					r = 0;
				}else{
					r = json["result"]["stack"][0]["value"];     
				}				
			}                 
            if (r == ""){
                r = 0;
            }else{
                r = (r as string).hexToBytes();
                r = Neo.BigInteger.fromUint8ArrayAutoSign(r);
            }
            return r;
        }    

		static async api_getAllAppChain(){
            var str = WWW.makeZoroRpcUrl(WWW.rpc, "getappchainhashlist");
            var result = await fetch(str, {"method":"get"});
            var json = await result.json();
            var r = json["result"]["hashlist"];
            return r;
		}
		
		static async api_getAppChainName(chainHash:string){
            var str = WWW.makeZoroRpcUrl(WWW.rpc, "getappchainstate", chainHash);
            var result = await fetch(str, {"method":"get"});
            var json = await result.json();
            var r = json["result"]["name"];
            return r;
		}
		
		//获得高度
		static async  api_getNEOHeight()    // covered ; gets the id of lastblockheight
		{
			var str = WWW.makeUrl("getblockcount", WWW.neoRpc);
			var result = await fetch(str, { "method": "get" });
			var json = await result.json();
			var r = json["result"];
			var height = parseInt(r as string) - 1;
			return height;
		}

		static async api_getZoroHeight(chainHash:any)
        {
            var str = WWW.makeZoroRpcUrl(WWW.rpc, "getblockcount", chainHash);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r as string) - 1;
            return height;
		}
		
		static async rpc_invokeScript(params:any){
            var postdata = WWW.makeZoroRpcPostBody("invokescript", params);
            var result = await fetch(WWW.rpc, {"method":"post", "body":JSON.stringify(postdata)});
            var json = await result.json();
            return json["result"];
		}
		
		static makeTran(address:string){
            var tran = new  ThinNeo.Transaction();
            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.version = 1;           

            var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);

            tran.attributes = [];
            tran.attributes[0] = new ThinNeo.Attribute();
            tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
            tran.attributes[0].data = scriptHash;
            tran.inputs = [];
            tran.outputs = [];
           
            return tran;
		}
		
		static async rpc_sendrawtransaction(params:any){
            var postdata = WWW.makeZoroRpcPostBody("sendrawtransaction",params);
            var result = await fetch(WWW.rpc, {"method":"post", "body":JSON.stringify(postdata)});
            var json = await result.json();
            return json;
		}
		
		static async rpc_postRawTransaction(data: Uint8Array): Promise<boolean>
        {
            var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
            var result = await fetch(WWW.neoRpc, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
	}
}