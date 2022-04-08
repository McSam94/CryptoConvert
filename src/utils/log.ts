export const log = (message: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`${new Date().toLocaleString()}: ${message}`);
  }
};

export const groupLog = (title: string, isEnd = false) => {
  if (process.env.NODE_ENV !== "development") return;

  if (isEnd) console.groupEnd();
  else console.group(`${new Date().toLocaleString()}: ${title}`);
};
