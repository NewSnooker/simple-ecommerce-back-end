const uuidv4 = require("uuid");
const sharp = require("sharp");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const config = require("../config/index");

let storage;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const cd = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  storage = new Storage({
    projectId: cd.project_id,
    credentials: cd,
  });
  console.log("production");
} else {
  storage = new Storage({
    projectId: config.PROJECT_ID,
    keyFilename: path.resolve(`./${config.GOOGLE_KEY_FILE_NAME}.json`),
  });
  //   console.log("dev");
}

const bucket = storage.bucket(config.BUCKET);

exports.saveImageToGoogle = async function (file) {
  if (!file) {
    throw new Error("ไม่พบไฟล์ที่จะอัพโหลด");
  }
  const fileName = `${uuidv4.v4()}.webp`;
  const buffer = await sharp(file.buffer)
    .resize(800, 600)
    .webp({ quality: 90 })
    .toBuffer();
  const googleFile = bucket.file(fileName);

  try {
    await googleFile.save(buffer, {
      // gzip: true,
      metadata: {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000",
      },
      public: true,
      validation: "md5",
    });
    console.log("อัพโหลดไฟล์สําเร็จ : ", fileName);
    return fileName;
  } catch (error) {
    console.log("อัพโหลดไฟล์ไม่สําเร็จ : ", error);
    throw error;
  }
};
