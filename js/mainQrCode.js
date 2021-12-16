
webpage = "https://prototypes.digitaltinnovationscenter.se/xmas21/viewer.html";
var webpageQuery = window.location.search;

var text = webpageQuery.split('|')
var language=document.getElementById("language").value;
newTxt = text[0].split('?')


const encrypt = (text) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  };
  
  const decrypt = (data) => {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  };

createQR(webpage , newTxt[1], text[1], text[2], language);



function createQR(webpage , julgran, formJulHalsningId, txtSenderName, language){


    const queryText = formJulHalsningId + '|' + txtSenderName + '|' + language + '|' + julgran;



    const queryTextEncrypted = encrypt(queryText);
   
    qrcode = new QRCode(document.getElementById("qrcode"), {
                text: webpage + "?data=" + queryTextEncrypted,
                logo: "assets/markers/kanji.png",
                width: 350,
                dotScale: 1,
                dotScaleTiming: 1,
                height: 350,
                logoWidth: 150,
                logoHeight: 150,
                colorDark : "#001100",
                colorLight : "#88dd88",
                logoBackgroundColor: '#ffffff',
                logoBackgroundTransparent: false,
                
                
            });
            
          
}

function stringToHash(string) {
                  
    var hash = '';
    

    if (string.length == 0) return hash;
      
    for (i = 0; i < string.length; i++) {
       hash += string.charCodeAt(i);

    }
      
    return hash;
}

function getQRCode(doc){

          //Save QR code as file on local computer
          const a = document.createElement("a");
          a.href = qrcode._oDrawing._elCanvas.toDataURL("image/png");
          a.download = "QRCode.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
}
