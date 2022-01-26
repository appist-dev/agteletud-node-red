## Motivation

<!---mit eigenen Worten
nicht einfach die Aufgabenstellung kopieren
nicht die persönliche Motivation, sondern die Motivation aus technischer Sicht (Warum sollten wir uns mit diesem Thema auseinandersetzen? Welche Anwendungen gibt es?)>
-->

Der Wecker klingelt und der Kaffee ist bereits gekocht, da die Kaffeemaschine wusste, wann der Handywecker klingeln wird und die Rollläden im ganzen Haus fahren auch bereits automatisch hoch. Früher noch als „Zukunftsmusik“ beschrieben, sind
Funktionen wie diese heute bereits in schätzungsweise 10 Millionen [1] deutschen Haushalten verbaut. „Home Automation“, „Smart Home“ und „Internet of Things“ (engl. kurz IoT) sind damit heutzutage keine Fremdwörter mehr.

Dank dem anhaltenden Verbrauchertrend zu „Smart Home“ im eigenen Haus gelangen mehr und mehr Menschen in Kontakt mit Technik, welche Internetfähig ist, Sensoren und Aktoren besitzt und vollautomatisiert Entscheidungen treffen kann. Wie bei den bereits genannten Beispielen ist das Internet der Dinge oft leicht zu verstehen, jedoch häufig komplex in der Implementierung. Ein von IBM veröffentlichtes Tool, welches beim Einstieg in das komplexe Thema helfen kann, ist Node-Red. Mit grafischem Editor und Bausteinsystem hilft es Sensoren und Aktoren leicht miteinander zu verbinden.

Die Anwendungen für das Tool selbst sind nahezu unbegrenzt. Selbst seine Eignung in der Industrie ist nicht unerheblich. Mit Node-Red kann man schnell, übersichtlich und grafisch dargestellt mehrere Webservices miteinander verbinden, Daten abfragen, auswerten und speichern. Dank eingebautem Dashboard können die gewonnenen Erkenntnisse dazu noch im Webbrowser visualisiert werden.

Auf diese Weise erfüllt das Tool viele Aufgaben der modernen Automatisierungstechnik, die oftmals nur mit viel Programmieraufwand zu realisieren sind. Die große Community hinter Node-Red ermöglicht zusätzlich noch durch Hunderte Module den Funktionsumfang stark zu erweitern. Weiterhin benötigt das Tool sehr wenig Speicherplatz und kann daher auch direkt auf Industriesystemen installiert werden.

## Werkzeuge und Grundlagen

<!---
Vorstellung der infrage kommenden Frameworks, APIs, Technologien, Methoden, Richtlinien, Prinzipien, Geräte etc. und der fachlichen Voraussetzungen zum Verständnis Ihrer Arbeit. Die Grundlagen sind vorzustellen und zu erläutern, nicht nur zu nennen.
-->

Hauptbestandteil der Arbeit ist das Open-Source-Tool Node-Red [2]. Es basiert vollständig auf einem anfängerfreundlichen Bausteinsystem. In den sogenannten Flows kann man kinderleicht ohne große Programmierkenntnisse komplexe Anwendungen aufbauen. Das Tool kann auf folgenden Plattformen installiert werden: Lokal auf jedem PC mit nahezu jedem
Betriebssystem, auf dem Android Mobilgerät, auf Raspberry Pis und BeagleBone Boards oder auch direkt in Cloudservices wie: IBM-Cloud, Amazon AWS oder Microsoft Axure.

Zur Installation sind einfache Computerkenntnisse zum Installieren eines Programmes auf dem eigenen System notwendig.

In dieser Arbeit wurde Node-Red auf einem Raspberry Pi 4 installiert. Nach erfolgreicher Installation kann Node-Red bequem über den Browser erreicht werden. In Node-Red selbst wird unterschieden zwischen dem Node-RedUI und dem Node-Red Dashboard. Das Node-Red UI, dient als grafische Benutzeroberfläche zur Programmierung der Flows. Um die durch die Flows ermittelten Werte besser zu veranschaulichen, existiert zusätzlich noch das Node-Red Dashboard. Beide Instanzen können durch unterschiedliche Ports auf dem Node-Red System erreicht werden.

