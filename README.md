# 직접 만들며 배워보는 React

## jsx -> js

기본적으로 jsx/tsx를 지원합니다.
jsx 트랜스파일링(->js)은 esbuild를 통해 처리되는데요.
[커스텀 옵션](https://ko.vite.dev/guide/features#jsx)은 vite.config.js에서 설정 가능합니다.

```js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    jsx: "transform",
    jsxInject: `import { h, Fragment } from '@/libs/jsx-runtime'`,
    jsxDev: false,
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
```

### 변환 결과 확인

1. 개발 서버 실행
2. 브라우저 > 개발자 도구 > source탭
3. localhost:5173 > src 폴더 > jsx파일

<img width="792" alt="screenshot" src="https://github.com/user-attachments/assets/a1e73186-d2e5-4ba4-849f-3d6ccc9aa927" />
