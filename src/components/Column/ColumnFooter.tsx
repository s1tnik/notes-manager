import React, {Dispatch, SetStateAction, useState} from "react"
import {AiOutlineClose} from "react-icons/ai";
import {useDrop} from "react-dnd"
import {useSelector} from "react-redux"
import {v4 as uuidv4} from 'uuid';
import {setHoveredCard} from "../../app/draggingSlice"
import {useAppDispatch} from "../../app/hooks"
import {addCard} from "../../app/listsSlice";
import {RootState} from "../../app/store"
import {ItemTypes} from "../../types"
import EmptyCard from "../EmptyCard"
import styles from "./styles.module.scss"
import { ThemeContext } from "../../context/themeContext";

interface ColumnFooterProps {
    listId: string;
    setIsAddingCard: Dispatch<SetStateAction<boolean>>;
    isAddingCard: boolean;
}

export const ColumnFooter: React.FC<ColumnFooterProps> = ({listId, setIsAddingCard, isAddingCard}) => {

    const {hoveredCard, draggableCard} = useSelector((state: RootState) => (state.dragging));

    const theme = React.useContext(ThemeContext);

    const dispatch = useAppDispatch();

    const [textAreaValue, setTextAreaValue] = useState("");

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        hover: (_, monitor) => {
            dispatch(setHoveredCard({shallowCard: true, listId}))
        }
    }))

    const onAddCard = (): void => {
        dispatch(addCard({listId, card: {title: textAreaValue.trim(), id: uuidv4()}}))
        setIsAddingCard(false);
        setTextAreaValue("");
    }

    const handleOnTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value);
    }

    const handleOnCloseClick = () => {
        setIsAddingCard(false);
        setTextAreaValue("");
    }

    const handleOnBlur = () => {
        if (!textAreaValue.trim()) {
            handleOnCloseClick();
        }
    }

    return (
        <div ref={drop} className={styles.columnFooter}>
            {hoveredCard?.listId === listId && hoveredCard?.shallowCard &&
            <EmptyCard style={{height: draggableCard?.height}}/>}
            {isAddingCard ?
                <div className={`add-card-container p-md ${theme}`}>
                    <textarea className={`focus ${theme}`} onBlur={handleOnBlur} autoFocus onChange={handleOnTextAreaChange} value={textAreaValue}/>
                    <div className="actions">
                        <button className={`btn ${theme}`} disabled={!textAreaValue.trim()} onClick={onAddCard}>Add card</button>
                        <button className={`btn btn-transparent ${theme}`} onClick={handleOnCloseClick}><AiOutlineClose/></button>
                    </div>
                </div>
                : <EmptyCard onClick={() => setIsAddingCard(true)} title="+ Add new card"/>}
        </div>
    )
}


