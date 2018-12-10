/// <reference path="./Base.ts"/>
namespace WebBrowser
{
    export class GUI_Contract implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;   
        }

        showUI(){
            this.mainContract(this.div);
            GUI_Route.instance.hideUI(PageName.Title);
        }        

        hideUI(){

        }

        mainContract(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var contractBackGround = document.createElement('div') as HTMLDivElement;
            contractBackGround.style.width = "100%";
            contractBackGround.style.cssFloat = "left";
            div.appendChild(contractBackGround);

            var upBackGround = document.createElement('div') as HTMLDivElement;
            upBackGround.style.width = "100%";
            upBackGround.style.cssFloat = "left";
            contractBackGround.appendChild(upBackGround);

            var downBackGround = document.createElement('div') as HTMLDivElement;
            downBackGround.style.width = "100%";
            downBackGround.style.cssFloat = "left";
            contractBackGround.appendChild(downBackGround);

            var putContract = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(putContract)
            putContract.style.cssFloat = "left";
            putContract.style.width = "33%";
            putContract.textContent = "发布合约";
            putContract.onclick = () => {
                this.putContract(downBackGround);
            }
            putContract.click();

            var useContract = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(useContract)
            useContract.style.cssFloat = "left";
            useContract.style.width = "33%";
            useContract.textContent = "调用合约";
            useContract.onclick = () => {
                this.useContract(downBackGround, true);
            }
            
            var invokeContract = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(invokeContract)
            invokeContract.style.cssFloat = "left";
            invokeContract.style.width = "33%";
            invokeContract.textContent = "预调用合约";
            invokeContract.onclick = () => {
                this.useContract(downBackGround, false);
            }          
        }

        putContract(div:HTMLDivElement){
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var contractBackGround = document.createElement('div') as HTMLDivElement;
            contractBackGround.style.width = "100%";
            contractBackGround.style.cssFloat = "left";
            div.appendChild(contractBackGround);

            var asset = document.createElement('span') as HTMLSpanElement;
            contractBackGround.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "链名";

            var select = document.createElement("select") as HTMLSelectElement;
            contractBackGround.appendChild(select);
            AppChainTool.getChain(select);

            var ContractText = document.createElement('span') as HTMLSpanElement;
            ContractText.style.color = "#eeeeee";
            ContractText.textContent = "合约";
            contractBackGround.appendChild(ContractText);

            var storageName = document.createElement('span') as HTMLSpanElement;
            storageName.style.color = "#eeeeee";
            storageName.textContent = "storage";
            contractBackGround.appendChild(storageName);

            var need_storage = document.createElement('input') as HTMLInputElement;
            need_storage.type = "checkbox";
            need_storage.checked = false;
            contractBackGround.appendChild(need_storage);

            var canChargeName = document.createElement('span') as HTMLSpanElement;
            canChargeName.style.color = "#eeeeee";
            canChargeName.textContent = "canCharge";
            contractBackGround.appendChild(canChargeName);

            var need_canCharge = document.createElement('input') as HTMLInputElement;
            need_canCharge.type = "checkbox";
            need_canCharge.checked = false;
            contractBackGround.appendChild(need_canCharge);

            var nameText = document.createElement('span') as HTMLSpanElement;
            nameText.style.color = "#eeeeee";
            nameText.textContent = "NAME";
            contractBackGround.appendChild(nameText);

            var name = document.createElement('input') as HTMLInputElement;
            name.value = "name";
            contractBackGround.appendChild(name);

            var versionText = document.createElement('span') as HTMLSpanElement;
            versionText.style.color = "#eeeeee";
            versionText.textContent = "VERSION";
            contractBackGround.appendChild(versionText);

            var version = document.createElement('input') as HTMLInputElement;
            version.value = "1.0";
            contractBackGround.appendChild(version);

            var autherText = document.createElement('span') as HTMLSpanElement;
            autherText.style.color = "#eeeeee";
            autherText.textContent = "AUTHOR";
            contractBackGround.appendChild(autherText);

            var auther = document.createElement('input') as HTMLInputElement;
            auther.value = "auther";
            contractBackGround.appendChild(auther);

            var emailText = document.createElement('span') as HTMLSpanElement;
            emailText.style.color = "#eeeeee";
            emailText.textContent = "EMAIL";
            contractBackGround.appendChild(emailText);

            var email = document.createElement('input') as HTMLInputElement;
            email.value = "email";
            contractBackGround.appendChild(email);

            var descriptionText = document.createElement('span') as HTMLSpanElement;
            descriptionText.style.color = "#eeeeee";
            descriptionText.textContent = "DESCRIPTION";
            contractBackGround.appendChild(descriptionText);

            var description = document.createElement('input') as HTMLInputElement;
            description.value = "description";
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
                    name.value, ContractAvm, (select.childNodes[select.selectedIndex] as HTMLOptionElement).value, GUITool.pubkey, GUITool.prikey);               
            }

            var reader = new FileReader();
            reader.onload = (e: Event) =>
            {                
                ContractAvm = reader.result as ArrayBuffer;                                                           
            }   
            file.onchange = (ev: Event) =>
            {
                if (file.files.length > 0)
                if (file.files[0].name.includes(".avm"))
                {
                    reader.readAsArrayBuffer(file.files[0]);
                }
            }      
        }

        useContract(div:HTMLDivElement, use:boolean){
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var contractBackGround = document.createElement('div') as HTMLDivElement;
            contractBackGround.style.width = "100%";
            contractBackGround.style.cssFloat = "left";
            div.appendChild(contractBackGround);

            var asset = document.createElement('span') as HTMLSpanElement;
            contractBackGround.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "链名";

            var select = document.createElement("select") as HTMLSelectElement;
            contractBackGround.appendChild(select);
            AppChainTool.getChain(select);

            var fillinText = document.createElement("span") as HTMLSpanElement;
            fillinText.style.color = "#eeeeee";
            fillinText.textContent = "手动输入合约hash";
            contractBackGround.appendChild(fillinText);

            var HashFilein = document.createElement("input") as HTMLInputElement;
            HashFilein.type = "checkbox";
            HashFilein.checked = true;
            contractBackGround.appendChild(HashFilein);

            var hashBackGround = document.createElement("div") as HTMLDivElement;
            contractBackGround.appendChild(hashBackGround);
           
            var ContractAvm = null;
            var contractHash = null;
            var fileText = document.createElement("span") as HTMLSpanElement;
            fileText.style.color = "#eeeeee";
            fileText.textContent = "合约hash";
            hashBackGround.appendChild(fileText);

            ContractAvm = document.createElement("input") as HTMLInputElement;
            hashBackGround.appendChild(ContractAvm);
            HashFilein.onchange = () => {
                while(hashBackGround.children.length > 0){
                    hashBackGround.removeChild(hashBackGround.firstChild);
                }
                if (HashFilein.checked){
                    var fileText = document.createElement("span") as HTMLSpanElement;
                    fileText.style.color = "#eeeeee";
                    fileText.textContent = "合约hash";
                    hashBackGround.appendChild(fileText);

                    ContractAvm = document.createElement("input") as HTMLInputElement;
                    hashBackGround.appendChild(ContractAvm);
                }else{
                    ContractAvm = null;
                    var fileText = document.createElement("span") as HTMLSpanElement;
                    fileText.style.color = "#eeeeee";
                    fileText.textContent = "选择.avm文件";
                    hashBackGround.appendChild(fileText);
        
                    var file = document.createElement('input') as HTMLInputElement;
                    file.type = "file";
                    hashBackGround.appendChild(file);

                    var reader = new FileReader();
                    reader.onload = (e: Event) =>
                    {                
                        contractHash = reader.result as ArrayBuffer;      
                        contractHash = (new Neo.Uint160(Neo.Cryptography.RIPEMD160.computeHash(Neo.Cryptography.Sha256.computeHash(contractHash)))).toString();                                                
                    }   
                    file.onchange = (ev: Event) =>
                    {
                        if (file.files.length > 0)
                        if (file.files[0].name.includes(".avm"))
                        {
                            reader.readAsArrayBuffer(file.files[0]);
                        }
                    }      
                }
            }
            var methodBackGround = document.createElement("div") as HTMLDivElement;
            contractBackGround.appendChild(methodBackGround);

            var btnAddMethod = document.createElement("button") as HTMLButtonElement;
            btnAddMethod.textContent = "AddMethod";
            contractBackGround.appendChild(btnAddMethod);
            var JsonMethod = [];          
            btnAddMethod.onclick = () => {
                var json = {};
                JsonMethod.push(json);
                var params = [];
                var singleMethodBackGround = document.createElement("div") as HTMLDivElement;
                methodBackGround.appendChild(singleMethodBackGround); 

                var methodText = document.createElement("span") as HTMLSpanElement;
                methodText.style.color = "#eeeeee";
                methodText.textContent = "方法名";
                singleMethodBackGround.appendChild(methodText);

                var methodInput = document.createElement("input") as HTMLInputElement; 
                singleMethodBackGround.appendChild(methodInput);
                json["methodName"] = methodInput;
                json["params"] = params;               

                var paramsBackGround = document.createElement("div") as HTMLDivElement;
                singleMethodBackGround.appendChild(paramsBackGround);    
                
                var btnAddParams = document.createElement("button") as HTMLButtonElement;
                btnAddParams.textContent = "AddParams";
                singleMethodBackGround.appendChild(btnAddParams);
                
                btnAddParams.onclick = () => {
                    var singleParamsBackGround = document.createElement("div") as HTMLDivElement;
                    paramsBackGround.appendChild(singleParamsBackGround); 

                    var paramsText = document.createElement("span") as HTMLSpanElement;
                    paramsText.style.color = "#eeeeee";
                    paramsText.textContent = "参数";
                    singleParamsBackGround.appendChild(paramsText);
    
                    var paramsInput = document.createElement("input") as HTMLInputElement;
                    singleParamsBackGround.appendChild(paramsInput);
                    params.push(paramsInput);
                }
                
                var btnSubParams = document.createElement("button") as HTMLButtonElement;
                btnSubParams.textContent = "SubParams";
                singleMethodBackGround.appendChild(btnSubParams);
                btnSubParams.onclick = () => {
                    paramsBackGround.removeChild(paramsBackGround.lastChild);
                    params.pop();
                }
            }
            var btnSubMethod = document.createElement("button") as HTMLButtonElement;
            btnSubMethod.textContent = "SubMethod";
            contractBackGround.appendChild(btnSubMethod);
            btnSubMethod.onclick = () => {
                methodBackGround.removeChild(methodBackGround.lastChild);
                JsonMethod.pop();
            }

            var btnSend = document.createElement('button') as HTMLButtonElement;
            btnSend.textContent = "send";
            contractBackGround.appendChild(btnSend);

            var txText = document.createElement("span") as HTMLSpanElement;
            txText.style.color = "#eeeeee";            
            contractBackGround.appendChild(txText); 

            var txMessage = null;
            btnSend.onclick = async () => {    
                if (ContractAvm){
                    contractHash = ContractAvm.value;
                } 
                else if (!contractHash){        
                    alert("hash not available!");
                    return;
                }
                var json = [];
                for (var i = 0; i < JsonMethod.length; i++) {
                    var singleJson = {};
                    var array = [];
                    for (var j = 0; j < JsonMethod[i]["params"].length; j++){
                      var s = JsonMethod[i]["params"][j].value;
                      array.push(s);
                    }
                    singleJson["params"] = array;
                    singleJson["methodName"] = JsonMethod[i]["methodName"].value;
                    json.push(singleJson);
                }
                if (use){
                    txMessage = await AppChainTool.SendContractMethod((select.childNodes[select.selectedIndex] as HTMLOptionElement).value, GUITool.pubkey, GUITool.prikey, json, contractHash);
                }else{
                    txMessage = await AppChainTool.SendInvokeContractMethod((select.childNodes[select.selectedIndex] as HTMLOptionElement).value, GUITool.pubkey, GUITool.prikey, json, contractHash);
                    txMessage = JSON.stringify(txMessage);
                }
                txText.textContent = (use?"txid = ":"invokeMessage = ") + (txMessage as string);
            }       
            
            
        }
    }
}