async function pedirChistes() {
    const mostrar = document.getElementById('mostrarChiste');
    try {
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        });

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener el chiste');
        }

        const data = await response.json();
        mostrar!.textContent = data.joke;
        currentJoke = data.joke;
    } catch (error) {
        // Si hay un error, mostramos un mensaje adecuado
        mostrar!.textContent = 'Hubo un error al pedir los chistes';
        console.error(error); // Imprimimos el error en la consola para depuración
    }
    
    guardarPuntuacion()
    emojiItem.forEach((item: HTMLElement) => {
        // Eliminar la clase 'selected'
        item.classList.remove('selected');
        // Resetear la calificación
        calificacion = 0;
        console.log("a VER si se quita al pedir nuevo chiste", calificacion);
    });
}

// Función para obtener los datos meteorológicos
async function pedirClima(ciudad: string = "Barcelona"): Promise<void> {
    // URL de la API con el parámetro de la ciudad
    const apiKey = "13a90374849f8d04b244930a0d6c3885";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    try {
        // Hacemos la solicitud a la API
        const response = await fetch(URL);

        // Comprobamos si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API");
        }

        // Parseamos la respuesta como JSON
        const jsonMeteo = await response.json();

        // Obtener los datos de la respuesta
        const nombreIcono: string = jsonMeteo.weather[0].icon;
        const ciudad: string = jsonMeteo.name;
        const pais: string = jsonMeteo.sys.country;
        const temperatura: number = jsonMeteo.main.temp;
        const tempMax: number = jsonMeteo.main.temp_max;
        const tempMin: number = jsonMeteo.main.temp_min;
        const sensaTemp: number = jsonMeteo.main.feels_like;
        const humedad: number = jsonMeteo.main.humidity;

        // Mostrar los resultados en consola (puedes adaptarlo para mostrar en la UI)
        console.log(`Ciudad: ${ciudad}, País: ${pais}`);
        console.log(`Temperatura: ${temperatura}°C`);
        console.log(`Temperatura Máxima: ${tempMax}°C`);
        console.log(`Temperatura Mínima: ${tempMin}°C`);
        console.log(`Sensación Térmica: ${sensaTemp}°C`);
        console.log(`Humedad: ${humedad}%`);
        console.log(`Icono: ${nombreIcono}`);

        // Aquí puedes mostrar los datos en tu HTML (si lo deseas)
        document.getElementById("ciudad")!.textContent = `Ciudad: ${ciudad}`;
        document.getElementById("temperatura")!.textContent = `Temperatura: ${temperatura}°C`;
        document.getElementById("temp_max")!.textContent = `Temp. Max: ${tempMax}°C`;
        document.getElementById("temp_min")!.textContent = `Temp. Min: ${tempMin}°C`;
        document.getElementById("sensa_temp")!.textContent = `Sensación: ${sensaTemp}°C`;
        document.getElementById("humedad")!.textContent = `Humedad: ${humedad}%`;
        document.getElementById("icono")?.setAttribute("src", `https://openweathermap.org/img/wn/${nombreIcono}.png`);

    } catch (error) {
        console.error("Error al obtener los datos meteorológicos: ", error);
    }
}
pedirClima();

// Llamamos a la función, puedes pasar un nombre de ciudad diferente
const ciudad = "Barcelona";

function mostrar() {
    pedirChistes();
    pedirClima();
}

let currentJoke = '';

// ZONA PUNTUACION DEL CHISTE

let reportJokes = [
    {

        joke: "...",

        score: 1,

        date: new Date(),

    }
];



const emojiItems = document.querySelectorAll('#emoji-selector .list-group-item');
let calificacion = 0;
// Agregar un evento de clic a cada opción
emojiItems.forEach(item => {
    item.addEventListener('click', () => {
        emojiItems.forEach(i => i.classList.remove('selected'));

        item.classList.add('selected');

        const selectedItem = document.querySelector('.list-group-item.selected') as HTMLElement | null;

        const selectedValue: string | null = selectedItem ? selectedItem.dataset.value || null : null;
        
        // Asignar la calificación dependiendo del valor seleccionado
        if (selectedValue) {
            calificacion = parseInt(selectedValue, 10); // Convertir el valor a número
        } 

        console.log("a VER si se asigna el valor emoji", selectedValue);
    });
});

// Obtener el botón de guardar puntuación (puedes usar su ID)
const guardarPuntuacionBtn = document.getElementById('guardarPuntuacionBtn') as HTMLElement;
// Obtener todos los elementos de emoji como NodeList de HTMLElements
const emojiItem = document.querySelectorAll('#emoji-selector .list-group-item') as NodeListOf<HTMLElement>;

// Agregar el event listener para el clic
document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Verificar si el clic fue fuera de los emojis y del botón de guardar
    if (
        !guardarPuntuacionBtn?.contains(target) && 
        !target.closest('#emoji-selector .list-group-item')
    ) {
        // Si se hace clic fuera de los emojis y el botón de guardar, eliminar la clase 'selected' de todos los emojis
        emojiItem.forEach((item: HTMLElement) => {
            // Eliminar la clase 'selected'
            item.classList.remove('selected');
            // Resetear la calificación
            calificacion = 0;
            console.log("a VER si se quita el hacer click fuera", calificacion);
        });
    }
});

// Agregar el evento de clic sobre los emojis
emojiItem.forEach((item: HTMLElement) => {
    item.addEventListener('click', () => {
        // Eliminar la clase 'selected' de todos los demás emojis
        emojiItem.forEach((otherItem: HTMLElement) => {
            otherItem.classList.remove('selected');
        });

        // Añadir la clase 'selected' al emoji clicado
        item.classList.add('selected');
    });
});
function pushearCalificaciones(joke: string, score: number, date: Date) {
    reportJokes.push({
        joke: joke,
        score: score,
        date: date
    });
}


pedirChistes();

function guardarPuntuacion() {
    if (currentJoke && calificacion > 0) {
        pushearCalificaciones(currentJoke, calificacion, new Date());
        console.log("Chiste guardado con puntuación", calificacion);
        console.log(reportJokes);

    } else {
        console.log("No se ha seleccionado una puntuación válida o no hay chiste");
        console.log(reportJokes);
        
    }
}