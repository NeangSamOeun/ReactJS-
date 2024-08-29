exports.TOKEN_KEY = "lLEJDEIRNCUEHREUCVE)@#$)FKWRUJD@#!FW@3WEW_WEW@3%^WEWEWE"
exports.REFRESH_KEY = "HSEIRI)#$KSFOOW@FSDKLFSKFDKKSDFA$%SD&DSLKFS234234!@32K"

 exports.isEmptyOneNull = (value) =>{
    if(value == "" || value == null || value == undefined){
        return true
    }
    return false
} 

exports.invoiceNumber = (number) =>{
    var str = "" + (number+1);
    var pad = "0000"
    var invoice = pad.substring(0, pad.length - str.length) + str;
    return "INV"+invoice
}
// module.exports = invoice
// module.exports = isEmptyOneNull