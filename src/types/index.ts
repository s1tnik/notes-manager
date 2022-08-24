export interface ICard {
  title: string;
  description?: string;
  id: string;
}

export const ItemTypes = {
  LIST: "list",
  CARD: "card"
};

export interface List {
  name: string;
  cards: ICard[];
  id: string;
}

export interface Advertisement {
  id: number;
  title: string;
  body: string;
}
