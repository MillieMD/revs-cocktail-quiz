async function initialiseCollections(){

    let wrapper = document.getElementById("collection-wrapper");

    // Get collections json file
    let response = await fetch("js/collections.json");
    response = await response.json();
    
    let collections = response["collections"];

    console.log(collections);

    for(i = 0; i < collections.length; i++){

        let currentCollection = collections[i];

        const e = document.createElement("div");
        e.id = currentCollection["name"];
        e.classList.add("card");
        e.id = currentCollection["name"];

        e.insertAdjacentHTML("afterbegin", " <h3> " + currentCollection["name"] + " </h3> <p id = 'status'></p> <div class = 'row'> <button onclick = 'viewCollection("+currentCollection["name"]+")'> View </button> <button onclick = editCollection("+currentCollection["name"]+")> Edit </button> </div>");

        wrapper.append(e);

    }

    let b = document.createElement("button");
    b.id = "add-collection";
    b.classList.add("card");
    b.setAttribute("type", "button");
    b.setAttribute("onclick","createCollection()");
    
    b.innerHTML = "+";

    wrapper.append(b);

}

function viewCollection(collection){

}

function editCollection(collection){

}

function createCollection(){

    
}

document.onload = initialiseCollections();