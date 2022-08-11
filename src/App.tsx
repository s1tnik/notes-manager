import React from 'react';
import {v4 as uuidv4} from 'uuid';
import Column from './components/Column';
import EmptyCard from './components/EmptyCard';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {useSelector} from 'react-redux';
import {RootState} from './app/store';
import {useAppDispatch} from './app/hooks';
import {addList} from './app/listsSlice';

function App() {

    const lists = Object.entries(useSelector((state: RootState) => state.lists)).map(([id, list]) => ({id, ...list}))
    const dispatch = useAppDispatch();

    const onAddList = (): void => {
        dispatch(addList({id: uuidv4(), cards: [], name: uuidv4()}))
    }


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="wrapper">
                <div className="cards-container">
                    {!!lists.length && lists.map((list, index) => <Column key={list.id} list={list} index={index}/>)}
                    <EmptyCard onClick={onAddList} title="Create a new list"/>
                </div>
            </div>
        </DndProvider>
    );

}

export default App;