Die Software bietet ebenfalls die Möglichkeit, das Funktionsspektrum der bereits installierten „Standard“-Nodes durch Module zu ergänzen. Diese Module enthalten dann zumeist zusätzliche Nodes. Durch die Größe der Node-Red Community und der nahezu unbegrenzten Anwendungsmöglichkeiten im Bereich des IoT, kann das Tool durchaus auch komplexen Industrie-Anwendungen gerecht werden. Beispielsweise wurde Node-Red bereits von Zare et al. [6] gezeigt, dass Node-Red als SCADA System zum Einsatz kommen kann. Ein ähnliches System wie bereits von Zare vorgeschlagen wurde im Rahmen dieses Projektes als Beispiel umgesetzt und wird im nachfolgenden näher erläutert.

Um das Zusammenschalten mehrere Webservices zu simulieren, wurde die Open-Source Javascript Laufzeitumgebung Node.js genutzt. Die Webservices können so alle mithilfe des "Node Package Managers", kurz npm[3], hintereinander gestartet werden. In der Simulation laufen diese dann auf einem Windows-PC. Um die Webservices lokal laufen zu lassen, muss das git-repository[4] gedownloadet werden und "Node.js" sowie der "Node Package Manager" auf dem System installiert sein.
Durch den Aufruf von „npm install“ im Stamm-Verzeichnis des Projektes werden die nötigen „node-modules“ wie „mqtt“ installiert. Durch den Aufruf von npm run start wird dann die Webservices.js Datei gestartet und Node-Red beginnt mit der Auswertung der Daten.

## Anforderungen
<!---
Herleitung der Anforderungen an die Lösung, die am Ende validiert werden.

Anforderungen sind eindeutig, das heißt eine klare Aussage ist möglich, ob oder bis zu welchem Grad die Anforderung eingehalten wurde. Anforderungen sind nummeriert Verwenden Sie soll/kann Formulierungen
-->

Es soll das Tool „Node-Red“ hinsichtlich seiner Anwendbarkeit in der Industrie, Funktionalität und Erweiterbarkeit untersucht werden. Dabei soll mithilfe dieses Tools eine einfache Möglichkeit implementiert werden, um mehrere Web-Services gewinnbringend miteinander zu verschalten. Eine konkrete Aufgabenstellung wurde dabei nicht vorgegeben. Die Anforderungen der Industrie 4.0 Fertigungs-IT sind dabei basierend auf einem Article von Nathalie Kletti.[10]

#### Anforderungen der Industrie 4.0

1. [IA01]Das Tool soll in industriellen Umgebungen lauffähig sein
2. [IA02]Das Tool soll 24/7, rund-um-die-Uhr lauffähig sein
3. [IA03]Das Tool soll einen hohen Grad an Interoperabilität besitzen
4. [IA04]Das Tool soll Analytics Funktionen effizient anbinden können
5. [IA05]Das Tool soll ergonomisch und anwendungsorientiert sein
6. [IA06]Das Tool soll mit älteren und neuen Maschinen kompatibel sein

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
7. [SA07]Das Tool soll empfangene Daten als Historie anzeigen können

## Entwurfsvarianten und Entwurf

<!---
Darlegung von möglichen Entwurfsvarianten und begründete Auswahl für den Entwurf.

Verwenden Sie bspw. folgende Struktur:

Anforderung A fordert B. Aufgrund C ergeben sich Varianten D, E oder F.
 Variante D hat die folgenden Nachteile und Vorteile...
 Variante E hat die folgenden Nachteile und Vorteile...
 Variante F hat die folgenden Nachteile und Vorteile...
