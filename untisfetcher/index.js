const axios = require("axios");
const fetch = require('node-fetch');
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");
var fs = require('fs');
const utf8 = require('utf8');
const iconv = require('iconv');
const { networkInterfaces } = require("os");

var vertretungenarray = [];

var siteindex = 1;
var urlarray = ["subst_001.htm"];

async function getVertretungen(url) {
    await fetch(url,
        {
            headers: {"Content-Type": "text/html; charset=UTF-8"}
        }
    )
    .then(response => response.arrayBuffer())
    .then(function(data) { 
        let decoder = new TextDecoder("iso-8859-1")
        let htmlContent = decoder.decode(data);
        let soup = new JSSoup(htmlContent);
        const vertretungenBlock = soup.find("table", { class: 'mon_list' });
        const vertretungenodd = vertretungenBlock.findAll("tr");
        const vertretungenspalten = vertretungenBlock.findAll('tr', { class: 'list' });

        if(siteindex === 1){
            for (let spalte of vertretungenspalten) {
                let tmparray = [];
                const vertretungdefinition = spalte.findAll("th");
                for (let details of vertretungdefinition){
                    tmparray.push(details.text);
                }
                if(tmparray.length === 0){
                }else{
                    vertretungenarray.push(tmparray);
                    console.log("Felderbeschreibung hinzugefügt");
                }
            }
        }

        for (let vertretung of vertretungenodd) {
            let tmparray = [];
            const vertretungsdetails = vertretung.findAll("td");
            for (let details of vertretungsdetails){
                tmparray.push(details.text);
            }
            if(tmparray.length === 0){
            }else{
                vertretungenarray.push(tmparray);
            }
        }
    })
    siteindex = siteindex + 1;

    var json = JSON.stringify(vertretungenarray, null, 4).replaceAll('&nbsp;', ' ');
    fs.writeFile('vertretungen.json', json, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
    }});
}

async function checkSites(base_url){
    var nextpage = true;
    var erweiterung = "subst_001.htm";

    while(nextpage === true){
        var url = base_url + erweiterung;
        console.log("Weitere Seite gefunden: " + url);
        nextpage = false;
        await fetch(url,
            {
                headers: {"Content-Type": "text/html; charset=UTF-8"}
            }
        ).then(response => response.text())
        .then(function(text) { 
            let soup = new JSSoup(text);
            const nextsite = soup.findAll("meta");
            for (let meta of nextsite){
                if(meta.attrs.content.includes("subst_002.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_002.htm";
                    erweiterung = "subst_002.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_003.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_003.htm";
                    erweiterung = "subst_003.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_004.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_004.htm";
                    erweiterung = "subst_004.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_005.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_005.htm";
                    erweiterung = "subst_005.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_006.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_006.htm";
                    erweiterung = "subst_006.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_007.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_007.htm";
                    erweiterung = "subst_007.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_008.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_008.htm";
                    erweiterung = "subst_008.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_009.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_009.htm";
                    erweiterung = "subst_009.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }else if (meta.attrs.content.includes("subst_010.htm") === true){
                    
                    nextsitevorhanden = true;
                    var url_html = "subst_010.htm";
                    erweiterung = "subst_010.htm";
                    urlarray.push(url_html);
                    nextpage = true;
                }
            }
        })
    }
    console.log(urlarray.length + " Seiten gefunden");
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


function downloadVPlan(base_url){
    console.log("===== Suche weitere Seiten =====")
    const newurl = base_url.replace('subst_001.htm', '');
    checkSites(newurl).then(function() {
        console.log("===== Starte Analyse des Vertretungsplanes =====")
        for(let url_end of urlarray){
            var tmp_url = newurl + url_end;
            sleep(2500);
            getVertretungen(tmp_url);
            sleep(2500);
        }
        console.log("===== Analyse abgeschlossen; Ergebnisse sind in der vertretungen.json =====")
    })
}

downloadVPlan("https://igs-h.de/iserv/public/plan/show/Vertretungsplan/b21da129738497b4/heute/subst_001.htm");

