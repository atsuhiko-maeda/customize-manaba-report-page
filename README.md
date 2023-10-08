# customize-manaba-report-page
manabaのレポートの「提出状況（個別に採点）」のページをカスタマイズするブックマークレットです。


できること：
* 個々のレポートを採点後、「提出状況（個別に採点）」のページを一々リロードしなくても、チラツキなく、自動でリロードする。
* 学籍番号にフィルタをかけて表示される範囲を限定する（複数の教員で採点を分担する場合などを想定）。
* 表示対象としている学生達の提出率をリアルタイム表示。
* 個々の学生の学籍番号の横に座席番号を付与（学籍番号順に座席を指定している授業を想定）。

使い方：
* 下記のURLをブックマークツールバーにドラッグしてください。
  ** [customize-manaba-report-page](javascript:(function(d,s){  s=d.createElement('script');s.src='https://atsuhiko-maeda.github.io/customize-manaba-report-page/customizeManabaReportPage.js';d.body.appendChild(s);})(document))
* その後は、manabaのレポートの「提出状況（個別に採点）」のページを開き、ブックマークをクリックすると、ページがカスタマイズされます。
* ページをリロードすれば停止できます。
