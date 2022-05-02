const mongoCollections = require("../config/mongoCollections");
const clothes = mongoCollections.clothes;
const users = mongoCollections.users;
const validate = require('../validation/clothes_validation');

module.exports = {
  async addNewClothes(name, image, type, size, colorPatterns, seasons, styles, brand, user) {

    name = validate.checkTextInput(name, 'Clothing Name');
    image = validate.checkFileInput(image, 'Image');
    type = validate.checkSelectInput(type, 'Type', ['top', 'bottom', 'dress', 'shoes', 'accessory', 'outerwear', 'socks']);
    if (size) size = validate.checkTextInput(size, 'Size');
    if (!colorPatterns) colorPatterns = [];
    colorPatterns = validate.checkListInput(colorPatterns, 'Colors/Patterns');
    if (!seasons) seasons = [];
    seasons = validate.checkCheckboxInput(seasons, 'seasons', ['winter', 'spring', 'summer', 'fall']);
    if (!styles) styles = [];
    styles = validate.checkListInput(styles, 'Styles');
    if (brand) brand = validate.checkTextInput(brand, 'Brand');

    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({username: user});
    if (!userDocument) throw 'Error: User does not exists';
    let stats = userDocument.statistics;

    if (type == 'top') stats.type.tops += 1;
    else if (type == 'bottom') stats.type.bottoms += 1;
    else if (type == 'dress') stats.type.dresses += 1;
    else if (type == 'shoes') stats.type.shoes += 1;
    else if (type == 'accessory') stats.type.accessories += 1;
    else if (type == 'outerwear') stats.type.outerwear += 1;
    else if (type == 'socks') stats.type.socks += 1;

    if (colorPatterns) {
      colorPatterns.forEach(element => {
        if (stats['colors-patterns'][element]) 
          stats['colors-patterns'][element] += 1;
        else 
          stats['colors-patterns'][element] = 1;
      });
    }

    if (brand) {
      brand = brand.trim().toLowerCase();
    if (stats['brands'][brand]) 
      stats['brands'][brand] += 1;
    else 
      stats['brands'][brand] = 1;
    }

    let newClothes = {
      image: image,
      name: name,
      type: type,
      "colors-patterns": colorPatterns,
      season: seasons,
      style: styles,
      brand: brand
    };

    const clothesCollection = await clothes();
    const insertInfo = await clothesCollection.insertOne(newClothes);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: Failed to add new Clothing Item";

    const updateInfo = await usersCollection.updateOne(
      { username: user },
      {
        $push: {
          userClothes: insertInfo.insertedId,
        },
        $set: {
          statistics: stats,
        },
      }
    );

    if (updateInfo.matchedCount == 0 || updateInfo.modifiedCount == 0)
      throw "Error: Failed to update user";
    return {result: 'success'};
  },
  async getClothingItems(user) {
    let clothingItems = [];
    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({ username: user });
    if (userDocument) {
      const clothesCollection = await clothes();
      for (let id of userDocument.userClothes) {
        let clothesDocument = await clothesCollection.findOne({ _id: id });
        if (clothesDocument) clothingItems.push(clothesDocument);
      }
    }
    return clothingItems;
  },
  async getClothingbyIds(ids){
    let clothingItems = []
    const clothesCollection = await clothes();
    for(let i = 0; i < ids.length; i++){
      let clothesDocument = await clothesCollection.findOne({_id: ids[i]});
      if (clothesDocument) clothingItems.push(clothesDocument);
    }
    return clothingItems
  }

};
