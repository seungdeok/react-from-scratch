let _container;
let _vnode;
const states = [];
let stateIndex = 0;

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

/**
 * 실제 dom을 렌더링합니다.
 */
const _render = () => {
  stateIndex = 0;
  _container.innerHTML = "";
  _container.appendChild(createDOM(_vnode));
};

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

/**
 * useState hook
 * @param {any} initValue
 * @returns {[any, (newValue: any) => void]}
 */
export const useState = (initValue) => {
  const state = states[stateIndex] ?? initValue;
  const _index = stateIndex;
  const setState = (newValue) => {
    states[_index] = newValue;
    _render();
  };
  stateIndex++;
  return [state, setState];
}