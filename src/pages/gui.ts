/// <reference path="../app.ts"/>
/// <reference path="../tools/AppChainTool.ts"/> 
/// <reference path="../tools/wwwtool.ts"/> 
namespace WebBrowser
{
    export class GUI implements Page
    {
        app: App

        langType: string;
        chainHash: any;
        height:HTMLSpanElement;
        selectAppChain:HTMLSelectElement;
        selectIndex:number;
        prikey:any;
        pubkey:any;
        address:string;

        getLangs() {
            if (this.langType != this.app.langmgr.type) {
                this.langType = this.app.langmgr.type
            }
        }

        div: HTMLDivElement = document.getElementById('gui-info') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        constructor(app: App) {
            this.app = app
            Neo.Cryptography.RandomNumberGenerator.startCollectors();
            AppChainTool.initAppChainSelectList();
        }

        login():void{
            this.div.removeChild(this.div.firstChild);

            var loginbackground = document.createElement('div') as HTMLDivElement;
            this.div.appendChild(loginbackground);

            var name = document.createElement('h3') as HTMLHeadingElement;
            name.textContent = "登陆你的钱包";
            name.style.color = "#ffffff";
            loginbackground.appendChild(name);

            var file = document.createElement("input");
            loginbackground.appendChild(file);
            file.type = "file";

            var password = document.createElement("input");
            loginbackground.appendChild(password);
            password.type = "password";
            password.title = "输入密码";

            var btn = document.createElement("button");
            loginbackground.appendChild(btn);
            btn.textContent = "登陆";
            btn.onclick = () =>
            {
                if(wallet.accounts.length > 0 && wallet.accounts[0].nep2key != null){
                    let nepkey = wallet.accounts[0].nep2key;
                    var s = wallet.scrypt;
                    ThinNeo.Helper.GetPrivateKeyFromNep2(nepkey, password.value, s.N, s.r, s.p, (info, result) =>
                    {
                        if (info == "finish")
                        {
                            this.prikey = result as Uint8Array;
                            this.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(this.prikey);
                            this.address = ThinNeo.Helper.GetAddressFromPublicKey(this.pubkey);
                            this.mainMenu();
                        }
                    }
                    );
                }                
            };

            var createWallet = document.createElement("button");
            loginbackground.appendChild(createWallet);
            createWallet.textContent = "创建钱包";
            createWallet.onclick = () => {
                this.createWallet();
            }

            var wallet: ThinNeo.nep6wallet;
            var reader = new FileReader();
            reader.onload = (e: Event) =>
            {
                var walletstr = reader.result as string;
                wallet = new ThinNeo.nep6wallet();
                wallet.fromJsonStr(walletstr);               
            };
            file.onchange = (ev: Event) =>
            {
                if (file.files[0].name.includes(".json"))
                {
                    reader.readAsText(file.files[0]);
                }
            }

        }

