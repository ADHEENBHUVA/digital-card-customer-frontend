export const handleQRShare = async (url) => {
    try {
        const svg = document.getElementById("qr-code-svg");
        if (!svg) throw new Error("QR Code not found");

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
            img.onload = () => {
                canvas.width = img.width + 40;
                canvas.height = img.height + 40;
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 20, 20);
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
