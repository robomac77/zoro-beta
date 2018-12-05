/// <reference path="./Base.ts"/>
namespace WebBrowser
{
    export class GUI_AppChain implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;   
        }

        showUI(){
            this.mainAppChain(this.div);
            GUI_Route.instance.hideUI(PageName.Title);
        }        

        hideUI(){

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
            var port1 = document.createElement('input') as HTMLInputElement;
            port1.value = "15000";
            appChainBackGround.appendChild(port1);

            var seed2= document.createElement('span') as HTMLSpanElement;
            seed2.style.color = "#eeeeee";
            seed2.textContent = "选择种子地址2";
            appChainBackGround.appendChild(seed2);

            var ip2 = AppChainTool.createSelect(appChainBackGround, "ip", 7);
            var port2 = document.createElement('input') as HTMLInputElement;
            port2.value = "15000";
            appChainBackGround.appendChild(port2);

            var seed3 = document.createElement('span') as HTMLSpanElement;
            seed3.style.color = "#eeeeee";
            seed3.textContent = "选择种子地址3";
            appChainBackGround.appendChild(seed3);

            var ip3 = AppChainTool.createSelect(appChainBackGround, "ip", 8);
            var port3 = document.createElement('input') as HTMLInputElement;
            port3.value = "15000";
            appChainBackGround.appendChild(port3);

            var seed4= document.createElement('span') as HTMLSpanElement;
            seed4.style.color = "#eeeeee";
            seed4.textContent = "选择种子地址4";
            appChainBackGround.appendChild(seed4);

            var ip4 = AppChainTool.createSelect(appChainBackGround, "ip", 9);
            var port4 = document.createElement('input') as HTMLInputElement;
            port4.value = "15000";
            appChainBackGround.appendChild(port4);

            var btnCreate = document.createElement('button') as HTMLButtonElement;
            btnCreate.textContent = "创建";
            btnCreate.onclick = () => {
                var pubkey = [(pubkey1.childNodes[pubkey1.selectedIndex] as HTMLOptionElement).value,
                (pubkey2.childNodes[pubkey2.selectedIndex] as HTMLOptionElement).value,
                (pubkey3.childNodes[pubkey3.selectedIndex] as HTMLOptionElement).value,
                (pubkey4.childNodes[pubkey4.selectedIndex] as HTMLOptionElement).value];
                var ip = [(ip1.childNodes[ip1.selectedIndex] as HTMLOptionElement).value + ":" + port1.value,
                (ip2.childNodes[ip2.selectedIndex] as HTMLOptionElement).value + ":" + port2.value,
                (ip3.childNodes[ip3.selectedIndex] as HTMLOptionElement).value + ":" + port3.value,
                (ip4.childNodes[ip4.selectedIndex] as HTMLOptionElement).value + ":" + port4.value];

                AppChainTool.SendCreateAppChain(name.value, GUITool.pubkey, pubkey, ip, GUITool.prikey, "0000000000000000000000000000000000000000");
            }
            appChainBackGround.appendChild(btnCreate);
        }
    }
}