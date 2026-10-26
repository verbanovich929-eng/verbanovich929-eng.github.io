# Avatar voice demonstration

Locally synthesized Russian speech, not recordings of clients.

Engine: sherpa-onnx 1.12.40 (CPU). Voices: Piper ru_RU-dmitri-medium and ru_RU-denis-medium, distributed in the official sherpa-onnx tts-models release. Both model cards identify their source dataset as NabuCasa/voice-datasets with the CC0 license. No model weights are included in this website.

Sources:
- https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-dmitri-medium.tar.bz2
- https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-denis-medium.tar.bz2
- https://github.com/NabuCasa/voice-datasets

calm.mp3 and energy.mp3 demonstrate two tempos of the Dmitri voice; warm.mp3 demonstrates the Denis voice. MP3 files normalized to -16 LUFS with a -1.5 dB true-peak target.

Transcript: «Привет! Я помогу рассказать о вашем проекте. Выбираем образ, пространство и подачу — и собираем вашу историю».
