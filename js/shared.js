


var qrcode = "";

var currentLang="";

var julgran = 1;

var lastChoosenGran;

function choosenGran(gran){
 
  if(lastChoosenGran){
    document.getElementById("ida" + lastChoosenGran).classList.remove("treeSelected");

  }
  lastChoosenGran = gran;

  document.getElementById("btnNext").disabled = false;
  document.getElementById("buttonHolder").classList.add("cta");
  document.getElementById("buttonHolder").classList.remove("ctaInactive");
  document.getElementById("ida" + gran).classList.add("treeSelected");


  julgran = gran;
  }

  