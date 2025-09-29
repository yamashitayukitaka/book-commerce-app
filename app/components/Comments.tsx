'use client'
import React, { useRef, useEffect, useState, } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { Comment, User } from "@/app/types/types";

// 投稿用
const postComment = async (content: string | undefined, productId: string | undefined, userName: string | null | undefined) => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, userName }),
  });
  return res.json();
}

// 編集用
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

// 削除用
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
  user: User | null | undefined;
};

const CommentCreate = ({ params, user }: CommentProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const userId = user?.id;
  const userName = user?.name;


  // 取得用
  if (!params.id) return;
  const fetchData = async () => {
    const data = await getComment(params.id);
    const sortedComments = data.post.sort(
      (a: Comment, b: Comment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setComments(sortedComments);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);


  // 編集用
  const [editedTexts, setEditedTexts] = useState<{ [key: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  // 入力変更時
  const handleChange = (commentId: string, value: string) => {
    setEditedTexts((prev) => ({ ...prev, [commentId]: value }));
  };

  // 編集実行
  const handleEditOn = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    setEditingId(commentId);
  }

  const handleEdit = async (commentId: string) => {
    const inputText = editedTexts[commentId];
    if (!inputText) return;

    const updated = await editComment(inputText, params.id, commentId);
    toast.success("編集が完了しました！");

    // コメント配列を順番そのままに更新
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? updated.comment : c))
    );

    // 入力を空にリセット
    setEditedTexts((prev) => ({ ...prev, [commentId]: "" }));
    setEditingId(null);
  };


  // 投稿用
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    if (userId) {
      e.preventDefault();
      // toast.loading('投稿中です...')
      await postComment(contentRef.current?.value, params.id, userName);
      toast.success('コメントが完了しました！')
      fetchData();
    } else {
      e.preventDefault();
      alert('ログインが必要です')
    }
    if (contentRef.current) {
      contentRef.current.value = "";
      // 投稿後にテキストエリアをクリア
    }
  };

  const onChangeAlert = () => {
    if (!userId) {
      alert('ログインが必要です')
    }
  }


  // 削除用
  const handleDelete = async (commentId: string | undefined) => {
    await deleteComment(params.id, commentId);
    toast.success('削除が完了しました！')
    fetchData();
  };

  return (
    <>
      <div className="mb-[50px]">
        {comments.map((comment) => (
          <div className="flex gap-[50px] items-center" key={comment.id}>
            <div className='w-full mb-[15px]'>
              <div className='flex gap-[10px]'>
                <p className=" text-slate-200">{comment.userName}</p>
                <p className="text-sm text-gray-500 mb-[5px]">
                  投稿日: {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!(editingId === comment.id) && <p className=" text-slate-200 w-3/5 mb-[14px] max-[768px]:w-full">{comment.content}</p>}
              {userName && userName === comment.userName && (
                <>
                  {editingId === comment.id ? (
                    <>
                      <textarea
                        autoFocus
                        onChange={(e) => handleChange(comment.id, e.target.value)}
                        className="px-4 py-2 w-3/5 my-2 bg-[rgb(11,_23,_39,_0.9)]  text-slate-200 block"

                      />

                      <button onClick={(e) => {
                        e.preventDefault();
                        handleEdit(comment.id);
                      }} className=" text-slate-200  h-[46px]  hover:opacity-70">
                        ・保存する
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleEditOn(e, comment.id)}
                      className=" text-slate-200  hover:opacity-70"
                    >
                      ・編集する
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className=" text-slate-200  hover:opacity-70"
                  >
                    ・削除する
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Toaster />
      <div className="w-full">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className=" text-slate-200 p-3 w-full text-left">コメントする</p>
          <form onSubmit={handleSubmit} className='w-full flex gap-[50px] items-center max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[10px]'>
            <textarea
              ref={contentRef}
              placeholder="コメントを入力"
              className="px-4 py-2 w-3/5 my-2 bg-[rgb(11,_23,_39,_0.9)]  text-slate-200 max-[768px]:w-full"
              onChange={onChangeAlert}
            ></textarea>
            <button className=" text-slate-200 px-[20px] h-[46px] border border-[rgba(255,255,255,0.7)] hover:opacity-70 max-[768px]:margin-right: auto;">
              投稿する →
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CommentCreate;
