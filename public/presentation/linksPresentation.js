let linksViewData

getLinksDataFromDB()

async function getLinksDataFromDB() {

    const response = await fetch('/api/links')
    let data = await response.json()
    showLinksData(data)
}

function showLinksData(data) {
    linksViewData = data
   for (var i = 0; i < data.length; i++) {
       document.getElementById('linksContainer').innerHTML += `<a id="${i}A" href="" target="_blank"><h2 class="text-center text-wrap" id="${i}Link"></h2></a>
             <button type="button" class="btn adminView" data-toggle="modal" data-target="#editLinkModal" onclick="populateModal(${i});">
        <img src="../assets/svg/pencil.svg" width="20em">
      </button>`
       document.getElementById(`${i}Link`).textContent = data[i].linkName
       document.getElementById(`${i}A`).href = data[i].linkLink
   }
    if (data[data.length - 1].credential) {
        var elements = document.getElementsByClassName('adminView');
        console.log(elements.length)
        for (let element of elements) {
            element.style.visibility = 'visible';
        }
    }
}

function populateModal(id) {
        console.log(linksViewData[id].linkName)
        document.getElementById('linkNameEdit').textContent = linksViewData[id].linkName
        document.getElementById('linkLinkEdit').textContent = linksViewData[id].linkLink
        document.getElementById('identifier').textContent = linksViewData[id].identifier
}