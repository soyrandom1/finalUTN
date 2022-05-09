let gameViewData

getGamesDataFromDB()

async function getGamesDataFromDB() {

    const response = await fetch('/api/games')
    let data = await response.json()
    showGamesData(data)
}

function showGamesData(data) {
    gameViewData = data
        // Popula el slider
    var randomIds = generateRandomGameIds(0, data.length)
    try {
        for (var i = 0; i < 3; i++) {
            document.getElementById(`${getImgNumber(i)}`).src = data[randomIds[i]].gameImage
            document.getElementById(`${getImgNumber(i)}`).alt = data[randomIds[i]].altFoto
            document.getElementById(`${getNameNumber(i)}`).textContent = data[randomIds[i]].gameName
            document.getElementById(`${getDescriptionNumber(i)}`).textContent = data[randomIds[i]].gameDescriptionShort
        }
    } catch {
        console.error("Data not found")
    }
    // Popula la galeria 
    let rowsCounter = 0
    let rows = 0
    for (var i = 0; i < data.length; i++) {
        if (!data[i].credential) {
            if (rowsCounter == 0) {
                document.getElementById('gamesDisplayBody').innerHTML += `<tr id='${rows}Tr'></tr>`
            }
            document.getElementById(`${rows}Tr`).innerHTML += `<td>
            <div class="card" style="width: 100%;">
            <img id="${i}ImgId" class="card-img-top" alt="...">
            <div class="card-body">
            <p class="card-text" id="${i}PId"></p>
            </div></div><button type="button" class="btn adminGamesView" data-toggle="modal" data-target="#editGameModal" onclick="populateModal(${i});">
        <img src="../assets/svg/pencil.svg" width="20em">
      </button></td>`
            document.getElementById(`${i}ImgId`).src = data[i].gameImage
            document.getElementById(`${i}ImgId`).alt = data[i].altFoto
            document.getElementById(`${i}PId`).textContent = data[i].gameDescriptionShort
            rowsCounter++
            if (rowsCounter >= 3) {
                rowsCounter = 0
                rows++
            }
        }
    }
    if (data[data.length - 1].credential) {
        var elements = document.getElementsByClassName('adminGamesView');
        console.log(elements.length)
        for (let element of elements) {
            element.style.display = 'block';
        }
    }
}

function generateRandomGameIds(min, max) {
    var ids = [];
    while (ids.length < 3) {
        var r = Math.floor(Math.random() * max) + min;
        if (ids.indexOf(r) === -1) ids.push(r);
    }
    return ids;
}

function getImgNumber(id) {
    if (id == 0)
        return 'firstImage'
    if (id == 1)
        return 'secondImage'
    if (id == 2)
        return 'thirdImage'
}

function getNameNumber(id) {
    if (id == 0)
        return 'firstImageH5'
    if (id == 1)
        return 'secondImageH5'
    if (id == 2)
        return 'thirdImageH5'
}

function getDescriptionNumber(id) {
    if (id == 0)
        return 'firstImageP'
    if (id == 1)
        return 'secondImageP'
    if (id == 2)
        return 'thirdImageP'
}
let gameId = null
function populateModal(id) {
    console.log(gameViewData[id])
    document.getElementById('gameNameEdit').value = gameViewData[id].gameName
    document.getElementById('gameId').value = gameViewData[id]._id
    document.getElementById('gameDescriptionLongEdit').textContent = gameViewData[id].gameDescriptionLong
    document.getElementById('gameDescriptionShortEdit').textContent = gameViewData[id].gameDescriptionShort
    document.getElementById('altFotoEdit').value = gameViewData[id].altFoto
    document.getElementById('gameLinkEdit').value = gameViewData[id].gameLink
    document.getElementById('gameImageEdit').value = gameViewData[id].gameImage
    gameId = gameViewData[id]._id
}

function deleteData() {
    let data = {_id: gameId}
    fetch('/api/games/delete', {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then(res => {
      console.log('Request complete! response:', res);
    });
}