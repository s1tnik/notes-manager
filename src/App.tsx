import React, {useEffect, useState} from 'react';
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
import {AiOutlineClose} from 'react-icons/ai';
import Ad from './components/Ad';
import {fetchAdById, resetAd, resetadvertisementState} from './app/advertisement';
import {ThemeContext} from './context/themeContext';

function App() {

    const {
        lists,
        usedAdvertisemens
    } = useSelector((state: RootState) => ({lists: Object.entries(state.lists).map(([id, list]) => ({id, ...list})), ...state.ad}))

    const dispatch = useAppDispatch();

    const theme = React.useContext(ThemeContext);

    const [textAreaValue, setTextAreaValue] = useState("");
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    useEffect(() => {

        if (usedAdvertisemens.length === 100) {
            dispatch(resetadvertisementState())
        }

        let randomId = Math.floor(Math.random() * 101);

        while (!usedAdvertisemens.includes(randomId)) {
            randomId = Math.floor(Math.random() * 101)
        }

        // @ts-ignore
        dispatch(fetchAdById(randomId))

        return () => {
            dispatch(resetAd())
        }

    }, []);

    const onAddList = (): void => {
        dispatch(addList({id: uuidv4(), cards: [], name: textAreaValue.trim()}))
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
        if (!textAreaValue.trim()) {
            handleOnCloseClick();
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <DndWrapper>
                <div className="cards-container">
                    {!!lists.length && lists.map((list, index) => <Column key={list.id} list={list} index={index}/>)}
                    {isAddingColumn ?
                        <div className={`add-card-container p-md ${theme}`}>
                            <textarea className={`focus ${theme}`} onBlur={handleOnBlur} autoFocus
                                      onChange={handleOnTextAreaChange}
                                      value={textAreaValue}/>
                            <div className="actions">
                                <button className={`btn ${theme}`} disabled={!textAreaValue.trim()}
                                        onClick={onAddList}>Add list
                                </button>
                                <button className={`btn btn-transparent ${theme}`} onClick={handleOnCloseClick}>
                                    <AiOutlineClose/>
                                </button>
                            </div>
                        </div>
                        : <EmptyCard onClick={() => setIsAddingColumn(true)} title="Create a new list"/>}
                </div>
                <Ad/>
            </DndWrapper>
        </DndProvider>
    );

}

export default App;


