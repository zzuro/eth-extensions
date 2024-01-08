function download() {
    let url = window.location.href.replace(".html", "") + ".series-metadata.json";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let fileURL = data.selectedEpisode.media.presentations[0].url;
            fetch(fileURL)
                .then(async response => {
                    if (!response?.body) return;
                    const contentLength = response.headers.get('Content-Length');
                    const totalLength = typeof contentLength === 'number' ? contentLength : parseInt(contentLength, 10);
                    let receivedLength = 0;
                    const reader = response.body.getReader();
                    const chunks = [];
                    document.getElementById("perc").style.display = "inline";
                    document.getElementById("download_butoon").style.display = "none";

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                        receivedLength += value.length;
                        if (typeof totalLength === 'number') {
                            const step = receivedLength / totalLength * 100;
                            document.getElementById("perc").textContent = "Downloading: " + step.toFixed(2) + "%";
                        }
                    }

                    const blob = new Blob(chunks, {
                        type: 'video/mp4'
                    });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = data.selectedEpisode.title + '.mp4';
                    a.click();
                    window.URL.revokeObjectURL(url);

                    document.getElementById("perc").style.display = "none";
                    document.getElementById("download_butoon").style.display = "inline";
                    document.getElementById("perc").textContent = "Downloading: 0%";

                });
        });
}


const init = function () {
    const search = document.getElementsByClassName("searchinput basecomponent")[0];
    const element = document.createElement('button');
    element.textContent = "Download";
    element.style.width = "100px";
    element.addEventListener('click', download);
    element.id = "download_butoon";
    const perc = document.createElement('span');
    perc.textContent = "Downloading: 0%";
    perc.id = "perc";
    perc.style.display = "none";
    search.insertBefore(element, search.getElementsByClassName("clear")[0]);
    search.insertBefore(perc, search.getElementsByClassName("clear")[0]);

}

init();
