import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import styles from "./styles.module.scss"

export const Ad: React.FC = () => {

    const {status, currentAdd} = useSelector((state: RootState) => state.ad);

    return (
        <div className={`${styles.ad} p-xl`}>
            {status === "loading" && <div className="loader"/>}
            {status === "failed" && <p>You can place your ad here.</p>}
            {status === "idle" && currentAdd && (
                <>
                    <h1 className="txt-lg">{currentAdd.title}</h1>
                    <p>{currentAdd.body}</p>
                </>
            )}
        </div>
    )
}
