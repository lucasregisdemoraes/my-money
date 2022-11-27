import Storage from "./storage.js";

export default {
    download: () => {
        // save backup data in a txt file
        const a = document.createElement("a")
        a.href = URL.createObjectURL(new Blob([JSON.stringify(Storage.get(), null, 2)], {
            type: "text/plain"
        }))
        a.setAttribute("download", "backup.txt");
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    },
    upload: (backup) => {
        try {
            backup = JSON.parse(backup)
        } catch (error) {
            alert(error.message)
        }

        Storage.set(backup)
    }
}