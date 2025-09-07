==================================================================================
通常の await は「一つの非同期処理が終わるまで待つ」ので直列処理になりますが、

for (const purchaseBook of purchasesData) {
  const book = await getDetailBooks(purchaseBook.bookId)
  // → ここで毎回待つので逐次処理になる
}

この場合、処理時間は getDetailBooks の実行時間 × 件数 になります。
一方で Promise.all を使うと、まず Promise の配列をまとめて作り、全部同時に実行してから一括で待つことができます。


==================================================================================
const detailedBooks = await Promise.all(
  purchasesData.map((purchaseBook: Purchase) => getDetailBooks(purchaseBook.bookId))
);


map 内で getDetailBooks(...) が呼ばれた時点で 全ての Promise が生成され非同期処理が走る
Promise.all([...]) に渡すと、それらが 並列に進む
await は「全部終わるまで待つ」という意味になる
そのため、処理全体の時間は 最も遅い1件分の処理時間とほぼ同じ に短縮されます。

==================================================================================

まとめると：

await 単体 → 逐次処理（直列）

await Promise.all([...]) → 並列処理（同時実行）

👉 補足ですが、もし1件でもエラーが出ると Promise.all は即座に reject されます。
「失敗したものはスキップして成功分だけ取りたい」場合は Promise.allSettled を使う方が安全です。
==================================================================================