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

            var chooseNative = document.createElement("div") as HTMLDivElement;
            contractBackGround.appendChild(chooseNative);

            var nativeBackGround = document.createElement('div') as HTMLDivElement;
            chooseNative.appendChild(nativeBackGround);

            var BoolNativeNep5 = null;
            select.onchange = () => {
                if ((select.childNodes[select.selectedIndex] as HTMLOptionElement).value != "NEO"){
                    if (chooseNative.firstChild)
                    chooseNative.removeChild(chooseNative.firstChild);

                    var nativeBackGround = document.createElement('div') as HTMLDivElement;
                    chooseNative.appendChild(nativeBackGround);

                    var nativeName = document.createElement('span') as HTMLSpanElement;
                    nativeBackGround.appendChild(nativeName);
                    nativeName.style.color = "#eeeeee";
                    nativeName.textContent = "选择是否NativeNep5类型";

                    BoolNativeNep5 = document.createElement('input') as HTMLInputElement;
                    BoolNativeNep5.type = "checkbox";
                    BoolNativeNep5.checked = false;
                    nativeBackGround.appendChild(BoolNativeNep5);  
                    
                    var nativeBackGround2 = document.createElement('div') as HTMLDivElement;
                    nativeBackGround.appendChild(nativeBackGround2);

                    BoolNativeNep5.onchange = () => {
                        if (BoolNativeNep5.checked) {
                            if (nativeBackGround2)
                            nativeBackGround.removeChild(nativeBackGround2);

                            nativeBackGround2 = document.createElement('div') as HTMLDivElement;
                            nativeBackGround.appendChild(nativeBackGround2);

                            this.createNativeContract(nativeBackGround2, select);
                        }else{
                            if (nativeBackGround2)
                            nativeBackGround.removeChild(nativeBackGround2);

                            nativeBackGround2 = document.createElement('div') as HTMLDivElement;
                            nativeBackGround.appendChild(nativeBackGround2);

                            this.createContract(nativeBackGround2, select);
                        }
                    }
                    this.createContract(nativeBackGround2, select);
                }else{
                    if (chooseNative.firstChild)
                    chooseNative.removeChild(chooseNative.firstChild);

                    var nativeBackGround = document.createElement('div') as HTMLDivElement;
                    chooseNative.appendChild(nativeBackGround);

                    this.createContract(nativeBackGround, select);
                }
            }
            this.createContract(nativeBackGround, select);
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

        createContract(nativeBackGround:HTMLDivElement, select:HTMLSelectElement){
            var ContractText = document.createElement('span') as HTMLSpanElement;
            ContractText.style.color = "#eeeeee";
            ContractText.textContent = "合约";
            nativeBackGround.appendChild(ContractText);

            var storageName = document.createElement('span') as HTMLSpanElement;
            storageName.style.color = "#eeeeee";
            storageName.textContent = "storage";
            nativeBackGround.appendChild(storageName);

            var need_storage = document.createElement('input') as HTMLInputElement;
            need_storage.type = "checkbox";
            need_storage.checked = false;
            nativeBackGround.appendChild(need_storage);

            var canChargeName = document.createElement('span') as HTMLSpanElement;
            canChargeName.style.color = "#eeeeee";
            canChargeName.textContent = "canCharge";
            nativeBackGround.appendChild(canChargeName);

            var need_canCharge = document.createElement('input') as HTMLInputElement;
            need_canCharge.type = "checkbox";
            need_canCharge.checked = false;
            nativeBackGround.appendChild(need_canCharge);

            var nameText = document.createElement('span') as HTMLSpanElement;
            nameText.style.color = "#eeeeee";
            nameText.textContent = "NAME";
            nativeBackGround.appendChild(nameText);

            var name = document.createElement('input') as HTMLInputElement;
            name.value = "name";
            nativeBackGround.appendChild(name);

            var versionText = document.createElement('span') as HTMLSpanElement;
            versionText.style.color = "#eeeeee";
            versionText.textContent = "VERSION";
            nativeBackGround.appendChild(versionText);

            var version = document.createElement('input') as HTMLInputElement;
            version.value = "1.0";
            nativeBackGround.appendChild(version);

            var autherText = document.createElement('span') as HTMLSpanElement;
            autherText.style.color = "#eeeeee";
            autherText.textContent = "AUTHOR";
            nativeBackGround.appendChild(autherText);

            var auther = document.createElement('input') as HTMLInputElement;
            auther.value = "auther";
            nativeBackGround.appendChild(auther);

            var emailText = document.createElement('span') as HTMLSpanElement;
            emailText.style.color = "#eeeeee";
            emailText.textContent = "EMAIL";
            nativeBackGround.appendChild(emailText);

            var email = document.createElement('input') as HTMLInputElement;
            email.value = "email";
            nativeBackGround.appendChild(email);

            var descriptionText = document.createElement('span') as HTMLSpanElement;
            descriptionText.style.color = "#eeeeee";
            descriptionText.textContent = "DESCRIPTION";
            nativeBackGround.appendChild(descriptionText);

            var description = document.createElement('input') as HTMLInputElement;
            description.value = "description";
            nativeBackGround.appendChild(description);

            var fileText = document.createElement('span') as HTMLSpanElement;
            fileText.style.color = "#eeeeee";
            fileText.textContent = "FILE";
            nativeBackGround.appendChild(fileText);

            var file = document.createElement('input') as HTMLInputElement;
            file.type = "file";
            nativeBackGround.appendChild(file);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            btnSend.textContent = "send";
            nativeBackGround.appendChild(btnSend);

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

        createNativeContract(nativeBackGround:HTMLDivElement, select:HTMLSelectElement){
            var nameText = document.createElement('span') as HTMLSpanElement;
            nameText.style.color = "#eeeeee";
            nameText.textContent = "NAME";
            nativeBackGround.appendChild(nameText);

            var name = document.createElement('input') as HTMLInputElement;
            name.value = "InvokeContractTest_NativeNEP5";
            nativeBackGround.appendChild(name);

            var symbolText = document.createElement('span') as HTMLSpanElement;
            symbolText.style.color = "#eeeeee";
            symbolText.textContent = "SYMBOL";
            nativeBackGround.appendChild(symbolText);

            var symbol = document.createElement('input') as HTMLInputElement;
            symbol.value = "InvokeContractTest";
            nativeBackGround.appendChild(symbol);

            var totalSupplyText = document.createElement('span') as HTMLSpanElement;
            totalSupplyText.style.color = "#eeeeee";
            totalSupplyText.textContent = "TotalSupply";
            nativeBackGround.appendChild(totalSupplyText);

            var totalSupply = document.createElement('input') as HTMLInputElement;
            totalSupply.value = "2000000000";
            nativeBackGround.appendChild(totalSupply);

            var presionText = document.createElement('span') as HTMLSpanElement;
            presionText.style.color = "#eeeeee";
            presionText.textContent = "Presion";
            nativeBackGround.appendChild(presionText);

            var presion = document.createElement('input') as HTMLInputElement;
            presion.value = "8";
            nativeBackGround.appendChild(presion);       

            var btnSend = document.createElement('button') as HTMLButtonElement;
            btnSend.textContent = "send";
            nativeBackGround.appendChild(btnSend);

            btnSend.onclick = async () => {           
                AppChainTool.SendNativeContract(parseInt(presion.value), parseInt(totalSupply.value), symbol.value, name.value, 
                (select.childNodes[select.selectedIndex] as HTMLOptionElement).value, GUITool.pubkey, GUITool.prikey);                           
            }    
        }
    }
}