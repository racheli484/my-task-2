const searchBaseUrl = "https://restcountries.com/v3.1/all"
const DOM = {
    allButton: document.querySelector("#all"),
    input: document.querySelector("#searchInput"),
    nameButton: document.querySelector("#name"),
    content: document.querySelector("#content"),
};
function init() {
    DOM.allButton.addEventListener("click", () => get(), getAllCountries());
    DOM.nameButton.addEventListener("click", () => get(DOM.input.value), searchCountry());
}
init();

async function get(name) {
    try {
        showLoader();
        let result;
        if (name) {
            result = await searchCountry(name);
        } else {
            result = await getAllCountries();
        }
        if (!Array.isArray(result)) throw new Error("Api error");

        draw(result);

    } catch (error) {
        console.log("I AM HERE AND I AM NOT HAPPY", error);
        swal({
            title: "Something went wrong!",
            text: "Contact admin",
            icon: "error",
        });
    } finally {
        removeLoader();
    }
}


function draw(result) {
    DOM.content.innerHTML = "";
    const table1 = document.createElement("table");
    const classes = ["table"];
    table1.classList.add(...classes);

    const thead1 = document.createElement("thead");
    const tr1 = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.innerText = "Country Name";
    const th2 = document.createElement("th");
    th2.innerText = "Population";
    tr1.append(th1, th2);
    thead1.append(tr1);

    const tbody1 = document.createElement("tbody");
    for (let index = 0; index < result.length; index++) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = result[index]?.name?.common;
        const td2 = document.createElement("td");
        td2.innerText = result[index]?.population;
        tr.append(td1, td2);
        tbody1.append(tr);
    }

    table1.append(thead1, tbody1);

    const regions = {};

    for (let index = 0; index < result.length; index++) {
        const region = result[index]?.region;
        if (!region) continue;
        if (!regions[region]) {
            regions[region] = {
                count: 1,
                population: parseFloat(result[index]?.population),
            };
        } else {
            regions[region].count++;
            regions[region].population += parseFloat(result[index]?.population);
        }
    }

    const table2 = document.createElement("table");
    table2.classList.add(...classes);

    const thead2 = document.createElement("thead");
    const tr2 = document.createElement("tr");
    const th3 = document.createElement("th");
    th3.innerText = "Region";
    const th4 = document.createElement("th");
    th4.innerText = "Number of Countries";
    tr2.append(th3, th4);
    thead2.append(tr2);

    const tbody2 = document.createElement("tbody");
    for (let region in regions) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = region;
        const td2 = document.createElement("td");
        td2.innerText = regions[region].count;

        tr.append(td1, td2);
        tbody2.append(tr);
    }

    table2.append(thead2, tbody2);



    const population = result.reduce(
        (total, country) => total + parseFloat(country.population),
        0
    );
    const average = population / result.length;
    const infoDiv = document.createElement("div");
    infoDiv.innerText = `Number of Countries: ${result.length}, Average Population: ${average.toFixed(
        2
    )}`;
    DOM.content.append(infoDiv, table1, table2);
}



async function searchCountry(name) {
    const result = await fetch(`https://restcountries.com/v3.1/name/${name}`, {
        method: "GET",
    });
    const resultJson = await result.json();
    return resultJson;
}


async function getAllCountries() {
    const result = await fetch(`${searchBaseUrl}`, {
        method: "GET",
    });
    const resultJson = await result.json();
    return resultJson;
}
function showLoader() {
    DOM.content.innerHTML = "";
    const loader = document.createElement("div");
    loader.id = "searchLoader";
    loader.classList.add("spinner-border");
    DOM.content.append(loader);
}

function removeLoader() {
    const loader = document.querySelector("#searchLoader");
    if (loader) {
        loader.remove();
    }
}

