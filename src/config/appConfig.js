import React, {
    Platform
} from 'react-native';

export const appDomainBase = {
    base1: 'https://38fo28gk.czdelong.com',
    base2: 'https://38fo28gk.fdk800.com',
    base3: 'https://38fo28gk.jdzdingli.com',
    base4: 'https://hosobw29.czdelong.com',
    base5: 'https://hosobw29.jdzdingli.com',
    base6: 'https://hosobw29.fdk800.com',
    base7: 'https://www.vdfrtw654qefhj.com',
}

export let configAppId = "1146"


export const AppConfig = {
    allowFontScaling: true,
    domains: [
        appDomainBase.base1,
        appDomainBase.base2,
        appDomainBase.base3
    ],
    backupDomains: [
        appDomainBase.base4,
        appDomainBase.base5,
        appDomainBase.base6
    ]
}


export const MyAppName = '梦想游戏';

export const versionHotFix = 'mxqp-3——23';

export const safeguardDomain = [
    "https://37a9aea1be8915f4998443873ec90db0.oss-cn-shenzhen.aliyuncs.com",
    "https://37a9aea1be8915f4998443873ec90db0.s3-accelerate.amazonaws.com",
    "https://37a9aea1be8915f4998443873ec90db0.azureedge.net"]


export const platInfo = {
    loginDomain:"https://38fo28gk.czdelong.com",
    gameDomain:"https://yw8txj2e.pgzlwx.com",

    zipCheckServer: {
        debug_server: "http://192.168.14.70:8888",
        release_server: "https://download.hkbaoxian188.com/game/release/mxaw7"
    },
    platId: configAppId,
    brand: "mxqp",
    channel: {}
}

export const affCodeList = {
    ios: {
        '2.9.6': 'mxaw7_ios'
    },
    android: {
        '2.10.11': 'mxaw7_android'
    }
};