        createWallet():void{
            this.div.removeChild(this.div.firstChild);
            Neo.Cryptography.RandomNumberGenerator.startCollectors();

            var loginbackground = document.createElement('div') as HTMLDivElement;
            this.div.appendChild(loginbackground);

            var name = document.createElement('h3') as HTMLHeadingElement;
            name.textContent = "创建您的钱包";
            name.style.color = "#ffffff";
            loginbackground.appendChild(name);

            var walletName = document.createElement("input");
            loginbackground.appendChild(walletName);
            walletName.type = "text";
            walletName.title = "输入钱包名";

            var password = document.createElement("input");
            loginbackground.appendChild(password);
            password.type = "password";
            password.title = "输入密码";

            var repassword = document.createElement("input");
            loginbackground.appendChild(repassword);
            repassword.type = "password";
            repassword.title = "重复密码";

            var create = document.createElement('button') as HTMLButtonElement;
            loginbackground.appendChild(create);
            create.textContent = "新建";
            create.onclick = () => {
                try
                {
                    var array = new Uint8Array(32);
                    var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
                    var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                    var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);

                    var wallet = new ThinNeo.nep6wallet();
                    wallet.scrypt = new ThinNeo.nep6ScryptParameters();
                    wallet.scrypt.N = 16384;
                    wallet.scrypt.r = 8;
                    wallet.scrypt.p = 8;
                    wallet.accounts = [];
                    wallet.accounts[0] = new ThinNeo.nep6account();
                    wallet.accounts[0].address = addr;
                    ThinNeo.Helper.GetNep2FromPrivateKey(key, repassword.value, wallet.scrypt.N, wallet.scrypt.r, wallet.scrypt.p, (info, result) =>
                    {
                        if (info == "finish")
                        {
                            wallet.accounts[0].nep2key = result;
                            wallet.accounts[0].contract = new ThinNeo.contract();
                            this.prikey = key;
                            this.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                            this.address = ThinNeo.Helper.GetAddressFromPublicKey(this.pubkey);
                            wallet.accounts[0].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey).toHexString();
                            var jsonstr = JSON.stringify(wallet.toJson());
                            var blob = new Blob([ThinNeo.Helper.String2Bytes(jsonstr)]);
                            var downLoadUrl = URL.createObjectURL(blob);
                            this.downloadWallet(downLoadUrl, walletName.value);
                        }
                    });
                }
                catch (e)
                {
                }
                
            }
            var returnLogin = document.createElement('a') as HTMLAnchorElement;
            loginbackground.appendChild(returnLogin);
            returnLogin.textContent = "返回登录>>";
            returnLogin.onclick = () => {
                this.login();
            }
        }

        downloadWallet(url:string, walletName:string):void{
            this.div.removeChild(this.div.firstChild);

            var loginbackground = document.createElement('div') as HTMLDivElement;
            this.div.appendChild(loginbackground);

            var name = document.createElement('h3') as HTMLHeadingElement;
            name.textContent = "您的钱包文件已创建";
            name.style.color = "#ffffff";
            loginbackground.appendChild(name);

            var text1 = document.createElement('h5') as HTMLHeadingElement;
            text1.textContent = "点击“下载”来保存您的文件";
            text1.style.color = "#eeeeee";
            loginbackground.appendChild(text1);

            var text2 = document.createElement('h5') as HTMLHeadingElement;
            text2.textContent = "不要丢失！如果丢失，将无法恢复";
            text2.style.color = "#eeeeee";
            loginbackground.appendChild(text2);

            var downLoad = document.createElement('button') as HTMLButtonElement;
            loginbackground.appendChild(downLoad);
            downLoad.textContent = "下载文件";           

            downLoad.onclick = () => {
                var downurl = document.createElement("a");
                downLoad.appendChild(downurl);
                downurl.download = walletName + ".json";
                downurl.href = url;
                downurl.click();
                this.mainMenu();              
            }
            var returnLogin = document.createElement('a') as HTMLAnchorElement;
            loginbackground.appendChild(returnLogin);
            returnLogin.textContent = "返回登录>>";
            returnLogin.onclick = () => {
                this.login();
            }
        }

        mainMenu():void{
            this.div.removeChild(this.div.firstChild);

            var background = document.createElement('div') as HTMLDivElement;
            this.div.appendChild(background);   
            
            this.title(background);
        }

        title(div):void{            
            var title = document.createElement('div') as HTMLDivElement;
            title.style.width = "100%";
            div.appendChild(title);

            var mainValueBackGround = document.createElement('div') as HTMLDivElement;
            mainValueBackGround.style.width = "100%";
            div.appendChild(mainValueBackGround);

            this.initAppChain(mainValueBackGround);
            this.update();

            var asset = document.createElement("button") as HTMLButtonElement;
            title.appendChild(asset)
            asset.style.cssFloat = "left";
            asset.style.width = "10%";
            asset.textContent = "资产";
            asset.onclick = () => {
                this.mainAsset(mainValueBackGround);
            }
            asset.click();

            var charge = document.createElement("button") as HTMLButtonElement;
            title.appendChild(charge)
            charge.style.cssFloat = "left";
            charge.style.width = "10%";
            charge.textContent = "转账";
            charge.onclick = () => {
                this.mainCharge(mainValueBackGround);
            }

            var appChain = document.createElement("button") as HTMLButtonElement;
            title.appendChild(appChain)
            appChain.style.cssFloat = "left";
            appChain.style.width = "10%";
            appChain.textContent = "应用链";
            appChain.onclick = () => {
                this.mainAppChain(mainValueBackGround);
            }

            var contract = document.createElement("button") as HTMLButtonElement;
            title.appendChild(contract)
            contract.style.cssFloat = "left";
            contract.style.width = "10%";
            contract.textContent = "发布合约";
            contract.onclick = () => {
                this.mainContract(mainValueBackGround);
            }

            var transaction = document.createElement("button") as HTMLButtonElement;
            title.appendChild(transaction)
            transaction.style.cssFloat = "left";
            transaction.style.width = "10%";
            transaction.textContent = "交易记录";
            transaction.onclick = () => {
                
            }

            var message = document.createElement("button") as HTMLButtonElement;
            title.appendChild(message)
            message.style.cssFloat = "left";
            message.style.width = "10%";
            message.textContent = "信息";
            message.onclick = () => {
                
            }

            this.selectAppChain = document.createElement("select") as HTMLSelectElement;     
            this.selectAppChain.style.cssFloat = "right";
            this.selectAppChain.style.width = "15%";
            title.appendChild(this.selectAppChain);  

            this.height = document.createElement("span") as HTMLSpanElement;
            title.appendChild(this.height)
            this.height.style.cssFloat = "right";
            this.height.style.width = "6%";
            this.height.textContent = "0";            
        }

        async mainAsset(div:HTMLDivElement){
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var zoroChainBackGround = document.createElement('div') as HTMLDivElement;
            zoroChainBackGround.style.width = "100%";
            zoroChainBackGround.style.cssFloat = "left";
            div.appendChild(zoroChainBackGround);
            //zoro
            var zoroChain = document.createElement('div') as HTMLDivElement;
            zoroChain.style.width = "30%";
            zoroChain.style.cssFloat = "left";
            zoroChainBackGround.appendChild(zoroChain);

            var name = document.createElement('span') as HTMLSpanElement;
            name.style.width = "100%";
            name.style.cssFloat = "left";
            name.style.color = "#eeeeee";
            name.textContent = 'ZORO CHAIN';
            zoroChain.appendChild(name);

            var BCP = document.createElement('span') as HTMLSpanElement;
            BCP.style.width = "100%";
            BCP.style.cssFloat = "left";
            var bcpnum = await WWW.rpc_getBalanceOf(AppChainTool.zoroBCP, this.address, "0000000000000000000000000000000000000000");
            BCP.style.color = "#eeeeee";
            BCP.textContent = 'BCP = ' + bcpnum;
            zoroChain.appendChild(BCP);
            //neo
            var neoChain = document.createElement('div') as HTMLDivElement;
            neoChain.style.width = "30%";
            neoChain.style.cssFloat = "left";
            zoroChainBackGround.appendChild(neoChain);

            var name = document.createElement('span') as HTMLSpanElement;
            name.style.width = "100%";
            name.style.cssFloat = "left";
            name.style.color = "#eeeeee";
            name.textContent = 'NEO CHAIN';
            neoChain.appendChild(name);

            var utxo = await WWW.rpc_getUTXO(this.address);
            var GAS = document.createElement('span') as HTMLSpanElement;
            GAS.style.width = "100%";
            GAS.style.cssFloat = "left";
            GAS.style.color = "#eeeeee";
            GAS.textContent = 'GAS = ' + AppChainTool.GAS;
            neoChain.appendChild(GAS);

            var CGAS = document.createElement('span') as HTMLSpanElement;
            CGAS.style.width = "100%";
            CGAS.style.cssFloat = "left";
            CGAS.style.color = "#eeeeee";
            var CgasNum = await WWW.rpc_getBalanceOf(AppChainTool.CGAS, this.address);
            CGAS.textContent = 'CGAS = ' + CgasNum;
            neoChain.appendChild(CGAS);

            var NEO = document.createElement('span') as HTMLSpanElement;
            NEO.style.width = "100%";
            NEO.style.cssFloat = "left";
            NEO.style.color = "#eeeeee";            
            NEO.textContent = 'NEO = ' + AppChainTool.NEO;
            neoChain.appendChild(NEO);

            var CNEO = document.createElement('span') as HTMLSpanElement;
            CNEO.style.width = "100%";
            CNEO.style.cssFloat = "left";
            CNEO.style.color = "#eeeeee";
            var CneoNum = await WWW.rpc_getBalanceOf(AppChainTool.CNEO, this.address);
            CNEO.textContent = 'CNEO = ' + CneoNum;
            neoChain.appendChild(CNEO);

            var NBCP = document.createElement('span') as HTMLSpanElement;
            NBCP.style.width = "100%";
            NBCP.style.cssFloat = "left";
            NBCP.style.color = "#eeeeee";
            var bcpnum = await WWW.rpc_getBalanceOf(AppChainTool.neoBCP, this.address);
            NBCP.textContent = 'BCP = ' + bcpnum;
            neoChain.appendChild(NBCP);

            //appchain
            if (this.chainHash == "0000000000000000000000000000000000000000" || this.height.textContent == "N/A"){
                return;
            }
            var appChain = document.createElement('div') as HTMLDivElement;
            appChain.style.width = "30%";
            appChain.style.cssFloat = "left";
            zoroChainBackGround.appendChild(appChain);

            var name = document.createElement('span') as HTMLSpanElement;
            name.style.width = "100%";
            name.style.cssFloat = "left";
            name.style.color = "#eeeeee";
            name.textContent = 'APP CHAIN';
            appChain.appendChild(name);

            var BCP = document.createElement('span') as HTMLSpanElement;
            BCP.style.width = "100%";
            BCP.style.cssFloat = "left";
            BCP.style.color = "#eeeeee";
            var bcpnum = await WWW.rpc_getBalanceOf(AppChainTool.appChainBCP, this.address, this.chainHash);
            BCP.textContent = 'BCP = ' + bcpnum;
            appChain.appendChild(BCP);
        }

        mainCharge(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var chargeBackGround = document.createElement('div') as HTMLDivElement;
            chargeBackGround.style.width = "100%";
            chargeBackGround.style.cssFloat = "left";
            div.appendChild(chargeBackGround);

            var upBackGround = document.createElement('div') as HTMLDivElement;
            upBackGround.style.width = "100%";
            upBackGround.style.cssFloat = "left";
            chargeBackGround.appendChild(upBackGround);

            var downBackGround = document.createElement('div') as HTMLDivElement;
            downBackGround.style.width = "100%";
            downBackGround.style.cssFloat = "left";
            chargeBackGround.appendChild(downBackGround);

            var normalcharge = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(normalcharge)
            normalcharge.style.cssFloat = "left";
            normalcharge.style.width = "50%";
            normalcharge.style.color = "#eeeeee";
            normalcharge.textContent = "普通转账";
            normalcharge.onclick = () => {
                this.normalCharge(downBackGround);
            }
            normalcharge.click();

            var chainCharge = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(chainCharge)
            chainCharge.style.cssFloat = "left";
            chainCharge.style.width = "50%";
            chainCharge.style.color = "#eeeeee";
            chainCharge.textContent = "跨链转账";
            chainCharge.onclick = () => {
                this.chainCharge(downBackGround);
            }
        }

        mainAppChain(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var appChainBackGround = document.createElement('div') as HTMLDivElement;
            appChainBackGround.style.width = "100%";
            appChainBackGround.style.cssFloat = "left";
            div.appendChild(appChainBackGround);

            var appChainText = document.createElement('span') as HTMLSpanElement;
            appChainText.style.color = "#eeeeee";
            appChainText.textContent = "应用链";
            appChainBackGround.appendChild(appChainText);

            var appChainName = document.createElement('span') as HTMLSpanElement;
            appChainName.style.color = "#eeeeee";
            appChainName.textContent = "应用链名称";
            appChainBackGround.appendChild(appChainName);

            var name = document.createElement('input') as HTMLInputElement;
            appChainBackGround.appendChild(name);

            var pkey1 = document.createElement('span') as HTMLSpanElement;
            pkey1.style.color = "#eeeeee";
            pkey1.textContent = "选择公钥1";
            appChainBackGround.appendChild(pkey1);

            var pubkey1 = AppChainTool.createSelect(appChainBackGround, "pubkey", 6);

            var pkey2= document.createElement('span') as HTMLSpanElement;
            pkey2.style.color = "#eeeeee";
            pkey2.textContent = "选择公钥2";
            appChainBackGround.appendChild(pkey2);

            var pubkey2 = AppChainTool.createSelect(appChainBackGround, "pubkey", 7);

            var pkey3 = document.createElement('span') as HTMLSpanElement;
            pkey3.style.color = "#eeeeee";
            pkey3.textContent = "选择公钥3";
            appChainBackGround.appendChild(pkey3);

            var pubkey3 = AppChainTool.createSelect(appChainBackGround, "pubkey", 8);

            var pkey4 = document.createElement('span') as HTMLSpanElement;
            pkey4.style.color = "#eeeeee";
            pkey4.textContent = "选择公钥4";
            appChainBackGround.appendChild(pkey4);

            var pubkey4 = AppChainTool.createSelect(appChainBackGround, "pubkey", 9);

            var seed1= document.createElement('span') as HTMLSpanElement;
            seed1.style.color = "#eeeeee";
            seed1.textContent = "选择种子地址1";
            appChainBackGround.appendChild(seed1);

            var ip1 = AppChainTool.createSelect(appChainBackGround, "ip", 6);

            var seed2= document.createElement('span') as HTMLSpanElement;
            seed2.style.color = "#eeeeee";
            seed2.textContent = "选择种子地址2";
            appChainBackGround.appendChild(seed2);

            var ip2 = AppChainTool.createSelect(appChainBackGround, "ip", 7);

            var seed3 = document.createElement('span') as HTMLSpanElement;
            seed3.style.color = "#eeeeee";
            seed3.textContent = "选择种子地址3";
            appChainBackGround.appendChild(seed3);

            var ip3 = AppChainTool.createSelect(appChainBackGround, "ip", 8);

            var seed4= document.createElement('span') as HTMLSpanElement;
            seed4.style.color = "#eeeeee";
            seed4.textContent = "选择种子地址4";
            appChainBackGround.appendChild(seed4);

            var ip4 = AppChainTool.createSelect(appChainBackGround, "ip", 9);

            var btnCreate = document.createElement('button') as HTMLButtonElement;
            btnCreate.textContent = "创建";
            btnCreate.onclick = () => {
                var pubkey = [(pubkey1.childNodes[pubkey1.selectedIndex] as HTMLOptionElement).value,
                (pubkey2.childNodes[pubkey2.selectedIndex] as HTMLOptionElement).value,
                (pubkey3.childNodes[pubkey3.selectedIndex] as HTMLOptionElement).value,
                (pubkey4.childNodes[pubkey4.selectedIndex] as HTMLOptionElement).value];
                var ip = [(ip1.childNodes[ip1.selectedIndex] as HTMLOptionElement).value + ":" + AppChainTool.port,
                (ip2.childNodes[ip2.selectedIndex] as HTMLOptionElement).value + ":" + AppChainTool.port,
                (ip3.childNodes[ip3.selectedIndex] as HTMLOptionElement).value + ":" + AppChainTool.port,
                (ip4.childNodes[ip4.selectedIndex] as HTMLOptionElement).value + ":" + AppChainTool.port];

                AppChainTool.SendCreateAppChain(name.value, this.pubkey, pubkey, ip, this.prikey, "0000000000000000000000000000000000000000");
            }
            appChainBackGround.appendChild(btnCreate);
        }

        mainContract(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var contractBackGround = document.createElement('div') as HTMLDivElement;
            contractBackGround.style.width = "100%";
            contractBackGround.style.cssFloat = "left";
            div.appendChild(contractBackGround);

            var ContractText = document.createElement('span') as HTMLSpanElement;
            ContractText.style.color = "#eeeeee";
            ContractText.textContent = "发布合约";
            contractBackGround.appendChild(ContractText);

            var storageName = document.createElement('span') as HTMLSpanElement;
            storageName.style.color = "#eeeeee";
            storageName.textContent = "storage";
            contractBackGround.appendChild(storageName);

            var need_storage = document.createElement('input') as HTMLInputElement;
            need_storage.type = "checkbox";
            contractBackGround.appendChild(need_storage);

            var canChargeName = document.createElement('span') as HTMLSpanElement;
            canChargeName.style.color = "#eeeeee";
            canChargeName.textContent = "canCharge";
            contractBackGround.appendChild(canChargeName);

            var need_canCharge = document.createElement('input') as HTMLInputElement;
            need_canCharge.type = "checkbox";
            contractBackGround.appendChild(need_canCharge);

            var nameText = document.createElement('span') as HTMLSpanElement;
            nameText.style.color = "#eeeeee";
            nameText.textContent = "NAME";
            contractBackGround.appendChild(nameText);

            var name = document.createElement('input') as HTMLInputElement;
            contractBackGround.appendChild(name);

            var versionText = document.createElement('span') as HTMLSpanElement;
            versionText.style.color = "#eeeeee";
            versionText.textContent = "VERSION";
            contractBackGround.appendChild(versionText);

            var version = document.createElement('input') as HTMLInputElement;
            contractBackGround.appendChild(version);

            var autherText = document.createElement('span') as HTMLSpanElement;
            autherText.style.color = "#eeeeee";
            autherText.textContent = "AUTHOR";
            contractBackGround.appendChild(autherText);

            var auther = document.createElement('input') as HTMLInputElement;
            contractBackGround.appendChild(auther);

            var emailText = document.createElement('span') as HTMLSpanElement;
            emailText.style.color = "#eeeeee";
            emailText.textContent = "EMAIL";
            contractBackGround.appendChild(emailText);

            var email = document.createElement('input') as HTMLInputElement;
            contractBackGround.appendChild(email);

            var descriptionText = document.createElement('span') as HTMLSpanElement;
            descriptionText.style.color = "#eeeeee";
            descriptionText.textContent = "DESCRIPTION";
            contractBackGround.appendChild(descriptionText);

            var description = document.createElement('input') as HTMLInputElement;
            contractBackGround.appendChild(description);

            var fileText = document.createElement('span') as HTMLSpanElement;
            fileText.style.color = "#eeeeee";
            fileText.textContent = "FILE";
            contractBackGround.appendChild(fileText);

            var file = document.createElement('input') as HTMLInputElement;
            file.type = "file";
            contractBackGround.appendChild(file);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            btnSend.textContent = "send";
            contractBackGround.appendChild(btnSend);

            var ContractAvm = null;
            btnSend.onclick = async () => {
                if (!ContractAvm){
                    alert("it can be .avm file.");
                    return;
                }
                AppChainTool.SendContract(need_storage.checked,need_canCharge.checked,description.value,email.value,auther.value,version.value,
                    name.value, ContractAvm, this.chainHash, this.pubkey, this.prikey);

                setTimeout(() => {
                    AppChainTool.SendContractMethod(this.chainHash, this.pubkey, this.prikey);
                }, 15000);
            }

            var reader = new FileReader();
            reader.onload = (e: Event) =>
            {                
                ContractAvm = reader.result as ArrayBuffer;                                                           
            }   
            file.onchange = (ev: Event) =>
            {
                if (file.files[0].name.includes(".avm"))
                {
                    reader.readAsArrayBuffer(file.files[0]);
                }
            }      
        }

        mainTransaction(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var transactionBackGround = document.createElement('div') as HTMLDivElement;
            transactionBackGround.style.width = "100%";
            transactionBackGround.style.cssFloat = "left";
            div.appendChild(transactionBackGround);

            var TransactionText = document.createElement('span') as HTMLSpanElement;
            TransactionText.style.color = "#eeeeee";
            TransactionText.textContent = "交易记录";
            transactionBackGround.appendChild(TransactionText);

            var txidText = document.createElement('span') as HTMLSpanElement;
            txidText.style.color = "#eeeeee";
            txidText.textContent = "TXID";
            transactionBackGround.appendChild(txidText);

            var timeText = document.createElement('span') as HTMLSpanElement;
            timeText.style.color = "#eeeeee";
            timeText.textContent = "Date";
            transactionBackGround.appendChild(timeText);
        }

        async normalCharge(div:HTMLDivElement){
            if (div.firstChild)div.removeChild(div.firstChild);

            var normalbackground = document.createElement('div') as HTMLDivElement;
            div.appendChild(normalbackground);

            var up = document.createElement('div') as HTMLDivElement;
            up.style.width = "100%"
            up.style.cssFloat = "left";
            normalbackground.appendChild(up);

            var asset = document.createElement('span') as HTMLSpanElement;
            up.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "资产";

            var select = CoinTool.ZoroAsset();
            up.appendChild(select);

            var coin = document.createElement('span') as HTMLSpanElement;
            up.appendChild(coin);
            coin.style.color = "#eeeeee";
            coin.textContent = "余额";

            var coinNum = document.createElement('span') as HTMLSpanElement;
            up.appendChild(coinNum);
            coinNum.style.color = "#eeeeee";
            if (this.height.textContent == "N/A"){
                coinNum.textContent = await CoinTool.getGold((select.childNodes[select.selectedIndex] as HTMLOptionElement).value, this.address);
            }else
            coinNum.textContent = await CoinTool.getGold((select.childNodes[select.selectedIndex] as HTMLOptionElement).value, this.address, this.chainHash);

            var addrText = document.createElement('span') as HTMLSpanElement;
            normalbackground.appendChild(addrText);
            addrText.style.color = "#eeeeee";
            addrText.textContent = "地址";

            var addr = document.createElement('input') as HTMLInputElement;
            normalbackground.appendChild(addr);

            var goldText = document.createElement('span') as HTMLSpanElement;
            normalbackground.appendChild(goldText);
            goldText.style.color = "#eeeeee";
            goldText.textContent = "金额";

            var gold = document.createElement('input') as HTMLInputElement;
            normalbackground.appendChild(gold);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            normalbackground.appendChild(btnSend);
            btnSend.textContent = "发送";
            btnSend.onclick = async () => {
                if (coinNum.textContent == "0") return;
                switch((select.childNodes[select.selectedIndex] as HTMLOptionElement).value){
                    case "ZOROBCP":
                    return await AppChainTool.MakeZoroTransaction(this.address,addr.value, parseInt(gold.value), 
                    AppChainTool.zoroBCP, AppChainTool.zoroBCP, this.prikey, this.pubkey, this.chainHash);
                    case "NEOBCP":
                    var utxo = await WWW.rpc_getUTXO(this.address);
                    return await AppChainTool.MakeInvokeTransaction(CoinTool.getassets(utxo),this.address, addr.value, AppChainTool.neoBCP, parseInt(gold.value), this.prikey, this.pubkey);
                    case "NEO":
                    var utxo = await WWW.rpc_getUTXO(this.address);
                    return await AppChainTool.MakeTransaction(CoinTool.getassets(utxo),addr.value, AppChainTool.id_NEO, parseInt(gold.value), this.prikey, this.pubkey);
                    case "GAS":
                    var utxo = await WWW.rpc_getUTXO(this.address);
                    return await AppChainTool.MakeTransaction(CoinTool.getassets(utxo),addr.value, AppChainTool.id_GAS, parseInt(gold.value), this.prikey, this.pubkey);
                }
            }
        }

        async chainCharge(div:HTMLDivElement){
            if (div.firstChild)div.removeChild(div.firstChild);

            var chainbackground = document.createElement('div') as HTMLDivElement;
            div.appendChild(chainbackground);

            var asset = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "方法";

            var funcSelect = CoinTool.ZoroFunction();
            chainbackground.appendChild(funcSelect);

            var asset = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "资产";

            var coinSelect = document.createElement('select');
            var sitem = document.createElement("option");
            sitem.text = "BCP";
            sitem.value = "BCP";
            coinSelect.appendChild(sitem);
            chainbackground.appendChild(coinSelect);

            var coin = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(coin);
            coin.style.color = "#eeeeee";
            coin.textContent = "余额";

            var coinNum = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(coinNum);
            coinNum.style.color = "#eeeeee";
            coinNum.textContent = await CoinTool.getGold((funcSelect.childNodes[funcSelect.selectedIndex] as HTMLOptionElement).value, this.address, this.chainHash);

            var goldText = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(goldText);
            goldText.style.color = "#eeeeee";
            goldText.textContent = "金额";

            var gold = document.createElement('input') as HTMLInputElement;
            chainbackground.appendChild(gold);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            chainbackground.appendChild(btnSend);
            btnSend.textContent = "发送";
            btnSend.onclick = async () => {
                if (coinNum.textContent == "0") return;
                switch((funcSelect.childNodes[funcSelect.selectedIndex] as HTMLOptionElement).value){
                    case "ZOROBCP":
                    return await AppChainTool.MakeZoroTransaction(this.address, "AUB7tMoKTzN33iVVqhz98vnT3KiG4bqx3f", parseInt(gold.value), 
                    AppChainTool.Zorotransfer, AppChainTool.Zorotransfer, this.prikey, this.pubkey, this.chainHash);
                    case "NEOBCP":
                    var utxo = await WWW.rpc_getUTXO(this.address);
                    return await AppChainTool.MakeInvokeTransaction(CoinTool.getassets(utxo),this.address, "AMjCDmrbfcBxGPitHcdrUYRyPXD7DfC52c", AppChainTool.Neotransfer, parseInt(gold.value), this.prikey, this.pubkey);
                }
            }
            funcSelect.onchange = async () => {
                coinNum.textContent = await CoinTool.getGold((funcSelect.childNodes[funcSelect.selectedIndex] as HTMLOptionElement).value, this.address, this.chainHash);
            }
        }

        timeOut;
        async update(): Promise<void>
        {                
            if (this.chainHash){
                var height = await WWW.api_getZoroHeight(this.chainHash);
                this.height.textContent = isNaN(height)?"N/A":height.toString();
            }else{
                this.chainHash = "0000000000000000000000000000000000000000";
                var height = await WWW.api_getZoroHeight(this.chainHash);
                this.height.textContent = isNaN(height)?"N/A":height.toString();      
            }                

            if (height > WWW.blockHeight){
                WWW.blockHeight = height;
                AppChainTool.updateAllAppChain();
                if (WWW.chainHashLength < AppChainTool.appChainLength){
                    WWW.chainHashLength = AppChainTool.appChainLength;
                    this.updateAppChain();
                }               
            }
            this.timeOut = setTimeout(() => { this.update() }, 1000);
        }

        stopUpdate(){
            clearTimeout(this.timeOut);
        }

        selectClear():void{
            if (this.selectAppChain)
            while(this.selectAppChain.childNodes.length > 0){                
                this.selectAppChain.removeChild(this.selectAppChain.options[0]);
                this.selectAppChain.remove(0);   
                this.selectAppChain.options[0] = null;            
            }
        }

        async updateAppChain(){
            this.selectClear();
            var name2Hash = await AppChainTool.initAllAppChain();
            for (var chainName in name2Hash){
                var sitem = document.createElement("option");
                sitem.text = chainName;
                sitem.value = name2Hash[chainName];
                this.selectAppChain.appendChild(sitem);
            }
            this.selectAppChain.selectedIndex = this.selectIndex;
        }

        async initAppChain(title:HTMLDivElement){  
            var name2Hash = await AppChainTool.initAllAppChain()
            for (var chainName in name2Hash){
                var sitem = document.createElement("option");
                sitem.text = chainName;
                sitem.value = name2Hash[chainName];
                this.selectAppChain.appendChild(sitem);
            }
            this.selectAppChain.onchange = (ev) =>{
                this.updateHeight();
                this.mainAsset(title);
            }
        }

        async updateHeight(){
            this.selectIndex = this.selectAppChain.selectedIndex;
            this.chainHash = (this.selectAppChain.childNodes[this.selectIndex] as HTMLOptionElement).value; 
            var height = await WWW.api_getZoroHeight(this.chainHash);
            this.height.textContent = isNaN(height)?"N/A":height.toString(); 
        }

        start(): void
        {
            this.getLangs()

            this.login();           

            this.div.hidden = false;
			this.footer.hidden = false;
        }
        close(): void
        {
            this.stopUpdate();
            this.div.hidden = true;
			this.footer.hidden = true;
        }
    }
}