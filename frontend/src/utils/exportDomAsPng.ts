import html2canvas from "html2canvas";

export async function downloadElementAsPng(element: HTMLElement, filename: string): Promise<void> {
    const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
    });

    await new Promise<void>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Could not create PNG"));
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename.toLowerCase().endsWith(".png") ? filename : `${filename}.png`;
                a.click();
                URL.revokeObjectURL(url);
                resolve();
            },
            "image/png",
            1,
        );
    });
}