Ich entscheide mich zur Realisierung für Variante X, weil Y
Achten Sie im gegebenen Beispiel darauf, dass die Bewertungskriterien für die Variantendiskussion homogen diskutiert werden. Das bedeutet, dass bei möglichst jeder Variante zu jedem Kriterium eine Aussage getroffen werden sollte. Solche Variantendiskussionen sollten für die wichtigsten Entwurfsentscheidungen durchgeführt werden. Empfohlen werden zwei bis vier derartige ausführliche Diskussionen.

Die eigene Lösung möglichst mithilfe von Diagrammen (z.B. UML, strukturierte Analyse, Struktogramm, …) erklären. Achten Sie auf die Verbindung von Bild und Text.
-->

#### Node-Red und seine Verwendung in der Industrie 4.0
Die Anforderungen IA01-IA05 sind mit dem Node-Red System an sich bereits vollumfänglich erfüllt. Node-Red kann auf verschiedensten Plattformen installiert werden und läuft selbstständig im Hintergrund. Speziell auf Linux basierten System sind damit IA01 und IA02 als Anforderungen erfüllt. Weiterhin stellt die Node-Red Plattform verschiedene Analytics Funktionen wie zum Beispiel das Debug Fenster nativ zur Verfügung. Die Anforderungen IA03 und IA05 werden durch die einfache Handhabung, Installation und Benutzerfreundlichkeit von Node-Red erfüllt. Der Zugriff auf die Entwicklungsumgebung ist einfach durch einen beliebigen Browser möglich und erfordert keine außergewöhnlichen IT-Kenntnisse oder Zusatzinstallationen auf dem Bediener-System.

Anforderung IA06 fordert EA01 bzw. EA02. Die Kompatibilität von Node-Red kann enorm erhöht werden durch Module, die entweder durch die Online-Community zur Verfügung gestellt werden oder selbsterstellt werden. Viele Hunderte Module sind auch bereits in einem Online-Katalog innerhalb der Node-Red Plattform jederzeit einfach integrierbar. Somit erweist sich Node-Red auch für diese Anforderungen als gute Lösung.

Der Programmcode eines jeden Node-Red Flows kann jederzeit einfach per export/import Funktion als .json heruntergeladen und weiter verwendet werden. Somit ist auch Anforderung EA03 erfüllt.

Um nun die Eignung von Anforderungen IA01-IA06 als erfüllt zu beweisen wurde ein Beispielszenario entworfen, welches Node-Red als SCADA System für einen Industrieofen simuliert. SA01 fordert IA03, wegen SA02-SA04 ergeben sich die Varianten V1 und V2. SA05 fordert IA05, wegen SA07 ergeben sich die Varianten V3 und V4. Dabei ergeben sich folgende Vor- und Nachteile der Varianten:
* **Variante V1: Kommunikation per HTTP**
  * Vorteile:
    * HTTP Funktionalität bereits eingebaut in Node-Red
  * Nachteile:
    * HTTP Server ist 
    * kein Quality of Service
* **Variante V2: Kommunikation per MQTT**
  * Vorteile:
    * Publish/Subscribe Modell ist sehr leichtgewichtig und datenarm
    * Übertragung erfolgt als byte array
    * 3 Level Quality of Service
    * Daten können im Falle von unerwarteten Beendigungen bei der nächsten Transaktion nachgereicht werden
    * Insgesamt übertragene Datenmenge ist kleiner als bei einer http-Nachricht
  * Nachteile:
    * MQTT muss erst nachinstalliert und speziell eingerichtet werden
* **Variante V3: Visualisierung der historischen Daten per Tabelle**
  * Vorteile:
    * Einzelne Zahlenwerte können über einen langen Zeitraum eingesehen werden
    * Einzelne Datenpunkte und deren zugehörige Attribute können direkt erkannt werden
  * Nachteile:
    * Ein Gefühl für die Entwicklung der Daten gegenüber der Zeit entsteht nicht 
