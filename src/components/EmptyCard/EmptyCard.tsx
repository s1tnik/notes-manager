import React, { CSSProperties } from "react";
import styles from "./styles.module.scss"

interface EmptyCardProps {
    title?: string
    onClick?: () => void;
    style?: CSSProperties;
}

export const EmptyCard: React.FC<EmptyCardProps> = ({title, onClick, style}) => {

    return (
        <div style={style} onClick={() => onClick && onClick()} className={`${styles.emptyCard} p-xl`}>
            {title && <p className="title">{title}</p>}
        </div>
    )
}
