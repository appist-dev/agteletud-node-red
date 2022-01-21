## Motivation

Der Wecker klingelt und der Kaffee ist bereits gekocht, da die Kaffeemaschine wusste, wann der Handywecker klingeln wird
und die Rollläden im ganzen Haus fahren auch bereits automatisch hoch. Früher noch als „Zukunftsmusik“ beschrieben, sind
Funktionen wie diese heute bereits in schätzungsweise 10 Millionen [1] deutschen Haushalten verbaut. „Home Automation“,
„Smart Home“ und „Internet of Things“ (engl. kurz IoT) sind damit heutzutage keine Fremdwörter mehr.

Dank dem anhaltenden Verbrauchertrend zu „Smart Home“ im eigenen Haus gelangen mehr und mehr Menschen in Kontakt mit
Technik, welche Internetfähig ist, Sensoren und Aktoren besitzt und vollautomatisiert Entscheidungen treffen kann. Wie
bei den bereits genannten Beispielen ist das Internet der Dinge oft leicht zu verstehen, jedoch häufig komplex in der
Implementierung. Ein von IBM veröffentlichtes Tool, welches beim Einstieg in das komplexe Thema helfen kann, ist
Node-Red. Mit grafischem Editor und Bausteinsystem hilft es Sensoren und Aktoren leicht miteinander zu verbinden.

Die Anwendungen für das Tool selbst sind nahezu unbegrenzt. Selbst seine Eignung in der Industrie ist nicht unerheblich.
Mit Node-Red kann man schnell, übersichtlich und grafisch dargestellt mehrere Webservices miteinander verbinden, Daten
abfragen, auswerten und speichern. Dank eingebautem Dashboard können die gewonnenen Erkenntnisse dazu noch im Webbrowser
visualisiert werden.

Auf diese Weise erfüllt das Tool viele Aufgaben der modernen Automatisierungstechnik, die oftmals nur mit viel
Programmieraufwand zu realisieren sind. Die große Community hinter Node-Red ermöglicht zusätzlich noch durch Hunderte
Module den Funktionsumfang stark zu erweitern. Weiterhin benötigt das Tool sehr wenig Speicherplatz und kann daher auch
direkt auf Industriesystemen installiert werden.

## Werkzeuge und Grundlagen

Hauptbestandteil der Arbeit ist das Open-Source Tool Node-Red [2]. Es basiert vollständig auf einem anfängerfreundlichen
Bausteinsystem. In den sogenannten Flows kann man kinderleicht ohne große Programmierkenntnisse komplexe Anwendungen
aufbauen. Das Tool kann auf folgenden Plattformen installiert werden: Lokal auf jedem PC mit nahezu jedem
Betriebssystem, Auf dem Android Mobilgerät, auf Raspberry Pis und BeagleBone Boards oder auch direkt in Cloudservices
wie: IBM-Cloud, Amazon AWS oder Microsoft Axure.

Zur Installation sind einfache Computerkenntnisse zum Installieren eines Programmes auf dem eigenen System notwendig.

In dieser Arbeit wurde Node-Red auf einem Raspberry Pi 4 installiert. Nach erfolgreicher Installation kann Node-Red
bequem über den Browser erreicht werden. In Node-Red selbst wird unterschieden zwischen dem Node-Red UI und dem Node-Red
Dashboard. Das Node-Red UI, dient als grafische Benutzeroberfläche zur Programmierung der Flows. Um die durch die Flows
ermittelten Werte besser zu veranschaulichen, existiert zusätzlich noch das Node-Red Dashboard. Beide Instanzen können
durch unterschiedliche Ports auf dem Node-Red System erreicht werden.

Die Software bietet ebenfalls die Möglichkeit, das Funktionsspektrum der bereits installierten „Standard“-Nodes durch
Module zu ergänzen. Diese Module enthalten dann zumeist zusätzliche Nodes. Durch die Größe der Node-Red Community und
der nahezu unbegrenzten Anwendungsmöglichkeiten im Bereich des IoT, kann das Tool durchaus auch komplexen
Industrie-Anwendungen gerecht werden. Beispielsweise wurde Node-Red bereits von Zare et al. [5] gezeigt, dass Node-Red
als SCADA System zum Einsatz kommen kann. Ein ähnliches System wie bereits von Zare vorgeschlagen wurde im Rahmen dieses
Projektes als Beispiel umgesetzt und wird im nachfolgenden näher erläutert.

