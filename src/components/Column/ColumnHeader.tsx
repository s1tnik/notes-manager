import React from "react"
import styles from "./styles.module.scss"

interface ColumnHeaderProps {
    header: string;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({header}) => {
    return (
        <div className={styles.columnHeader}>
            {header}
        </div>
    )
}
