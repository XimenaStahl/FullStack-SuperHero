// Funcion que crea el gráfico
let creaGrafico = (poderesLabel, poderesValor) => {
    let totalElem = poderesLabel.length;

    // Armar arreglo de objetos dataPoints para gráfico
    let puntosGraf = [];
    for (let i = 0; i < totalElem; i++) {
        let etiqueta = poderesLabel[i];
        let valor = poderesValor[i];
        let punto = { 'label': etiqueta, 'y': valor };
        puntosGraf.push(punto)
    }

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

    // Muestra el gráfico en el elemento seleccionado
    chart.render();
};
// Función que genera leyendas del gráfico
let explodePie = (e) => {
    if (typeof(e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
};

// Función que renderiza información
let masInformacion = (glosa) => {
    let linea = document.createElement('hr');
    let parrafo = document.createElement('p');
    let detalle = document.getElementById('adicional');

    parrafo.className = 'indent';
    detalle.appendChild(linea);
    parrafo.innerHTML = glosa;

    detalle.appendChild(parrafo);
};

// Función que limpia el DOM si hubo una visita previa
let limpiar = () => {
    let eliminar = document.getElementById('adicional');
    if (eliminar) {
        eliminar.remove()
    };
    let grafico = document.getElementsByClassName('canvasjs-chart-canvas')[0];
    if (grafico) {
        grafico.remove()
    };
}

// Espera la carga del documento
$(document).ready(function() {

    //capturamos elementos del DOM
    let boton = document.getElementById('boton');
    let esNumero = 0;

    // Ocultar información del héroe
    $('#datosHeroe').hide();

    //agregamos evento click al boton
    boton.addEventListener('click', () => {
        document.getElementsByClassName('errorNumero')[0].innerHTML = '';
        let numSuperHero = document.getElementById('idSuperHero').value;

        // Validar si es numero de hasta tres dígitos
        let regex = new RegExp(/^[123456789]([0-9])?([0-9])?$/, 'gm'); // Expresión regular que sólo admite números entre 1 y 999

        esNumero = (regex.test(numSuperHero));

        if ((!esNumero) || (numSuperHero < 1 || numSuperHero >= 731)) {
            document.getElementsByClassName('errorNumero')[0].innerHTML = 'El número de Super Héroe debe estar entre 1 y 731';
        } else {
            document.getElementsByClassName('errorNumero')[0].innerHTML = ''; // El mensaje de error se limpia si se corrige o está todo correcto

            //función solicitud de datos
            $.ajax({
                type: "get",
                url: `https://www.superheroapi.com/api.php/4216420038418903/${numSuperHero}`, //end point
                dataType: "Json",
                success: function(data) {

                    // Limpiar elementos del DOM si hubo una visita previa
                    limpiar()

                    let imagen = document.getElementsByClassName('card-img')[0];
                    let nombre = document.getElementsByClassName('card-title')[0];
                    let texto = document.getElementsByClassName('card-text')[0];

                    imagen.src = data.image.url;
                    nombre.innerHTML = `Nombre: ${data.name}`;

                    //Conexiones
                    for (let property in data.connections) {
                        if (property == 'group-affiliation') {
                            texto.innerHTML = `Conexiones: ${data.connections[property]}`
                        }
                    };

                    // Crear DIV para información adicional
                    let adicional = document.createElement('div');
                    let cuerpoCard = document.getElementsByClassName('card-body')[0];

                    adicional.id = 'adicional';
                    cuerpoCard.appendChild(adicional);


                    // Publicado por
                    let glosa = '';
                    for (let property in data.biography) {
                        if (property == 'publisher') {
                            glosa = `<i>Publicado por</i>: ${data.biography[property]} `;
                        }
                    };

                    // Llamada a función que renderiza información
                    masInformacion(glosa)

                    // Ocupación
                    glosa = '';
                    for (let property in data.work) {
                        if (property == 'occupation') {
                            glosa = `<i>Ocupación</i>: ${data.work[property]}`
                        }
                    };
                    // Llamada a función que renderiza información
                    masInformacion(glosa)

                    // Primera Aparición
                    glosa = '';
                    for (let property in data.biography) {
                        if (property == 'first-appearance') {
                            glosa = `<i>Primera Aparición</i>: ${data.biography[property]}`
                        }
                    };
                    // Llamada a función que renderiza información
                    masInformacion(glosa)

                    // Altura
                    glosa = '';
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
                            glosa = `<i>Altura</i>: ${enArreglo.join(" - ")}`
                        }
                    };
                    // Llamada a función que renderiza información
                    masInformacion(glosa)

                    // Peso
                    glosa = '';
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
                            glosa = `<i>Peso</i>: ${enArreglo.join(" - ")}`
                        }
                    };
                    // Llamada a función que renderiza información
                    masInformacion(glosa)

                    // Alianzas
                    glosa = '';
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
                            glosa = `<i>Alianzas</i>: ${enArreglo.join(" ")}`
                        }
                    };
                    // Llamada a función que renderiza información
                    masInformacion(glosa)

                    // Datos para Graficar
                    let poderesLabel = [];
                    let poderesValor = [];
                    for (let property in data.powerstats) {
                        poderesLabel.push(property)
                        poderesValor.push(data.powerstats[property])
                    };
                    // Desplegar información del héroe
                    $('#datosHeroe').show();

                    // Crear gráfico
                    creaGrafico(poderesLabel, poderesValor);
                }
            });

        }; // Fin del if que controla la validación del número de super héroe

    });
});