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

      return createTextElement(child); // 문자/숫자
    }),
  };
}

export function Fragment({ children }) {
  return children;
}
