export function h(type, props, ...children) {
  return { type, props: { ...props, children } };
}

export function Fragment({ children }) {
  return children;
}
