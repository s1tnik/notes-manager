import React, { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import Column from './components/Column';
import EmptyCard from './components/EmptyCard';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {useSelector} from 'react-redux';
import {RootState} from './app/store';
import {useAppDispatch} from './app/hooks';
import {addList} from './app/listsSlice';
import DndWrapper from './components/DndWrapper';
import { AiOutlineClose } from 'react-icons/ai';

function App() {

    const lists = Object.entries(useSelector((state: RootState) => state.lists)).map(([id, list]) => ({id, ...list}))
    const dispatch = useAppDispatch();

    const [textAreaValue, setTextAreaValue] = useState("");
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const onAddList = (): void => {
        dispatch(addList({id: uuidv4(), cards: [], name: textAreaValue}))
        setIsAddingColumn(false);
        setTextAreaValue("");
    }

    const handleOnTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value);
    }

    const handleOnCloseClick = () => {
        setIsAddingColumn(false);
        setTextAreaValue("");
    }

    const handleOnBlur = () => {
        if (!textAreaValue) {
            handleOnCloseClick();
        }
    }



    return (
        <DndProvider backend={HTML5Backend}>
            <DndWrapper>
                <div className="cards-container">
                    {!!lists.length && lists.map((list, index) => <Column key={list.id} list={list} index={index}/>)}
                    {isAddingColumn ?
                        <div className="add-card-container">
                            <textarea onBlur={handleOnBlur} autoFocus onChange={handleOnTextAreaChange} value={textAreaValue}/>
                            <div className="actions">
                                <button disabled={!textAreaValue} onClick={onAddList}>Add list</button>
                                <button onClick={handleOnCloseClick}><AiOutlineClose/></button>
                            </div>
                        </div>
                        : <EmptyCard onClick={() => setIsAddingColumn(true)} title="Create a new list"/>}
                </div>
            </DndWrapper>
        </DndProvider>
    );

}

export default App;


