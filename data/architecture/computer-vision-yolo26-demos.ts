import type { Flow } from './types';

export const flow: Flow = {
  nodes: [
    {
      id: 'input', group: 'user', col: 0, row: 0,
      label: { en: 'Camera or drone video', es: 'Cámara o vídeo de dron' },
      notes: {
        en: ['An ordinary camera for workouts, aerial video for parking, a single camera for the robot cell.'],
        es: ['Una cámara corriente para entrenar, vídeo aéreo para aparcar y una sola cámara para la celda robótica.'],
      },
    },
    {
      id: 'toolkit', group: 'backend', col: 1, row: 0, tech: 'Python OpenCV',
      label: { en: 'Shared toolkit + YAML', es: 'Kit común + YAML' },
      notes: {
        en: [
          'Video I/O, drawing, registration, zones and a training script shared by all three demos.',
          'A new demo is mostly a run script and a YAML file.',
        ],
        es: [
          'Entrada y salida de vídeo, dibujo, registro, zonas y un script de entrenamiento comunes a las tres demos.',
          'Una demo nueva es sobre todo un script de ejecución y un archivo YAML.',
        ],
      },
    },
    {
      id: 'pose', group: 'ai', col: 2, row: 0, tech: 'YOLO26-pose',
      label: { en: 'YOLO26-pose', es: 'YOLO26-pose' },
      notes: {
        en: ['17 keypoints per person in one pass.', 'Tracks athletes in the workout monitor and workers in the robot cell.'],
        es: ['17 puntos clave por persona en una sola pasada.', 'Sigue a los atletas en el monitor de entrenamiento y a los operarios en la celda.'],
      },
    },
    {
      id: 'obb', group: 'ai', col: 2, row: 1, tech: 'YOLO26-OBB',
      label: { en: 'YOLO26-OBB rotated boxes', es: 'YOLO26-OBB cajas rotadas' },
      notes: {
        en: [
          'Top-down cars are rotated and densely packed, which defeats axis-aligned detectors.',
          'Pre-trained on aerial imagery for tight rotated boxes.',
        ],
        es: [
          'Vistos desde arriba, los coches están girados y muy juntos, algo que descoloca a los detectores alineados.',
          'Preentrenado con imágenes aéreas para obtener cajas rotadas ajustadas.',
        ],
      },
    },
    {
      id: 'yoloe', group: 'ai', col: 2, row: 2, tech: 'YOLOE-26',
      label: { en: 'YOLOE-26 segmentation', es: 'Segmentación YOLOE-26' },
      notes: {
        en: [
          'Segments robots from text prompts with no robot dataset at all.',
          'Negative prompts so people are never labelled as robots.',
        ],
        es: [
          'Segmenta los robots a partir de prompts de texto sin ningún conjunto de datos de robots.',
          'Prompts negativos para que nunca se etiquete a una persona como robot.',
        ],
      },
    },
    {
      id: 'track', group: 'backend', col: 3, row: 0,
      label: { en: 'ByteTrack + joint angles', es: 'ByteTrack + ángulos' },
      notes: {
        en: [
          'ByteTrack keeps a stable ID per athlete, so each person in a group gets their own counter.',
          'Knee, elbow, hip and body line read from whichever side the camera sees better.',
        ],
        es: [
          'ByteTrack mantiene un identificador estable por atleta, así que cada persona tiene su propio contador.',
          'Rodilla, codo, cadera y línea del cuerpo, leídos del lado que la cámara ve mejor.',
        ],
      },
    },
    {
      id: 'drift', group: 'data', col: 3, row: 1,
      label: { en: 'ORB + RANSAC drift fix', es: 'Deriva ORB + RANSAC' },
      notes: {
        en: [
          'Warps the slot map every few frames so it follows the drifting drone.',
          'False slot events over 35 seconds: 32 without it, 3 with it.',
        ],
        es: [
          'Reajusta el mapa de plazas cada pocos fotogramas para seguir al dron cuando deriva.',
          'Falsos eventos de plaza en 35 segundos: 32 sin ello, 3 con ello.',
        ],
      },
    },
    {
      id: 'distance', group: 'data', col: 3, row: 2,
      label: { en: 'Distance transform', es: 'Transformada de distancia' },
      notes: {
        en: [
          'Distance from any of 12 body keypoints, wrists included, to the robot mask.',
          "Converted to metres using the worker's own torso as a scale.",
        ],
        es: [
          'Distancia desde cualquiera de 12 puntos clave del cuerpo, muñecas incluidas, hasta la máscara del robot.',
          'Convertida a metros usando el torso del propio operario como escala.',
        ],
      },
    },
    {
      id: 'reps', group: 'backend', col: 4, row: 0,
      label: { en: 'Rep state machine + form', es: 'Repeticiones + técnica' },
      notes: {
        en: [
          'The exercise is detected automatically from torso, knee and elbow movement.',
          'A per-exercise hysteresis state machine separates full-range reps from partial ones.',
          'Form rules produce cues such as "Go deeper" or "Keep body straight".',
        ],
        es: [
          'El ejercicio se detecta solo a partir del movimiento del torso, la rodilla y el codo.',
          'Una máquina de estados con histéresis por ejercicio separa repeticiones completas de parciales.',
          'Las reglas de técnica generan avisos como "Baja más" o "Mantén el cuerpo recto".',
        ],
      },
    },
    {
      id: 'occupancy', group: 'backend', col: 4, row: 1,
      label: { en: 'Slot occupancy debounce', es: 'Ocupación con antirrebote' },
      notes: {
        en: [
          'Needs 1.5 s of evidence for free and 0.3 s for occupied: a car missed in shadow is more common.',
          'Uses the covered fraction of the slot rather than IoU, so vans bigger than the slot still count.',
        ],
        es: [
          'Exige 1,5 s de evidencia para libre y 0,3 s para ocupada: un coche perdido en la sombra es más frecuente.',
          'Usa la fracción de plaza cubierta en lugar de IoU, así que las furgonetas grandes también cuentan.',
        ],
      },
    },
    {
      id: 'safety', group: 'backend', col: 4, row: 2,
      label: { en: 'Safety state machine', es: 'Máquina de estados' },
      notes: {
        en: [
          'Floor zones, hysteresis (escalate immediately, release after one second) and a person-down detector.',
          'Recommends a robot speed of 100, 30 or 0 %.',
          'The last robot mask is kept for six seconds if a worker blocks the view.',
        ],
        es: [
          'Zonas de suelo, histéresis (escala al instante, relaja tras un segundo) y un detector de persona caída.',
          'Fija una velocidad recomendada del robot del 100, 30 o 0 %.',
          'La última máscara se conserva seis segundos si un operario tapa la vista del robot.',
        ],
      },
    },
    {
      id: 'hud', group: 'frontend', col: 5, row: 0, tech: 'OpenCV',
      label: { en: 'HUD + live dashboard', es: 'HUD + panel en vivo' },
      notes: {
        en: ['OpenCV HUD overlays on the annotated videos and a live occupancy dashboard.'],
        es: ['Superposiciones HUD de OpenCV sobre los vídeos anotados y un panel de ocupación en vivo.'],
      },
    },
    {
      id: 'json', group: 'data', col: 5, row: 1,
      label: { en: 'JSON reports', es: 'Informes JSON' },
      notes: {
        en: [
          'Each workout session writes reps, full-range reps, a form score and the issues raised.',
          'The parking device publishes a few bytes of JSON per minute.',
        ],
        es: [
          'Cada sesión escribe repeticiones, repeticiones completas, una puntuación de técnica y los problemas.',
          'El dispositivo de aparcamiento publica unos pocos bytes de JSON por minuto.',
        ],
      },
    },
    {
      id: 'events', group: 'backend', col: 5, row: 2, tech: 'MQTT',
      label: { en: 'Timestamped event log', es: 'Registro de eventos' },
      notes: {
        en: ['SAFE, SLOW and STOP commands with timestamps, ready for a PLC, OPC UA or MQTT.'],
        es: ['Órdenes SAFE, SLOW y STOP con marca de tiempo, listas para un PLC, OPC UA o MQTT.'],
      },
    },
    {
      id: 'rpi', group: 'infra', tech: 'NCNN Raspberry Pi',
      label: { en: 'Raspberry Pi + AI Camera', es: 'Raspberry Pi + AI Camera' },
      notes: {
        en: ['NCNN for Raspberry Pi 4/5 and a package for the Sony IMX500 on the Raspberry Pi AI Camera.'],
        es: ['NCNN para Raspberry Pi 4/5 y un paquete para el Sony IMX500 de la Raspberry Pi AI Camera.'],
      },
    },
    {
      id: 'jetson', group: 'infra', tech: 'TensorRT Jetson',
      label: { en: 'TensorRT FP16 on Jetson', es: 'TensorRT FP16 en Jetson' },
      notes: {
        en: ['YOLO26 is NMS-free end to end, which makes the exported graphs clean enough for NPUs.'],
        es: ['YOLO26 no necesita NMS de extremo a extremo, lo que deja los grafos exportados limpios para las NPU.'],
      },
    },
    {
      id: 'openvino', group: 'infra', tech: 'OpenVINO ONNX',
      label: { en: 'ONNX + OpenVINO', es: 'ONNX + OpenVINO' },
      notes: {
        en: ['The parking model was exported and benchmarked to ONNX and OpenVINO for Intel IPCs.'],
        es: ['El modelo de aparcamiento se exportó y evaluó en ONNX y OpenVINO para IPC Intel.'],
      },
    },
    {
      id: 'mobile', group: 'infra',
      label: { en: 'TFLite / CoreML mobile', es: 'TFLite / CoreML móvil' },
      notes: {
        en: ['The workout monitor exports to TFLite, CoreML and NCNN for on-device mobile apps.'],
        es: ['El monitor de entrenamiento se exporta a TFLite, CoreML y NCNN para apps móviles en el dispositivo.'],
      },
    },
    {
      id: 'on-device', group: 'security',
      label: { en: 'Video stays on the phone', es: 'El vídeo no sale del móvil' },
      notes: {
        en: ['On-device mobile export means video never leaves the phone.'],
        es: ['La exportación al dispositivo móvil hace que el vídeo nunca salga del teléfono.'],
      },
    },
    {
      id: 'decision-support', group: 'security',
      label: { en: 'Decision support only', es: 'Solo apoyo a la decisión' },
      notes: {
        en: ['A decision-support and near-miss analytics layer next to certified safety devices, not a safety function.'],
        es: ['Apoyo a la decisión y analítica de cuasi-accidentes junto a dispositivos certificados, no función de seguridad.'],
      },
    },
  ],
  edges: [
    { from: 'input', to: 'toolkit', label: { en: 'Video', es: 'Vídeo' } },
    { from: 'toolkit', to: 'pose' },
    { from: 'toolkit', to: 'obb' },
    { from: 'toolkit', to: 'yoloe' },
    { from: 'toolkit', to: 'drift', label: { en: 'Frames', es: 'Fotogramas' } },
    { from: 'pose', to: 'track', label: { en: 'Keypoints', es: 'Puntos clave' } },
    { from: 'pose', to: 'distance', label: { en: 'Keypoints', es: 'Puntos clave' } },
    { from: 'yoloe', to: 'distance', label: { en: 'Robot mask', es: 'Máscara' } },
    { from: 'obb', to: 'occupancy', label: { en: 'Rotated boxes', es: 'Cajas rotadas' } },
    { from: 'drift', to: 'occupancy', label: { en: 'Slot map', es: 'Mapa de plazas' } },
    { from: 'track', to: 'reps' },
    { from: 'distance', to: 'safety', label: { en: 'Metres', es: 'Metros' } },
    { from: 'reps', to: 'hud', label: { en: 'Cues', es: 'Avisos' } },
    { from: 'reps', to: 'json' },
    { from: 'occupancy', to: 'hud' },
    { from: 'occupancy', to: 'json' },
    { from: 'safety', to: 'hud' },
    { from: 'safety', to: 'events', label: { en: 'Speed %', es: 'Velocidad %' } },
  ],
};
