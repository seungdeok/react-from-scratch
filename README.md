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

## render
앞에서 만든 dom 객체를 실제 dom으로 변환하여 `<App />` 컴포넌트를 root(#app)에 붙여서 렌더링합니다.

### virtual dom을 실제 dom으로 바꾸는 함수
```js
/**
 * 가상DOM을 실제DOM으로 변경해줍니다.
 * @param {object} vnode
 * @returns {HTMLElement}
 */
const createDOM = (vnode) => {
  // text 처리
  if (vnode.type === "text") {
    return document.createTextNode(vnode.props.textContent);
  }

  if (typeof vnode.type === "function") {
    const componentVNode = vnode.type(vnode.props);
    return createDOM(componentVNode);
  }

  const dom = document.createElement(vnode.type);

  // props 처리
  for (const [key, value] of Object.entries(vnode.props ?? {})) {
    if (key === "style") {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        dom.style[styleKey] = styleValue;
      });
      continue;
    }

    if (key === "onClick") {
      dom.addEventListener("click", value);
      continue;
    }

    dom.setAttribute(key, value);
  }

  // children 처리
  vnode.children?.forEach((child) => {
    dom.appendChild(createDOM(child));
  });

  return dom;
};

```

### 실제 dom을 render하는 함수
```js
/**
 * 실제 dom을 렌더링합니다.
 */
const _render = () => {
  _container.innerHTML = "";
  _container.appendChild(createDOM(_vnode));
};
```

### 컴포넌트를 root(#app)에 붙이는 함수
```js
/**
 * container에 element를 렌더링합니다.
 * @param {object} element
 * @param {HTMLElement} container
 */
export const render = (element, container) => {
  _container = container;
  _vnode = element;
  _render();
};
```

### index.html에 명세된 Render의 entry 파일(main.jsx)을 설정
```jsx
import * as React from "./libs/react";
import App from "./App";

React.render(<App />, document.getElementById("app"));
```