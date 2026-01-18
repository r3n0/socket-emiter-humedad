const nCanales = 15;
let socket;
let valorRecibido;
nombreDeCanal = 'canal-1';


//servo arduino
let serial;
let portName = 'COM3'; // Nota: En WebSerial esto es menos estricto, pero es buena práctica.
let outByte = 0; // Dato que enviaremos


function setup() {
	createCanvas(800, 600);

	// Conexión al servidor (usa tu IP y puerto 3000)
	socket = io('http://10.0.0.101:3000', {
		transports: ['websocket'],
	});

	// 1. Confirmar conexión y unirse al canal
	socket.on('connect', () => {
		console.log('✅ Receptor conectado con ID:', socket.id);
		socket.emit('join-channel', nombreDeCanal);
	});

	// 2. ESCUCHAR el evento que envía el servidor
	socket.on('update-value', (data) => {
		valorRecibido = data;
		// console.log('📥 Valor recibido desde el emisor:', valorRecibido);
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
	text(nombreDeCanal, barheight, lineHeight * 2 / 2);

	rect(100, lineHeight * 2, valorRecibido * 4, barheight);


	// Si el puerto está abierto, enviamos datos
	if (serial.port) {
		// Mapeamos la posición X del mouse (0 a ancho) a grados (0 a 180)
		// 'floor' es para enviar números enteros, no decimales

		// Restringimos los valores para proteger el servo
		outByte = constrain(valorRecibido, 0, 180);

		// Enviamos el dato al Arduino
		serial.write(outByte);
	}
}


function connectToSerial() {
	if (!serial.port) {
		// Esto abre la ventana nativa del navegador para elegir el puerto
		serial.requestPort();
	} else {
		// Si ya hay puerto, lo abrimos
		serial.open();
	}
}