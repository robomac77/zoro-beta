/// <reference path="./Base.ts"/>
/// <reference path="./GUIRoute.ts"/>
namespace WebBrowser
{
    export class GUI_Login implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;   
        }

        showUI(){
            this.login();
        }        

        hideUI(){

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
                            GUITool.prikey = result as Uint8Array;
                            GUITool.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(GUITool.prikey);
                            GUITool.address = ThinNeo.Helper.GetAddressFromPublicKey(GUITool.pubkey);
                            GUI_Route.instance.showUI(PageName.MainView);
                        }
                    }
                    );
                }                
            };

            var createWallet = document.createElement("button");
            loginbackground.appendChild(createWallet);
            createWallet.textContent = "创建钱包";
            createWallet.onclick = () => {
                GUI_Route.instance.showUI(PageName.Wallet);
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
                if (file.files.length > 0)
                if (file.files[0].name.includes(".json"))
                {
                    reader.readAsText(file.files[0]);
                }
            }

        }
    }
}