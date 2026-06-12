import React, { useState, useEffect } from 'react';
import listaPreguntas from './preguntas.json';

export default function App() {
  const [preguntasSimulador, setPreguntasSimulador] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [seleccionado, setSeleccionado] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [historialRespuestas, setHistorialRespuestas] = useState([]);
  const [quizTerminado, setQuizTerminado] = useState(false);

  const iniciarSimulador = () => {
    const preguntasMezcladas = [...listaPreguntas]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);

    setPreguntasSimulador(preguntasMezcladas);
    setIndiceActual(0);
    setSeleccionado(null);
    setRespondido(false);
    setPuntaje(0);
    setHistorialRespuestas([]);
    setQuizTerminado(false);
  };

  useEffect(() => {
    iniciarSimulador();
  }, []);

  if (preguntasSimulador.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando preguntas...</div>;
  }

  const preguntaActual = preguntasSimulador[indiceActual];

  const verificarRespuesta = (idxOpcion) => {
    if (respondido) return;
    setSeleccionado(idxOpcion);
    setRespondido(true);

    const esCorrecta = idxOpcion === preguntaActual.correcta;
    if (esCorrecta) {
      setPuntaje((prev) => prev + 1);
    }

    setHistorialRespuestas((prev) => [
      ...prev,
      {
        pregunta: preguntaActual.pregunta,
        opciones: preguntaActual.opciones,
        seleccionada: idxOpcion,
        correcta: preguntaActual.correcta,
        esCorrecta
      }
    ]);
  };

  const avanzarPregunta = () => {
    if (indiceActual + 1 < preguntasSimulador.length) {
      setIndiceActual((prev) => prev + 1);
      setSeleccionado(null);
      setRespondido(false);
    } else {
      setQuizTerminado(true);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Simulador Parcial DSI</h1>

      {!quizTerminado ? (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#666' }}>
            <span>Pregunta {indiceActual + 1} de {preguntasSimulador.length}</span>
            <span>Puntaje: {puntaje}</span>
          </div>

          <h3 style={{ marginBottom: '20px' }}>{preguntaActual.pregunta}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {preguntaActual.opciones.map((opcion, idx) => {
              let colorFondo = '#fff';
              let colorBorde = '#ccc';

              if (respondido) {
                if (idx === preguntaActual.correcta) {
                  colorFondo = '#d4edda';
                  colorBorde = '#28a745';
                } else if (idx === seleccionado) {
                  colorFondo = '#f8d7da';
                  colorBorde = '#dc3545';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => verificarRespuesta(idx)}
                  disabled={respondido}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    background: colorFondo,
                    border: `1px solid ${colorBorde}`,
                    borderRadius: '4px',
                    cursor: respondido ? 'default' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {opcion}
                </button>
              );
            })}
          </div>

          {respondido && (
            <button
              onClick={avanzarPregunta}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                float: 'right'
              }}
            >
              {indiceActual + 1 === preguntasSimulador.length ? 'Ver Resultados' : 'Siguiente'}
            </button>
          )}
          <div style={{ clear: 'both' }}></div>
        </div>
      ) : (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2>¡Simulador Finalizado!</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Tu Nota: {puntaje} / {preguntasSimulador.length} ({((puntaje / preguntasSimulador.length) * 100).toFixed(0)}%)
          </p>
          <button
            onClick={iniciarSimulador}
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            Volver a intentar (Nuevas preguntas al azar)
          </button>

          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3>Revisión de respuestas:</h3>
            {historialRespuestas.map((item, idx) => (
              <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #ddd', background: item.esCorrecta ? '#f4fff4' : '#fff5f5' }}>
                <p><strong>{idx + 1}. {item.pregunta}</strong></p>
                <p style={{ color: item.esCorrecta ? 'green' : 'red', margin: '4px 0' }}>
                  Tu respuesta: {item.opciones[item.seleccionada]}
                </p>
                {!item.esCorrecta && (
                  <p style={{ color: 'green', margin: '4px 0' }}>
                    Correcta: {item.opciones[item.correcta]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}