* **Variante V4: Visualisierung der historischen Daten per Liniengrafik**
  * Vorteile:
    * Die Entwicklung der Daten gegenüber der Zeit kann leicht erkannt werden. 
    * Eine sprunghafte Veränderung wird sofort in der Grafik sichtbar
    * Durch sinnvolle Anordnung der Grafiken kann die übersichtlichkeit gewährleistet werden
  * Nachteile:
    * Die Grafiken können viel Platz auf dem Dashboard des Bedieners einnehmen

Für die Realisierung des Beispielsystems haben sich die Varianten V2 und V4 erwiesen. Aufgrund der hervorragenden Eignung von MQTT als Kommunikationsprotokoll in der IoT und der einfachen Integration in Node-Red wurde dieses Protokoll dem Standard HTTP Protokoll bevorzugt. Die Variante V4 wurde ebenfalls aufgrund der vielen Vorteile, der Benutzerfreundlichkeit und der frühzeitigen Erkennbarkeit von Anomalien im Verlauf der Daten als gute Wahl eingestuft.

#### Node-Red als SCADA System
Der Entwurf eines Beispielsystems begann mit dem nachfolgenden Schaubild. Es zeigt alle implementierten Elemente des Prozesses und wo sich in einem realen System entsprechende Sensoren befinden würden. Insgesamt besteht das System aus fünf Durchfluss- und zwei Temperatursensoren sowie einem Rotationsgeschwindigkeits- und einem Füllstandssensor. Der simulierte Prozess beschreibt eine Flüßigkeit, welche in einen Ofen bis zu einer bestimmten Füllhöhe eingelassen, verrührt und erhitzt wird. Jeder Sensor symbolisiert ein eigenständiges netzwerkfähiges IoT-Gerät und sendet per MQTT an Node-Red im sekundentakt seine aktuellen Prozessdaten. Weiterhin kennt jedes Gerät seine individuellen Grenzwerte und generiert somit zusätzlich Alarme welche ebenfalls an Node-Red weitergegeben werden.

{{protele:documentation:node-red:rothhaupt_marcus:scada_system_sketch.png?500}}

##### Kommunikationsdiagramm
Das hier gezeigte Kommunikationsdiagramm zeigt, wie die einzelnen Bestandteile des Beispielsystems miteinander verknüpft sind. Node-Red bekommt per MQTT die Prozessdaten und Alarme von den Webservices, verarbeitet diese und zeigt sie auf dem internen Dashboard welches über einen separaten Port per http aufgerufen werden kann. Der Anwender kann sich dann über seinen Browser das Dashboard anzeigen und alle Prozessdaten sowie grafischen Verläufe einsehen.

{{protele:documentation:node-red:rothhaupt_marcus:project_diagramm.png?500}}

##### UML Klassendiagramm von Webservices.js
Die Generierung der Prozessdaten und Alarme erfolgt in einer einzelnen Node.js Datei, welche mehrere Klassen und Funktionen beinhaltet. Diese sind im nachfolgenden UMl Klassendiagramm dargestellt.

{{protele:documentation:node-red:rothhaupt_marcus:node-red_class-node_red_uml_class_diagramm.png?400}}

##### UML Sequenzdiagramm der MQTT Datenübertragung
Die Übertragung der simulierten Sensordaten und Alarme erfolgt ähnlich mittels des Pub/Sub Prinzips von MQTT. Die Sensoren senden ihre Daten alle an die ihnen zugeordnete "MQTT-Topic" und werden so von dem Node-Red Flow weiterverarbeitet. Schließlich werden die einzelnen Alarme an eine gemeinsame "MQTT-Alarmtopic" gesendet und gebündelt. Die Alarme werden alle in der Datei alarms.csv abgelegt.

{{protele:documentation:node-red:rothhaupt_marcus:node-red_mqtt_uml-mqtt_communication_of_node_red_webservice.png?600}}

