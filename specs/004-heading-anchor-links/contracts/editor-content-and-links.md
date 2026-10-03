# Contract: Heading-IDs und interne Links

## Persisted content

Das bestehende Strapi-Feld speichert weiterhin serialisiertes Tiptap/ProseMirror-JSON. Ein Heading kann zusätzlich `attrs.id` tragen:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2, "tag": "h2", "id": "details" },
      "content": [{ "type": "text", "text": "Details" }]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Zu den Details",
          "marks": [{ "type": "link", "attrs": { "href": "#details" } }]
        }
      ]
    }
  ]
}
```

- `id` ist optional; gespeicherte Dokumente ohne `id` bleiben gültig.
- `level`, `tag`, Text und bestehende Linkattribute behalten ihre bisherige Bedeutung.
- Eine gewählte Sprungmarke erzeugt ein Linkziel mit exakt einem vorangestellten `#`.
- IDs müssen nur innerhalb desselben Editor-Contents eindeutig sein.

## Admin UI contract

- `heading: true`, eine Heading-Konfiguration ohne `jumpLinks` und `heading: { jumpLinks: false }` zeigen keine Sprungmarken-Bedienung. Nur `heading: { jumpLinks: true }` aktiviert sie; ein deaktiviertes Heading-Preset schaltet sie ebenfalls aus.
- Der Server akzeptiert für `heading.jumpLinks` nur `true` oder `false` und lehnt andere Werte bei der Konfigurationsvalidierung ab.
- Bei einer ausgewählten Überschrift und aktivierter Heading-Funktion mit `jumpLinks: true` öffnet ein eigenes Symbol den Dialog zum Setzen, Ändern oder Entfernen der ID.
- Bei ungültiger oder doppelter ID bleibt der gespeicherte Heading-Zustand unverändert und der Dialog zeigt einen verständlichen Fehler am Eingabefeld.
- Bei aktivierter Link-Funktion und `heading.jumpLinks: true` bietet der Link-Dialog beim Öffnen alle gültigen, eindeutigen Sprungmarken des aktuellen Editor-Contents in Dokumentreihenfolge an. Er zeigt Überschriftentext und ID.
- Ohne `jumpLinks: true` bleiben manuelle `#id`-Linkziele möglich.
- Das Auswahlfeld nutzt die verfügbare Breite des Dialogfelds; die aufgeklappte Liste ist mindestens so breit wie ihr Auslöser.
- Auswahl eines Vorschlags setzt die URL auf `#<id>`; der Nutzer kann weiterhin eine URL frei eingeben sowie Links bearbeiten oder entfernen.
- Nach einer automatischen Bereinigung doppelt geladener IDs wird ein sichtbarer Hinweis gezeigt.
- Beschriftungen, Hinweise und Fehlermeldungen der Sprungmarken- und Link-Bedienung sind für Englisch und Deutsch hinterlegt und folgen der Strapi-Spracheinstellung.

## HTML rendering contract

- Die erweiterte Heading-Definition rendert `attrs.id: "details"` als `id="details"` am HTML-Heading, zum Beispiel `<h2 id="details">Details</h2>`.
- Das Link-Mark rendert `href="#details"` als internes Fragmentziel.
- Frontends, die das gespeicherte JSON selbst in HTML umwandeln, müssen eine Heading-Erweiterung mit demselben `id`-Attribut registrieren. Die Standard-Heading-Erweiterung allein garantiert die Ausgabe des zusätzlichen Attributs nicht.
- Die Ausgabe muss Attributwerte regulär escapen; ID-Werte dürfen nicht als HTML-Code eingefügt werden.

## Compatibility

- Keine neue Serverroute und kein geänderter Custom-Field-Typ. Der zusätzliche Preset-Schlüssel `heading.jumpLinks` ist optional und standardmäßig deaktiviert. Gespeicherte Heading-IDs bleiben bei deaktivierter Option erhalten.
- Die neue ID-Eingabe wird nur bei aktivierter Heading-Funktion mit `jumpLinks: true` angeboten. Die neue Vorschlagsauswahl erscheint zusätzlich nur bei aktivierter Link-Funktion. Bestehende Preset-Schalter behalten ihre bisherige Wirkung.
