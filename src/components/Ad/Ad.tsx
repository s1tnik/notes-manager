import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {fetchAdById, resetadvertisementState} from "../../app/advertisement";
import {useAppDispatch} from "../../app/hooks";
import {RootState} from "../../app/store";
import styles from "./styles.module.scss"

export const Ad: React.FC = () => {

    const {status, currentAdd, usedAdvertisemens} = useSelector((state: RootState) => state.ad);
    const dispatch = useAppDispatch();

    useEffect(() => {

        if (usedAdvertisemens.length === 100) {
            dispatch(resetadvertisementState())
        }

        let randomId = Math.floor(Math.random() * 101);

        // @ts-ignore
        dispatch(fetchAdById(randomId))
    }, []);

    return (
        <div className={`${styles.ad} bg-light p-xl`}>
            {status === "loading" && <div className="loader"/>}
            {status === "failed" && <p>You can place your ad here.</p>}
            {status === "idle" && currentAdd && (
                <>
                    <h1>{currentAdd.title}</h1>
                    <p>{currentAdd.body}</p>
                </>
            )}
        </div>
    )
}