##### UML Sequenzdiagramm der Node-Red Alarmauswertung
Die Datei alarms.csv wird vom Node-Red Flow ständig auf änderungen überwacht. Falls eine Änderung erkannt wird, beginnt die Auswertung, Sortierung und Einordnung der Alarme in die Alarmtabelle des Dashboards.

{{protele:documentation:node-red:rothhaupt_marcus:node-red_alarms-node_red_alarm_handling.png?400}}

#### Entwurf des Node-Red Dashboard
Das Design des Dashboards wurde so gewählt, dass es einfach, verständlich und übersichtlich ist. Veränderungen der Daten sind leicht sichtbar und durch entsprechende Farbwahl leicht zu interpretieren. Wie im Buch von Zuehlke[5] erwähnt, hat der Mensch das Bedürfnis nach Klarheit und Ordnung in seiner Wahrnehmung. Jedes Element des SCADA-Dashboards musste also gut ausgerichtet und innerhalb der Bildschirmfläche platziert werden, um diesen Designprinzipien zu entsprechen.

{{protele:documentation:node-red:rothhaupt_marcus:image_dashboard.jpg?800}}

#### Entwurf des Node-Red Flows
Hier abgebildet ist der Node-Red Flow mit allen Elementen und Verbindungen des SCADA-Systems.

{{protele:documentation:node-red:rothhaupt_marcus:node-red_flow.jpg?800}}

## Implementierung

<!---
Bitte nicht einfach den vollständigen Quelltext posten, sondern vielmehr ausgewählte, repräsentative und wichtige Aspekte der Realisierung diskutieren.
-->
    #TODO: Rename NODE-RED Flow and Title of UI to SCADA

#### Generierung und Abruf der Simulationsdaten eines Webservices

##### Node.js
Die Simulationsdaten werden in einer dauerhaften Schleife im Abstand von einer Sekunde für jeden Sensor generiert. Die Generierung basiert dabei weder auf komplexen mathematischen Operationen noch auf Beispieldaten von echten Sensoren. Zur Generierung werden ausschließlich einfache Addition und Subtraktion sowie kleinere zufällig generierte Werte verwendet. Die Simulationsdaten werden für jeden Sensor per MQTT an die jeweilige MQTT-Topic veröffentlicht("published").

##### Node-Red
Die Simulationsdaten werden von Node-Red direkt zu den Dashboard-Elementen weitergeleitet. Der entsprechende Teil des Node-Red Flows ist beispielsweise für den Motorrotationsgeschwindigkeitssensor hier dargestellt. Die Funktion "reset chart" wird nur aufgerufen, wenn die Node.js Simulationsumgebung neu gestartet wird.

{{protele:documentation:node-red:rothhaupt_marcus:mqtt_motor_rotation_speed_flowelement.jpg?400}}

#### Generierung und Abruf von Alarmen

##### Node.js
Die Alarme werden basierend auf vorher festgelegten Grenzwerten generiert. Die Grenzwerte variieren je nach Sensortyp. Sobald ein Grenzwert erreicht ist, geht wachsen die simulierten Rohdaten wieder in die entgegengesetzte Richtung. In realen Systemen wäre zu diesem Zeitpunkt ein Handeln des Personals erforderlich. Nach der Generierung werden diese im comma-seperated-value(csv)-Format per MQTT an den Node-Red MQTT Server übertragen.

##### Node-Red
Wie bereits im Sequenzdiagramm in der Sektion "Entwurf" gezeigt, werden die empfangenen Alarme zunächst in eine Datei geschrieben bevor sie verarbeitet werden. Danach wird direkt eine Alarmnachricht rechts unten im Dashboard angezeigt und zeitgleich die zweite dargestellte Zeile des Node-Red-Flows ausgelöst. Sobald Änderungen an der überwachten Datenbank Datei alarms.csv erkannt werden, beginnt die Ordnung aller Alarme aus der alarms.csv Datei entsprechend ihrer Zeitstempel. Kurz darauf werden sie in die Tabelle des Dashboards eingefügt.

