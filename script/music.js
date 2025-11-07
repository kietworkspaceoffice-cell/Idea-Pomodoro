const startBell = document.getElementById("start-sound");
const endBell = document.getElementById("end-sound");


export function playBell(isStart) {
    if (isStart) {
        startBell.play();
    } else {
        endBell.play();
    }
}


// Hướng dẫn từ youtube

export function playVideo(id) {
  const iframe = document.getElementById(id);
  iframe.contentWindow.postMessage(
    '{"event":"command","func":"playVideo","args":""}',
    '*'
  );
}

export function pauseVideo(id) {
  const iframe = document.getElementById(id);
  iframe.contentWindow.postMessage(
    '{"event":"command","func":"pauseVideo","args":""}',
    '*'
  );
}

export function replayVideo(id) {
  const iframe = document.getElementById(id);
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func: "seekTo", args: [0, true] }),
    "*"
  );
  iframe.contentWindow.postMessage(
    '{"event":"command","func":"playVideo","args":""}',
    '*'
  );
}

export function setVolume(id, volume) {
  const iframe = document.getElementById(id);
  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: "setVolume",
      args: [volume]
    }),
    "*"
  );
}

export async function fadeVolume(id, targetVolume, duration = 1000) {
  const iframe = document.getElementById(id);
  let current = 0;
  const steps = 20; // số bước thay đổi âm lượng
  const stepTime = duration / steps;
  const step = targetVolume / steps;

  for (let i = 0; i <= steps; i++) {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "setVolume",
        args: [Math.round(current)]
      }),
      "*"
    );
    await new Promise(res => setTimeout(res, stepTime));
    current += step;
  }
}





// Hàm trích ID video từ nhiều loại URL khác nhau
export function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


// btn.addEventListener('click', () => {
//   const url = input.value.trim();
//   const videoId = extractVideoId(url);

//   if (videoId) {
//     iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1`;
//   } else {
//     alert('Link YouTube không hợp lệ!');
//   }
// });