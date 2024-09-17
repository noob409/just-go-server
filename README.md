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

`trip.share.controller`: 新增共編新增及更新的功能
