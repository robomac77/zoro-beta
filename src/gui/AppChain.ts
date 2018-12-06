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


                var pubkeyList = document.createElement('span') as HTMLSpanElement;
                pubkeyList.style.color = "#eeeeee";
                pubkeyList.textContent = "共识节点数量";
                appChainBackGround.appendChild(pubkeyList);
                
                var pubkeyListNumber = document.createElement('input') as HTMLInputElement;
                pubkeyListNumber.type = "number";
                appChainBackGround.appendChild(pubkeyListNumber);

                var pbutton = document.createElement("button") as HTMLButtonElement;
                appChainBackGround.appendChild(pbutton);
                pbutton.textContent = "确认";
                pbutton.onkeyup = () => {
                    if (pbutton.value.length == 1){
                        pbutton.value = pbutton.value.replace(/[^1-9]/g,'')
                    }else{
                        pbutton.value = pbutton.value.replace(/\D/g,'');
                    }
                }
                pbutton.onpaste = () => {
                    if (pbutton.value.length == 1){
                        pbutton.value = pbutton.value.replace(/[^1-9]/g,'')
                    }else{
                        pbutton.value = pbutton.value.replace(/\D/g,'');
                    }
                }
                var back = document.createElement("div");
                appChainBackGround.appendChild(back);
                var pubkey = [];
                pbutton.onclick = () => {
                    if (parseInt(pubkeyListNumber.value) < 4){
                        alert("it must be >= 4");
                        return;
                    }
                    while(back.children.length>0){
                        back.removeChild(back.firstChild);
                    }
                    for (let i = 0; i < parseInt(pubkeyListNumber.value); i++){
                        var pkey1 = document.createElement('span') as HTMLSpanElement;
                        pkey1.style.color = "#eeeeee";
                        pkey1.textContent = "选择公钥" + (i+1);
                        back.appendChild(pkey1);
            
                        pubkey.push(AppChainTool.createSelect(back, "pubkey", i + 1));
                    }
                }

                var ipList = document.createElement('span') as HTMLSpanElement;
                ipList.style.color = "#eeeeee";
                ipList.textContent = "种子节点数量";
                appChainBackGround.appendChild(ipList);
                
                var ipListNumber = document.createElement('input') as HTMLInputElement;
                ipListNumber.type = "number";
                appChainBackGround.appendChild(ipListNumber);

                var ipbutton = document.createElement("button") as HTMLButtonElement;
                appChainBackGround.appendChild(ipbutton);
                ipbutton.textContent = "确认";
                ipbutton.onkeyup = () => {
                    if (ipbutton.value.length == 1){
                        ipbutton.value = ipbutton.value.replace(/[^1-9]/g,'')
                    }else{
                        ipbutton.value = ipbutton.value.replace(/\D/g,'');
                    }
                }
                ipbutton.onpaste = () => {
                    if (ipbutton.value.length == 1){
                        ipbutton.value = ipbutton.value.replace(/[^1-9]/g,'')
                    }else{
                        ipbutton.value = ipbutton.value.replace(/\D/g,'');
                    }
                }
                var backip = document.createElement("div");
                appChainBackGround.appendChild(backip);
                var ip = [];
                var port = [];
                ipbutton.onclick = () => {
                    if (parseInt(ipListNumber.value) < 1){
                        alert("it must be >= 1");
                        return;
                    }
                    while(backip.children.length>0){
                        backip.removeChild(backip.firstChild);
                    }
                    for (let i = 0; i < parseInt(ipListNumber.value); i++){
                        var seed1= document.createElement('span') as HTMLSpanElement;
                        seed1.style.color = "#eeeeee";
                        seed1.textContent = "选择种子地址" + (i+1);
                        backip.appendChild(seed1);

                        ip.push(AppChainTool.createSelect(backip, "ip", i + 1));

                        let port1 = document.createElement('input') as HTMLInputElement;
                        port1.value = "15000";
                        backip.appendChild(port1);
                        port.push(port1);
                    }
                }          

            var btnCreate = document.createElement('button') as HTMLButtonElement;
            btnCreate.textContent = "创建";
            btnCreate.onclick = () => {
                var listpubkey = [];
                for (let i = 0; i < parseInt(pubkeyListNumber.value); i++){
                    listpubkey.push((pubkey[i].childNodes[pubkey[i].selectedIndex] as HTMLOptionElement).value);
                }
                var listip = [];
                for (let i = 0; i < parseInt(ipListNumber.value); i++){
                    listpubkey.push((ip[i].childNodes[ip[i].selectedIndex] as HTMLOptionElement).value +":" + port[i].value);
                }
                AppChainTool.SendCreateAppChain(name.value, GUITool.pubkey, listpubkey, listip, GUITool.prikey, "0000000000000000000000000000000000000000");
            }
            appChainBackGround.appendChild(btnCreate);
        }
    }
}