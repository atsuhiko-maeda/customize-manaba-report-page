# customize-manaba-report-page
manabaのレポートの「提出状況（個別に採点）」のページをカスタマイズするブックマークレットです。

<img src="https://github.com/atsuhiko-maeda/customize-manaba-report-page/blob/main/screenshot.png">

### できること:
* 「提出状況（個別に採点）」のページを、チラツキなく、自動で定期的にリロードする（個々のレポートを採点後、一々リロードしなくてもよくなる）。
* 学籍番号にフィルタをかけ、表示される範囲を限定する（複数の教員で採点を分担する場合などを想定）。
* 表示対象としている学生達の提出率をリアルタイム表示。
* 個々の学生の学籍番号の横に座席番号を付与（学籍番号順に座席を指定している授業を想定）。

### 使い方：

1. 以下のコードを選択してコピーします。

   ```javascript
   javascript:(function(d,s){  s=d.createElement('script');s.src='https://atsuhiko-maeda.github.io/customize-manaba-report-page/customizeManabaReportPage.js';d.body.appendChild(s);})(document)

2. ブラウザのブックマークバーに新しいブックマークを作成します。
3. タイトルを好きな名前に設定し、URLまたはアドレスフィールドに先程コピーしたコードをペーストし、保存します。
4. その後は、manabaのレポートの「提出状況（個別に採点）」のページを開き、作成したブックマークをクリックすると、ページがカスタマイズされます。
5. ブックマークレットの動作中は、上記の画像のようにページに緑の枠が付き、ページ左上に設定のための各種UIとレポート提出率が表示されます。
6. 「学籍番号の範囲」で、表示する学籍番号を指定します。
   - 下3桁が001〜100までの学生の提出状況だけを確認したいなら、\*001〜\*100と入力します。
   - 先頭が23で始まる学生の提出状況だけを確認したいなら、23\*〜23\*と入力します。
   - \*〜\*とすれば全ての学生が表示されます。
8. 履修者数は本プログラムの仕組み上必ず入力する必要があります（manabaが五月雨式に学生のデータをダウンロードするので、何人分ダウンロードされたときにページをカスタマイズしてよいか判定するのに使用しています）。
9. 座席番号を表示したい場合には、「座席番号」の「表示」にチェックを入れ、「配列」に座席番号をカンマで区切って入力します。表示対象の学生に順に付与されます。
10. 個々の学生のページを開くには、shiftを押しながらリンクをクリックして別ウインドウで開くとよいでしょう。
11. 設定はlocalStorageに保存されるため、再度使用するときに改めて設定する必要はありません。
12. ページをリロードすれば停止できます。
    
