export interface Account {
  userid: string;
  username: string;
  avatar: string;
  globalName: string;
  accessToken: string;
}

export const createBackdrop = () => {
  const div = document.createElement('div');
  div.className = 'flex flex-col items-center justify-center min-h-screen bg-gray-100 text-align-center';
  return div;
};

export const createWelcomeMessage = () => {
  const welcome = document.createElement('div');
  welcome.className = 'text-center';
  welcome.innerHTML = '<h1 class="text-2xl">Welcome to Delaborio!</h1>Please log in to start playing!<br/>';
  return welcome;
};

export const createWrapper = (...elements: Node[]) => {
  const wrapper = document.createElement('div');
  elements.forEach(element => wrapper.appendChild(element));
  return wrapper;
}

export const createNode = (tag: string, className: string, text: string) => {
  const node = document.createElement(tag);
  node.className = className;
  node.innerHTML = text;
  return node;
}