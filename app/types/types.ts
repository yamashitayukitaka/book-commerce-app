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
  hashedPassword?: string | null;
}

type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  user: User;
}

type Task = {
  id: string;
  text: string;
}

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  userId?: string;
  userName?: string | null;
  productId?: string;
}

type ModalType = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export type { BookType, User, Purchase, Task, Comment, ModalType };
