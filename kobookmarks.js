const fs = require("fs");
const util = require("util");
// const bookmarks = require("./bookmark");
const Database = require("better-sqlite3");

const appendFile = util.promisify(fs.appendFile);

const groupBooks = async (rows) => {
  const books = {};

  rows.map((d) => {
    if (d.VolumeID in books) {
      books[d.VolumeID].push({
        annotation: d.Annotation,
        text: d.Text,
      });
    } else {
      books[d.VolumeID] = [];
      books[d.VolumeID].push({
        annotation: d.Annotation,
        text: d.Text,
      });
    }
  });
  return books;
};

const createMd = (bjson) => {
  bjson.then((bookmark) => {
    for (const [k, v] of Object.entries(bookmark)) {
      v.map(async (t) => {
        await appendFile(
          `booknotes/${k.replace("file:///mnt/onboard/", "")}.txt`,
          `- ${t.text} \r\n`
        );
      });
    }
  });
};

const getBookmarksFromDB = () => {
  const db = new Database("KoboReader_Jan172022.sqlite");
  const row = db
    .prepare("SELECT Text, Annotation,VolumeID FROM Bookmark")
    .all();

  const booksJSON = groupBooks(row);
  createMd(booksJSON);
};

getBookmarksFromDB();
