/// <reference path="./LangBase.ts" />

namespace WebBrowser
{
    export class LangCN extends LangBase {

        lang = {

            connect_nodes_error: "服务器通讯异常，请刷新重新链接！",

            // navbar
            nav_indexa: "浏览器",

            nav_browsea: "浏览",
            nav_blocka: "区块",
            nav_txlista: "交易",
            nav_addrsa: "地址",

            nav_guia:"钱包",
            nav_asseta: "应用链",

            nav_errContent: "请输入正确的地址",

            // network
            net_testa: "测试网",
            net_maina: "主网",

            net_cn: "中文",
            net_en: "English",

            // index
            i_summary: "统计",
            i_lastblock: "上一个区块",
            i_allblock: "查看所有区块",
            i_totaltrans: "交易总数",
            i_alltxlist: "查看所有交易",
            i_walletcreate: "已创建的钱包地址数",
            i_alladdress: "查看所有地址",
            i_last10: "最新的10个区块",

            i_appchain:"哈希",
            i_last10_height: "高度",
            i_last10_size: "大小",
            i_last10_ctm: "创建时间",
            i_last10_txcount: "交易数量",
            i_viewblocks: "查看所有 >>>>",
            i_last10t: "最新的10笔交易",
            i_last10t_txid: "交易ID",
            i_last10t_type: "类型",
            i_last10t_height: "高度",
            i_last10t_size: "大小",
            i_viewtxlist: "查看所有 >>>>",

            i_assets_title:"资产",
            i_nep5assets_asset : "资产ID",
	        i_nep5assets_ava: "资产全称",
			i_nep5assets_pre: "总量",
			i_nep5assets_val: "资产", 
			i_nep5assets_id: "小数点后位数", 

            // blocks
            blocks_title: "区块列表",
            blocks_hash: "块哈希",
            blocks_height: "区块高度",
            blocks_size: "大小",
            blocks_time: "时间",
            blocks_txcount: "交易数量",
            // block
            block_info_title: "区块信息",

			blocks_appchain: "应用链",

            block_info_block: "区块",
            block_info_hash: "哈希",
            block_info_time: "时间",
            block_info_size: "大小",
            block_info_pre: "上一个区块",
            block_info_next: "下一个区块",
            block_info_tran: "交易",
            block_info_txid: "交易ID",
            block_info_type: "类型",
            block_info_txsize: "大小",
            block_info_ver: "版本",
			block_goallblock: "返回",

			// app chain block
            acblock_info_title: "应用链区块列表",
            acblock_info_appchain: "应用链哈希",
			acblock_info_block: "区块",
			acblock_info_hash: "哈希",
			//block_info_chainhash: "App Chain Hash",
			acblock_info_time: "时间",
			acblock_info_size: "大小",
			acblock_info_pre: "上一个块",
			acblock_info_next: "下一个快",
			acblock_info_tran: "交易",
			acblock_info_txid: "交易ID",
			acblock_info_type: "类型",
			acblock_info_txsize: "大小",
			acblock_info_ver: "版本",
			acblock_goallblock: "返回",

            // transactions
            trans_title: "交易列表",
            trans_txid: "交易ID",
            trans_type: "类型",
            trans_size: "大小",
            trans_height: "区块高度",

            // transaction
            tran_title: "交易信息",
            tran_title_1: "交易",
            tran_txid: "交易ID",
            tran_type: "类型",
            tran_netfee: "网络费用",
            tran_sysfee: "系统费用",
            tran_size: "大小",
            tran_height: "区块高度",
            tran_time: "时间",
            tran_input: "输入",
            tran_output: "输出",

            tran_nep5: "Nep5",
            tran_nep5_asset: "资产",
            tran_nep5_from: "转出",
            tran_nep5_to: "转入",
            tran_nep5_value: "交易数",

			tran_goalltran: "返回",

			// appchain transaction
			actran_title: "应用链交易列表",
			actran_title_1: "交易",
			actran_txid: "交易ID",
			actran_type: "类型",
			actran_netfee: "网络费用",
			actran_sysfee: "系统费用",
			actran_size: "大小",
			actran_height: "区块高度",
			actran_time: "时间",
			actran_input: "输入",
			actran_output: "输出",

			actran_nep5: "Nep5",
			actran_nep5_asset: "资产",
			actran_nep5_from: "从",
			actran_nep5_to: "到",
			actran_nep5_value: "价值",

			actran_goalltran: "返回",


            // addresses
            addrs_title: "地址列表",
            addrs_addr: "地址",
            addrs_first: "首次交易时间",
            addrs_last: "上次交易时间",
            addrs_txcount: "交易笔数",

            // address
            addr_title: "地址详情",
            addr_addr: "地址",
            addr_ctm: "创建时间",
            addr_tran: "交易总数",

            addr_title2: "资产",
            addr_title3: "交易",
            addr_txid: "交易ID",
            addr_type: "交易高度",
            addr_time: "时间",

            addr_utxo_asset: "资产",
            addr_utxo_number: "交易数量",
            addr_utxo_txid: "交易ID",


            addr_goalladress: "返回",


            // appchains

            assets_title: "应用链",
            assets_asset: "应用链名",
            assets_id: "应用链哈希",
            assets_type: "创建者",
            assets_ava: "生成时间",
            assets_pre: "应用链版本",
			

			//nep5assets

			nep5assets_asset : "资产ID",
	        nep5assets_ava: "资产全称",
			nep5assets_pre: "总量",
			nep5assets_val: "资产", 
			nep5assets_id: "小数点后位数", 

            //nep5assetinfo
            nep5asset_title:"资产详情",
			nep5assetid: "资产ID",
			nep5name: "所属",
			nep5assettotalsupply: "总量",
			nep5symbol: "应用链资产",
            nep5decimals: "小数点后位数", 
            back_chainmessage:"返回",

            // appchain
			asset_title: "应用链信息",
			asset_id: "应用链",
			asset_asset: "应用链名",
            asset_type: "生成时间",
			asset_ava: "种子节点",

			asset_pre: "共识节点",
			asset_adm: "创建者",
			asset_title2: "应用链区块",

			asset_rank:"哈希",
            asset_addr: "大小",
			asset_balance: "时间",
			asset_blockheight: "高度",
			asset_tx: "交易数",
            asset_title3: "应用链交易",
            asset_txid: "交易ID",
            asset_from: "类型",
            asset_to: "大小",
            asset_height: "区块高度",
            asset_goallasset: "返回",
            no_data: "没有数据",

            ac_last10: "最新的10个区块",
            ac_appchain:"哈希",
            ac_last10_height: "高度",
            ac_last10_size: "大小",
            ac_last10_ctm: "创建时间",
            ac_last10_txcount: "交易数量",
            ac_viewblocks: "查看所有 >>>>",
            ac_last10t: "最新的10笔交易",
            ac_last10t_txid: "交易ID",
            ac_last10t_type: "类型",
            ac_last10t_height: "高度",
            ac_last10t_size: "大小",
            ac_viewtxlist: "查看所有 >>>>",
            ac_chaindata:"应用链数据",
            ac_assets_title:"资产",
            ac_nep5assets_asset : "资产ID",
	        ac_nep5assets_ava: "资产全称",
			ac_nep5assets_pre: "总量",
			ac_nep5assets_val: "资产", 
            ac_nep5assets_id: "小数点后位数", 
            ac_summary: "统计",
            ac_lastblock: "上一个区块",
            ac_allblock: "查看所有区块",
            ac_totaltrans: "交易总数",
            ac_alltxlist: "查看所有交易",
            ac_walletcreate: "已创建的钱包地址数",
            ac_alladdress: "查看所有地址",
        }
    }
}
