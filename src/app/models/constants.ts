import CryptoJS from 'crypto-js';

export class Constants {
    //static shaadmin = CryptoJS.SHA256(Math.random().toString()).toString(CryptoJS.enc.Hex)
    //static shaobs = CryptoJS.SHA256(Math.random().toString()).toString(CryptoJS.enc.Hex)
    static shaadmin = CryptoJS.SHA256("admin").toString(CryptoJS.enc.Hex)
    static shaobs = CryptoJS.SHA256("obs").toString(CryptoJS.enc.Hex)
}