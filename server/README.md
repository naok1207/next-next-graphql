```
yarn install
yarn start:dev
```

**考慮が必要な点**

- ログアウト後にも accessToken を利用してリクエストを投げるとそのまま処理ができてしまう。

**参考**
https://zenn.dev/sora_kumo/articles/4160c573a7e02c
https://zenn.dev/rince/articles/50a66241d04f0b)
https://github.com/hantsy/nestjs-graphql-sample
https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-role-based-access-control/
https://zenn.dev/mseto/articles/nest-graphql-prisma
