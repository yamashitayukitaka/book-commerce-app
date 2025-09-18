'use client'
import React, { useRef, useEffect, useState, use } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { Comment } from "@/app/types/types";


// 投稿用
const postComment = async (content: string | undefined, productId: string | undefined) => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${productId}`, {
    method: "POST",
    // method: "POST",の記述で同一のエンドポイント上にあるconst POSTと const GETのどちら側の関数にアクセスするか判別している
    // fetch() の method を省略した場合は GET リクエストとして送信されるので、
    // Next.js のエンドポイント内に定義された const GET 関数にアクセスして実行されます。
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }), // 送信するデータをJSON形式に変換してリクエストボディに含める
  });
  return res.json();
}


const editComment = async (content: string | undefined, productId: string | undefined, commentId: string | undefined) => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${productId}/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}



// 取得用
const getComment = async (productId: string | undefined) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${productId}`);
  return res.json();
}


const deleteComment = async (productId: string | undefined, commentId: string | undefined) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${productId}/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

type CommentProps = {
  params: {
    id: string;
  };
};

const CommentCreate = ({ params }: CommentProps) => {
  const [comments, setComments] = useState<Comment[]>([]);


  // 取得用
  if (!params.id) return;
  const fetchData = async () => {
    const data = await getComment(params.id);
    setComments(data.post); // ← APIから返ってきた { post: [...] } の形に対応
  };
  useEffect(() => {
    fetchData();
  }, [params.id]);


  // 編集用
  const [editedTexts, setEditedTexts] = useState<{ [key: string]: string }>({});

  // 入力変更時
  const handleChange = (commentId: string, value: string) => {
    setEditedTexts((prev) => ({ ...prev, [commentId]: value }));
  };

  // 編集実行
  const handleEdit = async (commentId: string) => {
    const inputText = editedTexts[commentId];
    if (!inputText) return;

    const updated = await editComment(inputText, params.id, commentId); // ←ここで受け取る

    toast.success("編集が完了しました！");

    // コメント配列を順番そのままに更新
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? updated.comment : c))
    );

    // 入力を空にリセット
    setEditedTexts((prev) => ({ ...prev, [commentId]: "" }));
  };


  // 投稿用
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // toast.loading('投稿中です...')
    await postComment(contentRef.current?.value, params.id);
    toast.success('コメントが完了しました！')
    fetchData();
    if (contentRef.current) {
      contentRef.current.value = "";
      // 投稿後にテキストエリアをクリア
    }
  };


  // 削除用
  const handleDelete = async (commentId: string | undefined) => {
    await deleteComment(params.id, commentId);
    toast.success('削除が完了しました！')
    fetchData();
  };

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit(comment.id);
            }}
          >
            <input
              value={editedTexts[comment.id] ?? ""}
              onChange={(e) => handleChange(comment.id, e.target.value)}
              className="mr-2 py-1 px-2 rounded border-gray-400 border"
            />
            <button className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100">
              編集
            </button>
          </form>
          <p className="text-sm text-gray-500">
            投稿日: {new Date(comment.createdAt).toLocaleDateString()}
          </p>
          <button
            onClick={() => handleDelete(comment.id)}
            className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
          >
            削除
          </button>
        </div>
      ))}

      <Toaster />
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">ブログ新規作成 🚀</p>
          <form onSubmit={handleSubmit}>

            <textarea
              ref={contentRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2 bg-slate-200"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              投稿
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CommentCreate;
