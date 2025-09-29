import { BookType } from '@/app/types/types';
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});
export const getAllBook = async () => {
  const allbooks = await client.getList<BookType>({
    endpoint: 'bookcommerce',
  });
  return allbooks;
};

export const getDetailBooks = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: 'bookcommerce',
    contentId,
  });
  return detailBook;
};

