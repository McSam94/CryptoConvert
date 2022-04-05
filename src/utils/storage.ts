export const storeDataLocally = (key: string, data: Object) => {
  try {
    chrome.storage.local.set({ [key]: data }, function () {
      console.log(`${key} value is stored`);
    });
  } catch (error) {
    throw new Error(`Error storing data locally: ${{ [key]: data }}`);
  }
};

export const retrieveDataLocally = (keys: string | Array<string>) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keys, function (items) {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);

        resolve(typeof keys === "string" ? items[keys] : items);
      });
    } catch (error) {
      throw new Error(`Error retrieving data locally: ${keys}`);
    }
  });
};
