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


## text element 변환 
```jsx
export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
```

### 변환 결과 확인

```json
  // div는 children에 객체가 들어갑니다.
  h("div", null, [h("h1", null, "Hello World"))]);
  // h1의 경우 chilren에 text가 들어갑니다.
  h("h1", null, "Hello World"))
```

### jsx 변환
text의 경우에 임의로 포맷 통일(`createTextElement`)시켜주어 일관성있게 노출시킬 수 있도록 해보았습니다.

```js
function createTextElement(text) {
  return {
    type: "text",
    props: {
      textContent: text,
    },
    children: [],
  };
}

export function h(type, props, ...children) {
  console.log("h", type, props, children);
  return {
    type,
    props,
    children: children.map((child) => {
      if (typeof child === "object") {
        return child;
      }

      return createTextElement(child);
    }),
  };
}
```