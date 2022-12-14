import React, { useState, Dispatch, SetStateAction } from "react";
import { AiOutlineEllipsis, AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import Popup from "reactjs-popup";
import { useAppDispatch } from "../../app/hooks";
import { addList, removeList } from "../../app/listsSlice";
import { RootState } from "../../app/store";
import styles from "./styles.module.scss";
import { ThemeContext } from "../../context/themeContext";

interface ColumnHeaderProps {
  header: string;
  listId: string;
  setIsAddingCard: Dispatch<SetStateAction<boolean>>;
}

enum ActionsEnum {
  INITIAL = "INITIAL",
  COPY_LIST = "COPY_LIST",
  DELETE_LIST = "DELETE_LIST"
}

type CloseFunction = () => void;

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ header, listId, setIsAddingCard }) => {
  const dispatch = useAppDispatch();
  const list = useSelector((state: RootState) => state.lists[listId]);

  const theme = React.useContext(ThemeContext);

  const [currentAction, setCurrentAction] = useState<ActionsEnum>(ActionsEnum.INITIAL);
  const [textAreaValue, setTextAreaValue] = useState(list.name);

  const handleClickOnCopyList = (close: CloseFunction) => {
    dispatch(
      addList({
        ...list,
        id: uuidv4(),
        cards: list.cards.map((card) => ({ ...card, id: uuidv4() })),
        name: textAreaValue
      })
    );
    close();
  };

  const handleClickOnAddCard = (close: CloseFunction) => {
    setIsAddingCard(true);
    close();
  };

  const handleClickOnDeleteList = () => {
    dispatch(removeList(listId));
  };

  const handleOnTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
  };

  const onMenuClose = () => {
    setCurrentAction(ActionsEnum.INITIAL);
    setTextAreaValue(list.name);
  };

  return (
    <div className={`${styles.columnHeader} ${styles[theme]} p-xl`}>
      {header}
      <Popup
        trigger={
          <button>
            <AiOutlineEllipsis />
          </button>
        }
        position="bottom left"
        closeOnDocumentClick
        arrow={false}
        on="click"
        onClose={onMenuClose}>
        {/*@ts-ignore*/}
        {(close) => (
          <>
            {currentAction === ActionsEnum.INITIAL && (
              <div className={`${styles.menu} ${styles[theme]}`}>
                <div className="menu-item p-md">
                  <span />
                  <p>List actions</p>
                  <span onClick={close}>
                    <AiOutlineClose />
                  </span>
                </div>
                <div onClick={() => handleClickOnAddCard(close)} className="menu-item p-md">
                  Add card
                </div>
                <div
                  onClick={() => setCurrentAction(ActionsEnum.COPY_LIST)}
                  className="menu-item p-md">
                  Copy list
                </div>
                <div
                  onClick={() => setCurrentAction(ActionsEnum.DELETE_LIST)}
                  className="menu-item p-md">
                  Delete list
                </div>
              </div>
            )}
            {currentAction === ActionsEnum.COPY_LIST && (
              <div className={`${styles.menu} ${styles[theme]}`}>
                <div className="menu-item p-md">
                  <span onClick={() => setCurrentAction(ActionsEnum.INITIAL)}>
                    <AiOutlineLeft />
                  </span>
                  <p>Copy list</p>
                  <span onClick={close}>
                    <AiOutlineClose />
                  </span>
                </div>
                <div className="text-area p-md">
                  <textarea
                    className={`focus ${theme}`}
                    autoFocus
                    onChange={handleOnTextAreaChange}
                    value={textAreaValue}
                  />
                  <button
                    className={`btn ${theme}`}
                    disabled={!textAreaValue}
                    onClick={() => handleClickOnCopyList(close)}>
                    Copy list
                  </button>
                </div>
              </div>
            )}
            {currentAction === ActionsEnum.DELETE_LIST && (
              <div className={`${styles.menu} ${styles[theme]}`}>
                <div className="menu-item p-md">
                  <span onClick={() => setCurrentAction(ActionsEnum.INITIAL)}>
                    <AiOutlineLeft />
                  </span>
                  <p>Delete list</p>
                  <span onClick={close}>
                    <AiOutlineClose />
                  </span>
                </div>
                <div className="text-area p-md">
                  <p>Are you sure you want to delete &quot;{list.name}&quot; list?</p>
                  <button className={`btn ${theme}`} onClick={handleClickOnDeleteList}>
                    Delete list
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Popup>
    </div>
  );
};
