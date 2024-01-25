var QUANTITY;
var CURRENT_QUESTION = 0;

async function pageSetup(){

    document.getElementById("home-page").style.display = "none";

    let wrapper = document.createElement("div");
    wrapper.setAttribute("role", "main");
    wrapper.id = "quiz-wrapper";

    document.body.append(wrapper);

    var collectionid = 0;

    if(document.getElementById("limiter").checked){
        collectionid = 1;
    }

    // Get questions json file
    let response = await fetch("js/cocktails.json");
    cocktails = await response.json();

    cocktails = cocktails.cocktails;

    response = await fetch("js/collections.json");
    collections = await response.json();
    unsorted = collections.collections[collectionid].included // I know it looks like gibberish, it's the collection indicated by the limiter in the array of collections within collections.json
                                                              // Probably needs better name

    collection = unsorted.map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value) // Shuffle into a random order

    var i = 0;
    for(var id in collection){ // For every cocktail in the collection

        if(id >= cocktails.length){ // Limit to the ones i've actually put into the json file
            break;
        }

        cocktail = cocktails[id];

        console.log(id + ": loading " + cocktail.name + "... "); // TODO: remove

        let q = document.createElement("form");
        q.classList.add("hor-flex");
        q.classList.add("question");
        q.id = "cocktail" + i;

        let glass = document.createElement("div");
        glass.classList.add("ver-flex");
        glass.classList.add("center");

        let glassImg = document.createElement("img");
        glassImg.src = "img/" + cocktail.glass.toLowerCase() + ".png";
        glass.append(glassImg);

        let glassText = document.createElement("input");
        glassText.id = "glass";
        glassText.dataset.answer = cocktail.glass.toLowerCase();
        glass.append(glassText);

        q.append(glass);

        let info = document.createElement("div");
        info.classList.add("ver-flex");

        let title = document.createElement("h3");
        title.innerHTML = cocktail.name;

        info.append(title);

        for(j = 0; j < cocktail.ingredients.length; j++){

            let ing = document.createElement("div");
            ing.classList.add("hor-flex");
            ing.classList.add("space-apart");
            ing.id = "ingredient" + j;

            let amt = document.createElement("input");
            amt.id = "ingredient"+j;
            amt.dataset.answer = cocktail.ingredients[j].amount;
            ing.append(amt);

            let ingname = document.createElement("p");
            ingname.innerHTML = cocktail.ingredients[j].name
            ing.append(ingname);

            info.append(ing);

        }

        let garnishes = document.createElement("div");
        garnishes.innerHTML = "<h5>Garnishes: </h5> ";
        garnishes.classList.add("hor-flex");

        for(j = 0; j < cocktail.garnishes.length; j++){

            let g = document.createElement("input");
            g.dataset.options = cocktail.garnishes.toString().toLowerCase();
            g.id = "garnish" + j;

            garnishes.append(g);

        }

        info.append(garnishes);

        let method = document.createElement("div");
        method.classList.add("hor-flex");
        method.classList.add("space-apart");
        method.innerHTML = "<h5>Method: </h5> ";

        methodinput = document.createElement("input");
        methodinput.setAttribute("type", "text");
        methodinput.dataset.answer = cocktail.method.toLowerCase();
        method.append(methodinput);

        info.append(method);
        
        q.append(info);

        if(i > 0){
            q.style.display = "none";
        }

        wrapper.append(q);
        i++;
    }

    let check = document.createElement("button");
    check.id = "check-button";
    check.setAttribute("onclick", "CheckAnswers()");
    check.setAttribute("type", "button");
    check.innerHTML = "Check Answers";
    
    wrapper.append(check);

    let next = document.createElement("button");
    next.id = "next-button";
    next.setAttribute("onclick", "NextCocktail()");
    next.setAttribute("type", "button");
    next.style.display = "none";
    next.innerHTML = "Next Cocktail";

    wrapper.append(next);

    QUANTITY = i;
}

function CheckAnswers(){

    //check answers, show next button

    const garnishCheck = /garnish+\d*/; // Regex to detect garnish, as they are not in a set order they need to be checked differently

    let inputs = document.forms["cocktail"+CURRENT_QUESTION].getElementsByTagName("input");
    let garnishes = [];

    for(i = 0; i < inputs.length; i++){
        
        if(inputs[i].id.match(garnishCheck)){
            garnishes.push(inputs[i]);
            continue;
        }

        if(inputs[i].value != inputs[i].dataset.answer){
            inputs[i].value = inputs[i].dataset.answer;
            inputs[i].classList.add("incorrect");
        }else{

            inputs[i].classList.add("correct");
        }

    }

    let garnishOptions = garnishes[0].dataset.options.trim().split(",");
    console.log(garnishOptions);

    for(i = 0; i < garnishes.length; i++){
        
        if(garnishOptions.includes(garnishes[i].value)){
            garnishOptions.splice(garnishOptions.indexOf(garnishes[i].value), 1);  
            garnishes[i].classList.add("correct");
        
        }else{
            garnishes[i].value = ""; // used to identify where corrections should go
            garnishes[i].classList.add("incorrect");
        }

    }

    for(i = 0; i < garnishes.length; i++){
        
        if(garnishes[i].value == ""){
            garnishes[i].value = garnishOptions[garnishOptions.length - 1];
            garnishOptions.pop();
        }

    }
    
    document.getElementById("next-button").style.display = "block";
    document.getElementById("check-button").style.display = "none";

}

/**
 * Remove current question
 * @returns 
 */
function NextCocktail(){

    document.getElementById("cocktail"+CURRENT_QUESTION).style.display = "none";

    CURRENT_QUESTION++;

    if(CURRENT_QUESTION == QUANTITY-1){
        document.getElementById("next-button").setAttribute("onclick", "Finish()");
        document.getElementById("next-button").innerHTML = "Back to Home Page";
    }

    document.getElementById("cocktail"+CURRENT_QUESTION).style.display = "flex";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("check-button").style.display = "block";

    return false;

}

function Finish(){

    CURRENT_QUESTION = 0;
    QUANTITY = 0;

    document.getElementById("quiz-wrapper").remove();
    document.getElementById("home-page").style.display = "flex";

    return false;

}

function shuffle(){
}

