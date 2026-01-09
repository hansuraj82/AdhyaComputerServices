export const uploadFile = async (file) => {
    // ✅ Validate file type
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
        // throw new Error("Unsupported file type");
        throw new Error("Only JPG, PNG, JPEG and PDF files are allowed.");
    }

    // ✅ Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        throw new Error("File too large (max 10MB)");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_PRESET
    );

    const isPdf = file.type === "application/pdf";

    const endpoint = isPdf
        ? "raw/upload"   // 🔥 FORCE RAW FOR PDF
        : "auto/upload"; // ✅ AUTO FOR IMAGES

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/${endpoint}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error("Cloudinary upload failed");
    }

    return await res.json();
};