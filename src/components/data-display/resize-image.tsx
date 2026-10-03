'use client'

import { memo, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Props {
    src?: string | null;          // Đường dẫn ảnh (URL hoặc Base64)
    ratio?: number;              // Tỷ lệ (mặc định 16/9)
    className?: string;          // Class bổ sung cho container (VD: chỉnh độ rộng)
    alt?: string;
}

const ResizeImage = ({
    src,
    alt = "Ảnh resize",
    ratio = 16 / 9,
    className,
}: Props) => {
    const [imgErr, setImgErr] = useState<string>();
    const NoImg = "images/no-image.jpg"

    return (
        <AspectRatio ratio={ratio} className={className}>
            <img
                src={imgErr ?? src ?? NoImg}
                alt={alt}
                onError={() => setImgErr(NoImg)}
                className="h-full w-full object-contain transition-transform duration-300"
            />
        </AspectRatio>
    )
}

export default memo(ResizeImage)