{{protele:documentation:node-red:rothhaupt_marcus:node-red_alarm_flowelements.jpg?800}}

#### Node-Red Best Practices
Node-Red bietet eine schnelle Möglichkeit zur Erstellung einfacher IoT relevanter Applikationen. Jedoch können Flows auch ebenso schnell mit wachsendem Funktionsumfang in der Komplexität stark zunehmen. Umso wichtiger ist es, sich an gute Vorgaben "Best Practices" zu halten und diese auch konsequent umzusetzen. Mit der Hilfe von [12] wurden folgende Best Practices zusammengefasst:

1. Flows Organisieren:
   1. Flows in kleiner Gruppen teilen und Flow Reiter nutzen, um Funktionen zu separieren
   2. Wiederverwendbare Komponenten erstellen, indem Link Nodes und Subflows verwendet werden
   3. Zustand der Flows im Auge behalten und wenn möglich (per MQTT) von außen steuern
   4. Fehlerbehandlung korrekt durchführen, indem Catch Nodes und die Debug Funktion von Node-Red genutzt werden
2. Nachrichten Organisieren:
   1. Vorhandene Nachrichteneigenschaften wie msg.payload sinnvoll nutzen
   2. Eigenschaften der Nachrichten sinnvoll benennen
   3. Neue Nachrichteneigenschaften entwickeln, um die Übersichtlichkeit des Codes zu garantieren
3. Flows dokumentieren:
   1. Guter Code sollte gut dokumentiert sein
   2. Node-Red als visuelle Programmierschnittstelle bietet verscheiden Möglichkeiten zur Dokumentation von Code
   3. Anordnung von Flow Elementen muss gut strukturiert sein
   4. Die Benennung einzelner Flow Element hilft beim Verständnis der Funktionalität
   5. Elemente mit mehreren Ausgängen, können Ausgangsbeschriftungen besitzen
   6. Kommentare sollten zwischen den Nodes genutzt werden
   7. Die Gruppierung der Elemente kann die Übersichtlichkeit bei vielen nodes Vereinfachen

## Fallstudie / Test

<!---
Zeigen Sie anhand eines Beispiels, dass Ihre Lösung aus dem Entwurf die gestellten Anforderungen erfüllt. Dazu sollte ein aussagefähiges, realistisches Beispielszenario gewählt werden.
-->
    -TODO
An sich ist das Node-Red SCADA Beispiel bereits ein realistisches Beispielszenario, welches auch von anderen Autoren bereits erprobt worden ist[6]. Es zeigt eindeutig die Fähigkeit von Node-Red, als industrietaugliches Programm eingesetzt zu werden. Dennoch möchte ich trotzdem im nachfolgenden ein Beispielszenario für die Funktion des Node-Red SCADA Systems näher erläutern.

#### Test 1: Anzeige eines Alarms im Dashboard
Nach Festlegung der Obergrenze von 240 u/min für den Sensor der Rotationsgeschwindigkeit des Motors wurde die Simulation für alle Services gestartet. Nachdem der Wert der Rotationsgeschwindigkeit zunächst stieg erreicht dieser den kritischen Wert von 240 u/min nach genau 74 sekunden. Dadurch wurde ein Alarm ausgelöst und per MQTT an Node-Red gesendet. Dabei wurde der Zeitstempel, der Typ des Alarms sowie die Sensorzugehörigkeit und der aktuelle Wert des Sensors mitgeliefert. 

Die Übertragung der Daten per MQTT an Node-Red dauerte nur einen bruchteil einer sekunde. Node-Red verarbeitet den Alarm[SA06], ordnet ihn zusammen mit den anderen Alarmen [SA03][SA04] und stellt die Daten in einer Tabelle, welche übersichtlich im Dashboard angezeigt wird[SA05][SA02], dem Nutzer zur Verfügung. Siehe Abbildung. Zusätzlich wird eine Meldung angezeigt, die dem Nutzer den Eingang eines neuen Alarms symbolisiert. Der augenscheinlich vorhandene zweite Alarm zum Zeitpunkt 75 wird angezeigt, da der Grenzwert nach einer Sekunde immer noch überschritten ist.

