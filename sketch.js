const nCanales = 15;
let socket;
let valorHumedad;
nombreDeCanal = 'canal-15';


//servo arduino
let serial;
let portName = 'COM3'; // Nota: En WebSerial esto es menos estricto, pero es buena práctica.
let outByte = 0; // Dato que enviaremos


function setup() {
	createCanvas(800, 600);

	// Conexión al servidor (usa tu IP y puerto 3000)
	socket = io('http://10.0.0.101:3000', {
		// Eliminamos la restricción de solo websocket para mayor compatibilidad
		transports: ['polling', 'websocket'],
		reconnection: true
	});

	// Añade esto para debuggear en la consola de p5.js
	socket.on('connect_error', (err) => {
		console.log('Error de conexión detallado:', err.message);
	});

	// Al conectarnos, nos unimos al canal
	socket.on('connect', () => {
		console.log('✅ Conectado al servidor con ID:', socket.id);
		socket.emit('join-channel', nombreDeCanal);
	});

	// 
	// arduino
	// 
	// 
	// 1. Inicializar objeto serial
	serial = new p5.WebSerial();

	// 2. Obtener lista de puertos disponibles
	serial.getPorts();

	// 3. Callback: Qué hacer cuando se abre el puerto
	serial.on('portopen', () => {
		print('Puerto Serial Abierto');
	});

	// 4. Callback: Manejo de errores
	serial.on('error', (err) => {
		print('Error Serial:', err);
	});

	// 5. Callback: Cuando llegan datos
	serial.on('data', serialEvent);

	// Botón para conectar (El navegador exige interacción del usuario)
	let connectBtn = createButton('Conectar a Arduino');
	connectBtn.position(10, 10);
	connectBtn.mousePressed(connectToSerial);
}

function draw() {
	background(255);
	let barheight = 20;

	let lineHeight = (height / nCanales);
	fill(0);
	textSize(barheight);
	text('Humedad: ' + valorHumedad, barheight, lineHeight * 2 / 2);

	rect(100, lineHeight * 2, valorHumedad * 4, barheight);

}


function connectToSerial() {
	if (!serial.port) {
		// Esto abre la ventana nativa del navegador para elegir el puerto
		serial.requestPort();
	} else {
		serial.open();
	}
}

function serialEvent() {
	// Leer datos del puerto hasta el salto de línea
	let data = serial.readStringUntil('\n');

	if (data) {
		// Limpiar espacios en blanco
		let trimmedData = trim(data);

		// Si es un número válido, lo usamos
		if (trimmedData.length > 0) {
			valorHumedad = int(trimmedData);
			console.log("Recibido Serial:", valorHumedad);
		}
	}
}