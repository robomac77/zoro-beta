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
            putContract.style.width = "50%";
            putContract.textContent = "发布合约";
            putContract.onclick = () => {
                this.putContract(downBackGround);
            }
            putContract.click();

            var useContract = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(useContract)
            useContract.style.cssFloat = "left";
            useContract.style.width = "50%";
            useContract.textContent = "调用合约";
            useContract.onclick = () => {
                this.useContract(downBackGround);
            }            
        }

        useContract(div:HTMLDivElement){
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var contractBackGround = document.createElement('div') as HTMLDivElement;
            contractBackGround.style.width = "100%";
            contractBackGround.style.cssFloat = "left";
            div.appendChild(contractBackGround);

            var contractAVM = document.createElement("span") as HTMLSpanElement;
            contractAVM.style.color = "#eeeeee";
            contractAVM.textContent = "合约地址";
            contractBackGround.appendChild(contractAVM);

            var file = document.createElement('input') as HTMLInputElement;
            file.type = "file";
            contractBackGround.appendChild(file);

            var ContractAvm = null;
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

            // setTimeout(() => {
            //     AppChainTool.SendContractMethod(GUITool.chainHash, GUITool.pubkey, GUITool.prikey);
            // }, 15000);
        }

        putContract(div:HTMLDivElement){
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var contractBackGround = document.createElement('div') as HTMLDivElement;
            contractBackGround.style.width = "100%";
            contractBackGround.style.cssFloat = "left";
            div.appendChild(contractBackGround);

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
                    name.value, ContractAvm, GUITool.chainHash, GUITool.pubkey, GUITool.prikey);                
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
    }
}