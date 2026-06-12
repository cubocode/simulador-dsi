import React, { useState, useEffect } from 'react';
import listaPreguntas from './preguntas.json';
import './App.css';

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
    return (
      <div className="app-wrapper">
        <div className="simulador-card" style={{ textAlign: 'center', padding: '50px' }}>
          <p className="app-subtitle">Cargando preguntas...</p>
        </div>
      </div>
    );
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
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="app-title">Simulador Parcial DSI</h1>
        <p className="app-subtitle">Practica con preguntas al azar del examen</p>
      </header>

      {!quizTerminado ? (
        <div className="simulador-card">
          <div className="stats-row">
            <span className="stat-badge">Pregunta {indiceActual + 1} de {preguntasSimulador.length}</span>
            <span className="stat-badge">Puntaje: {puntaje}</span>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${((indiceActual + 1) / preguntasSimulador.length) * 100}%` }}
            ></div>
          </div>

          <h3 className="pregunta-titulo">{preguntaActual.pregunta}</h3>

          <div className="opciones-grid">
            {preguntaActual.opciones.map((opcion, idx) => {
              let statusClass = '';
              let suffixIcon = '';

              if (respondido) {
                if (idx === preguntaActual.correcta) {
                  statusClass = ' correcta';
                  suffixIcon = '✓';
                } else if (idx === seleccionado) {
                  statusClass = ' incorrecta';
                  suffixIcon = '✗';
                }
              }

              const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
              const letra = letras[idx] || (idx + 1);

              return (
                <button
                  key={idx}
                  onClick={() => verificarRespuesta(idx)}
                  disabled={respondido}
                  className={`opcion-btn${statusClass}`}
                >
                  <span>
                    <span className="opcion-letra">{letra}.</span>
                    {opcion}
                  </span>
                  {suffixIcon && <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{suffixIcon}</span>}
                </button>
              );
            })}
          </div>

          {respondido && (
            <button
              onClick={avanzarPregunta}
              className="btn-primary siguiente-btn"
            >
              {indiceActual + 1 === preguntasSimulador.length ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </button>
          )}
          <div style={{ clear: 'both' }}></div>
        </div>
      ) : (
        <div className="simulador-card resultados-container">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>¡Simulador Finalizado!</h2>

          <div className="score-circle">
            <span className="score-num">{puntaje}</span>
            <span className="score-total">de {preguntasSimulador.length}</span>
          </div>

          <p className="score-feedback">
            Nota obtenida: {((puntaje / preguntasSimulador.length) * 100).toFixed(0)}%
          </p>

          <button
            onClick={iniciarSimulador}
            className="btn-primary reiniciar-btn"
          >
            Volver a intentar (Nuevas preguntas)
          </button>

          <div className="revision-seccion">
            <h3>Revisión de respuestas</h3>
            {historialRespuestas.map((item, idx) => {
              const esCorrecta = item.esCorrecta;
              return (
                <div
                  key={idx}
                  className={`revision-card ${esCorrecta ? 'correcta-card' : 'incorrecta-card'}`}
                >
                  <p className="revision-pregunta"><strong>{idx + 1}. {item.pregunta}</strong></p>

                  <div className="revision-respuesta">
                    <span className={esCorrecta ? 'text-success' : 'text-danger'}>
                      {esCorrecta ? '✓ Tu respuesta:' : '✗ Tu respuesta:'}
                    </span>
                    <span>{item.opciones[item.seleccionada]}</span>
                  </div>

                  {!esCorrecta && (
                    <div className="revision-respuesta" style={{ marginTop: '6px' }}>
                      <span className="text-success">✓ Respuesta correcta:</span>
                      <span>{item.opciones[item.correcta]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <footer className="app-footer">
        Desarrollado por{' '}
        <a
          href="https://www.cubocode.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Cubo
        </a>
      </footer>
    </div>
  );
}