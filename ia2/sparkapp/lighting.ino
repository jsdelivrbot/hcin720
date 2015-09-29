// This #include statement was automatically added by the Particle IDE.
#include "SparkJson/SparkJson.h"

//light mode strings
char *lightModes[] = { "off", "on", "auto"};

//light state constants
int LIGHT_OFF  = 0;
int LIGHT_ON   = 1;
int LIGHT_AUTO = 2;

//current state of the system
int currentLightMode    = LIGHT_AUTO;
int previousButtonState = 0;

//pins and inputs/outputs
int photoResistor   = A0;
int proximitySensor = A3;

int button          = A4;
int led             = A5;

int displayPin1     = D0;
int displayPin2     = D1;
int displayPin3     = D2;
int displayPin4     = D3;
int displayPin5     = D4;
int displayPin6     = D5;
int displayPin7     = D6;

//seconds during which the proximity sensor
//hasn't captured significant movement
int secondsOfQuietness = 0;
//seconds of quietness after which the led
//will automatically be turned off
int MAX_QUIETNESS_SECONDS = 10;

double prevPublishMillis = 0;
double prevSerialMillis = 0;

void setup()
{
    Serial.begin(9600);

    pinMode(photoResistor, INPUT);
    pinMode(proximitySensor, INPUT);
    pinMode(led, OUTPUT);

    pinMode(displayPin1, OUTPUT);
    pinMode(displayPin2, OUTPUT);
    pinMode(displayPin3, OUTPUT);
    pinMode(displayPin4, OUTPUT);
    pinMode(displayPin5, OUTPUT);
    pinMode(displayPin6, OUTPUT);
    pinMode(displayPin7, OUTPUT);
    
    writeModeToDisplay();
    Spark.function("setLightMode", setLightMode);
}

//sets the desired lightMode (0,1 or 2 for LIGHT_OFF, LIGHT_ON or LIGHT_AUTO, respectively)
int setLightMode(String lightMode) {
    
    currentLightMode = lightMode.toInt();
    secondsOfQuietness = 0;
    writeModeToDisplay();
    return 1;
}

void loop()
{
    //convert sensor data to percentage
    double lightLevel = 1 - (analogRead(photoResistor) / 4095.0);
    double proximity = analogRead(proximitySensor) / 4095.0;
    
    //allows state change via serial from the web gui
    if (Serial.available() > 0) {
        String command = Serial.readString();
        setLightMode(command);
    }
    
    String json = buildJSON(lightLevel, proximity);
    
    //limit publishing to one second because of the API limit
    if (millis() - prevPublishMillis >= 1000) {
        Spark.publish("deviceStatus", json);
        prevPublishMillis = millis();
        
        //update quietness time once per second
        calculateQuietness(proximity, lightLevel);
    }
    
    //limit serial output so we dont flood the client
    if (millis() - prevSerialMillis >= 250) {
        Serial.println(json);
        prevSerialMillis = millis();
    }
    
    int currentButtonState = digitalRead(button);
    //button pressed
    if(currentButtonState == 1 && previousButtonState == 0) {
        toggleLightMode();
    }
    
    previousButtonState = currentButtonState;
    digitalWrite(led, getLEDStatus(lightLevel));
}

//create system data json for sending via serial or cloud
String buildJSON(double lightLevel, double proximity) {
    StaticJsonBuffer<200> jsonBuffer;
        
    JsonObject& root = jsonBuffer.createObject();
    root["light"] = lightLevel;
    root["proximity"] = proximity;
    root["lightMode"] = lightModes[currentLightMode];
    root["ledStatus"] = getLEDStatus(lightLevel) == 1 ? "on" : "off";
    
    char buffer[256];
    root.printTo(buffer, sizeof(buffer));
    return buffer;
}

//turns off the lights if the mode is set to auto and the quietness time has passed
void calculateQuietness(double proximity, double lightLevel) {
    if (currentLightMode != LIGHT_AUTO) {
        return;
    }
    
    if (proximity < 0.6 ) {
        secondsOfQuietness++;
    } else {
        secondsOfQuietness = 0;
    }
}

//returns true if the photoresistor doesn't detect enough light
bool isDarkEnough(double lightLevel) {
    return lightLevel <= 0.7;
}

//switch between the light modes, off on and auto
void toggleLightMode() {
    currentLightMode = (currentLightMode + 1) % 3;
    writeModeToDisplay();
}

//write the current lightMode to the 7-segment display
void writeModeToDisplay() {
    if (currentLightMode == LIGHT_OFF) {
        write0();
    } else if (currentLightMode == LIGHT_ON) {
        write1();
    } else if (currentLightMode = LIGHT_AUTO) {
        writeA();
    }
}

//writes an A in the 7-segment display
void writeA() {
    digitalWrite(displayPin1, LOW);
    digitalWrite(displayPin2, HIGH);
    digitalWrite(displayPin3, LOW);
    digitalWrite(displayPin4, LOW);
    digitalWrite(displayPin5, LOW);
    digitalWrite(displayPin6, LOW);
    digitalWrite(displayPin7, LOW);
}

//writes a 1 in the 7-segment display
void write1() {
    digitalWrite(displayPin1, LOW);
    digitalWrite(displayPin2, HIGH);
    digitalWrite(displayPin3, HIGH);
    digitalWrite(displayPin4, HIGH);
    digitalWrite(displayPin5, HIGH);
    digitalWrite(displayPin6, HIGH);
    digitalWrite(displayPin7, LOW);
}

//writes a 0 in the 7-segment display
void write0() {
    digitalWrite(displayPin1, LOW);
    digitalWrite(displayPin2, LOW);
    digitalWrite(displayPin3, LOW);
    digitalWrite(displayPin4, HIGH);
    digitalWrite(displayPin5, LOW);
    digitalWrite(displayPin6, LOW);
    digitalWrite(displayPin7, LOW);
}

//returns the current LED status based on lightMode, lightLevel and secondsOfQuietness
int getLEDStatus(double lightLevel) {
    if (currentLightMode == LIGHT_OFF) {
        return LOW;
    } else if (currentLightMode == LIGHT_ON) {
        return HIGH;
    } else if (currentLightMode = LIGHT_AUTO) {
        if (isDarkEnough(lightLevel) && (secondsOfQuietness < MAX_QUIETNESS_SECONDS)) {
            return HIGH;
        } else {
            return LOW;
        }
    }
}


