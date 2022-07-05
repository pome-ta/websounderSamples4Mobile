# 📝 2022/07/05

## `document.createEvent('Event')` 処理

ディスコンになってるので、書き換え予定

``` .js
var event = document.createEvent('Event');
event.initEvent('ended', true, true);
```

先に、読んだ後の処理を書く？

## モバイルのおまじない

現在、`click` イベントだから、`tap` にすれば解決ってことか？

# 📝 2022/07/04

## `setAppendChild` 手順

以前は、一括で`append` していたが、要素毎に`append` して、最後に塊を`append` する

## `h0` 系の font size

なんか、うまくかわらない？

~~`style.fontSize` だと変わらなかった~~

`2rem` がわかりにくかっただけ

## `setAppendChild`

親返せた方がいいかな？

# 📝 2022/07/02

## DOM 要素をインクルード

関数周りを module に、生成要素は関数でインクルード

```.js
const createElement = document.createElement;
```

これの、ショートハンドリングは

一回しか呼び出せないぞ 😡 と怒られた

## `input` の value

`value` でゴニョゴニョしてたやつ`valueAsNumber` で解決っぽい

なんなら、`step` の桁数に合わせたい？

## `EventWrapper.js`

サンプルは、即時関数でどうにかしてたけど class 化してみた

## vscode 上での`このコンストラクター関数はクラス宣言に変換される可能性があります。ts(80002)`

`this` の要素を操作しているから？(読み込みではなく、設定をしている)

`class` にするとするならば、`button` 全体を`class` にした方が良さそうだから放置

# 📝 2022/07/01

sample から、自分で要素を想定し組んでいく感じ

結局のところ、オレオレ関数使っていてどうなのかなぁといったところ

# 📝 2022/06/30

コードの管理方法など、考える必要あり

`demo00.js` として、並べていく

## サンプルコード

うーん、html の要素をこちらで想定せんとあかんね
