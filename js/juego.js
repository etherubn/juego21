/* 
    C trebol
    D diamantes
    H corazon
    S spadas
*/

/* Referencias  */
const $pedir = document.getElementById("pedir-carta");
const $turno = document.getElementById("turno");
const $nuevoJuego = document.getElementById("nuevo-juego");
const $detener = document.getElementById("detener");
/* Variables */
/* VAriable del deck de cartas */
let deck = [];
let nombreUsuario;
/* Variable para definir los turnos */
let turno;

/* Variable para definir los puntajes */
let puntosUsuario = 0;
let puntosPc = 0;

/* Variable para definir el termino del juego */
let cantidad = 0;

/* Funciones */

/* Generando el deck */
/* existen números de 2 al 10 y A,J,K y Q */
/* Aparte C:trebol, D: diamantes, H:corazones, S:espadas*/
function generarDeck() {
  let simbolo = ["C", "D", "H", "S"];
  let especiales = ["A", "J", "K", "Q"];
  for (let i = 2; i <= 10; i++) {
    for (let letra of simbolo) {
      deck.push(i.toString().concat(letra));
    }
  }

  for (let especial of especiales) {
    for (let letra of simbolo) {
      deck.push(especial.concat(letra));
    }
  }

  deck = _.shuffle(deck);
  console.log(deck);
}


/* Funcion para retornar uan de las cartas 3H */
function sacarCarta() {
  let carta = deck.shift();
  return carta;
}

/* Con esta función sacamos el valor, por ejemplo
todas las cartas terminan con el simbolo por lo que quitamo este con es lsubstring */
function valorCArta(carta) {
  let especiales = {
    A: 1,
    J: 11,
    Q: 12,
    K: 13,
  };

  let valor = carta.substring(0, carta.length - 1);

  /* Si sale A, y aplicamos isNan nos sale verdadero por que es una letra
        pero si nos sale 4 por las locuras de javascript si es un número
    */
  if (isNaN(valor)) {
    for (let especial in especiales) {
      if (valor === especial) {
        valor = especiales[especial];
      }
    }
  } else {
    valor = Number(valor);
  }

  return valor;
}

/* Vamos a generar el html de acuerdo a si es jugador o pc
    para eso le mandamos el valor de la clase y la carta
    que se va a dibujar
*/
function generarHtml(claseJugador, carta) {
  const img = document.createElement("img");
  img.classList.add("carta");
  img.src = `./assets/cartas/${carta}.png`;

  const referencia = document.querySelector(`.${claseJugador}`);
  referencia.appendChild(img);
}

/* Funcion para definir el turno de forma aleatoria
  en este caso cuando debemos iniciar con este botón para 
  inicair el juego definiendo el turno, los demás botones
  se activarán de acuerdo a ciertas condiciones,
  el jugador es el único que puede parar ya que la pc
  tiene la funcionalidad de elegir las cartas
*/
function definirTurno() {
  let valor = Math.round(Math.random());

  if (valor === 0) {
    turno = true;
    Swal.fire("Inicia usuario");
  } else {
    turno = false;
    Swal.fire("Inicia pc");
  }
  $nuevoJuego.disabled = false;
  $pedir.disabled = false;
  $turno.disabled = true;
}

/* Funcion que actualiza el puntaje según la clase y el puntaje del jugador */

function actualizarPuntaje(clase, puntos) {
  const referencia = document
    .querySelector(`.${clase}`)
    .previousElementSibling.querySelector("small");
  referencia.textContent = puntos;
}

/* Función para mandar los mensajes según las condiciones dadas */

function mensajes(puntos) {
  if (puntos > 21 && cantidad === 0) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Te pasaste de 21, prácticamente perdiste",
    });
  } /* else if (puntos > 21 && cantidad === 1) {
    Swal.fire({
      icon: "warning",
      title: "Te mamaste",
      text: "Perdiste",
    });
  } */ else if (puntos === 21) {
    Swal.fire({
      icon: "success",
      title: "Excellent",
      text: "Llegaste a 21 !!!!!",
    });
  }
}

/* Función para definir el cambio de turno si es que se pasa de 21 
, además que muestar el mensaje para el usuario
*/
function comprobarCambioTurno(puntos) {
  if (puntos >= 21) {
    mensajes(puntos);
    cambiarTurno();
    $detener.disabled=true;
  }
}

/* Función para definir el cambio de turno y el conteo des cambio de turno
  al llegar a 2 finaliza el juego
*/
function cambiarTurno() {
  turno = !turno;
  cantidad++;
  console.log(cantidad);
  if (cantidad === 2) {
    $pedir.disabled = true;
  }
}

function mostrarPuntos(puntos) {
  Swal.fire({
    icon: "success",
    title: "Puntos totales",
    text: `Tienes ${puntos}`,
  });
}

