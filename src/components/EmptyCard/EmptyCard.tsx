import React, { CSSProperties } from "react";
import { ThemeContext } from "../../context/themeContext";
import styles from "./styles.module.scss";

interface EmptyCardProps {
  title?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export const EmptyCard: React.FC<EmptyCardProps> = ({ title, onClick, style }) => {
  const theme = React.useContext(ThemeContext);

  return (
    <div
      style={style}
      onClick={() => onClick && onClick()}
      className={`${styles.emptyCard} ${styles[theme]} p-xl`}>
      {title && <p className="title">{title}</p>}
    </div>
  );
};
