# Just Go

`server.js`: 請註解掉9-16行.

`before npm run dev`: 請先創造一個logs folder.

## Installation

`npm i`: Install all dependencied packages.

## Development

`npm run start`: restart server using `pm2`.

`npm run monit`: monit the `pm2` dashboard.

`npm run swagger`: generate swagger document file.

`npm run sync`: sync the database models and settings.

## 更改的部分

`trip.controller`: 修改建立行程的部分，會初始化一個空的Plan - 行程在建立時，會初始化一個空的方案，方案內會再初始化一個空的Day，也就是該方案的第一天，這個Day會再初始化空一個attraction。

其他的部分請直接看trip.route.js，如果有測試過的會在那段程式碼後方加上 // Test OK，當然這也不全OK，因為我還沒詳細修改資料回傳的欄位。

路由有的看起來會很奇怪，這很正常，因為得再修改，

`/:id/getspecifictripinfo`: 取得某trip的所有方案詳細資料

`/:id/plan/addPlace`: 將景點收藏的資料加入至方案的某一天

`/:id/plan`: 取得某trip的所有plan

`/:id/plan/days`: 取得某plan的所有day

`/:id/plan/days/specificday`: 取得某day的所有attraction資料

`/:id/trip/own`: 行程管理 - 我的行程

`/:id/trip/keep`: 行程管理 - 我的收藏

## 待更改的部分

`auth.controller`: 如果要修改的話，前端會比較複雜，因為也會動到頁面邏輯(至9/24未更動)。

第一次使用google登入的話，必須強迫設定密碼，爾後，登入就可以使用google或是表單登入，前端思考中。

第一次使用表單註冊的話，如果通過驗證信的話，爾後，google登入也會成功。
但如果沒通過驗證信的話，且又使用google登入的話，我的想法是直接設定驗證通過就沒問題；如果又用表單註冊的話，應該就允許他重新註冊。