Um das Zusammenschalten mehrere Webservices zu simulieren, wurde die Open-Source Javascript Laufzeitumgebung Node.js
genutzt. Die Webservices können so alle mithilfe des “Node Package Managers“, kurz npm[3], hintereinander gestartet
werden. In der Simulation laufen diese dann auf einem Windows PC. Um die Webservices lokal laufen zu lassen muss das
git-repository[4] gedownloadet werden und „Node.js“ sowie der “Node Package Manager“ auf dem System installiert sein.
Durch den Aufruf von „npm install“ im Stamm-Verzeichnis des Projektes werden die nötigen „node-modules“ wie „mqtt“
installiert. Durch den Aufruf von npm run start wird dann die Webservices.js Datei gestartet und Node-Red beginnt mit
der Auswertung der Daten.

## Anforderungen

Es soll das Tool „Node-Red“ hinsichtlich seiner Anwendbarkeit in der Industrie, Funktionalität und Erweiterbarkeit
untersucht werden. Dabei soll mithilfe dieses Tools eine einfache Möglichkeit implementiert werden, um mehrere
Web-Services gewinnbringend miteinander zu verschalten. Eine konkrete Aufgabenstellung wurde dabei nicht vorgegeben.

#### Anforderungen der Industrie 4.0

1. [IA01]Das Tool soll in industriellen Umgebungen lauffähig sein
2. [IA02]Das Tool soll 24/7, rund-um-die-Uhr lauffähig sein
3. [IA03]Das Tool soll einen hohen Grad an Interoperabilität besitzen
4. [IA04]Das Tool soll mit älteren und neuen Maschinen kompatibel sein
5. [IA05]Das Tool soll ergonomisch und anwendungsorientiert sein
6. [IA06]Das Tool soll Analytics Funktionen effizient anbinden können

#### Anforderungen an die Erweiterbarkeit

1. [EA01]Das Tool bietet eine Möglichkeit zur Funktionserweiterung
2. [EA02]Das Tool bietet eine Möglichkeit eigene Erweiterungen einzubinden
3. [EA03]Programmcode soll einfach zu importieren und exportieren sein

#### Anforderungen an das Beispiel-Szenario Node-Red als SCADA System

1. [SA01]Das Tool soll Änderungen im Ausgangssystem gut sichtbar für Benutzer visualisieren
2. [SA02]Das Tool soll Alarme und deren Attribute aller Services anzeigen
3. [SA03]Das Tool soll Alarme geordnet anzeigen
4. [SA04]Das Tool soll Alarme zu dem Webservices zuordnen von dem Sie stammen
5. [SA05]Das Tool soll ein UI besitzen welches leicht verständlich und übersichtlich ist
6. [SA06]Das Tool soll die empfangenen Daten schnell bearbeiten

## Entwurfsvarianten und Entwurf

#### Node-Red als SCADA System

{{protele:documentation:node-red:rothhaupt_marcus:scada_system_sketch.png?500}}

#### Generierung der Simulationsdaten mittels Node.js

##### UML Klassendiagramm von Webservices.js

{{protele:documentation:node-red:rothhaupt_marcus:node-red_class-node_red_uml_class_diagramm.png?400}}

##### UML Sequenzdiagramm der MQTT Alarmübertragung

{{protele:documentation:node-red:rothhaupt_marcus:node-red_alarms-node_red_alarm_handling.png?400}}

##### UML Sequenzdiagramm der MQTT Datenübertragung

{{protele:documentation:node-red:rothhaupt_marcus:node-red_mqtt_uml-mqtt_communication_of_node_red_webservice.png?600}}

## Implementierung

#### Kommunikationsdiagramm

{{protele:documentation:node-red:rothhaupt_marcus:project_diagramm.png?500}}

#### Node-Red Flow

{{protele:documentation:node-red:rothhaupt_marcus:node-red_flow.jpg?800}}

#### Abruf der Daten eines Webservices

{{protele:documentation:node-red:rothhaupt_marcus:mqtt_motor_rotation_speed_flowelement.jpg?400}}

#### Verarbeitung der generierten Alarme

{{protele:documentation:node-red:rothhaupt_marcus:node-red_alarm_flowelements.jpg?800}}

## Fallstudie / Test

- Simulation eines Alarms
- Wird angezeigt im UI

## Diskussion der Ergebnisse / Validierung

## Ausblick
