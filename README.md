# socket-reciever


## Código del arduino

```cpp
#include <Servo.h>

Servo miServo;

void setup() {
  // Iniciamos la comunicación serial a 9600 baudios
  Serial.begin(9600);
  miServo.attach(9); 
}

void loop() {
  // Verificamos si hay datos llegando desde la computadora
  if (Serial.available() > 0) {
    // Leemos el dato (se espera un número entre 0 y 180)
    int angulo = Serial.read();
    
    // Movemos el servo
    miServo.write(angulo);
  }
}
```