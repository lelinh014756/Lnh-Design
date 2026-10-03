import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

// Định nghĩa Typography chuẩn theo bộ style của shadcn/ui
const titleVariants = cva(
  "scroll-m-20 tracking-tight text-foreground", // Các thuộc tính dùng chung
  {
    variants: {
      level: {
        1: "text-4xl mb-4 font-extrabold",
        2: "pb-2 text-3xl font-semibold first:mt-0",
        3: "text-2xl font-semibold",
        4: "text-xl font-semibold",
        5: "text-lg font-semibold",
        6: "text-base font-semibold",
      },
    },
    defaultVariants: {
      level: 1,
    },
  }
)

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof titleVariants> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  isSpan?: boolean;
  asChild?: boolean; // Cho phép bọc vào một thẻ khác (giống các component shadcn khác)
}

const AppTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, level = 1, isSpan, asChild = false, ...props }, ref) => {
    // Render linh hoạt thẻ h1 -> h6 dựa vào biến level.
    // Nếu asChild = true, nó sẽ sử dụng thẻ do component con truyền vào.
    const Comp: any = asChild ? Slot : ((isSpan ? 'span' : `h${level}`) as React.ElementType)

    return (
      <Comp
        ref={ref}
        className={cn(titleVariants({ level, className }))}
        {...props}
      />
    )
  }
)

export default AppTitle;