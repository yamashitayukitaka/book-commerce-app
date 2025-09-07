type BookType = {
  id: string;
  title: string;
  author: string;
  price: number;
  thumbnail: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
  content: string;
  publishedAt: string;
};


type User = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id: string;
}

type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  user: User;
}

export type { BookType, User, Purchase };
