// This #include statement was automatically added by the Particle IDE.
#include "SparkJson.h"

SYSTEM_MODE(SEMI_AUTOMATIC);

char *lightModes[] = { "off", "on", "auto"};

int LIGHT_OFF  = 0;
int LIGHT_ON   = 1;
int LIGHT_AUTO = 2;

int currentLightMode = LIGHT_AUTO;
int previousButtonState = 0;

double prevMillis = 0;

void setup()
{
    Serial.begin(9600);
    pinMode(D0, OUTPUT);
    Spark.function("setLightMode", setLightMode);
}

int setLightMode(String lightMode) {

    currentLightMode = lightMode.toInt();
    return 1;
}

void loop()
{

    double lightLevel = 1 - (analogRead(A0) / 4095.0);
    double proximity = analogRead(A1) / 4095.0;



    if (Serial.available() > 0) {
        String command = Serial.readString();
        setLightMode(command);
    }

    String json = buildJSON(lightLevel, proximity);

    if (millis() - prevMillis >= 1000) {
        Spark.publish("deviceStatus", json);
        prevMillis = millis();
    }

    Serial.println(json);

    int currentButtonState = digitalRead(D1);
    //button pressed
    if(currentButtonState == 1 && previousButtonState == 0) {
        toggleLightMode();
    }

    previousButtonState = currentButtonState;
    digitalWrite(D0, getLEDStatus(lightLevel));
}

String buildJSON(double lightLevel, double proximity) {
    StaticJsonBuffer<200> jsonBuffer;

    JsonObject& root = jsonBuffer.createObject();
    root["light"] = lightLevel;
    root["proximity"] = proximity;
    root["lightMode"] = lightModes[currentLightMode];
    root["ledStatus"] = getLEDStatus(lightLevel) == 1 ? "on" : "off";

    //JsonArray& data = root.createNestedArray("data");
    //data.add(48.756080, 6);  // 6 is the number of decimals to print
    //data.add(2.302038, 6);   // if not specified, 2 digits are printed

    char buffer[256];
    //Serial.println("testing");
    root.printTo(buffer, sizeof(buffer));
    return buffer;
}

bool isDarkEnough(double lightLevel) {
    return lightLevel <= 0.7;
}

void toggleLightMode() {
    currentLightMode = (currentLightMode + 1) % 3;
}

int getLEDStatus(double lightLevel) {
    if (currentLightMode == LIGHT_OFF) {
        return LOW;
        //digitalWrite(D0, LOW);
    } else if (currentLightMode == LIGHT_ON) {
        return HIGH;
        //digitalWrite(D0, HIGH);
    } else if (currentLightMode = LIGHT_AUTO) {
        if (isDarkEnough(lightLevel)) {
            return HIGH;
            //digitalWrite(D0, HIGH);
        } else {
            return LOW;
            //digitalWrite(D0, LOW);
        }
    }
}


