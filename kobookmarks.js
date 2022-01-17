const fs = require("fs");
const util = require("util");
const bookmarks = require("./bookmark");

const appendFile = util.promisify(fs.appendFile);

const groupBooks = () => {
  const books = {};

  bookmarks.map((d) => {
    if (d.VolumeID in books) {
      books[d.VolumeID].push({
        annotation: d.Annotation,
        text: d.Text,
      });
    } else {
      books[d.VolumeID] = [];
    }
  });
  return books;
};

const createMd = (books) => {
  for (const [k, v] of Object.entries(books)) {
    v.map(async (t) => {
      await appendFile(
        `booknotes/${k.replace("file:///mnt/onboard/", "")}.txt`,
        `- ${t.text}`
      );
    });
  }
};

const booksJSON = groupBooks();
createMd(booksJSON);
