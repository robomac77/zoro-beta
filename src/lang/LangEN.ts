/// <reference path="./LangBase.ts" />

namespace WebBrowser
{
    export class LangEN extends LangBase {

        lang = {

            connect_nodes_error: "Abnormal connection with the server, please refresh and reconnect.",

            // navbar
            nav_indexa: "Explorer",

            nav_browsea: "Browse",
            nav_blocka: "Blocks",
            nav_txlista: "Transactions",
            nav_addrsa: "Addresses",
            nav_guia:"WEB-GUI",

            nav_asseta: "App Chains",

            nav_errContent: "Please enter the correct address",

            // network
            net_testa: "TestNet",
            net_maina: "MainNet",

            net_cn: "中文",
            net_en: "English",

            // index
            i_summary: "Dashboard",
            i_lastblock: "Last block",
            i_allblock: "View all blocks",
            i_totaltrans: "Total transactions",
            i_alltxlist: "View all transactions",
            i_walletcreate: "Wallet address created",
            i_alladdress: "View all addresses",
            i_last10: "Last 10 Blocks",
            i_appchain: "Hash",
            i_last10_height: "Height",
            i_last10_size: "Size",
            i_last10_ctm: "Time Created",
            i_last10_txcount: "Tx count",
            i_viewblocks: "View all >>>>",
            i_last10t: "Last 10 Transactions",
            i_last10t_txid: "TXID",
            i_last10t_type: "Type",
            i_last10t_height: "Height",
            i_last10t_size: "Size",
            i_viewtxlist: "View all >>>>",

            i_assets_title:"Asset",
            i_nep5assets_asset: "Asset ID",
			i_nep5assets_ava: "Name",
			i_nep5assets_pre: "Total Supply",
			i_nep5assets_val: "Symbol",
			i_nep5assets_id: "Decimals", 

            // blocks
            blocks_title: "Blocks",
            blocks_hash: "Hash",
			blocks_appchain: "Hash",
            blocks_height: "Height",
            blocks_size: "Size",
            blocks_time: "Time",
            blocks_txcount: "Tx count",
            // block
            block_info_title: "Block Information",
            block_info_block: "Block",
			block_info_hash: "Hash",
			//block_info_chainhash: "App Chain Hash",
            block_info_time: "Time",
            block_info_size: "Size",
            block_info_pre: "Previous Block",
            block_info_next: "Next Block",
            block_info_tran: "Transactions",
            block_info_txid: "TXID",
            block_info_type: "Type",
            block_info_txsize: "Size",
            block_info_ver: "Version",
            block_goallblock: "Back to all blocks",

            // app chain block
            acblock_info_title: "App Chain Block Information",
            acblock_info_appchain: "AppChain Hash",
            acblock_info_block: "Block",
			acblock_info_hash: "Hash",
			//block_info_chainhash: "App Chain Hash",
            acblock_info_time: "Time",
            acblock_info_size: "Size",
           acblock_info_pre: "Previous Block",
            acblock_info_next: "Next Block",
            acblock_info_tran: "Transactions",
            acblock_info_txid: "TXID",
            acblock_info_type: "Type",
            acblock_info_txsize: "Size",
            acblock_info_ver: "Version",
            acblock_goallblock: "Back to all blocks",

            // transactions
            trans_title: "Transactions",
            trans_txid: "TXID",
            trans_type: "Type",
            trans_size: "Size",
            trans_height: "Height",

            // transaction
            tran_title: "Transaction Information",
            tran_title_1: "Transaction",
            tran_txid: "TXID",
            tran_type: "Type",
            tran_netfee: "Network Fee",
            tran_sysfee: "System Fee",
            tran_size: "Size",
            tran_height: "Height",
            tran_time: "Time",
            tran_input: "Input",
            tran_output: "Output",

            tran_nep5: "Nep5",
            tran_nep5_asset: "Asset",
            tran_nep5_from: "From",
            tran_nep5_to: "To",
            tran_nep5_value: "Value",

            tran_goalltran: "Back to all transactions",

            // appchain transaction
            actran_title: "App Chain Transaction Information",
            actran_title_1: "Transaction",
            actran_txid: "TXID",
            actran_type: "Type",
            actran_netfee: "Network Fee",
            actran_sysfee: "System Fee",
            actran_size: "Size",
            actran_height: "Height",
            actran_time: "Time",
            actran_input: "Input",
            actran_output: "Output",

            actran_nep5: "Nep5",
            actran_nep5_asset: "Asset",
            actran_nep5_from: "From",
            actran_nep5_to: "To",
            actran_nep5_value: "Value",

			actran_goalltran: "Back to all app chain transactions",

			



            // addresses
            addrs_title: "Address list",
            addrs_addr: "Address",
            addrs_first: "First transaction time",
            addrs_last: "Last transaction time",
            addrs_txcount: "Txcount",

            // address
            addr_title: "Address Information",
            addr_addr: "Address",
            addr_ctm: "Created",
            addr_tran: "Transactions",

            addr_title2: "Balance",
            addr_title3: "Transactions",
            addr_txid: "TXID",
            addr_type: "Height",
            addr_time: "Time",

            addr_utxo_asset: "Asset",
            addr_utxo_number: "Number",
            addr_utxo_txid: "TXID",


            addr_goalladress: "Back to all addresses",


            // assets
            assets_title: "App Chains",
            assets_asset: "App Chain Name",
            assets_id: "App Chain Hash",
            assets_type: "Owner",
            assets_ava: "Time Created",
			assets_pre: "Version",
			

			//nep5assets

			nep5assets_asset: "Asset ID",
			nep5assets_ava: "Name",
			nep5assets_pre: "Total Supply",
			nep5assets_val: "Symbol",
			nep5assets_id: "Decimals", 

            //nep5assetinfo
            nep5asset_title:"Asset Information",
		    nep5assetid: "Asset ID",
			nep5name: "Name",
			nep5assettotalsupply: "Total Supply",
			nep5symbol: "Symbol",
            nep5decimals: "Decimals", 
            back_chainmessage: "Back to chain message",

            // asset
            asset_title: "App Chain Information",
            asset_id: "App Chain Hash",
            asset_asset: "App Chain Name",
            asset_type: "Time Created",
            asset_ava: "Seed",
			asset_pre: "Validator",
			asset_adm: "Owner",


            asset_title2: "App Chain Blocks",
            asset_rank: "Hash",
            asset_addr: "Size",
			asset_balance: "Time",
			asset_blockheight: "Height",
			asset_tx: "Tx Count",
            asset_title3: "App Chain Transactions",
            asset_txid: "TXID",
            asset_from: "Type",
            asset_to: "Size",
            asset_height: "Height",
            asset_goallasset: "Back to all app chains",
            no_data: "There is no data",

            ac_last10: "Last 10 Blocks",
            ac_appchain: "Hash",
            ac_last10_height: "Height",
            ac_last10_size: "Size",
            ac_last10_ctm: "Time Created",
            ac_last10_txcount: "Tx count",
            ac_viewblocks: "View all >>>>",
            ac_last10t: "Last 10 Transactions",
            ac_last10t_txid: "TXID",
            ac_last10t_type: "Type",
            ac_last10t_height: "Height",
            ac_last10t_size: "Size",
            ac_viewtxlist: "View all >>>>",
            ac_chaindata:"AppChain Data",
            ac_assets_title:"Asset",
            ac_nep5assets_asset : "AssetID",
	        ac_nep5assets_ava: "Name",
			ac_nep5assets_pre: "Total Supply",
			ac_nep5assets_val: "Symbol",
            ac_nep5assets_id: "Decimals", 
            ac_summary: "Dashboard",
            ac_lastblock: "Last block",
            ac_allblock: "View all blocks",
            ac_totaltrans: "Total transactions",
            ac_alltxlist: "View all transactions",
            ac_walletcreate: "Wallet address created",
            ac_alladdress: "View all addresses",
        }
    }
}
