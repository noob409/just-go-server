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

`trip.controller`: 修改所有的function並新增建立行程、景點收藏功能，並建議將trip.ts loadTripsByMe的路由改成/api/trips/users/開頭

`user.controller`: 修改avatar相關，目前測試可以正常向後端請求圖片，建議前端Vite.config的proxy新增下方程式碼，方可正常運行
    "/uploads": {
        target: "http://localhost:80",
        changeOrigin: true,
    },

`trip.share.controller`: 新增 加入共編及更新的功能

## 待更改的部分

`auth.controller`: 如果要修改的話，前端會比較複雜，因為也會動到頁面邏輯。

第一次使用google登入的話，必須強迫設定密碼，爾後，登入就可以使用google或是表單登入。

第一次使用表單註冊的話，如果通過驗證信的話，爾後，google登入也會成功。
但如果沒通過驗證信的話，且又使用google登入的話，我的想法是直接設定驗證通過就沒問題；如果又用表單註冊的話，應該就允許他重新註冊或是重發驗證信，我個人prefer later。