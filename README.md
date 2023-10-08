# customize-manaba-report-page
manabaのレポートの「提出状況（個別に採点）」のページをカスタマイズするブックマークレットです。


できること：
* 「提出状況（個別に採点）」のページを、チラツキなく、自動で定期的にリロードする（個々のレポートを採点後、一々リロードしなくてもよくなる）。
* 学籍番号にフィルタをかけ、表示される範囲を限定する（複数の教員で採点を分担する場合などを想定）。
* 表示対象としている学生達の提出率をリアルタイム表示。
* 個々の学生の学籍番号の横に座席番号を付与（学籍番号順に座席を指定している授業を想定）。

使い方：
### ブックマークレットのインストール方法

1. 以下のコードを選択してコピーします。

   ```javascript
   javascript:(function(d,s){  s=d.createElement('script');s.src='https://atsuhiko-maeda.github.io/customize-manaba-report-page/customizeManabaReportPage.js';d.body.appendChild(s);})(document)

2. ブラウザのブックマークバーに新しいブックマークを作成します。
3. タイトルを好きな名前に設定し、URLまたはアドレスフィールドに先程コピーしたコードをペーストし、保存します。
4. その後は、manabaのレポートの「提出状況（個別に採点）」のページを開き、ブックマークをクリックすると、ページがカスタマイズされます。
5. 下記の画像のように、ブックマークレットが動作中は、ページに緑の枠が付き、左上に設定のための各種UIと提出率が表示されます。
6. ページをリロードすれば停止できます。

<img src="https://github.com/atsuhiko-maeda/customize-manaba-report-page/blob/main/screenshot.png">