{{protele:documentation:node-red:rothhaupt_marcus:image_alarm_test?300}}

#### Test 2: Anzeige von Daten im Dashboard
Ähnlich zur Übertragung der Alarme werden Daten von Sensoren sekündlich übertragen und von Node-Red ausgewertet. Hierbei kommt nun noch die Visualisierung der Daten und der Historie hinzu[SA07][SA01]. Wie in der Abbildung zu sehen, sind die Sensordaten des Rotationssensors bis zum Zeitpunkt kurz vor 19:38:50 kontinuierlich, entsprechend der festgelegten Simulation gestiegen. Danach haben die Daten begonnen wieder sinken. Durch die Darstellung als Liniendiagramm kann der Nutzer den Verlauf gut verfolgen.

{{protele:documentation:node-red:rothhaupt_marcus:image_rotationspeed_data?300}}

## Diskussion der Ergebnisse / Validierung

Die Eignung von Node-Red als Industrie 4.0 fähiges System wurde durch das Beispielszenario gezeigt. Alle Anforderungen an die Fertigungs-IT von morgen werden durch Node-Red abgedeckt und eventuelle Funktionalitätslücken werden durch eine große Online-Community, leicht austauschbaren Quellcode und individuelle erstellbare module wett gemacht. Weiterhin kann Node-Red auch als Modbus Kommunikationsschnittstelle[8], als Modbus-OPC UA Wrapper[7] und als Prototyp-Werkzeug für IoT Applikationen[9] genutzt werden.

## Ausblick

<!---
Die Validierung der Ergebnisse sollte nicht behandelte oder unvollständig gelöste Probleme offenbaren. Die Nachverfolgung dieser offenen Fragestellungen sollte hier für zukünftige Arbeiten vorgeschlagen werden. Dabei sollten mögliche Lösungsstrategien aufbauend auf Ihrer Lösung oder Ihrer fachlichen Kenntnisse erörtert werden.
-->

Node-Red kann in einer Vielzahl von Industrieanwendungen genutzt werden. Dabei sollte stets darauf geachtet werden, dass die Node-Red Best Practices eingehalten werden. Wie eine Umfrage aus dem Jahr 2019[11] gezeigt hat, ist Node-Red weiterhin am Wachsen und besonders im kommerziellen Bereich am Aufsteigen. Auch in Zukunft wird es daher eine große Node-Red Community und so einen noch langen Support für das Open-Source-Tool geben.

Trotz alledem gibt es noch offene Fragestellungen, welche in einem späteren Projekt noch genauer beleuchtet werden könnten. Eine Frage bezieht sich auf die genaue Entwicklung von eigenen Modulen für Node-Red. Es wäre interessant zu wissen, wie genau die Entwicklung von eigenen Modulen zur Funktionserweiterung von Node-Red funktioniert. In einigen Online-Forum ist zu lesen, dass dies durch die Manipulation des Source-Codes von Node-Red möglich ist. 

Weiterhin wäre eine Übersicht über bestehende Schnittstellen zu anderen Frameworks oder bestimmte Software-Integrationen eine sinnvolle Arbeit.

Schlussendlich bleibt noch zu sagen, dass die Arbeit mit Node-Red trotz seines Umfangs große Freude bereiten kann, da die Entwicklung mithilfe von Flows schon an einigen Stellen übersichtlicher und vor allem aber einsteigerfreundlicher sein kann, als die Nutzung einer herkömmlichen Programmiersprache und Programmierprinzipien. 

Durch den großen Funktionsumfang und besonders gute Eignung als Heimautomatisierungstool wurde weiterhin beschlossen, dass das Tool auch ein hohes Maß an persönlichen Nutzen mit sich bringt und daher fortan beim Ersteller dieser Arbeit zur Anwendung kommt.