function mostrarGanador(mensaje){
  Swal.fire(mensaje)
}


function definirGanador(){
  console.log(puntosPc)
  console.log(puntosUsuario)
  if(puntosPc===puntosUsuario){
    mostrarGanador(`Empate técnico`)
    return
  }

  if(puntosPc>puntosUsuario && puntosPc>21 && puntosUsuario<=21){
    mostrarGanador(`Gano ${nombreUsuario}`)
    return
  }

  if(puntosUsuario>puntosPc && puntosUsuario>21 && puntosPc<=21){
    mostrarGanador(`Ganó la máquina`)
    return
  }

  if(puntosUsuario>21 && puntosPc>21){
    mostrarGanador(`Ambos perdieron`)
    return
  }

  if(puntosUsuario<puntosPc){
    mostrarGanador(`Ganó la máquina`)
    return
  }

  if(puntosPc<puntosUsuario){
    mostrarGanador(`Ganó ${nombreUsuario}`)
    return
  }
}

function eliminarCartas(clase){
  const referencia = document.querySelector(`.${clase}`)
  while(referencia.firstChild){
    referencia.removeChild(referencia.firstChild)
  }
}


function empezarJuego(){
  puntosPc =0
  puntosUsuario=0
  deck.splice(0,deck.length)
  cantidad=0
  const claseUsuario = "jugador-cartas"
  const clasePc ="pc-cartas"
  eliminarCartas(claseUsuario)
  eliminarCartas(clasePc)
  actualizarPuntaje(claseUsuario,0)
  actualizarPuntaje(clasePc,0)
}

function ingresarNombre(){
  Swal.fire({
    titleText: "Ingresa nombre de jugador",
    background: "#263D3A",
    color:"#B5A591",
    input: "text",
    inputPlaceholder: "",
    backdrop: "swal2-backdrop-show",
  });

  const $swInput = document.getElementById("swal2-input");
  const $swButton = document.querySelector(".swal2-confirm");
  $swButton.addEventListener("click", (e) => {
    nombreUsuario = $swInput.value;
    const referencia = document
    .querySelector(".jugador-cartas")
    .previousElementSibling.querySelector("span");
    referencia.textContent = nombreUsuario
  });

  
}



/* Evento */

$pedir.addEventListener("click", () => {
  if (turno && puntosUsuario <= 21) {
    let carta = sacarCarta();
    let valor = valorCArta(carta);
    puntosUsuario += valor;
    let claseUsuario = "jugador-cartas";
    generarHtml(claseUsuario, carta);
    actualizarPuntaje(claseUsuario, puntosUsuario);
    $detener.disabled = false;
    comprobarCambioTurno(puntosUsuario);
  }

  else if (!turno) {
    if (puntosUsuario === 0) {
      do {
        let cartaPc = sacarCarta();
        let valorPc = valorCArta(cartaPc);
        puntosPc += valorPc;
        let clasePc = "pc-cartas";

        generarHtml(clasePc, cartaPc);
        actualizarPuntaje(clasePc, puntosPc);
        if (puntosPc >= 14) {
          break;
        }
      } while (puntosPc <= 21);
      if (puntosPc < 21) {
        mostrarPuntos(puntosPc);
      } else {
        mensajes(puntosPc);
      }
      cambiarTurno();
    } else if (puntosUsuario > 0 && puntosPc < 21) {
      do {
        let cartaPc = sacarCarta();
        let valorPc = valorCArta(cartaPc);
        puntosPc += valorPc;
        let clasePc = "pc-cartas";
        generarHtml(clasePc, cartaPc);
        actualizarPuntaje(clasePc, puntosPc);
      } while (puntosPc <= puntosUsuario && puntosUsuario <= 21);
      if (puntosPc < 21) {
        mostrarPuntos(puntosPc);
      } else {
        mensajes(puntosPc);
      }
      cambiarTurno();
    }
  }

  if(cantidad===2){
    $detener.disabled=true
    definirGanador()
  }
});

$turno.addEventListener("click", () => {
  generarDeck()
  definirTurno();
  if (!turno) {
    $detener.disabled = true;
  }
});

$detener.addEventListener("click", () => {
  if (puntosPc > 0 || puntosUsuario > 0) {
    mostrarPuntos(puntosUsuario);
    cambiarTurno();
    $detener.disabled = true;
    if(cantidad===2){
      $detener.disabled=true
      definirGanador()
    }
  }
});

$nuevoJuego.addEventListener("click",()=>{
  empezarJuego()
  $nuevoJuego.disabled=true
  $pedir.disabled=true
  $detener.disabled=true
  $turno.disabled=false
})

document.addEventListener("DOMContentLoaded",ingresarNombre
)
