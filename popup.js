document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("decryptButton").addEventListener("click", () => {
        const token = document.getElementById("tokenInput").value;

        chrome.runtime.sendMessage({
            from: "popup",
            action: "set_token",
            data: { token }
        });
    });
});