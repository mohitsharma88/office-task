module.exports = {
    record :function(totalData){
        let str="";
        for(let iCnt=1;iCnt<=totalData;iCnt++){
            str += "<input type='button' value='"+iCnt+"' class='pageTravers'>"
        }
        return str;
    }
} 