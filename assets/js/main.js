//funcion que crea gráfico
let creaGrafico = (puntosGraf) => {

    //variable que almacena gráfico
    let chart = new CanvasJS.Chart("chartContainer", {
        theme: "light1", // "light2", "dark1", "dark2"
        animationEnabled: true, // change to true		
        title: {
            text: "Estadísticas"
        },
        legend: {
            cursor: "pointer",
            itemclick: explodePie
        },
        data: [{
            // Change type to "bar", "area", "spline", "pie",etc.
            type: "pie",
            indexLabel: "{label} ({y})",
            showInLegend: true,
            legendText: "{label}",
            dataPoints: puntosGraf,


        }]
    });
    //muestra el gráfico en el elemento seleccionado
    chart.render();
}

function explodePie(e) {
    if (typeof(e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();

}



//espera la carga del documento
$(document).ready(function() {
    //capturamos elementos del DOM
    let boton = document.getElementById('boton');
    let esNumero = 0

    //agregamos evento click al boton
    boton.addEventListener('click', () => {
        document.getElementsByClassName('errorNumero')[0].innerHTML = '';
        let numSuperHero = document.getElementById('idSuperHero').value;


        // Validar si es numero de tres dígitos
        let regex = new RegExp(/^[1234567]([0-9])?([0-9])?$/, 'gm'); // Expresión regular que sólo admite números entre 1 y 999

        esNumero = (regex.test(numSuperHero));
        console.log(esNumero)
        if ((!esNumero) || (numSuperHero < 1 || numSuperHero >= 731)) {
            document.getElementsByClassName('errorNumero')[0].innerHTML = 'El número de Super Héroe debe estar entre 1 y 731';
        } else {
            document.getElementsByClassName('errorNumero')[0].innerHTML = ''; // El mensaje de error se limpia si se corrige o está todo correcto

            let imagen = document.getElementsByClassName('card-img')[0];
            let nombre = document.getElementsByClassName('card-title')[0];
            let texto = document.getElementsByClassName('card-text')[0];
            let cuerpoCard = document.getElementsByClassName('card-body')[0];
            let linea = document.createElement('hr');
            let parrafo = document.createElement('p');
            //función solicitud de datos
            $.ajax({
                type: "get",
                url: `https://www.superheroapi.com/api.php/4216420038418903/${numSuperHero}`, //end point
                dataType: "Json",
                success: function(data) {

                    imagen.src = data.image.url;
                    nombre.innerHTML = `Nombre: ${data.name}`;

                    //Conexiones
                    for (let property in data.connections) {
                        if (property == 'group-affiliation') {
                            texto.innerHTML = `Conexiones: ${data.connections[property]}`
                        }
                    };


                    // Publicado por
                    linea = document.createElement('hr');
                    parrafo = document.createElement('p');
                    parrafo.className = "indent";
                    console.log(parrafo)
                    cuerpoCard.appendChild(linea);
                    for (let property in data.biography) {
                        if (property == 'publisher') {
                            parrafo.innerHTML = `<i>Publicado por</i>: ${data.biography[property]} `
                        }
                    };
                    cuerpoCard.appendChild(parrafo);

                    // Ocupación
                    linea = document.createElement('hr');
                    parrafo = document.createElement('p');
                    parrafo.className = "indent";
                    cuerpoCard.appendChild(linea);
                    for (let property in data.work) {
                        if (property == 'occupation') {
                            parrafo.innerHTML += `<i>Ocupación</i>: ${data.work[property]}`
                        }
                    };
                    cuerpoCard.appendChild(parrafo);

                    // Primera Aparición
                    linea = document.createElement('hr');
                    parrafo = document.createElement('p');
                    parrafo.className = "indent";
                    cuerpoCard.appendChild(linea);
                    for (let property in data.biography) {
                        if (property == 'first-appearance') {
                            parrafo.innerHTML = `<i>Primera Aparición</i>: ${data.biography[property]}`
                        }
                    };
                    cuerpoCard.appendChild(parrafo);

                    // Altura
                    linea = document.createElement('hr');
                    parrafo = document.createElement('p');
                    parrafo.className = "indent";
                    cuerpoCard.appendChild(linea);
                    for (let property in data.appearance) {
                        if (property == 'height') {
                            // armar arreglo simple con elementos del objeto
                            let enArreglo = [];
                            let cont = 0;
                            for (let propied in data.appearance[property]) {
                                enArreglo[cont] = `${data.appearance[property][cont]}`;
                                cont++;
                            };
                            // imprimir usando join
                            parrafo.innerHTML = `<i>Altura</i>: ${enArreglo.join(" - ")}`
                        }
                    };
                    cuerpoCard.appendChild(parrafo);

                    // Peso
                    linea = document.createElement('hr');
                    parrafo = document.createElement('p');
                    parrafo.className = "indent";
                    cuerpoCard.appendChild(linea);
                    for (let property in data.appearance) {
                        if (property == 'weight') {
                            // armar arreglo simple con elementos del objeto
                            let enArreglo = [];
                            let cont = 0;
                            for (let propied in data.appearance[property]) {
                                enArreglo[cont] = `${data.appearance[property][cont]}`;
                                cont++;
                            };
                            // imprimir usando join
                            parrafo.innerHTML = `<i>Peso</i>: ${enArreglo.join(" - ")}`
                        }
                    };
                    cuerpoCard.appendChild(parrafo);


                    // Alianzas
                    linea = document.createElement('hr');
                    parrafo = document.createElement('p');
                    parrafo.className = "indent";
                    cuerpoCard.appendChild(linea);
                    for (let property in data.biography) {
                        if (property == 'aliases') {
                            // armar arreglo simple con elementos del objeto
                            let enArreglo = [];
                            let cont = 0;
                            for (let propied in data.biography[property]) {
                                enArreglo[cont] = `${data.biography[property][cont]}`;
                                cont++;
                            };
                            // imprimir usando join
                            parrafo.innerHTML = `<i>Alianzas</i>: ${enArreglo.join(" ")}`
                        }
                    };
                    cuerpoCard.appendChild(parrafo);

                    // Datos para Graficar
                    console.log(data.powerstats);
                    let poderesLabel = [];
                    let poderesValor = [];
                    for (let property in data.powerstats) {
                        poderesLabel.push(property)
                        poderesValor.push(data.powerstats[property])
                            // parrafo.innerHTML = `<i>Primera Aparición</i>: ${data.biography[property]}`
                    };
                    let totalElem = poderesLabel.length;
                    console.log(poderesLabel)
                    console.log(poderesValor)

                    // Armar arreglo de objetos dataPoints para gráfico
                    let puntosGraf = [];
                    for (let i = 0; i < totalElem; i++) {
                        let etiqueta = poderesLabel[i];
                        let valor = poderesValor[i];
                        console.log(etiqueta)
                        console.log(valor)
                        let punto = { 'label': etiqueta, 'y': valor };
                        puntosGraf.push(punto)

                    }


                    // texto.innerHTML = `Conexiones: ${data.connections.group-affiliation}`
                    // data.forEach((heroe) => {
                    //     console.log(heroe)
                    //         //ejecutamos función de construcción de card

                    //     // $('#gmap_canvas').attr('src', newSrc);
                    //     //     imagen.innerHTML = heroe.id
                    //     // construccionTabla(usuario);
                    //     // });
                    //     //ejecutamos función para crear gráfico
                    //     // creaGrafico();
                    // });

                    // $('#gmap_canvas').attr('src', newSrc);


                    creaGrafico(puntosGraf);
                }
            });

        }; // Fin del if que controla la validación del número de super héroe

    });
});