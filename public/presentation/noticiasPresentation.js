getIndexDataFromDB()

async function getIndexDataFromDB() {

    const response = await fetch('/api/noticias')
    let data = await response.json()
    showNoticiasData(data)
}


function showNoticiasData(data) {
    if (data[data.length - 1].credential) {
        console.log(data[data.length - 1].credential)
        var elements = document.getElementsByClassName('adminViewPostNews');
        for (let element of elements) {
            element.style.visibility = 'visible';
        }
    }
    for (var i = 0; i < data.length; i++) {
        document.getElementById('newsContainer').innerHTML += `<div class="col-md-12"><h1 id="${i}h1"></h1><h6 style="color: grey;" id="${i}h6"></h6><p id="${i}p"></p></div><hr><div class="col-md-12">`
        document.getElementById(`${i}h1`).textContent = data[i].newTitle
        document.getElementById(`${i}p`).textContent = data[i].newContent
        document.getElementById(`${i}h6`).textContent = data[i].date
        console.log(data[i].date)
    }
}

function populateModal(id) {
    for (var i = 0; i < viewData.length; i++) {
        if (viewData[i].identifier == id) {
            document.getElementById('genericModalLabel').textContent = viewData[i].identifier
            document.getElementById('genericModalText').textContent = viewData[i].content
            document.getElementById('genericModalId').textContent = viewData[i].identifier
        }
    }
}