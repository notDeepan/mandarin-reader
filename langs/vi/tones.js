window.TONES = {
  title: 'The Six Tones',
  intro: 'Vietnamese has six tones. The tone mark is part of the spelling, and changing the tone changes the word: ma, mà and má are three different words.',
  tones: [
    { id: 'ngang', name: 'ngang', mark: 'a', markLabel: 'no mark', example: 'ma', meaning: 'ghost', describe: 'Flat, in the middle of your voice.', levels: [3, 3], audio: 'audio/vi/tones/ngang.mp3' },
    { id: 'huyen', name: 'huyền', mark: 'à', markLabel: 'grave accent', example: 'mà', meaning: 'but', describe: 'Starts low and drifts lower.', levels: [2, 1], audio: 'audio/vi/tones/huyen.mp3' },
    { id: 'sac', name: 'sắc', mark: 'á', markLabel: 'acute accent', example: 'má', meaning: 'mom', describe: 'Rises sharply, like a surprised question.', levels: [3, 5], audio: 'audio/vi/tones/sac.mp3' },
    { id: 'hoi', name: 'hỏi', mark: 'ả', markLabel: 'hook above', example: 'mả', meaning: 'grave (tomb)', describe: 'Dips down, then comes back up.', levels: [2, 1, 4], audio: 'audio/vi/tones/hoi.mp3' },
    { id: 'nga', name: 'ngã', mark: 'ã', markLabel: 'tilde', example: 'mã', meaning: 'horse', describe: 'In Saigon it sounds just like hỏi: down, then up.', levels: [2, 1, 4], audio: 'audio/vi/tones/nga.mp3' },
    { id: 'nang', name: 'nặng', mark: 'ạ', markLabel: 'dot below', example: 'mạ', meaning: 'rice seedling', describe: 'Low and heavy: dips a little, then lifts.', levels: [2, 1, 2], audio: 'audio/vi/tones/nang.mp3' }
  ],
  southNote: 'In Saigon, hỏi and ngã sound the same. They are still written differently, so learn both marks.',
  northNote: 'In Hà Nội, ngã rises with a catch in the voice, and nặng is short and cut off.',
  lettersTip: 'â ê ô ơ ư ă đ are separate letters, not tones. One syllable can carry both: ệ is ê with the nặng tone.',
  credit: 'Tone audio generated with ElevenLabs (elevenlabs.io)'
};
