export enum Genre {
    FICTION = 'FICTION',
    NON_FICTION = 'NON_FICTION',
    SCIENCE = 'SCIENCE',
    HISTORY = 'HISTORY',
    BIOGRAPHY = 'BIOGRAPHY',
    FANTASY = 'FANTASY',
  }

exports interface IBooks
{
    title: string;
    author: string;
    genre: Genre,
    isbn: string;
    description?: string;
    copies: number;
    availability: boolean;
}