import { ReactNode } from "react";

export default function ContainerBlock({children}: {children: ReactNode}) {
    return (
        <main>{children}</main>
    )
}