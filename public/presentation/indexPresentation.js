let viewData

getIndexDataFromDB()

async function getIndexDataFromDB() {

    const response = await fetch('/api/index')
    let data = await response.json()
    showIndexData(data)
}

function showIndexData(data) {
    viewData = data
    if (data[data.length - 1].credential) {
        console.log(data[data.length - 1].credential)
        var elements = document.getElementsByClassName('adminView');
        for (let element of elements) {
            element.style.visibility = 'visible';
        }
    }

    for (var i = 0; i < data.length; i++) {
        if (document.getElementById(data[i].identifier) != null) {
            try {
                document.getElementById(data[i].identifier).textContent = data[i].content
            } catch {
                console.error("Element not found")
            }
        }
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