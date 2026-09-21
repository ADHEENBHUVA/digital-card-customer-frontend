export const handleQRShare = async (url) => {
    try {
        const originalSvg = document.getElementById("qr-code-svg");
        if (!originalSvg) throw new Error("QR Code not found");

        const svg = originalSvg.cloneNode(true);
        svg.setAttribute("width", "1000");
        svg.setAttribute("height", "1000");

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
            img.onload = () => {
                const padding = 100;
                canvas.width = img.width + (padding * 2);
                canvas.height = img.height + (padding * 2);
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, padding, padding);
                resolve();
            };
            img.onerror = reject;
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        });

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'digital-card-qr.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'Digital Card QR',
                text: 'Scan this QR code to view my Digital Card!',
                files: [file],
                url: url,
            });
        } else if (navigator.share) {
            await navigator.share({
                title: 'Digital Card',
                text: 'Check out my Digital Card!',
                url: url,
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    } catch (error) {
        console.error('Error sharing QR code:', error);
        if (navigator.share) {
            navigator.share({ title: 'Digital Card', url: url }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    }
};
